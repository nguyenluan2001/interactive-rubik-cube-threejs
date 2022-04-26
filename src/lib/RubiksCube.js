import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import Cube from './Cube';
import { CubeCollection } from './CubeCollection';

export default class RubiksCube {
  constructor(cubeType) {
    this.scale = 20;
    this.epsilon = 0.5;
    this.consoleDebug = true;
    this.selectedCube = null;
    this.rubiksCubeGroup = new THREE.Group();
    this.rubiksCubeGroup.scale.x = this.scale;
    this.rubiksCubeGroup.scale.y = this.scale;
    this.rubiksCubeGroup.scale.z = this.scale;

    this.rubiksCubeGroup.rotation.x = Math.PI / 8;
    this.rubiksCubeGroup.rotation.y = Math.PI / 4;

    this.scrambleMoves = [];
    this.axisList = [
      {
        id: 1,
        vector:  new THREE.Vector3(-1, 0, 0),
        axis: 'x',
        opposite: 2
      },
      {
        id: 2,
        vector:  new THREE.Vector3(1, 0, 0),
        axis: 'x',
        opposite: 1
      },
      {
        id: 3,
        vector:  new THREE.Vector3(0, -1, 0),
        axis: 'y',
        opposite: 4
      },
      {
        id: 4,
        vector:  new THREE.Vector3(0, 1, 0),
        axis: 'y',
        opposite: 3
      },
      {
        id: 5,
        vector:  new THREE.Vector3(0, 0, -1),
        axis: 'z',
        opposite: 6
      },
      {
        id: 6,
        vector:  new THREE.Vector3(0, 0, 1),
        axis: 'z',
        opposite: 5
      },
     ]
    this.historyMoves = []

    this.initializeRubiksCube(cubeType);

    const anim = (t) => {
      TWEEN.update(t);
      requestAnimationFrame(anim);
    };
    anim();
  }

