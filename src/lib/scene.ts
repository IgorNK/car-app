import {
    BoxGeometry,
    DirectionalLight,
    HemisphereLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    EquirectangularReflectionMapping,
    DataTexture,
    Vector3,
    Quaternion,
    InstancedBufferGeometry,
    InstancedMesh,
    Matrix4,
    DynamicDrawUsage
} from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import { cars, wheels, hdris } from '../mock_data';

class MainScene {
    constructor(canv: HTMLCanvasElement) {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer({ antialias: true, canvas: canv });

        this.setupCamera();
        this.createLights();
    }

    async init() {
        this.resize();
        this.render();
        this.controls = new OrbitControls( this.camera, this.renderer.domElement);
        await this.setEnvironment(hdris["white"]);
        await this.loadCar(cars["one"]);
        await this.loadWheels(wheels["brown"]);
        window.addEventListener('resize', () => this.resize());
    }

    render() {
        window.requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    async setEnvironment(path: string) {
        this.envMap = await this.rgbeLoader.loadAsync(path);
        this.envMap.mapping = EquirectangularReflectionMapping;
        this.scene.environment = this.envMap;

        this.skybox = new GroundedSkybox(this.envMap, this.skyboxParams.height, this.skyboxParams.radius);
        this.skybox.position.y = this.skyboxParams.height - 0.01;
        this.skybox.removeFromParent();
        this.scene.add(this.skybox);
    }

    async loadCar(path: string) {
        this.car?.scene.removeFromParent();
        this.car = await this.gltfLoader.loadAsync(path);
        await this.renderer.compileAsync(this.car.scene, this.camera, this.scene);
        this.wheelTransforms = [];
        for (let i of Array(4).keys()) {
            const socketName=`wheel_socket_${i}`;
            const transform: Matrix4 | undefined = this.car.scene.getObjectByName(socketName)?.matrix;
            if (transform) {
                this.wheelTransforms.push(transform);
            }
        }
        this.scene.add(this.car.scene);
        this.resetWheelPositions(this.wheelTransforms);
    }

    async loadWheels(path: string) {
        this.clearWheels();
        const wheel = await this.gltfLoader.loadAsync(path);
        const wheelMesh = wheel.scene.getObjectByName("wheel") as Mesh | undefined;
        const wheelGeo = wheelMesh?.geometry.clone();
        const wheelMat = wheelMesh?.material;
        this.wheels = new InstancedMesh(
            wheelGeo,
            wheelMat,
            this.wheelTransforms.length
        );
        this.wheels.instanceMatrix.setUsage(DynamicDrawUsage);
        this.scene.add(this.wheels);
        this.resetWheelPositions(this.wheelTransforms);
    }

    private clearWheels() {
        this.wheels?.removeFromParent();
        this.wheels = null;
    }

    private resetWheelPositions(transforms: Array<Matrix4>) {
        for (let index = 0; index < transforms.length; index++) {
            const transform: Matrix4 | undefined = transforms[index];
            if (transform && this.wheels) {
                this.wheels.setMatrixAt(index, transform);
                // console.log(transform);
            }
        }
        if (this.wheels) {
            this.wheels.instanceMatrix.needsUpdate = true;
        }
    }

    private setupCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = -50;
        this.camera.position.y = 50;
    }

    private createLights() {
        const directionalLight = new DirectionalLight(0x9090aa);
        directionalLight.position.set(-10, 10, -10).normalize();
        this.scene.add(directionalLight);

        const hemisphereLight = new HemisphereLight(0xffffff, 0x444444);
        hemisphereLight.position.set(1, 1, 1);
        this.scene.add(hemisphereLight);
    }
    
    private scene: Scene = new Scene();
    private gltfLoader: GLTFLoader = new GLTFLoader();
    private rgbeLoader: RGBELoader = new RGBELoader();
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private controls: OrbitControls | null = null;
    private envMap: DataTexture | null = null;
    private skybox: GroundedSkybox | null = null;
    private skyboxParams = {
        height: 10,
        radius: 180,
        enabled: true,
    };
    private wheelTransforms: Array<Matrix4> = [];
    private car: GLTF | null = null;
    private wheels: InstancedMesh | null = null;
};

export { MainScene };