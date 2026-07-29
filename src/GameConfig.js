// GameConfig.js
import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import MainScene from "./scenes/MainScene";

const GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: "#161426",
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
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [PreloadScene, MainScene]
};

export default GameConfig;
