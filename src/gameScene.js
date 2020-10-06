import Phaser from "phaser";
import { Card } from "./card";

var configCards = {
  rows: 2,
  cols: 5,
  cards: [1, 2, 3, 4, 5],
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  /**
   * Load client background
   */
  preload() {
    this.load.image("bg", "./assets/background.png");
    this.load.image("card", "./assets/card.png");
    this.load.image("card1", "./assets/card1.png");
    this.load.image("card2", "./assets/card2.png");
    this.load.image("card3", "./assets/card3.png");
    this.load.image("card4", "./assets/card4.png");
    this.load.image("card5", "./assets/card5.png");
  }
  /**
   * Output background
   */
  create() {
    this.createBackground();
    this.createCards();
    this.start();
  }
  /**
   * Start
   */
  start() {
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.initCards();
  }
  /**
   * Init all cards
   */
  initCards() {
    let positions = this.getCardsPositions();
    Phaser.Utils.Array.Shuffle(positions);
    this.cards.forEach((card) => {
      let position = positions.pop();
      card.close();
      card.setPosition(position.x, position.y);
    });
  }
  /**
   * Create Background image for game
   */
  createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }
  /**
   * Create cards on field
   */
  createCards() {
    this.cards = [];

    for (let value of configCards.cards) {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, value));
      }
    }

    this.input.on("gameobjectdown", this.onCardClicked, this);
  }
  /**
   * Click on card
   *
   * @param {*} pointer
   * @param {*} card
   */
  onCardClicked(pointer, card) {
    if (card.opened) {
      return false;
    }

    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.openedCard = null;
        ++this.openedCardsCount;
      } else {
        this.openedCard.close();
        this.openedCard = card;
      }
    } else {
      this.openedCard = card;
    }

    card.open();

    if (this.openedCardsCount === this.cards.length / 2) {
      this.start();
    }
  }
  /**
   * Set position cards on boad
   */
  getCardsPositions() {
    let position = [];
    let cardTextures = this.textures.get("card").getSourceImage();
    let cardWidth = cardTextures.width + 4;
    let cardHeight = cardTextures.height + 4;
    let offsetX =
      (this.sys.game.config.width - cardWidth * configCards.cols) / 2;
    let offsetY =
      (this.sys.game.config.height - cardHeight * configCards.rows) / 2;

    for (let row = 0; row < configCards.rows; row++) {
      for (let col = 0; col < configCards.cols; col++)
        position.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
    }
    return Phaser.Utils.Array.Shuffle(position);
  }
}
