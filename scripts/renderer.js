// CANVAS
var canvas  = document.getElementById("canvas")
var context = canvas.getContext("2d")
var width   = canvas.width  = window.innerWidth - 0
var height  = canvas.height = window.innerHeight - 0

// SHADOWS
var shadowColor = getComputedStyle(document.documentElement).getPropertyValue('--shadow-color')
var shadowFill = getComputedStyle(document.documentElement).getPropertyValue('--shadow-color')
var shadowCanvas = document.getElementById("shadow-canvas")
var shadowContext = shadowCanvas.getContext("2d")
shadowCanvas.width = width
shadowCanvas.height = height

let onrender = new CustomEvent("render", { 'context': context })
let onrendershadow = new CustomEvent("rendershadow", { 'context': shadowContext })
addEventListener("update", args => render())

function render()
{
    context.clearRect(0, 0, width, height)
    shadowContext.clearRect(0, 0, width,height)
           
    // SHADOWS
    shadowContext.shadowColor = shadowColor
    shadowContext.fillStyle = shadowFill
    shadowContext.shadowBlur = 16
    shadowContext.shadowOffsetX = 20
    shadowContext.shadowOffsetY = 20
    
    // EVENTS
    onrender.context = context
    onrendershadow.context = shadowContext
    dispatchEvent(onrender)
    dispatchEvent(onrendershadow)

    // GAMES
    for (let i = 0; i < boxes.length; i++)
    {
        var b = boxes[i],
            w = distance(b.path[0], b.path[1]),
            h = distance(b.path[0], b.path[3]),
            dx = b.path[2].x - b.path[0].x,
            dy = b.path[2].y - b.path[0].y,
            angle = Math.atan2(dy, dx) - 0.8

        if (b.hidden) continue

        // Render shadow
        shadowContext.save()
        shadowContext.translate(b.path[0].x, b.path[0].y)
        shadowContext.rotate(angle)
        shadowContext.fillRect(4, 4, w-8, h-8)
        shadowContext.restore()

        // Render box
        context.save()
        context.translate(b.path[0].x, b.path[0].y)
        context.rotate(angle)
        roundedImage(0, 0, w, h, 10)
        context.clip()
        context.drawImage(b.game.img, 0, 0, w, h)
        if (b.game.puke > 0)
        {
            b.game.puke -= 0.005
            context.fillStyle = 'rgba(189, 224, 101,' + (b.game.puke) + ')'
            context.fillRect(0,0,w,h)
        }
        context.restore()
        
        // renderDebug(b)
    }
}

function renderDebug(b)
{
    context.strokeStyle = "red"
    context.lineWidth = 5
    context.beginPath()
    context.moveTo(b.path[3].x, b.path[3].y)
    context.lineTo(b.path[0].x, b.path[0].y)
    context.stroke()
    context.beginPath()
    context.moveTo(b.path[0].x, b.path[0].y)
    context.lineTo(b.path[1].x, b.path[1].y)
    context.strokeStyle = "blue"
    context.stroke()
    context.fillStyle="magenta"
    context.fillRect(b.center.x, b.center.y, 15,15)
}

function roundedImage(x, y, width, height, radius)
{
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}