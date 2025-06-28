AFRAME.registerComponent('score-system', {
  schema: {
    points: { type: 'int', default: 10 }
  },

  init: function () {
    this.orbEl = this.el;

    this._collected = false; // ✅ flag to prevent multiple triggers

    this.orbEl.addEventListener('collide', (e) => {
      if (this._collected) return; // ✅ already collected once

      const collider = e.detail.body.el;
      if (!collider || !collider.hasAttribute('character')) return;

      this._collected = true; // ✅ mark as collected

      // ✅ Increment score
      window.score += this.data.points;

      // ✅ Update score HUD
      const scoreText = document.querySelector('#scoreText');
      if (scoreText) {
        scoreText.setAttribute('text', 'value', `Score: ${window.score}`);
      }

      // ✅ Update high score
      const highScore = parseInt(localStorage.getItem('highScore') || '0');
      if (window.score > highScore) {
        localStorage.setItem('highScore', window.score);
      }

      // ✅ WIN CONDITION
      if (window.score >= 20) { // Adjust this threshold based on your point scale
        const winScreen = document.querySelector('#winScreen');
        if (winScreen) {
          winScreen.setAttribute('visible', true); // A-Frame visibility
        }

        // Optional: disable controls or stop game logic
        console.log('[Score System] 🎉 You won!');
      }

      // ✅ Disable and remove orb
      this.orbEl.setAttribute('visible', false); // Hide
      this.orbEl.removeAttribute('score-system'); // Prevent further use

      // ✅ Remove physics body properly
      if (this.orbEl.body && this.el.sceneEl.systems.physics) {
        this.el.sceneEl.systems.physics.world.removeBody(this.orbEl.body);
      }

      // ✅ Fully remove from DOM after a short delay
      setTimeout(() => {
        if (this.orbEl.parentNode) {
          this.orbEl.parentNode.removeChild(this.orbEl);
        }
      }, 100);

      console.log(`[Score System] Orb collected. Score: ${window.score}`);
    });
  }
});
