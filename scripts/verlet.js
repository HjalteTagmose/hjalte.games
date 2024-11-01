// With a lot of help from:
// https://bitbucket.org/craigmit/verlet/src/master/
// https://www.youtube.com/watch?v=3HjO_RGIjCU

var points = []
var sticks = []
var boxes  = []

var colInfo  = { normal: {x:0,y:0} }
var floorOffset = 0

var bounce = 0.9
var gravity = 0.25
var friction = 0.999

addEventListener("fixedupdate", args => updateVerlet())

window.onresize = function()
{
    width  = canvas.width  = shadowCanvas.width  = window.innerWidth  - 8
    height = canvas.height = shadowCanvas.height = window.innerHeight - 8
}

function updateVerlet()
{
    updatePoints()
    
    for (let i = 0; i < 3; i++)
    {
        updateSticks()
        constrainPoints()
        updateBoxes()
        sweep()
    }
}

function updatePoints()
{
    for (let i = 0; i < points.length; i++) 
    {
        var p = points[i]

        if (p.pinned) 
            continue

        var vx = (p.x - p.oldx) * friction,
            vy = (p.y - p.oldy) * friction
        
        p.oldx = p.x
        p.oldy = p.y
        p.x += vx
        p.y += vy
        p.y += gravity
    }
}

function updateSticks()
{
    for (let i = 0; i < sticks.length; i++) 
    {
        var s = sticks[i]
        
        var dx = s.p1.x - s.p0.x,
            dy = s.p1.y - s.p0.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            diff = s.length - dist,
            perc = diff / dist / 2,
            offsetX = dx * perc,
            offsetY = dy * perc
            
        if (!s.p0.pinned) 
        {
            s.p0.x -= offsetX
            s.p0.y -= offsetY
        }
        if (!s.p1.pinned) 
        {
            s.p1.x += offsetX
            s.p1.y += offsetY
        }    
    }
}

function updateBoxes()
{
    for (let i = 0; i < boxes.length; i++) 
    {
        var b = boxes[i]
        if (b.hidden) continue
        
        b.center.x = (b.path[0].x + b.path[1].x + b.path[2].x + b.path[3].x) / 4
        b.center.y = (b.path[0].y + b.path[1].y + b.path[2].y + b.path[3].y) / 4
        
        var max = { x:-100000, y:-100000 }
        var min = { x: 100000, y: 100000 }
        
        for (let j = 0; j < b.path.length; j++) 
        {
            var p = b.path[j]

            max.x = p.x > max.x ? p.x : max.x
            max.y = p.y > max.y ? p.y : max.y
            min.x = p.x < min.x ? p.x : min.x
            min.y = p.y < min.y ? p.y : min.y
        }

        b.min = min
        b.max = max
    }
}

function constrainPoints()
{
    for (let i = 0; i < points.length; i++) 
    {
        var p = points[i]

        if (p.pinned) 
            continue

        var vx = (p.x - p.oldx) * friction,
            vy = (p.y - p.oldy) * friction

        if (p.x > width) {
            p.x = width
            p.oldx = p.x + vx
        } else if (p.x < 0) {
            p.x = 0
            p.oldx = p.x + vx * bounce
        }

        if (p.y > height+floorOffset) {
            p.y = height
            p.oldy = p.y + vy * bounce
        } else if (p.y < 0) {
            p.y = 0
            p.oldy = p.y + vy * bounce
        }
    }
}

function sweep()
{
    for (let i = 0; i < boxes.length; i++) 
    {      
        for (let j = 0; j < boxes.length; j++) 
        {
            if (i != j)
            {
                var b1 = boxes[i],
                    b2 = boxes[j]

                if (overlap(b1, b2))
                {
                    if(detectCollision(b1, b2))
                    {
                        processCollision()
                    }
                }
            }
        }
    }
}

function detectCollision(b1, b2)
{
    var minDist = 100000.0
    var b1edges = b1.edge.length,
        b2edges = b2.edge.length

    for (let i = 0; i < b1edges + b2edges; i++) 
    {
        var [e, parent] = i < b1edges ? 
            [b1.edge[i], b1] : 
            [b2.edge[i-b1edges], b2]
        
        var axisX = e.p0.y - e.p1.y,
            axisY = e.p1.x - e.p0.x
            
        var len = 1.0/Math.hypot(axisX, axisY)
        axisX *= len
        axisY *= len

        dataA = projectToAxis(b1, axisX, axisY)
        dataB = projectToAxis(b2, axisX, axisY)

        var dist = intervalDistance( dataA.min, dataA.max, dataB.min, dataB.max );
        
        // No collision
        if (dist > 0.0) 
            return false
        
        if (Math.abs(dist) < minDist)
        {
            minDist = Math.abs(dist)

            // Collision info
            colInfo.normal.x = axisX
            colInfo.normal.y = axisY
            colInfo.e = e
            colInfo.parent = parent             
        }
    }

    colInfo.depth = minDist

    // Work assuming parent as b2, so swap if not so
    if (colInfo.parent != b2)
        [b1, b2] = [b2, b1]

    var xx = b1.center.x - b2.center.x
    var yy = b1.center.y - b2.center.y
    var mult = colInfo.normal.x * xx + colInfo.normal.y * yy

    // Revert collision if points away from b1
    if (mult < 0) 
    {
        colInfo.normal.x = -colInfo.normal.x
        colInfo.normal.y = -colInfo.normal.y
    }

    var smallestDist = 100000.0

    for (let i = 0; i < b1.path.length; i++) 
    {
        var vert = b1.path[i]
        
        xx = vert.x - b2.center.x
        yy = vert.y - b2.center.y
        var dist = colInfo.normal.x * xx + colInfo.normal.y * yy
        
        if (dist < smallestDist)
        {
            smallestDist = dist
            colInfo.v = vert
        }
    }

    return true
}

