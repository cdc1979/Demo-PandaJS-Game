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


game.createClass('Block', {
        init: function (x,y,spritename) {
            //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
            this.sprite = new game.Sprite(spritename);
            this.sprite.position = { x: x, y: y };
            //game.scene.addObject(this);
            //add body of this sprite to the world object
            //game.scene.world.addBody(this.body);
            //add sprite to display container
            //game.scene.stage.addChild(this);
           
            game.scene.stage.addChild(this.sprite);
        }
});


game.createClass('Ball', {
    
    init: function (x, y) {
        //this._super(spritename, x, y, { anchor: { x: 0.5, y: 0.5 } });
        this.sprite = new game.Sprite('Player.png');
        this.sprite.position = { x: x, y: y };
        this.sprite.interactive = true;
        
        //add body of this sprite to the world object
        //game.scene.world.addBody(this.body);
        //add sprite to display container
        //game.scene.stage.addChild(this);
        //game.scene.addObject(this.sprite);
        game.scene.stage.addChild(this.sprite);
        console.log("test");
    },
    update: function () {
        console.log("test");
            // Check if key is currently down
        if (game.keyboard.down('LEFT')) {
            this.sprite.position.x -= 5;
        }
        if (game.keyboard.down('RIGHT')) {
            this.sprite.position.x += 5;
        }
        if (game.keyboard.down('UP')) {
            this.sprite.position.y -= 5;
        }
        if (game.keyboard.down('DOWN')) {
            this.sprite.position.y += 5;
        }

    },
});

game.createScene('Main', {
    backgroundColor: 0xb9bec7,

    init: function() {

        var sprite = new game.TilingSprite('Background.jpg', 0, 0);
        sprite.addTo(game.scene.stage);

        for (var i = 0; i < 5; i++) {
            var rnd = (Math.random() * game.system.width);
            if (rnd > 850) 
            {
                rnd = 850;
            }
            test = new game.Block(rnd, Math.random() * game.system.height, 'Circle.png');
        }
        for (var i = 0; i < 5; i++) {
            var rnd = (Math.random() * game.system.width);
            if (rnd > 800) {
                rnd = 800;
            }
            test = new game.Block(rnd, Math.random() * game.system.height, 'Triangle.png');
        }
        for (var i = 0; i < 5; i++) {
            var rnd = (Math.random() * game.system.width);
            if (rnd > 800) {
                rnd = 800;
            }
            test = new game.Block(rnd, Math.random() * game.system.height, 'Square.png');
        }

        this.addObject( new game.Ball(920, 350, 'Player.png') );


    }
});

});
