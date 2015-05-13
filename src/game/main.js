game.module(
    'game.main'
)
.body(function() {

game.addAsset('panda.png');

game.createScene('Main', {
    backgroundColor: 0xb9bec7,
    init: function() {
        
        //create emitter
        var emitter = new game.Emitter();
        //set visualDisplayContainer were the images will be emitted.
        //(Usually this is game.scene.stage but remember that you could also emit particles from within the container of an existing sprite.)
        emitter.container = this.stage;
        emitter.angleVar = 90;
        emitter.life = 10000;
        //Set texture to emit
        emitter.textures.push('panda.png');
        //set position
        emitter.position.set(game.system.width / 2, game.system.height / 2);
        //add emitter to the scene so it will start working.
        //this.addEmitter(emitter); // */

    }
});

});
