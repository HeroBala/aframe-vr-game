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

      // 🌲 2. Random Tree
      if (Math.random() < 0.4) {
        const randomX = (Math.random() * 26) - 13;
        const randomZ = z + (Math.random() * 8) - 4;
        const scale = 0.2 + Math.random() * 0.1;
        const rotationY = Math.floor(Math.random() * 360);

        const tree = document.createElement('a-entity');
        tree.setAttribute('gltf-model', '#tree');
        tree.setAttribute('scale', `${scale} ${scale} ${scale}`);
        tree.setAttribute('rotation', `0 ${rotationY} 0`);
        tree.setAttribute('position', `${randomX} ${y + 0.1} ${randomZ}`);
        tree.setAttribute('static-body', '');
        scene.appendChild(tree);
      }

      // 🪙 3. Coin
      if (Math.random() < 0.5) {
        const randomX = (Math.random() * 26) - 13;
        const randomZ = z + (Math.random() * 8) - 4;

        const coin = document.createElement('a-entity');
        coin.setAttribute('gltf-model', '#coin');
        coin.setAttribute('scale', '5 5 5');
        coin.setAttribute('position', `${randomX} ${y + 2} ${randomZ}`);
        coin.setAttribute('class', 'coin');
        coin.setAttribute('dynamic-body', 'mass: 0.1;');
        coin.setAttribute('score-system', '');

        coin.setAttribute('animation__spin', {
          property: 'rotation',
          to: '0 360 0',
          loop: true,
          dur: 2000,
          easing: 'linear'
        });

        coin.setAttribute('animation__float', {
          property: 'position',
          dir: 'alternate',
          dur: 1000,
          easing: 'easeInOutSine',
          loop: true,
          to: `${randomX} ${y + 2.3} ${randomZ}`
        });

        scene.appendChild(coin);
      }

      // 🧟 4. Modular Zombie (new)
      if (i !==0) {
      const zombieEntity = document.createElement('a-entity');
      zombieEntity.setAttribute('zombie', { y: y, z: z });
      scene.appendChild(zombieEntity);
      }
      // 🔴 5. Animated Damage Zone
      if (i !== 0) {
        const hazard = document.createElement('a-box');
        hazard.setAttribute('width', '3');
        hazard.setAttribute('height', '0.05');
        hazard.setAttribute('depth', '4');
        hazard.setAttribute('position', `-10 ${y + 0.125} ${z}`);
        hazard.setAttribute('material', 'color: red; opacity: 0.8; transparent: true');
        hazard.setAttribute('damage-zone', 'damage: 10');
        hazard.setAttribute('static-body', '');

        hazard.setAttribute('animation__move', {
          property: 'position',
          dir: 'alternate',
          dur: 4000,
          easing: 'easeInOutSine',
          loop: true,
          from: `-10 ${y + 0.125} ${z}`,
          to: `10 ${y + 0.125} ${z}`
        });

        hazard.setAttribute('animation__color', {
          property: 'material.color',
          dir: 'alternate',
          dur: 500,
          easing: 'easeInOutSine',
          loop: true,
          from: 'red',
          to: '#ff8888'
        });

        scene.appendChild(hazard);
      }
    }
  }
});
