import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", () => {
  document.getElementById("boxWelcome").style.display = "none";

  initThreeJS();
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.setClearColor(0x1b1b1b, 1); // 0xffffff untuk putih, 1 adalah opasitas

document.body.appendChild(renderer.domElement);

const environment = new RoomEnvironment();
const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();

scene.environment = pmremGenerator.fromScene(environment).texture;

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Ground Plane
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.position.set(0, -0.3, 0);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Ambient Light - Add an ambient light to lighten up the scene
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light with higher intensity
scene.add(ambientLight);

// Directional Light - Adds sunlight effect
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 10, 10).normalize();
directionalLight.castShadow = true;
scene.add(directionalLight);

// GLTFLoader to load 3D model
const loader = new GLTFLoader().setPath("public/model3D/");
loader.load(
  "scene.gltf", // ganti dengan nama model Anda
  (gltf) => {
    console.log("loading model");
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Posisi model
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    // Sembunyikan progress bar setelah model selesai dimuat
    document.getElementById("progress-container").style.display = "none";
  },
  (xhr) => {
    console.log(`loading ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error(error);
  }
);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

const raycaster = new THREE.Raycaster();

function initThreeJS() {
  document.addEventListener("mousedown", onMouseDown);
}

function onMouseDown(event) {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);

  const intersections = raycaster.intersectObjects(scene.children, true);
  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;
    const objectName = selectedObject.name;
    if (objectData[objectName]) {
      const data = objectData[objectName];
      popup.style.display = "block";
      document.getElementById("object-name").innerText = data.name;
      document.getElementById("object-description").innerText =
        data.description;
      document.getElementById("object-additional-info").innerText =
        data.additionalInfo;
    }
  }
}

const objectData = {
  MaterialFBXASC032FBXASC0354_1: {
    name: "Monitor",
    description:
      "Monitor adalah layar komputer yang menampilkan semua hal yang sedang kita kerjakan di komputer, seperti tulisan, gambar, video, atau game. Ibaratnya, monitor adalah jendela utama untuk melihat dan mengontrol apa yang terjadi di dalam komputer.",
    additionalInfo:
      "Komputer mengirimkan sinyal ke monitor, lalu monitor mengubah sinyal itu menjadi gambar atau video yang bisa kita lihat. Semakin canggih monitor, semakin tajam dan bagus tampilan yang dihasilkan.",
  },
  MaterialFBXASC032FBXASC0352_1: {
    name: "Printer",
    description:
      "Printer adalah perangkat elektronik yang digunakan untuk mencetak dokumen, gambar, atau foto dari komputer atau perangkat lainnya ke media fisik seperti kertas. Ibaratnya, printer adalah 'pengubah' dari sesuatu yang digital menjadi sesuatu yang bisa kita pegang dan lihat langsung.",
    additionalInfo:
      "Printer menerima data dari komputer atau perangkat lain, memprosesnya, dan mencetak hasilnya sesuai perintah. Ada yang mencetak dalam hitam-putih, ada juga yang mencetak berwarna, tergantung jenis dan modelnya.",
  },
  MaterialFBXASC032FBXASC0354_ncl1_1_5: {
    name: "CPU",
    description:
      "CPU (Central Processing Unit) adalah otak dari komputer atau perangkat elektronik. Ia bertanggung jawab untuk menjalankan perintah-perintah dari program dan mengolah semua data yang ada di dalam sistem. Semua perhitungan dan keputusan yang dibuat oleh komputer diproses oleh CPU.",
    additionalInfo:
      "CPU menerima perintah dari program, memprosesnya, dan kemudian mengirimkan hasilnya kembali ke perangkat lainnya (misalnya monitor atau printer). Proses ini sangat cepat, dan CPU melakukan jutaan operasi per detik.",
  },
  MaterialFBXASC032FBXASC0354_ncl1_1_3: {
    name: "Keyboard",
    description:
      "Keyboard adalah perangkat input utama yang digunakan untuk memasukkan data ke dalam komputer atau perangkat elektronik lainnya. Ibaratnya, keyboard adalah 'pintu' untuk berkomunikasi dengan komputer, karena kita memberikan perintah atau mengetik teks melalui tombol-tombolnya.",
    additionalInfo:
      "Keyboard merupakan alat untuk mengetik dan memberikan perintah ke komputer. Semua yang kita lakukan di komputer, mulai dari menulis surat hingga bermain game, dimulai dari menekan tombol di keyboard! Tanpa keyboard, kita akan kesulitan untuk berinteraksi dengan perangkat.",
  },
  MaterialFBXASC032FBXASC0354_ncl1_1_1: {
    name: "Mouse",
    description:
      "Mouse adalah perangkat input komputer yang digunakan untuk menggerakkan kursor di layar dan memilih atau mengklik objek di dalam sistem komputer. Ibaratnya, mouse adalah penunjuk di dunia digital, membantu kita berinteraksi secara visual dengan apa yang ada di layar.",
    additionalInfo:
      "Mouse merupakan alat yang digunakan untuk menggerakkan kursor di layar komputer dan klik objek atau perintah. Tanpa mouse, kita akan kesulitan berinteraksi dengan komputer, karena kita memerlukan perangkat untuk memilih, menggulir, dan menavigasi berbagai aplikasi dan file.",
  },
};

const popup = document.getElementById("popup");
const closeButton = document.getElementById("close-btn");

closeButton.addEventListener("click", () => {
  popup.style.display = "none";
});
