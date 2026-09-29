(function () {
  "use strict";

  var canvasContainer = document.getElementById("obj-dropzone");
  var fileInput = document.getElementById("obj-file");
  var resetButton = document.getElementById("obj-reset");
  var status = document.getElementById("obj-status");

  if (!canvasContainer || !window.THREE || !THREE.OBJLoader) {
    return;
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  var loader = new THREE.OBJLoader();
  var model;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  canvasContainer.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xdcecf2, 0x18242b, 2.2));

  var keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  function resize() {
    var width = canvasContainer.clientWidth;
    var height = canvasContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function resetView() {
    camera.position.set(2.7, 2.2, 3.2);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function showModel(text) {
    if (model) {
      scene.remove(model);
    }
    model = loader.parse(text);
    var bounds = new THREE.Box3().setFromObject(model);
    var center = bounds.getCenter(new THREE.Vector3());
    var size = bounds.getSize(new THREE.Vector3());
    var scale = 2 / Math.max(size.x, size.y, size.z, 0.001);

    model.position.sub(center);
    model.scale.setScalar(scale);
    model.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xe3b341,
          roughness: 0.62,
          metalness: 0.08,
          side: THREE.DoubleSide
        });
      }
    });
    scene.add(model);
    resetView();
    status.textContent = "OBJ loaded";
    var empty = canvasContainer.querySelector(".obj-viewer__empty");
    if (empty) {
      empty.remove();
    }
  }

  function loadFile(file) {
    if (!file || !file.name.toLowerCase().endsWith(".obj")) {
      status.textContent = "Please choose an .obj file";
      return;
    }
    status.textContent = "Loading " + file.name + "...";
    var reader = new FileReader();
    reader.onload = function (event) {
      try {
        showModel(event.target.result);
      } catch (error) {
        status.textContent = "Could not parse this OBJ file";
      }
    };
    reader.readAsText(file);
  }

  fileInput.addEventListener("change", function (event) {
    loadFile(event.target.files[0]);
  });
  resetButton.addEventListener("click", resetView);
  ["dragenter", "dragover"].forEach(function (eventName) {
    canvasContainer.addEventListener(eventName, function (event) {
      event.preventDefault();
      canvasContainer.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach(function (eventName) {
    canvasContainer.addEventListener(eventName, function (event) {
      event.preventDefault();
      canvasContainer.classList.remove("is-dragging");
    });
  });
  canvasContainer.addEventListener("drop", function (event) {
    loadFile(event.dataTransfer.files[0]);
  });
  window.addEventListener("resize", resize);

  resetView();
  resize();
  (function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }());
}());