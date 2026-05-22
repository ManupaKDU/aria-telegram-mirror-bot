export function getFileLink(fileId: string, isFolder: boolean): string {
  if (isFolder) {
    return 'https://drive.google.com/drive/folders/' + fileId;
  } else {
    return 'https://drive.google.com/uc?id=' + fileId + '&export=download';
  }
}

export interface PublicUrlRequestOptions {
  size: number;
  mimeType: string;
  token: string;
  fileName: string;
  parent: string;
}

export function getPublicUrlRequestHeaders(options: PublicUrlRequestOptions): any {
  return {
    method: 'POST',
    url: 'https://www.googleapis.com/upload/drive/v3/files',
    qs: {
      uploadType: 'resumable',
      supportsAllDrives: true
    },
    headers:
    {
      'Cache-Control': 'no-cache',
      'X-Upload-Content-Length': options.size,
      'X-Upload-Content-Type': options.mimeType,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${options.token}`
    },
    body: {
      name: options.fileName,
      mimeType: options.mimeType,
      parents: [options.parent]
    },
    json: true
  };
}