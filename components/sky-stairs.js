AFRAME.registerComponent('sky-stairs', {
  init: function () {
    const scene = this.el;
    const stepCount = 1000;     // Number of platforms
    const heightStep = 1.5;   // Vertical distance
    const depthStep = -12;     // Forward gap

    for (let i = 0; i < stepCount; i++) {
      const box = document.createElement('a-box');
      box.setAttribute('static-body', '');
      box.setAttribute('width', '30');
      box.setAttribute('height', '0.2');
      box.setAttribute('depth', '10');
      box.setAttribute('position', `0 ${i * heightStep} ${i * depthStep}`);
      box.setAttribute('material', 'src: #grass;');
      scene.appendChild(box);
    }
  }
});
