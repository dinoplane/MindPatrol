// Thought prefab
class Thought extends Spaceship {
    static TOTAL_THOUGHTS = 16;

    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue);

        this.anims.create({
            key: 'idle',
            frames:  this.anims.generateFrameNumbers('thought', { start: 0, end: 15, first: 0}),
            frameRate: 6,
            repeat: -1
        });
        
        this.anims.create({
            key: 'transition',
            frames:  this.anims.generateFrameNumbers('thought_change', { start: 0, end: 7, first: 0}),
            frameRate: 6,
            repeat: -1
        });
    }

    reset(){
        super.reset();
        this.setFrame(this.getRandomInt(Thought.TOTAL_THOUGHTS));
    }
}