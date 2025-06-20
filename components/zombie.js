AFRAME.registerComponent('zombie', {
  schema: {
    y: { type: 'number' },
    z: { type: 'number' }
  },

  init: function () {
    const scene = this.el.sceneEl;
    if (Math.random() > 0.2) return; // 20% chance to spawn

    const startX = -10 + Math.random() * 3;
    const endX = 10 - Math.random() * 3;
    const walkZ = this.data.z + (Math.random() * 8 - 4);
    const zombieY = this.data.y + 1;

    const zombie = document.createElement('a-entity');
    zombie.setAttribute('gltf-model', '#zombie');
    zombie.setAttribute('scale', '0.3 0.3 0.3');
    zombie.setAttribute('position', `${startX} ${zombieY} ${walkZ}`);
    zombie.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    zombie.setAttribute('static-body', '');

    // Walk Animation
    zombie.setAttribute('animation__move', {
      property: 'position',
      from: `${startX} ${zombieY} ${walkZ}`,
      to: `${endX} ${zombieY} ${walkZ}`,
      dur: 6000,
      easing: 'linear',
      loop: true,
      dir: 'alternate'
    });

    // Face Movement Direction (Realistic Flip)
    zombie.setAttribute('zombie-rotator', {
      fromX: startX,
      toX: endX
    });

    scene.appendChild(zombie);
  }
});

AFRAME.registerComponent('zombie-rotator', {
  schema: {
    fromX: { type: 'number' },
    toX: { type: 'number' }
  },
  init: function () {
    this.forward = this.data.toX > this.data.fromX;
    this.el.object3D.rotation.y = this.forward ? Math.PI / 2 : -Math.PI / 2;
  },
  tick: function () {
    const x = this.el.object3D.position.x;
    const threshold = 0.2;

    if (this.forward && x >= this.data.toX - threshold) {
      this.el.object3D.rotation.y = -Math.PI / 2;
      this.forward = false;
    } else if (!this.forward && x <= this.data.fromX + threshold) {
      this.el.object3D.rotation.y = Math.PI / 2;
      this.forward = true;
    }
  }
});
