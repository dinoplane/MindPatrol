// Rocket prefab
class Rocket extends Projectile {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame, 
                            game.settings.rocketSpeed, 
                            game.config.height - borderUISize - borderPadding);

        // add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;
        this.combo = 0;
        console.log(this.moveSpeed);
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update(){
        // left right movement NOW AVAILABLE WHEN FIRING
        
        if (keyLEFT.isDown && this.x >=borderUISize + this.width) 
            this.x -= this.moveSpeed;
        else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width)
            this.x += this.moveSpeed;

        // fire button
        if ((Phaser.Input.Keyboard.JustDown(keySPACE)) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }

        // If fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) 
            this.y -= this.moveSpeed;

        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding){
            this.combo = 0;
            this.reset();
        }
    }

    incrementCombo(){
        this.combo += 1;
    }
    
    resetCombo(){
        console.log(this);
        this.combo = 0;
    }
    
    reset(){
        super.reset();
        this.isFiring = false;
    }
}
