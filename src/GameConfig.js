// GameConfig.js
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import MainScene from "./scenes/MainScene";

const GameConfig = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1200,
    backgroundColor: "#000000",
    parent: "game-container",
    pixelArt: true,
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
        width: 1920,
        height: 1200
    },
    scene: [PreloadScene, MainScene]
};

export default GameConfig;
