class ControlsMenu extends Phaser.Scene {
    static SELECTED = { backgroundColor: "",
                        color: ""
                      }

    static CONTROL_KEYS = ["left", "right", "fire"];

    constructor(){
        super("controlsScene");
        this.buttons = []
        this.selPlayer = 0;
        this.selKey = 0;
        this.listening = 0;
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

        this.add.text(game.config.width/2 , game.config.height/8, 
                        'CONTROLS', menuConfig).setOrigin(0.5);

        for (let i = 0; i < numPlayers; i++){
            this.buttons.push([]);
            let y = game.config.height/8 + borderUISize*(2+i);
            let label = this.add.text(game.config.width/4 , y, 'Player ' + (i+1), menuConfig).setOrigin(0.5);
            for (let j = 0; j < 3; j++){
                let x = game.config.width/4  + label.width +  borderUISize*(j+1) +  borderPadding*(j+1)
                this.buttons[i].push(this.add.text(x, y, 
                                        'P' + (i+1), menuConfig).setOrigin(0.5));
                console.log(j)
            }
        }
        
        


        
        
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

        console.log(this.input.keyboard.on('keydown', (key) => {console.log(key)}));
    }


}