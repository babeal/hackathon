var http = require('http');
var Promise = require('promise');

var options = {
    host: 'catfacts-api.appspot.com',
    path: '/api/facts'
};

var callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        console.log(str);
    });
};

export function getRandomCatFact() {
    return new Promise(function (resolve, reject) {
        http.request(options, function(response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                resolve(JSON.parse(str).facts[0]);
            });
        }).end();

        // get('http://www.google.com', function (err, res) {
        //     if (err) reject(err);
        //     else resolve(res);
        // });
    });

}


