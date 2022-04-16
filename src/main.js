var config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scale: {  width: 920,
              height: 720,
            },
    scene: [ControlsMenu, Menu, Play],
  }

var game = new Phaser.Game(config);

// Global Variables
let controls = [ {left: "LEFT", right: "RIGHT", fire: "UP"},
                 {left: "LEFT", right: "RIGHT", fire: "UP"},
                 {left: "LEFT", right: "RIGHT", fire: "UP"}]
let numPlayers = 3
// reserve keyboard vars
let keySPACE, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyENTER, keyBACK;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let gridUnit = 80