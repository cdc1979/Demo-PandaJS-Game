game.module(
    'game.main'
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
    var accel = 10;

game.createClass('Block', {
        init: function (spritename) {
            //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
            this.sprite = new game.Sprite(spritename);

            var rndx = (Math.random() * game.system.width);
            var rndy = (Math.random() * game.system.height);

            if (rndx > 850) { rndx = 800; }
            if (rndx < 150) { rndx = 200; }

            this.sprite.position = { x: rndx, y: rndy };
            this.sprite.width = 50;
            this.sprite.height = 50;

            var ry = Math.floor((Math.random() * 768) + 1);
            var rx = Math.floor((Math.random() * 800) + 1);
            var rs = Math.floor((Math.random() * 10000) + 1);
            if (rx < 200) { rx = 200; }

            if (spritename === "Circle.png") {
                var tween = new game.Tween(this.sprite.position);
                tween.to({ x: rx, y: ry }, rs);
                tween.repeat(999999);
                tween.yoyo();
                tween.start();
            }

            if (spritename === "Square.png") {
                var tween = new game.Tween(this.sprite.position);
                tween.to({ x: rx, y: ry }, rs);
                tween.repeat(999999);
                tween.yoyo();
                tween.start();
            }

            if (spritename === "Triangle.png") {

                var tween = new game.Tween(this.sprite.position);
                tween.to({ x: rx, y: ry }, rs);
                tween.repeat(999999);
                tween.yoyo();
                tween.start();
            }

            //game.scene.addObject(this);
            //add body of this sprite to the world object
            //game.scene.world.addBody(this.body);
            //add sprite to display container
            //game.scene.stage.addChild(this);
           
            game.scene.stage.addChild(this.sprite);
        },
        update: function () {

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
            console.log("sprite received a click!");
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

        this.world = new game.World();
        //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
        this.sprite = new game.Sprite('Player.png');
        this.sprite.width = 50;
        this.sprite.height = 50;
        
        this.body = new game.Body({
            position: { x: 950, y: 330 },
            collisionGroup: 0,
            collideAgainst: 0,
            velocity: { x: 0, y: 0 },
            mass: 1
        });

        //add body of this sprite to the world object
        
        //add sprite to display container
        //game.scene.stage.addChild(this);
        //game.scene.addObject(this.sprite);
       // game.scene.addObject(this.body);
        game.scene.stage.addChild(this.sprite);

        this.body.addShape(new game.Rectangle(50, 50));
        //game.scene.stage.addBody(this.body);

        game.scene.world.addBody(this.body);
       
        console.log("test");
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
            
            this.body.velocity.x -= accel;
            if (this.body.velocity.x < 0 - topspeed) { this.body.velocity.x = 0 - topspeed; }

        }
        if (game.keyboard.down('RIGHT')) {
            this.body.velocity.x += accel;
            if (this.body.velocity.x > topspeed) { this.body.velocity.x = topspeed; }
        }
        if (game.keyboard.down('UP')) {
            this.body.velocity.y -= accel;
            if (this.body.velocity.y < 0-topspeed) { this.body.velocity.y = 0-topspeed; }
        }
        if (game.keyboard.down('DOWN')) {
            this.body.velocity.y += accel;
            if (this.body.velocity.y > topspeed) { this.body.velocity.y = topspeed; }
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
        this.world = new game.World(0, 0);
        var sprite = new game.TilingSprite('Background.jpg', 0, 0);
        sprite.addTo(game.scene.stage);

        for (var i = 0; i < 8; i++) {
            test = new game.Block('Circle.png');
        }
        for (var i = 0; i < 8; i++) {
            this.addObject( new game.Block('Triangle.png') );
        }
        for (var i = 0; i < 8; i++) {
            
            test = new game.Block('Square.png');
        }

        this.addObject(new game.Ball(920, 350, 'Player.png'));

     


    }
});

});
