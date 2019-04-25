// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// declare API object
const spacesEndpoint = new AWS.Endpoint(config.region + '.digitaloceanspaces.com');
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


/* PROGRAM VARIABLES */

var pg;
var color;
var thickness;

let video;
let poseNet;
let poses = [];

let lefteyeX = 1;
let lefteyeY = 1;
let righteyeX = 2;
let righteyeY = 2;

let plefteyeX = 0;
let plefteyeY = 0;

let prighteyeX = 0;
let prighteyeY = 0;


/***********************/
/* Program functions **/
/**********************/

// change color
function colorChange(newColor) {
  color = newColor;
}

// change thickness
function widthChange(newWidth) {
  thickness = newWidth;
}

// clear canvas
function clearCanvas() {
  pg.clear();
}

// clear image when key is pressed
function keyPressed() {
  clearCanvas();
}

// save canvas
function saveImage() {
  getBucketLength(params).then(function(length) {
    img_name = (length == 0) ? 'image.png' : `image (${length}).png`;
    save(pg, img_name);
    
    // clear graphics
    pg.clear();
  });
}

/**************************/
/* Functions to setup app */
/**************************/

function setup() {

  // setup canvas
  pixelDensity(1);
  let cnv = createCanvas(900, 550);
  cnv.position((windowWidth - width) / 2, (windowHeight - height + 50) / 2);
  cnv.parent('video');

  // setup graphics
  pg = createGraphics(windowWidth, windowHeight);
  pg.background(0, 0, 0, 0.0);
  video = createCapture(VIDEO);
  video.size(width, height);
  color = 'black';
  thickness = 4;

  // decrease frame rate to increase stability
  frameRate(15);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video);

  // This sets up an event that fills "poses" with new poses
  poseNet.on('pose', function(results) {
    poses = results;
  });

  // change color by pressing relevant button
  $('.color').click(function(event) {
    colorChange(event.target.id);
  });

  // change thickness by pressing relevant button
  $('.width').click(function(event) {
    widthChange(parseInt(event.target.id));
  });


  // save canvas by pressing submit button
  $('#save-image').click(function() {

    // draw left eye
    pg.strokeWeight(1);
    pg.stroke('white');
    pg.fill('white');
    pg.ellipse(lefteyeX, lefteyeY, 40, 40);
    pg.fill('black');
    pg.ellipse(lefteyeX-5, lefteyeY+5, 20, 20);

    // draw right eye
    pg.strokeWeight(1);
    pg.stroke('white');
    pg.fill('white');
    pg.ellipse(righteyeX, righteyeY, 40, 40);
    pg.fill('black');
    pg.ellipse(righteyeX+5, righteyeY+5, 20, 20);

    saveImage();
      
    // show uploading alert
    $('.alert').addClass('show');
  });

  // clear canvas button
  $('#clear-canvas').click(function() {
    clearCanvas();
  });

  // Hide the video element, and just show the canvas
  video.hide();
}


// setup draw parameters in video
function draw() {
  image(video, 0, 0, width, height);

  // Start drawing on canvas
  pg.stroke(color);
  pg.strokeWeight(thickness);
  drawKeypoints();

  //Draw the offscreen buffer to the screen with image()
  image(pg, 0, 0);
}


// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {

  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {

    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;

    for (let j = 1; j < pose.keypoints.length; j++) {

      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];

      if (j == 1) {
        lefteyeX = keypoint.position.x;
        lefteyeY = keypoint.position.y;

        pg.line(lefteyeX, lefteyeY, plefteyeX, plefteyeY);

        // draw left eye
        strokeWeight(2);
        stroke('white');
        fill('white');
        ellipse(lefteyeX, lefteyeY, 40, 40);
        fill('black');
        ellipse(lefteyeX-5, lefteyeY+5, 20, 20);

        plefteyeX = lefteyeX;
        plefteyeY = lefteyeY;
      }

      if (j == 2) {
        righteyeX = keypoint.position.x;
        righteyeY = keypoint.position.y;

        pg.line(righteyeX, righteyeY, prighteyeX, prighteyeY);

        // draw right eye
        strokeWeight(2);
        stroke('white');
        fill('white');
        ellipse(righteyeX, righteyeY, 40, 40);
        fill('black');
        ellipse(righteyeX+5, righteyeY+5, 20, 20);

        prighteyeX = righteyeX;
        prighteyeY = righteyeY;
      }

    }
  }
}
