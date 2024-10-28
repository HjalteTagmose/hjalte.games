let onupdate = new CustomEvent("update", { 'delta': 0.0 })
let onfixedupdate = new CustomEvent("fixedupdate", { 'delta': fixedDelta })

var d = new Date()
const startTime = d.getTime()
var lastTime  = startTime
var curTime   = startTime

var physicsTimeSimulated = Date.now()
var fixedDelta = 0.01 //100fps

window.onload = update

function update()
{
    d = new Date()
    curTime = d.getTime()
    var delta = (curTime-lastTime) / 1000
    lastTime = curTime

    onupdate.delta = delta
    dispatchEvent(onupdate)
    fixedUpdate()
    requestAnimationFrame(update)
}

function fixedUpdate()
{
    var now = Date.now()
    while(physicsTimeSimulated < now)
    {
        dispatchEvent(onfixedupdate)
        physicsTimeSimulated += fixedDelta * 1000
    }
}