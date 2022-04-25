import * as THREE from 'three';
import Cube from './Cube';

const Cube2X2 = [
      // Front face.
      new Cube(-0.5, 0.5, 0.5),
      new Cube(0.5, 0.5, 0.5),
      new Cube(-0.5, -0.5, 0.5),
      new Cube(0.5, -0.5, 0.5),
       // Back face.
       new Cube(-0.5, 0.5, -0.5),
       new Cube(0.5, 0.5, -0.5),
       new Cube(-0.5, -0.5, -0.5),
       new Cube(0.5, -0.5, -0.5),
];
const Cube3X3 = [
     // Front face.
     new Cube(-1, 1, 1),
     new Cube(0, 1, 1),
     new Cube(1, 1, 1),
     new Cube(-1, 0, 1),
     new Cube(0, 0, 1),
     new Cube(1, 0, 1),
     new Cube(-1, -1, 1),
     new Cube(0, -1, 1),
     new Cube(1, -1, 1),

     // Middle face.
     new Cube(-1, 1, 0),
     new Cube(0, 1, 0),
     new Cube(1, 1, 0),
     new Cube(-1, 0, 0),
     new Cube(0, 0, 0),
     new Cube(1, 0, 0),
     new Cube(-1, -1, 0),
     new Cube(0, -1, 0),
     new Cube(1, -1, 0),

     // Back face.
     new Cube(-1, 1, -1),
     new Cube(0, 1, -1),
     new Cube(1, 1, -1),
     new Cube(-1, 0, -1),
     new Cube(0, 0, -1),
     new Cube(1, 0, -1),
     new Cube(-1, -1, -1),
     new Cube(0, -1, -1),
     new Cube(1, -1, -1),
]
const CubeCollection = [
    {
        type: '2X2',
        data: Cube2X2
    },
    {
        type: '3X3',
        data: Cube3X3
    }
]
export {CubeCollection};