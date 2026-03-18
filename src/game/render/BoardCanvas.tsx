import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Canvas, useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import type { OrthographicCamera } from 'three';
import { BoardScene } from './BoardScene';
import { TOP_DOWN_CAMERA_HALF_EXTENT } from './rendering';

function TopDownCamera() {
  const camera = useThree((state) => state.camera as OrthographicCamera);
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const baseHalfExtent = TOP_DOWN_CAMERA_HALF_EXTENT;
    const halfHeight = aspect >= 1 ? baseHalfExtent : baseHalfExtent / aspect;
    const halfWidth = halfHeight * aspect;

    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.near = 0.1;
    camera.far = 100;
    camera.position.set(0, 24, 0.01);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  return null;
}

export function BoardCanvas() {
  return (
    <Canvas
      orthographic
      dpr={[1, 2]}
      shadows="percentage"
      camera={{ zoom: 1 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#050813']} />
      <fog attach="fog" args={['#050813', 18, 34]} />
      <TopDownCamera />
      <BoardScene />
      <EffectComposer multisampling={4}>
        <Bloom
          intensity={1.45}
          luminanceThreshold={0.14}
          luminanceSmoothing={0.24}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
