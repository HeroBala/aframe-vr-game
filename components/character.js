AFRAME.registerComponent('character', {
  init() {
    console.log('✅ Character initialized');

    // Directional velocity vectors
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
    this.damageCooldown = false;
    this.health = 100;

    window.health = this.health;
    this.characterModel = this.el.children[0];

    // Set up input and collisions
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.stop.bind(this));
    this.el.addEventListener('collide', this.processCollision.bind(this));
  },

  onKeyDown(event) {
    const keyMap = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'front',
      ArrowDown: 'back',
    };

    if (event.code === 'Space') {
      this.jump();
    } else if (keyMap[event.key]) {
      this.startRunning(keyMap[event.key]);
    }
  },

  startRunning(direction) {
    const previousDirection = this.direction;
    this.direction = direction;

    const directions = Object.keys(this.directions);
    const directionChange = ((directions.indexOf(direction) - directions.indexOf(previousDirection) + 4) % 4);
    this.rotationY = (this.rotationY + directionChange * 90) % 360;
    this.velocity = this.directions[direction];

    // Rotate character visually
    this.characterModel.setAttribute('animation', {
      property: 'rotation',
      to: { x: 0, y: this.rotationY, z: 0 },
      dur: 300,
      easing: 'easeOutQuad'
    });

    // Play running animation
    this.characterModel.setAttribute('animation-mixer', {
      clip: 'run',
      crossFadeDuration: 0.2
    });
  },

  stop() {
    this.velocity = null;

    // Play idle animation
    this.characterModel.setAttribute('animation-mixer', {
      clip: 'idle',
      crossFadeDuration: 0.2
    });
  },

  jump() {
    if (this.jumpCooldown || !this.el.body) return;

    this.el.body.velocity.y = 6;
    this.jumpCooldown = true;

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

    // Detect falling out of bounds
    if (pos.y < -5) {
      document.getElementById('game-over').style.display = 'block';
      this.el.removeAttribute('character');
      return;
    }

    // Ground detection
    const ray = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0), 0, 1.1);
    const intersections = ray.intersectObjects(this.el.sceneEl.object3D.children, true);
    this.isJumping = intersections.length === 0;

    // Apply directional velocity if moving
    if (this.velocity && this.el.body) {
      this.el.body.velocity.x = this.velocity.x;
      this.el.body.velocity.z = this.velocity.z;
    }
  },

  processCollision(event) {
    const collidedBody = event.detail.body;
    const isObstacle = collidedBody?.el?.hasAttribute('obstacle');

    if (!isObstacle || this.damageCooldown) return;

    this.damageCooldown = true;
    this.isJumping = false;
    this.health -= 30;
    window.health = this.health;

    const healthDisplay = document.querySelector('#healthText');
    if (healthDisplay) {
      healthDisplay.setAttribute('text', 'value', `Health: ${this.health}`);
    }

    if (this.health <= 0) {
      document.getElementById('game-over').style.display = 'block';
    }

    setTimeout(() => {
      this.damageCooldown = false;
    }, 1500);

    collidedBody.el.emit('collide-with-character');
  }
});
