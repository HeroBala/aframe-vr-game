AFRAME.registerComponent('platform-generator', {
  schema: { range: { type: 'int', default: 6 } },

  init() {
    this.platforms = [];
    this.currentIndex = 0;
    this.stepHeight = 1.5;
    this.stepDepth = -10;
    this.player = document.querySelector('#player');
  },

  tick() {
    if (!this.player) return;
    const playerZ = this.player.object3D.position.z;
    const neededIndex = Math.floor(playerZ / this.stepDepth);
    while (this.currentIndex < neededIndex + this.data.range) {
      this.spawnStep(this.currentIndex);
      this.currentIndex++;
    }
    while (this.platforms.length > 40) {
      const old = this.platforms.shift();
      old?.removeAttribute('dynamic-body');
      old?.parentNode?.removeChild(old);
    }
  },

  spawnStep(i) {
    const y = i * this.stepHeight;
    const z = i * this.stepDepth;

    const box = document.createElement('a-box');
    box.setAttribute('width', '30');
    box.setAttribute('height', '0.2');
    box.setAttribute('depth', '10');
    box.setAttribute('static-body', '');
    box.setAttribute('position', `0 ${y} ${z}`);
    box.setAttribute('material', 'src: #grass');
    this.el.appendChild(box);
    this.platforms.push(box);

    const chance = (r, cb) => Math.random() < r && cb();

    chance(0.5, () => {
      const coin = document.createElement('a-entity');
      const x = (Math.random() * 26) - 13;
      coin.setAttribute('gltf-model', '#coin');
      coin.setAttribute('class', 'coin');
      coin.setAttribute('position', `${x} ${y + 2} ${z}`);
      coin.setAttribute('scale', '5 5 5');
      coin.setAttribute('score-system', '');
      coin.setAttribute('dynamic-body', 'mass: 0.1');
      this.el.appendChild(coin);
      this.platforms.push(coin);
    });

    if (i > 0 && Math.random() < 0.6) {
      const zombie = document.createElement('a-entity');
      zombie.setAttribute('zombie', { y, z });
      this.el.appendChild(zombie);
      this.platforms.push(zombie);
    }

    chance(0.3, () => {
      const hazard = document.createElement('a-box');
      hazard.setAttribute('width', '3');
      hazard.setAttribute('height', '0.05');
      hazard.setAttribute('depth', '4');
      hazard.setAttribute('position', `-10 ${y + 0.125} ${z}`);
      hazard.setAttribute('material', 'color: red; opacity: 0.8; transparent: true');
      hazard.setAttribute('damage-zone', 'damage: 10');
      hazard.setAttribute('static-body', '');
      this.el.appendChild(hazard);
      this.platforms.push(hazard);
    });

    chance(0.15, () => {
      const health = document.createElement('a-entity');
      const x = (Math.random() * 26) - 13;
      health.setAttribute('gltf-model', '#health');
      health.setAttribute('scale', '2 2 2');
      health.setAttribute('position', `${x} ${y + 0.3} ${z}`);
      health.setAttribute('class', 'health');
      health.setAttribute('dynamic-body', 'mass: 0.1');
      health.setAttribute('health-system', '');
      this.el.appendChild(health);
      this.platforms.push(health);
    });
  }
});
