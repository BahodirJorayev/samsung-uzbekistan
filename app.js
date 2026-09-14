/**
 * Samsung Galaxy S25 Ultra — Interactive 3D Studio & UI Engine
 * Developed for Samsung Uzbekistan
 * Author credit in footer: telegram: @Jbahodir
 */

(function () {
  'use strict';

  // --- 1. Global Navigation Blur on Scroll ---
  const globalNav = document.getElementById('globalNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      globalNav.classList.add('scrolled');
    } else {
      globalNav.classList.remove('scrolled');
    }
  });

  // --- 2. Three.js Interactive 3D Phone Studio ---
  const container = document.getElementById('canvasContainer');
  const loadingIndicator = document.getElementById('canvasLoading');
  const selectedColorLabel = document.getElementById('selectedColorLabel');
  const toggleAutoRotateBtn = document.getElementById('toggleAutoRotateBtn');
  const resetAngleBtn = document.getElementById('resetAngleBtn');
  const backAngleBtn = document.getElementById('backAngleBtn');
  const swatchButtons = document.querySelectorAll('.swatch-btn');

  // Color Finishes Map
  const FINISH_COLORS = {
    silver: {
      body: 0xd6d8dc,
      frame: 0xe3e4e5,
      accent: 0xc8cbd0,
      name: 'Titan Kumush (Silver)'
    },
    black: {
      body: 0x232932,
      frame: 0x2e3642,
      accent: 0x1a1f26,
      name: 'Titan Qora (Midnight Black)'
    },
    blue: {
      body: 0xb9cbd4,
      frame: 0xc8d8e0,
      accent: 0xaec2cc,
      name: 'Titan Moviy (Sky Blue)'
    },
    yellow: {
      body: 0xe8dcce,
      frame: 0xf0e4d3,
      accent: 0xdecbb7,
      name: 'Titan Oltin (Starlight Gold)'
    }
  };

  let scene, camera, renderer, controls;
  let phoneGroup;
  let backGlassMaterial, frameMaterial, cameraRingMaterial;
  let isAutoRotating = true;

  function init3DStudio() {
    if (!container || typeof THREE === 'undefined') {
      if (loadingIndicator) loadingIndicator.style.display = 'none';
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.2);

    // 3. Renderer with antialiasing and soft shadowless lighting
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2;
      controls.minDistance = 2.4;
      controls.maxDistance = 6.0;
      controls.maxPolarAngle = Math.PI / 1.7;
      controls.minPolarAngle = Math.PI / 3.5;
    }

    // 5. Apple-style High-Key Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLightTop = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLightTop.position.set(4, 8, 5);
    scene.add(keyLightTop);

    const fillLightLeft = new THREE.DirectionalLight(0xf5f7ff, 0.9);
    fillLightLeft.position.set(-5, 2, 4);
    scene.add(fillLightLeft);

    const backRimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    backRimLight.position.set(0, -3, -5);
    scene.add(backRimLight);

    // 6. Build the 3D Samsung Galaxy S25 Ultra Model
    buildPhoneModel();

    // 7. Hide loader
    if (loadingIndicator) {
      setTimeout(() => {
        loadingIndicator.style.opacity = '0';
        setTimeout(() => (loadingIndicator.style.display = 'none'), 400);
      }, 300);
    }

    // 8. Event Listeners
    window.addEventListener('resize', onWindowResize);
    animate();
  }

  // Create rounded rectangle shape helper
  function createRoundedRectShape(w, h, r) {
    const shape = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  }

  // Create dynamic AMOLED wallpaper canvas texture
  function createScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // Deep modern wallpaper gradient with titanium / Galaxy AI theme
    const grad = ctx.createLinearGradient(0, 0, 1024, 2048);
    grad.addColorStop(0, '#0a0d14');
    grad.addColorStop(0.35, '#121c2e');
    grad.addColorStop(0.65, '#243b55');
    grad.addColorStop(1, '#0c1018');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 2048);

    // Futuristic glowing geometric AI crystal element in center
    const radial = ctx.createRadialGradient(512, 1024, 20, 512, 1024, 520);
    radial.addColorStop(0, 'rgba(0, 113, 227, 0.45)');
    radial.addColorStop(0.5, 'rgba(89, 102, 128, 0.2)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1024, 2048);

    // Subtle lock screen clock text & Galaxy AI branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '300 130px Inter, -apple-system, sans-serif';
    ctx.fillText('12:45', 512, 420);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '400 36px Inter, -apple-system, sans-serif';
    ctx.fillText('Dushanba, 14-Sentyabr | Toshkent', 512, 500);

    // Bottom Galaxy AI text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '500 28px Inter, -apple-system, sans-serif';
    ctx.fillText('Galaxy AI — Samsung O‘zbekiston', 512, 1850);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  function buildPhoneModel() {
    phoneGroup = new THREE.Group();

    // Dimensions for Galaxy S25 Ultra:
    // Realistic proportions: ~162.8 x 77.6 x 8.6 mm -> 1.95 x 0.93 x 0.103
    const width = 0.94;
    const height = 1.96;
    const depth = 0.088;
    const cornerRadius = 0.042;

    const initialColor = FINISH_COLORS.silver;

    // 1. Titanium Chassis / Frame Material
    frameMaterial = new THREE.MeshPhysicalMaterial({
      color: initialColor.frame,
      metalness: 0.92,
      roughness: 0.28,
      clearcoat: 0.2,
      reflectivity: 0.8
    });

    // 2. Back Frosted Satin Glass Material
    backGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: initialColor.body,
      metalness: 0.1,
      roughness: 0.42,
      transmission: 0.2,
      clearcoat: 0.4,
      reflectivity: 0.5
    });

    // 3. Camera Rings Metallic Material
    cameraRingMaterial = new THREE.MeshPhysicalMaterial({
      color: initialColor.frame,
      metalness: 0.95,
      roughness: 0.2
    });

    // Main Phone Chassis using ExtrudeGeometry
    const shape = createRoundedRectShape(width, height, cornerRadius);
    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015
    };

    const chassisGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    chassisGeo.center();
    const chassisMesh = new THREE.Mesh(chassisGeo, frameMaterial);
    phoneGroup.add(chassisMesh);

    // Front Screen Panel (Glass + AMOLED Wallpaper)
    const screenGeo = new THREE.PlaneGeometry(width * 0.94, height * 0.94);
    const screenTexture = createScreenTexture();
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.z = depth / 2 + 0.016;
    phoneGroup.add(screenMesh);

    // Front Screen Glass Coating (with reflection)
    const glassCoverMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const glassCover = new THREE.Mesh(screenGeo, glassCoverMat);
    glassCover.position.z = depth / 2 + 0.017;
    phoneGroup.add(glassCover);

    // Back Panel Glass Sheet
    const backPanelGeo = new THREE.PlaneGeometry(width * 0.95, height * 0.95);
    const backPanel = new THREE.Mesh(backPanelGeo, backGlassMaterial);
    backPanel.position.z = -depth / 2 - 0.016;
    backPanel.rotation.y = Math.PI; // Face outwards to the back
    phoneGroup.add(backPanel);

    // Camera Module (Galaxy S25 Ultra 3 prominent main lenses + 2 sub sensors)
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(-width * 0.25, height * 0.28, -depth / 2 - 0.018);

    // Lens Black Glass Material
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      metalness: 0.8,
      roughness: 0.08,
      clearcoat: 1.0
    });

    // 3 Primary Camera Lenses
    const lensPositions = [0.15, -0.05, -0.25];
    lensPositions.forEach((yPos) => {
      // Outer Titanium Ring
      const ringGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.032, 32);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, cameraRingMaterial);
      ringMesh.position.set(0, yPos, -0.015);
      cameraGroup.add(ringMesh);

      // Inner Lens Glass
      const lensGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.034, 32);
      lensGeo.rotateX(Math.PI / 2);
      const lensMesh = new THREE.Mesh(lensGeo, lensGlassMat);
      lensMesh.position.set(0, yPos, -0.016);
      cameraGroup.add(lensMesh);
    });

    // Secondary Sensor Column (Laser AF, Flash, Periscope)
    const subPositions = [0.15, 0.05, -0.05];
    subPositions.forEach((yPos, idx) => {
      const subRingGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.024, 24);
      subRingGeo.rotateX(Math.PI / 2);
      const subRing = new THREE.Mesh(subRingGeo, cameraRingMaterial);
      subRing.position.set(0.12, yPos, -0.012);
      cameraGroup.add(subRing);

      const subLensGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.025, 24);
      subLensGeo.rotateX(Math.PI / 2);
      const subLens = new THREE.Mesh(
        subLensGeo,
        idx === 1
          ? new THREE.MeshBasicMaterial({ color: 0xfffae0 }) // Flash
          : lensGlassMat
      );
      subLens.position.set(0.12, yPos, -0.013);
      cameraGroup.add(subLens);
    });

    phoneGroup.add(cameraGroup);

    // Initial slight angled pose
    phoneGroup.rotation.y = -0.35;
    phoneGroup.rotation.x = 0.08;

    scene.add(phoneGroup);
  }

  // Update 3D Phone Materials on Swatch Selection
  function updatePhoneColor(colorKey) {
    const config = FINISH_COLORS[colorKey];
    if (!config) return;

    if (backGlassMaterial) {
      backGlassMaterial.color.setHex(config.body);
    }
    if (frameMaterial) {
      frameMaterial.color.setHex(config.frame);
    }
    if (cameraRingMaterial) {
      cameraRingMaterial.color.setHex(config.frame);
    }
    if (selectedColorLabel) {
      selectedColorLabel.textContent = config.name;
    }
  }

  // Swatch Buttons Click Handling
  swatchButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      swatchButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const colorKey = btn.getAttribute('data-color');
      updatePhoneColor(colorKey);
    });
  });

  // Controls Actions
  if (toggleAutoRotateBtn) {
    toggleAutoRotateBtn.addEventListener('click', () => {
      if (!controls) return;
      isAutoRotating = !isAutoRotating;
      controls.autoRotate = isAutoRotating;
      toggleAutoRotateBtn.textContent = isAutoRotating ? 'To‘xtatish' : 'Aylantirish';
    });
  }

  if (resetAngleBtn) {
    resetAngleBtn.addEventListener('click', () => {
      if (!phoneGroup || !controls) return;
      controls.reset();
      camera.position.set(0, 0, 4.2);
      controls.target.set(0, 0, 0);
    });
  }

  if (backAngleBtn) {
    backAngleBtn.addEventListener('click', () => {
      if (!controls) return;
      camera.position.set(0, 0, -4.2);
      controls.target.set(0, 0, 0);
    });
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Initialize once DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    init3DStudio();
  });

  // --- 3. Option Pills (Storage Options) Interaction ---
  const optPills = document.querySelectorAll('.opt-pill');
  optPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      optPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // --- 4. Color Variant Section Swatches ---
  const swatchItems = document.querySelectorAll('.swatch-item');
  swatchItems.forEach((item) => {
    item.addEventListener('click', () => {
      swatchItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      const variantIdx = item.getAttribute('data-variant');
      const colors = ['silver', 'black', 'blue', 'yellow'];
      if (colors[variantIdx]) {
        updatePhoneColor(colors[variantIdx]);
        // Also sync hero swatch
        swatchButtons.forEach((sb) => {
          if (sb.getAttribute('data-color') === colors[variantIdx]) {
            swatchButtons.forEach((b) => b.classList.remove('active'));
            sb.classList.add('active');
          }
        });
      }
    });
  });

})();
