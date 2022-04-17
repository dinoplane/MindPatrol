class ControlsMenu extends Phaser.Scene {
    static SELECTED_COLOR = { backgroundColor: "#726E6E",
                        color: "#FCE2A7"
                      }

    static CONTROL_KEYS = ["left", "right", "fire"];

    static SPECIAL_KEYCODES = [
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.SPACE,
        Phaser.Input.Keyboard.KeyCodes.BACKSPACE
    ];

    static SPECIAL_KEYNAMES = ["Left", "Right", "Up", "Down", "Space", "Bksp"]

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
        menuConfig.fixedWidth = 0;
        this.add.text(startx , game.config.height/16, 
                        'CONTROLS', menuConfig).setOrigin(0, 0);

        menuConfig.fixedWidth = 120;
        for (let i = 0; i < 3; i++){
            this.add.text(startx -gridUnit/4 + 2*i*gridUnit , 3*game.config.height/16,
                             ControlsMenu.CONTROL_KEYS[i], menuConfig).setOrigin(0,0);
        }
        let y = 0;
        for (let i = 0; i < numPlayers; i++){
            this.labels.push([]);
            y = 3*game.config.height/16 + borderPadding*4*(i+1);
            menuConfig.fixedWidth = 160;
            let label = this.add.text(game.config.width/4 -gridUnit/4 - menuConfig.fixedWidth / 2 , y, 
                                        'Player ' + (i+1), menuConfig).setOrigin(0,0);
            for (let j = 0; j < 3; j++){
                menuConfig.fixedWidth = 120;
                let x = startx -gridUnit/4+ 2*j*gridUnit;
                let key = controls[i][ControlsMenu.CONTROL_KEYS[j]];
                if (typeof(key) != "string")
                    key = this.getKeyName(key);
                console.log(typeof(key))
                this.labels[i].push(this.add.text(x, y, 
                                        key, menuConfig).setOrigin(0,0));
            }
        }
        
        //menuConfig.backgroundColor = "#00FF00";
        //menuConfig.color = "#000";

        let msgConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00FF00',
            color: '#000',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        y = 3*game.config.height/16 + borderPadding*4*(numPlayers+2)
        this.msg1 = this.add.text(game.config.width/2 , y, 
                        'Use ←↓↑→ and (ENTER) to select keys.', msgConfig).setOrigin(0.5, 0);
        y = 3*game.config.height/16 + borderPadding*4*(numPlayers+3)
        this.msg2 = this.add.text(game.config.width/2 , y, 
                        'Use (BACKSPACE) to return to menu.', msgConfig).setOrigin(0.5, 0);

        console.log(Phaser.Input.Keyboard.KeyCodes)
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyBACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        keyLEFT.on('down', (key, event) => {
            if (this.selKey > 0 && !this.listening){
                this.clearPanel();
                this.selKey -= 1;
                this.drawPanel();
            }
        });

        keyRIGHT.on('down', (key, event) => {
            if (this.selKey < 2 && !this.listening){
                this.clearPanel();
                this.selKey += 1;
                this.drawPanel();
            }
        });

        keyDOWN.on('down', (key, event) => {
            if (this.selPlayer < numPlayers - 1 && !this.listening){
                this.clearPanel();
                this.selPlayer += 1;
                this.drawPanel();
            }
        });

        keyUP.on('down', (key, event) => {
            if (this.selPlayer > 0 && !this.listening){
                this.clearPanel();
                this.selPlayer -= 1;
                this.drawPanel();
            }
        });

        keyENTER.on('down', (key, event) => {
            if (!this.listening){
                this.listening = true;
                this.msg1.text = "Enter a key."
                this.msg2.visible = false;
                this.labels[this.selPlayer][this.selKey].text = "[ - ]";
                event.stopImmediatePropagation();
            }
        });

        this.input.keyboard.on('keydown', (key) => {
            this.setKey(key);
        });

        keyBACK.on('down', (key, event) => {
            if (!this.listening)
                this.scene.start("menuScene");
        });

        this.drawPanel();
    }

    clearPanel(){
        this.labels[this.selPlayer][this.selKey].setBackgroundColor(
                    ControlsMenu.MENU_CONFIG.backgroundColor).setColor(ControlsMenu.MENU_CONFIG.color);
    }


    drawPanel(){
        this.labels[this.selPlayer][this.selKey].setBackgroundColor(
            ControlsMenu.SELECTED_COLOR.backgroundColor).setColor(ControlsMenu.SELECTED_COLOR.color);
    }

    setKey(key){
        if (this.listening){
            this.labels[this.selPlayer][this.selKey].text = this.getKeyName(key);
            controls[this.selPlayer][ControlsMenu.CONTROL_KEYS[this.selKey]] = key;
            this.listening = false;
            console.log(controls);
            this.msg1.text = 'Use ←↓↑→ and (ENTER) to select keys.';
            this.msg2.visible = true; 
        }
    }
    
    getKeyName(key){
        let keyLabel = key.key;
        console.log(key.keyCode)
        console.log(ControlsMenu.SPECIAL_KEYCODES.indexOf(37)   );
        let i = ControlsMenu.SPECIAL_KEYCODES.indexOf(key.keyCode);
        console.log(i);
        if (i != -1)
            keyLabel = ControlsMenu.SPECIAL_KEYNAMES[i]; 
        return keyLabel;
    }
}