let onupdate = new CustomEvent("update", { 'delta': 0.0 });

var d = new Date();
const startTime = d.getTime();
var lastTime  = startTime
var curTime   = startTime

window.onload = update

function update()
{
    d = new Date()
    curTime = d.getTime()
    var delta = (curTime-lastTime) / 1000
    lastTime = curTime

    onupdate.delta = delta
    dispatchEvent(onupdate)
    requestAnimationFrame(update)
}