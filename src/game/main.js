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

var gameTime = 0;
var textCount = 0;

var WALL = Math.pow(2,0),
BLOCK =  Math.pow(2,1),
BALL = Math.pow(2,2)

game.module(
    'game.sprites'
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
    game.addAsset('Orb.png');
    game.addAsset('panda.png');
    game.addAsset('start.png');
    game.addAsset('Splash.jpg');
    game.addAsset('You-Lose.png');
    game.addAsset('Winner.png');
    game.addAsset('Game-Title.png')

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

    game.createClass('Block', {
        size: 50,
        init: function (x,y) {
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
                    var vertex = [1 * 0.5 * Math.cos(a), 1 * 0.5 * Math.sin(a)]; // Note: vertices are added counter-clockwise
                    vertices.push(vertex);
                }
                var p = new game.Convex(vertices);
                shape = p;
                str = "Triangle.png";
            }

            shape.collisionGroup = BLOCK;
            shape.collisionMask = BALL | BLOCK;

            this.body = new game.Body({
                gravityScale: 0,
                mass: 0.1,
                position: [
                    x / game.scene.world.ratio,
                    y / game.scene.world.ratio
                ],
                angularVelocity: 5
            });
            this.body.addShape(shape);

            // Apply velocity
            var force = randomBetween(1,6);
            var angle = randomBetween(90, 180) / game.scene.world.ratio;
            this.body.velocity[0] = Math.sin(angle) * force;
            this.body.velocity[1] = Math.cos(angle) * force;

            //this.body.setDensity(0.1);

            this.sprite = new game.Sprite(str);

            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.scale.set(0.081, 0.081)
            this.sprite.position.set(x, y);

            //game.scene.addObject(this);
            game.scene.stage.addChild(this.sprite);
            game.scene.world.addBody(this.body);
            game.scene.addTimer(5000, this.remove.bind(this));
            
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
        this.sprite = new game.TilingSprite('Splash.jpg', 1024, 768);
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
        this.sprite = new game.TilingSprite('Splash.jpg', 1024, 768);
        this.sprite.addTo(game.scene.stage);

        this.sprite2 = new game.TilingSprite('You-Lose.png');
        this.sprite2.position.x = 200;
        this.sprite2.position.y = 105;
        this.sprite2.addTo(game.scene.stage);

        this.addObject(new game.Button());


    }
});


game.createClass('Ball', {
    textobject: null,
    init: function (x, y) {

        this.textobject = new game.PIXI.Text("Hello World!", { font: '60px Arial' });
        game.scene.stage.addChild(this.textobject);

        var shape = new game.Circle(25 / game.scene.world.ratio);
        shape.collisionGroup = BALL;
        shape.collisionMask = BLOCK | WALL;
        this.body = new game.Body({
            mass: 1,
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
            textCount++;
        }
        //console.log(gametime);
        this.textobject.setText(textCount);
        //game.world.gametimer.setText(gameTime);
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        this.sprite.angle = this.body.angle;

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

    },
});

game.createScene('Start', {
    backgroundColor: 0x000000,

    init: function () {
        this.sprite = new game.TilingSprite('Splash.jpg', 1024, 768);
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
    init: function() {
        //this.world = new game.World(0, 1000);
        this.world = new game.World({ gravity: [0,15] });
        this.world.ratio = 100;
        this.world.gameTime = gameTime;


        var sprite = new game.TilingSprite('Background.png', 0, 0);
        sprite.speed.x = 1000;
        sprite.addTo(game.scene.stage);
        game.scene.addObject(sprite);

        // Add walls
        var wallShape, wallBody;

        wallShape = new game.Rectangle(50 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallShape.collisionGroup = WALL;
        wallShape.collisionMask = BALL;
        wallBody = new game.Body({
            position: [0, game.system.height / 2 / this.world.ratio], mass: 1, restitution: 1, type: p2.Body.STATIC
        });

        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);


        wallShape = new game.Rectangle(50 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallShape.collisionGroup = WALL;
        wallShape.collisionMask = BALL;
        wallBody = new game.Body({
            position: [game.system.width / this.world.ratio, game.system.height / 2 / this.world.ratio], type: p2.Body.STATIC, mass: 1, restitution: 1
        });

        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(game.system.width / this.world.ratio, 50 / this.world.ratio);
        wallShape.collisionGroup = WALL;
        wallShape.collisionMask = BALL;
        wallBody = new game.Body({
            position: [game.system.width / 2 / this.world.ratio, game.system.height / this.world.ratio], mass: 1, restitution: 1, type: p2.Body.STATIC
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(game.system.width / this.world.ratio, 50 / this.world.ratio);
        wallShape.collisionGroup = WALL;
        wallShape.collisionMask = BALL;
        wallBody = new game.Body({
            position: [game.system.width / 2 / this.world.ratio, 0], mass: 1, restitution: 1, type: p2.Body.STATIC
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

        this.addTimer(200, function () {
            var object = new game.Block(50, game.system.height / 2);
            game.scene.addObject(object);
        }, true);

        game.scene.addObject(new game.Ball(890, 350));

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
