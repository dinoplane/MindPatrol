class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        this.currSelection = null;
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
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
                        'Use ⬌ arrows to move & (SPACE) to fire', menuConfig).setOrigin(0.5);

        
        menuConfig.backgroundColor = "#00FF00";
        menuConfig.color = "#000";
        this.add.text(game.config.width/2 , game.config.height/2 + borderUISize + borderPadding, 
                        'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyLEFT.on('down', (key, event) => {
            this.startNoviceGame();
        });

        keyRIGHT.on('down', (key, event) => {
            this.startExpertGame();
        });

        this.input.keyboard.on('keydown', (key) => {console.log(key)});
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