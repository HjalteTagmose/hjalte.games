canvas.addEventListener('touchend'  , _ => stopDrag());
canvas.addEventListener('mouseup'   , _ => stopDrag());
canvas.addEventListener('touchmove' , e => { getTouch(e); drag();});
canvas.addEventListener('mousemove' , e => { getMouse(e); drag();});
canvas.addEventListener('touchstart', e => { getTouch(e); startDrag();});
canvas.addEventListener('mousedown' , e => { getMouse(e); startDrag();});
canvas.addEventListener('click'     , e => { getMouse(e); click(e);}); 

var mousePos = { x: 0, y: 0 };
var heldBox = null;

function getMouse(e) 
{
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left)* 1.0;
    var y = (e.clientY - rect.top )* 1.0;

    mousePos.x = (x/rect.width)  * canvas.width; 
    mousePos.y = (y/rect.height) * canvas.height;
}

function getTouch(e) 
{
    var rect = canvas.getBoundingClientRect();
    var x = (e.touches[0].clientX - rect.left)* 1.0;
    var y = (e.touches[0].clientY - rect.top )* 1.0;

    mousePos.x = (x/rect.width)  * canvas.width; 
    mousePos.y = (y/rect.height) * canvas.height; 
}

function startDrag()
{
    for (let i = 0; i < boxes.length; i++)
    {
        var box = boxes[i];
        if (contains(box, mousePos.x, mousePos.y))
        {
            console.log(box.game.name);
            heldBox = box;
        }
    }
}

function drag()
{
    if (heldBox == null)
        return

    moveBox(heldBox, mousePos.x, mousePos.y);
}

function stopDrag()
{
    if (heldBox == null)
        return

    if (me.contains(mousePos.x, mousePos.y))
        showGame(heldBox.game)
    
    pinBox(heldBox, false);
    heldBox = null;
}

function click(e)
{
    if (e.detail != 1)
        return

    if (me.contains(mousePos.x, mousePos.y))
        toggleSpeech()
}