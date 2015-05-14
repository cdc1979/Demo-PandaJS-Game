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

game.module(
    'game.main'
)
    .require(
	'plugins.physicsextend'
)
.body(function() {

    //game.addAsset('panda.png');
    game.addAsset('Background.jpg');
    game.addAsset('Circle.png');
    game.addAsset('Square.png');
    game.addAsset('Triangle.png');
    game.addAsset('Player.png');
    game.addAsset('panda.png');
    game.addAsset('start.png');
    game.addAsset('Splash.jpg');

    var topspeed = 500;
    var yaccel = 50;
    var xaccel = 20;

    game.createClass('Wall', {

        init: function (x, y, width, height) {

            //this.shape = new game.Graphics();
            //this.shape.beginFill(0x000000, 1);
            //this.shape.drawRect(x, y, width, height);
            //this.shape.endFill();
            //game.scene.stage.addChild(this.shape);
            this.shaperect = new game.Rectangle(width, height);

           this.body = new game.Body({
               position: { x: x, y: y },
               collisionGroup: 0,
               collideAgainst: [1,6,9],
               fixed: true
           });
           this.body.addShape(this.shaperect);
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
                collideAgainst: [6],
                fixed: true
            });
            this.body.addShape(this.shaperect);
            game.scene.world.addBody(this.body);
        }
    });

game.createClass('Block', {
        init: function (spritename) {
            //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
            this.sprite = new game.Sprite(spritename);

            var rndx = randomIntFromInterval(100,800);
            var rndy = randomIntFromInterval(100, 600);

            this.sprite.position = { x: rndx, y: rndy };
            this.sprite.width = 50;
            this.sprite.height = 50;
            this.sprite.anchor.x = 0.5;
            this.sprite.anchor.y = 0.5;
            game.scene.stage.addChild(this.sprite);

            //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
            this.body = new game.Body({
                position: { x: rndx, y: rndy },
                collisionGroup: 9,
                collideAgainst: [0,4,9],
                velocity: { x: randomBetween(-200, 200), y: randomBetween(-200, 200) },
                velocityLimit: { x: 300, y: 300 },
                mass: 0
            });

            //this.body.collide = this.collide.bind(this);
            this.body.addShape(new game.Rectangle(50,50));
            game.scene.world.addBody(this.body);

            //game.scene.addObject(this);
            //add body of this sprite to the world object
            //game.scene.world.addBody(this.body);
            //add sprite to display container
            //game.scene.stage.addChild(this);
           
            
        },
        collide: function () {

        },
        update: function () {
            this.sprite.position.x = this.body.position.x;
            this.sprite.position.y = this.body.position.y;

        }
});

game.createClass('Button', {

    init: function () {
        //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
        this.sprite = new game.Sprite('start.png');
        this.sprite.position = { x: game.system.width / 2, y: game.system.height / 2 };
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
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
        this.addObject(new game.Button());


    }
});

game.createScene('Lose', {
    backgroundColor: 0x000000,

    init: function () {
        this.sprite = new game.TilingSprite('Splash.jpg', 1024, 768);
        this.sprite.addTo(game.scene.stage);
        this.addObject(new game.Button());


    }
});


game.createClass('Ball', {
    
    init: function (x, y) {

        //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
        this.sprite = new game.Sprite('Player.png');
        this.sprite.width = 50;
        this.sprite.height = 50;
        this.sprite.anchor = { x: 0.5, y: 0.5};
        this.body = new game.Body({
            position: { x: 950, y: 330 },
            collisionGroup: 1,
            collideAgainst: [0,3,9],
            velocity: { x: 0, y: 0 },
            velocityLimit: { x: 500, y: 500 },
            mass: 1,
            restitution: 0.5
        });
        //this.body.collide = this.collide.bind(this);
        this.body.addShape(new game.Circle(25));
        game.scene.world.addBody(this.body);

    },
    collide: function() {

    },
    update: function () {


        this.sprite.position.x = this.body.position.x;
        this.sprite.position.y = this.body.position.y;

        //console.log(this.body.position.y);
    
        if (this.body.position.x < 0) {
            game.system.setScene('Win');
        }

            // Check if key is currently down
        if (game.keyboard.down('LEFT')) {
            
            this.body.velocity.x -= xaccel;

        }
        if (game.keyboard.down('RIGHT')) {
            this.body.velocity.x += xaccel;
        }
        if (game.keyboard.down('UP')) {
            this.body.velocity.y -= yaccel;
        }
        if (game.keyboard.down('DOWN')) {
            this.body.velocity.y += yaccel;
        }

    },
});

game.createScene('Start', {
    backgroundColor: 0x000000,

    init: function () {
        this.sprite = new game.TilingSprite('Splash.jpg', 1024, 768);
        this.sprite.addTo(game.scene.stage);
        this.addObject(new game.Button());


    }
});

game.createScene('Main', {
    backgroundColor: 0xb9bec7,

    init: function() {
        this.world = new game.World(0,500);
        var sprite = new game.TilingSprite('Background.jpg', 0, 0);
        sprite.addTo(game.scene.stage);

        var numblocks = 10;

        for (var i = 0; i < numblocks; i++) {
            this.addObject(new game.Block('Square.png'));
        }


        this.addObject(new game.Wall(0, 0, 3000, 50));
        this.addObject(new game.Wall(0, 740, 3000, 50));
        this.addObject(new game.Wall(1024 - 10, 0, 50, 2000));

        this.addObject(new game.LeftWall(0, 100, 50, 2000));
        this.addObject(new game.LeftWall(870, 100, 50, 2000));

        this.addObject(new game.Ball(890, 350, 'Player.png'));



    }
});

});
