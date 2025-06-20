AFRAME.registerComponent('sky-stairs', {
  init: function () {
    const scene = this.el;
    const stepCount = 1000;
    const heightStep = 1.5;
    const depthStep = -10;

    for (let i = 0; i < stepCount; i++) {
      const y = i * heightStep;
      const z = i * depthStep;

      // 🟩 1. Platform
      const box = document.createElement('a-box');
      box.setAttribute('static-body', '');
      box.setAttribute('width', '30');
      box.setAttribute('height', '0.2');
      box.setAttribute('depth', '10');
      box.setAttribute('position', `0 ${y} ${z}`);
      box.setAttribute('material', 'src: #grass;');
      scene.appendChild(box);

      // 🌲 2. Tree
      const tree = document.createElement('a-entity');
      tree.setAttribute('gltf-model', '#tree');
      tree.setAttribute('scale', '0.25 0.25 0.25');
      tree.setAttribute('position', `-10 ${y + 0.1} ${z}`);
      scene.appendChild(tree);

      // 🟠 3. Scoring Orb – Offset to the Right
      const orb = document.createElement('a-entity');
      orb.setAttribute('geometry', 'primitive: sphere; radius: 0.5');
      orb.setAttribute('material', 'color: orange; emissive: yellow; emissiveIntensity: 0.6');
      orb.setAttribute('position', `10 ${y + 1} ${z}`); // Offset right
      orb.setAttribute('class', 'orb');
      orb.setAttribute('static-body', '');
      orb.setAttribute('score-system', '');
      scene.appendChild(orb);

      // 🔴 4. Damage Zone – Centered on Platform (but skip first)
      if (i !== 0) {
        const hazard = document.createElement('a-box');
        hazard.setAttribute('width', '3');
        hazard.setAttribute('height', '0.05');
        hazard.setAttribute('depth', '4');
        hazard.setAttribute('position', `0 ${y + 0.125} ${z}`); // Center of platform
        hazard.setAttribute('material', 'color: red; opacity: 0.8; transparent: true');
        hazard.setAttribute('damage-zone', 'damage: 10');
        hazard.setAttribute('static-body', '');
        scene.appendChild(hazard);
      }
    }
  }
});
