/* eslint-disable no-console */

const request = require('request');
const fs = require('fs');
const dns = require('dns');

const folderpath = '/users/jp/Pictures/bing';

function checkInternet(cb) {
  dns.lookup('google.com', (err) => {
    if (err && err.code === 'ENOTFOUND') {
      console.log('Not online');
      cb(false);
    }
    cb(true);
  });
}

function rmDir(dirPath, removeSelf) {
  let files;
  // eslint-disable-next-line no-param-reassign
  if (removeSelf === undefined) removeSelf = true;
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      const filePath = `${dirPath}/${files[i]}`;
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDir(filePath);
    }
  }
  if (removeSelf) fs.rmdirSync(dirPath);
}

function prepFolderLocation(dirPath) {
  if (fs.existsSync(dirPath)) {
    // Remove folder contents
    console.log(`Removing contents of folder: ${dirPath}`);
    rmDir(folderpath, false);
  } else {
    console.log(`Folder doesn't exist, so I made the folder: ${dirPath}`);
    fs.mkdirSync(dirPath);
  }
}

function downloadWallpaper() {
  request(
    'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-gb',
    (imageDataerror, imageDataresponse, data) => {
      if (!imageDataerror && imageDataresponse.statusCode === 200) {
        const jsonObj = JSON.parse(data);
        const imageUrl = `https://www.bing.com${jsonObj.images[0].url}`;
        request(imageUrl, { encoding: 'binary' }, (imageError, imageResponse, body) => {
          if (!imageError && imageResponse.statusCode === 200) {
            // Save image
            const filename = imageUrl.replace(/^.*[\\\/]/, '');
            fs.writeFile(`${folderpath}/${filename}`, body, 'binary', () => {});
            console.log("Downloaded and saved today's bing wallpaper.");
          } else {
            console.log('Error getting bing wallpaper image.');
          }
        });
      } else {
        console.log('Error getting bing wallpaper data.');
      }
    },
  );
  return true;
}

checkInternet((isConnected) => {
  if (isConnected) {
    prepFolderLocation(folderpath);
    downloadWallpaper();
  }
});
