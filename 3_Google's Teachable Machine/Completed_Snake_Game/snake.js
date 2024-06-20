class Snake {
  //Initialize values
  constructor() {
    //Create the body of the snake and determine its size
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));

    //Initialize an x-position, a y-position, and a length variable
    this.x_position = 0;
    this.y_position = 0;
    this.len = 0;
  } //End constructor

  //Function to set the direction in which the snake moves
  setDirection(x, y) {
    this.x_position = x; //Set the x-position to whatever value was generated for x
    this.y_position = y; //Set the y-position to whatever value was generated for y
  } //End setDirection()

  //Function to update the length of the snake as it appears on screen once food is consumed and determines which direction the snake is moving in.
  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.x_position;
    head.y += this.y_position;

    this.body.push(head);
  } //End update()

  //This function is called when the snake eats food
  //If the snake eats, add one segment to the body
  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.len++;
    this.body.push(head);
  } //End grow()

  //This function determines if the game ends. Either the snake ran into itself or it ran into the border of the canvas.
  endGame() {
    //Determine where the snake is on the canvas
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;

    //Take x and constrain it within the range of (0) to (width - 1)
    x = constrain(x, 0, w - 1);

    //Take y and constrain it within the range of (0) to the (height - 1)
    y = constrain(y, 0, h - 1);

    //Determine if the snake ran into itself or the border of the canvas, if so, game over, if not, the game continues
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];

      //If the snake ran into itself or the border of the canvas, display the game over screen (red screen)
      if (part.x == x && part.y == y) {
        return true;
      }
    }

    //The snake has not run into itself or the border of the canvas, the game continues
    return false;
  } //End endGame()

  //Function to determine if the snake ate food
  eat(pos) {
    //Determine the location of the snake in relation to the food on the canvas
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;

    //If the snake ate food, add a segment to the snake's body
    if (x == pos.x && y == pos.y) {
      this.grow();
      return true;
    }

    //Snake did not eat any food, do not add a segment to the snake's body
    return false;
  } //End eat()

  //Function to display the snake on the canvas
  show() {
    //Display any/all segments of the snake
    for (let i = 0; i < this.body.length; i++) {
      // Decide the color for the snake (both RGB and Hex Codes are accepted)
      fill("#03C04A"); //Snake is going to be "Parakeet Green"
      
      noStroke(); //Removes lines/outlines of shapes
      
      rect(this.body[i].x, this.body[i].y, 1, 1); //Creating a rectangle for the snake's body
    }
  } //End show()

} //End Snake class