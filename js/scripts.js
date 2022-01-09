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
            // ghost.style.top = pos + "px";
            ghost.style.marginLeft = pos + "px";
            // ghost.style.margin-left = pos + "px";
        }
    }
}

function playerMove(boundaryHeight, player, direction, interval) {
    console.log("in playerMove");
    let id = null;
    let pos = 0;
    clearInterval(id);
    id = setInterval(frame, interval);

    function frame() {
        console.log("in playerMove frame");
        if (pos >= boundaryHeight) {
            clearInterval(id);
        } else {
            pos++;
            // ghost.style.marginLeft = pos + "px"
            player.style.marginTop = pos + "px";
        }
    }
}

function gameTime() {
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
    let ret = Math.floor(Math.random() * 10) + 1;
    return ret;
}


function playGame(boundaryWidth, boundaryHeight) {
    setGameLevel(1);
    gameTime();
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

    let player = document.querySelector("#gamePlayer");
    playerMove(boundaryHeight, player, "down", 10);
}

function startGame() {

    let gameHeader = document.querySelector("#gameHeader");
    let gameBody = document.querySelector("#gameBody");
    let gameLoader = document.querySelector("#gameLoader");
    let gameFooter = document.querySelector("#gameFooter");

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
    playGame(boundaryWidth, boundaryHeight);
}

document.querySelector("#startGame").addEventListener("click", startGame);