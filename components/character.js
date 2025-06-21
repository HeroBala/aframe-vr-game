AFRAME.registerComponent('character', {
    init() {
        console.log('Hello, character!');

        this.directions = {
            'back': new CANNON.Vec3(0, 0, 7),
            'right': new CANNON.Vec3(5, 0, 0),
            'front': new CANNON.Vec3(0, 0, -7),
            'left': new CANNON.Vec3(-5, 0, 0),
        };

        this.health = 100;
        window.health=this.health 
        this.collisionBodies = [];
        this.velocity = null;
        this.rotationY = 90;
        this.direction = 'right';
        this.characterModel = this.el.children[0];
        this.isJumping = false;

        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                this.startRunning('left');
            } else if (event.key === 'ArrowRight') {
                this.startRunning('right');
            } else if (event.key === 'ArrowUp') {
                this.startRunning('front');
            } else if (event.key === 'ArrowDown') {
                this.startRunning('back');
            } else if (event.code === 'Space') {
                this.jump();
            }
        });

        document.addEventListener('keyup', () => this.stop());

        this.el.addEventListener('collide', event => this.processCollision(event));
    },

    startRunning(direction) {
        const directions = Object.keys(this.directions);

        let diff = directions.indexOf(direction) - directions.indexOf(this.direction);
        diff = diff >= 3 ? diff - 4 : diff;
        diff = diff <= -3 ? diff + 4 : diff;

        this.rotationY += diff * 90;
        this.direction = direction;
        this.velocity = this.directions[direction];

        this.characterModel.setAttribute('animation', {
            property: 'rotation',
            to: { x: 0, y: this.rotationY, z: 0 },
            dur: 500,
            easing: 'easeOutQuad',
        });

        this.characterModel.setAttribute('animation-mixer', {
            clip: 'run',
            crossFadeDuration: 0.2,
        });
    },

    stop() {
        this.velocity = null;

        this.characterModel.setAttribute('animation-mixer', {
            clip: 'idle',
            crossFadeDuration: 0.2,
        });
    },

    jump() {
        if (this.isJumping || !this.el.body) return;

        this.el.body.velocity.y = 7;
        this.isJumping = true;

        this.characterModel.setAttribute('animation-mixer', {
            clip: 'jump',
            crossFadeDuration: 0.2,
        });

        setTimeout(() => {
            if (this.velocity) {
                this.characterModel.setAttribute('animation-mixer', {
                    clip: 'run',
                    crossFadeDuration: 0.2,
                });
            } else {
                this.characterModel.setAttribute('animation-mixer', {
                    clip: 'idle',
                    crossFadeDuration: 0.2,
                });
            }
        }, 700);
    },

    tick() {
        // Character fell off map
        if (this.el.object3D.position.y < -5) {
            document.getElementById('game-over').style.display = 'block';
            this.el.removeAttribute('character');
            return;
        }

        // Apply horizontal movement
        if (this.velocity !== null && this.el.body) {
            this.el.body.velocity.x = this.velocity.x;
            this.el.body.velocity.z = this.velocity.z;
        }
    },

    processCollision(event) {
        const otherBody = event.detail.body;
        if (!otherBody || !otherBody.el) return;

        this.isJumping = false;

        if (!otherBody.el.hasAttribute('obstacle')) return;

        if (this.collisionBodies.includes(otherBody)) return;

        this.collisionBodies.push(otherBody);

        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(() => {
            this.collisionBodies.splice(0, this.collisionBodies.length);
        }, 500);

       this.health -= 40;
       window.health = this.health;
console.log('Health', this.health);

const healthText = document.querySelector('#healthText');
if (healthText) {
  healthText.setAttribute('text', 'value', `Health: ${this.health}`);
}

if (this.health < 0) {
  document.getElementById('game-over').style.display = 'block';
}

otherBody.el.emit('collide-with-character');

        otherBody.el.emit('collide-with-character');
    }
});
