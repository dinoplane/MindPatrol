// Rocket prefab
class Rocket extends Projectile {
    static MODES = ["normal", "Bomb"]
    constructor(scene, x, y, texture, frame, controls, powerupTextures) {
        super(scene, x, y, texture, frame, 
                            game.settings.rocketSpeed, 
                            game.config.height - borderUISize - borderPadding);

        // add object to existing scene
        scene.add.existing(this);
        this.mode = 0;
        this.powerupTextures = powerupTextures;
        // Initialize controls
        this.keyFIRE = scene.input.keyboard.addKey(controls.fire);
        this.keyFIRE.on('down', (key, event) => {
            if (!this.isFiring && !scene.gameOver){
                this.isFiring = true;
                this.sfxRocket.play();  // play sfx
            }
        })

        this.keyLEFT = scene.input.keyboard.addKey(controls.left);
        this.keyRIGHT = scene.input.keyboard.addKey(controls.right);

        this.isFiring = false;
        this.combo = 0;

        this.comboTimer = scene.time.addEvent({
            delay: 0,
            callback: this.resetCombo,
            loop: false,
            callbackScope: this,
        });
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
            this.resetCombo();
            this.reset();
        }
    }

    incrementCombo(){
        this.combo += 1;
        this.comboTimer.remove();
        this.comboTimer.reset({
            delay:  game.settings.comboDuration,
            callback: this.resetCombo,
            loop: false,
            callbackScope: this,
        });
        this.scene.time.addEvent(this.comboTimer); 
    }
    
    resetCombo(){
        this.combo = 0;
    }
    
    reset(){
        super.reset();
        this.isFiring = false;
    }

    handleCollision(){
        this.incrementCombo();
        this.reset();
    }
}
