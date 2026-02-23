import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero-three',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-container">
      <div class="title">
        <h1>
          <span>SUR</span>
          <span>VI</span>
          <span>VOR</span>
        </h1>
        <ul>
          <li><a href="#">WIN</a></li>
          <li><a href="#">OR</a></li>
          <li><a href="#">GO</a></li>
          <li><a href="#">HOME</a></li>
        </ul>
      </div>
      <div #rendererContainer class="renderer-container"></div>
    </div>
  `,
  styles: [`
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;600;900&family=Roboto:wght@300;400&display=swap");

    :host {
      display: block;
      width: 100%;
    }

    .hero-container {
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
    }

    .renderer-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .title {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 50px;
      color: white;
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      z-index: 10;
    }

    .title h1 {
      font-family: "Poppins", sans-serif;
      font-size: 100px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .title h1 span:nth-of-type(2) {
      font-weight: 600;
    }

    .title h1 span:nth-of-type(3) {
      font-weight: 300;
    }

    .title ul {
      list-style: none;
      display: flex;
      justify-content: center;
      gap: 20px;
      padding: 0;
      margin: 0;
    }

    .title ul li {
      font-family: "Roboto", sans-serif;
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: white;
      text-shadow:
        2px 2px 4px rgba(0,0,0,0.5),
        -1px -1px 0 rgba(0,0,0,0.3),
        1px -1px 0 rgba(0,0,0,0.3),
        -1px 1px 0 rgba(0,0,0,0.3),
        1px 1px 0 rgba(0,0,0,0.3);
      -webkit-text-stroke: 0.5px rgba(0,0,0,0.3);
    }

    .title ul li a {
      text-decoration: none;
      color: white;
      cursor: default;
    }

    @media (max-width: 768px) {
      .hero-container {
        height: 300px;
      }

      .title h1 {
        font-size: 60px;
      }

      .title ul li {
        font-size: 14px;
      }
    }
  `]
})
export class HeroThreeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;

  private scene: any;
  private camera: any;
  private renderer: any;
  private controls: any;
  private floor: any;
  private animationId: number | null = null;
  private time: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadThreeJS();
    }
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private async loadThreeJS(): Promise<void> {
    try {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');

      this.initScene(THREE, OrbitControls, OBJLoader);
    } catch (error) {
      console.error('Error loading Three.js:', error);
    }
  }

  private initScene(THREE: any, OrbitControls: any, OBJLoader: any): void {
    const container = this.rendererContainer.nativeElement;
    const parent = container.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || 400;


    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.set(-7, -5, 11);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 0);

    // Add canvas to container
    const canvas = this.renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    container.appendChild(canvas);


    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = false;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = Math.PI / 2.2;

    // Shader materials
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uCircleSpacing;
      uniform float uLineWidth;
      uniform float uSpeed;
      uniform float uFadeEdge;
      uniform vec3 uCameraPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vec2 center = vec2(0.5, 0.5);
        vec2 uv = vUv;
        float dist = distance(uv, center);

        float animatedDist = dist - uTime * uSpeed;
        float circle = mod(animatedDist, uCircleSpacing);
        float distFromEdge = min(circle, uCircleSpacing - circle);

        float aaWidth = length(vec2(dFdx(animatedDist), dFdy(animatedDist))) * 2.0;
        float lineAlpha = 1.0 - smoothstep(uLineWidth - aaWidth, uLineWidth + aaWidth, distFromEdge);

        // Colori del gradiente blu: #0A3D91 (blu scuro) → #4FC3F7 (azzurro)
        vec3 blueDark = vec3(0.039, 0.239, 0.569);  // #0A3D91
        vec3 blueLight = vec3(0.31, 0.765, 0.969);  // #4FC3F7
        vec3 white = vec3(1.0);

        // Crea un gradiente radiale dal centro verso l'esterno
        vec3 gradientColor = mix(blueDark, blueLight, dist * 2.0);

        // Mix tra bianco (linee) e gradiente blu (sfondo)
        vec3 baseColor = mix(white, gradientColor, lineAlpha);

        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uCameraPosition - vPosition);

        vec3 lightDir = normalize(vec3(5.0, 10.0, 5.0));
        float NdotL = max(dot(normal, lightDir), 0.0);

        vec3 diffuse = baseColor * (0.5 + 0.5 * NdotL);

        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
        vec3 specular = vec3(1.0) * spec * 0.5;

        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
        vec3 fresnelColor = vec3(1.0) * fresnel * 0.2;

        vec3 finalColor = diffuse + specular + fresnelColor;

        float edgeFade = smoothstep(0.5 - uFadeEdge, 0.5, dist);
        float alpha = 1.0 - edgeFade;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const floorGeometry = new THREE.CircleGeometry(20, 200);
    const floorMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uCircleSpacing: { value: 0.06 },
        uLineWidth: { value: 0.02 },
        uSpeed: { value: 0.01 },
        uFadeEdge: { value: 0.2 },
        uCameraPosition: { value: new THREE.Vector3() },
      },
      side: THREE.DoubleSide,
      transparent: true,
    });
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -1;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Load model
    const loader = new OBJLoader();
    loader.load(
      'https://cdn.jsdelivr.net/gh/danielyl123/person/person.obj',
      (object: any) => {
        object.traverse((child: any) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x888888,
              roughness: 0.7,
              metalness: 0.3,
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(object);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        object.traverse((child: any) => {
          if (child.isMesh && child.geometry) {
            child.geometry.translate(-center.x, -center.y, -center.z);
          }
        });

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        object.scale.set(scale, scale, scale);

        object.position.set(0, 1, 0);
        object.rotation.y = Math.PI / 3;
        object.updateMatrixWorld(true);

        this.scene.add(object);

        this.controls.target.set(0, 0, 0);
        this.controls.update();
      },
      (xhr: any) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error: any) => {
        console.error('Error loading model:', error);
      }
    );

    this.animate(THREE);

    window.addEventListener('resize', () => this.onWindowResize(THREE));
  }

  private animate(THREE: any): void {
    this.animationId = requestAnimationFrame(() => this.animate(THREE));

    this.time += 0.016;


    if (this.floor?.material?.uniforms) {
      this.floor.material.uniforms.uTime.value = this.time;

      const cameraWorldPos = new THREE.Vector3();
      this.camera.getWorldPosition(cameraWorldPos);
      this.floor.material.uniforms.uCameraPosition.value.copy(cameraWorldPos);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    this.controls.update();
  }

  private onWindowResize(THREE: any): void {
    const container = this.rendererContainer.nativeElement;
    const parent = container.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || 400;

    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
