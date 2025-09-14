// GameConfig.js
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import MainScene from "./scenes/MainScene";

const GameConfig = {
    type: Phaser.WEBGL, // or CANVAS
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#000000",
    physics: {
        default: "matter",
            matter: {
      debug: false,       // See polygons / collisions
      gravity: { y: 0 }  // Disable gravity if top-down
    }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        //width: 1920, // Set to your original development width
        //height: 1200 // Set to your original development height
    },
    
    scene: [PreloadScene, MainScene]

};

export default GameConfig;
