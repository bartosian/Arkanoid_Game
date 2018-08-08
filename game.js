let game = {
    ctx: undefined,
    platform: undefined,
    width: 640,
    height: 360,
    sprites: {
      background: undefined,
      platform: undefined
    },
    start: function() {
        let canvas = document.getElementById("myCanvas");
        this.ctx = canvas.getContext("2d");

        this.sprites.background = new Image();
        this.sprites.background.src = "img/backg.png";

        this.sprites.platform = new Image();
        this.sprites.platform.src = "img/platform.png";

        this.run();

    },
    render: function() {
        this.ctx.clearReact(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
    },
    run: function() {
        this.render();
        window.requestAnimationFrame(function() {
            game.run();
        });
    }
};

game.platform = {
    x: 300,
    y: 300
};

window.addEventListener("load", function() {
    game.start();
});