function startGame() {

    var gameHeader = document.querySelector("#gameHeader");
    var gameBody = document.querySelector("#gameBody");
    var gameLoader = document.querySelector("#gameLoader");
    var gameFooter = document.querySelector("#gameFooter");

    gameHeader.style.display = "none";
    gameBody.style.display = "none";
    gameLoader.style.display = "block";
    gameFooter.style.display = "flex";
}