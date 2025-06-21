AFRAME.registerComponent('zombie', {
  schema: {
    y: { type: 'number' },
    z: { type: 'number' }
  },

  init: function () {
    const scene = this.el.sceneEl;
    if (Math.random() > 0.6) return;

    const startX = -10 + Math.random() * 3;
    const endX = 10 - Math.random() * 3;
    const walkZ = this.data.z + (Math.random() * 8 - 4);
    const zombieY = this.data.y + 1;

    const zombie = document.createElement('a-entity');
    zombie.setAttribute('gltf-model', '#zombie');
    zombie.setAttribute('scale', '0.3 0.3 0.3');
    zombie.setAttribute('position', `${startX} ${zombieY} ${walkZ}`);
    zombie.setAttribute('animation-mixer', 'clip: *; loop: repeat');
    zombie.setAttribute('dynamic-body', 'mass:1; shape: box;');

    // 🧠 ADD THESE TWO LINES:
    zombie.setAttribute('zombie-kill', 'damage: 30');
    zombie.setAttribute('class', 'zombie');

    zombie.setAttribute('zombie-move', {
  speed: 5,
  fromX: startX,
  toX: endX
});

    zombie.setAttribute('zombie-rotator', {
      fromX: startX,
      toX: endX
    });

    scene.appendChild(zombie);
  }
});
