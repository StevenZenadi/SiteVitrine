import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Cube() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
}

function Scene() {
    return (
        <Canvas camera={{ position: [3, 3, 3] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Cube />
            <OrbitControls />
        </Canvas>
    );
}

export default Scene;
