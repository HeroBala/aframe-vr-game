AFRAME.registerComponent('zombie-kill', {
  schema: {
    damage: { type: 'int', default: 100 } // Full damage, 50% will be applied
  },

  init: function () {
    this._triggered = false;

    this.el.addEventListener('collide', (e) => {
      if (this._triggered) return;

      const collider = e.detail.body.el;
      if (!collider || !collider.hasAttribute('character')) return;

      // ✅ Check if the character is a zombie
      const isZombie = collider.classList.contains('zombie');
      const actualDamage = isZombie ? this.data.damage * 0.5 : this.data.damage;

      this._triggered = true;

      // ✅ Initialize global health if missing
      if (typeof window.health !== 'number' || isNaN(window.health)) {
        window.health = 100;
      }

      // ✅ Apply calculated damage
      window.health -= actualDamage;
      if (window.health < 0 || isNaN(window.health)) {
        window.health = 0;
      }

      // ✅ Update health display
      const healthText = document.querySelector('#healthText');
      if (healthText) {
        healthText.setAttribute('text', 'value', `Health: ${window.health}`);
      }

      console.warn(`[Damage Zone] Health after collision: ${window.health}`);

      // ✅ Game over screen trigger
      if (window.health === 0) {
        const gameOverScreen = document.querySelector('#game-over');
        if (gameOverScreen) {
          gameOverScreen.style.display = 'block';
        }
      }

      // ✅ Disable or clean up zone
      this.el.setAttribute('visible', false);
      this.el.removeAttribute('damage-zone');
    });
  }
});
