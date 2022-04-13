// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    static shipCount = 0;
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.moveDirection = (this.getRandomInt(2)) ? -1: 1;
        console.log(this.moveSpeed);
        Spaceship.shipCount += 1;
    }

    update(){
        // spaceship move left
        this.x += this.moveSpeed * this.moveDirection;

        //wrap around from left edge to right edge
        if (this.x <= 0 - this.width)
            this.reset();
        else if (this.x > game.config.width + this.width)
            this.reset();
    }

    reset(){   
        this.x = (this.moveDirection < 0) ? game.config.width : 0 - this.width;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    getRandomInt(max = 0) {
        return Math.floor(Math.random() * max);
    }

    getRandomInt(min=0, max = 0) {
        return min + Math.floor(Math.random() * (max - min));
    }
      
}
