var request    = require('request'),
    fs         = require('fs'),
    folderpath = '/users/johnpillar/Pictures/bing-wallpaper';

function checkInternet(cb) {
    require('dns').lookup('google.com',function(err) {
        if (err && err.code == "ENOTFOUND") {
            cb(false);
        } else {
            cb(true);
        }
    })
}

function rmDir (dirPath, removeSelf) {
    if (removeSelf === undefined)
        removeSelf = true;
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
            }
    if (removeSelf)
        fs.rmdirSync(dirPath);
};

function prepfolderlocation (dirpath, result) {

    // Remove folder contents
    console.log ('Removing contents of folder: ' + dirpath);
    rmDir (folderpath, false);

    // If folder does not exist create it
    fs.stat(dirpath, function (err, stats) {
        if (err) {
            // Directory doesn't exist or some other error
            console.log('Folder doesn\'t exist, so I made the folder: ' + dirpath);
            fs.mkdir(dirpath);
        };
    });
};

function downloadwallpaper (result) {
    request('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-gb', function (error, response, data) {
        if (!error && response.statusCode == 200) {

            var jsonObj = JSON.parse(data),
                imageUrl = 'https://www.bing.com' + jsonObj.images[0].url;

            // Get higher res image
            //imageUrl = imageUrl.replace('1080','1200'); // Removed as not all images are in SHD
            console.log ('Getting image: ' + imageUrl);

            request(imageUrl, {encoding: 'binary'}, function(error, response, body) {
                if (!error && response.statusCode == 200) {

                    // Construct filename
                    var filename = imageUrl.replace(/^.*[\\\/]/, '');

                    // Save file
                    fs.writeFile(folderpath + '/' + filename, body, 'binary', function (err) {});
                    console.log ('Downloaded and saved today\'s bing wallpaper.');

                } else {
                    console.log ('Error getting bing wallpaper image.');
                }
            });

        } else {
            console.log ('Error getting bing wallpaper data.'); 
        };
    });
    return true;
};

checkInternet(function(isConnected) {
    if (isConnected) {
        // connected to the internet
        prepfolderlocation(folderpath);
        downloadwallpaper ();
    } else {
        // not connected to the internet so do nothing
    }
});
