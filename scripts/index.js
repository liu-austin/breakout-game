// jshint esversion:6
var canvas =  document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");

var rightPressed = false;
var leftPressed = false;

var x = canvas.width/2;
var y = canvas.height/2;

var dx = -3;
var dy = -3;

var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;

var lives = 3;

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

function calculateVelocity(xPos, yPos, xVel, yVel) {
    xVel = yVel / xVel;
    yVel = xVel / yVel;
    return [xVel, yVel];
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function handleBallCollision(xPos, yPos, xVel, yVel) {
    if (xPos + xVel + ballRadius > canvas.width || xPos + xVel - ballRadius < 0) {
        xVel = -xVel;
    }

    if (yPos + yVel - ballRadius < 0) {
        yVel = -yVel;
    } else if (yPos + yVel + ballRadius > canvas.height) {
        if (x >= paddleX && x <= paddleX + paddleWidth) {
            yVel *= -1;
        } else {
            lives -= 1;
            if (!lives) {
                alert('GAME OVER\nFINAL SCORE: ' + score);
                document.location.reload();
                // clearInterval(interval); // Needed for Chrome to end game
            } else {
                // restart the game with one less life
                x = canvas.width / 2;
                y = canvas.height / 2;
                dx = 2;
                dy = 2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    return [xVel, yVel];
} 

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX >= paddleWidth / 2 && relativeX <= canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function handlePaddleCollision(paddleLeftPosition) {
    let speed = 4.5 + 3 - 3 * (Math.abs(canvas.width / 2 - (paddleLeftPosition + (paddleWidth / 2))) / (canvas.width / 2));
    if (rightPressed) {
        paddleLeftPosition += speed;
        console.log(speed);
        if (paddleLeftPosition + paddleWidth > canvas.width) {
            paddleLeftPosition = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleLeftPosition -= speed;
        console.log(speed);
        if (paddleLeftPosition < 0) {
            paddleLeftPosition = 0;
        }
    }
    return paddleLeftPosition;
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var score = 0;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];

for (let i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickRowCount; j++) {
        bricks[i][j] = {x: brickOffsetLeft + i * (brickWidth + brickPadding), y: brickOffsetTop + j * (brickHeight + brickPadding), intact: true};
    }
}

function drawBricks(brickArr) {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            if (brickArr[i][j].intact) {
                ctx.beginPath();
                ctx.rect(brickArr[i][j].x, brickArr[i][j].y, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function brickCollisionDetection() {
    for (let i = 0; i < brickColumnCount; i++) {
        for (let j = 0; j < brickRowCount; j++) {
            brick = bricks[i][j];
            if (brick.intact) {
                if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
                    dy = -dy;
                    bricks[i][j].intact = false;
                    score += 10;
                    if (score == brickRowCount * brickColumnCount * 10) {
                        alert("YOU WIN, CONGRATULATIONS!\nFINAL SCORE: " + score);
                        document.location.reload();
                        // clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}


function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    brickCollisionDetection();
    drawScore();
    drawLives();
    drawBricks(bricks);
    drawBall();
    drawPaddle();
    [dx, dy] = calculateVelocity(x,y,dx,dy);
    [dx, dy] = handleBallCollision(x,y,dx,dy);
    x += dx;
    y += dy;
    paddleX = handlePaddleCollision(paddleX);
    requestAnimationFrame(draw);
}

draw();