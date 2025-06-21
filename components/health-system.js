AFRAME.registerComponent('health-system', {
  init: function () {
    this._used = false;

    this.el.addEventListener('collide', e => {
      if (this._used) return;

      const collider = e.detail.body.el;
      if (!collider || !collider.hasAttribute('character')) return;

      this._used = true;

      // ✅ Full heal
      if (typeof window.health !== 'number' || isNaN(window.health)) {
        window.health = 100;
      } else {
        window.health = 100;
      }

      // ✅ Update character component if it exists
      if (collider.components.character) {
        collider.components.character.health = 100;
      }

      // ✅ Update HUD
      const healthText = document.querySelector('#healthText');
      if (healthText) {
        healthText.setAttribute('text', 'value', `Health: ${window.health}`);
      }

      console.log('[Health-System] Player healed to 100.');

      // ✅ Hide and remove the health pickup
      this.el.setAttribute('visible', false);
      this.el.removeAttribute('health-system');

      if (this.el.body && this.el.sceneEl.systems.physics) {
        this.el.sceneEl.systems.physics.world.removeBody(this.el.body);
      }

      setTimeout(() => {
        if (this.el.parentNode) {
          this.el.parentNode.removeChild(this.el);
        }
      }, 100);
    });
  }
});
