$.getJSON("games.json", function(data) {
    parseJSON(data)
});

async function parseJSON(data) {
    var i = 0;
    data.boxes.forEach(async game => {
        var size = (game.size ?? 100) * data.sizeMultiplier
        var rnd = Math.random() * 30 - 15
        var pos = 
        {
            x: (size*150) * i % window.innerWidth - 500, 
            y: (size*150) * i / Math.floor((window.innerWidth - size) / size)
        }
        var box = createBox(
            pos.x, pos.y, size, rnd
        )
        i++
        
        await loadImage(game.imgPath).then(img => game.img = img)
        box.game = game
        box.hidden = true
        pinBox(box, true)
        
        // test show
        // box.hidden = false
        // pinBox(box, false)
        // console.log("puke: "+box.game.name)
    });
}


createHat(250,250)
var hat = { x: 250, y: 250, w: 300, h: 100, img: null }

async function createHat(x,y)
{
    var p0 = {
        x: x, 
        y: y,
        oldx: x,
        oldy: y,
    },
    p1 = {
        x: x + 75, 
        y: y,
        oldx: x + 75,
        oldy: y,
    },
    p2 = {
        x: x + 125, 
        y: y - 50,
        oldx: x + 125,
        oldy: y - 50,
    },
    p3 = {
        x: x + 175, 
        y: y - 50,
        oldx: x + 175,
        oldy: y - 50,
    },
    p4 = {
        x: x + 225, 
        y: y,
        oldx: x + 225,
        oldy: y,
    },
    p5= {
        x: x + 300, 
        y: y,
        oldx: x + 300,
        oldy: y,
    }
    

    points.push(p0, p1, p2, p3, p4, p5)

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
        p1: p4,
        length: distance(p3, p4)
    },
    s4 = {
        p0: p4,
        p1: p5,
        length: distance(p4, p5)
    }

    sticks.push(s0, s1, s2, s3, s4)
    await loadImage("hat_art.png").then(img => hat.img = img)
}
