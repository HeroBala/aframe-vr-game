AFRAME.registerComponent('zombie-kill', {
  schema: {
    damage: { type: 'int', default: 30 }
  },

  init: function () {
    this._alreadyHit = false;

    this.el.addEventListener('collide', (e) => {
      const characterEl = e.detail.body.el;
      if (!characterEl || !characterEl.components.character) return;

      if (this._alreadyHit) return;
      this._alreadyHit = true;

      // ✅ Correctly initialize health
      if (typeof window.health !== 'number' || isNaN(window.health)) {
        window.health = 100;
      }

      const damage = this.data.damage;

      // ✅ Reduce health by 30, not set to 30
      window.health = Math.max(0, window.health - damage);
      characterEl.components.character.health = window.health;

      // ✅ Update HUD
      const healthText = document.querySelector('#healthText');
      if (healthText) {
        healthText.setAttribute('text', 'value', `Health: ${window.health}`);
      }

      console.warn(`[Zombie-Kill] -${damage} HP → Health: ${window.health}`);

      // ✅ Reset collision flag after 1s
      setTimeout(() => {
        this._alreadyHit = false;
      }, 1000);
    });
  }
});