  rotateAroundWorldAxis(cubeGroup, axis) {
    const start = { rotation: 0 };
    const prev = { rotation: 0 };
    const end = { rotation: Math.PI / 2 };

    const tween = new TWEEN.Tween(start)
      .to(end, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(({ rotation }) => {
        // NOTE: Comment out each block to see different mistakes.

        // === 1 ===
        // cubeGroup.position.applyAxisAngle(axis, rotation - prev.rotation);

        // === 2 ===
        // cubeGroup.rotateOnWorldAxis(axis, rotation - prev.rotation);

        // === 3 ===
        // NOTE: DO NOT rotate the cube on it's own axis.
        // cubeGroup.position.applyAxisAngle(axis, rotation - prev.rotation);
        // cubeGroup.rotateOnAxis(axis, rotation - prev.rotation);

        // === 4 ===
        // NOTE: THIS IS CORRECT.
        // NOTE: Move the position of a cube.
        // NOTE: Rotate the cube on the world axis.
        cubeGroup.position.applyAxisAngle(axis, rotation - prev.rotation);
        cubeGroup.rotateOnWorldAxis(axis, rotation - prev.rotation);

        // NOTE: Keep track of the previous rotation for tweening.
        prev.rotation = rotation;
      });

    tween.start();
  }

  cubeInSameY(c1, c2) {
    return (
      c1.cubeGroup.position.y > c2.cubeGroup.position.y - this.epsilon &&
      c1.cubeGroup.position.y < c2.cubeGroup.position.y + this.epsilon
    );
  }

  cubeInSameX(c1, c2) {
    return (
      c1.cubeGroup.position.x > c2.cubeGroup.position.x - this.epsilon &&
      c1.cubeGroup.position.x < c2.cubeGroup.position.x + this.epsilon
    );
  }

  cubeInSameZ(c1, c2) {
    return (
      c1.cubeGroup.position.z > c2.cubeGroup.position.z - this.epsilon &&
      c1.cubeGroup.position.z < c2.cubeGroup.position.z + this.epsilon
    );
  }

  getText(key) {
    return (
      {
        w: 'W: rotate up',
        s: 'S: rotate down',
        a: 'A: rotate left',
        d: 'D: rotate right',
        q: 'Q: rotate face left',
        e: 'E: rotate face right',
      }[key] || ''
    );
  }

  displayKey(key) {
    if (this.consoleDebug) {
      console.log(
        `%c ${this.getText(key)} `,
        'background: #fafafa; color: #0a0a0a; font-size: 20px'
      );
    }
  }

  onKeyDown(event) {
    if (event.key === 'w') {
      this.displayKey(event.key);
      // const axis = new THREE.Vector3(-1, 0, 0);
      const axis = this.axisList[0].vector
      this.historyMoves.push(this.axisList[0])
      this.cubes.forEach((cube) => {
        if (this.cubeInSameX(cube, this.selectedCube)) {
          this.rotateAroundWorldAxis(cube.cubeGroup, axis);
        }
      });
    } else if (event.key === 'a') {
      this.displayKey(event.key);
      // const axis = new THREE.Vector3(0, -1, 0);
      const axis = this.axisList[3].vector
      this.historyMoves.push(this.axisList[3])
      this.cubes.forEach((cube) => {
        if (this.cubeInSameY(cube, this.selectedCube))
          this.rotateAroundWorldAxis(cube.cubeGroup, axis);
      });
    } else if (event.key === 's') {
      this.displayKey(event.key);
      // const axis = new THREE.Vector3(1, 0, 0);
      const axis = this.axisList[1].vector
      this.historyMoves.push(this.axisList[1])
      this.cubes.forEach((cube) => {
        if (this.cubeInSameX(cube, this.selectedCube))
          this.rotateAroundWorldAxis(cube.cubeGroup, axis);
      });
    } else if (event.key === 'd') {
      this.displayKey(event.key);
      // const axis = new THREE.Vector3(0, 1, 0);
      const axis = this.axisList[2].vector
      this.historyMoves.push(this.axisList[2])
      this.cubes.forEach((cube) => {
        if (this.cubeInSameY(cube, this.selectedCube))
          this.rotateAroundWorldAxis(cube.cubeGroup, axis);
      });
    } else if (event.key === 'q') {
      this.displayKey(event.key);
      // const axis = new THREE.Vector3(0, 0, 1);
      const axis = this.axisList[5].vector
      this.historyMoves.push(this.axisList[5])
      this.cubes.forEach((cube) => {
        if (this.cubeInSameZ(cube, this.selectedCube))
          this.rotateAroundWorldAxis(cube.cubeGroup, axis);
      });
    } else if (event.key === 'e') {
      this.displayKey(event.key);
      // const axis = new THREE.Vector3(0, 0, -1);
      const axis = this.axisList[4].vector
      this.historyMoves.push(this.axisList[4])
      this.cubes.forEach((cube) => {
        if (this.cubeInSameZ(cube, this.selectedCube))
          this.rotateAroundWorldAxis(cube.cubeGroup, axis);
      });
    }
  }

  highlightCubes(cubeToHighlight) {
    this.cubes.forEach((cube) => {
      if (cube.cubeMesh.uuid === cubeToHighlight.uuid) {
        this.selectedCube = cube;
        cube.uniforms.opacity.value = 0.5;
      } else {
        cube.uniforms.opacity.value = 1.0;
      }
    });
  }
  moveByAxis(move) {
    if (move.axis == 'x') {
      this.cubes.forEach((cube) => {
        if (this.cubeInSameX(cube, this.selectedCube)) {
          this.rotateAroundWorldAxis(cube.cubeGroup, move.vector);
        }
      });
    } else if (move.axis == 'y') {
      this.cubes.forEach((cube) => {
        if (this.cubeInSameY(cube, this.selectedCube))
          this.rotateAroundWorldAxis(cube.cubeGroup, move.vector);
      });
    } else if (move.axis == 'z') {
      this.cubes.forEach((cube) => {
        if (this.cubeInSameZ(cube, this.selectedCube))
          this.rotateAroundWorldAxis(cube.cubeGroup, move.vector);
      });
    }
  }
  sramble (steps) {
    let randomIndex = Math.floor(Math.random() * this.axisList.length);
    let randomMoves = [this.axisList[randomIndex]];
    for(let  i = 1; i < steps; i++) {
      randomIndex = Math.floor(Math.random() * this.axisList.length);
      const lastItem = [...randomMoves].pop();
      while(lastItem.id == this.axisList[randomIndex].id || lastItem.axis == this.axisList[randomIndex].axis) {
        randomIndex = Math.floor(Math.random() * this.axisList.length);
      }
      randomMoves.push(this.axisList[randomIndex])
    }
    // this.scrambleMoves = [...this.scrambleMoves, ...randomMoves];
    this.historyMoves = [...this.historyMoves, ...randomMoves]
    setInterval(() => {
      let firstMove = randomMoves.shift();
      this.moveByAxis(firstMove)
    }, 400)
    console.log('randomMoves', randomMoves)
  }
  solveCube () {
    let solvedMoves = [];
    console.log('scrambleMoves', this.scrambleMoves)
    this.historyMoves.reverse().forEach((move) => {
      let reverseMove = this.axisList.find((item) => item.id == move.opposite);
      solvedMoves.push(reverseMove);
    })
    this.historyMoves = []
    console.log("solvedMoves", solvedMoves)

    setInterval(() => {
      let firstMove = solvedMoves.shift();
      this.moveByAxis(firstMove)
    }, 400)

  }

  initializeRubiksCube(cubeType) {
    // this.cubes = [
    //   // Front 2x2.
    //   // new Cube(-1, 1, 1),
    //   // new Cube(1, 1, 1),
    //   // new Cube(-1, -1, 1),
    //   // new Cube(1, -1, 1),

    //   // Back 2x2.
    //   // new Cube(-1, 1, -1),
    //   // new Cube(1, 1, -1),
    //   // new Cube(-1, -1, -1),
    //   // new Cube(1, -1, -1),

    //   // Front face.
    //   new Cube(-0.5, 0.5, 0.5),
    //   new Cube(0.5, 0.5, 0.5),
    //   new Cube(-0.5, -0.5, 0.5),
    //   new Cube(0.5, -0.5, 0.5),
    //   // new Cube(1, 0, 1),
    //   // new Cube(-1, -1, 1),
    //   // new Cube(0, -1, 1),
    //   // new Cube(1, -1, 1),

    //   // Middle face.
    //   // new Cube(-1, 1, 0),
    //   // new Cube(0, 1, 0),
    //   // new Cube(1, 1, 0),
    //   // new Cube(-1, 0, 0),
    //   // new Cube(0, 0, 0),
    //   // new Cube(1, 0, 0),
    //   // new Cube(-1, -1, 0),
    //   // new Cube(0, -1, 0),
    //   // new Cube(1, -1, 0),

    //   // Back face.
    //   new Cube(-0.5, 0.5, -0.5),
    //   new Cube(0.5, 0.5, -0.5),
    //   new Cube(-0.5, -0.5, -0.5),
    //   new Cube(0.5, -0.5, -0.5),

    //   // new Cube(-1, 1, -1),
    //   // new Cube(0, 1, -1),
    //   // new Cube(1, 1, -1),
    //   // new Cube(-1, 0, -1),
    //   // new Cube(0, 0, -1),
    //   // new Cube(1, 0, -1),
    //   // new Cube(-1, -1, -1),
    //   // new Cube(0, -1, -1),
    //   // new Cube(1, -1, -1),
    // ];
    let selectedCubeType = CubeCollection.find((item) => item.type == cubeType)
    this.cubes=selectedCubeType.data
    this.cubes.forEach((cube) => {
      this.rubiksCubeGroup.add(cube.cubeGroup);
    });
    const axesHelper = new THREE.AxesHelper( 5 );
    const XAxesColor = new THREE.Color('red');
    const YAxesColor = new THREE.Color('blue');
    const ZAxesColor = new THREE.Color('green');
    axesHelper.setColors(XAxesColor, YAxesColor, ZAxesColor)
    this.rubiksCubeGroup.add(axesHelper);
    this.selectedCube = this.cubes[0];
    this.rubiksCubeGroup.updateWorldMatrix(true, true)
  }
}
