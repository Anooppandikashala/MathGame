let playerPosition = Math.floor(screen.height / 2);
let gameLevel = 1;
let isFirstTime = 1;
let currentUser = null;
const NO_OF_HIGH_SCORES = 5;
const HIGH_SCORES = 'highScores';

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

class User {
    constructor(name, highScore) {
        this.name = name;
        this.highScore = highScore;
    }
};

function clear(A) {
    if (A != null) {
        while (A.length > 0) {
            A.pop();
        }
    }
}

const questionList = new Array();
const ghostDivPostionList = new Array();
const ghostIdList = new Array();
const timerIdList = new Array();
let userScoreMap = new Map();

function highScoreBackButtonPressed() {
    document.querySelector("#gameHighScoreBody").style.display = "none";
    let gameHeader = document.querySelector("#gameHeader");
    let gameBody = document.querySelector("#gameBody");
    let gameLoader = document.querySelector("#gameLoader");
    let gameFooter = document.querySelector("#gameFooter");
    let laserBeam = document.querySelector("#laserBeam");

    laserBeam.style.display = "block";
    gameHeader.style.display = "flex";
    gameBody.style.display = "block";
    gameLoader.style.display = "none";
    gameFooter.style.display = "none";
}

function setHighScores() {
    userScoreMap = getHighScoreFromLocalStorage();
    console.log(userScoreMap);
    for (let key of userScoreMap.keys()) {
        console.log(userScoreMap.get(key));
    }
    const mapSort1 = new Map([...userScoreMap.entries()].sort((a, b) => b[1] - a[1]));
    console.log(mapSort1);

    const userArray = new Array();
    for (let key of mapSort1.keys()) {
        userArray.push(new User(key, mapSort1.get(key)));
        if (userArray.length == 5) {
            break;
        }
    }
    const highscoreArray = new Array();
    highscoreArray.push(document.querySelector("#highscore_1"));
    highscoreArray.push(document.querySelector("#highscore_2"));
    highscoreArray.push(document.querySelector("#highscore_3"));
    highscoreArray.push(document.querySelector("#highscore_4"));
    highscoreArray.push(document.querySelector("#highscore_5"));

    for (let i = 0; i < userArray.length; i++) {
        highscoreArray[i].innerHTML = (i + 1) + ". &nbsp;&nbsp;" + userArray[i].name + " &nbsp; &nbsp; &nbsp; &nbsp; " + "Level &nbsp;&nbsp;" + userArray[i].highScore;
    }

}

function getHighscores() {
    document.querySelector("#gameHighScoreBody").style.display = "block";
    document.querySelector("#highScoreBackButton").addEventListener("click", highScoreBackButtonPressed);
    let gameHeader = document.querySelector("#gameHeader");
    let gameBody = document.querySelector("#gameBody");
    let gameLoader = document.querySelector("#gameLoader");
    let gameFooter = document.querySelector("#gameFooter");
    let laserBeam = document.querySelector("#laserBeam");
    let game_over_layer = document.querySelector(".game_over_layer");

    laserBeam.style.display = "none";
    gameHeader.style.display = "none";
    gameBody.style.display = "none";
    gameLoader.style.display = "none";
    gameFooter.style.display = "none";
    game_over_layer.style.display = "none";

    setHighScores();
}

function fillGhostDivPostionList() {
    clear(ghostDivPostionList);
    let game_loader_row_one = document.querySelector(".game_loader_row_one").getBoundingClientRect();
    ghostDivPostionList.push(game_loader_row_one);

    let game_loader_row_two = document.querySelector(".game_loader_row_two").getBoundingClientRect();
    ghostDivPostionList.push(game_loader_row_two);

    let game_loader_row_three = document.querySelector(".game_loader_row_three").getBoundingClientRect();
    ghostDivPostionList.push(game_loader_row_three);

    let game_loader_row_four = document.querySelector(".game_loader_row_four").getBoundingClientRect();
    ghostDivPostionList.push(game_loader_row_four);

    let game_loader_row_five = document.querySelector(".game_loader_row_five").getBoundingClientRect();
    ghostDivPostionList.push(game_loader_row_five);
}

function isAnswerContain(q) {
    for (let tq of questionList) {
        if (tq.answer == q.answer) {
            return true
        }
    }
    return false;
}

function getHighScoreFromLocalStorage() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) == undefined ? [] : JSON.parse(localStorage.getItem(HIGH_SCORES));
    userScoreMap.clear();
    for (x of highScores) {
        userScoreMap.set(x.name["0"], x.name["1"]);
    }
    return userScoreMap;
}

