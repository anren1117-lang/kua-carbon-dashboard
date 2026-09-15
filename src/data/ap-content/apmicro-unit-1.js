// AP Microeconomics Unit 1 — Basic Economic Concepts (12-15%)
// APES-standard depth.

export const APMICRO_UNIT_1 = {
  number: 1,
  title: 'Basic Economic Concepts',
  weight: '12-15%',
  subunits: [
    {
      code: '1.1',
      title: 'Scarcity, choice, and marginal analysis',
      content:
`**Scarcity** is the foundational economic problem: human wants are unlimited, but the resources available to satisfy them are limited. Every economic question — from a teenager choosing how to spend their Saturday afternoon to a CEO deciding whether to build a new factory — comes down to allocating scarce resources among competing uses. If resources were unlimited, economics wouldn't exist as a discipline; we could all have everything we want without making trade-offs.

The scarcity principle applies universally. Even wealthy individuals face it (their time is limited even if their money isn't); even prosperous nations face it (they can have more healthcare or more roads, but not both at unlimited levels). Scarcity is the inescapable backdrop of every economic decision.

**Trade-offs.** Because resources are scarce, every choice means giving something up. The student who decides to study Saturday afternoon gives up an alternative use of that time — sleep, socializing, leisure, paid work. The business that invests in expanding to a new market gives up other potential uses of those funds. The country that funds healthcare more heavily has less for everything else.

Trade-offs are unavoidable. The interesting economic question is: how should we think about which trade-offs are worth making?

**Opportunity cost.** The economist's name for the cost of any choice: the **value of the next-best alternative forgone**. Not the sum of all alternatives — just the best one you give up.

If a student spends Saturday afternoon studying, and the next-best alternative would have been working a 4-hour shift for $60, the opportunity cost of studying is $60 (plus the value of the leisure time, if any). The opportunity cost isn't the value of *all* possible alternatives; it's the value of the *single best* one you'd otherwise have chosen.

Opportunity cost is one of the most fundamental concepts in economics, and it's the single most important tool for thinking about real-world choices. Every decision has an opportunity cost; ignoring it is a mistake.

**Explicit vs implicit costs.** Total economic cost equals explicit costs (out-of-pocket money paid) plus implicit costs (opportunity costs of non-monetary resources).

- A college student's explicit costs: tuition + room and board + books.
- A college student's implicit costs: forgone wages they could have earned working instead.
- A startup founder's explicit costs: rent, salaries, materials.
- A startup founder's implicit costs: the salary they could have earned working at an established firm.

Many real-world decisions look different when you account for both costs. A "free" workshop that takes a Saturday isn't really free — you've given up the use of your Saturday. A "deal" requiring a long drive may not be a deal once you value your driving time.

**Marginal analysis.** Economists think at the margin. The relevant question isn't usually "should we do this at all?" but "should we do *one more unit* of this?" Compare marginal benefits to marginal costs.

- **Marginal benefit (MB)**: the extra benefit gained from one more unit of an activity.
- **Marginal cost (MC)**: the extra cost incurred from one more unit.
- **Decision rule**: continue the activity while $MB \\geq MC$; stop when $MB < MC$.

This isn't intuitive at first, but it's powerful. You don't need to compute the total benefit and total cost of every option; you just need to evaluate whether the next unit is worth doing.

**Worked example.** A student studies for an exam.

- Hour 1: review the basics → exam score rises a lot. Big MB.
- Hour 2: master the major concepts → smaller MB.
- Hour 3: clean up details. Smaller MB still.
- Hour 5: marginal increases in score are minimal. MB drops.
- Hour 7: nodding off, retention near zero. MB ~ 0.

At some hour, MB falls below the opportunity cost of the time (sleep, leisure, other studies). That's the rational stopping point. The "right" amount of studying isn't "as much as possible" — it's where MB equals MC.

**Diminishing marginal utility.** A specific application of the marginal idea to consumption. Each additional unit of a good gives less satisfaction than the previous one.

- First slice of pizza when you're hungry: extremely satisfying. High marginal utility.
- Second slice: still good. Lower marginal utility.
- Eighth slice: maybe unpleasant. Marginal utility approaching zero (or negative).

This is why we don't typically consume infinite amounts of any one good — eventually each additional unit yields too little additional utility to justify its cost. Diminishing marginal utility explains the law of demand (we pay more for the first unit than the tenth), helps explain why people diversify their consumption, and underlies much of demand theory.

**Why marginal thinking is so useful.** Most decisions in real life are at the margin. Should I work an extra hour? Should we hire one more employee? Should the government build one more highway lane? Total-cost thinking would have you re-evaluate your whole life every Saturday morning; marginal thinking just asks "is the next step worth it?"

**Rational choice theory.** Economic models assume people act rationally — they make choices to maximize their well-being given the constraints they face. They evaluate marginal benefits and marginal costs and choose to do anything where MB ≥ MC.

This is a simplification. Real people are subject to many biases and limitations:

- Bounded rationality (we can't process all relevant information).
- Loss aversion (we feel losses more strongly than gains).
- Present bias (we overweight immediate rewards relative to delayed ones).
- Social influence (we conform to what others do).
- Cognitive errors (anchoring, availability bias, confirmation bias).

These deviations are the subject of behavioral economics, an active research area combining economics with psychology. For most AP exam purposes, you can use the rational choice framework; just be aware that it's a model, not a literal description of human behavior.

**Why this all matters for micro.** Microeconomics is fundamentally about how individuals, households, and firms make decisions when facing scarcity. The tools of this subunit — opportunity cost, marginal analysis, diminishing marginal utility — are what we'll use to derive demand curves (Unit 2), analyze production decisions (Unit 3), and understand market structure (Units 4–5). The simple framework "do something while MB ≥ MC" is the seed for everything else.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Scarcity and marginal analysis',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.2',
      title: 'Production Possibilities Curve (PPC)',
      content:
`The **Production Possibilities Curve (PPC)** is one of the most important diagrams in introductory economics. It captures the central ideas — scarcity, choice, opportunity cost, efficiency, and growth — in a single visual model. Mastering the PPC is essential for both micro and macro analysis.

**What the PPC shows.** The maximum combinations of two goods (or two categories of goods) that an economy can produce, given its current resources and technology. Plot quantity of Good A on one axis and Good B on the other; the curve traces out the frontier of what's possible.

**Why the PPC is bowed outward.** Most PPCs are **concave to the origin** (bowed outward). This reflects the **law of increasing opportunity cost**: as you produce more of one good, you have to give up increasingly larger amounts of the other.

Why? Because resources aren't equally suited to all uses. Some workers are more skilled at making cars; others are more skilled at making wheat. Some land is best for grain; some is best for grazing. When you produce only a little of Good A, you use the resources most suited to A. Producing more A requires drawing in resources less suited to A — and those resources had higher opportunity cost (they were more valuable in producing B).

**Worked example — cars vs wheat.**

| Cars | Wheat | OC of next car |
|------|-------|----------------|
| 0    | 100   | (going from 100 to ... ) |
| 1    | 99    | 1 wheat |
| 2    | 97    | 2 wheat |
| 3    | 94    | 3 wheat |
| 4    | 90    | 4 wheat |
| 5    | 85    | 5 wheat |
| 6    | 79    | 6 wheat |
| 7    | 72    | 7 wheat |

The first car costs only 1 wheat (use the most car-suited resources). The seventh car costs 7 wheat (now using resources poorly suited to car-making).

A straight-line PPC would represent constant opportunity costs — resources equally suited to all uses. Rare in real economies.

**Points on the PPC.**

- **On the curve**: efficient production. The economy uses all available resources at full productivity. Different points on the curve represent different mixes of the two goods.
- **Inside the curve**: inefficient. Some resources are unemployed or used inefficiently. Could produce more of both goods. Recessions correspond to points inside the curve — same productive potential as before, but the economy isn't fully using it.
- **Outside the curve**: unattainable with current resources and technology. Could only be reached through economic growth.

**Three notions of efficiency.**

- **Productive efficiency**: producing on the curve, not inside it. All resources fully employed.
- **Allocative efficiency**: producing the right *mix* — the combination on the curve that society most values. Different from productive efficiency: a point on the curve is productively efficient, but it might be the wrong mix.
- **Distributive efficiency**: getting goods to the people who value them most.

The PPC is primarily about productive and allocative efficiency. Distributive efficiency is a separate concern.

**Shifts of the PPC — economic growth.** The PPC moves outward when:

- **Labor force grows** (population growth, immigration, more women joining workforce).
- **Capital stock grows** (more factories, machines, infrastructure).
- **Technological progress** (better methods producing more from the same inputs).
- **Education and skill formation** (human capital improvements).
- **Discovery of new resources** (oil reserves, arable land).
- **Improved economic institutions** (property rights, contract enforcement, lower corruption).

A breakthrough that affects mainly one industry (say, agricultural biotechnology) shifts the PPC outward asymmetrically — more on the agricultural axis. A general productivity improvement shifts the whole frontier outward.

Conversely, the PPC can shift inward:
- War or natural disaster destroying capital.
- Loss of labor (epidemic, mass emigration).
- Resource depletion.

**The investment trade-off.** A key application of the PPC: the choice between consumer goods and capital goods.

If a country produces more consumer goods now (food, clothes, entertainment), it consumes more today but invests less, so the PPC shifts outward more slowly. If it produces more capital goods (machines, factories, infrastructure), it consumes less today but invests more, and the PPC shifts outward faster.

This is the classic growth trade-off: present consumption vs future growth. Countries that have invested aggressively (South Korea, Singapore, China) grew rapidly but consumed less in the short run. Countries that consumed more grew more slowly.

**The PPC and the three economic questions.**

- **What to produce?** Which point on the curve to choose. A society's preferences and political process determine this.
- **How to produce?** Different production techniques (labor-intensive vs capital-intensive) may yield different PPCs. The PPC is drawn for a given technology.
- **For whom to produce?** The PPC doesn't address distribution directly.

**The PPC and comparative advantage.** Different individuals, regions, and countries have different PPCs reflecting their resources and skills. When trading partners specialize in goods they have comparative advantage in, both can consume *outside* their own PPCs — gaining from trade.

We'll detail this in 1.3. The PPC is the right framework for visualizing comparative advantage: it makes the opportunity costs explicit and shows the gains from specialization.

**Real-world applications.**

- **Guns vs butter** (defense vs civilian goods): the classic trade-off in wartime budgets.
- **Healthcare vs other public services**: more spending on Medicare means less on infrastructure or education.
- **Climate vs growth**: stricter environmental rules may slow short-term growth (point on PPC moves) but might expand the long-run PPC by avoiding catastrophic damages.
- **Education vs current consumption**: investing in schools yields future growth at the cost of present consumption.

**Pitfalls in PPC analysis.**

- A linear PPC implies constant opportunity costs — possible if resources are perfectly substitutable, but rare in reality.
- A point inside the curve doesn't necessarily mean recession — it could also reflect long-term inefficiency or institutional problems.
- Moving from inside to on the curve isn't the same as growth — growth shifts the curve outward. Moving from inside to on is just using resources better with the existing curve.
- "On the curve" doesn't mean "best." Many points on the curve are efficient; choosing among them is a separate (often political) question.

**Synthesis.** The PPC is a compact way to visualize the central economic trade-offs. Scarcity gives the curve a finite shape. Choice is illustrated by movement along it. Opportunity cost is the slope at any point. Efficiency is being on the curve. Growth shifts the curve outward. Comparative advantage explains why different PPCs lead to trade. Almost every major idea in introductory economics can be illustrated with this single diagram.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Production possibilities curve',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.3',
      title: 'Comparative advantage and gains from trade',
      content:
`David Ricardo's 1817 analysis of trade established one of economics' most surprising results: **trade benefits both parties even when one is better at everything**. The principle is called the **law of comparative advantage**, and it explains both why countries trade and why individuals specialize in their own work.

**Absolute vs comparative advantage.**

- **Absolute advantage**: producing more output with the same inputs (or the same output with fewer inputs). About who is better at making something.
- **Comparative advantage**: producing at a lower opportunity cost. About who has to give up less of something else to produce a given good.

The two notions diverge surprisingly often. A country with absolute advantage in everything still has comparative advantage in only some things — because comparative advantage is *relative*.

**Worked example.**

| | Wheat per hour | Cars per hour |
|--|----------------|---------------|
| **USA** | 100 | 50 |
| **Mexico** | 30 | 30 |

The USA produces more of both goods per hour. The USA has absolute advantage in both.

But check the opportunity costs.

- USA: making 1 car requires giving up 2 wheat (since 50 cars uses the same resources as 100 wheat). OC of 1 car = 2 wheat in the USA.
- Mexico: making 1 car requires giving up 1 wheat. OC of 1 car = 1 wheat in Mexico.

Mexico has the **lower opportunity cost** of cars. Mexico has comparative advantage in cars.

Going the other way:
- USA: 1 wheat requires giving up $1/2$ car. OC of 1 wheat = $0.5$ car.
- Mexico: 1 wheat requires giving up 1 car. OC of 1 wheat = 1 car.

USA has lower opportunity cost of wheat. USA has comparative advantage in wheat.

**Specialization and trade.** Each country should specialize in the good it has comparative advantage in, and trade for the other. Both end up with more of both goods than if they tried to produce everything for themselves.

USA specializes in wheat; Mexico specializes in cars; they trade.

**Terms of trade — the trading rate that benefits both.**

Trade between two countries benefits both only if the trading rate falls **between** their opportunity costs.

- USA's OC of cars: 2 wheat per car.
- Mexico's OC of cars: 1 wheat per car.

Any trading rate strictly between 1 and 2 wheat per car makes both better off. At exactly 1 wheat per car, only Mexico breaks even. At exactly 2 wheat per car, only the USA breaks even. In between, both gain.

**Worked example.** Suppose they trade at 1.5 wheat per car.

- USA imports cars. Pays 1.5 wheat per car instead of the 2 wheat per car it would cost to make domestically. USA gains $0.5$ wheat per car of imports.
- Mexico exports cars. Receives 1.5 wheat per car, instead of the 1 wheat per car opportunity cost. Mexico gains $0.5$ wheat per car of exports.

Both gain.

**Why is the trade rate set within the range?** Negotiation, competition, and market forces. The specific outcome depends on:

- Relative size of demand (which country has more buyers and sellers).
- Negotiating power.
- Transportation costs and trade frictions.
- The availability of other trading partners.

In practice, market trade happens at globally negotiated prices, with countries selling at the world price and adjusting their domestic production accordingly.

**A simpler heuristic for the AP exam.** To find who has comparative advantage:

1. Compute opportunity costs for each country.
2. Whoever has the lower OC has the comparative advantage in that good.
3. Specialize in your comparative-advantage good; trade at any rate between the two opportunity costs.

**The "give up less to gain" framing.** Comparative advantage answers: who has to give up *less* to produce one more unit? Whoever has the lower opportunity cost is the one who should specialize in that good. That country isn't forced to sacrifice as much of the alternative.

**Sources of comparative advantage.** Real countries have comparative advantage because of:

- **Resource endowments**. Brazil has rainforest, Saudi Arabia has oil, Switzerland has Alpine water, the US has vast arable land.
- **Climate**. Tropical countries produce bananas, coffee, cocoa; temperate countries produce wheat, corn.
- **Human capital**. Highly educated workforces have comparative advantage in knowledge-intensive goods. India's English-speaking workforce has comparative advantage in IT services.
- **Capital stock**. Capital-abundant countries have comparative advantage in capital-intensive goods.
- **Technology and clusters**. Specific industries cluster (Hollywood for films, Silicon Valley for tech), and the local network effects sustain comparative advantage.
- **Institutions**. Stable legal systems, contracts, and property rights enable industries that require complex coordination.

**Comparative advantage changes over time.** It's not fixed. Japan was a low-wage manufacturing economy in the 1950s; now it's a high-tech, high-wage one. China's comparative advantage 30 years ago was in low-wage manufacturing; today it's increasingly in mid-tech, and it's evolving toward high-tech. India's IT services comparative advantage emerged in the 1990s and continues to develop. Comparative advantage reflects a country's economic structure at a given point in time.

**Specialization within an economy.** Comparative advantage applies at every scale. Within a country, regions specialize: California has tech, agriculture, and entertainment; Texas has energy; Iowa has corn. Within a region, specific industries cluster. Within a workplace, individuals specialize.

The classic individual example: a doctor who is also a faster typist than their secretary still hires the secretary, because the doctor's opportunity cost (forgone medical practice time) is too high. The doctor has absolute advantage in typing but comparative advantage in medicine.

**Free trade — benefits.** The general benefits of trade based on comparative advantage:

- **Lower prices.** Consumers in importing country pay less than they would for domestic production.
- **Greater variety.** Trade brings goods that the importing country couldn't easily produce itself (tropical fruit in Norway, technology in agriculture-focused economies).
- **Higher quality.** Competition from imports pushes domestic firms to improve.
- **Larger markets** for exporters.
- **Specialization benefits**: economies of scale, learning-by-doing, focus on most-productive activities.
- **Innovation pressure**: foreign competition forces innovation.

**Free trade — costs.** The standard caveats:

- **Distributional effects**. Trade benefits the country in aggregate but hurts workers in import-competing industries. US manufacturing workers have borne real costs from globalization since the 1980s. Compensating losers from trade is in principle feasible but in practice often incomplete, fueling political backlash against trade.
- **Adjustment costs**. Moving from a closed economy to a trading one takes time, and the transitional period can be painful for displaced workers.
- **Inequality may rise** within trading countries. Workers in export industries gain; workers in import-competing industries lose.
- **Dependence on foreign suppliers** can be a vulnerability during conflicts (Russia-Europe gas, COVID-supply chains).

**The political economy of trade.** Even though comparative advantage produces aggregate gains, political coalitions often resist trade because concentrated losses (a few specific workers losing jobs) are more politically visible than diffuse gains (slightly cheaper goods for everyone). This is one reason trade policy is so often contested.

**Real-world specialization.**

- **China**: dominant in manufacturing (consumer electronics, textiles, basic metals, increasingly mid-tech).
- **USA**: services (finance, tech, healthcare, education, entertainment); high-tech manufacturing (semiconductors, aerospace, pharmaceuticals); some agriculture.
- **Germany**: precision engineering, automobiles, machinery, chemicals.
- **Japan**: precision electronics, automobiles, robotics.
- **South Korea**: electronics, semiconductors, ships.
- **India**: IT services, generic pharmaceuticals, textiles.
- **Saudi Arabia**: oil and petrochemicals.
- **Australia**: minerals, agricultural commodities, energy.

Each country specializes in goods where it has comparative advantage. The pattern of global trade reflects the pattern of comparative advantage at this moment in history.

**Synthesis.** Comparative advantage is the principle that explains specialization and trade. Even when one party is better at everything, both gain from focusing on what they're *relatively* best at and trading for the rest. This principle scales from individuals to whole nations and is one of the most enduring insights of economics.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Comparative advantage',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.4',
      title: 'Demand and elasticity',
      content:
`**Demand** describes the relationship between the price of a good and the quantity that buyers are willing and able to purchase. Understanding demand — what determines it, what shifts it, how to measure responsiveness with elasticity — is the foundation of micro market analysis.

**The law of demand.** As price rises, quantity demanded falls. As price falls, quantity demanded rises. The demand curve is **downward-sloping**.

**Why the law of demand holds — two effects.**

- **Substitution effect.** When the price of Good X rises, other goods become relatively cheaper. People substitute toward alternatives. Higher gas prices → more biking, electric cars, carpooling.
- **Income effect.** When the price of X rises, your purchasing power falls. You can afford less in total, including less of X.

Together, these two effects ensure that for typical goods, higher price → lower quantity demanded.

**Rare exceptions.** Veblen goods (luxury items where high prices signal status, so higher price can increase demand) and Giffen goods (special case of inferior goods) are textbook curiosities. For 99% of real goods, demand slopes down.

**Change in quantity demanded vs change in demand.** The most-tested distinction in introductory micro.

- **Change in quantity demanded**: a **movement along** a fixed demand curve, caused by a change in the good's price.
- **Change in demand**: a **shift** of the entire demand curve, caused by a change in some non-price factor.

If the price of pizza falls and you buy more pizza, that's a change in quantity demanded — slide down the existing curve.

If your income rises and you buy more pizza at every price, that's a change in demand — the curve shifts right.

The acid test: did the good's *own price* change? If yes, you're moving along the curve. If anything *other* than the good's price changed, the curve shifted.

**Six shifters of demand.**

**1. Income.** Effects depend on whether the good is normal or inferior.

- **Normal goods**: more income → more demand. Most goods (restaurants, vacations, organic groceries, new cars).
- **Inferior goods**: more income → less demand. Ramen noodles, used cars, off-brand cereal, bus rides for some people. As income rises, people switch from inferior to better alternatives.

The same good can be normal at one income level and inferior at another. A 10-year-old used car might be normal for a college student but inferior for an executive.

**2. Prices of related goods.**

- **Substitutes**: goods that can replace each other. Price of Coke rises → demand for Pepsi rises.
- **Complements**: goods used together. Price of cars rises → demand for gasoline falls. Price of printers falls → demand for printer ink rises.

**3. Tastes and preferences.** Subjective. Marketing, fashion trends, health information, viral content all shift tastes.

**4. Expectations of future prices.** If consumers expect prices to rise, they buy more now. If they expect prices to fall, they delay purchases.

**5. Number of buyers.** More buyers → higher demand. Population growth, market expansion, demographic shifts.

**6. Demographics.** Aging population → more healthcare demand. Younger population → more education demand.

**Elasticity of demand.** A measure of how responsive quantity demanded is to a change in price.

$$E_d \\,=\\, \\frac{\\%\\,\\Delta Q_d}{\\%\\,\\Delta P}$$

By the law of demand, this is negative. Economists usually report the absolute value.

**Categories.**

- **Elastic** ($|E_d| > 1$): Q changes by a larger percentage than P. Responsive demand.
- **Inelastic** ($|E_d| < 1$): Q changes by a smaller percentage than P. Unresponsive demand.
- **Unit elastic** ($|E_d| = 1$): proportional response.
- **Perfectly elastic** ($|E_d| = \\infty$): horizontal curve. Tiny price increase → demand drops to zero. Approximation for highly competitive markets.
- **Perfectly inelastic** ($|E_d| = 0$): vertical curve. No quantity response to price. Approximation for emergency life-saving drugs.

**Factors affecting elasticity.**

- **Substitutes**. More substitutes → more elastic. Specific brands of cola very elastic; salt very inelastic.
- **Necessity vs luxury**. Necessities more inelastic. Insulin extremely inelastic; vacations elastic.
- **Share of income**. Large purchases (cars, vacations) more elastic; small purchases less so.
- **Time horizon**. Long-run demand more elastic. Gasoline demand inelastic today (you still drive to work); over years, you might buy an EV or move closer to work.
- **Market definition**. Broader categories less elastic; specific brands more elastic.

**Worked elasticity examples.**

- A 10% price increase in coffee causes a 5% quantity decrease. $|E_d| = 5/10 = 0.5$. Inelastic.
- A 10% price increase in airline tickets causes a 20% quantity decrease. $|E_d| = 20/10 = 2$. Elastic.

**Total revenue and elasticity.** Total revenue $TR = P \\times Q$. Elasticity tells you how TR changes when price changes.

- **Elastic demand**: P↑ → TR↓. The quantity drop outpaces the price increase, so total revenue falls.
- **Inelastic demand**: P↑ → TR↑. Quantity doesn't drop much, so the price increase wins.
- **Unit elastic**: P↑ → TR unchanged.

This is why monopolists never operate in the inelastic region: they could always raise price and gain revenue. Profit maximization happens in the elastic region.

**Practical implication of elasticity.**

- **Pricing strategy for firms.** If demand is elastic, you can't raise prices without losing customers; compete on price. If demand is inelastic, you can raise prices without losing too many customers.
- **Tax policy.** Taxes on inelastic goods (cigarettes, alcohol, gasoline) raise more revenue and reduce quantity less. That's why these are classic "sin taxes."
- **Minimum wage debate.** Hinges on labor demand elasticity. Low elasticity → smaller employment effect.

**Cross-price elasticity.** How responsive demand for X is to the price of Y.

$$E_{xy} \\,=\\, \\frac{\\%\\,\\Delta Q_x}{\\%\\,\\Delta P_y}$$

- Positive: X and Y are substitutes.
- Negative: X and Y are complements.
- Magnitude tells you the strength of the relationship.

**Income elasticity.** How responsive demand is to income.

$$E_i \\,=\\, \\frac{\\%\\,\\Delta Q}{\\%\\,\\Delta \\text{Income}}$$

- Positive ($E_i > 0$): normal good.
- Negative ($E_i < 0$): inferior good.
- $E_i > 1$: luxury (demand rises more than proportionally with income).
- $0 < E_i < 1$: necessity (demand rises but less than proportionally).

A 5% rise in income causing a 10% rise in restaurant spending: $E_i = 10/5 = 2$. Restaurants are a luxury.

A 5% rise in income causing a 2% rise in salt demand: $E_i = 2/5 = 0.4$. Salt is a necessity.

A 5% rise in income causing a 3% fall in ramen demand: $E_i = -3/5 = -0.6$. Ramen is an inferior good.

**Consumer surplus.** The area between the demand curve and the price line. Represents the gain to consumers from being able to buy at the equilibrium price rather than what they'd have been willing to pay. Consumer surplus is part of the total economic welfare from a market.

**Synthesis.** Demand depends on price (law of demand, downward-sloping) plus six non-price factors (income, related goods, tastes, expectations, buyers, demographics). Elasticity measures responsiveness. Together these tools let us predict how markets respond to changes — the workhorse for the rest of microeconomics.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Demand and elasticity',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.5',
      title: 'Supply, surplus, and welfare',
      content:
`**Supply** describes the relationship between the price of a good and the quantity that producers are willing and able to sell. Supply is the seller's side of the market, mirroring demand on the buyer's side. With both supply and demand in hand, we can analyze how markets clear and how they generate (or fail to generate) economic welfare.

**The law of supply.** As the price of a good rises, the quantity supplied rises. The supply curve is **upward-sloping**.

**Why supply slopes up.**

- **Profit motive**. Higher prices yield more profit per unit, so more sellers want to sell.
- **Rising marginal cost**. Producing more typically costs more per unit (you run out of the most efficient resources first). Producers only make the more-expensive units if the price is high enough to cover the higher cost.
- **Entry into the market**. Higher prices attract new sellers.

**Change in quantity supplied vs change in supply.** Same distinction as on the demand side.

- **Change in quantity supplied**: movement along a fixed supply curve due to a change in the good's price.
- **Change in supply**: shift of the entire curve due to non-price factors.

**Six shifters of supply.**

**1. Input prices.** Rising input prices (wages, materials, energy) raise production costs and shift supply left. Falling input prices shift supply right.

**2. Technology.** New, more productive technology shifts supply right. Production at lower cost; more output from same inputs.

**3. Number of sellers.** More sellers → more supply.

**4. Expectations.** If sellers expect higher future prices, they may delay sales to capture the higher price — current supply falls. If they expect lower future prices, they may sell now — current supply rises.

**5. Taxes and subsidies.**

- Taxes on production raise sellers' costs; supply curve shifts left (up by the tax amount).
- Subsidies lower sellers' effective costs; supply curve shifts right (down by the subsidy amount).

**6. Weather and natural conditions** (for agricultural and resource markets).

**Elasticity of supply.**

$$E_s \\,=\\, \\frac{\\%\\,\\Delta Q_s}{\\%\\,\\Delta P}$$

How responsive quantity supplied is to price changes.

**Factors affecting supply elasticity.**

- **Time horizon**. Supply is more elastic in the long run. In the short run, firms can't easily build new factories. In the long run, all inputs can adjust.
- **Mobility of inputs**. If labor and capital can easily flow into the industry, supply is more elastic.
- **Storability**. Storable goods (canned food, oil) have more elastic supply than perishables (fresh fish, milk).
- **Spare capacity**. Firms running at full capacity can't easily expand output; supply less elastic.

**Producer surplus.** The economic gain to producers from selling at the market price. The difference between the price the producer receives and the minimum price they would have accepted.

Geometrically: the area between the supply curve and the price line, integrated across all units sold.

Producer surplus is part of total economic welfare.

**Consumer surplus.** The economic gain to consumers from buying at the market price. The difference between what consumers are willing to pay (shown by the demand curve) and what they actually pay (the price).

Geometrically: the area between the demand curve and the price line.

**Total surplus = consumer surplus + producer surplus.** Total welfare from market exchange.

**Market equilibrium maximizes total surplus** (under standard assumptions). At equilibrium, every transaction in which a willing buyer and a willing seller can both gain takes place. Beyond equilibrium quantity, no buyer-seller pair could mutually benefit from trading.

**Deadweight loss.** When markets aren't at equilibrium — due to taxes, subsidies, price controls, monopolies, externalities — total surplus is reduced below its maximum. The lost welfare is **deadweight loss**.

Geometrically: a triangle representing trades that *could have happened* and would have generated mutual gains but *didn't* happen because of the market distortion.

**Worked example.** Suppose equilibrium quantity is 100 cars at $30,000 each. With no tax, total surplus is some area $A$. With a $5,000 per car tax:
- Equilibrium quantity falls (some buyers can't afford or some sellers won't sell at the higher effective price).
- New price for buyers: higher than $30,000.
- Net price for sellers (after tax): lower than $30,000.
- Tax revenue = $5,000 × new quantity.
- Deadweight loss = the triangle of lost transactions.

The deadweight loss reflects mutually beneficial trades that don't happen because of the tax. Even if the tax revenue is used productively, the deadweight loss is pure inefficiency.

**Why this matters.** Most government interventions in markets (taxes, price controls) trade off some specific gain against some deadweight loss. The size of the deadweight loss depends on elasticity — bigger when supply or demand is elastic, smaller when inelastic. This is why "sin taxes" on inelastic goods (cigarettes) raise lots of revenue at relatively small deadweight loss.

**Tax incidence.** When a tax is imposed on a market, who actually bears the burden? Not always the side legally responsible for paying it.

- If demand is more inelastic than supply, buyers bear most of the tax (price they pay rises by close to the full tax amount).
- If supply is more inelastic than demand, sellers bear most.
- If elasticities are equal, the tax is split evenly.

The intuition: the side that can't easily change its behavior (the inelastic side) bears more of the tax. The flexible side (elastic) can shift its behavior to avoid the cost.

This is why cigarette taxes fall mostly on smokers (demand is highly inelastic) and not on cigarette companies. The companies pass nearly the full tax on in higher prices, and demand barely budges.

**Externalities — markets failing.** When market transactions affect third parties not party to the deal, markets don't capture the full social cost or benefit.

- **Negative externality**: pollution from a factory affects nearby residents not involved in factory transactions. Market under-prices the pollution and over-produces the polluting good.
- **Positive externality**: vaccination protects not just the vaccinated person but everyone around them. Market under-prices the social benefit and under-produces vaccination.

Government can correct externalities through:

- **Pigouvian taxes** on negative externalities (carbon tax on emissions).
- **Subsidies** for positive externalities (vaccine subsidies, education funding).
- **Regulations** (emission standards, mandatory vaccination).
- **Tradable permits** (cap-and-trade for pollution).

**Public goods.** Goods that are non-excludable (you can't prevent non-payers from using them) and non-rival (one person's use doesn't reduce another's). National defense, lighthouses, basic research, the rule of law.

Public goods are under-supplied by markets (free-rider problem). Governments typically provide them and fund them through taxes.

**Summary of welfare analysis.** In an unregulated competitive market, equilibrium maximizes total surplus (consumer + producer). Distortions — taxes, price controls, externalities — reduce total surplus. The size of the loss depends on elasticity. Some distortions are justified by other considerations (distribution, public goods, externalities), but each comes with a cost in efficiency.

**Why this matters in micro.** The supply-demand-surplus framework is the workhorse of micro analysis. Units 4–6 will analyze how different market structures (monopoly, oligopoly) affect consumer and producer surplus and produce deadweight loss. The welfare lens introduced here is what we'll use to evaluate policy throughout the course.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Supply, surplus, welfare',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.6',
      title: 'Market equilibrium and government interventions',
      content:
`When supply and demand meet, the market clears at an **equilibrium** price and quantity. Government interventions — price ceilings, price floors, taxes, subsidies, quotas, tariffs — move the market away from this equilibrium, producing predictable effects on prices, quantities, and welfare. Mastering the analysis of these interventions is essential for AP Micro.

**Equilibrium.** The price $P^*$ and quantity $Q^*$ where the supply and demand curves intersect.

At $P^*$, quantity demanded equals quantity supplied. No shortage, no surplus. The market clears.

**Disequilibrium adjustment.**

- **Price above $P^*$**: surplus (sellers have leftover inventory). Sellers cut prices. Market moves back toward equilibrium.
- **Price below $P^*$**: shortage (buyers go home empty-handed). Buyers compete, bidding up prices. Market moves back toward equilibrium.

This self-correcting behavior is what Adam Smith called the "invisible hand": decentralized self-interested actions producing coordinated market outcomes through price adjustment.

**Changes in equilibrium.** When supply or demand shifts, equilibrium changes.

**The four basic cases.**

| Change | Price | Quantity |
|--------|-------|----------|
| D increases (shifts right) | up | up |
| D decreases | down | down |
| S increases | down | up |
| S decreases | up | down |

When **demand** shifts, price and quantity move in the **same** direction (both up or both down).

When **supply** shifts, price and quantity move in **opposite** directions.

**When both shift.**

- Both D and S increase: Q definitely rises. Price effect depends on relative magnitudes.
- Both D and S decrease: Q definitely falls. Price effect depends.
- D increases, S decreases: P definitely rises. Quantity effect depends.
- D decreases, S increases: P definitely falls. Quantity effect depends.

The pattern: when both curves move in the same direction (both right or both left), quantity is unambiguous and price depends. When they move in opposite directions, price is unambiguous and quantity depends.

**Government interventions.**

**Price ceilings.** A maximum legal price, often set below equilibrium to keep prices "affordable."

Examples:
- Rent control in major cities.
- Anti-gouging laws during disasters.
- Wartime price controls.

If the ceiling is below equilibrium (binding), the result is a **shortage**. Quantity demanded exceeds quantity supplied.

Consequences:
- Persistent shortages.
- Reduced quality (sellers can't compete on price, so they compete by reducing quality).
- Black markets at higher prices.
- Rationing by other means (queues, favoritism, "key money" for apartments).
- Long-term underinvestment (developers don't build new rent-controlled units, exacerbating the housing shortage over decades).

Rent control is the textbook example. Economists generally view it as well-intentioned but counterproductive: it helps current tenants in controlled units but reduces overall housing supply and creates persistent shortages.

**Price floors.** A minimum legal price, often set above equilibrium to protect sellers.

Examples:
- Minimum wage (price floor on labor).
- Agricultural price supports (minimum prices for crops).

If the floor is above equilibrium (binding), the result is a **surplus**. Quantity supplied exceeds quantity demanded.

Consequences:
- For minimum wage: some workers gain higher pay; some lose jobs entirely. The surplus is unemployment.
- For agricultural floors: surplus crops must be bought up by the government, stored, given away, or destroyed.

The minimum wage's actual effects depend heavily on the elasticity of labor demand (contested by economists). If labor demand is inelastic, the wage gain dominates; if elastic, the employment loss dominates.

**Per-unit taxes.** A fixed tax per unit sold shifts the supply curve up by the tax amount (or equivalently, shifts demand from the seller's view down).

Effects:
- Equilibrium quantity falls.
- Price consumers pay rises.
- Price sellers receive (net of tax) falls.
- Government collects tax revenue.
- Deadweight loss: triangle of lost transactions.

**Tax incidence.** Who bears the tax burden? Depends on elasticities.

- More inelastic side bears more of the tax.
- More elastic side bears less.

Cigarette taxes are mostly paid by consumers (demand is highly inelastic). Luxury taxes are often largely paid by sellers (demand is elastic — wealthy consumers can avoid the tax by buying alternatives).

**Subsidies.** Inverse of taxes. Shift the supply curve down by the subsidy amount.

Effects:
- Equilibrium quantity rises.
- Price consumers pay falls.
- Price sellers receive (including subsidy) rises.
- Government cost: subsidy × quantity.
- Net welfare effect depends on whether the subsidy corrects an externality.

**Quotas.** Limits on the quantity that can be sold (or imported). Typically used in international trade and in some agricultural markets.

A binding quota reduces quantity below equilibrium, raises price above equilibrium, and creates "rents" (extra revenue) for those who hold quota rights. Examples: sugar import quotas, taxi medallions in many cities.

**Tariffs.** Taxes on imports. Used to protect domestic industries from foreign competition.

Effects:
- Price of imports rises by the tariff amount.
- Domestic price rises.
- Imports fall.
- Domestic production rises.
- Government collects tariff revenue.
- Consumers pay more.
- Domestic producers gain.
- Deadweight loss from reduced trade.

Tariffs benefit specific domestic producers at the cost of all consumers. Their economic effect is typically negative on net, even though they help concentrated political constituencies.

**Externalities — when markets fail.**

- **Negative externality**: third-party costs not internalized in the market. Pollution is the classic example. Without regulation or taxation, markets over-produce pollution-generating goods.
- **Positive externality**: third-party benefits not internalized. Vaccination, education, basic research.

**Pigouvian taxes** on negative externalities can correct the over-production. A carbon tax aligns the market price with the social cost of emissions. **Subsidies** on positive externalities can correct under-production (vaccine subsidies, education funding).

**Cap-and-trade systems** create tradable permits for pollution, letting markets find the cheapest ways to reduce it. Used for sulfur dioxide (acid rain reduction) and increasingly for carbon.

**Public goods.** Non-excludable and non-rival. Markets under-supply them; governments typically provide them. National defense, public lighthouses, fire protection, basic research.

**Real-world applications.**

- **Healthcare**: how do subsidies for insurance affect quantity purchased, prices, and welfare?
- **Carbon policy**: which is more efficient — carbon tax, cap-and-trade, regulation, or subsidies for clean energy?
- **Housing**: how do rent controls compare to housing vouchers for helping low-income renters? (Most economists prefer vouchers.)
- **Minimum wage**: trade-offs between wage gains for employed workers and employment losses for the most marginal workers.
- **Trade policy**: who gains and who loses from tariffs?

**Synthesis.** Market equilibrium maximizes total welfare under standard assumptions. Government interventions move the market away from this equilibrium, typically introducing trade-offs between specific gains (cheaper essential goods, higher wages, fewer imports) and overall efficiency (shortages, surpluses, deadweight loss). Whether the trade-off is worth it depends on values: how much do we care about the specific gain compared to the efficiency loss? Reasonable people often disagree, even when they agree on the underlying economics.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Market equilibrium and interventions',
        provider: 'ACDC Econ',
      },
    },
  ],
  keyConcepts: [
    'Scarcity → choice → opportunity cost. The foundation of economics.',
    'Marginal analysis: do something while MB $\\geq$ MC.',
    'Diminishing marginal utility: each additional unit gives less satisfaction.',
    'PPC shows max output combinations; concave shape from increasing OC; outward shifts = growth.',
    'Comparative advantage (lower OC) drives gains from trade; differs from absolute advantage.',
    'Terms of trade between countries\' opportunity costs benefits both.',
    'Law of demand: P↑ → Q$_d$↓ (substitution + income effects). Downward slope.',
    'Demand shifters: income (normal vs inferior), prices of substitutes/complements, tastes, expectations, buyers, demographics.',
    'Elasticity: % $\\Delta Q$ / % $\\Delta P$. Elastic > 1; inelastic < 1.',
    'TR test: elastic demand, P↑ → TR↓. Inelastic, P↑ → TR↑.',
    'Law of supply: P↑ → Q$_s$↑. Upward slope.',
    'Supply shifters: input prices, technology, sellers, expectations, taxes/subsidies, weather.',
    'Consumer surplus + producer surplus = total welfare; maximized at competitive equilibrium.',
    'Price ceilings cause shortages (rent control). Price floors cause surpluses (minimum wage).',
    'Tax incidence: less elastic side bears more.',
    'Deadweight loss = welfare lost from missed mutually-beneficial trades.',
  ],
  formulas: [
    {
      name: 'Marginal analysis',
      equation: 'Continue activity while $MB \\geq MC$',
      meaning: 'The fundamental decision rule of microeconomics. Stop when marginal cost exceeds marginal benefit.',
      example: 'Study one more hour while the score gain (MB) exceeds the value of lost sleep/leisure (MC).',
    },
    {
      name: 'Elasticity of demand',
      equation: '$E_d = \\left|\\dfrac{\\%\\,\\Delta Q_d}{\\%\\,\\Delta P}\\right|$',
      meaning: 'Responsiveness of demand to price changes. > 1 elastic; < 1 inelastic.',
      example: 'A 10% price rise causing a 5% quantity drop: $E_d = 0.5$. Inelastic.',
    },
    {
      name: 'Cross-price elasticity',
      equation: '$E_{xy} = \\dfrac{\\%\\,\\Delta Q_x}{\\%\\,\\Delta P_y}$',
      meaning: 'Responsiveness of X demand to Y price. Positive: substitutes. Negative: complements.',
      example: 'Coke and Pepsi: positive cross-price elasticity (substitutes).',
    },
    {
      name: 'Income elasticity',
      equation: '$E_i = \\dfrac{\\%\\,\\Delta Q}{\\%\\,\\Delta \\text{Income}}$',
      meaning: 'Responsiveness of demand to income. Positive normal; negative inferior; > 1 luxury.',
      example: 'Restaurant meals: $E_i \\approx 1.5$ (luxury for most households).',
    },
    {
      name: 'Total surplus',
      equation: 'Consumer surplus + Producer surplus',
      meaning: 'Total welfare from market exchange. Maximized at competitive equilibrium.',
      example: 'In a market for cars at equilibrium, consumer surplus + producer surplus measures total welfare. Taxes and price controls reduce this total.',
    },
  ],
  practice: [
    {
      q: 'A 10% rise in coffee price reduces quantity demanded by 5%. Is demand elastic or inelastic?',
      a: '$E_d = 5/10 = 0.5$. Since $|E_d| < 1$, demand is **inelastic**. Coffee drinkers don\'t cut back much when prices rise — strong preferences and few substitutes for caffeine.',
    },
    {
      q: 'USA can produce 100 cars or 50 wheat in an hour. Mexico can produce 30 cars or 60 wheat in an hour. Who has absolute advantage in cars? Who has comparative advantage?',
      a: 'USA has **absolute advantage** in cars (100 > 30 per hour) and in wheat (50 < 60... wait). Let me recompute: USA produces 100 cars OR 50 wheat (so USA\'s wheat is 50, Mexico\'s wheat is 60). USA has absolute advantage in cars only. Opportunity costs: USA, 1 car costs $50/100 = 0.5$ wheat. Mexico, 1 car costs $60/30 = 2$ wheat. USA has comparative advantage in cars (lower OC). Mexico has comparative advantage in wheat.',
    },
    {
      q: 'A binding rent control caps rents below equilibrium. Predict the effects on quantity, quality, and long-run housing supply.',
      a: 'Quantity demanded exceeds quantity supplied → shortage. Quality declines as landlords can\'t raise prices and instead cut maintenance. Long-run: developers underinvest in new construction (returns are lower), housing supply shrinks. Black markets, key money, and non-price rationing emerge.',
    },
    {
      q: 'Explain why a per-unit tax on a good with inelastic demand has a small deadweight loss and raises significant revenue.',
      a: 'When demand is inelastic, the quantity barely responds to price changes. So a tax raises the price but doesn\'t cause many trades to be cancelled. Tax revenue ($\\text{tax} \\times Q$) is large because $Q$ stays close to its pre-tax level. Deadweight loss (the lost trades) is small because few trades are forgone. This is why "sin taxes" on cigarettes and alcohol are economically attractive.',
    },
    {
      q: 'A consumer\'s marginal utility from the third slice of pizza is 5. From the fourth slice, it\'s 2. If each slice costs $3, should they buy a fourth slice?',
      a: 'Marginal benefit of slice 4 is 2 utils. Marginal cost is the price ($3) plus opportunity cost. Even if the price is $3, the MB of 2 is less than the MC. Stop at slice 3 (which had MB = 5, exceeding the cost). This illustrates diminishing marginal utility driving rational consumption decisions.',
    },
  ],
  pitfalls: [
    '"Demand and quantity demanded are the same" — different. Change in quantity demanded moves ALONG curve (price change). Change in demand SHIFTS curve.',
    '"Equilibrium is the fair price" — equilibrium is where supply equals demand. It may or may not be socially optimal.',
    '"Absolute advantage drives trade benefits" — wrong. Comparative advantage (lower opportunity cost) drives gains from trade.',
    '"Inelastic means demand doesn\'t change" — inelastic means it changes LESS THAN PROPORTIONALLY with price. A 10% price rise might still cause a 3% quantity drop.',
    '"All goods are normal goods" — inferior goods exist; demand falls when income rises (ramen, used cars).',
    '"Raising taxes always raises revenue" — only if demand is inelastic enough. If demand is elastic, raising taxes can reduce revenue (Laffer curve).',
    '"Price ceilings always help consumers" — they help SOME consumers (those who get the good) but hurt others (those facing shortages, declining quality).',
    '"Externalities are rare" — extremely common: pollution, vaccination, education, network effects, congestion.',
  ],
};
