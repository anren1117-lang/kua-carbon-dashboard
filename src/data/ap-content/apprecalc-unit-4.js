// AP Precalculus Unit 4 — Functions Involving Parameters, Vectors, Matrices

export const APPRECALC_UNIT_4 = {
  number: 4,
  title: 'Functions Involving Parameters, Vectors, Matrices',
  weight: 'No exam; instructional unit',
  subunits: [
    {
      code: '4.1',
      title: 'Parametric functions',
      content:
`**Parametric equations.** x = f(t), y = g(t).
- t = parameter (often time).

**Examples.**
- Circle: x = cos t, y = sin t.
- Line through two points: x = x₀ + at, y = y₀ + bt.
- Projectile motion: x = v₀cos(θ)t, y = v₀sin(θ)t − ½gt².

**Eliminating parameter.** Solve one equation for t; substitute.

**Implicit vs explicit.**
- Explicit: y = f(x).
- Implicit: F(x, y) = 0. Defines y indirectly.

**Conic sections in parametric.**
- Ellipse: x = a cos t, y = b sin t.
- Hyperbola: x = a sec t, y = b tan t.`,
    },
    {
      code: '4.2',
      title: 'Vectors',
      content:
`**Vector.** Quantity with magnitude and direction.

**Notation.** ⟨a, b⟩ or ⟨a, b, c⟩ for 2D, 3D.

**Magnitude.** |v| = √(a² + b²).

**Addition.** u + v = ⟨u₁ + v₁, u₂ + v₂⟩.
**Scalar multiplication.** k·v = ⟨ka, kb⟩.

**Unit vector.** Magnitude 1. û = v/|v|.

**Standard unit vectors.** i = ⟨1, 0⟩, j = ⟨0, 1⟩.
- v = ai + bj = ⟨a, b⟩.

**Dot product.** u · v = u₁v₁ + u₂v₂ = |u||v|cos θ.
- θ = 0: same direction. cos = 1.
- θ = π/2: perpendicular. dot = 0.
- θ = π: opposite. cos = −1.

**Cross product (3D).** Magnitude = |u||v|sin θ. Result perpendicular.

**Applications.**
- Forces, velocities, displacements.
- Projectile motion.
- Navigation.
- Computer graphics.

**Vector-valued functions.** r(t) = ⟨x(t), y(t)⟩ describes path of moving point.`,
    },
    {
      code: '4.3',
      title: 'Matrices and linear transformations',
      content:
`**Matrix.** Rectangular array of numbers.

**Notation.** Capital letter. m × n matrix has m rows, n columns.

**Operations.**
- Addition: element-wise (same dimensions).
- Scalar multiplication: scale each entry.
- Multiplication: row of left times column of right; only when dimensions match (m×n times n×p = m×p).

**Matrix multiplication is NOT commutative.** AB ≠ BA generally.

**Identity matrix I.** 1s on diagonal, 0s elsewhere. AI = IA = A.

**Inverse.** A⁻¹ such that AA⁻¹ = I.
- Only square non-singular matrices have inverses.
- 2×2: A = [[a,b],[c,d]] → A⁻¹ = (1/(ad−bc))·[[d,−b],[−c,a]].

**Determinant.** Number; tells if invertible.
- 2×2: det = ad − bc.
- 3×3: cofactor expansion.

**Linear transformations.** Matrix acts on vector.
- Av describes how vector v transforms.

**Common 2D transformations.**
- Scaling: [[k,0],[0,k]].
- Rotation by θ: [[cos θ, −sin θ],[sin θ, cos θ]].
- Reflection.

**Solving linear systems.** Ax = b → x = A⁻¹b (if A invertible).

**Used in.** Computer graphics, statistics, machine learning, economics, physics.`,
    },
  ],
  keyConcepts: [
    'Parametric: x = f(t), y = g(t).',
    'Vector: magnitude + direction.',
    'Dot product: u · v = |u||v|cos θ; 0 if perpendicular.',
    'Matrix: rows × cols.',
    'Matrix multiplication non-commutative.',
    'Determinant: 2×2 = ad − bc.',
    'Inverse exists iff det ≠ 0.',
    'Linear transformations as matrices.',
    'Rotation, scaling, reflection matrices.',
  ],
  practice: [
    { q: 'Vectors u = ⟨3, 4⟩, v = ⟨1, 0⟩. Dot product?', a: 'u·v = 3·1 + 4·0 = 3. Also |u||v|cos θ = 5·1·cos θ. cos θ = 0.6.' },
  ],
  pitfalls: [
    '"AB = BA" — generally not true for matrices.',
  ],
};
