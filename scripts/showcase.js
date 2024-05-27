var showcasing = false
var showcaseFrame = document.getElementById("showcase-frame");
var showcase 

hideGame()
jQuery(document).ready(function() {
    showcase = $('#showcase').get(0)
    title       = showcase.contentWindow.document.getElementById("showcase-title")
    description = showcase.contentWindow.document.getElementById("showcase-description")
    console.log("ready!")
    clearShowcase()
});

function clearShowcase()
{
    title.innerHTML = "";
    description.innerHTML = "";
}

function showGame(game)
{
    // alert("SHOW GAME: " + game.name)
    hideSpeech()
    showcaseFrame.style = "display: block;"
    showcasing = true
    clearShowcase()
    fillShowcase(game)
}

function hideGame()
{
    showcaseFrame.style = "display: none;"
}

function fillShowcase(game)
{
    title.append(game.name)
}