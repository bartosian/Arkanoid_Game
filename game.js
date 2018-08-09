let game = {
    ctx: undefined,
    platform: undefined,
    ball: undefined,
    width: 640,
    height: 360,
    running: true,
    score: 0,
    rows: 4,
    cols: 8,
    blocks: [],
    sprites: {
      background: undefined,
      platform: undefined,
      ball: undefined,
      blocks: undefined
    },
    init: function() {
        let canvas = document.getElementById("myCanvas");
        this.ctx = canvas.getContext("2d");
        this.ctx.font = "Arial 20px";
        this.ctx.fillStyle = "white";

        window.addEventListener("keydown", function (e) {
            if(e.keyCode === 37) {
                game.platform.dx = -game.platform.velocity;
            } else if(e.keyCode === 39) {
                game.platform.dx = game.platform.velocity;
            } else if(e.keyCode === 32) {
                game.platform.releaseBall();
            }
        });
        window.addEventListener("keyup", function (e) {
            game.platform.stop();
        });


    },
    load: function() {
        this.sprites.background = new Image();
        this.sprites.background.src = "img/backg.png";

        this.sprites.platform = new Image();
        this.sprites.platform.src = "img/platform.png";

        this.sprites.ball = new Image();
        this.sprites.ball.src = "img/ball.png";

        this.sprites.block = new Image();
        this.sprites.block.src = "img/block.png";
    },
    create: function() {
        for(let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++) {
                this.blocks.push({
                    x: 68 * col + 50,
                    y: 38 * row + 35,
                    width: 64,
                    height: 32,
                    isAlive: true
                });
            }
        }

    },
    start: function() {
        this.init();
        this.load();
        this.create();
        this.run();

    },
    render: function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);

        this.ctx.drawImage(this.sprites.ball, this.ball.width * this.ball.frame, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.blocks.forEach(function(el) {
            if(el.isAlive) {
                this.ctx.drawImage(this.sprites.block, el.x, el.y);
            }

        this.ctx.fillText("S C O R E : " + this.score, 15, this.height - 15);

        }, this);

        },
    update() {
        if(this.ball.collide(this.platform)) {
            this.ball.bumpPlatform(this.platform);
        }
        if(this.platform.dx) {
            this.platform.move();
        }
        if(this.ball.dx || this.ball.dy) {
            this.ball.move();
        }

        this.blocks.forEach(function(el) {
            if(el.isAlive) {
                if(this.ball.collide(el)) {
                    this.ball.bumpBlock(el);
                }
            }

        }, this);

        this.ball.checkBounds();
    },
    run: function() {
        this.update();
        this.render();

        if(this.running) {
            window.requestAnimationFrame(function() {
                game.run();
            });
        }

    },
    over: function(message) {
        this.running = false;
        alert(message);
        window.location.reload();
    }
};

game.ball = {
    width: 22,
    height: 22,
    frame: 0,
    x: 345,
    y: 278,
    dx: 0,
    dy: 0,
    velocity: 3,
    jump: function() {
        this.dy = - this.velocity;
        this.dx = - this.velocity;
        this.animate();
    },
    animate: function() {
        setInterval(function () {
            ++game.ball.frame;

            if(game.ball.frame > 3) {
                game.ball.frame = 0;
            }
        }, 100);

    },
    move: function () {
        this.x += this.dx;
        this.y += this.dy;

    },
    collide: function(element) {
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        if(x + this.width > element.x &&
           x < element.x + element.width &&
           y + this.height > element.y &&
           y < element.y + element.height
        ) {
            return true
        }
    },
    bumpBlock: function(block) {
        ++game.score;
        this.dy *= -1;
        block.isAlive = false;

        if(game.score >= game.blocks.length) {
            game.over("You win!");
        }
    },
    onTheLeftSide: function(platform) {
        return (this.x + this.width/2) < (platform.x + platform.width/2);
    },
    bumpPlatform: function(platform) {
        this.dy = -this.velocity;
        this.dx = this.onTheLeftSide(platform) ? -this.velocity : this.velocity;
    },
    checkBounds: function () {
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        if(x < 0) {
            this.x = 0;
            this.dx = this.velocity;
        } else if(x + this.width > game.width) {
            this.x = game.width - this.width;
            this.dx = -this.velocity;
        } else if(y < 0) {
            this.y = 0;
            this.dy = this.velocity;
        } else if(y + this.height > game.height) {
            game.over("Game Over!");
        }
    }
};

game.platform = {
    x: 300,
    y: 300,
    velocity: 6,
    dx: 0,
    width: 120,
    height: 40,
    ball: game.ball,
    move: function () {
        this.x += this.dx;

        if(this.ball) {
            this.ball.x += this.dx;
        }
    },
    stop: function() {
        this.dx = 0;

        if(this.ball) {
            this.ball.dx = 0;
        }
    },
    releaseBall: function () {
        if(this.ball) {
            this.ball.jump();
            this.ball = false;
        }
    }
};



window.addEventListener("load", function() {
    game.start();
});