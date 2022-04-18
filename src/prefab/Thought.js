// Thought prefab
class Thought extends Spaceship {

    static TOTAL_MODES = 8;
    static TOTAL_THOUGHTS = Thought.TOTAL_MODES * 2;

    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue);

        this.mode = this.getRandomInt(Thought.TOTAL_THOUGHTS);
        this.points *= (this.isBadMode()) ? 1 : -1;
        this.setFrame(this.mode);
        
        this.anims.create({
            key: 'transition',
            frames:  this.anims.generateFrameNumbers('thought_change', { start: 0, end: 7, first: 0}),
            frameRate: 12,
        });
    }

    isBadMode(){
        return this.mode < Thought.TOTAL_MODES;
    }

    toggleMoral(){
        this.multiplier *= -1;
        this.mode = ( this.mode + Thought.TOTAL_MODES) % Thought.TOTAL_THOUGHTS;
        this.points *= -1;
    }

    reset(){
        super.reset()
        this.mode = this.getRandomInt(Thought.TOTAL_THOUGHTS);
        this.points = Math.abs(this.points);
        this.points *= (this.isBadMode()) ? 1 : -1;
        this.setFrame(this.mode);
    }

    handleCollision(rocket){
        if (!this.isBadMode()){
            rocket.combo = 25; // HEAVILY penalize the player for exploiting this.
        }
        this.scene.p1Score += this.points * rocket.combo;
        console.log("Points: ", this.points, " x ", rocket.combo, " = ", this.points * rocket.combo);
        if (!this.isBadMode()){
            rocket.resetCombo();
        }
        this.toggleMoral();
        this.play('transition');
        this.on('animationcomplete', () => {
            this.setTexture('thought');
            
            this.setFrame(this.mode);
            console.log("Combo: ", rocket.combo);
        });
    }
}