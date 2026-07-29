// game.js
import Phaser from "phaser";
import GameConfig from "./GameConfig";

let game = null;

export function getGame() {
    return game;
}

export function createGame() {
    if (!game) {
        game = new Phaser.Game(GameConfig);
    }
    return game;
}

export function destroyGame() {
    if (game) {
        game.destroy(true);
        game = null;
    }
}
