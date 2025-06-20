AFRAME.registerComponent('damage-zone', {
  schema: {
    damage: { type: 'int', default: 10 }
  },

  init: function () {
    this._triggered = false; // ✅ Flag to prevent multiple hits
    this.el.addEventListener('collide', (e) => {
      if (this._triggered) return; // Only damage once
      const collider = e.detail.body.el;
      if (!collider || !collider.hasAttribute('character')) return;

      this._triggered = true;

      // ✅ Initialize if needed
      if (typeof window.health !== 'number' || isNaN(window.health)) {
        window.health = 100;
      }

      // ✅ Apply damage
      window.health -= this.data.damage;
      if (window.health < 0 || isNaN(window.health)) {
        window.health = 0;
      }

      // ✅ Update HUD
      const healthText = document.querySelector('#healthText');
      if (healthText) {
        healthText.setAttribute('text', 'value', `Health: ${window.health}`);
      }

      console.warn(`[Damage Zone] Health is now: ${window.health}`);

      // ✅ Check game-over condition
      if (window.health === 0) {
        const gameOverScreen = document.querySelector('#game-over');
        if (gameOverScreen) {
          gameOverScreen.style.display = 'block';
        }
      }

      // Optional: visually disable or remove zone
      this.el.setAttribute('visible', false);
      this.el.removeAttribute('damage-zone');
    });
  }
});
