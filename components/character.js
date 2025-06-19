AFRAME.registerComponent('character', {
    init() {
        console.log('Hello, character!');

        // Define movement directions and their corresponding velocity vectors
        this.directions = {
            'back': new CANNON.Vec3(0, 0, 7),
            'right': new CANNON.Vec3(7, 0, 0),
            'front': new CANNON.Vec3(0, 0, -7),
            'left': new CANNON.Vec3(-7, 0, 0),
        };

        this.health = 100; // Character's health
        this.collisionBodies = []; // Track recently collided entities
        this.velocity = null; // Active movement vector
        this.rotationY = 90; // Character's Y-axis rotation
        this.direction = 'right'; // Initial movement direction
        this.characterModel = this.el.children[0]; // Get the character's 3D model
        this.isJumping = false; // Track if character is currently jumping

        // Key down event: move or jump the character
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
                this.jump(); // Trigger jump on spacebar
            }
        });

        // Key up event: stop the character
        document.addEventListener('keyup', () => this.stop());

        // Listen for physics collisions
        this.el.addEventListener('collide', event => this.processCollision(event));
    },

    // Handle character movement
    startRunning(direction) {
        const directions = Object.keys(this.directions);

        // Determine rotation adjustment based on current and new direction
        let diff = directions.indexOf(direction) - directions.indexOf(this.direction);
        diff = diff >= 3 ? diff - 4 : diff;
        diff = diff <= -3 ? diff + 4 : diff;

        // Update rotation and direction
        this.rotationY += diff * 90;
        this.direction = direction;
        this.velocity = this.directions[direction];

        // Rotate the character model
        this.characterModel.setAttribute('animation', {
            property: 'rotation',
            to: {x: 0, y: this.rotationY, z: 0},
            dur: 500,
            easing: 'easeOutQuad',
        });

        // Play running animation
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'run',
            crossFadeDuration: 0.2,
        });
    },

    // Stop character movement and animation
    stop() {
        this.velocity = null;

        this.characterModel.setAttribute('animation-mixer', {
            clip: 'idle',
            crossFadeDuration: 0.2,
        });
    },

    // Handle jumping
    jump() {
        // Only jump if not already airborne and body exists
        if (this.isJumping || !this.el.body) return;

        this.el.body.velocity.y = 5; // Apply upward velocity
        this.isJumping = true;

        // Play jump animation if defined
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'jump',
            crossFadeDuration: 0.2,
        });

        // Optionally switch back to idle or running after jump animation ends (~700ms assumed)
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
        }, 700); // Adjust duration to match your actual jump animation length
    },

    // Called every frame
    tick() {
        if (this.velocity !== null) {
            // Maintain constant horizontal velocity (X/Z only)
            this.el.body.velocity.x = this.velocity.x;
            this.el.body.velocity.z = this.velocity.z;
        }
    },

    // Handle collision events
    processCollision(event) {
        const otherEntity = event.detail.body;

        // Reset jumping state (assumes we hit the ground or something solid)
        this.isJumping = false;

        // Ignore if the collided entity does not have 'obstacle' attribute
        if (!otherEntity.el.hasAttribute('obstacle')) {
            return;
        }

        // Avoid repeated collisions with the same entity
        if (this.collisionBodies.includes(otherEntity)) {
            return;
        }

        // Track this entity to avoid re-collision
        this.collisionBodies.push(otherEntity);

        // Clear collision memory after 500ms to allow repeated hits
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(() =>
            this.collisionBodies.splice(0, this.collisionBodies.length),
            500
        );

        // Deduct health on collision
        this.health -= 40;
        console.log('Health', this.health);

        // Check for game over
        if (this.health < 0) {
            document.getElementById('game-over').style.display = 'block';
        }

        // Notify the collided entity of the impact
        otherEntity.el.emit('collide-with-character');
    },
});
