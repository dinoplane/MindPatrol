// Arrian Chi Rocket Havoc  Apr. 16, 2022 ~20 hours

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



// Mods completed
// Implement the 'FIRE' UI text from the original game (5)
// Randomize each spaceship's movement direction at the start of each play (5)
// Allow the player to control the Rocket after it's fired (5)
// Display the time remaining (in seconds) on the screen (10)
// Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
// Implement a simultaneous two-player mode (30)

// Custom Mods:
// - Combo Timer UI
// - Custom Controls (10?)