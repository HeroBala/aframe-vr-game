import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'
import './components/character'
import './components/obstacle'
import './components/collider-check'
import './shaders/glowing'
import './components/score-system'

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
    </a-assets>

    <!-- Orb -->
    <a-entity id="orb1"
              geometry="primitive: sphere; radius: 0.5"
              material="color: orange; emissive: yellow; emissiveIntensity: 0.6"
              position="1 2.5 -3"
              class="orb"
              static-body
              score-system>
    </a-entity>

    <!-- Lights -->
    <a-entity light="type: ambient; color: #FFF; intensity: 0.5;"></a-entity>
    <a-entity light="type: directional; color: #FFF; intensity: 0.5; castShadow: true;"
              position="-1 1 0"></a-entity>

    <!-- Environment -->
    <a-sky src="#sky"></a-sky>

    <!-- Ground -->
    <a-box static-body="friction: 0;" position="0 0 0" width="30" height="0.2" depth="10"
           material="src: #grass; repeat: 1 1;" shadow="receive: true"></a-box> 
    <a-box static-body position="0 0.5 -15" width="30" height="0.2" depth="10" material="src: #grass;"></a-box> 
    <a-box static-body position="0 0.5 15" width="30" height="0.2" depth="10" material="src: #grass;"></a-box>
    <a-box static-body position="-25 0.5 0" width="10" height="0.2" depth="30" material="src: #grass;"></a-box>
    <a-box static-body position="-36 1.5 0" width="10" height="0.2" depth="30" material="src: #grass;"></a-box>

    <!-- Models -->
    <a-entity static-body gltf-model="#tree" position="7 0 0.5" scale="0.2 0.5 0.2" shadow></a-entity>
    <a-entity static-body gltf-model="#car" position="0 0.656 -13" scale="1.5 1 1" shadow></a-entity>
    <a-entity static-body gltf-model="#motorbike" position="-22 0.6 -0.915" scale="1.2 1 0.5" shadow></a-entity>

    <!-- Camera wrapped in a physics-enabled entity -->
    <a-entity id="player">
  <a-entity camera wasd-controls look-controls position="0 3 3">
    <!-- ✅ Score HUD in top-right of screen -->
    <a-entity id="scoreText"
              position="0.8 0.5 -1.5"
              text="value: Score: 0; color: white; width: 2; align: right">
    </a-entity>
  </a-entity>
</a-entity>


    <!-- Obstacles -->
    <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.3;" position="2 1 -3"
              radius="0.5" color="orange" shadow></a-sphere>
    <a-sphere obstacle="strength: 9999" position="2 1 -1" radius="0.5"
              material="shader: glowing; transparent: true; color1: red; color2: blue;"></a-sphere>

    <!-- Character -->
    <a-entity character dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 0.4 -3">
      <a-entity gltf-model="#eva" animation-mixer="clip: idle;" position="0 0 0"
                rotation="0 90 0" scale="1 1 1" shadow>
        <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3 distance: 7;"
                  position="0 1 0" rotation="0 180 0"></a-entity>
      </a-entity>
      <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0"
                rotation="0 0 0" collider-check></a-entity>
    
    </a-entity>
  </a-scene>
`