function processCollision()
{
    var e1 = colInfo.e.p0,
        e2 = colInfo.e.p1

    var colVecX = colInfo.normal.x * colInfo.depth,
        colVecY = colInfo.normal.y * colInfo.depth

    var t
    if ( Math.abs( e1.x - e2.x ) > Math.abs( e1.y - e2.y ) )
        t = ( colInfo.v.x - colVecX - e1.x ) / ( e2.x - e1.x )
    else
        t = ( colInfo.v.y - colVecY - e1.y ) / ( e2.y - e1.y )

    // Mass = 1 (all objs have same mass)
    var lambda = 1.0/( t*t + ( 1.0 - t )*( 1.0 - t ) )
    var edgeMass = t*1 + ( 1.0 - t )*1 
    var invColMass = 1.0/( edgeMass + 1)

    var ratio1 = 1*invColMass
    var ratio2 = edgeMass*invColMass

    e1.x -= colVecX * (( 1 - t )*ratio1*lambda)
    e1.y -= colVecY * (( 1 - t )*ratio1*lambda)
    e2.x -= colVecX * (    t    *ratio1*lambda)
    e2.y -= colVecY * (    t    *ratio1*lambda)
    
    colInfo.v.x += colVecX * ratio2
    colInfo.v.y += colVecY * ratio2
}

function projectToAxis(box, axisX, axisY) 
{
    var dotP = axisX * box.path[0].x + axisY * box.path[0].y
    var data = 
    {
        min: dotP,
        max: dotP
    }

    for (let i = 0; i < 4; i++ ) 
    {
        dotP = axisX * box.path[i].x + axisY * box.path[i].y  //Project the rest of the vertices onto the axis and extend the interval to the left/right if necessary
        data.min = Math.min( dotP, data.min )
        data.max = Math.max( dotP, data.max )
    }
    
    return data
}

function intervalDistance(minA, maxA, minB, maxB) 
{
    if (minA < minB) return minB - maxA
    else             return minA - maxB
}

function overlap(b1, b2)
{
    return (
        ( b1.min.x <= b2.max.x ) && 
        ( b1.min.y <= b2.max.y ) && 
        ( b1.max.x >= b2.min.x ) && 
        ( b2.max.y >= b1.min.y )
    )
}

function distance(p0, p1)
{
    var dx = p1.x - p0.x,
        dy = p1.y - p0.y
    return Math.sqrt(dx * dx + dy * dy)
}

// HELPERS
function createBox(x,y,size,vel)
{
    // CORNERS
    var p0 = {
        x: x, 
        y: y,
        oldx: x + vel,
        oldy: y + vel
    },
    p1 = {
        x: x + size, 
        y: y,
        oldx: x + vel + size,
        oldy: y + vel
    },
    p2 = {
        x: x + size, 
        y: y + size,
        oldx: x + vel + size,
        oldy: y + vel + size
    },
    p3 = {
        x: x, 
        y: y + size,
        oldx: x + vel,
        oldy: y + vel + size
    }

    points.push(p0, p1, p2, p3)

    // STICKS
    var s0 = {
        p0: p0,
        p1: p1,
        length: distance(p0, p1)
    },
    s1 = {
        p0: p1,
        p1: p2,
        length: distance(p1, p2)
    },
    s2 = {
        p0: p2,
        p1: p3,
        length: distance(p2, p3)
    },
    s3 = {
        p0: p3,
        p1: p0,
        length: distance(p3, p0)
    },
    // supports
    s4 = {
        p0: p0,
        p1: p2,
        length: distance(p0, p2)
    },
    s5 = {
        p0: p1,
        p1: p3,
        length: distance(p1, p3)
    }

    sticks.push(s0, s1, s2, s3, s4, s5)

    // BOX
    var box = { 
        path: [ p0, p1, p2, p3 ],
        edge: [ s0, s1, s2, s3 ],
        min: { x: p0.x, y: p0.y },
        max: { x: p2.x, y: p2.y },
        center: { x: x + size / 2, y: y + size / 2 },
        size: size
    }
    boxes.push(box)

    return box
}
function pinBox(box, pin)
{
    box.path[0].pinned = pin;
    box.path[1].pinned = pin;
    box.path[2].pinned = pin;
    box.path[3].pinned = pin;
}
function setBoxPos(box, x, y)
{
    box.x = x
    box.y = y
    box.path.forEach(p => {
        p.oldx = p.x;
        p.oldy = p.y;
    });
    box.path[0].x = box.path[0].oldx = x - box.size/2;
    box.path[0].y = box.path[0].oldy = y - box.size/2;
    box.path[1].x = box.path[1].oldx = x + box.size/2;
    box.path[1].y = box.path[1].oldy = y - box.size/2;
    box.path[2].x = box.path[2].oldx = x + box.size/2;
    box.path[2].y = box.path[2].oldy = y + box.size/2;
    box.path[3].x = box.path[3].oldx = x - box.size/2;
    box.path[3].y = box.path[3].oldy = y + box.size/2;
}
function moveBox(box, x, y)
{
    box.x = x
    box.y = y
    pinBox(box, true);
    box.path.forEach(p => {
        p.oldx = p.x;
        p.oldy = p.y;
    });
    box.path[0].x = x - box.size/2;
    box.path[0].y = y - box.size/2;
    box.path[1].x = x + box.size/2;
    box.path[1].y = y - box.size/2;
    box.path[2].x = x + box.size/2;
    box.path[2].y = y + box.size/2;
    box.path[3].x = x - box.size/2;
    box.path[3].y = y + box.size/2;
}
function contains(box, x, y)
{
    return  box.min.x < x && x < box.max.x &&
            box.min.y < y && y < box.max.y;
}