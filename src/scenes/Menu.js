class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        this.numPlayerslabel = null;
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.image('arrow_up', './assets/arrow_up.png');
        this.load.image('arrow_down', './assets/arrow_down.png');
    }

    create() {

        // menu text config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2 , game.config.height/2 - borderUISize - borderPadding, 
                        'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 , game.config.height/2, 
                        'Press (BACKSPACE) for controls', menuConfig).setOrigin(0.5);
        
        menuConfig.backgroundColor = "#00FF00";
        menuConfig.color = "#000";
        this.add.text(game.config.width/2 , game.config.height/2 + borderUISize + borderPadding, 
                        'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
       
        var container = this.add.container(game.config.width/2, 
                        game.config.height/2 + (borderUISize + borderPadding)*2);
       
        this.numPlayerslabel = this.add.text(0,borderPadding, numPlayers, menuConfig).setOrigin(0.5,0)
        var playerlabel = this.add.text(this.numPlayerslabel.width + borderPadding, borderPadding, "Player(s)", menuConfig).setOrigin(0,0)
        this.upArrow = this.add.image(0,0,'arrow_up');
        this.downArrow = this.add.image(0, this.numPlayerslabel.height + 2*borderPadding,'arrow_down')
        container.add([this.numPlayerslabel, playerlabel, this.upArrow, this.downArrow])
        console.log(container.x);
        container.x = game.config.width/2 - (this.numPlayerslabel.width + playerlabel.width + borderPadding)/2


        console.log(container.x);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        keyBACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);


        keyLEFT.on('down', (key, event) => {
            this.startNoviceGame();
        });

        keyRIGHT.on('down', (key, event) => {
            this.startExpertGame();
        });


        keyUP.on('down', (key, event) => {
            if (numPlayers < 5) numPlayers += 1;
        });

        keyDOWN.on('down', (key, event) => {
            if (numPlayers > 1) numPlayers -= 1;
        });

        keyBACK.on('down', (key, event) => {
            this.openControls();
        });

        this.input.keyboard.on('keydown', (key) => {console.log(key)});
    }

    update(){
        this.numPlayerslabel.text = numPlayers;
        this.upArrow.visible = numPlayers < 5;
        this.downArrow.visible =  numPlayers > 1;
    }

    startExpertGame() {
        game.settings = {
            rocketSpeed: game.config.height/240,
            numSpaceships: 3,
            spaceshipSpeed: game.config.width/128,
            gameTimer: 5000,
            comboGoal: 5,
            comboDuration: 1500,
        };
        this.sound.play('sfx_select');
        this.scene.start('playScene', {controls: this.controls, numPlayers: this.numPlayers});
    }

    startNoviceGame() {
        game.settings = {
            rocketSpeed: game.config.height/240,
            numSpaceships: 3,
            spaceshipSpeed: game.config.width/320,
            gameTimer: 60000,
            comboGoal: 5,
            comboDuration: 2000
        };
        this.sound.play('sfx_select');
        this.scene.start('playScene', {controls: this.controls, numPlayers: this.numPlayers});
    }

    openControls(){
        this.scene.start('controlsScene');
    }


}