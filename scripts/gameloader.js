$.getJSON("games.json", function(data) {
    parseJSON(data)
});

async function parseJSON(data) {
    var i = 0;
    data.boxes.forEach(async game => {
        var size = (game.size ?? 100) * data.sizeMultiplier;
        var rnd = Math.random() * 30 - 15;
        var pos = 
        {
            x: (size*150) * i % window.innerWidth - 500, 
            y: (size*150) * i / Math.floor((window.innerWidth - size) / size)
        }
        var box = createBox(
            pos.x, pos.y, size, rnd
        ); 
        i++;
        
        await loadImage(game.imgPath).then(img => game.img = img);
        box.game = game;
        box.hidden = true;
        pinBox(box, true)
    });
}