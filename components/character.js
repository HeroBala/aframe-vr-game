AFRAME.registerComponent('character', {
  init() {
    console.log('✅ Character initialized');

    this.directions = {
      back: new CANNON.Vec3(0, 0, 4),
      right: new CANNON.Vec3(4, 0, 0),
      front: new CANNON.Vec3(0, 0, -4),
      left: new CANNON.Vec3(-4, 0, 0),
    };

    this.direction = 'right';
    this.velocity = null;
    this.rotationY = 90;
    this.jumpCooldown = false;
    this.isJumping = false;
    this.health = 100;
    this.characterModel = this.el.children[0];
    this.damageCooldown = false;

    window.health = this.health;

    // Input listeners
    document.addEventListener('keydown', e => this.onKeyDown(e));
    document.addEventListener('keyup', () => this.stop());

    this.el.addEventListener('collide', e => this.processCollision(e));
  },

  onKeyDown(e) {
    const map = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'front',
      ArrowDown: 'back'
    };
    if (e.code === 'Space') this.jump();
    if (map[e.key]) this.startRunning(map[e.key]);
  },

  startRunning(dir) {
    const prev = this.direction;
    this.direction = dir;

    const diff = ((Object.keys(this.directions).indexOf(dir) - Object.keys(this.directions).indexOf(prev) + 4) % 4);
    this.rotationY = (this.rotationY + diff * 90) % 360;
    this.velocity = this.directions[dir];

    this.characterModel.setAttribute('animation', {
      property: 'rotation',
      to: { x: 0, y: this.rotationY, z: 0 },
      dur: 300,
      easing: 'easeOutQuad'
    });

    this.characterModel.setAttribute('animation-mixer', {
      clip: 'run',
      crossFadeDuration: 0.2
    });
  },

  stop() {
    this.velocity = null;
    this.characterModel.setAttribute('animation-mixer', {
      clip: 'idle',
      crossFadeDuration: 0.2
    });
  },

  jump() {
    if (this.jumpCooldown || !this.el.body || this.isJumping === true) return;

    const origin = new THREE.Vector3();
    this.el.object3D.getWorldPosition(origin);
    const ray = new THREE.Raycaster(origin, new THREE.Vector3(0, -1, 0), 0, 1.1);

    // Filter to hit only `.ground`
    const groundMeshes = [];
    this.el.sceneEl.object3D.traverse(obj => {
      if (obj.el && obj.el.classList && obj.el.classList.contains('ground')) {
        groundMeshes.push(obj);
      }
    });

    const hits = ray.intersectObjects(groundMeshes, true);
    if (hits.length === 0) return;

    this.el.body.velocity.y = 6;
    this.jumpCooldown = true;
    this.isJumping = true;

    this.characterModel.setAttribute('animation-mixer', {
      clip: 'jump',
      crossFadeDuration: 0.2
    });

    setTimeout(() => {
      this.jumpCooldown = false;
    }, 700);
  },

  tick() {
    const pos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);

    if (pos.y < -5) {
      document.getElementById('game-over').style.display = 'block';
      this.el.removeAttribute('character');
      return;
    }

    // Check if grounded
    const ray = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0), 0, 1.1);
    const groundMeshes = [];
    this.el.sceneEl.object3D.traverse(obj => {
      if (obj.el && obj.el.classList && obj.el.classList.contains('ground')) {
        groundMeshes.push(obj);
      }
    });
    const hits = ray.intersectObjects(groundMeshes, true);
    this.isJumping = hits.length === 0;

    if (this.velocity && this.el.body) {
      this.el.body.velocity.x = this.velocity.x;
      this.el.body.velocity.z = this.velocity.z;
    }
  },

  processCollision(e) {
    const body = e.detail.body;
    if (!body?.el?.hasAttribute('obstacle') || this.damageCooldown) return;

    this.isJumping = false;
    this.damageCooldown = true;
    this.health -= 30;
    window.health = this.health;

    const healthText = document.querySelector('#healthText');
    if (healthText) {
      healthText.setAttribute('text', 'value', `Health: ${this.health}`);
    }

    if (this.health <= 0) {
      document.getElementById('game-over').style.display = 'block';
    }

    setTimeout(() => {
      this.damageCooldown = false;
    }, 1500);

    body.el.emit('collide-with-character');
  }
});
