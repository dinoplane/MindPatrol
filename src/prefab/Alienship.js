// Spaceship prefab
class Alienship extends Spaceship {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame, 500);
        this.anims.create({
            key: 'idle',
            frames:  this.anims.generateFrameNumbers('alienship', { start: 0, end: 3, first: 0}),
            frameRate: 12,
            repeat: -1
        });

        // this.spawned = 0;
        // this.respawnTimer = scene.time.addEvent({
        //     delay: 15000,
        //     callback: this.
        // })

        this.zigTimer = scene.time.addEvent({
            delay: 2000,
            callback: this.zig,
            callbackScope: this,
            loop: true
        })
        this.zagTimer = scene.time.addEvent({
            delay: 500,
            callback: this.zag,
            callbackScope:this,
            paused: true,
            loop: true
        })

        this.play('idle');
    }
      
    reset(){
        super.reset();
        this.moveSpeed = game.settings.spaceshipSpeed * 1.5;
    }

    // zig movement
    zig(){
        this.moveDirection *= -0.2;
        this.zigTimer.paused = true;
        this.zagTimer.paused = false;   
    }
    zag(){
        this.moveDirection *= -5;
        this.zagTimer.paused = true,
        this.zigTimer.paused = false
        this.moveSpeed *= 1.05;
    }
}
