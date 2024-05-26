var showcase = document.getElementById("showcase-frame");
var showcasing = false

hideGame()

function showGame(game)
{
    // alert("SHOW GAME: " + game.name)
    hideSpeech()
    showcase.style = "display: block;"
    showcasing = true
}

function hideGame()
{
    showcase.style = "display: none;"
}
