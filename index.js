const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

//To paint on the canvas, we need to get the context
const context = gameBoard.getContext("2d");

//Holds width/height of the [gameBoard]
const gameBoardWidth = gameBoard.width;
const gameBoardHeight = gameBoard.height;

const snakeColor = "white";
const snakeBorder = "#fea000";
const boardBackground = "#36474f";
/* const boardBackground = context.createLinearGradient(0, 0, 0, 500);
boardBackground.addColorStop(0, "black");
boardBackground.addColorStop(1, "white"); */
const appleColor = "red";


//The size of every unit in the game
const unitSize = 25;
let running = false;

let xVelocity = unitSize; //How far we move on the x-axis every single game tick
let yVelocity = 0; //How far we move on the y-axis every single game tick
let xApple;
let yApple;
let score = 0;

//The snake is an array of objects/parts
let snake = [
    //We'll create objects for each body part
    {x: unitSize * 4, y: 0}, //Head
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize * 1, y: 0},
    {x: 0, y: 0} //Tail: begins in the top left corner
];

//Add event listener to the window so we can move the snake with keystrokes
window.addEventListener("keydown", changeDirection);
//Add event listener to resetBtn
resetBtn.addEventListener("click", resetGame);

//Starts the game
gameStart();

//Functions we'll need
function gameStart(){
    running = true;
    scoreText.textContent = score;
    createApple();
    drawApple();
    nextTick();
}
function nextTick(){ //We do every round
    if(running){
        setTimeout(() => {
            clearBoard();
            drawApple();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75); //75: how often a game tick to occur
    }
    else{
        displayGameOver();
    }
}
function clearBoard(){ //in charge of re-painting the board
    context.fillStyle = boardBackground;
    context.fillRect(0, 0, gameBoardWidth, gameBoardHeight);
}
function createApple(){ //finds a random place to place an apple
    function randomApple(min, max){
        const randomNumber = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        //(Math.random() * (max - min) + min) / unitSize):
        //- divides the width and height of the game into spaces
        //- We receive a random space between 0 - 24, 'cause 500/25 = 25 available spaces

        //(Math.random() * (max - min) + min) / unitSize) * unitSize:
        //- places the apple accurately in the top left corner on one of the spaces
        return randomNumber;
    }
    xApple = randomApple(0, gameBoardWidth - unitSize);
    yApple = randomApple(0, gameBoardHeight - unitSize);
}
function drawApple(){
    /* context.beginPath();
    context.arc(xApple, yApple, 12.5, 0, 2 * Math.PI); */
    context.fillStyle = appleColor;
    context.fillRect(xApple, yApple, unitSize, unitSize);
    context.stroke();
    context.fill();
}
function moveSnake(){
    //To move the snake, we'll create a new head of the snake
    //in the direction we're moving, then eliminate the tail
    const head = {  
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity,
    }
    snake.unshift(head); //Add this new head to the snake

    //Then, eliminate the tail
    if(snake[0].x == xApple && snake[0].y == yApple){ //If apple's eaten
        score++;
        scoreText.textContent = score;
        createApple();
    }
    else{
        snake.pop(); //eliminates the tail every time we move
    }

}
function drawSnake(){
    context.fillStyle = snakeColor;
    context.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}
function checkGameOver(){
    switch(true){
        case(snake[0].x < 0): //Head
            running = false;
            break;
        case(snake[0].x >= gameBoardWidth): //Head
            running = false;
            break;
        case(snake[0].y < 0): //Head
            running = false;
            break;
        case(snake[0].y >= gameBoardHeight): //Head
            running = false;
            break;
    }

    //Checks to see if any body parts of the snake overlap
    //We don't want to begin at the head (snake[0])
    for(let i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            running = false;
        }
    }
}
function displayGameOver(){
    context.font = "50px Courier New";
    context.fillStyle = "#fea000";
    context.textAlign = "center";
    context.fillText("GAME OVER", gameBoardWidth / 2, gameBoardHeight / 2);
    running = false;
}
function changeDirection(event){
    const keyPressed = event.keyCode; //or [key]
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight): //goes left
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == RIGHT && !goingLeft): //goes right
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown): //goes up
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == DOWN && !goingUp): //goes down
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}
function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        //We'll create objects for each body part
        {x: unitSize * 4, y: 0}, //Head
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize * 1, y: 0},
        {x: 0, y: 0} //Tail: begins in the top left corner
    ];
    gameStart();
}