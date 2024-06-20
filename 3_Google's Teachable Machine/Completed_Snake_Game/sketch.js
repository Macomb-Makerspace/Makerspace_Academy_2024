// Welcome to IMA!!!
// The link for this is: https://tinyurl.com/nyu-snake
// https://teachablemachine.withgoogle.com/
// https://p5js.org/

// *** HERE IS CODE YOU CAN EDIT ******//

// REPLACE THIS WITH YOUR OWN TEACHABLE MACHINE MODEL!!
/*
2 Ways
1. Download your model off of Teachable Machine and link it manually
2. Upload your model to the cloud and use a URL
*/

//1. Using a downloaded model
let imageModelURL = './'; //this will retrieve your downloaded model so long as it resides in the same folder as your project

//2. Using a URL (example shown below - insert your own link in the "")
// let imageModelURL = "https://teachablemachine.withgoogle.com/models/rfrmQGqz_/" 

// IF YOU WANT TO TRY KEYBOARD CHANGE TO "TRUE";
let keyboard_control = false;

// Sets the speed at which the snake travels. 1 = fastest speed, 60 = slowest speed.
let speed = 5;


// *** THE REST OF THE CODE ******//

let video;
let flippedVideo;
let label = "waiting...";

let classifier;

// STEP 1: Load the model!
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

let snake; //Create a new Snake object
let _scale = 20; //Static scale value. Used to create the Snake's size as well as dictate how fast it moves and where the borders of the game are.
let food;
let w; //width
let h; //height

/*
The setup() function creates our canvas.
*/
function setup() {
  createCanvas(640, 480); //The size of the canvas is 640 pixels x 480 pixels

  // Create the video
  video = createCapture(VIDEO);
  
  //Generate the size of the video
  video.size(320, 240);

  //Hides the video until the webcam is ready
  video.hide();

  //Allows images to be flipped, otherwise left and right gestures may not initialize as expected.
  flippedVideo = ml5.flipImage(video);

  // Start classifying video input
  classifyVideo();

  //Get the width and height
  w = floor(width / _scale);
  h = floor(height / _scale);

  //Create a snake
  snake = new Snake();
  foodLocation();
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  label = results[0].label;
  // Classifiy again!
  controlSnake();
  classifyVideo();
}

//This function generates food at random locations on the canvas
function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

//This function is responsible for controlling the snake's movements using the KEYBOARD.
function keyPressed() {
  if (keyboard_control) {
    if (keyCode == RIGHT_ARROW) snake.setDirection(1, 0);
    if (keyCode == LEFT_ARROW) snake.setDirection(-1, 0);
    if (keyCode == UP_ARROW) snake.setDirection(0, -1);
    if (keyCode == DOWN_ARROW) snake.setDirection(0, 1);
  }
}

//This function is responsible for controlling the snake's movements using GESTURES.
function controlSnake() {
  if (!keyboard_control) {
    // Use gesture to move the snake UP
    if (label === "UP") {
      snake.setDirection(0, -1);
    }

    // Use gesture to move the snake RIGHT
    else if (label === "RIGHT") {
      snake.setDirection(1, 0);
    } 

    // Use gesture to move the snake LEFT
    else if (label === "LEFT") {
      snake.setDirection(-1, 0);
    } 

    // Use gesture to move the snake DOWN
    else if (label === "DOWN") {
      snake.setDirection(0, 1);
    }
  }
}

//This function is resposible for drawing our canvas on the screen. It also displays our webcam output (only if NOT using the keyboard)
function draw() {
  background(220); //Set the background color
  //If we are using GESTURES, set up the canvas to include webcam input and labels for registered gestures
  if (!keyboard_control) {
    //Image attributes
    //image(img: element or image, x position, y position, width, height)
    image(flippedVideo, 0, 0, 160, 120);
    textSize(32); //Size of the text shown is 32pts
    fill(255); //Text shown on screen is WHITE
    stroke(0); //Add an outline around the text
    text(label, 10, 40); //Set the text as well as its location
  }

  //Sets the scale
  scale(_scale);

  //Determines if the snake ate the food, if so, generate food in another location and update the snake.
  if (snake.eat(food)) {
    foodLocation();
    snake.update();
  }

  //If the frameCount/speed returns an even number, update the snake.
  if (frameCount % speed == 0) {
    snake.update();
  }

  //Display the snake on the canvas
  snake.show();

  //If the snake ran into itself or it ran into the border of the canvas, the game is over.
  if (snake.endGame()) {
    print("END GAME");
    background(255, 0, 0);
    noLoop();
  }

  //Create a food item with no outline and make it red.
  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}