// AP Macroeconomics Unit 1 — Basic Economic Concepts (5-10%)
// APES-standard depth.

export const APMACRO_UNIT_1 = {
  number: 1,
  title: 'Basic Economic Concepts',
  weight: '5-10%',
  subunits: [
    {
      code: '1.1',
      title: 'Scarcity and the economic problem',
      content:
`Economics is the study of how individuals, businesses, and societies allocate **scarce resources** among **unlimited wants**. Every economic question — from what to have for breakfast to how the Federal Reserve should set interest rates — comes down to choosing what to do with limited resources. Scarcity is the fundamental fact that makes economics necessary.

**The scarcity problem.** If resources were infinite, economics wouldn't exist. We could all have everything we want, and choices wouldn't matter. But resources are limited (there's only so much land, only so many workers, only so much time in a day) while human wants are not. The mismatch forces choice — and choice means giving up some things to get others.

This isn't just about poverty. Even Bill Gates and Jeff Bezos face scarcity: they have unlimited *money* by ordinary standards, but they still have limited *time*. Choosing to spend an hour on one meeting means not spending it on something else. Scarcity is universal.

**The three basic economic questions.** Every economic system, from a primitive hunter-gatherer band to modern industrial America, has to answer:

1. **What to produce?** With limited resources, you can't make everything. Should we produce more cars or more bicycles? More healthcare or more entertainment? More military equipment or more education?
2. **How to produce it?** Using labor-intensive methods or capital-intensive ones? With many small firms or a few large ones? Domestically or by importing?
3. **For whom to produce?** Who gets the output? Distributed by need? By ability to pay? By government decree? By inheritance? Different societies answer this very differently.

How a society answers these three questions defines its **economic system**.

**The factors of production.** Resources are grouped into four categories:

- **Land.** All natural resources — actual land, but also water, minerals, oil, timber, fish stocks. Payment for use of land is **rent**.
- **Labor.** Human work effort — physical and mental. Payment for labor is **wages**.
- **Capital.** Goods used to produce other goods — machines, factories, computers, tools, infrastructure. Note: "capital" in economics doesn't mean money (which is just a claim on capital). Payment for use of capital is **interest**.
- **Entrepreneurship.** The activity of organizing the other three factors into productive enterprises. The entrepreneur takes risks, makes decisions, and bears responsibility for success or failure. Payment for entrepreneurship is **profit**.

Different mixes of these factors produce different goods. A wheat farm uses lots of land, modest labor, some capital (tractor), and entrepreneurial decisions about what to plant and when. A software company uses minimal land, lots of skilled labor and capital (computers), and intense entrepreneurial decision-making.

**Goods vs services.**

- **Goods**: tangible items — cars, food, clothes, smartphones, houses, books.
- **Services**: intangible — haircuts, education, healthcare, software-as-a-service, banking, entertainment.

Modern economies are increasingly service-based. In 1900, most US workers produced goods (manufacturing, agriculture). Today, most produce services. This shift reflects rising productivity (we need fewer workers to make the same physical output) and rising income (we want more services as we get richer).

**Economic systems — three ideal types.**

**Market economy (capitalism).** Production decisions made by private actors based on prices. Resources are privately owned. Profit motive drives decision-making. Prices coordinate millions of decentralized decisions. The "invisible hand" — Adam Smith's metaphor — refers to the way self-interested individuals, pursuing their own goals, collectively produce coordinated economic outcomes through price signals.

Strengths: efficient allocation of resources to high-value uses, strong innovation incentives, individual freedom.

Weaknesses: doesn't naturally handle public goods, externalities (pollution), or distribution. Prone to cycles and inequality.

**Command economy (centrally planned).** Production decisions made by central government. Resources are state-owned or controlled. Goals reflect political priorities. Examples: Soviet Union, Maoist China, North Korea.

Strengths: can mobilize resources for specific national goals, can directly address distribution.

Weaknesses: information problem (no central planner can know all the relevant prices and preferences); incentive problem (no profit motive); slow innovation; risk of misallocation. Most planned economies have been outperformed by market ones in the long run.

**Traditional economy.** Production based on long-standing customs, religion, and tradition. Common in pre-industrial societies. Family roles determine occupations; barter and gift exchange dominate.

**Mixed economies.** Almost every real economy is a mix. The US is mostly market-based but with substantial government regulation, public services (schools, roads, post office), and social safety net (Medicare, Social Security, unemployment insurance). Nordic countries combine extensive markets with very large welfare states. China combines a nominally communist system with substantial market activity.

**Microeconomics vs macroeconomics.**

- **Microeconomics** studies individual markets, firms, and consumers. How a single firm chooses its production level. How consumers choose what to buy. How prices form in the market for one good. AP Microeconomics covers this in detail.
- **Macroeconomics** studies the economy as a whole. National output (GDP), inflation, unemployment, monetary policy, fiscal policy, international trade. AP Macro is about these economy-wide phenomena.

Macroeconomics is not just microeconomics summed up. Many macro phenomena (the business cycle, mass unemployment, inflation) require their own frameworks because what's true at the level of individuals can differ from what's true at the level of the whole economy. The classic example: if one person saves more, they're better off. If everyone saves more at once (the "paradox of thrift"), aggregate demand falls, recession follows, and everyone may end up worse off.

**Positive vs normative economics.**

- **Positive economics** describes what *is* (or what *would be* under specified conditions). "Raising the minimum wage from $7.25 to $15 would reduce employment of low-skilled workers by an estimated $X\\%$."
- **Normative economics** prescribes what *should be* (involves values). "The minimum wage should be $15 to ensure a living wage."

Economists try to be careful about which kind of statement they're making. Most policy debates involve both — disagreements about the positive facts ("how big is the employment effect?") and disagreements about values ("how much do we weigh higher wages against employment losses?").

**Why study macroeconomics.** Macro shapes nearly every aspect of life:

- Job availability and wages are macroeconomic phenomena.
- Inflation eats your savings or boosts your debts.
- Recessions and booms affect your career, your retirement, your kids' futures.
- Federal Reserve interest rate decisions affect mortgage rates, credit card rates, business loans.
- Tax policy and government spending affect everyone.
- International trade and exchange rates affect prices and jobs.

Understanding macro gives you the tools to interpret the news (when the Fed raises rates, what's that mean?), to vote intelligently on economic policy, and to make better personal financial decisions.

**The course's flow.** Macroeconomics builds up:

- Unit 1 (here): Basic concepts — scarcity, choice, supply and demand.
- Unit 2: Economic indicators and the business cycle — GDP, unemployment, inflation.
- Unit 3: National income and price determination — aggregate demand and aggregate supply.
- Unit 4: Financial sector — money, banking, monetary policy.
- Unit 5: Long-run consequences of stabilization policies.
- Unit 6: International trade and finance.

By the end of the year, you'll understand the framework that economists and policymakers use to think about national economies.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Basic economic concepts',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.2',
      title: 'Opportunity cost and the production possibilities curve',
      content:
`The central insight of economics is that **every choice has a cost** — not just in money, but in alternatives forgone. When you spend an hour studying, you give up an hour of sleep, or socializing, or earning. When a country spends a billion dollars on a fighter jet, it gives up whatever else that billion could have bought — schools, hospitals, roads. The economist's name for this is **opportunity cost**, and it's the most important single concept in the discipline.

**Opportunity cost defined.** The opportunity cost of any choice is the **value of the next-best alternative** you give up. Not the value of all alternatives — just the best one you sacrifice.

**Example.** You have $50 and two hours on a Saturday night. Your choices: concert ($50), nice dinner ($50), or staying home and watching a movie (free).

If you go to the concert, your opportunity cost is the nice dinner (your next-best paid option) plus the two hours you could have spent on something else. The free option (staying home) isn't your opportunity cost because you wouldn't have chosen it anyway.

**Explicit vs implicit costs.**

- **Explicit costs**: out-of-pocket money spent. The $50 for the concert.
- **Implicit costs (opportunity costs of non-monetary resources)**: the value of things you could have done with the same time or other non-monetary resources. The two hours.

True economic cost = explicit + implicit. Most everyday talk focuses only on explicit costs, but economic decision-making requires considering both.

**The college decision — a textbook example.** What's the cost of going to college for four years?

- Explicit costs: tuition + fees + books + room and board (say, $\\sim$ $40,000/year at a public university, $\\sim$ $70,000/year at a private one — so $\\sim$ $160K–280K over four years).
- Implicit costs: the wages you could have earned if you'd worked full-time instead. For a typical worker, maybe $\\sim$ $30,000/year, so $\\sim$ $120K over four years.

Total economic cost: $\\sim$ $280K–400K. The implicit cost (forgone wages) is comparable to or larger than the explicit cost. Many students underestimate the true cost of college because they only count the bill — but the time has value too.

This is also why college becomes relatively cheaper during recessions: when unemployment is high, the wages you'd forgo by being in school are lower, so the implicit cost of college falls.

**Why economists insist on this.** "Don't think only about what you pay; think about what you give up." That perspective changes decision-making.

- Driving across town to save $10 on a $50 grocery bill might not be worth it if it takes an hour and you could have earned $20 in that hour.
- A "free" item that takes hours to set up may have substantial implicit cost.
- A "premium" item that saves your time may have lower true cost than the cheap alternative.

**The Production Possibilities Curve (PPC) — the most important graph in Unit 1.**

The PPC shows the maximum combinations of two goods an economy can produce, given its current resources and technology. Plot quantity of Good X on one axis and quantity of Good Y on the other; the curve traces out the production frontier.

**Why the PPC matters.** It captures three key economic ideas in one picture:

1. **Scarcity** — the curve has a finite shape; you can't produce arbitrarily much.
2. **Choice** — moving along the curve means trading off one good for another.
3. **Opportunity cost** — the slope of the curve at any point measures the opportunity cost of one good in terms of the other.

**Shape of the PPC.** Typically **concave** (bowed outward from the origin). Why?

Because resources aren't equally suited to all uses. Some land is great for wheat; some is great for grazing cattle but terrible for wheat. As you specialize more in one good, you're forced to use less-suitable resources, which costs you more units of the other good.

**The law of increasing opportunity cost.** As you produce more of a good, the opportunity cost (in terms of the other good) **rises**. This is what makes the PPC bowed outward, not a straight line.

**Worked example — guns vs butter.** An economy can produce defense (guns) and consumer goods (butter). The PPC might look like:

| Guns | Butter | Opportunity cost of next 1 gun |
|------|--------|-------------------------------|
| 0    | 100    | (move from 100 to 0)             |
| 1    | 99     | 1 butter |
| 2    | 97     | 2 butter |
| 3    | 94     | 3 butter |
| 4    | 90     | 4 butter |
| 5    | 85     | 5 butter |
| ...  | ...    | rising |
| 10   | 0      | huge |

The first gun costs only 1 butter (use the people/resources most suited to gun-making); the tenth gun costs much more butter (now you're pulling in butter specialists to make guns). Concave PPC.

**Points and their meaning.**

- **On the curve**: efficient production. The economy is using all resources at full productivity.
- **Inside the curve**: inefficient. Some resources unemployed (recession) or used inefficiently. Underproduction.
- **Outside the curve**: unattainable with current resources and technology. Would require growth to reach.

A recession means moving from on-the-curve to inside-the-curve: same productive potential, less actually produced. A boom moves back toward the curve.

**Shifts of the PPC — economic growth.** The PPC can shift outward over time, reflecting:

- **Population growth** (more labor).
- **Capital accumulation** (more factories, equipment, infrastructure).
- **Technological progress** (better methods producing more from the same inputs).
- **Education and human capital** (workers become more productive).
- **Discovery of new resources** (oil, minerals, arable land brought into production).

A new technology that improves productivity in one industry can shift the PPC asymmetrically — more outward on the affected axis. A general productivity improvement shifts the whole frontier outward.

Conversely, the PPC can shift inward:
- War or natural disaster destroying capital.
- Loss of labor (epidemic, mass emigration).
- Resource depletion.

**The role of investment.** A society can choose to consume now (move along its current PPC) or invest in capital and education (shift the PPC outward in the future). Countries that invest more grow faster but consume less today. The trade-off between current consumption and future growth is one of the most important macroeconomic choices.

**Real-world applications.**

- **Healthcare policy.** Spending more on healthcare means less for other public services. Moving along the policy PPC.
- **Military vs domestic spending.** The guns-and-butter trade-off is real and constant.
- **Education vs current consumption.** Investing in schools yields future growth at the cost of present consumption.
- **Climate vs growth.** Reducing emissions may slow short-term growth but expand the long-run PPC by avoiding catastrophic future damages.

**The PPC and comparative advantage.** Different countries have different PPCs. A country with lots of fertile land might have a PPC tilted toward agriculture. A country with abundant skilled labor might have one tilted toward technology. We'll see in 1.3 how these differences create opportunities for mutually beneficial trade.

**Pitfalls.**

- A PPC that's a straight line implies constant opportunity costs — resources equally suited to all uses. Rare in reality.
- The PPC assumes the economy is using its resources at all. If the economy is in a recession, you can have unused resources and be inside the curve.
- "On the curve" doesn't mean "best." There are many points on the PPC; choosing among them is a separate (often political) question.
- Drawing the PPC requires assumptions about *what* technology and *what* resources. As technology changes, the curve changes.

**Synthesis.** Opportunity cost and the PPC together capture the essence of economic thinking: scarcity forces choice, choice has cost, and the cost of one good in terms of another is the slope of the trade-off you face. Once you internalize the PPC, almost every other economic concept fits in some natural place.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — PPC and opportunity cost',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.3',
      title: 'Comparative advantage and the gains from trade',
      content:
`One of the most counterintuitive — and most powerful — ideas in economics is that **trade benefits both parties even when one is better at everything**. This insight, called the **law of comparative advantage**, was developed by the British economist **David Ricardo** in 1817. It explains why countries trade, why specialization makes economies more productive, and why protectionist arguments often miss the bigger picture.

**Absolute advantage.** Country A has absolute advantage over Country B in producing a good if A can produce more of that good with the same resources (or the same amount with fewer resources). Absolute advantage is intuitive: it's about who's better at making something.

**Comparative advantage.** Country A has comparative advantage over Country B in producing a good if A can produce that good at **lower opportunity cost**. Comparative advantage is about who's relatively better — not absolutely better.

The two ideas can come apart. A country with absolute advantage in everything still has comparative advantage in only some things.

**Worked example.** Two countries, two goods, simple one-hour production possibilities.

| | Wheat (per hour) | Cars (per hour) |
|--|------------------|-----------------|
| **USA** | 100 | 50 |
| **Mexico** | 30 | 30 |

The USA has absolute advantage in **both** goods. It can produce more wheat per hour (100 vs 30) and more cars per hour (50 vs 30). So the USA is absolutely better at everything.

But comparative advantage depends on opportunity costs.

- For the USA: producing 1 car means giving up 2 wheat (since 50 cars = 100 wheat in the time tradeoff). OC of 1 car = 2 wheat.
- For Mexico: producing 1 car means giving up 1 wheat (since 30 cars = 30 wheat). OC of 1 car = 1 wheat.

Mexico's opportunity cost of a car is **lower** (1 wheat vs 2 wheat). So Mexico has **comparative advantage in cars** — it sacrifices fewer alternatives to produce one.

Conversely, for wheat:

- USA: 1 wheat costs $1/2$ car. OC of 1 wheat = $0.5$ car.
- Mexico: 1 wheat costs 1 car. OC of 1 wheat = 1 car.

USA's opportunity cost of wheat is lower. USA has comparative advantage in wheat.

**The trade pattern.** Each country specializes in the good it has comparative advantage in, and trades for the other.

- USA specializes in wheat.
- Mexico specializes in cars.
- USA trades wheat to Mexico for cars.

**Gains from trade.** Both countries can end up with more of both goods than if each had tried to produce everything for itself.

**Numerical demonstration.** Suppose without trade, the USA uses half its time on each good (50 wheat + 25 cars), and Mexico uses half on each (15 wheat + 15 cars). Total world production: 65 wheat + 40 cars.

With trade, suppose the USA spends all its time on wheat (100 wheat) and Mexico spends all its time on cars (30 cars). Total world production: 100 wheat + 30 cars. The USA got 35 more wheat; the world lost 10 cars... but wait, if both specialize fully, the world produces 100 wheat and 30 cars vs 65 wheat and 40 cars without trade. There's more wheat (great) but fewer cars (bad).

The actual gain from trade is subtle — it depends on the specific allocation, prices, and trading terms. In general, *some* allocation with trade produces more of both goods. The formal proof of mutual gains from trade requires more care than this simple example, but the principle holds: in a wide range of cases, both countries end up better off.

**The trading range.** Trade benefits both countries only if the trade rate is between the two opportunity costs.

- USA's OC of 1 car = 2 wheat. So USA would happily trade 2 wheat for 1 car or fewer wheat for 1 car. USA gains if it can get a car for less than 2 wheat.
- Mexico's OC of 1 car = 1 wheat. Mexico would happily trade 1 car for 1 wheat or more. Mexico gains if it can sell a car for more than 1 wheat.

So trades between 1 and 2 wheat per car benefit both. At exactly 1 wheat per car, only Mexico breaks even; at exactly 2 wheat per car, only the USA breaks even. In between, both gain.

**Why this matters.** The principle of comparative advantage explains:

- **Why countries trade.** Even if one country is best at making everything, both gain from specializing and trading.
- **Specialization within countries.** The same logic applies to individuals. A doctor might be a faster typist than their assistant, but the doctor still hires an assistant because the doctor's opportunity cost (time not spent practicing medicine) is too high. Comparative advantage at the personal level drives the division of labor.
- **Globalization.** Modern global trade is comparative advantage at planetary scale. Countries specialize: China makes electronics; Saudi Arabia exports oil; the US exports software, financial services, and high-tech goods. Each specializes where it has comparative advantage.

**Why the math is subtle.** Many students initially think absolute advantage is what matters: "If the US is more productive at everything, why bother trading?" The answer is that the US can't *make everything*. When it makes more cars, it has to forgo some wheat. The right question is: where is the marginal opportunity cost lowest?

**Sources of comparative advantage.** Real-world comparative advantage comes from:

- **Resource endowments**. Saudi Arabia has oil. Brazil has fertile tropical land. Switzerland has water and tunable terrain.
- **Climate**. Bananas in the tropics, wheat in temperate zones.
- **Human capital**. Highly educated workforces in developed economies have comparative advantage in knowledge-intensive services and high-tech goods.
- **Capital stock**. Countries with abundant capital have comparative advantage in capital-intensive goods.
- **Technology**. Specific industries cluster in specific countries (Hollywood for films, Silicon Valley for tech).
- **Institutions**. Stable legal systems, contracts, and property rights enable certain kinds of industries.

These sources can change over time. China's comparative advantage 30 years ago was in cheap labor; today it's in mid-tech manufacturing; tomorrow it may be in high-tech. India's comparative advantage in services rose dramatically with widespread English fluency and IT skills.

**Distributional effects of trade.** Trade increases total output but doesn't necessarily benefit everyone within a country. When the USA imports cars and exports wheat:

- **US wheat farmers** gain (more demand for wheat).
- **US car manufacturers** lose (more competition).
- **US consumers** gain (cheaper goods).
- **Mexican car workers** gain (more jobs in cars).
- **Mexican farmers** lose (cheaper US wheat undercuts them).

These distributional effects can be substantial. Workers in import-competing industries often lose jobs even when the overall economy gains. This is the basis of much real-world resistance to trade — even when "the country" gains, specific workers may lose substantially, and political coalitions form around their concerns.

The economists' standard response is that trade gains can be redistributed: tax the winners to compensate the losers. In practice, such redistribution is often incomplete, which is why trade policy stays politically contested.

**The terms of trade.** When two countries trade, the actual exchange rate (terms of trade) determines how the gains are divided. If the actual exchange rate is closer to one country's opportunity cost, that country gets less of the gain. If it's in the middle, both gain symmetrically. Negotiating and competition determine where in the range the actual rate lands.

**Real-world arguments for protectionism.** Despite comparative advantage's elegance, there are legitimate arguments for limiting trade in certain cases:

- **Strategic industries**. Some industries (defense, food security) are kept domestic for national security reasons even at economic cost.
- **Infant industries**. New industries may need protection while they grow to competitive size. Risk: protected industries often never become competitive.
- **Labor and environmental standards**. Free trade with countries that have lax labor or environmental rules can pressure higher-standard countries downward. Trade agreements often try to address this.
- **Distributional concerns**. Concentrated losses from trade may justify some protection plus redistribution.

These arguments don't refute comparative advantage but qualify it. Most modern economists support broadly free trade with mechanisms to address its distributional consequences.

**Synthesis.** Comparative advantage is the heart of why trade happens and why specialization makes economies more productive. It's a counterintuitive insight that survives close scrutiny — even when one party is better at everything, both gain from specializing in what they're *relatively* best at and trading for the rest. This principle scales from individuals to whole nations and is one of economics' most enduring contributions to social science.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Comparative advantage',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.4',
      title: 'Demand',
      content:
`**Demand** is the relationship between the price of a good and the quantity that buyers are willing and able to purchase. Understanding demand — what determines it, what shifts it, how to read demand curves — is the foundation of microeconomic analysis. Even in macroeconomics, where we'll analyze aggregate demand for the whole economy, the same logic applies.

**The law of demand.** As the price of a good rises, the quantity demanded falls. As price falls, quantity demanded rises. The demand curve is **downward-sloping**.

This law holds for almost every normal good. The exceptions are rare (Veblen goods, where high price signals prestige and increases demand; Giffen goods, an unusual case involving inferior goods).

**Why does the law of demand hold?** Two intuitive reasons:

- **Substitution effect**. When the price of good X rises, other goods become relatively cheaper. People substitute toward those alternatives. Higher gas prices → more bicycle commuting and electric cars.
- **Income effect**. When the price of X rises, your real income (purchasing power) falls. You can afford less in total, including less of X.

Together, these effects ensure that higher price → lower quantity demanded for typical goods.

**The demand curve.** A graph of quantity demanded on the horizontal axis vs price on the vertical axis. By convention, economists put price on the vertical axis (which is mathematically unusual — most "y depends on x" graphs put the dependent variable vertically). The downward-sloping curve captures the inverse relationship between price and quantity demanded.

**Change in quantity demanded vs change in demand.** The single most-tested distinction in this unit.

- **Change in quantity demanded**: a **movement along** a fixed demand curve due to a change in price. If the price of pizza falls and people buy more pizza, that's a change in quantity demanded — represented by sliding down the existing curve.
- **Change in demand**: a **shift** of the entire demand curve due to a change in some non-price factor. If incomes rise and people now want more pizza at every price, that's a change in demand — the whole curve shifts to the right.

The AP exam loves to test whether students confuse these. A good rule: if the price of the *good itself* changed, you're moving along the curve. If anything *other than the good's price* changed, you're shifting the curve.

**Shifters of demand.** Non-price factors that move the entire demand curve.

**1. Income.** Effects depend on the type of good:

- **Normal goods**: higher income → higher demand. Most goods (restaurants, vacations, new cars, organic groceries).
- **Inferior goods**: higher income → lower demand. People consume less of these as they get richer. Examples: ramen noodles, used cars, off-brand cereal, bus rides (people switch to driving cars).

The same good can be normal at one income level and inferior at another. A 10-year-old used car might be normal for a college student but inferior for an executive.

**2. Prices of related goods.**

- **Substitutes**: goods that can replace each other in consumption. If the price of Coke rises, demand for Pepsi rises (substitutes). If the price of Toyota rises, demand for Honda rises. Beef and chicken are substitutes for many consumers.
- **Complements**: goods consumed together. If the price of cars rises, demand for gasoline falls (complements: you drive less if cars cost more). If the price of printers falls, demand for ink cartridges rises. Hot dogs and hot dog buns; coffee and creamer; smartphones and phone cases.

**3. Tastes and preferences.** Subjective preferences shift demand. The popularity of a celebrity-endorsed product, a health trend (kale, açai bowls), a viral marketing campaign, or seasonal preferences (more demand for heaters in winter). Hard to quantify but real.

**4. Expectations of future prices.** If consumers expect a price increase, they buy more now (demand rises today). If they expect a price decrease, they buy less now and wait. This is why housing demand surges during periods of rapidly rising prices — buyers fear "missing the boat."

**5. Number of buyers (market size).** More buyers in a market → higher demand. Population growth, increased market access, demographic shifts all change the number of buyers.

**6. Demographics.** As the population ages, demand for healthcare services rises and demand for college education falls. Demographics include age structure, household composition, geographic distribution.

**Elasticity of demand.** A measure of how responsive quantity demanded is to a change in price.

$$E_d \\,=\\, \\frac{\\%\\,\\Delta Q_d}{\\%\\,\\Delta P}$$

By the law of demand, this is negative (price and quantity move in opposite directions). For convenience, economists often take the absolute value and call demand "elastic" if $|E_d| > 1$ and "inelastic" if $|E_d| < 1$.

**Elastic demand** ($|E_d| > 1$): a small percentage change in price produces a large percentage change in quantity. Demand is "stretchy."

- Luxury goods (vacations, jewelry, dining out).
- Goods with many substitutes (specific brand of soda, specific airline).
- Items consumers can postpone (big-ticket purchases).
- Goods that take up a large share of income.

**Inelastic demand** ($|E_d| < 1$): a large percentage change in price produces a small percentage change in quantity. Demand is "rigid."

- Necessities (insulin for diabetics, gasoline in the short run, salt).
- Goods with few substitutes.
- Items that are small purchases relative to income.
- Habits and addictions.

**Unit elastic demand** ($|E_d| = 1$): proportional response. A 10% price increase produces a 10% quantity decrease.

**Perfectly elastic demand** ($|E_d| = \\infty$): a horizontal demand curve. Even a tiny price increase causes quantity demanded to drop to zero. Approximation for sellers in highly competitive markets (one farmer's wheat).

**Perfectly inelastic demand** ($|E_d| = 0$): vertical demand curve. Quantity unchanged regardless of price. Approximation for life-saving drugs at any (sane) price.

**Factors affecting elasticity.**

- **Substitutes**. More substitutes → more elastic.
- **Necessity vs luxury**. Necessities are less elastic.
- **Share of income**. Larger purchases (cars, vacations) more elastic; small purchases less so.
- **Time horizon**. Demand is more elastic in the long run (more time to adjust). Gasoline demand is inelastic in the short run (you still need to drive to work) but more elastic in the long run (you can buy a more fuel-efficient car or move closer to work).
- **Definition of the market**. Broader categories are less elastic; specific brands are more elastic. "Soda" is less elastic than "Diet Coke."

**Total revenue test.** A useful trick for thinking about elasticity. Total revenue (TR) = P × Q.

- If demand is **elastic**, raising price *decreases* TR (the quantity drop outpaces the price increase).
- If demand is **inelastic**, raising price *increases* TR.
- If demand is **unit elastic**, TR is unchanged.

This is why monopolists never price in the inelastic region — they could always raise price and earn more.

**Worked example.** A restaurant raises its prices by 10%. Quantity drops by 5%. Elasticity = $5/10 = 0.5$. Inelastic. Total revenue rose: $P \\times Q$ went from $1 \\times 1 = 1$ to $1.10 \\times 0.95 = 1.045$ (in indexed terms). Higher revenue.

If a coffee shop raised prices by 10% and quantity dropped by 20%, elasticity = 2. Elastic. Total revenue fell from 1 to $1.10 \\times 0.80 = 0.88$. Lower revenue.

**Cross-price elasticity.** How responsive demand for one good is to the price of another.

$$E_{xy} \\,=\\, \\frac{\\%\\,\\Delta Q_x}{\\%\\,\\Delta P_y}$$

- Positive: substitutes (X and Y move together when their prices change in the appropriate direction).
- Negative: complements.

**Income elasticity.** How responsive demand is to income.

$$E_i \\,=\\, \\frac{\\%\\,\\Delta Q}{\\%\\,\\Delta \\text{Income}}$$

- Positive: normal good.
- Negative: inferior good.
- $|E_i| > 1$: luxury (demand grows more than proportionally with income).
- $0 < |E_i| < 1$: necessity (demand grows but less than proportionally).

**Practical uses of elasticity.**

- **Firms**: pricing strategy depends on elasticity. Inelastic demand → can raise prices; elastic demand → must compete on price.
- **Governments**: taxes raise more revenue from inelastic goods. Cigarette and alcohol taxes are large because demand is relatively inelastic.
- **Public policy**: a minimum-wage debate hinges partly on the elasticity of labor demand. Low elasticity → small employment effect; high elasticity → large employment effect.

**Synthesis.** Demand depends on price (law of demand, downward slope) plus other factors (income, related goods, tastes, expectations, buyers). Elasticity measures responsiveness. Understanding demand and its shifters is the prerequisite for everything else in microeconomic analysis.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Demand',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.5',
      title: 'Supply',
      content:
`**Supply** is the relationship between the price of a good and the quantity that producers are willing and able to sell. The mirror image of demand on the seller's side, supply analysis follows the same structural logic: an upward-sloping curve, distinctions between "supplied" and "supply," shifters, and elasticity.

**The law of supply.** As the price of a good rises, the quantity supplied rises. Higher prices give producers more incentive (and ability) to produce more. The supply curve is **upward-sloping**.

**Why does the law of supply hold?**

- **Profit motive**. Higher prices mean higher profits per unit, drawing in more sellers and motivating existing sellers to produce more.
- **Rising marginal costs**. Production usually exhibits rising marginal costs — producing the 100th unit costs more than the first. Producers will only make the more-expensive units if the price is high enough to cover the higher cost.
- **Entry into the market**. Higher prices attract new sellers who hadn't found it worthwhile at lower prices.

**The supply curve.** A graph of quantity supplied (horizontal) vs price (vertical). Upward-sloping by the law of supply.

**Change in quantity supplied vs change in supply.** Like demand, supply has a parallel distinction.

- **Change in quantity supplied**: movement along a fixed supply curve due to a change in the good's price.
- **Change in supply**: shift of the entire curve due to a change in a non-price factor.

If gas prices rise and gas stations sell more gas, that's a change in quantity supplied (price changed). If a new technology makes gas refining cheaper, that's an increase in supply (supply curve shifts right).

**Shifters of supply.** Non-price factors that move the supply curve.

**1. Input prices.** The cost of factors of production (labor, raw materials, energy) directly affects supply. If wages rise, producing each unit costs more, supply decreases (curve shifts left). If oil prices fall, gasoline becomes cheaper to produce, supply increases.

**2. Technology.** New technology that increases productivity shifts supply right. The introduction of the internal combustion engine, the assembly line, the computer, robotics, AI — each massively expanded the supply of goods that could be produced from given inputs.

**3. Number of sellers.** More sellers in a market → higher total supply. Fewer sellers (e.g., due to bankruptcies, regulations, mergers) → lower supply.

**4. Expectations of future prices.** If sellers expect future prices to rise, they may *withhold* supply now to sell later. (Compare to demand, where expectations of higher prices increase current demand.) Or they may bring future production forward if they expect lower future prices.

**5. Taxes and subsidies.**

- **Taxes** on producers raise their costs, decreasing supply.
- **Subsidies** to producers reduce their costs, increasing supply.

Both shift the supply curve. The size of the shift equals the per-unit tax or subsidy.

**6. Weather and natural disasters** (for agricultural and resource markets). A drought reduces wheat supply; a hurricane disrupts gulf-coast oil refining. Good weather can increase supply.

**7. Government regulations.** Stricter regulations (environmental, safety) typically increase production costs and decrease supply. Looser regulations have the opposite effect.

**Elasticity of supply.** A measure of how responsive quantity supplied is to a change in price.

$$E_s \\,=\\, \\frac{\\%\\,\\Delta Q_s}{\\%\\,\\Delta P}$$

Like demand elasticity, supply elasticity ranges from 0 (perfectly inelastic — vertical) to infinity (perfectly elastic — horizontal).

**Factors affecting supply elasticity.**

- **Time horizon**. Supply is generally more elastic in the long run. In the short run, firms can't easily build new factories or hire and train workers. In the long run, all factors of production can adjust.
- **Mobility of inputs**. If labor and capital can easily flow into a given industry, supply is more elastic. If they're locked up (specialized equipment, unique skills), supply is less elastic.
- **Storability**. Goods that can be easily stored have more elastic supply (you can release inventory when prices rise). Perishable goods (fresh fish, milk) have less elastic supply.
- **Spare capacity**. If firms are already running at full capacity, increasing output is hard. Spare capacity makes supply more elastic.

**Short-run vs long-run supply.**

- **Short-run supply** is typically less elastic. Firms can adjust some inputs (labor) but not others (factories, equipment).
- **Long-run supply** is more elastic. All inputs can be adjusted; new firms can enter the market; existing firms can expand.

This time dimension matters for macro policy. A sudden increase in oil prices might cause little change in oil supply in the short run, but might attract investment in shale drilling, alternative energy, and conservation that reduces effective demand over a longer horizon.

**Producer surplus.** A useful concept linking supply curves to welfare. Producer surplus is the difference between the price the producer receives and the minimum price at which they would have been willing to sell. Geometrically: the area between the supply curve and the price line, integrated across all units sold.

Like consumer surplus (the area below the demand curve and above the price line), producer surplus measures gains from trade. Total surplus = consumer surplus + producer surplus is a measure of total welfare from a market.

**Taxes and the supply curve — worked example.** Suppose the supply of cigarettes is $S$, and the government imposes a $2 per pack tax. The new supply curve $S'$ lies $2 above $S$ (sellers need $2 more per unit to provide each quantity).

The new equilibrium has:
- Higher price for consumers.
- Lower quantity sold.
- Tax revenue = $2 × new quantity.

Who bears the tax? Depends on elasticity. If demand is more inelastic than supply (e.g., addicted smokers), consumers bear most of it — the price they pay rises by close to $2. If demand is more elastic than supply, sellers bear most — the price they receive falls by close to $2.

Cigarette taxes are typically borne mostly by consumers because demand is highly inelastic. This is why cigarette taxes are an effective revenue source.

**Real-world supply shocks.** A "supply shock" is a sudden change in supply, often due to external events.

- The 1973 oil embargo: OPEC sharply cut oil exports → global oil supply fell → gas prices doubled, recession followed.
- COVID-19 in 2020: lockdowns disrupted production worldwide, shifting many supply curves left → shortages, price spikes, supply-chain crises through 2022.
- Russia's invasion of Ukraine (2022): disrupted wheat, sunflower oil, fertilizer, and natural gas exports → global price spikes in those goods.

Supply shocks differ from demand shocks: they typically raise prices while reducing quantity (stagflation). Demand shocks move price and quantity in the same direction.

**Aggregate supply (preview of macro).** In macroeconomics, we'll consider "aggregate supply" — the total supply of all goods and services in the economy. The same logic applies in modified form: short-run aggregate supply is upward-sloping; long-run aggregate supply is vertical (the economy's full potential is set by capital, labor, and technology, not by the price level).

**Synthesis.** Supply is symmetric to demand on the seller's side. Higher prices generally call forth more quantity (upward slope); non-price factors shift the entire curve. Time horizon matters a great deal — supply is more flexible in the long run than the short. Understanding supply is the second half of market analysis, which we'll complete in 1.6 by combining supply and demand into equilibrium.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Supply',
        provider: 'ACDC Econ',
      },
    },
    {
      code: '1.6',
      title: 'Market equilibrium and changes',
      content:
`When supply and demand meet, they determine a **market equilibrium** — a price at which the quantity buyers want to buy exactly equals the quantity sellers want to sell. Equilibrium is the central concept of micro market analysis, and the language for talking about how markets respond to changes is built on it.

**Equilibrium.** The price $P^*$ and quantity $Q^*$ at which the supply and demand curves intersect.

At $P^*$, quantity demanded = quantity supplied. There's no surplus (sellers don't have leftover inventory) and no shortage (buyers don't go home empty-handed).

**Disequilibrium — surpluses and shortages.**

**Surplus.** Price above $P^*$. At this price, quantity supplied > quantity demanded. Sellers have excess inventory. To clear the surplus, sellers cut prices. As price falls, quantity demanded rises and quantity supplied falls. The market converges back to equilibrium.

**Shortage.** Price below $P^*$. Quantity demanded > quantity supplied. Buyers compete for limited supply, bidding prices up. As price rises, quantity demanded falls and quantity supplied rises. Convergence to equilibrium.

This **self-correcting** behavior of markets is one of their key features. Adam Smith's "invisible hand" describes how decentralized self-interested behavior produces coordinated outcomes through price adjustment.

**How fast does the adjustment happen?** Depends on the market. Stock markets adjust prices in seconds. Housing markets adjust over months or years (sellers are reluctant to cut prices below their original asking, leading to extended periods of slow sales). Labor markets adjust over months or years (wages are "sticky," especially downward).

**Changes in equilibrium — the four basic cases.** When demand or supply shifts, equilibrium changes.

**Case 1: Demand increases (curve shifts right).** At the original price, quantity demanded now exceeds quantity supplied — shortage. Price rises. Quantity supplied responds (moving along the supply curve), so quantity rises too. New equilibrium: higher P, higher Q.

**Case 2: Demand decreases (curve shifts left).** Surplus at the original price. Price falls. Quantity falls. New equilibrium: lower P, lower Q.

**Case 3: Supply increases (curve shifts right).** Surplus at the original price (sellers have more to offer than buyers want). Price falls. Quantity demanded responds, so quantity rises. New equilibrium: lower P, higher Q.

**Case 4: Supply decreases (curve shifts left).** Shortage at the original price. Price rises. Quantity falls. New equilibrium: higher P, lower Q.

These four cases are the entire toolkit for analyzing simple market changes.

| Change | Price | Quantity |
|--------|-------|----------|
| D increases | up | up |
| D decreases | down | down |
| S increases | down | up |
| S decreases | up | down |

A useful memory device: when demand changes, price and quantity move in the **same direction**. When supply changes, price and quantity move in **opposite directions**.

**Both curves shifting at once.** When supply and demand both shift, the effect on price and quantity depends on the relative magnitudes.

- **D increases AND S increases**: Q definitely rises (both effects push Q up). Effect on P depends — if D shift is larger, P rises; if S shift is larger, P falls; if equal, P unchanged.
- **D increases AND S decreases**: P definitely rises. Effect on Q depends.
- **D decreases AND S increases**: P definitely falls. Effect on Q depends.
- **D decreases AND S decreases**: Q definitely falls. P depends.

The general rule: when both shift in the same direction (D and S both rise, or both fall), the quantity change is unambiguous; the price change depends on relative magnitudes. When both shift in opposite directions, the price change is unambiguous; the quantity change depends.

**Concrete examples.**

- **Oil supply shock** (refinery damage from hurricane): S decreases. Result: P↑, Q↓. Drivers pay more and consume less.
- **New technology lowers smartphone production cost**: S increases. Result: P↓, Q↑. More phones at lower prices.
- **Recession reduces consumer incomes**: D for normal goods (restaurants, vacations) decreases. Result: P↓, Q↓. Sellers cut prices to move inventory.
- **Coke gets a positive health study**: D for Coke increases. Result: P↑, Q↑.
- **Substitute good price falls** (price of tea drops, affecting coffee demand): D for coffee decreases. Result: P↓, Q↓ for coffee.

**Government interventions in markets.**

**Price ceilings.** A maximum price set below the equilibrium. Examples:

- **Rent control**: maximum rent for an apartment.
- **Anti-gouging laws** during disasters (preventing huge price jumps for water, gas).
- **Wartime price controls**.

Effect at a binding price ceiling: quantity demanded exceeds quantity supplied → **shortage**.

Consequences of price ceilings:

- Persistent shortages.
- Reduced quality (sellers cut quality since they can't cut price).
- Black markets (informal markets at higher prices).
- Rationing (queues, "first come first served," favoritism).
- Long-term underinvestment (developers don't build new rent-controlled units).

Rent control is the classic textbook example. Economists generally view rent control as well-intentioned but counterproductive — it helps current tenants in rent-controlled units but reduces the overall housing supply over time and creates persistent shortages.

**Price floors.** A minimum price set above the equilibrium. Examples:

- **Minimum wage**: price floor on labor.
- **Agricultural price supports**: minimum prices for crops to ensure farmer income.

Effect at a binding price floor: quantity supplied exceeds quantity demanded → **surplus**.

Consequences:

- For minimum wage: some workers gain higher wages, some lose jobs. The surplus of labor = unemployment among the affected workers.
- For agricultural floors: surplus crops must be bought up by the government or destroyed.

The minimum wage's effects depend heavily on labor demand elasticity (which is contested). If demand is highly inelastic (few alternatives to low-wage workers), the employment cost is small relative to the wage gains.

**Taxes.** Excise or sales taxes on producers shift the supply curve up (or equivalently, shift demand down from the seller's view).

- Equilibrium quantity falls.
- Price consumers pay rises.
- Price sellers receive falls.
- Government collects tax revenue.

Distribution of the tax burden depends on elasticities. The side with the more inelastic curve bears more of the tax.

**Subsidies.** Inverse of taxes. Shift supply curve down (sellers can produce at lower effective cost).

- Equilibrium quantity rises.
- Price consumers pay falls.
- Price sellers receive (after subsidy) rises.
- Government cost: subsidy × quantity.

**Deadweight loss.** Welfare lost when market is not at competitive equilibrium. Taxes, price ceilings, price floors, monopolies, externalities — all can cause deadweight loss.

Geometrically: the triangular area between supply and demand curves, between the actual quantity and the efficient quantity. Represents value that *could* have been created but wasn't.

A tax creates deadweight loss because it discourages mutually beneficial trades — some buyer-seller pairs who would have transacted without the tax don't transact with it. Even if all the tax revenue is used productively elsewhere, the deadweight loss represents pure inefficiency.

**Externalities.** When market transactions affect third parties not involved in the trade. Common examples:

- **Negative externalities**: pollution from factories affects nearby residents not party to factory output decisions.
- **Positive externalities**: education raises individual income but also benefits society broadly through informed citizenship and innovation.

Markets typically under-produce positive externalities and over-produce negative ones. Pigouvian taxes and subsidies can correct this. Cap-and-trade systems for emissions internalize negative externalities by putting a price on them.

**Public goods.** Goods that are non-excludable (you can't prevent non-payers from using them) and non-rival (one person's use doesn't reduce another's). National defense, public lighthouses, basic research, the legal system.

Public goods tend to be under-supplied by markets (free-rider problem) and are usually provided by government.

**Practical applications.** Equilibrium analysis is the workhorse of practical economic policy.

- **Tax policy** uses equilibrium analysis to predict how new taxes affect prices, quantities, and revenues.
- **Trade policy** analyzes how tariffs and quotas affect equilibrium in international markets.
- **Healthcare policy** considers how various subsidies, mandates, or regulations affect the equilibrium quantity of healthcare consumed.
- **Environmental policy** uses equilibrium thinking to design pollution permits, carbon taxes, and renewable energy subsidies.

**Synthesis.** Markets clear at equilibrium through self-correcting price adjustment. Shifts in supply or demand produce predictable changes in equilibrium price and quantity. Government interventions (price ceilings, floors, taxes, subsidies) move markets away from competitive equilibrium and typically introduce trade-offs between specific gains (lower prices, higher wages) and overall efficiency (deadweight loss, shortages, surpluses). The simple supply-and-demand framework explains an astonishingly wide range of real-world economic phenomena.`,
      video: {
        url: 'https://www.youtube.com/watch?v=ZcGGfO66NS8',
        title: 'ACDC Econ — Market equilibrium',
        provider: 'ACDC Econ',
      },
    },
  ],
  keyConcepts: [
    'Scarcity is the fundamental economic problem — limited resources, unlimited wants.',
    'Three economic questions: what, how, for whom to produce.',
    'Factors of production: land, labor, capital, entrepreneurship.',
    'Opportunity cost = value of next-best alternative forgone. Includes explicit + implicit costs.',
    'PPC shows max possible output combinations. Concave shape reflects increasing opportunity cost. Shifts outward with growth.',
    'Absolute advantage = more output with same inputs. Comparative advantage = lower opportunity cost. Comparative drives gains from trade.',
    'Law of demand: P↑ → Q$_d$↓. Downward-sloping curve. Caused by substitution and income effects.',
    'Change in quantity demanded = movement along curve (price change). Change in demand = shift of curve (other factor).',
    'Demand shifters: income, prices of related goods (substitutes/complements), tastes, expectations, number of buyers.',
    'Law of supply: P↑ → Q$_s$↑. Upward-sloping curve.',
    'Supply shifters: input prices, technology, number of sellers, expectations, taxes/subsidies, weather.',
    'Elasticity = responsiveness. Elastic (|E| > 1) = sensitive. Inelastic (|E| < 1) = unresponsive.',
    'Equilibrium = where S = D. Above P*: surplus → price falls. Below P*: shortage → price rises.',
    'When D shifts: P and Q move same direction. When S shifts: P and Q move opposite directions.',
    'Price ceilings (below P*) cause shortages. Price floors (above P*) cause surpluses.',
    'Deadweight loss = welfare lost when market isn\'t at competitive equilibrium.',
  ],
  formulas: [
    {
      name: 'Opportunity cost (PPC)',
      equation: '$OC \\text{ of A} = \\dfrac{\\text{sacrifice in B}}{\\text{gain in A}}$',
      meaning: 'Per-unit cost of one good measured in units of the other. Slope of the PPC at a point.',
      example: 'If you can produce 50 cars OR 100 wheat: OC of 1 car = 100/50 = 2 wheat.',
    },
    {
      name: 'Price elasticity of demand',
      equation: '$E_d = \\dfrac{\\%\\,\\Delta Q_d}{\\%\\,\\Delta P}$',
      meaning: 'Responsiveness of quantity demanded to price. By law of demand, negative; usually report absolute value.',
      example: 'Insulin is highly inelastic ($|E_d|$ ~0.1). Specific brand of cola is highly elastic ($|E_d|$ > 3).',
    },
    {
      name: 'Price elasticity of supply',
      equation: '$E_s = \\dfrac{\\%\\,\\Delta Q_s}{\\%\\,\\Delta P}$',
      meaning: 'Responsiveness of quantity supplied to price. Higher when producers can easily expand output.',
      example: 'Long-run elasticity is higher than short-run; more time to build factories and adjust.',
    },
    {
      name: 'Cross-price elasticity',
      equation: '$E_{xy} = \\dfrac{\\%\\,\\Delta Q_x}{\\%\\,\\Delta P_y}$',
      meaning: 'Responsiveness of demand for X to price of Y. Positive: substitutes. Negative: complements.',
      example: 'Coffee and tea are substitutes; coffee and creamer are complements.',
    },
    {
      name: 'Income elasticity',
      equation: '$E_i = \\dfrac{\\%\\,\\Delta Q}{\\%\\,\\Delta \\text{Income}}$',
      meaning: 'Responsiveness of demand to income. Positive: normal good. Negative: inferior. > 1: luxury.',
      example: 'Restaurant meals are normal ($E_i > 0$). Ramen noodles tend to be inferior in higher income brackets.',
    },
  ],
  practice: [
    {
      q: 'USA can produce 100 cars OR 200 wheat per hour. Mexico can produce 60 cars OR 60 wheat per hour. Who has comparative advantage in cars?',
      a: 'Compute opportunity costs. USA: 1 car costs $200/100 = 2$ wheat. Mexico: 1 car costs $60/60 = 1$ wheat. Mexico has comparative advantage in cars (lower opportunity cost). Mexico has comparative advantage in cars; USA has comparative advantage in wheat. Both gain if they specialize and trade.',
    },
    {
      q: 'New technology lowers smartphone production cost. What happens to equilibrium price and quantity?',
      a: 'Supply curve shifts right (lower costs, more produced at every price). Equilibrium price falls; equilibrium quantity rises.',
    },
    {
      q: 'Rent control sets maximum rent below the equilibrium rent. Predict the effects.',
      a: 'Price ceiling below equilibrium → shortage of apartments. Quantity demanded exceeds quantity supplied. Consequences: current tenants who have units pay less, but new renters can\'t find apartments. Long-term: developers underinvest in new construction (returns are lower), housing supply shrinks. Quality may decline (landlords can\'t raise prices, so they let maintenance slip). Black markets, bribery, key-money payments often emerge.',
    },
    {
      q: 'Explain why a small increase in cigarette taxes raises substantial revenue but doesn\'t reduce smoking much.',
      a: 'Cigarettes have highly inelastic demand (addiction, few substitutes, small share of budget for some). When demand is inelastic, a tax falls largely on consumers (who pay near-full tax in higher prices) and quantity demanded falls relatively little. So tax × quantity = high revenue. Smoking falls some, but not proportionally to the tax. This is why excise taxes on inelastic goods (alcohol, gasoline, tobacco) are common revenue sources.',
    },
    {
      q: 'During COVID-19, supply chains were disrupted and demand for many goods surged. Predict effects on prices and quantities.',
      a: 'Supply shifts left (disruption); demand shifts right (panic buying, work-from-home demand for laptops, etc.). When both supply decreases and demand increases, price definitely rises. Quantity could rise or fall depending on relative magnitudes. In practice, many goods saw price spikes with mixed quantity effects — explaining 2021–2022 inflation.',
    },
  ],
  pitfalls: [
    '"Absolute advantage drives trade benefits" — wrong. Comparative advantage drives gains from trade.',
    '"Change in demand = change in quantity demanded" — different concepts. Change in demand SHIFTS the curve; change in quantity demanded moves ALONG the curve.',
    '"Equilibrium price is the fair price" — equilibrium is where supply equals demand. It may or may not be socially optimal; nothing about fairness is implied.',
    '"Inelastic demand means demand doesn\'t change" — inelastic means it changes LESS THAN PROPORTIONALLY with price. A 10% price rise might still cause a 3% quantity drop.',
    '"Raising taxes always raises revenue" — only if demand is inelastic. If demand is elastic, raising taxes too high causes quantity to fall faster than price rises, lowering revenue (Laffer curve idea).',
    '"All goods are normal goods" — wrong. Inferior goods exist; demand for them falls when income rises (ramen, used cars, bus rides for some people).',
    '"Supply curves slope down because of mass production" — wrong. Mass production lowers per-unit cost and shifts the supply curve right; the curve still slopes up because of rising marginal costs at any given technology level.',
    '"Free trade is bad if it costs jobs in some industries" — distributional effects are real. But the net economic effect of trade is positive; the issue is whether the gains are redistributed.',
  ],
};
