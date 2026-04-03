import tar = require('tar');
import fs = require('fs');
import path = require('path');

export function archive(srcPath: string, destName: string, callback: (err: string, size: number) => void): void {
  var dlDirPath = srcPath.substring(0, srcPath.lastIndexOf('/'));
  var writeStream = fs.createWriteStream(`${dlDirPath}/${path.basename(destName)}`);
  var targetDirName = `${srcPath.substring(srcPath.lastIndexOf('/') + 1)}`;
  var size = 0;
  writeStream.on('close', () => callback(null, size));
  writeStream.on('error', (err: Error) => callback(err.message, size));

  var stream = tar.c(
    {
      // @ts-ignore Unknown property error
      maxReadSize: 163840,
      jobs: 1,
      cwd: dlDirPath
    },
    [targetDirName]
  );

  stream.on('error', (err: Error) => callback(err.message, size));
  stream.on('data', (chunk:any) => {
    size += chunk.length;
  });

  stream.pipe(writeStream);
}

