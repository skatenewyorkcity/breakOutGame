//references to myCanvas markup in HTML file, and stores it to canvas var in js
var canvas = document.getElementById('myCanvas');

//create drawing context for the canvas, context object includes information
//about colors, line widths, fonts and other graphic parameters that can be drawn
//on the canvas, passing 2d 
var ctx = canvas.getContext('2d');

/*
//start
ctx.beginPath();
//defines rectangle: 20,40 top left corner cordinates; 50, 50 width and height
ctx.rect(20, 40, 50, 50);
//defines color
ctx.fillStyle = "#FF0000";
//fills color
ctx.fill();
//finish
ctx.closePath();

ctx.beginPath();
//defines circle: 240, 160 x y cordinates, 20 arc radius, 0 start angle,
//Math.PI*2 end angle inradians about 360 deg, false = clockwise direction of drawing
ctx.arc(240, 160, 20, 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath;

ctx.beginPath();
ctx.rect(160, 10, 100, 40);
//fouth value it rgba() is a apha channel between 0 - 1 for transparency
ctx.strokeStyle = 'rgba (0, 0, 255, 0.5)';
//stroke colors the empty outline of the rectangle
ctx.stroke;
ctx.closePath();
*/

//x and y to define the position where the circle is drawn at
//center horizontally
var x = canvas.width / 2;
//push by pixels vertically from the bottom
var y = canvas.height - 30;

//dx and dx movement variables
//html5 cavas coordinate detail found at: 
//http://www.ckollars.org/canvas-coordinates-two-scales.gif
//http://www.w3schools.com/jsref/jsref_operators.asp
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
//paddle location on x axis
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        //stores x y position and status, if status 0 it was hit by ball
        bricks[c][r] = {x: 0, y:0, status: 1}
    }
}

//event listeners for button pressed
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            //conditional to check brick status
            if (bricks[c][r].status == 1) {
                //positioning of bricks side by side
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#FFFFFF";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//function take event as parameter "e", key down 39 right key 37 left key
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37){
        leftPressed = true;
    }
}

//function take event as parameter "e", key up 39 right key 37 left key
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath()
    //ball drawn
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    //x pos, y pos, width & heigth
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            //If collision occurs on active brick change brick status to 0
            if (b.status == 1) {
                //if ball touches bricks change directiion, between left and right
                //top or bottom
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    //change brick status to 0
                    b.status = 0
                    //when bricks is hit add 1 to score
                    score++;
                    //check if all bricks are hit, alert win then reload
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16 Arial";
    ctx.font = "#FFFFFF";
    //8, 9 x and y coordinates
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
    //paints new canvas to clear, this is to remove ball trail
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    /*
    //is y postion plus ammount added (2) is < 0; instead of going up and off the 
    //canvas, this reverse the direction - - is +
    if (y + dy < 0) {
        dy = -dy;
    }
    //if the y value is greater than the canvas height reverse ball direction
    if (y + dy > canvas.height) {
        dy = -dy;
    }
    */

    //above rewriten, ballRadius instead of 0 to remove ball sinking into wall 
    //due to collision dection at ballcenter
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        //paddle collision detection
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            //if ball hits the bottom lives minus 1
            lives--;
            //if no lives or equal to 0 left gameover and reload
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                //else if life is left: reset set ball, direction, paddle etc
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
            
        }
    }
    //about rewritten for x values
    if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    //check is left and right keys pressed on every frame rendered
    //and prevent paddle from sinking into wall
    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    //adds dx and dy to draw new circle each time frame is updated
    x += dx;
    y += dy;

    //replaced with the setinterval draw method for better frame rate
    //comment this out and erase the draw() function call at the bottom of
    //program + uncomment the setinterval call for older implementation
    requestAnimationFrame(draw);
}

//mouse move handler
document.addEventListener("mousemove", mouseMoveHandler);
//relative x is the location of the mouse in the viewport or screen
//restricting mouse movement to the canvas so the paddles position stays on 
//canvas
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

/*
//draw function runs frame every 10 milliseconds forever or until stopped
setInterval(draw, 10);
*/

//above is commented out for better rendering with request animation frame
//for better frame rate than fixed to 10 by calling the draw() function below
//and adding requestAnimationFrame(draw) inside the draw() function
draw();
