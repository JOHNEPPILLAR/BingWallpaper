var request  = require('request'),
    fs       = require('fs'),
    filepath = '/users/johnpillar/Pictures/bing-wallpaper/';

function prepfolderlocation (result) {
    fs.stat(filepath, function (err, stats) {
        if (err) {
            // Directory doesn't exist or some other error
            console.log('Folder doesn\'t exist, so I made the folder: ' + filepath);
            fs.mkdir(filepath);
        };
    });
};

function downloadwallpaper (result) {
    request('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-gb', function (error, response, data) {
        if (!error && response.statusCode == 200) {

            var jsonObj = JSON.parse(data),
                imageUrl = 'https://www.bing.com/' + jsonObj.images[0].url;

            // Get higher res image
            imageUrl = imageUrl.replace('1080','1200');
            console.log ('Getting image: ' + imageUrl);

            request(imageUrl, {encoding: 'binary'}, function(error, response, body) {
                if (!error && response.statusCode == 200) {

                    // Construct filename
                    var filename = imageUrl.replace(/^.*[\\\/]/, '');
                    
                    // Save file
                    fs.writeFile(filepath + filename, body, 'binary', function (err) {});
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

prepfolderlocation();
downloadwallpaper ();
