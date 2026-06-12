import constants = require('../.constants.js');
import driveAuth = require('./drive-auth.js');
import {google} from 'googleapis';
import utils = require('./drive-utils');
import dlUtils = require('../download_tools/utils');

/**
 * Searches for a given file on Google Drive. Only search the subfolders and files
 * of the folder that files are uploaded into. This function only performs performs
 * prefix matching, though it tries some common variations.
 * @param {string} fileName The name of the file to search for
 * @param {function} callback A function to call with an error, or a human-readable message
 */
export function listFiles (fileName:string, callback:(err:string, message:string)=> void): void {
  driveAuth.call((err, auth) => {
    if (err) {
      callback(err, null);
      return;
    }
    const drive = google.drive({version: 'v3', auth});

    drive.files.list({
      // @ts-ignore Unknown property error
      fields: 'files(id, name, mimeType, size)',
      q: generateSearchQuery(fileName, constants.GDRIVE_PARENT_DIR_ID),
      orderBy: 'modifiedTime desc',
      pageSize: 20,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true
    },
    (err:Error, res:any) => {
      if (err) {
        callback(err.message, null);
      } else {
        res = res['data']['files'];
        getMultipleFileLinks(res);
        callback(null, generateFilesListMessage(res));
      }
    });
  });
}

export function generateSearchQuery (fileName:string, parent:string): string {
  const safeFileName = fileName.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
  const safeParent = parent.replace(/\\/g, '\\\\').replace(/'/g, '\\\'');

  var q = '\'' + safeParent + '\' in parents and (';
  if (safeFileName.indexOf(' ') > -1) {
    let currentFileName = safeFileName;
    for (var i = 0; i < 4; i++) {
      q += 'name contains \'' + currentFileName + '\' ';
      switch (i) {
        case 0:
          currentFileName = currentFileName.replace(/ /g, '.');
          q += 'or ';
          break;
        case 1:
          currentFileName = currentFileName.replace(/\./g, '-');
          q += 'or ';
          break;
        case 2:
          currentFileName = currentFileName.replace(/-/g, '_');
          q += 'or ';
          break;
      }
    }
  } else {
    q += 'name contains \'' + safeFileName + '\'';
  }
  q += ')';
  return q;
}

function escapeHTML (str:string): string {
  if (!str) return str;
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

function getMultipleFileLinks (files:any[]): void {
  for (var i = 0; i < files.length; i++) {
    files[i]['url'] = utils.getFileLink(
      files[i]['id'],
      files[i]['mimeType'] === 'application/vnd.google-apps.folder'
    );
  }
}

export function generateFilesListMessage (files:any[]): string {
  var message = '';
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      message += '<a href = \'' + files[i]['url'] + '\'>' + escapeHTML(files[i]['name']) + '</a>';
      if (files[i]['size'])
        message += ' (' + dlUtils.formatSize(files[i]['size']) + ')\n';
      else if (files[i]['mimeType'] === 'application/vnd.google-apps.folder')
        message += ' (folder)\n';
      else
      message += '\n';

    }
  } else {
    message = 'There are no files matching your parameters';
  }
  return message;
}
