// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update(){
        // spaceship move left
        this.x -= this.moveSpeed;

        //wrap around from left edge to right edge
        if (this.x <= 0 - this.width)
            this.reset();
    }

    reset(){
        
        this.x = game.config.width;// + this.getRandomInt(game.config.width/2);
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    getRandomInt(max = 0) {
        return Math.floor(Math.random() * max);
    }

    getRandomInt(min=0, max = 0) {
        return min + Math.floor(Math.random() * (max - min));
    }
      
}
