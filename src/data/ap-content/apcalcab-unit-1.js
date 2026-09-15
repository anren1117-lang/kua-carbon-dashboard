// AP Calculus AB Unit 1 — Limits and Continuity (10-12%)
// APES-standard depth. Math typeset with LaTeX via $...$ delimiters.

export const APCALCAB_UNIT_1 = {
  number: 1,
  title: 'Limits and Continuity',
  weight: '10-12%',
  subunits: [
    {
      code: '1.1',
      title: 'Introducing calculus — change at an instant',
      content:
`Calculus answers questions that classical algebra cannot. Algebra can tell you the average speed of a car over a journey: total distance divided by total time. Algebra cannot tell you the car's speed *at the exact moment* you glanced at the speedometer, because "exact moment" is a duration of zero seconds, and dividing zero distance by zero seconds is meaningless. Calculus solves this by giving a precise meaning to the question "what is happening at an instant?" — and, dually, by giving a precise meaning to "what is the total of a quantity that's changing continuously?"

**The two central ideas.**

- **Derivative.** The instantaneous rate of change of one quantity with respect to another. Geometrically, the slope of the tangent line to a curve at a point. Physically, the speed of a moving object at a single moment, the rate of population growth at a single instant, the marginal cost of producing one more unit, the slope of a hillside under your foot.
- **Integral.** The accumulated total of a continuously changing quantity. Geometrically, the (signed) area under a curve. Physically, the total distance traveled given a varying speed, the total water that has flowed past a point given a varying flow rate, the total work done by a varying force, the total revenue earned given varying sales.

These two ideas appear at first to be different problems. The shocking truth — the cornerstone of all calculus — is that **they are inverses of each other**. Differentiating an accumulated total gives back the rate. Integrating a rate gives back the accumulated total. This is the **Fundamental Theorem of Calculus**, which you'll meet in Unit 6.

**Why this matters across every quantitative field.**

- **Physics.** Newton's laws are differential equations: $F = ma$ relates force to the second derivative of position. Almost every physical law (electromagnetism, fluid flow, heat transfer, quantum mechanics, general relativity) is expressed as a differential equation.
- **Engineering.** Bridge design, chip design, control systems, optimization problems — all calculus from the ground up.
- **Biology and medicine.** Population dynamics, drug pharmacokinetics, enzyme kinetics, ecological models.
- **Economics.** Marginal analysis (derivatives), optimization of profit and utility, time-value of money (integrals).
- **Statistics and machine learning.** Probability density functions are integrated; gradient descent is the workhorse algorithm for training neural networks; it works by following derivatives downhill.
- **Computer graphics.** Smooth curves, lighting calculations, physics simulations — all calculus.

If you only ever learn one branch of advanced mathematics, calculus is the one with the broadest practical reach.

**Newton and Leibniz.** Both invented calculus independently in the late 1600s. Newton was motivated by physics — specifically by problems of motion and gravity. His version was called the **method of fluxions** (fluxions are derivatives; fluents are integrals); his notation used dots over letters ($\\dot{x}$ for derivative). Leibniz approached the subject from a more philosophical angle and developed the notation we still use today: $dy/dx$ for the derivative and $\\int$ for the integral.

A bitter priority dispute followed; the two camps accused each other of plagiarism for decades. We now know they reached the same ideas independently, by slightly different routes. Modern calculus uses Leibniz's notation almost exclusively because it's so much cleaner — the symbols suggest the right intuition, and the chain rule almost writes itself when you read $\\dfrac{dy}{dx} = \\dfrac{dy}{du} \\cdot \\dfrac{du}{dx}$ as a literal fraction-cancellation (it's not quite that, but the notation makes the right answer feel obvious).

**Limits are the foundation.** Both derivatives and integrals are defined using **limits** — the precise mathematical machinery that turns "approaching a value without quite reaching it" into rigorous statements. Without limits, the early formulations of calculus had logical problems that bothered mathematicians and philosophers for over a century. Bishop Berkeley famously mocked the "infinitely small quantities" of Newton-Leibniz calculus, calling them "the ghosts of departed quantities."

The modern rigorous foundation was built by Cauchy and Weierstrass in the 1800s. They replaced the slippery "infinitely small" language with the **$\\varepsilon$-$\\delta$ definition** of a limit: for every $\\varepsilon > 0$, there exists a $\\delta > 0$, etc. (You won't be asked to prove things this way on the AP exam, but knowing this is where the precision comes from is part of calculus literacy.)

**The pedagogical order matters.** This unit deliberately starts with limits, not derivatives. Once you understand limits, derivatives ($f'(a) = \\lim_{h \\to 0} \\dfrac{f(a+h) - f(a)}{h}$) are just one specific limit, and integrals ($\\int_a^b f(x)\\,dx = \\lim$ of Riemann sums) are just another specific kind of limit. Skip the foundation, and the rest of the course feels like memorized recipes.

**Three intuitive examples to anchor what's coming.**

1. **Speed of a falling object.** A rock drops; its height is $h(t) = 100 - 5t^2$ meters (after $t$ seconds, in a region where gravitational acceleration is $\\sim 10\\,m/s^2$). What's its speed at exactly $t = 1$ second? Average speed from $t = 1$ to $t = 1.1$: change in height divided by change in time, $\\approx (100 - 5 \\cdot 1.21) - (100 - 5) = -1.05$, divided by $0.1$ = $-10.5$ m/s. Average from $t = 1$ to $t = 1.01$: about $-10.05$ m/s. From $t = 1$ to $t = 1.001$: about $-10.005$ m/s. The numbers are approaching $-10$ m/s. That's the **derivative**, the instantaneous speed at $t = 1$.
2. **Total water that flowed past a point.** A river's flow rate varies through the day, peaking at noon and ebbing at midnight. How much water flowed past a measuring station in 24 hours? Multiply flow rate by short time intervals, add them all up; the limit, as intervals shrink, is the **integral** of flow rate over 24 hours.
3. **Area under a curve.** What's the area between the curve $y = x^2$ and the x-axis, from $x = 0$ to $x = 1$? Slice the region into thin vertical rectangles, sum their areas, take the limit as slices get thinner. The limit is the integral $\\int_0^1 x^2\\,dx = 1/3$.

The same limit-taking idea unifies all of these problems. That's why we start here.`,
      video: {
        url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
        title: '3Blue1Brown — Essence of calculus, chapter 1',
        provider: '3Blue1Brown',
      },
    },
    {
      code: '1.2',
      title: 'Defining limits and limit notation',
      content:
`A **limit** is the value that a function approaches as the input approaches a particular value. The notation:

$$\\lim_{x \\to a} f(x) \\,=\\, L$$

reads "the limit of $f(x)$ as $x$ approaches $a$ is $L$." It says: as $x$ gets arbitrarily close to $a$ (without necessarily equaling $a$), the values of $f(x)$ get arbitrarily close to $L$.

**The crucial subtlety.** Limits are about behavior **near** $x = a$, not behavior **at** $x = a$. The function might not even be defined at $x = a$, and yet the limit can still exist. This separates limits from simple function evaluation and is what makes them powerful.

**Worked example — a function with a hole.** Let $f(x) = \\dfrac{x^2 - 1}{x - 1}$.

At $x = 1$, the function gives $0/0$ — undefined. We can't just plug in. But we can compute $f(x)$ for $x$ values near (but not equal to) $1$:

| $x$ | $f(x)$ |
|-----|--------|
| 0.99 | 1.99 |
| 0.999 | 1.999 |
| 0.9999 | 1.9999 |
| 1.0001 | 2.0001 |
| 1.001 | 2.001 |
| 1.01 | 2.01 |

The values are getting closer and closer to $2$. So $\\lim_{x \\to 1} f(x) = 2$.

Algebraically, we can confirm: $\\dfrac{x^2 - 1}{x - 1} = \\dfrac{(x-1)(x+1)}{x-1} = x + 1$ (for $x \\neq 1$). The graph of $f$ is the line $y = x + 1$ with a single point removed at $(1, 2)$. The limit as $x \\to 1$ is $2$, even though $f(1)$ is undefined.

**The hole is invisible to the limit.** What happens *at* $x = a$ is irrelevant. What matters is the trend as we approach.

**One-sided limits.** Sometimes the function behaves differently on the two sides of $a$. We can specify the direction of approach:

- **Left-hand limit**: $\\lim_{x \\to a^-} f(x)$ — limit as $x$ approaches $a$ from values less than $a$ (the negative side).
- **Right-hand limit**: $\\lim_{x \\to a^+} f(x)$ — limit as $x$ approaches $a$ from values greater than $a$.

**Two-sided limits and the existence condition.** The two-sided limit $\\lim_{x \\to a} f(x)$ **exists if and only if** both one-sided limits exist *and* are equal:

$$\\lim_{x \\to a} f(x) \\,=\\, L \\quad\\Longleftrightarrow\\quad \\lim_{x \\to a^-} f(x) \\,=\\, \\lim_{x \\to a^+} f(x) \\,=\\, L.$$

If the one-sided limits exist but differ, the two-sided limit does **not** exist. This is a classic AP exam tripwire.

**Example — a step function.** Let $f(x) = \\begin{cases} 1 & x < 0 \\\\ 2 & x \\geq 0 \\end{cases}$.

- $\\lim_{x \\to 0^-} f(x) = 1$.
- $\\lim_{x \\to 0^+} f(x) = 2$.
- $\\lim_{x \\to 0} f(x)$ does not exist (one-sided limits differ).
- $f(0) = 2$, but this is irrelevant to whether the limit exists.

**Limits at infinity.** We can also ask what happens as $x$ grows without bound:

$$\\lim_{x \\to \\infty} f(x) \\,=\\, L$$

means: as $x$ gets arbitrarily large, $f(x)$ approaches $L$. Geometrically, $L$ is a horizontal asymptote.

Similarly $\\lim_{x \\to -\\infty} f(x)$ describes behavior as $x$ goes to negative infinity.

Examples:

- $\\lim_{x \\to \\infty} \\dfrac{1}{x} = 0$. As $x$ grows, $1/x$ shrinks toward zero.
- $\\lim_{x \\to \\infty} e^{-x} = 0$. Exponential decay drives the function to zero.
- $\\lim_{x \\to \\infty} \\arctan(x) = \\dfrac{\\pi}{2}$. Arctangent approaches $\\pi/2$ from below.

**The formal $\\varepsilon$-$\\delta$ definition (background, not required for AP).** A limit $\\lim_{x \\to a} f(x) = L$ means: for every $\\varepsilon > 0$, there exists a $\\delta > 0$ such that whenever $0 < |x - a| < \\delta$, we have $|f(x) - L| < \\varepsilon$.

Translation: no matter how strict an accuracy requirement you set ($\\varepsilon$), I can find a closeness requirement ($\\delta$) such that staying within $\\delta$ of $a$ guarantees being within $\\varepsilon$ of $L$. This is the rigorous foundation. AP Calc AB doesn't ask you to use it directly, but it justifies all the rest.

**Notation pitfalls.**

- $\\lim_{x \\to a} f(x)$ is a number (or DNE / $\\pm\\infty$), not a function. Writing $\\lim_{x \\to a} f(x) = f(a)$ is meaningful only if $f$ is continuous at $a$.
- $\\lim$ refers to the act of taking a limit; it's a verb. The output ($L$) is the answer.
- The argument under the lim — $x \\to a$ — specifies what's approaching what. If you switch to a different variable, $\\lim_{h \\to 0} f(a + h)$ is mathematically equivalent to $\\lim_{x \\to a} f(x)$. The variable inside the limit is just a name.

**Why limits are everywhere.** Almost every concept in calculus is defined via a limit:

- Derivative: $f'(a) = \\lim_{h \\to 0} \\dfrac{f(a + h) - f(a)}{h}$.
- Definite integral: $\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i^*)\\,\\Delta x$ (limit of Riemann sums).
- Continuity: $f$ continuous at $a$ if $\\lim_{x \\to a} f(x) = f(a)$.
- Convergence of an infinite series: $\\sum_{n=1}^{\\infty} a_n = \\lim_{N \\to \\infty} \\sum_{n=1}^{N} a_n$ (if the limit exists).

Mastering limits is mastering the language calculus is written in.`,
      video: {
        url: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
        title: '3Blue1Brown — Limits, L\'Hôpital\'s rule, and epsilon delta',
        provider: '3Blue1Brown',
      },
    },
    {
      code: '1.3',
      title: 'Estimating limits — graphs and tables',
      content:
`Before you can compute limits algebraically, you should be able to read them off a graph or estimate them from a table. This subunit builds the intuition that every other limit technique rests on.

**Estimating from a graph.** Trace the curve from both sides of $x = a$.

- If both sides approach the same height $L$, that's the limit.
- If the two sides approach different heights, the two-sided limit does not exist (but the one-sided limits may).
- If either side grows without bound, the limit is $\\pm\\infty$ (we describe behavior; the limit doesn't strictly "exist" as a real number).
- If the function oscillates wildly without settling, the limit does not exist.

The function's actual value at $x = a$ — whether the point is a solid dot, an open circle, or absent — does **not** matter for the limit. Limits are about the approach, not the destination.

**Estimating from a table.** Compute $f(x)$ for $x$ values that get progressively closer to $a$, from both sides. Look for a pattern.

**Worked example.** $f(x) = \\dfrac{\\sin x}{x}$. At $x = 0$, $f$ is undefined ($0/0$). Compute (with $x$ in radians):

| $x$ | $f(x)$ |
|-----|--------|
| $-0.1$ | $0.99833$ |
| $-0.01$ | $0.99998$ |
| $-0.001$ | $0.9999998$ |
| $0.001$ | $0.9999998$ |
| $0.01$ | $0.99998$ |
| $0.1$ | $0.99833$ |

The values converge to $1$ from both sides. So $\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$.

This is one of the most important limits in calculus. It's used to derive the derivative of sine and most other trig calculations.

**Limits that don't exist — three patterns to recognize.**

**Pattern 1: One-sided limits differ (jump discontinuity).**

The greatest-integer function (floor function), $f(x) = \\lfloor x \\rfloor$, gives the largest integer $\\leq x$. At $x = 2$:

- $\\lim_{x \\to 2^-} \\lfloor x \\rfloor = 1$ (values just below 2 round down to 1).
- $\\lim_{x \\to 2^+} \\lfloor x \\rfloor = 2$ (values just above 2 round down to 2).

The two-sided limit does not exist.

**Pattern 2: Function oscillates without settling.**

$\\lim_{x \\to 0} \\sin\\left(\\dfrac{1}{x}\\right)$ does not exist. As $x \\to 0$, $1/x \\to \\pm\\infty$; $\\sin(1/x)$ oscillates between $-1$ and $+1$ infinitely many times in any neighborhood of $0$. There is no single value being approached.

**Pattern 3: Function grows without bound (infinite limit).**

$\\lim_{x \\to 0^+} \\dfrac{1}{x} = +\\infty$. The function grows arbitrarily large as $x \\to 0$ from the right.

Strictly speaking, the limit does not exist as a finite real number — we use the symbol $\\infty$ to describe the behavior. The function has a **vertical asymptote** at $x = 0$.

**Notation for infinite limits.** Even though the limit "doesn't exist" in the strict sense, we still write:

- $\\lim_{x \\to 0^+} \\dfrac{1}{x} = +\\infty$
- $\\lim_{x \\to 0^-} \\dfrac{1}{x} = -\\infty$

This is a description of how the function blows up. The AP exam expects you to use this notation precisely.

**Common functions and their key limits.**

- $\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$.
- $\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x} = 0$.
- $\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2} = \\dfrac{1}{2}$.
- $\\lim_{x \\to \\infty} \\dfrac{1}{x} = 0$.
- $\\lim_{x \\to \\infty} \\dfrac{1}{x^n} = 0$ for any $n > 0$.
- $\\lim_{x \\to \\infty} e^{-x} = 0$.
- $\\lim_{x \\to \\infty} \\ln x / x = 0$ (logs grow slower than any power).
- $\\lim_{x \\to \\infty} \\arctan x = \\pi/2$.
- $\\lim_{x \\to 0^+} \\ln x = -\\infty$.

**The "estimation" approach has limits.** Tables can mislead. For example, $f(x) = \\sin(\\pi/x)$ at $x = 0$: if you happen to sample at $x = 1, 1/2, 1/3, \\ldots$, you get $f = 0$ every time and might conclude the limit is $0$. But it's not — $f$ oscillates rapidly, and the limit doesn't exist. Tables are a useful start; they're not a proof.

**Why graphs and tables matter.** Numerical and graphical methods build intuition. They tell you what answer you should expect before you do algebraic work. They also let you check your algebra: if your algebraic limit calculation gives $5$ but a quick table check shows the function approaching $3$, you've made an algebra mistake somewhere.

**Common AP exam questions.**

- Given a graph with various features (holes, jumps, asymptotes), identify limits and one-sided limits.
- Given a table of values, estimate a limit and justify your answer.
- Distinguish "limit does not exist" from "limit equals infinity" from "function not defined."`,
      video: {
        url: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
        title: '3Blue1Brown — Limits visualized',
        provider: '3Blue1Brown',
      },
    },
    {
      code: '1.4',
      title: 'Algebraic properties of limits',
      content:
`Once you understand what a limit is, you need efficient ways to compute them without doing tables every time. The **limit laws** let you break a complicated limit into simpler pieces. The key fact: limits play nicely with arithmetic.

**The limit laws.** Suppose $\\lim_{x \\to a} f(x) = L$ and $\\lim_{x \\to a} g(x) = M$ (both finite limits exist). Then:

- **Sum**: $\\lim_{x \\to a} [f(x) + g(x)] = L + M$
- **Difference**: $\\lim_{x \\to a} [f(x) - g(x)] = L - M$
- **Constant multiple**: $\\lim_{x \\to a} [c \\cdot f(x)] = c \\cdot L$ for any constant $c$
- **Product**: $\\lim_{x \\to a} [f(x) \\cdot g(x)] = L \\cdot M$
- **Quotient**: $\\lim_{x \\to a} \\dfrac{f(x)}{g(x)} = \\dfrac{L}{M}$, provided $M \\neq 0$
- **Power**: $\\lim_{x \\to a} [f(x)]^n = L^n$ (for positive integer $n$; for fractional $n$, need $L \\geq 0$)
- **Root**: $\\lim_{x \\to a} \\sqrt[n]{f(x)} = \\sqrt[n]{L}$ (need $L > 0$ for even $n$)

In plain English: you can take a limit of a sum by summing the limits, take the limit of a product by multiplying the limits, etc. The proofs use the $\\varepsilon$-$\\delta$ definition and are skipped in AP.

**Direct substitution — when it works.** For any function built from polynomials, rational expressions (with non-zero denominators), exponentials, logarithms (in their domains), trig functions (in their domains), and roots, you can compute $\\lim_{x \\to a} f(x)$ by simply plugging in $x = a$. This is the **direct substitution theorem**.

Examples that work by direct substitution:

- $\\lim_{x \\to 2} (x^2 + 3x - 1) = 4 + 6 - 1 = 9$. (Polynomial.)
- $\\lim_{x \\to 1} \\dfrac{x + 2}{x^2 + 5} = \\dfrac{3}{6} = \\dfrac{1}{2}$. (Rational, denominator $\\neq 0$ at $x=1$.)
- $\\lim_{x \\to 0} e^x = 1$. (Exponential is continuous everywhere.)
- $\\lim_{x \\to \\pi/2} \\sin x = 1$. (Sine is continuous everywhere.)
- $\\lim_{x \\to 4} \\sqrt{x + 5} = \\sqrt{9} = 3$. (Root is continuous on its domain.)

**The indeterminate form $0/0$.** Direct substitution fails when both the numerator and denominator go to zero — you get $0/0$, which is not a number but a flag that more work is needed. The limit might be anything. You have to do algebra first to simplify.

**Three main techniques for $0/0$.**

**Technique 1: Factor and cancel.** Look for common factors.

$\\lim_{x \\to 2} \\dfrac{x^2 - 4}{x - 2}$. Direct substitution gives $0/0$. Factor the numerator: $x^2 - 4 = (x-2)(x+2)$. Cancel the common $(x-2)$ factor (legal because we're taking $x \\to 2$, $x \\neq 2$): $\\dfrac{(x-2)(x+2)}{x-2} = x + 2$. Now plug in: $\\lim_{x \\to 2} (x+2) = 4$.

**Technique 2: Rationalize.** For limits with square roots.

$\\lim_{x \\to 0} \\dfrac{\\sqrt{x+1} - 1}{x}$. Direct sub gives $0/0$. Multiply top and bottom by the conjugate $(\\sqrt{x+1} + 1)$:

$$\\dfrac{(\\sqrt{x+1} - 1)(\\sqrt{x+1} + 1)}{x(\\sqrt{x+1} + 1)} \\,=\\, \\dfrac{(x+1) - 1}{x(\\sqrt{x+1} + 1)} \\,=\\, \\dfrac{x}{x(\\sqrt{x+1} + 1)} \\,=\\, \\dfrac{1}{\\sqrt{x+1} + 1}.$$

Now plug in: $\\dfrac{1}{\\sqrt{1} + 1} = \\dfrac{1}{2}$.

**Technique 3: Common denominators for complex fractions.**

$\\lim_{x \\to 0} \\dfrac{\\dfrac{1}{x+2} - \\dfrac{1}{2}}{x}$. Direct sub: $0/0$. Combine the numerator: $\\dfrac{1}{x+2} - \\dfrac{1}{2} = \\dfrac{2 - (x+2)}{2(x+2)} = \\dfrac{-x}{2(x+2)}$. So the expression becomes $\\dfrac{-x}{2(x+2) \\cdot x} = \\dfrac{-1}{2(x+2)}$. Plug in: $\\dfrac{-1}{4}$.

**The other indeterminate forms.** Besides $0/0$, you'll meet:

- $\\dfrac{\\infty}{\\infty}$ — usually handled by dividing top and bottom by the highest power of $x$.
- $0 \\cdot \\infty$ — rewrite as $0/0$ or $\\infty/\\infty$ by moving one factor to the denominator.
- $\\infty - \\infty$ — combine into a single fraction.
- $0^0$, $1^\\infty$, $\\infty^0$ — usually handled by taking $\\ln$ first.

All of these can be tackled in BC with **L'Hôpital's rule**: for $0/0$ or $\\infty/\\infty$ forms, $\\lim \\dfrac{f(x)}{g(x)} = \\lim \\dfrac{f'(x)}{g'(x)}$ (provided the second limit exists). The AB course doesn't use L'Hôpital, so AB students have to use factoring, rationalization, and other algebraic manipulations.

**A common AP mistake: pretending you got $0/0$ when you got a real value.** Always plug in *first* to see whether direct substitution gives an indeterminate form. If it gives a real number, you're done — no need to factor or rationalize. If it gives $0/0$, then you need algebra.

**Another mistake: thinking $1/0$ is indeterminate.** It's not. $1/0$ (where numerator is nonzero and denominator $\\to 0$) gives an infinite limit; the function has a vertical asymptote. The sign depends on which side you approach from.

**Worked example combining several techniques.**

$\\lim_{x \\to 3} \\dfrac{x^2 - x - 6}{x^2 - 9}$.

Direct sub: $\\dfrac{9 - 3 - 6}{9 - 9} = \\dfrac{0}{0}$. Factor: $x^2 - x - 6 = (x-3)(x+2)$; $x^2 - 9 = (x-3)(x+3)$. Cancel: $\\dfrac{x+2}{x+3}$. Plug in: $\\dfrac{5}{6}$.

**Another worked example.**

$\\lim_{x \\to 0} \\dfrac{\\sqrt{4 + x} - 2}{x}$.

Direct sub: $0/0$. Rationalize:

$$\\dfrac{(\\sqrt{4+x} - 2)(\\sqrt{4+x} + 2)}{x(\\sqrt{4+x} + 2)} \\,=\\, \\dfrac{4 + x - 4}{x(\\sqrt{4+x} + 2)} \\,=\\, \\dfrac{1}{\\sqrt{4+x} + 2}.$$

Plug in: $\\dfrac{1}{4}$.

**The big picture.** Limit laws plus direct substitution handle most limits immediately. Whenever direct substitution gives an indeterminate form, you need a clever algebraic move to simplify before substituting. The three main moves — factor, rationalize, combine fractions — handle the vast majority of AP Calc AB limits.`,
      video: {
        url: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
        title: '3Blue1Brown — Computing limits',
        provider: '3Blue1Brown',
      },
    },
    {
      code: '1.5',
      title: 'Algebraic manipulation for hard limits',
      content:
`Some limits resist the basic techniques (factoring, rationalizing, combining fractions). For these, you need more specialized tools: known trig limits, the squeeze theorem, and clever rewriting.

**The three essential trig limits to memorize.**

$$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$$

$$\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x} = 0$$

$$\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{x^2} = \\dfrac{1}{2}$$

These three appear constantly. The first is the most important — it's the basis for the derivative of $\\sin x$ and many other results. The second falls out of the first by multiplying by the conjugate. The third tells you the leading behavior of $1 - \\cos x$ near zero.

**Why $\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$.** The geometric proof: consider a sector of a unit circle of angle $x$ (in radians). The arc length is $x$, the chord is $2\\sin(x/2) \\approx \\sin x$ for small $x$. As the angle shrinks, the chord and arc become indistinguishable; the ratio approaches 1.

The squeeze argument: for small positive $x$, you can bound $\\sin x \\leq x \\leq \\tan x$. Dividing by $\\sin x$: $1 \\leq \\dfrac{x}{\\sin x} \\leq \\dfrac{1}{\\cos x}$. The right side approaches 1 as $x \\to 0$ (cosine approaches 1), so the middle term is squeezed to 1, so $\\sin x / x \\to 1$.

**Using the trig limits — scaling tricks.**

$\\lim_{x \\to 0} \\dfrac{\\sin(3x)}{x}$. Rewrite: $\\dfrac{\\sin(3x)}{x} = 3 \\cdot \\dfrac{\\sin(3x)}{3x}$. Let $u = 3x$; as $x \\to 0$, $u \\to 0$. So $\\lim = 3 \\cdot \\lim_{u \\to 0} \\dfrac{\\sin u}{u} = 3 \\cdot 1 = 3$.

$\\lim_{x \\to 0} \\dfrac{\\sin(5x)}{\\sin(2x)}$. Rewrite: $\\dfrac{\\sin(5x)}{\\sin(2x)} = \\dfrac{\\sin(5x)/(5x) \\cdot 5x}{\\sin(2x)/(2x) \\cdot 2x} = \\dfrac{5}{2} \\cdot \\dfrac{\\sin(5x)/(5x)}{\\sin(2x)/(2x)}$. Both Sub-limits go to 1; answer = $5/2$.

$\\lim_{x \\to 0} \\dfrac{\\tan x}{x}$. Recall $\\tan x = \\sin x / \\cos x$. So $\\dfrac{\\tan x}{x} = \\dfrac{\\sin x}{x} \\cdot \\dfrac{1}{\\cos x} \\to 1 \\cdot 1 = 1$.

**Rationalizing — the harder cases.** Sometimes a single rationalization isn't enough.

$\\lim_{x \\to 0} \\dfrac{\\sqrt{x + 1} - \\sqrt{1 - x}}{x}$. Direct sub: $0/0$. Rationalize:

$$\\dfrac{(\\sqrt{x+1} - \\sqrt{1-x})(\\sqrt{x+1} + \\sqrt{1-x})}{x(\\sqrt{x+1} + \\sqrt{1-x})} \\,=\\, \\dfrac{(x+1) - (1-x)}{x(\\sqrt{x+1} + \\sqrt{1-x})} \\,=\\, \\dfrac{2x}{x(\\sqrt{x+1} + \\sqrt{1-x})}$$

Cancel $x$: $\\dfrac{2}{\\sqrt{x+1} + \\sqrt{1-x}}$. Plug in $x = 0$: $\\dfrac{2}{1 + 1} = 1$.

**The squeeze theorem (sandwich theorem).** Suppose $g(x) \\leq f(x) \\leq h(x)$ for all $x$ near $a$ (except possibly $a$ itself), and $\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$. Then $\\lim_{x \\to a} f(x) = L$.

In plain English: if you can sandwich a hard function between two easy functions that converge to the same limit, the hard function also converges to that limit. Useful when the function oscillates or is otherwise unfriendly.

**Classic squeeze example.** $\\lim_{x \\to 0} x^2 \\sin\\left(\\dfrac{1}{x}\\right)$.

The function $\\sin(1/x)$ oscillates wildly as $x \\to 0$. But we know $-1 \\leq \\sin(1/x) \\leq 1$ for all $x \\neq 0$. Multiplying by $x^2$ (which is nonnegative):

$$-x^2 \\leq x^2 \\sin\\left(\\dfrac{1}{x}\\right) \\leq x^2.$$

Both bounds approach $0$ as $x \\to 0$. By the squeeze theorem, the limit of the middle is $0$.

Compare with $\\lim_{x \\to 0} \\sin(1/x)$, which has no limit — the $x^2$ factor is essential. It dampens the oscillation enough to drive the limit to zero.

**Another squeeze example.** Show $\\lim_{x \\to 0} x \\cdot \\cos\\left(\\dfrac{1}{x}\\right) = 0$.

$-|x| \\leq x \\cos(1/x) \\leq |x|$. Both bounds $\\to 0$. So the middle $\\to 0$.

**Trig identities as a tool.** Sometimes rewriting using identities reveals a known limit.

$\\lim_{x \\to 0} \\dfrac{1 - \\cos x}{\\sin^2 x}$. Use $\\sin^2 x = 1 - \\cos^2 x = (1-\\cos x)(1 + \\cos x)$:

$$\\dfrac{1 - \\cos x}{\\sin^2 x} \\,=\\, \\dfrac{1 - \\cos x}{(1 - \\cos x)(1 + \\cos x)} \\,=\\, \\dfrac{1}{1 + \\cos x}.$$

Plug in: $\\dfrac{1}{2}$.

**Limits at infinity for rational functions.** Compare leading-term degrees.

$\\lim_{x \\to \\infty} \\dfrac{3x^2 + 5}{2x^2 - x}$. Divide top and bottom by the highest power ($x^2$): $\\dfrac{3 + 5/x^2}{2 - 1/x}$. As $x \\to \\infty$, the $1/x$ and $1/x^2$ terms go to $0$. Limit = $3/2$.

The shortcut: if numerator and denominator have the same degree, the limit at infinity is the ratio of leading coefficients.

$\\lim_{x \\to \\infty} \\dfrac{x^2}{x^3 + 1} = 0$. Denominator grows faster.

$\\lim_{x \\to \\infty} \\dfrac{x^3 + 1}{x^2} = \\infty$. Numerator grows faster; no horizontal asymptote.

**Common errors to avoid.**

- Forgetting that the trig limits use radians, not degrees. $\\lim_{x \\to 0} \\sin x / x = 1$ only if $x$ is in radians; in degrees, the limit is $\\pi/180$.
- Using $\\sin x / x \\to 1$ outside the context of $x \\to 0$. For $x \\to 5$, $\\sin x / x \\to \\sin(5)/5$.
- Trying to factor or rationalize when direct substitution would have just worked.
- Misapplying the squeeze theorem — the bounds have to be tight to the function in a neighborhood of the limit point.`,
      video: {
        url: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
        title: '3Blue1Brown — Squeeze theorem',
        provider: '3Blue1Brown',
      },
    },
    {
      code: '1.6',
      title: 'Limits at infinity and asymptotes',
      content:
`A function's behavior as $x \\to \\pm \\infty$ tells you about its long-range trend — the **end behavior**. Sometimes the function approaches a finite value (a horizontal asymptote); sometimes it grows without bound; sometimes it approaches a line (a slant asymptote). Understanding all three cases gives you a complete picture of a function's shape.

**Limits at infinity for rational functions.** The general principle: compare degrees of the numerator and denominator polynomials.

Let $f(x) = \\dfrac{P(x)}{Q(x)}$, where $P$ has degree $m$ and $Q$ has degree $n$.

- **If $m < n$**: $\\lim_{x \\to \\pm\\infty} f(x) = 0$. Horizontal asymptote at $y = 0$.
- **If $m = n$**: $\\lim_{x \\to \\pm\\infty} f(x) = \\dfrac{\\text{leading coefficient of } P}{\\text{leading coefficient of } Q}$. Horizontal asymptote at that ratio.
- **If $m > n$**: $\\lim_{x \\to \\pm\\infty} f(x) = \\pm\\infty$. No horizontal asymptote.

**Worked examples.**

- $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 2}{x^2 + 5} = 3$. Both degree 2; ratio of leading coefficients $3/1$. Horizontal asymptote $y = 3$.
- $\\lim_{x \\to \\infty} \\dfrac{2x}{x^2 + 1} = 0$. Numerator degree 1, denominator degree 2. Horizontal asymptote $y = 0$.
- $\\lim_{x \\to \\infty} \\dfrac{x^3}{x^2 + 1} = \\infty$. Numerator degree 3 > denominator degree 2.

**The technique behind the rule.** Divide numerator and denominator by the highest power of $x$ in the denominator. Lower-order terms become $1/x$, $1/x^2$, etc., which go to 0.

$\\lim_{x \\to \\infty} \\dfrac{2x^2 - 3x + 1}{5x^2 + 4}$. Divide top and bottom by $x^2$:

$$\\dfrac{2 - 3/x + 1/x^2}{5 + 4/x^2}.$$

As $x \\to \\infty$: $\\dfrac{2 - 0 + 0}{5 + 0} = \\dfrac{2}{5}$.

**Limits at $-\\infty$.** Same rules apply, but with attention to signs. For odd-degree leading terms, the sign flips.

$\\lim_{x \\to -\\infty} \\dfrac{2x^3}{x^2 + 1} = -\\infty$. The cubic grows in the negative direction.

$\\lim_{x \\to -\\infty} \\dfrac{x}{x^2 + 1} = 0$. Same as at $+\\infty$ — denominator wins.

**Functions with radicals.** Be careful — the square root of a polynomial doesn't simply have integer degree.

$\\lim_{x \\to \\infty} \\dfrac{\\sqrt{x^2 + 1}}{x}$. For large $x$, $\\sqrt{x^2 + 1} \\approx \\sqrt{x^2} = x$. So the limit is $\\approx x/x = 1$.

More carefully: $\\dfrac{\\sqrt{x^2 + 1}}{x} = \\sqrt{1 + 1/x^2} \\to \\sqrt{1} = 1$ as $x \\to \\infty$.

Watch out for $x \\to -\\infty$. For negative $x$, $\\sqrt{x^2} = |x| = -x$. So:

$\\lim_{x \\to -\\infty} \\dfrac{\\sqrt{x^2 + 1}}{x} = \\lim_{x \\to -\\infty} \\dfrac{-x \\sqrt{1 + 1/x^2}}{x} = -1$.

Sign matters. The function approaches $1$ on the right and $-1$ on the left — two different horizontal asymptotes.

**Vertical asymptotes.** $f$ has a vertical asymptote at $x = a$ if $\\lim_{x \\to a^+} f(x) = \\pm\\infty$ or $\\lim_{x \\to a^-} f(x) = \\pm\\infty$.

For rational functions, vertical asymptotes typically occur where the denominator equals zero and the numerator does not.

**Worked example.** $f(x) = \\dfrac{x + 1}{(x-2)(x+3)}$. Vertical asymptotes at $x = 2$ and $x = -3$. Behavior near each:

- Near $x = 2$: $f \\to \\dfrac{3}{(0^{\\pm})(5)} = \\pm\\infty$. Sign depends on side.
- Near $x = -3$: $f \\to \\dfrac{-2}{(-5)(0^{\\pm})} = \\pm\\infty$.

**When the denominator zero is "cancelable."** If both $P$ and $Q$ have a common factor $(x - a)$, you have a removable discontinuity, not an asymptote.

Example: $\\dfrac{x^2 - 4}{x - 2} = \\dfrac{(x-2)(x+2)}{x-2} = x + 2$ (for $x \\neq 2$). At $x = 2$, there's a hole but no vertical asymptote.

**Slant (oblique) asymptotes.** When the numerator's degree exceeds the denominator's by exactly 1, the rational function has a slant asymptote — a line of the form $y = mx + b$ — instead of a horizontal asymptote.

Find it by polynomial long division.

Example: $f(x) = \\dfrac{x^2 + 1}{x}$. Divide: $f(x) = x + \\dfrac{1}{x}$. The $1/x$ term $\\to 0$ as $x \\to \\pm\\infty$. So the slant asymptote is $y = x$.

Another: $f(x) = \\dfrac{x^2 - x - 6}{x + 1}$. Long division gives $f(x) = x - 2 + \\dfrac{-4}{x+1}$. Slant asymptote $y = x - 2$.

**Functions that aren't rational.** End behavior of various non-rational functions:

- $\\lim_{x \\to \\infty} e^x = \\infty$; $\\lim_{x \\to -\\infty} e^x = 0$. The exponential dominates everything.
- $\\lim_{x \\to \\infty} \\ln x = \\infty$; $\\lim_{x \\to 0^+} \\ln x = -\\infty$. Logarithm has vertical asymptote at 0.
- $\\lim_{x \\to \\infty} \\arctan x = \\pi/2$; $\\lim_{x \\to -\\infty} \\arctan x = -\\pi/2$. Two horizontal asymptotes.
- $\\lim_{x \\to \\infty} \\sin x$ does not exist — sine oscillates between $-1$ and $1$ forever.

**Comparing growth rates.** When you have a mix of polynomial, exponential, and logarithmic terms in a limit at infinity, exponentials grow fastest, logarithms slowest. Polynomial behavior is in between, dominated by exponentials and dominating logarithms.

- $\\lim_{x \\to \\infty} \\dfrac{e^x}{x^{100}} = \\infty$. Exponential beats any polynomial.
- $\\lim_{x \\to \\infty} \\dfrac{\\ln x}{x} = 0$. Polynomial (or even $\\sqrt{x}$) beats log.
- $\\lim_{x \\to \\infty} \\dfrac{\\ln x}{\\sqrt{x}} = 0$. Logarithm grows slower than any positive power.

**Why end behavior matters in calculus.** When you analyze the shape of a function for graphing or for solving an optimization problem, end behavior tells you what happens "out of the picture." Horizontal asymptotes affect long-term predictions in differential equations (e.g., logistic growth $\\to$ carrying capacity). Slant asymptotes show up in heat-transfer problems where a system approaches a linearly-rising baseline. Limits at infinity for sequences and series are how you decide whether infinite sums converge.

**Putting it together — sketching from limits.** Given $f(x) = \\dfrac{2x^2 + 1}{x^2 - 4}$:

- Domain: all $x$ except $\\pm 2$.
- Vertical asymptotes: $x = 2$ and $x = -2$ (denominator zero, numerator nonzero).
- Horizontal asymptote: $y = 2$ (same degree, ratio of leading coefficients $2/1$).
- $f(0) = 1/(-4) = -1/4$.
- Even function? Replace $x$ with $-x$: $\\dfrac{2x^2 + 1}{x^2 - 4}$, unchanged. Yes — symmetric about y-axis.

You can sketch this from limits and a few values, before any derivative work.`,
      video: {
        url: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
        title: '3Blue1Brown — Limits at infinity',
        provider: '3Blue1Brown',
      },
    },
    {
      code: '1.7',
      title: 'Continuity',
      content:
`A function is **continuous** at a point if it has no break there — you can draw the graph through that point without lifting your pencil. The precise definition uses limits, and it's worth getting exactly right because continuity is the pre-condition for almost every important theorem in calculus.

**Definition of continuity at a point.** A function $f$ is continuous at $x = a$ if all three of the following hold:

1. **$f(a)$ is defined.** The function has a value at $a$.
2. **$\\lim_{x \\to a} f(x)$ exists.** The limit at $a$ is a finite real number; both one-sided limits exist and are equal.
3. **$\\lim_{x \\to a} f(x) = f(a)$.** The limit equals the function value.

Each of the three can fail independently. Each failure gives a different kind of discontinuity.

**Types of discontinuities.**

**(1) Removable discontinuity (hole).** The two-sided limit exists, but either $f(a)$ is undefined or $f(a)$ differs from the limit. Looks like a hole in an otherwise smooth curve.

Example: $f(x) = \\dfrac{x^2 - 1}{x - 1}$ at $x = 1$. The limit is $2$, but $f(1)$ is undefined. Could be "fixed" by defining $f(1) = 2$, which is why it's called "removable."

Another example: $f(x) = \\begin{cases} x^2 & x \\neq 2 \\\\ 5 & x = 2 \\end{cases}$. The limit at $2$ is $4$, but $f(2) = 5 \\neq 4$. Removable.

**(2) Jump discontinuity.** Left and right limits both exist but differ. The two-sided limit does not exist.

Example: $f(x) = \\begin{cases} 1 & x < 0 \\\\ 2 & x \\geq 0 \\end{cases}$. At $x = 0$, left limit is $1$, right limit is $2$. Jump.

The floor function $\\lfloor x \\rfloor$ has jump discontinuities at every integer.

**(3) Infinite discontinuity (vertical asymptote).** At least one of the one-sided limits is $\\pm\\infty$.

Example: $f(x) = 1/x$ at $x = 0$. Left limit $= -\\infty$, right limit $= +\\infty$. The function blows up.

**(4) Oscillating discontinuity.** Function oscillates infinitely many times near the point.

Example: $f(x) = \\sin(1/x)$ at $x = 0$. The limit doesn't exist because the function oscillates between $-1$ and $1$ infinitely often as $x \\to 0$.

**Continuous functions you know.**

- **Polynomials** are continuous everywhere. $f(x) = 3x^4 - 2x + 5$ is continuous on all of $\\mathbb{R}$.
- **Rational functions** $P(x)/Q(x)$ are continuous wherever $Q(x) \\neq 0$.
- **Sine and cosine** are continuous everywhere.
- **Exponential $e^x$** is continuous everywhere.
- **Logarithm $\\ln x$** is continuous on $(0, \\infty)$.
- **Tangent, secant, etc.** are continuous on their domains (with asymptotes at half-multiples of $\\pi$).
- **Roots $\\sqrt[n]{x}$** are continuous on their domains (even roots need nonnegative inputs).

**Operations preserving continuity.** If $f$ and $g$ are continuous at $a$, then:

- $f + g$, $f - g$, $f \\cdot g$ are continuous at $a$.
- $f/g$ is continuous at $a$ if $g(a) \\neq 0$.
- $c \\cdot f$ is continuous at $a$ for any constant $c$.
- $f \\circ g$ (composition) is continuous at $a$ if $g$ is continuous at $a$ and $f$ is continuous at $g(a)$.

These operations let you build huge classes of continuous functions from simple pieces.

**Continuity on an interval.** A function is continuous on an interval $[a, b]$ if it's continuous at every point in $(a, b)$, and the one-sided limit at $a$ (from the right) equals $f(a)$, and similarly at $b$ (from the left).

**Intermediate Value Theorem (IVT).** If $f$ is continuous on $[a, b]$ and $N$ is any value strictly between $f(a)$ and $f(b)$, then there exists at least one $c$ in $(a, b)$ with $f(c) = N$.

Intuitively: a continuous function can't skip values. If it starts at $f(a)$ and ends at $f(b)$, it must pass through every value in between.

**Why IVT matters.** Used to prove the existence of solutions.

**Example application.** Show $f(x) = x^3 - x - 1$ has a root in $[1, 2]$.

$f$ is a polynomial, so continuous everywhere. $f(1) = -1$ (negative). $f(2) = 5$ (positive). Since $f$ is continuous on $[1, 2]$ and $0$ is between $-1$ and $5$, by IVT there exists $c \\in (1, 2)$ with $f(c) = 0$.

This doesn't tell us *where* the root is — just that it exists. Numerical methods (bisection, Newton's method) can then locate it.

**The IVT has many beautiful applications.** It's used to prove that every continuous function on a closed interval attains its maximum and minimum (Extreme Value Theorem), that the equation $\\tan x = x$ has infinitely many solutions, that any odd-degree polynomial has at least one real root, that any continuous function from a disk to itself has a fixed point.

**Extreme Value Theorem (EVT).** If $f$ is continuous on a *closed and bounded* interval $[a, b]$, then $f$ attains an absolute maximum and absolute minimum on $[a, b]$.

The "closed" matters: $f(x) = x$ on the open interval $(0, 1)$ has neither a max nor a min (suprema and infima are $0$ and $1$, but they're not attained). The "bounded" matters too: $f(x) = x$ on $[0, \\infty)$ has no max.

EVT is the foundation of optimization in calculus. To find the absolute max of $f$ on $[a, b]$, evaluate $f$ at critical points and at endpoints; the largest value wins.

**Continuity is necessary for differentiability.** If a function is differentiable at a point, it must be continuous there. (Differentiability implies continuity.) The converse is false — continuous functions can fail to be differentiable. The standard example is $|x|$, which is continuous at $x = 0$ but has a corner there, so not differentiable.

In fact, you can construct functions that are continuous *everywhere* but differentiable *nowhere* (Weierstrass's monster function). Continuity is a much weaker condition than differentiability.

**Detecting continuity on the AP exam.**

- Polynomials, sines, cosines, $e^x$: continuous everywhere. No work needed.
- Rational functions: check where denominator is zero. If numerator is also zero there, possible removable discontinuity; otherwise vertical asymptote.
- Piecewise functions: check that the pieces meet correctly at the boundary points. Compute both one-sided limits and the function value at the join, and see if all three match.
- $\\sqrt{x}$, $\\ln x$: check domain. Discontinuities only at boundaries of domain.

**Piecewise example.** Let $f(x) = \\begin{cases} x^2 + 1 & x \\leq 2 \\\\ 3x - 1 & x > 2 \\end{cases}$. Is $f$ continuous at $x = 2$?

- $f(2) = 4 + 1 = 5$ (from first piece).
- $\\lim_{x \\to 2^-} f(x) = 5$ (from first piece).
- $\\lim_{x \\to 2^+} f(x) = 6 - 1 = 5$ (from second piece).

All three equal $5$. Function is continuous at $x = 2$.`,
      video: {
        url: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
        title: '3Blue1Brown — Continuity',
        provider: '3Blue1Brown',
      },
    },
    {
      code: '1.8',
      title: 'Connecting limits and continuity',
      content:
`Continuity is defined in terms of limits, so the connection between the two ideas is direct. This subunit ties everything in the unit together and previews how limits become the engine for derivatives in Unit 2.

**The fundamental equation of continuity.**

$$f \\text{ continuous at } a \\;\\;\\Longleftrightarrow\\;\\; \\lim_{x \\to a} f(x) \\,=\\, f(a).$$

When the limit equals the function value, the function "fills the hole" at that point. When they differ (or when the limit doesn't exist), there's some kind of discontinuity.

**Equivalently:** $f$ is continuous at $a$ if and only if for every sequence $(x_n)$ converging to $a$, the sequence $(f(x_n))$ converges to $f(a)$. This sequential characterization is equivalent and sometimes easier to use.

**Removable discontinuities — what "removable" means.** When the limit at $a$ exists but doesn't equal $f(a)$ (or $f(a)$ is undefined), we can "remove" the discontinuity by redefining $f(a)$ to match the limit. The resulting modified function is continuous.

Example: $f(x) = \\dfrac{\\sin x}{x}$ has a removable discontinuity at $x = 0$. Define a new function $\\tilde{f}(x) = \\begin{cases} \\sin x / x & x \\neq 0 \\\\ 1 & x = 0 \\end{cases}$. The modified function is continuous everywhere.

This trick is used constantly in calculus. The derivative is defined via a limit that gives $0/0$ at the point of interest; "removing" the discontinuity reveals the actual rate of change.

**Continuity is local.** Continuity at $a$ is a statement about $f$ near $a$ — not about $f$ on an entire interval. A function can be continuous at one specific point while being discontinuous everywhere else. (The function $f(x) = x$ when $x$ is rational, $f(x) = -x$ when $x$ is irrational, is continuous only at $x = 0$.)

**Sub-cases worth knowing.**

- **Continuous from the left**: $\\lim_{x \\to a^-} f(x) = f(a)$. Sufficient if you're at the right endpoint of an interval.
- **Continuous from the right**: $\\lim_{x \\to a^+} f(x) = f(a)$. Sufficient at the left endpoint.
- **Continuous on an open interval** $(a, b)$: continuous at every point in the interval.
- **Continuous on a closed interval** $[a, b]$: continuous on $(a, b)$, plus continuous from the right at $a$ and from the left at $b$.

**Continuous functions you've met so far.**

- All polynomials: continuous everywhere.
- All rational functions: continuous wherever the denominator is nonzero.
- $\\sin$, $\\cos$: continuous everywhere.
- $\\tan$, $\\cot$, $\\sec$, $\\csc$: continuous on their domains (with vertical asymptotes elsewhere).
- $e^x$, $a^x$ (for $a > 0$): continuous everywhere.
- $\\ln x$, $\\log_a x$: continuous on $(0, \\infty)$.
- $\\sqrt[n]{x}$: continuous on its natural domain.
- $|x|$: continuous everywhere (even at $x = 0$, where it has a corner — but corners are still continuous; what they lack is differentiability).
- Compositions, sums, products, and (where denominator nonzero) quotients of continuous functions.

**Major theorems that require continuity.** This is why continuity matters in practice.

- **Intermediate Value Theorem (IVT).** Continuous on $[a, b]$ → takes every value between $f(a)$ and $f(b)$.
- **Extreme Value Theorem (EVT).** Continuous on $[a, b]$ → attains absolute max and min.
- **Mean Value Theorem (MVT, Unit 5).** Continuous on $[a, b]$ and differentiable on $(a, b)$ → there exists $c$ where $f'(c) = (f(b) - f(a))/(b - a)$.
- **Fundamental Theorem of Calculus (Unit 6).** Continuous functions on $[a, b]$ are integrable, and the integral function is differentiable with derivative equal to the original.

In each case, continuity is the hypothesis that makes the conclusion possible. Drop continuity, and the conclusion can fail.

**Differentiability implies continuity (sneak preview of Unit 2).** If $f$ is differentiable at $a$, then $f$ is continuous at $a$.

The proof is short: $\\lim_{x \\to a}[f(x) - f(a)] = \\lim_{x \\to a} \\dfrac{f(x) - f(a)}{x - a} \\cdot (x - a) = f'(a) \\cdot 0 = 0$. So $\\lim_{x \\to a} f(x) = f(a)$, which is continuity.

**The converse is false.** Continuous does not imply differentiable. $|x|$ is continuous at $0$ but not differentiable there (the slope jumps from $-1$ to $+1$). $\\sqrt[3]{x}$ is continuous at $0$ but has a vertical tangent there, so not differentiable.

**Why this preview matters.** A core skill in calculus is recognizing when you can use a powerful theorem (like the Mean Value Theorem) and when you can't. The check is always: is the function continuous on the required interval? Is it differentiable on the open part?

**Common pitfalls in continuity questions.**

- **Confusing continuity at a point with continuity on an interval.** A function can be continuous at one point but discontinuous nearby. To say "continuous on $[a, b]$" requires continuity at every point of the interval.
- **Forgetting all three conditions.** Many AP students remember "the limit equals the function value" but forget to check that $f(a)$ is defined or that the limit even exists.
- **Assuming continuity implies differentiability.** It doesn't. $|x|$ at $0$.
- **Thinking removable discontinuities are "barely there."** Even a single missing point makes a function discontinuous and disqualifies it from IVT/EVT/MVT on that interval. The hole has to be filled before those theorems apply.

**End-of-unit summary.** With Unit 1 done, you've built the foundation: limits give precision to the idea of "approaching"; continuity is the property of "no break"; the major theorems (IVT, EVT) work when continuity holds. Unit 2 builds the derivative on this foundation by taking a limit of a difference quotient, and the rest of AB Calculus follows.`,
      video: {
        url: 'https://www.youtube.com/watch?v=riXcZT2ICjA',
        title: '3Blue1Brown — Limits and continuity (recap)',
        provider: '3Blue1Brown',
      },
    },
  ],
  keyConcepts: [
    'A limit is the value a function approaches; $\\lim_{x \\to a} f(x) = L$ means $f(x) \\to L$ as $x \\to a$. Behavior NEAR $a$, not at $a$.',
    'Two-sided limit exists $\\iff$ both one-sided limits exist AND are equal.',
    'Limits at infinity describe end behavior. Horizontal asymptotes follow from finite limits at $\\pm\\infty$.',
    'Limit laws: sum, difference, product, quotient (if denominator $\\neq 0$), constant multiple, power, root.',
    'Direct substitution works for polynomials, continuous rationals, exponentials, log, trig in their domains.',
    'For $0/0$: factor, rationalize, or combine fractions.',
    'Three key trig limits: $\\sin x / x \\to 1$, $(1 - \\cos x)/x \\to 0$, $(1 - \\cos x)/x^2 \\to 1/2$ as $x \\to 0$.',
    'Squeeze theorem: if $g \\leq f \\leq h$ near $a$ and $\\lim g = \\lim h = L$, then $\\lim f = L$.',
    'Rational-function end behavior: compare numerator and denominator degrees.',
    'Continuity at $a$: $f(a)$ defined, $\\lim$ exists, $\\lim = f(a)$. All three required.',
    'Four discontinuity types: removable (hole), jump, infinite (asymptote), oscillating.',
    'IVT: continuous on $[a, b]$ $\\Rightarrow$ takes every value between $f(a)$ and $f(b)$.',
    'EVT: continuous on $[a, b]$ $\\Rightarrow$ attains abs max and abs min.',
    'Differentiability implies continuity (converse false).',
  ],
  formulas: [
    {
      name: 'Key trig limit',
      equation: '$\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1$',
      meaning: 'Foundational. Used to derive the derivative of $\\sin x$ and dozens of related limits. $x$ must be in radians.',
      example: '$\\lim_{x \\to 0} \\dfrac{\\sin 3x}{x} = 3 \\cdot \\lim_{x \\to 0} \\dfrac{\\sin 3x}{3x} = 3 \\cdot 1 = 3$.',
    },
    {
      name: 'Continuity at a point',
      equation: '$\\lim_{x \\to a} f(x) = f(a)$',
      meaning: 'Three requirements: $f(a)$ defined, limit exists, and the two are equal. Failure of any makes $f$ discontinuous at $a$.',
      example: '$f(x) = (x^2 - 1)/(x - 1)$ has a removable discontinuity at $x = 1$. Define $f(1) = 2$ to make it continuous.',
    },
    {
      name: 'Squeeze theorem',
      equation: '$g(x) \\leq f(x) \\leq h(x)$ and $\\lim g = \\lim h = L \\Rightarrow \\lim f = L$',
      meaning: 'Sandwich an unfriendly function between two friendly ones with the same limit. Useful for oscillating expressions.',
      example: '$\\lim_{x \\to 0} x^2 \\sin(1/x) = 0$ because $-x^2 \\leq x^2 \\sin(1/x) \\leq x^2$.',
    },
    {
      name: 'End behavior of rational functions',
      equation: '$\\lim_{x \\to \\infty} \\dfrac{a_m x^m + \\ldots}{b_n x^n + \\ldots}$',
      meaning: 'Compare degrees: $m < n \\to 0$; $m = n \\to a_m / b_n$; $m > n \\to \\pm\\infty$.',
      example: '$\\lim_{x \\to \\infty} (3x^2 + 5x)/(x^2 - 2x + 1) = 3/1 = 3$. Horizontal asymptote $y = 3$.',
    },
  ],
  practice: [
    {
      q: 'Find $\\lim_{x \\to 4} \\dfrac{x^2 - 16}{x - 4}$.',
      a: 'Direct substitution: $0/0$. Factor: $\\dfrac{(x-4)(x+4)}{x-4} = x + 4$. Plug in: $4 + 4 = 8$.',
    },
    {
      q: 'Find horizontal asymptotes of $f(x) = \\dfrac{3x^2 + 5x}{x^2 - 2x + 1}$.',
      a: 'Both polynomials have degree 2. Limit = ratio of leading coefficients = $3/1 = 3$. Horizontal asymptote at $y = 3$, on both sides.',
    },
    {
      q: 'Show $f(x) = x^3 - x - 1$ has a root in $[1, 2]$ using IVT.',
      a: '$f$ is a polynomial, so continuous on $[1, 2]$. $f(1) = 1 - 1 - 1 = -1 < 0$. $f(2) = 8 - 2 - 1 = 5 > 0$. Since $f$ is continuous and $0$ is between $-1$ and $5$, by IVT there exists $c \\in (1, 2)$ with $f(c) = 0$.',
    },
    {
      q: 'Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin 5x}{\\sin 2x}$.',
      a: 'Rewrite: $\\dfrac{\\sin 5x}{\\sin 2x} = \\dfrac{\\sin 5x / (5x)}{\\sin 2x / (2x)} \\cdot \\dfrac{5x}{2x} = \\dfrac{\\sin 5x / (5x)}{\\sin 2x / (2x)} \\cdot \\dfrac{5}{2}$. Both sub-limits $\\to 1$. Limit = $5/2$.',
    },
    {
      q: 'Is $f(x) = \\begin{cases} x^2 + 1 & x < 2 \\\\ 4x - 3 & x \\geq 2 \\end{cases}$ continuous at $x = 2$?',
      a: '$f(2) = 4(2) - 3 = 5$. $\\lim_{x \\to 2^-} f(x) = 4 + 1 = 5$. $\\lim_{x \\to 2^+} f(x) = 5$. All three equal $5$. Yes, continuous.',
    },
    {
      q: 'Find $\\lim_{x \\to 0} x^2 \\cos\\left(\\dfrac{1}{x}\\right)$.',
      a: '$\\cos(1/x)$ oscillates between $-1$ and $1$. So $-x^2 \\leq x^2 \\cos(1/x) \\leq x^2$. Both bounds approach $0$. By the squeeze theorem, the limit is $0$.',
    },
  ],
  pitfalls: [
    '"If a limit exists at $a$, then $f(a)$ is defined" — wrong. The limit can exist even when $f(a)$ is undefined (removable discontinuity).',
    '"$\\sin x / x = 1$" — only as $x \\to 0$. For other values of $x$, the ratio takes other values.',
    '"$\\sin x / x = 1$ in degrees" — wrong. The result holds only if $x$ is in radians. In degrees, the ratio approaches $\\pi/180 \\approx 0.01745$.',
    '"Continuity is the same as differentiability" — no. Differentiability implies continuity, but not vice versa. $|x|$ is continuous at $0$ but not differentiable.',
    '"A function with a hole has a vertical asymptote" — no. A hole is a removable discontinuity; the function might just be missing a single point.',
    '"$\\lim = \\infty$ means the limit exists" — strictly no, in the real-number sense. We use the symbol $\\infty$ to describe behavior (vertical asymptote), not to declare a finite limit.',
    '"IVT lets me find roots" — IVT only says a root exists; it doesn\'t find it. You need bisection, Newton\'s method, or some other technique to locate it.',
    '"Polynomials can have asymptotes" — wrong. Polynomials have no asymptotes (vertical, horizontal, or slant). Rational functions can.',
  ],
};
