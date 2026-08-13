import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildRibbon, type RibbonHalf } from './ribbon'

/**
 * One ribbon, unfolding out of the wordmark's stroke.
 *
 * There are no rings here and nothing orbits. The whole sculpture is a single
 * open curve, broad through the middle where it passes behind the mark and
 * tapering away at both ends, asymmetrical from end to end. It replaces a set
 * of concentric bands that framed the logo symmetrically and, being metal,
 * out-shouted it.
 *
 * The material is doing as much of the work as the shape: a matte pearl cream,
 * a shade off the paper, so the navy mark sitting over it stays the darkest
 * thing on screen. Readability here is a lighting decision, not a z-index one.
 */

/** Seconds the form takes to unfold once the landing screen has lifted. */
const UNFOLD = 2.8
/** The lean at the very edge of the screen — about three degrees. */
const LEAN = 0.055

const damp = THREE.MathUtils.damp
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)

/**
 * Diffused studio light, drawn rather than loaded: an almost flat cream field
 * with the faintest blue in the floor. Low contrast on purpose — a punchier
 * environment puts hot specular streaks along the fold, and the brief asks for
 * satin, not chrome. The blue underneath is the only place the navy edges on
 * the ribbon come from.
 */
function useStudio() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const room = ctx.createLinearGradient(0, 0, 0, 256)
    room.addColorStop(0.0, '#FFFFFF')
    room.addColorStop(0.34, '#FBF6EF')
    room.addColorStop(0.62, '#F6F0E9')
    room.addColorStop(0.84, '#DAE6F3')
    room.addColorStop(1.0, '#A7B8CE')
    ctx.fillStyle = room
    ctx.fillRect(0, 0, 512, 256)

    // One broad, very soft key. Kept wide so the highlight is a wash across the
    // fold rather than a hot spot on it.
    const key = ctx.createRadialGradient(180, 40, 10, 180, 40, 210)
    key.addColorStop(0, 'rgba(255,255,255,0.9)')
    key.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = key
    ctx.fillRect(0, 0, 512, 256)

    const texture = new THREE.CanvasTexture(canvas)
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.colorSpace = THREE.SRGBColorSpace

    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const env = pmrem.fromEquirectangular(texture).texture
    scene.environment = env

    return () => {
      scene.environment = null
      env.dispose()
      texture.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
}

/**
 * The shadow under the sculpture: a soft blot on a plane behind it, not a cast
 * shadow. A real shadow map from this light would throw a hard-edged band
 * straight across the wordmark, which the brief rules out — and an ambient
 * blot is what a gallery piece on paper actually looks like anyway.
 */
function GroundShadow() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const blot = ctx.createRadialGradient(128, 128, 4, 128, 128, 126)
    blot.addColorStop(0, 'rgba(4,46,105,0.30)')
    blot.addColorStop(0.45, 'rgba(4,46,105,0.12)')
    blot.addColorStop(1, 'rgba(4,46,105,0)')
    ctx.fillStyle = blot
    ctx.fillRect(0, 0, 256, 256)
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  useEffect(() => () => texture?.dispose(), [texture])
  if (!texture) return null

  return (
    // Sat under the broad middle of the run and stretched along it, so the
    // form reads as resting above the paper rather than floating free of it.
    <mesh position={[-0.15, -1.05, -1.15]} rotation={[0, 0, -0.16]}>
      <planeGeometry args={[5.6, 2.4]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} opacity={0.55} />
    </mesh>
  )
}

function Half({
  half,
  progress,
  material,
}: {
  half: RibbonHalf
  progress: React.RefObject<number>
  material: THREE.Material
}) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame(() => {
    const g = mesh.current?.geometry
    if (!g) return
    // Revealed by whole rows, so the leading edge is always a clean section
    // across the band rather than a ragged run of triangles.
    const rows = Math.max(1, Math.round(half.rows * (progress.current ?? 0)))
    g.setDrawRange(0, rows * half.perRow)
  })

  return <mesh ref={mesh} geometry={half.geometry} material={material} />
}

function Sculpture({
  pointer,
  still,
  ready,
}: {
  pointer: React.RefObject<{ x: number; y: number }>
  still: boolean
  ready: boolean
}) {
  useStudio()
  const rig = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  const { left, right } = useMemo(() => buildRibbon(), [])
  const progress = useRef(still ? 1 : 0)
  const elapsed = useRef(0)

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        // A shade off the paper — enough to separate, not enough to compete.
        color: new THREE.Color('#EFE7DA'),
        roughness: 0.62,
        metalness: 0.0,
        clearcoat: 0.3,
        clearcoatRoughness: 0.55,
        sheen: 1,
        sheenRoughness: 0.7,
        sheenColor: new THREE.Color('#A7B8CE'),
        envMapIntensity: 0.85,
        side: THREE.DoubleSide,
      }),
    [],
  )

  useEffect(
    () => () => {
      material.dispose()
      left.geometry.dispose()
      right.geometry.dispose()
    },
    [material, left, right],
  )

  // Held to a share of the viewport, so the sculpture keeps its proportion of
  // the screen rather than swelling on a wide monitor.
  const fit = Math.min(1.0, Math.max(0.56, viewport.width / 11.5))

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.06)
    const g = rig.current
    if (!g) return

    if (still) {
      progress.current = 1
      g.scale.setScalar(fit)
      return
    }

    if (ready && progress.current < 1) {
      elapsed.current += dt
      progress.current = Math.min(1, easeOut(elapsed.current / UNFOLD))
    }

    const t = performance.now() / 1000
    const lean = pointer.current ?? { x: 0, y: 0 }

    // Quiet air: a drift of about a degree, on a cycle slow enough that it is
    // never caught in the act.
    const breath = Math.sin(t * 0.11) * 0.018
    const sway = Math.cos(t * 0.083) * 0.014

    g.rotation.y = damp(g.rotation.y, lean.x * LEAN + sway, 1.6, dt)
    g.rotation.x = damp(g.rotation.x, lean.y * LEAN * 0.7 + breath, 1.6, dt)
    g.position.y = damp(g.position.y, Math.sin(t * 0.07) * 0.03, 1.4, dt)
    g.scale.setScalar(damp(g.scale.x, fit, 3, dt))
  })

  return (
    <>
      {/* Diffused: no single source hard enough to cast a defined edge. */}
      <ambientLight intensity={0.72} />
      <hemisphereLight args={['#FFFFFF', '#A7B8CE', 0.55]} />
      <directionalLight position={[2.4, 3.6, 4.2]} intensity={0.75} />
      <directionalLight position={[-3.6, -1.2, 2.2]} intensity={0.3} color="#DAE6F3" />

      <group ref={rig} scale={still ? fit : 0.001}>
        <GroundShadow />
        <Half half={left} progress={progress} material={material} />
        <Half half={right} progress={progress} material={material} />
      </group>
    </>
  )
}

export function HeroSculpture({ ready, still }: { ready: boolean; still: boolean }) {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (still) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [still])

  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      style={{ pointerEvents: 'none' }}
      // No shadow map at all: the only shadow in the scene is the soft blot
      // under the form, which cannot fall across the wordmark.
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
      }}
    >
      <Sculpture pointer={pointer} still={still} ready={ready} />
    </Canvas>
  )
}
