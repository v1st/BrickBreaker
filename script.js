var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;


var x = canvas.width / 2,
    y = canvas.height - 30,
    dx = Math.random() * 8,
    dy = -4,
    paddleHeight = 10,
    paddleWidth = 120,
    paddleX = (canvas.width - paddleWidth) / 2,
    rightPressed = false,
    leftPressed = false,
    brickRowCount = 5,
    brickColumnCount = 9,
    brickWidth = 80,
    brickHeight = 15,
    brickPadding = 1,
    brickOffsetTop = 30,
    brickOffsetLeft = 0,
    score = 0,
    lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// render bricks
var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
// movement handlers
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}
// display functions
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
    ctx.fillstyle = "#0033FF";
    ctx.fillStroke = "#0033FF";
    ctx.Stroke = "10"
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillstyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy + 0.4;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert('You Win!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives ${lives}`, canvas.width - 65, 20);
}

// game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            if (y = y - paddleHeight) {
                dy = -dy;
                let angle = Math.random() * 8;
                dx = (dx > 0) ? angle : -angle;
            }
        }
        else {
            lives--;
            if (!lives) {
                alert("Game OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = Math.random() * 8;
                dy = -4;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x = x + dx;
    y = y + dy;
    requestAnimationFrame(draw);
}
draw();