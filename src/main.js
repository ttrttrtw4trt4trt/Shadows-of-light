// src/main.js
import Player from './player.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 1000 }, debug: false }
  },
  scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('avatar', 'assets/2026_01_06_0hp_kleki.png');
}

function create() {
  // ground (static)
  const ground = this.add.rectangle(400, 580, 800, 40, 0x228b22);
  this.physics.add.existing(ground, true);

  // create player
  this.player = new Player(this, 100, 300);

  // collide player with ground
  this.physics.add.collider(this.player.sprite, ground);
}

function update(time, delta) {
  this.player.update();
}
