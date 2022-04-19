// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    static shipCount = 0;

    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        this.num = Spaceship.shipCount;

        // add object to existing scene
        scene.add.existing(this);
        this.cachedSpeed = 0;
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;  
        this.moveDirection = (this.getRandomInt(2)) ? -1: 1;
        Spaceship.shipCount += 1;
    }

    update(){
        // spaceship move left
        this.x += this.moveSpeed * this.moveDirection;

        //wrap around from left edge to right edge
        if (this.x < 0 - this.width)
            this.reset();
        else if (this.x > game.config.width + this.width)
            this.reset();
    }

    reset(){
        this.moveSpeed = this.getRandomInt(game.settings.spaceshipSpeed / 3, game.settings.spaceshipSpeed);
        this.x = (this.moveDirection < 0) ? game.config.width : 0 - this.width;
    }

    handleCollision(rocket){
        // temporarily hide ship
        this.alpha = 0;
    
        // create explosion sprite at ship's position
        let boom = this.scene.add.sprite(this.x, this.y, 'explosion').setOrigin(0, 0);
        this.reset(); // reset ship position
        this.togglePause(); // stop the ship's movement
        this.scene.sound.play('sfx_explosion');
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            this.togglePause();               
            this.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        this.scene.p1Score += this.points * rocket.combo;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    getRandomInt(max = 0) {
        return Math.floor(Math.random() * max);
    }

    getRandomInt(min=0, max = 0) {
        return min + Math.floor(Math.random() * (max - min));
    }

    togglePause(){
        let tmp = this.moveSpeed;
        this.moveSpeed = this.cachedSpeed;
        this.cachedSpeed = tmp;
    }
}
