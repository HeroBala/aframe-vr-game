import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'

// Components
import './components/character'
import './components/obstacle'
import './components/collider-check'
import './shaders/glowing'
import './components/score-system'
import './components/sky-stairs'
import './components/damage-zone'
import './components/zombie'
// ✅ Define global score
window.score = 0;

document.querySelector('#app').innerHTML = `
  <div id="game-over">You lost!</div>

  <a-scene physics="debug: false">
    <!-- Assets -->
    <a-assets>
      <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
      <a-asset-item id="eva" src="/models/eva-animated-complete.glb"></a-asset-item>
      <img src="/models/grass.jpg" id="grass">
      <img src="/models/night-sky.jpg" id="sky">
      <a-asset-item id="car" src="/models/vehicles/military/jeep.glb"></a-asset-item>
      <a-asset-item id="motorbike" src="/models/vehicles/military/military_motorbike.glb"></a-asset-item>
      <a-asset-item id="coin" src="/models/coin.glb"></a-asset-item>
      <a-asset-item id="zombie" src="/models/zombie.glb"></a-asset-item>    
      </a-assets>

    <!-- Lights -->
    <a-entity light="type: ambient; color: #FFF; intensity: 1;"></a-entity>
    <a-entity light="type: directional; color: #FFF; intensity: 0.5; castShadow: true;" position="-1 1 0"></a-entity>

    <!-- Environment -->
    <a-sky src="#sky" radius="10000"></a-sky>

    <!-- Generate Platforms Dynamically -->
    <a-entity sky-stairs></a-entity>

    <!-- Static Models -->
    <a-entity static-body gltf-model="#tree" position="7 0 0.5" scale="0.2 0.5 0.2" shadow></a-entity>
    <a-entity static-body gltf-model="#car" position="-10 1.5 -10" scale="1.5 1 1" shadow></a-entity>
    <a-entity static-body gltf-model="#motorbike" position="8 3 -18" scale="1.2 1 0.5" shadow></a-entity>

    <!-- Obstacles -->
    <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.3;" position="2 1 -3" radius="0.5" color="orange" shadow></a-sphere>
    <a-sphere obstacle="strength: 9999" position="2 1 -1" radius="0.5" material="shader: glowing; transparent: true; color1: red; color2: blue;"></a-sphere>

    <!-- Character -->
    <a-entity character dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-1 10 -3">
      <a-entity gltf-model="#eva" animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1" shadow>
        <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7;" position="0 1 0" rotation="0 180 0"></a-entity>
      </a-entity>

      <!-- Camera & HUD -->
      <a-entity id="thirdPersonCam" camera look-controls="enabled: false" position="0 3 6" rotation="-20 0 0">
        <a-entity id="scoreText" position="0.8 0.5 -1.5" text="value: Score: 0; color: white; width: 2; align: right"></a-entity>
        <a-entity id="healthText" position="-0.8 0.5 -1.5" text="value: Health: 100; color: red; width: 2; align: left"></a-entity>
      </a-entity>

      <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
    </a-entity>
  </a-scene>
`;
// ✅ Dynamically Add Coins
window.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');

  const coinTemplate = (position) => {
    const coin = document.createElement('a-entity');
    coin.setAttribute('gltf-model', '#obstacle');
    coin.setAttribute('position', position);
    coin.setAttribute('scale', '7 7 7');
    coin.setAttribute('class', 'coin');
    coin.setAttribute('obstacle', 'strength: 1');
    coin.setAttribute('score-system', '');
    coin.setAttribute('dynamic-body', 'mass: 0.1;');
    return coin;
  };

  const coinPositions = [
    '1 1 0',
    '3 1 -2',
    '-3 1 2',
    '0 1 -10',
    '0 1 10',
    '-10 1 0',
    '-15 2.5 0'
  ];

  coinPositions.forEach(pos => {
    const coin = coinTemplate(pos);
    scene.appendChild(coin);
  });
});
