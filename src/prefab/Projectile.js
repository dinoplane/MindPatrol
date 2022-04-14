// Rocket prefab
class Projectile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, moveSpeed, respawnY) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);
        
        this.moveSpeed = moveSpeed;
        this.respawnY = respawnY;
        
        console.log(this.moveSpeed);
    }

    reset(){
        this.y = this.respawnY; //game.config.height - borderUISize - borderPadding;
    }

    checkCollision(ship) {
        // simple AABB checking
        return (this.x < ship.x + ship.width && 
            this.x + this.width > ship.x && 
            this.y < ship.y + ship.height &&
            this.height + this.y > ship.y) 
    }

    handleCollision(){

    }
}
