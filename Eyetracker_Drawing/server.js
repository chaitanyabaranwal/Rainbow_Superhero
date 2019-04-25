// load dependencies
const AWS = require('aws-sdk');
const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// declare API object
var spacesEndpoint = new AWS.Endpoint(config.region + '.digitaloceanspaces.com');
var s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});
var params = {
    Bucket: config.bucketName,
}

// function to get total number of images
const getBucketLength = (params, count = 0) => new Promise((resolve, reject) => {
    s3.listObjectsV2(params).promise()
      .then(({Contents, IsTruncated, NextContinuationToken}) => {
        count += Contents.length;
        !IsTruncated ? resolve(count) : resolve(getBucketLength(Object.assign(params, {ContinuationToken: NextContinuationToken}), count));
      })
      .catch(reject);
});


// Setup Express server
var app = express();
app.use(express.static('public'));

// home page
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

// 'Submit image' button pressed
app.post('/upload', function(request, response) {

    getBucketLength(params).then(function(length) {

        // timeout present to account for the lag between downloading image and attempting upload
        setTimeout(function() {
            let filePath = 'images/image' + (length == 0 ? '' : ` (${length})`) + '.png';
            let params = {
                Bucket: config.bucketName,
                Key: path.basename(filePath),
                Body: fs.createReadStream(filePath),
                ACL: 'public-read'
            };
            // upload the image onto bucket
            s3.upload(params, function(err, data) {
                if (err) {
                    console.log('Error: ' + err);
                    return response.redirect('/error');
                }
                console.log('Success!');
                return response.redirect('/');
            });
        }, 3500);

    });

});

app.listen(3001, function() {
    console.log('Listening at localhost:3001.');
});