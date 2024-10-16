<template>
  <div class="relative w-screen h-screen bg-none">
    <div
        :class="reloadBar == 0 ? 'hidden':''"
        class=" absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 bg-white h-3 "
    >
      <div id="loading-bar" class="ml-auto bg-gray-500 w-full h-full"></div>
    </div>
    <div class=" absolute bottom-5 left-10 w-60 flex flex-col gap-1 text-white">
      <div class="bg-white h-3 w-full">
        <div id="health-bar" class="bg-red-600 h-full transition-all"></div>
      </div>

    </div>
    <div id="canvaContainer"></div>
  </div>

</template>

<script>
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js'
import socketIO from "socket.io-client";

const ADDRESS_IP = 'http://192.168.0.12:3001';
const socket = socketIO.connect(ADDRESS_IP);

export default {
  props: {
    id: null
  },
  data() {
    return {
      keyboard: {},
      player: {
        height: 1.8,
        speed: 0.35,
        otationSpeed: Math.PI * 0.005,
        health: 100,
        position: {x: null, y: 1.8, z: null},
        rotation: 0
      },
      collisions: [],
      controls: null,
      reloadBar: 0,
      spellParticles: null,
      ennemy: {
        health: null,
        position: {
          x: null,
          y: -6,
          z: null
        },
        invicibility: false,
        rotation: null
      },
    }
  },
  computed : {
    life(){
        return this.player.health
    }
  },
  mounted() {
    socket.on("ennemyLoseHpSocket", (data) => {
      console.log(data);
        if (data.id === sessionStorage.getItem("userId")) {
          this.player.health = data.life
        }
    })
    socket.emit("getInformationAboutRoom", {idRoom: this.id, currentUser: sessionStorage.getItem("userId")})
    socket.on("getInformationAboutRoomSocket", (data) => {
      if (data.player1.id === sessionStorage.getItem("userId")) {
        this.player.position.x = data.player1.position.x
        this.player.position.z = data.player1.position.z
        this.player.health = data.player1.life

        this.ennemy.position.x = data.player2.position.x
        this.ennemy.position.z = data.player2.position.z
        this.ennemy.health = data.player2.life

      } else {
        this.player.position.x = data.player2.position.x
        this.player.position.z = data.player2.position.z
        this.player.health = data.player2.life

        this.ennemy.position.x = data.player1.position.x
        this.ennemy.position.z = data.player1.position.z
        this.ennemy.health = data.player1.life
      }
    })

    socket.on("enemyShootSocket", (data) => {
      console.log('here');
      if (this.id === data.roomId) {
        if(data.userId !== sessionStorage.getItem("userId")) {
          onEnnemyShoot()
        }
      }
    })

    socket.on("userMoveSocket", data => {
      this.ennemy.position.x = data.position.x
      this.ennemy.position.z = data.position.z
      this.ennemy.rotation = data.rotation
    //   console.log(this.ennemy.rotation);
    })

    socket.on("finish", (data) => {
      if(data.id == this.id){
        if(data.winner == sessionStorage.getItem("userId")){
          this.controls.unlock()
          window.location.href ='/game/win'
        }
        else{
          this.controls.unlock()
          window.location.href = '/game/loose'
        }
      }
    })

    // EVENT LISTENERS
    const pointerLock = () => {
      this.controls.lock();
    };
    document.addEventListener('mousedown', pointerLock, false);
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);

    // BASICS
    let collidableObjects = [];
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.controls = new PointerLockControls(camera, document.body);
    scene.add(this.controls.getObject());
    camera.position.set(this.player.position.x, this.player.height, this.player.position.z)
    camera.lookAt(new THREE.Vector3(0, this.player.height, 0))

    // AMBIENT LIGHT
    let ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    // // SKY
    let sky = new THREE.Mesh(
        new THREE.SphereGeometry(1000, 60, 40),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load('../sky.jpeg'),
          side: THREE.BackSide
        })
    );
    scene.add(sky);

    // SCENE
    const loader = new GLTFLoader();
    loader.load('../great_hall/scene.gltf', (gltf) => {
      const root = gltf.scene;
      root.scale.set(50, 50, 50);
      root.position.set(135, 262, -470);
      scene.add(root);
    }, undefined, function (error) {
      console.error(error);
    });

    // WAND
    const wand = new THREE.Object3D();
    loader.load('../the_elder_wand/scene.gltf', (gltf) => {
      const wandModel = gltf.scene;
      wand.add(wandModel);
    }, undefined, function (error) {
      console.error(error);
    });

    wand.position.set(0.2, -0.5, -1);
    wand.scale.set(5, 5, 5);
    wand.rotation.y = 1.8;
    wand.rotation.x = 0.5;

    camera.add(wand);

    // ENNEMY
    const ennemy = new THREE.Object3D();
    loader.load('../model_perso/scene.gltf', (gltf) => {
      const ennemyModel = gltf.scene;
      ennemy.add(ennemyModel);
    }, undefined, function (error) {
      console.error(error);
    });
    ennemy.position.set(this.ennemy.position.x, this.ennemy.position.y, this.ennemy.position.z);
    ennemy.rotation.y = this.ennemy.rotation;
    ennemy.scale.set(8, 8, 8);
    scene.add(ennemy);


    // WALLS FOR collisions

    let wallGeometry = new THREE.BoxGeometry(150, 50, 150);
    let wall1 = new THREE.Mesh(wallGeometry);
    wall1.position.set(-35, 20, -75);
    wall1.rotation.y = 0.35;
    wall1.visible = false;
    scene.add(wall1);
    collidableObjects.push(wall1);

    let wallGeometry2 = new THREE.BoxGeometry(150, 50, 200);
    let wall2 = new THREE.Mesh(wallGeometry2);
    wall2.position.set(130, 20, 2);
    wall2.rotation.y = 0.35;
    wall2.visible = false;
    scene.add(wall2);
    collidableObjects.push(wall2);

    let wallGeometry3 = new THREE.BoxGeometry(150, 50, 200);
    // Add a material with double side
    let wallMaterial3 = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
    let wall3 = new THREE.Mesh(wallGeometry3, wallMaterial3);
    wall3.position.set(-105, 20, 100);
    wall3.rotation.y = 0.35;
    wall3.visible = false;
    scene.add(wall3);
    collidableObjects.push(wall3);

    let wallGeometry4 = new THREE.BoxGeometry(150, 50, 150);
    let wallMaterial4 = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
    let wall4 = new THREE.Mesh(wallGeometry4, wallMaterial4);
    wall4.position.set(60, 20, 210);
    wall4.rotation.y = 0.35;
    wall4.visible = false;
    scene.add(wall4);
    collidableObjects.push(wall4);

    var vector = new THREE.Vector3(0, 0, -1);
    vector = camera.localToWorld(vector);
    vector.sub(camera.position); // Now vector is a unit vector with the same direction as the camera

    const raycaster = new THREE.Raycaster(camera.position, vector);

    const checkCollision = () => {
      raycaster.set(camera.position, vector);

      const intersections = raycaster.intersectObjects(collidableObjects);
      if (intersections.length > 0) {
        // foreach intersection check if distance is less than player height
        intersections.forEach(intersection => {
          if (intersection.distance <= this.player.height) {
            camera.position.copy(intersection.point).addScaledVector(intersection.face.normal, 2);
          }
        });
      }
    };

    // FLAMEBALLS
    let flameballs = [];
    const FLAMEBALL_SPAWN_OFFSET = new THREE.Vector3(0, 0, -2);
    const PARTICLES_SPAWN_OFFSET = new THREE.Vector3(-2, 2, -1);
    // Define the cooldown duration in milliseconds
    const COOLDOWN_DURATION = 1000; // 1 second

    // Define the last time a flameball was shot
    let lastShotTime = 0;

    // Find the loading bar HTML element
    const loadingBar = document.getElementById('loading-bar');

    // Find the health bar HTML element
    const healthBar = document.getElementById('health-bar');

    const spellGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const spellMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const spellParticles = new THREE.Points(spellGeometry, spellMaterial);
    let wandStartRotate = false
    console.log(spellParticles);

    // WHEN I CLICK
    document.addEventListener('mousedown', () => {
      const currentTime = Date.now();
      if (currentTime - lastShotTime >= COOLDOWN_DURATION) {
        loader.load('../fireball__energy_sphere/scene.gltf', (gltf) => {
          const fireballModel = gltf.scene;
          const cameraOffset = FLAMEBALL_SPAWN_OFFSET.clone().applyQuaternion(camera.quaternion);
          fireballModel.position.copy(camera.position).add(cameraOffset); // Start at the camera's position
          flameballs.push(fireballModel); // Add the new flameball to the array
          fireballModel.scale.set(0.1, 0.1, 0.1);

          // SPELL PARTICLES
          let spellParticlesClone = spellParticles.clone();
          const cameraOffset2 = PARTICLES_SPAWN_OFFSET.clone().applyQuaternion(camera.quaternion);
          spellParticlesClone.position.copy(camera.position).add(cameraOffset2);
          spellParticlesClone.material.opacity = 1;
          scene.add(spellParticlesClone);
          this.spellParticles = spellParticlesClone;
          wandStartRotate = 1

          scene.add(fireballModel);
          const flameballVelocity = new THREE.Vector3(0, 0, -1);
          flameballVelocity.multiplyScalar(0.4);
          flameballVelocity.applyQuaternion(camera.quaternion); // Apply the camera's rotation to the velocity vector
          fireballModel.userData.velocity = flameballVelocity; // Save the velocity vector as user data
          setTimeout(() => {
            scene.remove(fireballModel);
          }, 10000);
          socket.emit("enemyShoot", {roomId: this.id, userId: sessionStorage.getItem("userId")})
        }, undefined, function (error) {
          console.error(error);
        });
        lastShotTime = currentTime;
      }
    });

    let ennemyBalls = [];
    const onEnnemyShoot = () => {
      // WHEN ENNEMY SHOOT
      loader.load('../fireball__energy_sphere/scene.gltf', (gltf) => {
        const ennemyOffset = new THREE.Vector3(0, 8, 0);
        const fireballModel = gltf.scene;
        fireballModel.position.copy(ennemy.position).add(ennemyOffset);
        ennemyBalls.push(fireballModel);
        fireballModel.scale.set(0.1, 0.1, 0.1);

        scene.add(fireballModel);
        const flameballVelocity = new THREE.Vector3(0, 0, 1);
        flameballVelocity.multiplyScalar(0.4);
        flameballVelocity.applyQuaternion(ennemy.quaternion.invert()); // Apply the ennemy's rotation to the velocity vector
        fireballModel.userData.velocity = flameballVelocity; // Save the velocity vector as user data
        // ADD A TIME TO FIREBALL
        setTimeout(() => {
          scene.remove(fireballModel);
        }, 10000);

      })
    }

    const onUpdate = () => {

        
      // Update ennemy position
      ennemy.position.x = this.ennemy.position.x;
      ennemy.position.z = this.ennemy.position.z;
      ennemy.rotation.y = this.ennemy.rotation._y ;
    }


    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.getElementById('canvaContainer').appendChild(renderer.domElement);

    const animate = () => {
      var movementDirection = new THREE.Vector3(
          -Math.sin(camera.rotation.y),
          0,
          Math.cos(camera.rotation.y)
      );
      // Add an offset to the movement direction to handle 180 degree rotations
      var angle = Math.atan2(movementDirection.z, movementDirection.x);
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
      if (angle > Math.PI) {
        movementDirection = movementDirection.multiplyScalar(-1);
      }
      requestAnimationFrame(animate, this.animateSpellParticles(scene));
      if (wand.rotation.x <= 0.5 && !wandStartRotate) {
        wand.rotation.x += 0.01;
      }
      if (wandStartRotate) {
        if (wandStartRotate == 1) {
          wand.rotation.x += 0.02;
          if (wand.rotation.x >= 0.8) {
            wandStartRotate = 2
          }
        }
        if (wandStartRotate == 2) {
          wand.rotation.x -= 0.02;
          if (wand.rotation.x <= 0) {
            wand.rotation.x = 0;
            wandStartRotate = false;
          }
        }
      }

      if (this.keyboard[37]) camera.rotation.y -= this.player.rotationSpeed;
      if (this.keyboard[39]) camera.rotation.y += this.player.rotationSpeed;
      if (this.keyboard[83]) { // S
        this.controls.moveForward(-this.player.speed);
      }
      if (this.keyboard[90]) { // Z
        this.controls.moveForward(this.player.speed);
      }
      if (this.keyboard[68]) { // D
        this.controls.moveRight(this.player.speed);
      }
      if (this.keyboard[81]) { // Q
        this.controls.moveRight(-this.player.speed);
      }

      // Calculate the remaining cooldown time
      const currentTime = Date.now();
      const remainingCooldown = COOLDOWN_DURATION - (currentTime - lastShotTime);
      const cooldownProgress = Math.max(0, Math.min(1, remainingCooldown / COOLDOWN_DURATION));

      // Update the loading bar width based on the cooldown progress
      loadingBar.style.width = `${cooldownProgress * 100}%`;
      this.reloadBar = cooldownProgress * 100;

      // Update the health bar width based on the health
      healthBar.style.width = `${this.player.health}%`;

      // FLAMEBALLS UPDATE
      for (let i = 0; i < flameballs.length; i++) {
        const flameball = flameballs[i];
        let raycast = new THREE.Raycaster();
        raycast.set(flameball.position, flameball.userData.velocity);
        flameball.position.add(flameball.userData.velocity); // Update the flameball's position
        const intersectionsWall = raycast.intersectObjects(collidableObjects);
        if (intersectionsWall.length > 0) {
          // foreach intersection check if distance is less than player height
          intersectionsWall.forEach(intersection => {
            if (intersection.distance <= 0.5) {
              // Stop the ball
              flameball.userData.velocity.set(0, 0, 0);

              scene.remove(flameball);
              // Remove the flameball from the array
              flameballs.splice(i, 1);
            }
          });
        }
        const intersectionsEnemy = raycast.intersectObjects([ennemy]);
        if (intersectionsEnemy.length > 0) {
          // foreach intersection check if distance is less than player height
          intersectionsEnemy.forEach(intersection => {
            if (intersection.distance <= 0.5) {
              // Stop the ball
              flameball.userData.velocity.set(0, 0, 0);
              scene.remove(flameball);
              if (!this.ennemy.invicibility) {
                this.ennemyLoseHp(scene, ennemy)
                //Ajouter le socket pour la perte d'hp
                socket.emit('ennemyLoseHp', {idRoom: this.id, userId: sessionStorage.getItem("userId")});
              }

            }
          });
        }
      }

      // ENNEMY BALLS UPDATE
      for (let i = 0; i < ennemyBalls.length; i++) {
        const ennemyBall = ennemyBalls[i];
        let raycast = new THREE.Raycaster();
        raycast.set(ennemyBall.position, ennemyBall.userData.velocity);
        ennemyBall.position.add(ennemyBall.userData.velocity); // Update the flameball's position
        const intersectionsWall = raycast.intersectObjects(collidableObjects);
        if (intersectionsWall.length > 0) {
          // foreach intersection check if distance is less than player height
          intersectionsWall.forEach(intersection => {
            if (intersection.distance <= 0.5) {
              // Stop the ball
              ennemyBall.userData.velocity.set(0, 0, 0);

              scene.remove(ennemyBall);
              // Remove the flameball from the array
              ennemyBalls.splice(i, 1);
            }
          });
        }
        const intersectionsPlayer = raycast.intersectObjects([camera]);
        if (intersectionsPlayer.length > 0) {
          // foreach intersection check if distance is less than player height
          intersectionsPlayer.forEach(intersection => {
            if (intersection.distance <= 0.5) {
              // Stop the ball
              ennemyBall.userData.velocity.set(0, 0, 0);
              scene.remove(ennemyBall);
            }
          });
        }
      }
      checkCollision();
      socket.emit("userMove", {
        idRoom: this.id,
        userId: sessionStorage.getItem("userId"),
        position: camera.position,
        rotation: camera.rotation
      });
      onUpdate();
      renderer.render(scene, camera);
    }
    animate();
  },

  methods: {
    keyDown(e) {
      this.keyboard[e.keyCode] = true;
    },
    keyUp(e) {
      this.keyboard[e.keyCode] = false;
    },
    animateSpellParticles(scene) {
      if (this.spellParticles === null) return;
      this.spellParticles.position.x -= Math.random() * 0.5;
      this.spellParticles.position.y -= Math.random() * 0.5;
      this.spellParticles.position.z += 0.5;
      this.spellParticles.geometry.verticesNeedUpdate = true;

      if (this.spellParticles.material.opacity <= 0) {
        scene.remove(this.spellParticles);
        this.spellParticles = null;
      } else {
        this.spellParticles.material.opacity -= 0.01;
      }


    },
    ennemyLoseHp(scene, ennemy) {
      console.log('ennemy lose hp');
      this.ennemy.health -= 10;
      if (this.ennemy.health <= 0) {
        this.ennemy.health = 0;
        scene.remove(ennemy);
      }
    }
  }
}
</script>