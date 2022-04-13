let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scale: {  width: 920,
              height: 720,
            },
    scene: [ Menu, Play ]
  }

let game = new Phaser.Game(config);

// reserve keyboard vars
let keySPACE, keyR, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;