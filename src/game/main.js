function getNonZeroRandomNumber() {
    var random = Math.floor(Math.random() * 199) - 99;
    if (random == 0) return getNonZeroRandomNumber();
    return random;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomBetween(min, max) {
    if (min < 0) {
        return min + Math.random() * (Math.abs(min) + max);
    } else {
        return min + Math.random() * max;
    }
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

var gameTime = 0;
var textCount = 0;
var spriteDelay = 1000;

var WALL = Math.pow(2,0),
BLOCK =  Math.pow(2,1),
BALL = Math.pow(2,2),
TOPBOTTOM = Math.pow(2, 3)
SPECIALBLOCK = Math.pow(2, 4)

game.module(
    'game.sprites',
    'game.main'
)
.require(
    'engine.core',
    'plugins.p2'
)
.body(function() {

    //game.addAsset('panda.png');
    game.addAsset('Background.jpg');
    game.addAsset('Background.png');
    game.addAsset('Circle.png');
    game.addAsset('Square.png');
    game.addAsset('Triangle.png');
    game.addAsset('High-Score.png');
    game.addAsset('Orb.png');
    game.addAsset('panda.png');
    game.addAsset('start.png');
    game.addAsset('splash.jpg');
    game.addAsset('You-Lose.png');
    game.addAsset('Winner.png');
    game.addAsset('Game-Title.png');
    game.addAsset("goodblock.png");
    game.addAsset("goodblock2.png");

    game.addAudio('punch.ogg', 'punch');
    game.addAudio('Blop.ogg', 'Blop');
    game.addAudio('Special.ogg' , 'Special')


    var topspeed = 500;
    var yaccel = 50;
    var xaccel = 20;

    game.createClass('Wall', {

        init: function (x, y, width, height) {

            this.shape = new game.Graphics();
            this.shape.beginFill(0x000000, 1);
            this.shape.drawRect(x, y, width, height);
            this.shape.endFill();
            //game.scene.stage.addChild(this.shape);

            this.shaperect = new game.Rectangle(game.system.width, height);
            this.body = new game.Body({
            });

            this.body.addShape(this.shaperect);
            this.body.position[0] = 0;
            this.body.position[1] = 0;
           game.scene.world.addBody(this.body);
        }
    });

    game.createClass('LeftWall', {

        init: function (x, y, width, height) {

            //this.shape = new game.Graphics();
            //this.shape.beginFill(0x000000, 1);
            //this.shape.drawRect(x, y, width, height);
            //this.shape.endFill();
            //game.scene.stage.addChild(this.shape);
            this.shaperect = new game.Rectangle(width, height);

            this.body = new game.Body({
                position: { x: x, y: y },
                collisionGroup: 4,
                collideAgainst: [9],
                fixed: true
            });
            this.body.addShape(this.shaperect);
            game.scene.world.addBody(this.body);
        }
    });

    game.createClass('SpecialBlock', {
        size: 50,
        init: function (x, y) {

            game.audio.playSound("Special", false);

            var shapetype = "";
            var shape = null;
            var str = "";
            shape = new game.Circle(this.size / 2 / game.scene.world.ratio);
            
            var rnd = Math.random();
            if (rnd <= 0.5) {
                str = "goodblock.png";
                shapetype = "slowdown";
            }
            else {
                str = "goodblock2.png";
                shapetype = "invulnerable";
                game.invulnerable = true;
            }

            shape.collisionGroup = SPECIALBLOCK;
            shape.collisionMask = BALL | BLOCK | TOPBOTTOM;

            this.body = new game.Body({
                gravityScale: 0,
                mass: 0.1,
                position: [
                    x / game.scene.world.ratio,
                    y / game.scene.world.ratio
                ],
                angularVelocity: 10
            });
            this.body.addShape(shape);

            // Apply velocity
            var force = randomBetween(2, 5);

            var angle = randomBetween(-100, 100) / game.scene.world.ratio;

            this.body.velocity[0] = 1 * force;
            this.body.velocity[1] = angle * force;
            //this.body.velocity[1] = 0.1 * force;

            //this.body.setDensity(0.1);

            this.sprite = new game.Sprite(str);

            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.scale.set(0.3, 0.3);
            this.sprite.position.set(x, y);

            this.body.options = { sprite: this.sprite, shapetype: shapetype };

            //game.scene.addObject(this);
            game.scene.stage.addChild(this.sprite);
            game.scene.world.addBody(this.body);
            game.scene.addTimer(8000, this.remove.bind(this));

        },
        remove: function () {
            game.scene.removeObject(this);
            game.scene.stage.removeChild(this.sprite);
            game.scene.world.removeBody(this.body);

        },
        update: function () {
            this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
            this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
            this.sprite.rotation = this.body.angle;
            this.body.gravityScale = 0;
        }
    });

    game.createClass('Block', {
        size: 50,
        init: function (x, y) {

            //console.log("blobk");
            game.audio.playSound("Blop", false);
            var shapetype = "block";
            var shape = null;
            var str = "";
            var rnd = Math.random();
            if (rnd <= 0.33) {
                shape = new game.Circle(this.size / 2 / game.scene.world.ratio);
                str = "Circle.png";
            }
            else if (rnd >= 0.66) {
                shape = new game.Rectangle(this.size / game.scene.world.ratio, this.size / game.scene.world.ratio);
                str = "Square.png";
            }
            else {
                var vertices = [];
                for (var i = 0, N = 3; i < N; i++) {
                    var a = 2 * Math.PI / N * i;
                    var vertex = [1 * 0.4 * Math.cos(a), 1 * 0.4 * Math.sin(a)]; // Note: vertices are added counter-clockwise
                    vertices.push(vertex);
                }
                var p = new game.Convex(vertices);
                shape = p;
                str = "Triangle.png";
            }

            shape.collisionGroup = BLOCK;
            shape.collisionMask = BALL | BLOCK | TOPBOTTOM;

            this.body = new game.Body({
                gravityScale: 0,
                mass: 0.1,
                position: [
                    x / game.scene.world.ratio,
                    y / game.scene.world.ratio
                ],
                angularVelocity: 10
            });
            this.body.addShape(shape);

            // Apply velocity
            var force = randomBetween(3, 6);

            var angle = randomBetween(-100,100) / game.scene.world.ratio;

            this.body.velocity[0] = 1 * force;
            this.body.velocity[1] = angle * force;
            //this.body.velocity[1] = 0.1 * force;

            //this.body.setDensity(0.1);

            this.sprite = new game.Sprite(str);

            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.scale.set(0.081, 0.081)
            this.sprite.position.set(x, y);

            this.body.options = { sprite: this.sprite, shapetype: shapetype };

            //game.scene.addObject(this);
            game.scene.stage.addChild(this.sprite);
            game.scene.world.addBody(this.body);
            game.scene.addTimer(8000, this.remove.bind(this));
            
        },
        remove: function () {
            game.scene.removeObject(this);
            game.scene.stage.removeChild(this.sprite);
            game.scene.world.removeBody(this.body);
        },
        update: function () {
            this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
            this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
            this.sprite.rotation = this.body.angle;
            this.body.gravityScale = 0;
        }
});

game.createClass('Button', {

    init: function () {
        //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
        this.sprite = new game.Sprite('start.png');
        this.sprite.position = { x: game.system.width / 2, y: game.system.height / 2 };
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.8;
        this.sprite.scale.y = 0.8;
        this.sprite.interactive = true;
        //add body of this sprite to the world object
        //game.scene.world.addBody(this.body);
        //add sprite to display container
        //game.scene.stage.addChild(this);
        //game.scene.addObject(this.sprite);
        this.sprite.click = function () {
            //console.log("sprite received a click!");
            game.system.setScene('Main');
        };
        var t = this;
        this.sprite.mouseover = function () {
            t.sprite.scale = { x: 1.1, y: 1.1 };
        }

        this.sprite.mouseout = function () {
            t.sprite.scale = { x: 1.0, y: 1.0 };
        }

        game.scene.stage.addChild(this.sprite);
    }
});

game.createScene('Win', {
    backgroundColor: 0x000000,

    init: function () {
        this.sprite = new game.TilingSprite('splash.jpg', 1024, 768);
        this.sprite.addTo(game.scene.stage);
        this.sprite2 = new game.TilingSprite('Winner.png');
        this.sprite2.position.x = 200;
        this.sprite2.position.y = 105;
        this.sprite2.addTo(game.scene.stage);

        this.addObject(new game.Button());


    }
});

game.createScene('Lose', {
    backgroundColor: 0x000000,

    init: function () {
        game.audio.playSound("punch", false);

        this.sprite = new game.TilingSprite('splash.jpg', 1024, 768);
        this.sprite.addTo(game.scene.stage);


        var gametime = Math.round(game.delta * 10000000000);

        this.textobject = new game.PIXI.Text(gametime / 10000000, {
            font: '72px Arial',
            fill: "#fd0000",
            stroke: '#000000',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 5
        });
        game.scene.stage.addChild(this.textobject);
        this.textobject.position.x=440
        this.textobject.position.y=220

        var hs = localStorage.getItem("highscore");
         if (gameTime > hs) {
        // if(true){
            localStorage.setItem("highscore", gameTime);
            this.sprite2 = new game.Sprite('High-Score.png');
            this.sprite2.position.x = 200;
            this.sprite2.position.y = 105;
            this.sprite2.scale.x =1.2 ;
            this.sprite2.scale.y =1.2 ;
            this.sprite2.addTo(game.scene.stage);
        }
        else {
            this.sprite2 = new game.Sprite('You-Lose.png');
            this.sprite2.position.x = 200;
            this.sprite2.position.y = 105;
            this.sprite2.addTo(game.scene.stage);
           
        }

        this.addObject(new game.Button());

        gameTime = 0;
        textCount = 0;
        spriteDelay = 1000;


    }
});


game.createClass('Ball', {
    textobject: null,
    interactive: true,
    init: function (x, y) {

        var shape = new game.Circle(25 / game.scene.world.ratio);
        shape.collisionGroup = BALL;
        shape.collisionMask = BLOCK | WALL | TOPBOTTOM | SPECIALBLOCK;
        this.body = new game.Body({
            mass: 0.2,
            gravityScale: 1,
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ]
           
        });
        this.body.addShape(shape);


        

        this.sprite = new game.Sprite('Orb.png');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.width = 50;
        this.sprite.height = 50;
        this.sprite.position.set(x, y);
        
        //game.scene.addObject(this);
        game.scene.stage.addChild(this.sprite);
        game.scene.world.addBody(this.body);



        this.body.collide = this.collide.bind(this);

    },
	
        collide: function(obj) {
            console.log("Collision!");
        },
    update: function () {
        //this.gametime++;
        gameTime++;

        if (gameTime % 60 == 1) {
            
            if (spriteDelay > 100) {
                spriteDelay = spriteDelay - 25;
                game.scene.world.timer.set(spriteDelay);
            }
        }

        


        //game.world.gametimer.setText(gameTime);
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        this.sprite.angle = this.body.angle;

        //this.sprite.position[0] = this.body.position[0];
       // this.sprite.position[1] = this.body.position[1];
        //this.body.velocity[0] = (this.mouse.x - this.body.position[0]);
        //this.body.velocity[1] = (this.mouse.y - this.body.position[1]);


        //console.log(this.body.velocity[0]);
        //console.log(this.body.position.x);

        //console.log(this.body.position.y);
    /*
        if (this.body.position.x < 0) {
            game.system.setScene('Win');
        }*/

            // Check if key is currently down
        if (game.keyboard.down('LEFT')) {
            
            this.body.velocity[0] -= xaccel / game.scene.world.ratio;

        }
        if (game.keyboard.down('RIGHT')) {
            this.body.velocity[0] += xaccel / game.scene.world.ratio;
        }
        if (game.keyboard.down('UP')) {
            this.body.velocity[1] -= yaccel / game.scene.world.ratio;
        }
        if (game.keyboard.down('DOWN')) {
            this.body.velocity[1] += yaccel / game.scene.world.ratio;
        }

        //this.sprite.position.x = this.body.position.x;
        //this.sprite.position.y = this.body.position.y;
        //this.sprite.angle = this.body.angle;



    }
});

game.createScene('Start', {
    backgroundColor: 0x000000,

    init: function () {
        this.sprite = new game.TilingSprite('splash.jpg', 1024, 768);
        this.sprite2 = new game.TilingSprite('Game-Title.png');
        this.sprite2.position.x = 260;
        this.sprite2.position.y = 105;
        this.sprite2.scale.x = 1.5
        this.sprite2.scale.y = 1.5
        this.sprite.addTo(game.scene.stage);
        this.sprite2.addTo(game.scene.stage);
        this.addObject(new game.Button());


    }
});

game.createScene('Main', {
    backgroundColor: 0xb9bec7,
    update: function () {
        this.world.textsprite.setText("");
        game.delta += game.system.delta;
        //console.log(gametime);
        var gametime = Math.round(game.delta * 10000000000);
        this.world.textsprite.setText(gametime / 10000000);
        this._super();
        
    },
    mousemove: function(e) {

        //console.log(e.global.y);
        this.world.ball.body.velocity[0] = ((e.global.x / this.world.ratio - this.world.ball.body.position[0]))*1.3;
        this.world.ball.body.velocity[1] = ((e.global.y / this.world.ratio - this.world.ball.body.position[1]))*1.5;

        //console.log("test");
    },
    init: function() {
        //this.world = new game.World(0, 1000);
        this.world = new game.World({ gravity: [0,0] });
        this.world.ratio = 100;
        this.world.gameTime = gameTime;
        game.delta = game.system.delta;
        game.invulnerable = false;

        var wld = this.world;
        var g = this;

        this.world.on("beginContact", function (event) {

                if ((event.shapeB.collisionGroup == BALL && event.shapeA.collisionGroup == BLOCK) || (event.shapeB.collisionGroup == BLOCK && event.shapeA.collisionGroup == BALL)) {

                    if (!game.invulnerable) {
                        game.system.setScene('Lose');
                    }
                }

                if ((event.shapeB.collisionGroup == BALL && event.shapeA.collisionGroup == SPECIALBLOCK)) 
                {
                    game.scene.world.removeBody(event.bodyA);
                    game.scene.stage.removeChild(event.bodyA.options.sprite);
                        
                    var st = event.bodyA.options.shapetype;
                    if (st) {
                        if (st == "invulnerable") {
                            wld.ball.sprite.alpha = 0.5;
                            game.invulnerable = true;

                            g.addTimer(5000, function () {
                                game.invulnerable = false;
                                wld.ball.sprite.alpha = 1;
                            }, false);
                        }
                        else {
                            spriteDelay = 850;
                        }
                    }
                }

                if (event.shapeB.collisionGroup == SPECIALBLOCK && event.shapeA.collisionGroup == BALL) {

                        game.scene.world.removeBody(event.bodyB);
                        game.scene.stage.removeChild(event.bodyB.options.sprite);
                        

                        var st = event.bodyB.options.shapetype;
                        if (st) {
                            if (st == "invulnerable") {
                                wld.ball.sprite.alpha = 0.5;
                                game.invulnerable = true;
                                g.addTimer(5000, function () {
                                    game.invulnerable = false;
                                    wld.ball.sprite.alpha = 1;
                                }, false);


                            }
                            else {
                                spriteDelay = 850;
                            }
                        }

                        //event.bodyB.remove();
  
                }


        });

        var sprite = new game.TilingSprite('Background.png', 0, 0);
        sprite.speed.x =400;
        sprite.addTo(game.scene.stage);
        game.scene.addObject(sprite);

        // Add walls
        var wallShape, wallBody;

        wallShape = new game.Rectangle(50 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallShape.collisionGroup = WALL;
        wallShape.collisionMask = BALL;
        wallBody = new game.Body({
            position: [0, game.system.height / 2 / this.world.ratio]
        });

        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);


        wallShape = new game.Rectangle(50 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallShape.collisionGroup = WALL;
        wallShape.collisionMask = BALL;
        wallBody = new game.Body({
            position: [game.system.width / this.world.ratio, game.system.height / 2 / this.world.ratio]
        });

        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(game.system.width / this.world.ratio, 50 / this.world.ratio);
        wallShape.collisionGroup = TOPBOTTOM;
        wallShape.collisionMask = BALL | BLOCK | SPECIALBLOCK;
        wallBody = new game.Body({
            position: [game.system.width / 2 / this.world.ratio, game.system.height / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(game.system.width / this.world.ratio, 50 / this.world.ratio);
        wallShape.collisionGroup = TOPBOTTOM;
        wallShape.collisionMask = BALL | BLOCK | SPECIALBLOCK;
        wallBody = new game.Body({
            position: [game.system.width / 2 / this.world.ratio, 0]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        /*
        var numblocks = 6;

        for (var i = 0; i < numblocks; i++) {
            game.scene.addObject(new game.Block('Square.png'));
        }
        for (var i = 0; i < numblocks; i++) {
            game.scene.addObject(new game.Block('Circle.png'));
        }
        for (var i = 0; i < numblocks; i++) {
            game.scene.addObject(new game.Block('Triangle.png'));
        }*/

        this.world.timer = this.addTimer(spriteDelay, function () {
            var object = new game.Block(-120, game.system.height / 2);
            game.scene.addObject(object);
        }, true);

        var newdelay = randomBetween(5000, 6000);
        this.world.specialtimer = this.addTimer(newdelay, function () {
            var object = new game.SpecialBlock(-120, game.system.height / 2);
            game.scene.addObject(object);
        }, true);

        this.world.ball = new game.Ball(890, 350);
        game.scene.addObject(this.world.ball);

        this.world.textsprite = new game.PIXI.Text("Hello World!", { font: '60px Arial' });
        this.world.textsprite.addTo(game.scene.stage);

        //var text = new game.BitmapText('Hello', { font: 'Arial' });
        //this.addObject(text);


        //console.log(game.system.width);
        //console.log(game.system.height);
        //game.scene.addObject(new game.Wall(0, 30, 3000, 20));
        //game.scene.addObject(new game.Wall(0, 740, 3000, 1500));

        //this.addObject(new game.Wall(1024+25, 0, 50, 2000));
        //this.addObject(new game.Wall(95, 80, 50, 2000));
        //this.addObject(new game.Wall(920, 80, 50, 2000));

        



    }

});

});
