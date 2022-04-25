import { useEffect, useState } from 'react';

import { GUI } from 'dat.gui';
import * as THREE from 'three';

import SceneInit from './lib/SceneInit';
import RubiksCube from './lib/RubiksCube';
const buttonStyle = {
  marginLeft: '20px',
  background: 'white',
  marginBottom: '20px',
  padding: '10px 5px',
  // flex: 1/3
};

function App() {
  const [showBtns, setShowBtns] = useState(false);
  const test = new SceneInit('myThreeJsCanvas');
  const r = new RubiksCube('3X3');
  useEffect(() => {
    test.initScene();
    test.animate();

    test.scene.add(r.rubiksCubeGroup);

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    function onMouseDown(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, test.camera);
      const objects = raycaster.intersectObjects(r.rubiksCubeGroup.children);
      const cubeObjects = objects.filter((c) => {
        return c.object.type === 'Mesh';
      });
      if (cubeObjects.length > 0) {
        r.highlightCubes(cubeObjects[0].object);
      }
      let axisLabel = event.target.dataset.axis;
      let scrambleBtn = event.target.classList.contains('scrambleBtn');
      let solveBtn = event.target.classList.contains('solveBtn');
      let checkClickCubeType = event.target.hasAttribute('name')

      // cubeType.forEach((item) => {
      //   item.addEventListener('click', () => {
      //     alert(111)
      //   })
      // })
      // cubeType.addEventListener('click', () => alert(1111))
      // console.log(cubeType.value)
      // alert(cubeType)
      if (axisLabel) {
        r.onKeyDown({
          key: axisLabel,
        });
      } else if (scrambleBtn) {
        r.sramble(10);
      } else if (solveBtn) {
        r.solveCube();
      }
    }

    const onKeyDown = (event) => {
      if (event.repeat) {
        return;
      }
      r.onKeyDown(event);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onMouseDown);

    // const planeGeometry = new THREE.PlaneGeometry(2, 2);
    // const planeMaterial = new THREE.MeshPhongMaterial({ color: '#ff0000' });
    // const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    // planeMesh.position.z = -2;
    // group.add(planeMesh);

    // const gui = new GUI();
    // const folder = gui.addFolder("Rubik's Cube");
    // folder.add(r, 'epsilon', 0.5, 3.5, 0.5);
    // folder.add(r, 'consoleDebug');
    // folder.open();
  }, []);
  // const handleClickRotate = (axisLabel) => {
  //   // r.movingWorldCube(axisLabel)
  //   r.onKeyDown({
  //     key: 'w'
  //   })
  // }
  return (
    <div>
      <canvas id="myThreeJsCanvas"></canvas>

      {true && (
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 200,
            // background: 'white',
            zIndex: 100,
            width: 200,
          }}
        >
          {/* <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              marginLeft: '20px',
              marginBottom: '10px',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <input type="radio" name="cubeType" id="2X2" value="2X2"></input>
              <label  style={{ color: 'white' }}>2X2</label>
            </div>
            <div>
              <input type="radio" name="cubeType" id="3X3" value="3X3"></input>
              <label  style={{ color: 'white' }}>3X3</label>
            </div>
            <div>
              <input type="radio" name="cubeType" id="4X4" value="4X4"></input>
              <label style={{ color: 'white' }}>4X4</label>
            </div>
          </div> */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <button data-axis="w" style={buttonStyle}>
              Rotate X
            </button>
            <button data-axis="s" style={buttonStyle}>
              Rotate X'
            </button>
            <button data-axis="a" style={buttonStyle}>
              Rotate Y
            </button>
            <button data-axis="d" style={buttonStyle}>
              Rotate Y'
            </button>
            <button data-axis="q" style={buttonStyle}>
              Rotate Z
            </button>
            <button data-axis="e" style={buttonStyle}>
              Rotate Z'
            </button>
            <button className="scrambleBtn" style={buttonStyle}>
              Scramble
            </button>
            <button className="solveBtn" style={buttonStyle}>
              Solve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
