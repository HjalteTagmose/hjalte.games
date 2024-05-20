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
}

loadImage("imgs/metop.png").then(img => me.top = img)
loadImage("imgs/mebottom.png").then(img => me.bottom = img)

addEventListener("render", args => me.render(args.context, width/2, 10))
addEventListener("rendershadow", args => me.render(args.context, width/2, 10))
addEventListener("update", args => animate(args.delta))

function animate(delta) {
    me.idle(delta)
}