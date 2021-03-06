// declare API object
var spacesEndpoint = new AWS.Endpoint(config.region + '.digitaloceanspaces.com');
var s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

// define bucket name
var params = {
    Bucket: config.bucketName,
}

// function to get total number of images
const getBucketLength = (params, count = 0) => new Promise((resolve, reject) => {
    s3.listObjectsV2(params).promise()
      .then(({Contents, IsTruncated, NextContinuationToken}) => {
        count += Contents.length;
        !IsTruncated ? resolve(count) : resolve(getBucketLength(Object.assign(params, 
            {ContinuationToken: NextContinuationToken}), count));
      })
      .catch(reject);
});

// function to load images
function loadImages() {
  getBucketLength(params).then(function(length) {
    // number of images to be shown in page
    const img_count = Math.min(length, config.maxImages);

    for (let i = 1; i <= img_count; i++) {
      let img = document.createElement('img');
      const id = `${img_count - i}`;
      img.id = id;
      img.src = config.baseUrl + (length - i == 0 ? '' : ` (${length - i})`) + '.png';
      document.getElementById('photos').appendChild(img);
    }

  });
}

// function to reload image sources
function refreshImages() {
  getBucketLength(params).then(function(length) {
    // number of images to be shown in page
    const img_count = Math.min(length, config.maxImages);

    for (let i = 1; i <= img_count; i++) {
      const id = `${img_count - i}`;
      let img = document.getElementById(id);
      if (!img) {
        img = document.createElement('img');
        img.id = id;
        document.getElementById('photos').appendChild(img);
      }
      img.src = config.baseUrl + (length - i == 0 ? '' : ` (${length - i})`) + '.png';
    }

    console.log("Images refreshed!");

  });
}

$(document).ready(function() {

  loadImages();

  // click refresh button
  $('#refresh').click(function() {
    refreshImages();
  });

  // refresh every 10 seconds
  window.setInterval(function(){
    refreshImages();
  }, 10000);
});
