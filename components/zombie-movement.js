AFRAME.registerComponent('zombie-move', {
  schema: {
    speed: { type: 'number', default: 1 },
    fromX: { type: 'number' },
    toX: { type: 'number' }
  },

  init: function () {
    this.direction = 1; // 1 = forward, -1 = backward
    this.body = this.el.body;
    this.startX = this.data.fromX;
    this.endX = this.data.toX;
  },

  tick: function () {
    if (!this.el.body) return;

    const positionX = this.el.object3D.position.x;

    // Change direction if out of bounds
    if (this.direction === 1 && positionX >= this.endX) {
      this.direction = -1;
    } else if (this.direction === -1 && positionX <= this.startX) {
      this.direction = 1;
    }

    // Set linear velocity
    const velocity = new CANNON.Vec3(this.data.speed * this.direction, 0, 0);
    this.el.body.velocity.x = velocity.x;
  }
});