function setHighScoreToLocalStorage(userScoreMap) {
    let ret = []
    for (key of userScoreMap) {
        let score = userScoreMap.get(key);
        let name = key;
        const newScore = { score, name };
        ret.push(newScore);
    }
    ret.sort((a, b) => b.score  -  a.score);

    // 3. Select new list
    ret.splice(NO_OF_HIGH_SCORES);

    // 4. Save to local storage
    localStorage.setItem(HIGH_SCORES, JSON.stringify(ret));
}

function addHighScore(user) {
    console.log("in addHighScore");

    userScoreMap = getHighScoreFromLocalStorage();

    let highScore = userScoreMap.get(user.name);
    console.log(highScore);
    if (highScore != undefined && highScore != null) {
        if (user.highScore > highScore) {
            userScoreMap.set(user.name, user.highScore);
            setHighScoreToLocalStorage(userScoreMap);
        }
        return;
    }
    console.log(user.name);
    console.log(user.highScore);
    userScoreMap.set(user.name, user.highScore);
    setHighScoreToLocalStorage(userScoreMap);
}

function isPlayerInGhostDiv(playerDiv, ghostDiv) {
    return (ghostDiv.bottom >= (playerDiv.bottom - 20) && ghostDiv.top <= (playerDiv.bottom - 20));
}

function getGhostDivIndexForPlayer(gamePlayer) {
    let index = 0;
    console.log("gamePlayer bottom :" + gamePlayer.bottom + " ; top :", gamePlayer.top)
    for (let row of ghostDivPostionList) {
        console.log("bottom :" + row.bottom + " ; top :", row.top)
    }
    for (let row of ghostDivPostionList) {
        if (isPlayerInGhostDiv(gamePlayer, row)) {
            return index;
        }
        index++;
    }
    return -1;
}

function isCorrectAnswer() {
    console.log("in isCorrectAnswer");
    let gamePlayer = document.querySelector("#gamePlayer").getBoundingClientRect();
    let index = getGhostDivIndexForPlayer(gamePlayer);
    console.log("Index : " + index);
    let answer = Math.floor(Number(document.querySelector("#gameAnswer").innerHTML));
    console.log("answer : " + answer);
    if (index == -1) {
        return false;
    }
    if (questionList[index].answer == answer) {
        return true;
    }
    return false;
}

function generateQuestion() {
    while (true) {
        let num1 = Math.floor(Math.random() * 15) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        let q = new Question(num1, num2);

        if (isAnswerContain(q)) {
            continue;
        } else {
            questionList.push(q);
            break;
        }
    }
}

function resetGhostPosition() {
    let ghost1 = document.querySelector("#gameGhost1");
    ghost1.style.marginLeft = 1 + "px";
    let ghost2 = document.querySelector("#gameGhost2");
    ghost2.style.marginLeft = 1 + "px";
    let ghost3 = document.querySelector("#gameGhost3");
    ghost3.style.marginLeft = 1 + "px";
    let ghost4 = document.querySelector("#gameGhost4");
    ghost4.style.marginLeft = 1 + "px";
    let ghost5 = document.querySelector("#gameGhost5");
    ghost5.style.marginLeft = 1 + "px";
}

function gotoNextLevel() {
    if (gameLevel == 5) {
        gameOver("You Win");
        return;
    }
    gameLevel++;
    clearGhostIds();
    let gamePlayer = document.querySelector("#gamePlayer");
    const boundaryWidth = gamePlayer.getBoundingClientRect().x - gamePlayer.getBoundingClientRect().width;
    let game_loader_row_five = document.querySelector(".game_loader_row_five");
    const boundaryHeight = game_loader_row_five.getBoundingClientRect().y;
    playGame(boundaryWidth, boundaryHeight);
}

function resetCurrentLevel() {
    resetQuestionsAndAnswer();
}

