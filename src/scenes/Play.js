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
    }
    
    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
       
            
        let controls = {left: 'A', right: 'D', fire: 'SPACE'}
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket', 0, controls).setOrigin(0.5, 0);
        
        this.projectiles = [];
        this.projectiles.push(this.p1Rocket);

        // add spaceships (x3)
        this.ships = [];
        this.ships.push(new Alienship(this, game.config.width + 3*borderUISize,
                        borderUISize*(4) + 2*borderPadding, 'alienship', 0, 1000).setOrigin(0,0));
        for (let i = 0; i < game.settings.numSpaceships; i++){
            let j = game.settings.numSpaceships - i - 1;
            this.ships.push(new Spaceship(this, game.config.width + 3*i*borderUISize,
                                                borderUISize*(j+6) + 2*j*borderPadding, 'spaceship', 0, (i+1)*10).setOrigin(0,0));
        }

        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //pointer = this.input.mousePointer;

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
        
        // display fire
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        this.fireLeft = this.add.text(borderUISize*5 + borderPadding, 
                                        borderUISize + borderPadding*2, "FIRE", fireConfig);
        this.fireLeft.visible = false; // FIRE DISPLAY!

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


        // display combo
        let comboConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        // scaling the 
        // let x = game.config.width - comboConfig.fixedWidth - (borderUISize*5 + borderPadding);
        // let y =   borderUISize + borderPadding*2;
        // let config = comboConfig;
        // this.comboBar =  this.add.rectangle(x, y, config.fixedWidth, 
        //     35, 
        //     "0xF30000").setOrigin(0,0).setStrokeStyle(); 

        // this.comboLabel =  this.add.text(x, y, "x 1", config); 

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        console.log(game.config);
        this.comboBar = new ComboBar(this, game.config.width - comboConfig.fixedWidth - (borderUISize*5 + borderPadding), 
                                borderUISize + borderPadding*2, comboConfig, this.p1Rocket);
    }

    update() {
        //console.log(this.comboBar.width)
        this.starfield.tilePositionX -= 1;
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            for (let ship of this.ships)
                ship.update();
        } 
    
        // check collisions
        for (let ship of this.ships){
            for (let projectile of this.projectiles){
                if(this.checkCollision(projectile, ship)) {
                    projectile.handleCollision();
                    this.shipExplode(ship);   
                }
            }
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
            this.scene.restart();

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT))
            this.scene.start("menuScene");
        
        this.fireLeft.visible = this.p1Rocket.isFiring; // Show me fire
        this.timeRight.text = Math.ceil(this.clock.getOverallRemainingSeconds()); // Show me time
        this.comboBar.update();

//        for (let rocket of this.players)

    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        return rocket.checkCollision(ship);
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        if (this.p1Rocket.combo > game.settings.comboGoal){
            this.clock.delay += 5000;
        }


        // score add and repaint

        // Combo timer owo

        
        this.p1Score += ship.points * this.p1Rocket.combo;
        this.scoreLeft.text = this.p1Score;   
        this.sound.play('sfx_explosion');  
    }
}