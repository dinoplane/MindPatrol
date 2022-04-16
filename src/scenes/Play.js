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
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
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



        let controls = [{left: 'LEFT', right: 'RIGHT', fire: 'UP'}, 
                        {left:'A', right: 'D', fire: 'W'}, 
                        {left:'A', right: 'D', fire: 'W'}]

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

        // Scene helper

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

        this.containers = [];
        this.projectiles = [];
        controls.forEach((control, index) => {
            let x = this.scoreLeft.x + this.scoreLeft.width + borderUISize + // THE STARTING POINT
                            (index + 1) *  borderPadding * 2  + // padding encountered
                            fireConfig.fixedWidth*(index); // compensate for past displays
            let rocket = new Rocket(this, (index + 1) * game.config.width/(controls.length+1),
                                                game.config.height - borderUISize - borderPadding,
                                                'rocket', 0, control).setOrigin(0.5, 0);
                                                //console.log(index, ": ", rocket.x, ", " ,rocket.y);
            this.rockets.push(rocket);
            let j = 0;
            if (index < controls.length/2) j = -1;
            else if (index > controls.length/2) j = 1;
            let fireLeft = this.add.text(x, borderUISize + borderPadding*2, "FIRE", fireConfig).setOrigin(0,0);
            fireLeft.visible = false; // FIRE DISPLAY!
            this.fireLefts.push(fireLeft);
            let combobar = new ComboBar(this, 
                x,
                borderUISize + borderPadding*4, comboConfig, rocket);
            this.comboBars.push(combobar)
            this.projectiles.push(rocket);
        });

    }

    update() {
        //console.log(this.comboBar.width)
        this.starfield.tilePositionX -= 5;
        if (!this.gameOver) {          
            for (let projectile of this.projectiles)     
                projectile.update();         // update rocket sprite
            for (let ship of this.ships)
                ship.update();
        } 
    
        // check collisions
        for (let ship of this.ships){
            for (let projectile of this.projectiles){
                if(this.checkCollision(projectile, ship)) {
                    projectile.handleCollision();
                    this.shipExplode(projectile, ship);   
                    if (projectile.combo > game.settings.comboGoal){
                        this.clock.delay += 5000;
                    }
                }
            }
        }

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
            this.scene.restart({controls: this.controls, numPlayers: this.numPlayers});

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT))
            this.scene.start("menuScene", {controls: this.controls, numPlayers: this.numPlayers});
        

        this.fireLefts.forEach( (fireLeft, index) => {
            fireLeft.visible = this.rockets[index].isFiring; // Show me fire
        });
        this.comboBars.forEach( (comboBar, index) => {
            comboBar.update(); // show me combos
        });

        this.timeRight.text = Math.ceil(this.clock.getOverallRemainingSeconds()); // Show me time
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        return rocket.checkCollision(ship);
    }

    shipExplode(rocket, ship) {
        // temporarily hide ship
        ship.alpha = 0;
        
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        ship.reset(); // reset ship position
        ship.togglePause(); // stop the ship's movement
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.togglePause();               
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        this.p1Score += ship.points * rocket.combo;
        this.scoreLeft.text = this.p1Score;   
        this.sound.play('sfx_explosion');  
    }


}