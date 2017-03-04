var request = require('request'),
    fs      = require('fs');

request('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-gb', function (error, response, data) {
    if (!error && response.statusCode == 200) {

        var jsonObj = JSON.parse(data),
            imageUrl = 'https://www.bing.com/' + jsonObj.images[0].url;

        // Get higher res image
        imageUrl = imageUrl.replace('1080','1200');
        console.log ('Getting image: ' + imageUrl);

        request(imageUrl, {encoding: 'binary'}, function(error, response, body) {
            if (!error && response.statusCode == 200) {

                fs.writeFile('downloaded.jpg', body, 'binary', function (err) {});

            } else {
                console.log ('Error getting bing wallpaper image.');
            }
        });

    } else {
        console.log ('Error getting bing wallpaper data.'); 
    };
});
