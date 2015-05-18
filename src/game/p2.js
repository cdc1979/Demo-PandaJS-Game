game.module(
    'game.sprites'
)
.require(
    'engine.core',
    'plugins.p2'
)
.body(function() {

game.addAsset('Square.png');
game.addAsset('Circle.png');

game.createClass('PhysicsObject', {
    size: 70,

    init: function(x, y) {
        // Add body and shape
        var shape = Math.random() > 0.5 ?
            new game.Circle(this.size / 2 / game.scene.world.ratio) :
            new game.Rectangle(this.size / game.scene.world.ratio, this.size / game.scene.world.ratio);

        this.body = new game.Body({
            mass: 1,
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ],
            angularVelocity: 1
        });
        this.body.addShape(shape);

        // Apply velocity
        var force = 5;
        var angle = Math.random() * Math.PI * 2;
        this.body.velocity[0] = Math.sin(angle) * force;
        this.body.velocity[1] = Math.cos(angle) * force;

        this.sprite = new game.Sprite(shape.radius ? 'Circle.png' : 'Square.png');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.set(x, y);

        //game.scene.addObject(this);
        game.scene.stage.addChild(this.sprite);
        game.scene.world.addBody(this.body);
        game.scene.addTimer(5000, this.remove.bind(this));
    },

    remove: function() {
        game.scene.removeObject(this);
        game.scene.stage.removeChild(this.sprite);
        game.scene.world.removeBody(this.body);
    },

    update: function() {
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        this.sprite.rotation = this.body.angle;
    }
});

game.createScene('Start', {
    init: function() {
        // Init physics world
        this.world = new game.World({ gravity: [0, 9] });
        this.world.ratio = 100;

        // Add walls
        var wallShape, wallBody;

        wallShape = new game.Rectangle(50 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallBody = new game.Body({
            position: [0, game.system.height / 2 / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(50 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallBody = new game.Body({
            position: [game.system.width / this.world.ratio, game.system.height / 2 / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(game.system.width / this.world.ratio, 50 / this.world.ratio);
        wallBody = new game.Body({
            position: [game.system.width / 2 / this.world.ratio, game.system.height / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        this.addTimer(200, function() {
            new game.PhysicsObject(game.system.width / 10, game.system.height / 10);
            //game.scene.addObject(object);
        }, true);
    }
});

});