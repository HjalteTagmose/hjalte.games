const Anim = Object.freeze({ 
    IDLE: 0,
    TALK: 1,
    PUKE: 2,
}); 
let curAnimation = Anim.IDLE

var me =
{
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    width: 200,
    height: 200,
    
    t: 0,
    mouthPos: 0,
    mouthOpen: false,
    moveSpeed: .5,
    talkSpeed: 150,

    //#region Animations
    render: function(context, x, y) {
        mid = this.width/2
        this.x = x-this.offsetX-mid
        this.y = y-this.offsetY
        context.drawImage(this.top, this.x, this.y, this.width, this.height)
        context.drawImage(this.bottom, this.x, this.y+this.mouthPos, this.width, this.height)
    },
    center: function(delta) {
        this.offsetX = lerp(this.offsetX, -this.offsetX, delta)
    },
    idle: function(delta) {
        this.setMouth(false)
        if (this.t > 1)
        {
            this.moveRight = !this.moveRight
            this.t = 0
        }

        this.t += delta * this.moveSpeed
        const v = smoothstep(0, 1, this.t)

        if (!this.moveRight)
            this.offsetY = (v * -20)+10
        else
            this.offsetY = (v *  20)-10
    },
    talk: function(delta) {
        delta = delta * this.talkSpeed
        if (!this.mouthOpen)
        {
            this.mouthPos += delta
            if (this.mouthPos > 10)
                this.mouthOpen = true;
        }
        else
        {
            this.mouthPos -= delta
            if (this.mouthPos < 0)
                this.mouthOpen = false;
        }
    },
    puke: function(delta) {
        this.t += delta
        if (this.t > 0.05) 
        {
            this.setMouth(!this.mouthOpen)
            point = rndPointInCircle(15,0,0)
            this.offsetX = point.x
            this.offsetY = point.y
            this.t = 0
        }
    },
    setMouth: function(open) {
        this.mouthOpen = open
        this.mouthPos = open ? 20 : 0  
    },
    //#endregion

    contains: function(x, y)
    {
        return  x < this.width  + this.x && 
                y < this.height + this.y &&
                x > this.x && 
                y > this.y 
    }
}

loadImage("imgs/metop.png").then(img => me.top = img)
loadImage("imgs/mebottom.png").then(img => me.bottom = img)

addEventListener("render", args => me.render(args.context, width/2, 10))
addEventListener("rendershadow", args => me.render(args.context, width/2, 10))
addEventListener("update", args => animate(args.delta))
addEventListener("startwrite", args => curAnimation = Anim.TALK)
addEventListener("endwrite", args => curAnimation = Anim.IDLE)

function animate(delta) {
    switch (curAnimation) {
        case Anim.IDLE: me.idle(delta); break
        case Anim.TALK: me.talk(delta); break
        case Anim.PUKE: me.puke(delta); break
        default: console.error("no animation for: " + curAnimation); break
    }
}


//#region TEST
let gamesClear = true
addEventListener("mousedown", _ => {
    if (gamesClear) puke()
    else clearBoxes()
    gamesClear = !gamesClear
})
// TEST PUKE
let pukes = 0
let pukeDelay = 150
async function puke()
{
    for (let i = 0; i < boxes.length; i++)
    {
        var box = boxes[i];
        if (box.hidden)
        {
            setBoxPos(box, me.x+100, me.y+150)
            box.hidden = false
            pinBox(box, false)
            box.game.puke = 1
            console.log("puke: "+ box.game.name)
            await sleep(pukeDelay)
            // if (pukes % 3 === 0) playSound('puke')
            pukes++
        }
    }
}
// TEST CLEAR
async function clearBoxes() 
{
    floorOffset = 50000
    await sleep(1200)
    floorOffset = 0 
    for (let i = 0; i < boxes.length; i++)
    {
        var b = boxes[i];
        b.hidden = true
        pinBox(b, true)
    }
}
//#endregion