var speechBubble = document.getElementById("speech-frame");
var speechOn = true
var showcasing = false

function toggleSpeech() 
{
    if (showcasing)
        return
    
    speechOn = !speechOn
    if (speechOn) 
        showSpeech()
    else 
        hideSpeech()
}
function showSpeech() 
{
    speechOn = true
    speechBubble.style = "display: block;"
}
function hideSpeech() 
{
    speechOn = false
    speechBubble.style = "display: none;"
}

function showGame(game)
{
    alert("SHOW GAME: " + game.name)
    hideSpeech()
    showcasing = true
}