function laserBeamAttack() {
    let laserBeam = document.querySelector("#laserBeam");
    laserBeam.style.display = "block";

    setTimeout(function() {
        laserBeam.style.display = "none";
        if (isCorrectAnswer()) {
            alert("Correct Answer");
            gotoNextLevel()
        } else {
            alert("Wrong Answer");
            resetCurrentLevel()
        }
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
    // console.log("in ghostMove");
    let id = null;
    let pos = 0;
    clearInterval(id);
    id = setInterval(frame, interval);
    ghostIdList.push(id);

    function frame() {
        // console.log("in ghostMove frame");
        if (pos >= boundaryWidth) {
            clearInterval(id);
            isFirstTime++;
            if (isFirstTime - 1 == 1) {
                gameOver("You Lose, Game Over!");
            }

        } else {
            pos++;
            ghost.style.marginLeft = pos + "px";
        }
    }
}

function playerMove(boundaryHeight, direction) {
    // console.log("in playerMove");
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

function resetGameTime() {
    // console.log("in gameTime");
    let id = null;
    let pos = 60;
    setGameRemainngTime(pos + " Sec");
    clearInterval(id);
    id = setInterval(frame, 1000);
    timerIdList.push(id);

    function frame() {
        // console.log("in playerMove frame");
        if (pos <= 0) {
            clearInterval(id);
            gameOver("You Lose, Game Over!")
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

function resetQuestionsAndAnswer() {
    clear(questionList);
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

function clearGhostIds() {
    for (id of ghostIdList) {
        if (id != null) {
            clearInterval(id);
        }
    }
}

function clearTimerIds() {
    for (id of timerIdList) {
        if (id != null) {
            clearInterval(id);
        }
    }
}

function stopGame() {
    clearGhostIds();
    clearTimerIds();
    clear(ghostIdList);
    clear(timerIdList);
    clear(questionList);
    clear(ghostDivPostionList);
}

function gotoBack() {
    let gameHeader = document.querySelector("#gameHeader");
    let gameBody = document.querySelector("#gameBody");
    let gameLoader = document.querySelector("#gameLoader");
    let gameFooter = document.querySelector("#gameFooter");
    let laserBeam = document.querySelector("#laserBeam");

    laserBeam.style.display = "block";
    gameHeader.style.display = "flex";
    gameBody.style.display = "block";
    gameLoader.style.display = "none";
    gameFooter.style.display = "none";
}


function gameOver(msg) {
    currentUser.highScore = gameLevel;
    addHighScore(currentUser);
    document.querySelector(".game_over_layer").style.display = "block";
    document.querySelector("#gameOver").innerHTML = String(msg)
    document.querySelector("#backButton").addEventListener("click", gotoBack);
    stopGame();
}


function playGame(boundaryWidth, boundaryHeight) {
    resetQuestionsAndAnswer();
    setGameLevel(gameLevel);
    resetGhostPosition();
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
    // console.log("in playerMoveUp");
    let game_loader_row_five = document.querySelector(".game_loader_row_five");
    const boundaryHeight = game_loader_row_five.getBoundingClientRect().y;
    playerMove(boundaryHeight, "up");
}

function playerMoveDown() {
    // console.log("in playerMoveDown");
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


function gameStarted(name) {
    console.log(name);
    currentUser = new User(name, 0);

    let gameHeader = document.querySelector("#gameHeader");
    let gameBody = document.querySelector("#gameBody");
    let gameLoader = document.querySelector("#gameLoader");
    let gameFooter = document.querySelector("#gameFooter");
    let laserBeam = document.querySelector("#laserBeam");
    let game_over_layer = document.querySelector(".game_over_layer");

    laserBeam.style.display = "none";
    gameHeader.style.display = "none";
    gameBody.style.display = "none";
    gameLoader.style.display = "block";
    gameFooter.style.display = "flex";
    game_over_layer.style.display = "none";

    let gamePlayer = document.querySelector("#gamePlayer");
    let ghostImage = document.querySelector(".game_ghost_image");
    const boundaryWidth = gamePlayer.getBoundingClientRect().x - gamePlayer.getBoundingClientRect().width;
    let game_loader_row_five = document.querySelector(".game_loader_row_five");
    const boundaryHeight = game_loader_row_five.getBoundingClientRect().y;
    // console.log(boundaryHeight);
    document.addEventListener('keydown', onKeyPressed);

    fillGhostDivPostionList();
    resetGameTime();

    playGame(boundaryWidth, boundaryHeight);
}

function startGame() {
    gameLevel = 1;
    isFirstTime = 1;
    let userName = document.querySelector("#userName");
    if (userName != null || userName != undefined) {
        let name = String(userName.value);
        if (name.length == 0) {
            name = "System User";
        }
        gameStarted(name);
    } else {
        gameStarted("System User");
    }
}

document.querySelector("#startGame").addEventListener("click", startGame);
document.querySelector("#highScoes").addEventListener("click", getHighscores);
document.querySelector("#gameHighScoreBody").style.display = "none";