import './style.css';
import 'aframe';
import 'aframe-extras';
import 'aframe-physics-system';

// Components
import './components/character';
import './components/obstacle';
import './components/collider-check';
import './shaders/glowing';
import './components/score-system';
import './components/platform-generator';
import './components/damage-zone';
import './components/zombie';
import './components/zombie-kill';
import './components/zombie-movement';
import './components/health-system';

window.score = 0;
window.health = 100;

document.querySelector('#app').innerHTML = `
 <div id="game-over" style="display: none;">You lost!
 <br><button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; font-size: 1em;">Play Again</button>
</div>
<div id="win-screen" style="display: none; position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,128,0,0.9); color: white; padding: 40px 60px; border-radius: 20px; z-index: 1000; font-size: 2em; text-align: center;">
  🎉 You Won! 🎉<br><br>You Completed this level<br><br>
  <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; font-size: 1em;">Play Next Level</button>
</div>


  <a-scene physics="debug: false">
    <a-assets>
      <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
      <a-asset-item id="eva" src="/models/eva-animated-complete.glb"></a-asset-item>
      <img id="grass" src="/models/grass.jpg" />
      <img id="sky" src="/models/night-sky.jpg" />
      <a-asset-item id="car" src="/models/vehicles/military/jeep.glb"></a-asset-item>
      <a-asset-item id="motorbike" src="/models/vehicles/military/military_motorbike.glb"></a-asset-item>
      <a-asset-item id="coin" src="/models/coin.glb"></a-asset-item>
      <a-asset-item id="zombie" src="/models/zombie.glb"></a-asset-item>
      <a-asset-item id="health" src="/models/Health.glb"></a-asset-item>    
    </a-assets>

    <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 10; color: white; background: rgba(0,0,0,0.7); padding: 12px 24px; border-radius: 8px; font-size: 1.2em; text-align: center;">
      Use the arrow keys to move | Press Space to jump 💀 Avoid zombies, 🚗 dodge obstacles, 💰 collect coins, 💚 heal up!
    </div>

    <a-entity light="type: ambient; color: #FFF; intensity: 1;"></a-entity>
    <a-entity light="type: directional; color: #FFF; intensity: 0.5; castShadow: true;" position="-1 1 0"></a-entity>

    <a-sky src="#sky" radius="10000"></a-sky>
    <a-entity platform-generator="range: 6"></a-entity>

    <a-entity id="player" character dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="0 10 0">
      <a-entity gltf-model="#eva" animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1" shadow>
        <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7;" position="0 1 0" rotation="0 180 0"></a-entity>
      </a-entity>
      <a-entity id="thirdPersonCam" camera look-controls="enabled: false" position="0 3 6" rotation="-20 0 0">
        <a-entity id="scoreText" position="0.8 0.5 -1.5" text="value: Score: 0; color: white; width: 2; align: right"></a-entity>
        <a-entity id="healthText" position="-0.8 0.5 -1.5" text="value: Health: 100; color: red; width: 2; align: left"></a-entity>
      </a-entity>
    </a-entity>

  </a-scene>
`;
