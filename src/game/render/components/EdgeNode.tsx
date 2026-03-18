import { RoundedBox, Text } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { EdgeShot } from '../../core/types';
import { VISUAL_PALETTE, edgeToWorld, getBeamVisualColor, toHexIndex } from '../rendering';

interface EdgeNodeProps {
  edge: EdgeShot;
  gridSize: number;
  used: boolean;
  hovered: boolean;
  blocked: boolean;
  onHover: () => void;
  onBlur: () => void;
  onClick: () => void;
}

export function EdgeNode({
  edge,
  gridSize,
  used,
  hovered,
  blocked,
  onHover,
  onBlur,
  onClick,
}: EdgeNodeProps) {
  const position = edgeToWorld(edge, gridSize);
  const isCyanSide = edge.side === 'top' || edge.side === 'bottom';
  const beamColor = getBeamVisualColor(isCyanSide ? 'cyan' : 'magenta');
  const color = used ? '#31415f' : blocked ? VISUAL_PALETTE.danger : beamColor;
  const scale = hovered ? 1.15 : 1;
  const rotation: [number, number, number] =
    edge.side === 'left' || edge.side === 'right' ? [0, 0, 0.18] : [0.18, 0, 0];
  const labelColor = used ? '#8d9ab7' : blocked ? '#ffd7db' : isCyanSide ? '#bff7ff' : '#ffd1f0';
  const outlineColor = used ? '#1a2237' : blocked ? '#5d1b28' : isCyanSide ? '#0c3950' : '#551539';
  const glowColor = used ? '#1c2740' : blocked ? VISUAL_PALETTE.danger : beamColor;

  function stopEvent(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
  }

  return (
    <group position={position}>
      <group rotation={rotation}>
        <RoundedBox
          args={[0.52 * scale, 0.22 * scale, 0.52 * scale]}
          radius={0.08}
          smoothness={4}
          onPointerOver={(event) => {
            stopEvent(event);
            onHover();
          }}
          onPointerOut={(event) => {
            stopEvent(event);
            onBlur();
          }}
          onClick={(event) => {
            stopEvent(event);
            onClick();
          }}
        >
          <meshStandardMaterial
            color={used ? '#1c2740' : color}
            emissive={color}
            emissiveIntensity={used ? 0.16 : hovered ? 1 : 0.52}
            metalness={0.45}
            roughness={0.25}
          />
        </RoundedBox>
      </group>

      <Text
        position={[0, 0.16, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.22 * scale}
        maxWidth={0.46 * scale}
        color={labelColor}
        outlineColor={outlineColor}
        outlineWidth={0.02}
        anchorX="center"
        anchorY="middle"
      >
        {toHexIndex(edge.index)}
        <meshBasicMaterial color={labelColor} toneMapped={false} />
      </Text>

      <mesh position={[0, 0.12, 0]}>
        <ringGeometry args={[0.18 * scale, 0.24 * scale, 32]} />
        <meshBasicMaterial color={glowColor} transparent opacity={hovered ? 0.28 : 0.16} />
      </mesh>
    </group>
  );
}
