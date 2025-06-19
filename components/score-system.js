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

      // ✅ Check if collider has 'character' component
      if (collider && collider.hasAttribute('character')) {
        score += this.data.points;

        const scoreText = document.querySelector('#scoreText');
        if (scoreText) {
          scoreText.setAttribute('text', 'value', `Score: ${score}`);
        }

        const highScore = parseInt(localStorage.getItem('highScore') || '0');
        if (score > highScore) {
          localStorage.setItem('highScore', score);
        }

        this.orbEl.parentNode.removeChild(this.orbEl);
        console.log(`[Score System] Collected. Score: ${score}`);
      }
    });
  }
});
