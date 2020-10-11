import Phaser from "phaser";
import { Card } from "./card";

var configCards = {
  rows: 2,
  cols: 5,
  cards: [1, 2, 3, 4, 5],
  timeout: 30,
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  /**
   * Load client background
   */
  preload() {
    //image
    this.load.image("bg", "./assets/background.png");
    this.load.image("card", "./assets/card.png");
    this.load.image("card1", "./assets/card1.png");
    this.load.image("card2", "./assets/card2.png");
    this.load.image("card3", "./assets/card3.png");
    this.load.image("card4", "./assets/card4.png");
    this.load.image("card5", "./assets/card5.png");

    //audio
    this.load.audio("card", "./assets/card.mp3");
    this.load.audio("complete", "./assets/complete.mp3");
    this.load.audio("success", "./assets/success.mp3");
    this.load.audio("theme", "./assets/theme.mp3");
    this.load.audio("timeout", "./assets/timeout.mp3");
  }
  /**
   * Output background
   */
  create() {
    this.timeout = configCards.timeout;
    this.createSounds();
    this.createTimer();
    this.createBackground();
    this.createText();
    this.createCards();
    this.start();
  }
  /**
   * Game Timer
   */
  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    });
  }
  /**
   * Function Timer
   */
  onTimerTick() {
    this.timeoutText.setText(`Time: ${this.timeout}`);
    if (this.timeout <= 0) {
      this.sounds.timeout.play();
      this.start();
    }
    --this.timeout;
  }
  /**
   * Create Text
   */
  createText() {
    this.timeoutText = this.add.text(10, 670, "", {
      font: "36px Arial",
      fill: "#ffffff",
    });
  }

  /**
   * Start
   */
  start() {
    this.timeout = configCards.timeout;
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.sounds.theme.play({
      volume: 0.1,
    });
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

    this.sounds.card.play();

    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.sounds.success.play();
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
      this.sounds.complete.play();
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
      (this.sys.game.config.width - cardWidth * configCards.cols) / 2 +
      cardWidth / 2;
    let offsetY =
      (this.sys.game.config.height - cardHeight * configCards.rows) / 2 +
      cardHeight / 2;

    for (let row = 0; row < configCards.rows; row++) {
      for (let col = 0; col < configCards.cols; col++)
        position.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
    }
    return Phaser.Utils.Array.Shuffle(position);
  }
  /**
   * Create sounds for game
   */
  createSounds() {
    this.sounds = {
      card: this.sound.add("card"),
      complete: this.sound.add("complete"),
      success: this.sound.add("success"),
      theme: this.sound.add("theme"),
      timeout: this.sound.add("timeout"),
    };
  }
}
