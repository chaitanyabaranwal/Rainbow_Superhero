# Rainbow Superhero Project

This was a small project I needed to finish foran artist at 'Peekaboo!', which is an inclusive arts festival held at Rainbow Centre, Singapore. The basic idea was that children with limited mobility can use their eyes to draw things on a computer. While the first folder titled **'Eyetracker_Drawing'** was already done when I started working on the project, I did introduce some improvements to it. The main work focused on pushing the drawn to a server, and display them in another bigger screen for the purposes of the exhibition.

## Eyetracker Drawing

The most important aspect of the project involved is the web application which uses the library [PoseNet](https://ml5js.org/docs/posenet-webcam) for human pose estimation. This web app tracks eyes and draws lines based on eye movements. 

My work on this section of the project includes design improvements, as well as customizations such as line colors and width to make the app more interactive. I also introduced a pair of googly eyes which looks pretty cool! 

The main aspect of my work involved the **Submit Image** option, which downloads the drawn image into local memory, and then pushes the image into a [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces/) server for object storage. 

#### Getting started locally

**Pre-requisites**: `Node.js` and `npm`

1. Clone the repository and navigate to the `EyeTracker_Drawing` folder through the terminal.
2. Type `npm install .` to install the required node modules.
3. Setup a `config.js` file with the following parameters, which can be obtained on setting up a Spaces server: `region`, `endPoint`, `accessIDKey`, `secretAccessKey` and the `bucketName`.
4. Type `npm run` and get going!

## Display Website

The second part of this project was another website, which would display the submitted images in real-time. The application pulls images from the Spaces server and lays them out in a grid of 16 most recent images.

#### Getting started locally

1. Clone the repository and navigate to the `Display_Website` folder through the terminal.
2. Setup a `config.js` file with the following parameters, which can be obtained on setting up a Spaces server: `region`, `endPoint`, `accessIDKey`, `secretAccessKey` and the `bucketName`.
3. Open the `index.html` file through a browser and you are good to go!
4. Alternatively, you can also deploy this section of the website (I did) using Heroku or any other service.

### Authors

* Chaitanya Baranwal [Github profile](https://github.com/chaitanyabaranwal)