// Rocket prefab
class Rocket extends Projectile {
    constructor(scene, x, y, texture, frame, controls) {
        super(scene, x, y, texture, frame, 
                            game.settings.rocketSpeed, 
                            game.config.height - borderUISize - borderPadding);

        // add object to existing scene
        scene.add.existing(this);

        // Initialize controls
        this.keyFIRE = scene.input.keyboard.addKey(controls.fire);
        this.keyFIRE.on('down', (key, event) => {
            console.log("pressed");
            if (!this.isFiring){
                this.isFiring = true;
                this.sfxRocket.play();  // play sfx
            }
        })

        this.keyLEFT = scene.input.keyboard.addKey(controls.left);
        this.keyRIGHT = scene.input.keyboard.addKey(controls.right);

        this.isFiring = false;
        this.combo = 0;
        console.log(this.moveSpeed);
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update(){
        // left right movement NOW AVAILABLE WHEN FIRING
        
        if (this.keyLEFT.isDown && this.x >=borderUISize + this.width) 
            this.x -= this.moveSpeed;
        else if (this.keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width)
            this.x += this.moveSpeed;

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
