let playerPosition = Math.floor(screen.height / 2);

class Question {
    constructor(number1, number2) {
        this.number1 = number1;
        this.number2 = number2;
        this.answer = number1 * number2;
    }

    getQuestion() {
        return String(this.number1) + " X " + String(this.number2) + " = ?"
    }
};

const questionList = new Array();

function generateQuestion() {
    let num1 = Math.floor(Math.random() * 15) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let q = new Question(num1, num2);
    questionList.push(q);
}

function laserBeamAttack() {
    let laserBeam = document.querySelector("#laserBeam");
    laserBeam.style.display = "block";
    setTimeout(function() {
        laserBeam.style.display = "none";
    }, 300);
}

function setGameLevel(value) {
    let gameLevel = document.querySelector("#gameLevel");
    gameLevel.innerHTML = value;
}

function setGameRemainngTime(timeValue) {
    let remTime = document.querySelector("#remTime");
    remTime.innerHTML = timeValue;
}

function ghostMove(boundaryWidth, ghost, interval) {
    console.log("in ghostMove");
    let id = null;
    let pos = 0;
    clearInterval(id);
    id = setInterval(frame, interval);

    function frame() {
        console.log("in ghostMove frame");
        if (pos >= boundaryWidth) {
            clearInterval(id);
        } else {
            pos++;
            ghost.style.marginLeft = pos + "px";
        }
    }
}

function playerMove(boundaryHeight, direction) {
    console.log("in playerMove");
    if (playerPosition >= boundaryHeight || playerPosition <= 10) {
        if (playerPosition >= boundaryHeight) {
            playerPosition -= 5;
        } else {
            playerPosition += 5;
        }
        return;
    }
    if (direction == "up") {
        playerPosition += 5;
    } else {
        playerPosition -= 5;
    }
    let player = document.querySelector("#gamePlayer");
    player.style.marginTop = playerPosition + "px";
}

function setGameTime() {
    console.log("in gameTime");
    let id = null;
    let pos = 60;
    setGameRemainngTime(pos + " Sec");
    clearInterval(id);
    id = setInterval(frame, 1000);

    function frame() {
        console.log("in playerMove frame");
        if (pos <= 0) {
            clearInterval(id);
        } else {
            pos--;
            setGameRemainngTime(pos + " Sec");
        }
    }
}

function getGhostVelocity() {
    let ret = Math.floor(Math.random() * 25) + 10;
    return ret;
}

function setQuestionsAndAnswer() {
    for (let i = 0; i < 5; i++) {
        generateQuestion();
    }
    document.querySelector("#game_question_one").innerHTML = questionList[0].getQuestion();
    document.querySelector("#game_question_two").innerHTML = questionList[1].getQuestion();
    document.querySelector("#game_question_three").innerHTML = questionList[2].getQuestion();
    document.querySelector("#game_question_four").innerHTML = questionList[3].getQuestion();
    document.querySelector("#game_question_five").innerHTML = questionList[4].getQuestion();

    let index = Math.floor(Math.random() * 5);
    document.querySelector("#gameAnswer").innerHTML = questionList[index].answer;

}


function playGame(boundaryWidth, boundaryHeight) {
    setQuestionsAndAnswer();
    setGameLevel(1);
    setGameTime();
    let ghost1 = document.querySelector("#gameGhost1");
    let ghost2 = document.querySelector("#gameGhost2");
    let ghost3 = document.querySelector("#gameGhost3");
    let ghost4 = document.querySelector("#gameGhost4");
    let ghost5 = document.querySelector("#gameGhost5");

    ghostMove(boundaryWidth, ghost1, getGhostVelocity());
    ghostMove(boundaryWidth, ghost2, getGhostVelocity());
    ghostMove(boundaryWidth, ghost3, getGhostVelocity());
    ghostMove(boundaryWidth, ghost4, getGhostVelocity());
    ghostMove(boundaryWidth, ghost5, getGhostVelocity());

    playerMove(boundaryHeight, "up");

}

function playerMoveUp() {
    console.log("in playerMoveUp");
    let game_loader_row_five = document.querySelector(".game_loader_row_five");
    const boundaryHeight = game_loader_row_five.getBoundingClientRect().y;
    playerMove(boundaryHeight, "up");
}

function playerMoveDown() {
    console.log("in playerMoveDown");
    let game_loader_row_five = document.querySelector(".game_loader_row_five");
    const boundaryHeight = game_loader_row_five.getBoundingClientRect().y;
    playerMove(boundaryHeight, "down");
}

function onKeyPressed(e) {
    if (!e) var e = window.event;
    (e.keyCode) ? key = e.keyCode: key = e.which;
    try {
        switch (key) {
            case 32:
                laserBeamAttack();
                break; //left
            case 37:
                break; //left
            case 38:
                playerMoveDown();
                break; //down
            case 39:
                break; //right
            case 40:
                playerMoveUp();
                break; //up
        }
    } catch (Exception) {}

}

function startGame() {

    let gameHeader = document.querySelector("#gameHeader");
    let gameBody = document.querySelector("#gameBody");
    let gameLoader = document.querySelector("#gameLoader");
    let gameFooter = document.querySelector("#gameFooter");
    let laserBeam = document.querySelector("#laserBeam");

    laserBeam.style.display = "none";
    gameHeader.style.display = "none";
    gameBody.style.display = "none";
    gameLoader.style.display = "block";
    gameFooter.style.display = "flex";

    let gamePlayer = document.querySelector("#gamePlayer");
    let ghostImage = document.querySelector(".game_ghost_image");
    const boundaryWidth = gamePlayer.getBoundingClientRect().x - gamePlayer.getBoundingClientRect().width;
    let game_loader_row_five = document.querySelector(".game_loader_row_five");
    const boundaryHeight = game_loader_row_five.getBoundingClientRect().y;
    console.log(boundaryHeight);
    document.addEventListener('keydown', onKeyPressed);
    playGame(boundaryWidth, boundaryHeight);
}

document.querySelector("#startGame").addEventListener("click", startGame);