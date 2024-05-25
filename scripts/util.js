async function loadImage(url) 
{
    var img = document.createElement("img");
    img.style = "border-radius: 15px;"
    img.src = url;
    return img;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function lerp(a, b, t) {
    return a + t * (b - a);
}

function smoothstep(edge0, edge1, x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * (3.0 - 2.0 * x);
}

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x
}

function rndPointInCircle(radius, centerX, centerY) {
    r = radius * Math.sqrt(Math.random())
    theta = Math.random() * 2 * Math.PI
    x = centerX + r * Math.cos(theta)
    y = centerY + r * Math.sin(theta)
    return { x, y }
}

function veclen(x, y) {
    return Math.sqrt( x**2 + y**2 );
}

function vecnorm(x, y) {
    let len = veclen(x, y);
    return { x: x/len, y: y/len };
}

function vecdir(fromX, fromY, toX, toY) {
    let x = toX-fromX
    let y = toY-fromY
    let len = veclen(x, y);
    return vecnorm(x, y)
}

function pinBox(box, pin)
{
    if (box == null) return;
    box.path[0].pinned = pin;
    box.path[1].pinned = pin;
    box.path[2].pinned = pin;
    box.path[3].pinned = pin;
}