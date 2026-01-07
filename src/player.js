// src/player.js
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    // Use the single image loaded as 'avatar'
    this.sprite = scene.physics.add.sprite(x, y, 'avatar');
    this.sprite.setCollideWorldBounds(true);

    // If the image is larger than you want for collisions, adjust body size:
    // Uncomment and set values if needed:
    // this.sprite.setSize(32, 48);
    // this.sprite.setOffset(0, 0);

    // Movement settings
    this.walkSpeed = 180;
    this.jumpSpeed = -430;
    this.facing = 'right';

    // Controls
    this.keys = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      attack: Phaser.Input.Keyboard.KeyCodes.K
    });

    // Attack state
    this.isAttacking = false;
    this.attackDuration = 200;
    this.attackCooldown = 300;
    this._canAttack = true;

    // Attack hitbox as an invisible physics zone
    this.attackHitbox = scene.add.zone(x + 20, y, 24, 24);
    scene.physics.add.existing(this.attackHitbox);
    this.attackHitbox.body.setAllowGravity(false);
    this.attackHitbox.body.setEnable(false);
  }

  update() {
    const body = this.sprite.body;
    const left = this.keys.left.isDown;
    const right = this.keys.right.isDown;
    const up = this.keys.up.isDown || this.keys.jump.isDown;
    const attackKey = this.keys.attack;

    // Horizontal movement
    if (left) {
      body.setVelocityX(-this.walkSpeed);
      this.facing = 'left';
      this.sprite.setFlipX(true);
    } else if (right) {
      body.setVelocityX(this.walkSpeed);
      this.facing = 'right';
      this.sprite.setFlipX(false);
    } else {
      body.setVelocityX(0);
    }

    // Jump (only if on ground)
    if (up && body.blocked.down) {
      body.setVelocityY(this.jumpSpeed);
    }

    // Position attack hitbox based on facing
    const offsetX = (this.facing === 'right') ? 20 : -20;
    this.attackHitbox.x = this.sprite.x + offsetX;
    this.attackHitbox.y = this.sprite.y;

    // Attack input
    if (Phaser.Input.Keyboard.JustDown(attackKey)) {
      this.tryAttack();
    }
  }

  tryAttack() {
    if (!this._canAttack) return;

    this._canAttack = false;
    this.isAttacking = true;

    // enable hitbox for attack
    this.attackHitbox.body.setEnable(true);

    // optionally show a debug rectangle while testing:
    // const debugRect = this.scene.add.rectangle(this.attackHitbox.x, this.attackHitbox.y, this.attackHitbox.width, this.attackHitbox.height, 0xff0000, 0.3);
    // this.scene.time.delayedCall(this.attackDuration, () => debugRect.destroy());

    // disable hitbox after attackDuration
    this.scene.time.delayedCall(this.attackDuration, () => {
      this.isAttacking = false;
      this.attackHitbox.body.setEnable(false);
    });

    // reset attack cooldown
    this.scene.time.delayedCall(this.attackCooldown, () => {
      this._canAttack = true;
    });
  }
}
