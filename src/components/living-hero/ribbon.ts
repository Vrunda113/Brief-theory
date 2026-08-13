import * as THREE from 'three'

/**
 * The sculpture's geometry: one broad surface swept along a curve.
 *
 * Built by hand rather than extruded along a path, because an extrusion gives a
 * solid bar with a fixed cross-section — a tube or a rail. A ribbon needs the
 * opposite: a wide, thin surface whose width, twist and cross-curl all change
 * as it travels, which is what makes it read as folded paper rather than as
 * something machined.
 */

/**
 * The centreline, in world units.
 *
 * The middle of the run sits on the wordmark's own curved stroke, and the form
 * flows outward from there in both directions — so the sculpture is that stroke
 * continued rather than a shape that happens to be nearby.
 *
 * Deliberately asymmetrical and deliberately open: it falls away to the lower
 * left and rises to the upper right, and at no point turns back on itself. A
 * curve that closed would read as a hoop around the logo, which is the thing
 * this replaces.
 */
export const SPINE: [number, number, number][] = [
  [-2.62, -1.34, -0.92],
  [-2.02, -0.82, -0.60],
  [-1.36, -0.42, -0.32],
  [-0.72, -0.14, -0.10],
  // the wordmark's stroke — the middle of the run, where the unfold begins
  [0.06, 0.03, 0.05],
  [0.80, 0.21, -0.12],
  [1.48, 0.55, -0.36],
  [2.08, 0.92, -0.26],
  [2.52, 1.12, 0.10],
]

/** Rows along the run, and columns across the band. */
const STEPS = 320
const COLS = 14

/**
 * Half-width of the band at a given point along the run. Broad through the
 * middle where it passes behind the mark, tapering to almost nothing at both
 * ends so the form dissolves into the cream instead of stopping at an edge.
 */
function halfWidth(t: number): number {
  // A soft bell, pushed off-centre so the two arms are not the same size.
  const bell = Math.sin(Math.PI * Math.pow(t, 0.86))
  return 0.1 + 0.5 * Math.pow(bell, 0.8)
}

/**
 * How far the band has turned about its own axis. A little over a half turn
 * across the whole run, arriving unevenly, so the light breaks across it in one
 * or two places rather than uniformly.
 */
function twist(t: number): number {
  return -0.55 + 2.35 * t + 0.45 * Math.sin(t * Math.PI * 1.6)
}

/** How much the band troughs across its width — the fold, not a crease. */
function curl(t: number): number {
  return 0.16 + 0.2 * Math.sin(Math.PI * t)
}

export type RibbonHalf = {
  geometry: THREE.BufferGeometry
  /** Index count of one row, so a reveal can be counted in rows. */
  perRow: number
  rows: number
}

/**
 * Builds the two halves of the sculpture, both starting at the wordmark's
 * stroke and running outward.
 *
 * Two geometries rather than one: the form has to unfold from the middle in
 * both directions at once, and a single buffer can only be revealed from one
 * end. Split at the centre, each half is simply drawn from its own first row.
 */
export function buildRibbon(): { left: RibbonHalf; right: RibbonHalf } {
  const curve = new THREE.CatmullRomCurve3(
    SPINE.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    'catmullrom',
    0.5,
  )

  // Frames for the whole run at once. Computed per-half they would disagree
  // where the halves meet and the surface would kink at the join.
  const frames = curve.computeFrenetFrames(STEPS, false)
  const mid = Math.floor(STEPS / 2)

  const build = (fromRow: number, toRow: number): RibbonHalf => {
    const rows = Math.abs(toRow - fromRow) + 1
    const dir = Math.sign(toRow - fromRow) || 1
    const positions = new Float32Array(rows * (COLS + 1) * 3)
    const uvs = new Float32Array(rows * (COLS + 1) * 2)
    const indices: number[] = []

    const p = new THREE.Vector3()
    const across = new THREE.Vector3()
    const lift = new THREE.Vector3()

    for (let r = 0; r < rows; r++) {
      const row = fromRow + r * dir
      const t = row / STEPS
      curve.getPointAt(t, p)

      const n = frames.normals[row]
      const b = frames.binormals[row]
      const tw = twist(t)

      // The band's own across-axis, turned by the twist.
      across.copy(n).multiplyScalar(Math.cos(tw)).addScaledVector(b, Math.sin(tw))
      // Perpendicular to both the run and the across-axis: the fold direction.
      lift.copy(frames.tangents[row]).cross(across).normalize()

      const hw = halfWidth(t)
      const cu = curl(t)

      for (let c = 0; c <= COLS; c++) {
        const u = c / COLS - 0.5
        // Cosine across the width gives a shallow trough with no crease at the
        // centre and no lip at the edges.
        const fold = Math.cos(u * Math.PI) * cu * hw
        const i = (r * (COLS + 1) + c) * 3
        positions[i] = p.x + across.x * (u * 2 * hw) + lift.x * fold
        positions[i + 1] = p.y + across.y * (u * 2 * hw) + lift.y * fold
        positions[i + 2] = p.z + across.z * (u * 2 * hw) + lift.z * fold

        const j = (r * (COLS + 1) + c) * 2
        uvs[j] = t
        uvs[j + 1] = c / COLS
      }
    }

    // Wound row by row, so a draw range measured in rows reveals the form
    // travelling away from the mark rather than appearing in patches.
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < COLS; c++) {
        const a = r * (COLS + 1) + c
        const bb = a + 1
        const cc = a + (COLS + 1)
        const d = cc + 1
        indices.push(a, cc, bb, bb, cc, d)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    return { geometry, perRow: COLS * 6, rows: rows - 1 }
  }

  return {
    left: build(mid, 0),
    right: build(mid, STEPS),
  }
}
