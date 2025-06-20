let score = 0;

AFRAME.registerComponent('score-system', {
  schema: {
    points: { type: 'int', default: 10 }
  },

  init: function () {
    this.orbEl = this.el;

    this.orbEl.addEventListener('collide', (e) => {
      const collider = e.detail.body.el;
      console.log('[Score System] Collision with:', collider);

      if (!collider || !collider.hasAttribute('character')) return;

      // Increment score
      score += this.data.points;

      // Update score display
      const scoreText = document.querySelector('#scoreText');
      if (scoreText) {
        scoreText.setAttribute('text', 'value', `Score: ${score}`);
      }

      // Update high score
      const highScore = parseInt(localStorage.getItem('highScore') || '0');
      if (score > highScore) {
        localStorage.setItem('highScore', score);
      }

      // 🔒 Prevent physics freeze by hiding first
      this.orbEl.setAttribute('visible', false);

      // Safely remove physics body from world if it exists
      if (this.orbEl.body && this.el.sceneEl.systems.physics) {
        this.el.sceneEl.systems.physics.world.removeBody(this.orbEl.body);
      }

      // Remove orb from DOM after physics resolves
      setTimeout(() => {
        if (this.orbEl.parentNode) {
          this.orbEl.parentNode.removeChild(this.orbEl);
        }
      }, 100); // Delay ensures physics cleanup

      console.log(`[Score System] Collected. Score: ${score}`);
    });
  }
});
