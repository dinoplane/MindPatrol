class ControlsMenu extends Phaser.Scene {
    static SELECTED_COLOR = { backgroundColor: "#726E6E",
                        color: "#FCE2A7"
                      }

    static CONTROL_KEYS = ["left", "right", "fire"];

    static MENU_CONFIG = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'center',
        padding: {
        top: 5,
        bottom: 5,
        },
        fixedWidth: 160
    }

    constructor(){
        super("controlsScene");
        this.labels = []
        this.selPlayer = 0;
        this.selKey = 0;
        this.listening = false;
        this.msg = null;
    }

    create() {

        // menu text config
        let menuConfig = ControlsMenu.MENU_CONFIG;
        //let 
        let startx = game.config.width/2 - menuConfig.fixedWidth / 2;
        this.add.text(startx , game.config.height/16, 
                        'CONTROLS', menuConfig).setOrigin(0, 0);

        menuConfig.fixedWidth = 120;
        for (let i = 0; i < 3; i++){
            this.add.text(startx -gridUnit/4 + 2*i*gridUnit , 3*game.config.height/16,
                             ControlsMenu.CONTROL_KEYS[i], menuConfig).setOrigin(0,0);
        }

        for (let i = 0; i < numPlayers; i++){
            this.labels.push([]);
            let y = 3*game.config.height/16 + borderPadding*4*(i+1);
            menuConfig.fixedWidth = 160;
            let label = this.add.text(game.config.width/4 -gridUnit/4 - menuConfig.fixedWidth / 2 , y, 
                                        'Player ' + (i+1), menuConfig).setOrigin(0,0);
            for (let j = 0; j < 3; j++){
                menuConfig.fixedWidth = 120;
                let x = startx -gridUnit/4+ 2*j*gridUnit;
                this.labels[i].push(this.add.text(x, y, 
                                        controls[i][ControlsMenu.CONTROL_KEYS[j]], menuConfig).setOrigin(0,0));
                console.log(j)
            }
        }
        
        //menuConfig.backgroundColor = "#00FF00";
        //menuConfig.color = "#000";
        this.msg = this.add.text(game.config.width/2 , game.config.height/2 + borderUISize + borderPadding, 
                        'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);


                        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        console.log(keyUP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyBACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        keyLEFT.on('down', (key, event) => {
            if (this.selKey > 0){
                this.clearPanel();
                this.selKey -= 1;
                this.drawPanel();
            }
        });

        keyRIGHT.on('down', (key, event) => {
            if (this.selKey < 2){
                this.clearPanel();
                this.selKey += 1;
                this.drawPanel();
            }
        });

        keyDOWN.on('down', (key, event) => {
            if (this.selPlayer < numPlayers - 1){
                this.clearPanel();
                this.selPlayer += 1;
                this.drawPanel();
            }
        });

        keyUP.on('down', (key, event) => {
            if (this.selPlayer > 0){
                this.clearPanel();
                this.selPlayer -= 1;
                this.drawPanel();
            }
        });

        keyENTER.on('down', (key, event) => {
            this.listening = true;
            console.log(listening);
            // Change text at the bottom
            // Change text at selection
        });

        console.log(this.input.keyboard.on('keydown', (key) => {this.setKey(key)}));
        this.drawPanel();
    }

    clearPanel(){
        console.log(this.selPlayer, ", ", this.selKey)
        this.labels[this.selPlayer][this.selKey].setBackgroundColor(
                    ControlsMenu.MENU_CONFIG.backgroundColor).setColor(ControlsMenu.MENU_CONFIG.color);
    }


    drawPanel(){
        this.labels[this.selPlayer][this.selKey].setBackgroundColor(
            ControlsMenu.SELECTED_COLOR.backgroundColor).setColor(ControlsMenu.SELECTED_COLOR.color);
    }

    setKey(key){
        console.log(key.key);
        this.listening = false;
    }
}