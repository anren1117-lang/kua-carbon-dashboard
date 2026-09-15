// AP Physics 1 Unit 1 — Kinematics (10-15%)
// APES-standard depth. LaTeX math via $...$ delimiters.

export const APPHYS1_UNIT_1 = {
  number: 1,
  title: 'Kinematics',
  weight: '10-15%',
  subunits: [
    {
      code: '1.1',
      title: 'Position, displacement, distance',
      content:
`Kinematics is the part of physics that describes motion without yet caring about why it happens. We answer "where, when, how fast" and leave "why" for Unit 2 (forces). Even this descriptive part of physics is built on careful definitions: position vs displacement vs distance, scalar vs vector, instantaneous vs average. Getting these distinctions exactly right is the foundation for everything else, and confusion here is the single most common source of lost AP points.

**Position ($x$).** Where an object is, measured from a chosen reference point (the origin). Position is a **vector** — it has both magnitude and direction. In 1D, the direction is captured by the sign: positive position is on one side of the origin, negative on the other.

To specify position, you need:

- A **reference point** (origin).
- A **direction convention** (which way is positive).
- A **unit** (meters in SI).

So "the car is at $x = +30$ m" means the car is 30 m from the origin in the positive direction. The same physical car at the same physical spot might be at $x = -50$ m if you chose your origin somewhere else. Position has no absolute meaning; it's always relative to the frame you set up.

**Distance.** The total length of the path traveled. **Always non-negative**. A scalar (no direction).

**Displacement ($\\Delta x$).** The straight-line change in position from start to finish:

$$\\Delta x \\,=\\, x_f - x_i$$

Displacement is a **vector**: it has direction (positive or negative in 1D; angle in 2D/3D) and is signed.

**The classic example.** Walk 3 m east, then 2 m west.

- **Distance traveled** = $3 + 2 = 5$ m (total path length).
- **Displacement** = $+3 - 2 = +1$ m (net change in position, east).

You walked 5 meters, but you ended up only 1 meter from where you started. Distance and displacement only agree when motion is in a straight line in one direction.

**Why this distinction matters.** A round-trip car trip from home to a store and back has total distance = $2 \\times$ (one-way distance), but displacement = 0 (you ended where you started). Your gas tank cares about distance; your GPS pin cares about displacement.

**Scalars vs vectors.** This terminology matters constantly.

- **Scalar** quantities have only magnitude: speed, distance, time, mass, temperature, energy, work, power, charge.
- **Vector** quantities have magnitude **and** direction: position, displacement, velocity, acceleration, force, momentum, impulse, torque.

In 1D problems we represent vectors with positive or negative numbers; the sign carries direction. In 2D/3D we use components or arrows.

**Reference frames.** Before you can do any kinematics, you must choose a reference frame: where's the origin, which way is positive, what's the time zero. **Different frames give different numbers** for the same physical situation, but the physics doesn't change. A car moving 30 m/s east is, in a frame moving alongside it at 30 m/s east, at rest. There is no privileged absolute frame in classical mechanics — this principle, called **Galilean relativity**, foreshadows Einstein's relativity.

For most AP problems:

- Origin: usually the starting position of the object.
- Positive direction: usually "to the right" or "up" or "the initial direction of motion."
- Time zero: usually when the action begins.

Pick a convention at the start and stick with it throughout the problem. Half of all sign errors come from changing convention midway.

**Coordinate systems.** Standard physics conventions:

- 1D: positive $x$ to the right.
- 2D: $+x$ right, $+y$ up.
- Sometimes for dropped objects: $+y$ downward (to keep numbers positive). Either choice is fine; just commit and be consistent.

**Average vs instantaneous.**

- **Average velocity** over an interval: $\\bar{v} = \\dfrac{\\Delta x}{\\Delta t}$. Total displacement divided by total time. This is the slope of the line connecting the two endpoints on a position-vs-time graph (a "secant" line).
- **Instantaneous velocity**: velocity at a single moment. Mathematically, the limit of average velocity as $\\Delta t \\to 0$:

$$v \\,=\\, \\lim_{\\Delta t \\to 0} \\dfrac{\\Delta x}{\\Delta t} \\,=\\, \\dfrac{dx}{dt}$$

Geometrically, instantaneous velocity is the slope of the tangent line to the position-vs-time curve at that moment. If you've had calculus, you'll recognize this as the derivative of position with respect to time. AP Physics 1 doesn't require calculus, but the slope-of-tangent picture is essential.

**Why the average vs instantaneous distinction matters.** "Average speed" can mask big variations. A trip with average speed 50 mph might involve 70 mph on highway and 30 mph in city. The average tells you about the whole trip; the instantaneous tells you what the speedometer reads at a specific moment.

**Worked example.** A car's position is recorded at three times:

| Time (s) | Position (m) |
|----------|--------------|
| 0        | 0            |
| 5        | 80           |
| 10       | 100          |

- Average velocity from $t = 0$ to $t = 5$: $\\bar{v} = \\dfrac{80 - 0}{5 - 0} = 16$ m/s.
- Average velocity from $t = 5$ to $t = 10$: $\\bar{v} = \\dfrac{100 - 80}{10 - 5} = 4$ m/s.
- Average velocity from $t = 0$ to $t = 10$: $\\bar{v} = \\dfrac{100 - 0}{10 - 0} = 10$ m/s.

The car slowed down in the second half. The overall average (10 m/s) doesn't tell us when this happened — only the partial averages do.

**Common AP exam errors at this level.**

- Confusing distance and displacement. A round trip has distance $\\neq$ displacement.
- Forgetting to set up a coordinate system before solving. Sign conventions matter.
- Treating velocity and speed as interchangeable. They're related (speed = magnitude of velocity) but not the same.
- Computing average velocity from average of two velocities instead of from total displacement over total time.

**Why kinematics gets harder.** Real motion isn't always at constant velocity. In Unit 1.3 we'll handle constant acceleration with the kinematic equations. Beyond constant acceleration, you need calculus — but AP Physics 1 stays in the constant-acceleration regime, and the algebra and graphical reasoning we develop here will get you to the test.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE',
        title: 'Khan Academy — Distance and displacement',
        provider: 'Khan Academy',
      },
    },
    {
      code: '1.2',
      title: 'Velocity, acceleration, and motion graphs',
      content:
`Once you know what position and displacement are, the natural next questions are: how fast is the object moving, and how is its motion changing? These are velocity and acceleration. Graphs of these quantities — position-vs-time, velocity-vs-time, acceleration-vs-time — are one of the most heavily tested topics on the AP Physics 1 exam. Mastering the graphs is mostly mastering the relationships between slopes and areas.

**Speed vs velocity.**

- **Speed** is a scalar — only magnitude. The number on your car's speedometer. "60 mph."
- **Velocity** is a vector — magnitude plus direction. "60 mph north."

Velocity is the rate of change of position:

$$v \\,=\\, \\dfrac{\\Delta x}{\\Delta t}$$

Speed is the magnitude of velocity: speed $= |v|$. In 1D, speed is the absolute value of velocity.

**Worked example.** A jogger runs 4 m east in 2 s, then 4 m west in 2 s.

- Distance = 8 m. Total time = 4 s. Average **speed** = $8/4 = 2$ m/s.
- Displacement = 0. Average **velocity** = $0/4 = 0$ m/s.

Average speed is nonzero; average velocity is zero. They measure different things.

**Acceleration.** The rate of change of velocity:

$$a \\,=\\, \\dfrac{\\Delta v}{\\Delta t}$$

Acceleration is a vector. Its direction is the direction of the change in velocity, not necessarily the direction of motion.

**Acceleration is NOT just "speeding up."** Acceleration includes any change in velocity. Three cases:

1. **Speeding up.** Velocity and acceleration in the **same direction**. The object's speed increases.
2. **Slowing down.** Velocity and acceleration in **opposite directions**. Speed decreases. (Sometimes called "deceleration," but physicists don't use that word — it's just acceleration in the opposite direction of motion.)
3. **Changing direction.** Even at constant speed (circular motion, projectile motion), an object whose direction changes has nonzero acceleration. The acceleration is perpendicular to the velocity in this case (Unit 3, circular motion).

**Sign of acceleration.** $a < 0$ does NOT automatically mean slowing down. It means the acceleration vector points in the $-x$ direction. Whether that's slowing or speeding depends on the velocity's direction.

- Object moving in $+x$ with $a < 0$: slowing down.
- Object moving in $-x$ with $a < 0$: speeding up.

AP students lose huge numbers of points by writing "$a < 0$ so the object is slowing down" without checking the velocity's sign.

**Free-fall acceleration.** Near Earth's surface, in vacuum (no air resistance), all objects fall with the same acceleration:

$$g \\,\\approx\\, 9.8 \\text{ m/s}^2 \\text{ downward}$$

Often rounded to $10$ m/s$^2$ for back-of-envelope calculation. Key facts:

- This is independent of mass. A bowling ball and a feather fall at the same rate in vacuum. Galileo demonstrated this (or so the story goes) by dropping objects from the Tower of Pisa; the Apollo 15 astronauts confirmed it on the Moon with a hammer and a feather.
- In air, light/large-surface objects fall slower because of air resistance (drag). A piece of paper falls slowly; the same paper crumpled into a ball falls almost as fast as a stone.
- The direction is always toward Earth's center — downward. Sign depends on your coordinate convention (positive up makes $a = -g$; positive down makes $a = +g$).

**Average vs instantaneous, again.**

- **Average velocity**: $\\bar{v} = \\Delta x / \\Delta t$. Slope of the secant line on a position-time graph.
- **Instantaneous velocity**: slope of the tangent line. The limit as $\\Delta t \\to 0$.
- **Average acceleration**: $\\bar{a} = \\Delta v / \\Delta t$. Slope of the secant line on a velocity-time graph.
- **Instantaneous acceleration**: slope of the tangent line on a velocity-time graph.

**Motion graphs — the core relationships.** Three graphs, three relationships:

**Position vs time.**

- **Slope of position-vs-time = velocity.** Steep slope → fast. Negative slope → moving in $-x$. Curved → velocity changing → acceleration nonzero.
- Straight line → constant velocity, zero acceleration.
- Upward curve (concave up) → acceleration positive.
- Downward curve (concave down) → acceleration negative.

**Velocity vs time.**

- **Slope of velocity-vs-time = acceleration.** Constant slope (straight line) → constant acceleration.
- **Area under the velocity-vs-time curve = displacement.** Positive area above the x-axis adds displacement; negative area below subtracts. (For constant velocity, area = velocity × time = rate × time = displacement.)

**Acceleration vs time.**

- **Area under the acceleration-vs-time curve = change in velocity.** For constant $a$ over time $t$: $\\Delta v = a \\cdot t$.

**Worked example — interpreting a v-t graph.** A velocity-vs-time graph shows a straight line from $(0, 0)$ to $(5, 20)$, then a horizontal line from $(5, 20)$ to $(10, 20)$.

- From $t = 0$ to $5$ s: slope = $20/5 = 4$ m/s$^2$. Constant acceleration.
- From $t = 5$ to $10$ s: slope = 0. Zero acceleration; constant velocity at 20 m/s.
- Displacement from $0$ to $5$ s = area = $\\frac{1}{2}(5)(20) = 50$ m. (Triangle.)
- Displacement from $5$ to $10$ s = area = $(5)(20) = 100$ m. (Rectangle.)
- Total displacement over 10 s = 150 m.

**Practical reading skills.**

- If a position-vs-time graph is curving up (concave up), the object is accelerating in the $+x$ direction. If concave down, accelerating in $-x$.
- A velocity-vs-time graph below the x-axis means the velocity is in the $-x$ direction (object moving leftward). The area "under" that segment counts as negative displacement.
- A horizontal segment on velocity-vs-time means constant velocity, zero acceleration.

**Connections to calculus.** For students who've had calculus: velocity is the derivative of position with respect to time, $v = dx/dt$. Acceleration is the derivative of velocity, $a = dv/dt = d^2x/dt^2$. Displacement is the integral of velocity, $\\int v\\,dt$. The slope-and-area relationships are just the geometric interpretations of derivatives and integrals.

**Why graphs matter on the AP exam.** Free-response questions often give you a v-t graph and ask multiple questions about it: when is the object speeding up, when slowing, what's the maximum speed, what's the total displacement. Once you internalize "slope = next derivative, area = next antiderivative," these questions become arithmetic.

**A subtle point: speeding up vs slowing down on graphs.** On a position-vs-time graph, "speeding up" means the curve is getting steeper (in absolute value); "slowing down" means it's getting flatter. On a velocity-vs-time graph, "speeding up" means the curve is moving away from the time axis (in absolute value); "slowing down" means it's moving toward the time axis. Either way, the speed (not velocity) is what counts for "speeding up vs slowing."`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE',
        title: 'Khan Academy — Velocity and acceleration',
        provider: 'Khan Academy',
      },
    },
    {
      code: '1.3',
      title: 'Kinematic equations (constant acceleration)',
      content:
`When acceleration is constant, four algebraic equations relate position, velocity, acceleration, and time. They look intimidating, but they're really just one situation seen from four different angles. Knowing when and how to use them is the workhorse skill of AP Physics 1 Unit 1.

**The four kinematic equations** (for constant acceleration $a$, initial position $x_0$, initial velocity $v_0$):

$$\\text{(1)}\\quad v \\,=\\, v_0 + at \\qquad (\\text{no } x)$$

$$\\text{(2)}\\quad x \\,=\\, x_0 + v_0 t + \\tfrac{1}{2}at^2 \\qquad (\\text{no final } v)$$

$$\\text{(3)}\\quad v^2 \\,=\\, v_0^2 + 2a(x - x_0) \\qquad (\\text{no } t)$$

$$\\text{(4)}\\quad x \\,=\\, x_0 + \\tfrac{1}{2}(v_0 + v)t \\qquad (\\text{no } a)$$

**The variables.** Each equation involves some subset of $\\{v_0, v, x, x_0, a, t\\}$. The notation in parentheses indicates which variable is *missing* — that's how you pick the right equation. If you know three of the five quantities and want the fourth, pick the equation that doesn't involve the unknown sixth.

**How to choose an equation — the systematic approach.**

1. **Read the problem.** Identify what's given and what's asked.
2. **List the kinematic variables.** What are $v_0$, $v$, $x$, $x_0$, $a$, $t$? Which are known, which is asked, which is irrelevant?
3. **Pick the equation that contains all the known variables plus the unknown one** (and is missing the variable you don't care about).
4. **Solve algebraically first**, then plug in numbers. Substituting numbers early is a recipe for arithmetic mistakes.

**Worked example 1.** A car accelerates from rest at $3$ m/s$^2$. How far does it travel in 5 seconds?

- Given: $v_0 = 0$, $a = 3$ m/s$^2$, $t = 5$ s. Take $x_0 = 0$.
- Want: $x$.
- Irrelevant: final velocity $v$. (We don't care; we want distance.)
- Use equation (2): $x = x_0 + v_0 t + \\frac{1}{2}at^2 = 0 + 0 + \\frac{1}{2}(3)(25) = 37.5$ m.

**Worked example 2.** A car traveling at 30 m/s slows to 10 m/s while going 100 m. What's its acceleration?

- Given: $v_0 = 30$, $v = 10$, $\\Delta x = 100$.
- Want: $a$.
- Irrelevant: time $t$.
- Use equation (3): $v^2 = v_0^2 + 2a \\Delta x \\implies 100 = 900 + 200 a \\implies a = -4$ m/s$^2$.

Negative acceleration; the car is slowing.

**Worked example 3.** How long does it take a car accelerating from 0 to reach 25 m/s if $a = 5$ m/s$^2$?

- Given: $v_0 = 0$, $v = 25$, $a = 5$.
- Want: $t$.
- Irrelevant: $x$.
- Use equation (1): $v = v_0 + at \\implies 25 = 0 + 5t \\implies t = 5$ s.

**Free fall.** When an object moves under gravity alone (no air resistance), it has constant acceleration $g \\approx 9.8$ m/s$^2$ downward. Free fall is a special case of constant-acceleration kinematics with $a = -g$ if we take $+y$ as up (or $a = +g$ if $+y$ is down).

**Free-fall cases to know.**

- **Object dropped from rest.** $v_0 = 0$, $a = -g$. Falls: $y = y_0 - \\frac{1}{2}gt^2$, $v = -gt$. Time to fall a height $h$: $t = \\sqrt{2h/g}$.
- **Object thrown straight up.** $v_0$ positive (upward). At the peak: $v = 0$ (but $a$ is still $-g$). Max height: $h_{\\max} = v_0^2/(2g)$. Time to peak: $t = v_0/g$. Time to come back to the launch height: $2v_0/g$ (twice the time to peak).
- **Object thrown down from a height.** Both $v_0$ and gravity are downward; the object speeds up faster than free-falling from rest.

**The peak of a thrown-up object — a common pitfall.** At the highest point of a vertical throw, the velocity is zero, but the acceleration is still $-g$. The object is decelerating on the way up, instantaneously stationary at the peak, then accelerating downward on the way down. Acceleration is constant ($-g$) the whole time; only velocity passes through zero.

**Worked example — vertical throw.** A ball is thrown straight up with initial speed 20 m/s. How high does it rise?

- Given: $v_0 = 20$ m/s, $a = -g = -9.8$ m/s$^2$, $v = 0$ at peak.
- Want: $\\Delta y$ (height risen).
- Use equation (3): $0 = (20)^2 + 2(-9.8)\\Delta y \\implies \\Delta y = 400/19.6 \\approx 20.4$ m.

How long until it returns to launch height?

- Symmetry: time up = time down. Time to peak from equation (1): $t = 20/9.8 \\approx 2.04$ s. Total flight time: $\\approx 4.08$ s.

**Solving "two-step" problems.** Often a problem has multiple phases (acceleration, then coasting, then braking). The trick: apply the kinematic equations within each phase separately, using the end conditions of one phase as the initial conditions of the next.

**Worked example — two phases.** A car starts from rest, accelerates at $2$ m/s$^2$ for 10 s, then brakes at $-4$ m/s$^2$ until stopping.

Phase 1 (acceleration):

- $v_0 = 0$, $a = 2$, $t = 10$. So $v = 2 \\cdot 10 = 20$ m/s at end of phase 1.
- $x = \\frac{1}{2}(2)(100) = 100$ m.

Phase 2 (braking):

- $v_0 = 20$ (end of phase 1), $v = 0$, $a = -4$.
- Time to stop: $t = (0 - 20)/(-4) = 5$ s.
- Distance: $0 = 400 + 2(-4)x \\implies x = 50$ m.

Total distance: $150$ m. Total time: $15$ s.

**When the equations don't apply.** The kinematic equations require **constant** acceleration. Don't use them when:

- The acceleration changes over time (e.g., spring oscillations).
- Air resistance is significant (drag depends on velocity).
- The object is in non-uniform circular motion (acceleration changes direction).
- A force suddenly turns on or off.

For non-constant acceleration, either break the motion into phases of constant $a$ (if possible), use the impulse-momentum theorem (Unit 4), or use calculus (BC and beyond).

**Sign conventions — the most common error source.** Fix a coordinate system at the start (typically $+y$ up). Then:

- Velocities upward are positive; downward are negative.
- Gravity acts downward, so $a = -g = -9.8$ m/s$^2$.
- Heights above the origin are positive; below are negative.

If you flip conventions midway through the problem, you'll get nonsense answers. Commit and stick.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE',
        title: 'Khan Academy — Kinematic equations',
        provider: 'Khan Academy',
      },
    },
    {
      code: '1.4',
      title: '2D motion and projectiles',
      content:
`Real-world motion is rarely confined to one dimension. Cars turn, balls fly through arcs, planets orbit. Two-dimensional motion is the natural next step. The single most important insight: in 2D motion, the horizontal and vertical components of motion are **independent**. Once you accept and use this fact, 2D problems become a pair of 1D problems running in parallel.

**The independence principle.** Consider a ball rolled off a table. Once it leaves the table:

- **Horizontally**, the ball has whatever speed it had when it left the table, and (ignoring air) no horizontal force acts on it. So $a_x = 0$, $v_x$ is constant.
- **Vertically**, the ball is in free fall. $a_y = -g$. Starts with $v_y = 0$ (if it rolled off horizontally) and gains downward velocity.

The horizontal and vertical motions don't "talk to each other." Knowing where the ball is horizontally doesn't help you predict its vertical motion, and vice versa.

This explains the famous classroom demonstration: two balls released simultaneously, one dropped straight down and one shot horizontally from the same height, **hit the ground at the same instant**. The horizontal shot doesn't help the second ball stay up; it just travels sideways while falling at the same rate.

**Vectors as components.** A velocity vector $\\vec{v}$ in 2D has two components: $v_x$ (horizontal) and $v_y$ (vertical). You can recover the magnitude and angle from the components:

$$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}, \\qquad \\tan\\theta = \\dfrac{v_y}{v_x}$$

And components from magnitude and angle:

$$v_x = |\\vec{v}|\\cos\\theta, \\qquad v_y = |\\vec{v}|\\sin\\theta$$

These are the standard sine/cosine relationships from trigonometry.

**Projectile motion — the standard problem.** A projectile is an object moving under gravity alone (no air resistance, no other forces). The motion happens in a vertical plane: horizontal and vertical.

**Setup.** Choose coordinates: $+x$ in the direction of horizontal motion, $+y$ upward. Then:

- $a_x = 0$ (no horizontal force).
- $a_y = -g$ (gravity downward).

**Two motions, two sets of kinematics.**

- Horizontal: $x(t) = x_0 + v_{0x} t$. (Constant velocity, straight-line motion.)
- Vertical: $y(t) = y_0 + v_{0y} t - \\tfrac{1}{2} g t^2$. (Standard free-fall.)
- Vertical velocity: $v_y(t) = v_{0y} - g t$.

These two motions, taken together, give the projectile's trajectory.

**Projectile launched horizontally.** A ball rolls off a table at $v_0$ horizontally.

- $v_{0x} = v_0$ (constant throughout).
- $v_{0y} = 0$.
- Vertical fall: $y = y_0 - \\frac{1}{2}gt^2$. Time to fall height $h$: $t = \\sqrt{2h/g}$.
- Horizontal range during fall: $R = v_0 \\cdot t = v_0 \\sqrt{2h/g}$.

**Worked example.** A ball is rolled off a 1.25-m table at 5 m/s horizontally. How far from the table does it land?

- Fall time: $t = \\sqrt{2 \\cdot 1.25 / 9.8} \\approx 0.51$ s.
- Horizontal range: $R = 5 \\cdot 0.51 \\approx 2.55$ m.

**Projectile launched at angle $\\theta$.** A ball is launched at speed $v_0$ at angle $\\theta$ above horizontal.

- Horizontal launch velocity: $v_{0x} = v_0 \\cos\\theta$.
- Vertical launch velocity: $v_{0y} = v_0 \\sin\\theta$.

These are constant inputs that drive the rest of the motion.

**Key formulas (for launch and landing at same height, no air resistance).**

- **Time of flight** (from launch to back to launch height): $t = \\dfrac{2 v_0 \\sin\\theta}{g}$.
- **Max height**: $h_{\\max} = \\dfrac{(v_0 \\sin\\theta)^2}{2g} = \\dfrac{v_0^2 \\sin^2\\theta}{2g}$.
- **Range** (horizontal distance for return to launch height): $R = \\dfrac{v_0^2 \\sin(2\\theta)}{g}$.

**Maximum range at $\\theta = 45°$.** For a given launch speed, the range $R = v_0^2 \\sin(2\\theta)/g$ is maximized when $\\sin(2\\theta) = 1$, i.e., $2\\theta = 90°$, so $\\theta = 45°$. This is the classical "ideal launch angle." It's slightly different in reality (air resistance favors lower angles; landing height different from launch height changes the optimum), but the principle is exam-relevant.

**Symmetry of the trajectory.** Without air resistance, projectile motion has reflective symmetry around the peak. Time to reach peak = time to fall back to launch height. Speed at any height on the way up = speed at the same height on the way down. The angle the velocity makes above horizontal on the way up = angle below horizontal on the way down at the same height.

**At the peak of a trajectory.**

- $v_y = 0$. The projectile is instantaneously moving horizontally.
- $v_x$ is unchanged (still $v_0 \\cos\\theta$).
- The acceleration is still $g$ downward — never zero.
- The projectile is still gaining downward velocity even at the peak.

**Worked example.** A cannon fires a shell at 50 m/s at $30°$ above horizontal. Find the range and max height.

- $v_{0x} = 50 \\cos 30° = 43.3$ m/s.
- $v_{0y} = 50 \\sin 30° = 25$ m/s.
- Time of flight: $t = 2 \\cdot 25 / 9.8 \\approx 5.10$ s.
- Range: $R = v_{0x} \\cdot t = 43.3 \\cdot 5.10 \\approx 221$ m. (Or: $R = 50^2 \\sin(60°)/9.8 = 2500 \\cdot 0.866 / 9.8 \\approx 221$ m. Both methods agree.)
- Max height: $h_{\\max} = 25^2 / (2 \\cdot 9.8) \\approx 31.9$ m.

**Independence in action — a curveball example.** A car drives east at $30$ m/s while a passenger throws a ball straight up at $10$ m/s (in the car's frame). In the ground frame, the ball is launched at $30$ m/s east + $10$ m/s up. Treat horizontal and vertical independently.

- Time aloft (vertical): $t = 2 \\cdot 10 / 9.8 \\approx 2.04$ s.
- Horizontal distance: $30 \\cdot 2.04 \\approx 61.2$ m.
- The ball lands in the car, because the car has also moved $61.2$ m east in the same time. This is why you can throw a ball straight up in a moving car and catch it.

**Vector arithmetic for 2D problems.** To add or subtract 2D vectors, add or subtract by **components**:

If $\\vec{A} = (A_x, A_y)$ and $\\vec{B} = (B_x, B_y)$, then $\\vec{A} + \\vec{B} = (A_x + B_x, A_y + B_y)$.

To find the magnitude and direction of the result, convert back to magnitude-and-angle form using the Pythagorean theorem and arctangent.

**Pitfalls.**

- **Mixing horizontal and vertical equations.** The kinematic equations apply to each direction separately. Don't put horizontal $v$ into a vertical equation.
- **Forgetting acceleration at the peak.** Velocity is zero; acceleration is still $g$.
- **Range formula misuse.** $R = v_0^2 \\sin(2\\theta)/g$ assumes launch and landing at the same height. If they differ, you have to do a full kinematic analysis.
- **Forgetting that $v_x$ is constant.** Many students try to "decompose" the velocity at every moment; only the initial $v_x$ matters because it doesn't change.
- **Sign errors with $\\theta$.** Make sure $\\theta$ is measured from the horizontal (the usual convention) rather than the vertical. Sine and cosine flip if you use the wrong reference.

**Why this matters beyond exams.** Projectile motion is the simplest non-trivial mechanics problem, and the techniques transfer everywhere — from understanding sports (a basketball player's shot, a quarterback's throw, a golfer's drive) to engineering (ballistics, water fountains, sprinklers) to space science (rocket trajectories, satellite launches before orbital effects kick in).`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE',
        title: 'Khan Academy — Projectile motion',
        provider: 'Khan Academy',
      },
    },
  ],
  keyConcepts: [
    'Position = vector relative to a reference point. Distance = scalar (path length). Displacement = vector (net change in position).',
    'Speed = scalar (magnitude). Velocity = vector (speed + direction).',
    'Acceleration is rate of change of velocity. Can mean speeding up, slowing down, or changing direction.',
    'Sign of acceleration $\\neq$ "slowing." $a < 0$ means $a$ points in $-x$ direction; whether that\'s slowing depends on velocity direction.',
    'Free-fall: $a = g \\approx 9.8$ m/s$^2$ downward, independent of mass in vacuum.',
    'Position-vs-time slope = velocity. Velocity-vs-time slope = acceleration. Velocity-vs-time area = displacement.',
    'Kinematic equations apply only when acceleration is constant.',
    'At peak of vertical throw: $v = 0$ but $a = -g$ (acceleration is still gravity).',
    '2D motion: horizontal and vertical components are independent.',
    'Projectile range $R = v_0^2 \\sin(2\\theta)/g$, max at $\\theta = 45°$ (level ground, no air).',
    'Symmetry of projectile trajectory: time up = time down (level launch).',
  ],
  formulas: [
    {
      name: 'Kinematic equations (constant $a$)',
      equation: '$v = v_0 + at$;  $x = x_0 + v_0 t + \\tfrac{1}{2}at^2$;  $v^2 = v_0^2 + 2a(x - x_0)$',
      meaning: 'Four equations relating $x$, $v$, $a$, $t$ when $a$ is constant. Pick the one missing the variable you don\'t care about.',
      example: 'Car accelerating from rest at 3 m/s$^2$ for 5 s: $x = \\frac{1}{2}(3)(25) = 37.5$ m.',
    },
    {
      name: 'Free-fall acceleration',
      equation: '$g \\approx 9.8$ m/s$^2$',
      meaning: 'Acceleration of any object in free fall near Earth, independent of mass. Always downward; sign depends on coordinate convention.',
      example: 'Object dropped from 20 m: time = $\\sqrt{40/9.8} \\approx 2.0$ s; landing speed = $9.8 \\cdot 2.0 = 19.6$ m/s.',
    },
    {
      name: 'Projectile range',
      equation: '$R = \\dfrac{v_0^2 \\sin(2\\theta)}{g}$',
      meaning: 'Horizontal distance traveled for level launch and landing. Max at $\\theta = 45°$.',
      example: 'Cannonball at 50 m/s at $30°$: $R = 2500 \\cdot \\sin 60° / 9.8 \\approx 221$ m.',
    },
    {
      name: 'Projectile max height',
      equation: '$h_{\\max} = \\dfrac{v_0^2 \\sin^2\\theta}{2g}$',
      meaning: 'Highest point of projectile launched at angle $\\theta$.',
      example: 'Launch at 50 m/s at 30°: $h_{\\max} = 2500 \\cdot 0.25 / 19.6 \\approx 31.9$ m.',
    },
    {
      name: 'Vector magnitude and angle',
      equation: '$|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$;  $\\tan\\theta = v_y / v_x$',
      meaning: 'Convert from x-y components to magnitude-direction form.',
      example: 'Velocity (3, 4): magnitude $= 5$, angle $= \\arctan(4/3) \\approx 53°$.',
    },
  ],
  practice: [
    {
      q: 'A ball is thrown straight up at 20 m/s. How high does it rise?',
      a: 'Use $v^2 = v_0^2 + 2a\\Delta y$ with $v = 0$ at peak, $a = -9.8$. $0 = 400 + 2(-9.8)\\Delta y \\implies \\Delta y = 400/19.6 \\approx 20.4$ m.',
    },
    {
      q: 'A projectile is launched horizontally at 10 m/s from a height of 5 m. How far horizontally does it travel before landing?',
      a: 'Fall time: $5 = \\frac{1}{2}(9.8)t^2 \\implies t = 1.01$ s. Horizontal range: $R = 10 \\cdot 1.01 \\approx 10.1$ m.',
    },
    {
      q: 'A car accelerates from 5 m/s to 25 m/s in 4 s. Find its acceleration and the distance traveled.',
      a: 'Acceleration: $a = (25 - 5)/4 = 5$ m/s$^2$. Distance: $x = 5(4) + \\frac{1}{2}(5)(16) = 20 + 40 = 60$ m. Check: average velocity $= (5+25)/2 = 15$ m/s, $\\times 4 = 60$ m. ✓',
    },
    {
      q: 'At the peak of a thrown-up object\'s trajectory, what are the velocity and acceleration?',
      a: 'Velocity is zero (instantaneously). Acceleration is $g$ downward (unchanged from before; gravity acts the whole time). Many students mistakenly think acceleration is also zero at the peak — wrong.',
    },
    {
      q: 'A cannonball is fired at 60 m/s at $45°$. Find the range and time of flight.',
      a: 'Range: $R = v_0^2 \\sin(2\\theta)/g = 3600 \\cdot \\sin(90°)/9.8 \\approx 367$ m. Time of flight: $t = 2 v_0 \\sin\\theta / g = 2 \\cdot 60 \\cdot \\sin 45° / 9.8 \\approx 8.66$ s.',
    },
    {
      q: 'An object moving in the $+x$ direction has $a = -2$ m/s$^2$. Is it speeding up or slowing down?',
      a: 'Slowing down. Acceleration and velocity are in opposite directions ($v > 0$, $a < 0$), so the magnitude of velocity decreases over time. If the velocity were in the $-x$ direction instead, the object would be speeding up.',
    },
  ],
  pitfalls: [
    '"Acceleration is zero at the peak of a vertical throw" — wrong. Velocity is zero; acceleration is still $g$ downward.',
    '"Heavier objects fall faster" — wrong, in vacuum. In air, light objects with large surface area (paper, feathers) fall slower because of air resistance, but the law of falling-bodies says equal acceleration in vacuum.',
    '"Negative acceleration means slowing down" — not always. It means $a$ points in $-x$. Whether that\'s slowing depends on velocity direction.',
    '"Range formula $R = v_0^2 \\sin(2\\theta)/g$ works for any launch" — only for level launch and landing. Different heights require full kinematics.',
    '"You can add vectors by adding magnitudes" — wrong. Add component by component, then recover magnitude.',
    '"Average speed = (initial + final)/2" — wrong. That\'s the average of two specific speeds, not the average over the whole interval. Average speed = total distance / total time.',
    '"$v_x$ changes during projectile motion" — wrong, without air resistance. Horizontal velocity is constant; only vertical changes.',
    '"Kinematic equations work for any acceleration" — wrong. They require *constant* $a$. Non-constant acceleration needs different methods.',
  ],
};
