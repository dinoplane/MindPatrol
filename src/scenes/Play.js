class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('alienship', './assets/alienship.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 3});
        this.load.spritesheet('thought', './assets/thoughts.png', {frameWidth: 128, frameHeight: 64, startFrame: 0, endFrame: 15});
        this.load.spritesheet('thought_change', './assets/thought_change.png', {frameWidth: 128, frameHeight: 64, startFrame: 0, endFrame: 7});
    }
    
    create() {
        // collision handler
        this.colHandler = new CollisionHandler(this);

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // add spaceships (x3)
        let aship = new Alienship(this, game.config.width + 3*borderUISize,
            borderUISize*(4) + 2*borderPadding, 'alienship', 0, 1000).setOrigin(0,0);
        this.colHandler.addShip(aship);
        for (let i = 0; i < game.settings.numSpaceships; i++){
            let j = game.settings.numSpaceships - i - 1;
            aship = new Thought(this, game.config.width + 3*i*borderUISize,
                borderUISize*(j+6) + 2*j*borderPadding, 'thought', 4, (i+1)*10).setOrigin(0,0);
            this.colHandler.addShip(aship);
        }

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, 
                                        borderUISize + borderPadding*2, this.p1Score, scoreConfig);  
        // Time is ticking down...
        this.timeRight = this.add.text(game.config.width - scoreConfig.fixedWidth - (borderUISize + borderPadding), 
                                    borderUISize + borderPadding*2, game.settings.gameTimer/1000, scoreConfig); 

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 
                            'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 
                            'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // display fire
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: borderUISize*1.5
        }

        // display combo
        let comboConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            color: '#843605',
            backgroundColor: '#F3B141',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: borderUISize*1.5
        }


        this.rockets = [];
        this.fireLefts = [];
        this.comboBars = [];

        for (let index= 0; index < numPlayers; index++) {
            let control = controls[index];
            let x = this.scoreLeft.x + this.scoreLeft.width + borderUISize + // THE STARTING POINT
                            (index + 1) *  borderPadding * 2  + // padding encountered
                            fireConfig.fixedWidth*(index); // compensate for past displays

            let rocket = new Rocket(this, (index + 1) * game.config.width/(numPlayers+1),
                                                game.config.height - borderUISize - borderPadding,
                                                'rocket', 0, control).setOrigin(0.5, 0);
                                                //console.log(index, ": ", rocket.x, ", " ,rocket.y);
            this.rockets.push(rocket);
            this.colHandler.addProjectile(rocket);

            let fireLeft = this.add.text(x, borderUISize + borderPadding*2, "FIRE", fireConfig).setOrigin(0,0);
            fireLeft.visible = false; // FIRE DISPLAY!
            this.fireLefts.push(fireLeft);

            let combobar = new ComboBar(this, 
                x,
                borderUISize + borderPadding*4, comboConfig, rocket);
            this.comboBars.push(combobar)
        };

    }

    update() {
        //console.log(this.comboBar.width)
        this.starfield.tilePositionX -= 5;
        this.colHandler.update();
    
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
            this.scene.restart();

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT))
            this.scene.start("menuScene");
        
        this.fireLefts.forEach( (fireLeft, index) => {
            fireLeft.visible = this.rockets[index].isFiring; // Show me fire
        });
        this.comboBars.forEach( (comboBar, index) => {
            comboBar.update(); // show me combos
        });

        this.timeRight.text = Math.ceil(this.clock.getOverallRemainingSeconds()); // Show me time
    }


    handleCollision(rocket, ship) {
        this.p1Score += ship.points * rocket.combo;
        this.scoreLeft.text = this.p1Score;   
        if (rocket.combo > game.settings.comboGoal){
            this.clock.delay += 5000;
        }
        this.sound.play('sfx_explosion');  
    }


}