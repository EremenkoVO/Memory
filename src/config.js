import Phaser from "phaser";
import { GameScene } from "./gameScene";

/**
 * Config for game
 */
export let config = {
  type: Phaser.AUTO,
  wigth: 1280,
  height: 720,
  scene: new GameScene(),
};
