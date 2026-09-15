// APES Unit 3 — Populations — full teaching content.
// Population dynamics, life history, demographic transition.


export const APES_UNIT_3 = {
  number: 3,
  title: 'Populations',
  weight: '10-15%',
  fit: 'core',
  notes: 'Population meter follows a demographic-transition curve. The famine accelerator below food = 20 illustrates carrying capacity exactly.',
  weeks: [7, 9],
  subunits: [
    {
      code: '3.1',
      title: 'Generalist and specialist species',
      content:
`The generalist–specialist distinction is one of the most useful frameworks in ecology. It explains why some species thrive in disturbed environments while others collapse, why island ecosystems are vulnerable, and why climate change selects strongly for generalists. Understanding the trade-offs is essential.

**Generalist species.** Tolerate a wide range of environmental conditions and eat a wide range of food. They have broad fundamental niches — the full range of conditions and resources they can use. Examples:
- Raccoons: eat fruits, nuts, insects, fish, eggs, small mammals, garbage. Live in forests, swamps, suburbs, cities. Range across most of North America.
- Coyotes: similar dietary flexibility; expanded from western North America to most of the continent including major cities.
- Cockroaches: eat almost anything organic; tolerate wide temperature and humidity ranges.
- House sparrows, rats, pigeons: synanthropic species (live with humans).
- Humans: the ultimate generalist; live from tropical rainforest to Arctic tundra; eat across every trophic level.

Advantages: easy to find food; can switch to new resources when one is scarce; can establish in new environments. Generalists are typically the "winners" in disturbed ecosystems.

Disadvantages: rarely the most efficient user of any one resource; tend to be outcompeted by specialists in stable specialized niches.

**Specialist species.** Thrive in a narrow niche — specific food, specific habitat, specific environmental conditions. Examples:
- Giant pandas: bamboo specialists. Eat bamboo, very little else. Limited to bamboo forests in mountainous China.
- Koalas: eat eucalyptus, very little else. Each koala specializes in a few eucalyptus species.
- Snail kites: birds that eat almost exclusively apple snails. Range tied to wetlands that support these snails.
- Iiwi (Hawaiian honeycreeper): drinks nectar from specific Hawaiian native plants.
- Black-footed ferrets: eat prairie dogs, almost exclusively.

Advantages: highly efficient users of their specific resource; reduced competition from generalists in their niche; specialized morphology and behavior optimized.

Disadvantages: cannot easily switch foods or habitats. Vulnerable when their resource declines. Most endangered species are specialists.

**The trade-off framework.** Niche breadth involves a trade-off between efficiency and flexibility. Specialists are more efficient in their narrow niche but inflexible; generalists are less efficient but adaptable. The optimal strategy depends on environmental conditions.

**Stable vs disturbed environments.** Stable environments favor specialists (consistent resources allow optimization). Disturbed environments favor generalists (changing conditions punish narrow strategies).

Climate change is a massive ongoing disturbance, selecting for generalists. We see this in:
- Disease vectors (mosquitoes, ticks) expanding their range
- Pest species (rats, cockroaches, lanternflies) thriving
- Generalist predators (coyotes, raccoons, crows) gaining ground while specialists decline

**Island biogeography and specialists.** Islands typically have many specialist species due to long evolutionary isolation. Many of these can't tolerate environmental change. Hawaiian honeycreepers — once a diverse radiation of specialists — have lost most species to climate change, invasive species, and disease.

**Trophic specialization.** Beyond habitat, species can specialize in particular trophic levels. Trophic specialists (top predators, primary consumers of specific plants) are typically more vulnerable than trophic generalists (omnivores).

**Niche width and population dynamics.** A species with narrow niche has its abundance closely tied to its specific resource. Apple snails decline → snail kites decline. Bamboo flowering cycles → panda population fluctuations. Generalist populations are more buffered.

**Why this matters for conservation.** Specialist species are over-represented in extinction risk assessments. Recovery plans for specialists often require restoring specific habitats; recovery plans for generalists can sometimes proceed with general habitat protection.

**Human as ultimate generalist.** Our species can live almost anywhere, eat almost anything. This is why humans have spread to ~150 million sq km of land. Most other species are restricted to specific climates and ecosystems.

**Key facts:**
- Generalists: wide niche, flexible, do well in disturbed environments. Raccoons, coyotes, rats, cockroaches, humans.
- Specialists: narrow niche, efficient, vulnerable to disturbance. Pandas, koalas, snail kites, most endangered species.
- Climate change selects for generalists.
- Island species are often specialists.
- Trade-off: efficiency in narrow niche vs flexibility across niches.`,
    },
    {
      code: '3.2',
      title: 'K-selected and r-selected species',
      content:
`The r/K selection theory (MacArthur and Wilson 1967) describes two contrasting life-history strategies. r-selected species are pioneers and weeds — fast-reproducing, short-lived, opportunistic. K-selected species are climax-community dominants — slow-reproducing, long-lived, competitive. The framework explains why species respond differently to disturbance and predicts which species will dominate which environments.

**r-selected (r-strategists).** "r" refers to the intrinsic rate of population growth.

Characteristics:
- High reproductive rate (many offspring)
- Small body size
- Short lifespan
- Early sexual maturity
- Little or no parental care
- High juvenile mortality
- Boom-and-bust population dynamics
- Tolerate environmental variability
- Pioneer species in disturbed habitats

Examples: bacteria, fungi, insects (especially mosquitoes, flies, aphids), annual plants, dandelions, many small fish, weedy species.

Strategy: produce so many offspring that even with high mortality, enough survive to maintain populations. Quickly exploit available resources. When conditions become harsh, populations crash, but rapid reproduction means they bounce back when conditions improve.

Habitat: disturbed environments — recently burned areas, disturbed soil, agricultural fields, eutrophied waters, recently flooded zones.

**K-selected (K-strategists).** "K" refers to carrying capacity.

Characteristics:
- Low reproductive rate (few offspring)
- Large body size
- Long lifespan
- Late sexual maturity
- Heavy parental care
- Low juvenile mortality (survival of offspring is high)
- Stable populations near carrying capacity
- Vulnerable to environmental change
- Climax community dominants

Examples: elephants, whales, condors, sea turtles, sharks, primates including humans, oak trees, redwoods, gorillas.

Strategy: produce few offspring but invest heavily in each. Slow growth and high survival rate. Compete effectively with other K-strategists for limiting resources.

Habitat: stable, mature ecosystems. Tropical rainforests (mature ones), coral reefs, climax temperate forests.

**The continuum.** Real species don't fit neatly into r or K. Most are intermediate. Frogs are arguably r-strategists (many eggs, little care, high juvenile mortality) but adult frogs are long-lived. Maple trees produce many seeds (r-like) but are long-lived and slow-maturing (K-like). The framework is a useful spectrum, not strict categories.

**Population growth curves.** r-selected and K-selected species typically show different growth patterns.

r-selected populations often show exponential growth (J-shaped curve) followed by abrupt collapse when resources run out. Populations boom in good years, crash in bad years.

K-selected populations show logistic growth (S-shaped curve) approaching carrying capacity. Populations stay near K with small fluctuations.

**Reproduction and conservation.** K-selected species are far more vulnerable to overhunting, habitat loss, and other pressures than r-selected species. Each individual lost takes a long time to replace. Most endangered species are K-selected.

Examples: blue whale populations collapsed under industrial whaling and have recovered slowly (gestation is 11-12 months; sexual maturity at 5-10 years). African elephant populations dropped from 12 million in 1900 to ~415,000 in 2020 from poaching and habitat loss.

r-selected species recover faster. Atlantic herring, once severely overfished, rebounded within 10-15 years of management restrictions.

**The implications for fisheries.** Different species require different management. r-selected species (anchovies, sardines, herring) can sustain high fishing pressure if collapse-avoidance is built in. K-selected species (cod, tuna, sharks) require much more conservative management.

**Climate change implications.** Climate change generally favors r-strategists. Disturbances become more frequent. r-strategists exploit disturbances. K-strategists, with long generation times, cannot evolve fast enough to track shifting climates.

**Demographic transition framing.** Human populations show shifting r/K balance through demographic transition. Pre-industrial populations are r-strategy-like (high mortality, high fertility, large family size). Industrial populations shift toward K (low mortality, low fertility, small family size, heavy investment per child). This is a within-species pattern over historical time.

**Key facts:**
- r-strategists: many offspring, little care, fast rebound. Bacteria, insects, weeds, small fish.
- K-strategists: few offspring, heavy care, slow rebound. Elephants, whales, primates, oaks.
- r-selected exploit disturbance; K-selected dominate stable systems.
- K-selected species more vulnerable to overhunting and habitat loss.
- Most endangered species are K-selected.
- Climate change favors r-strategists.`,
    },
    {
      code: '3.3',
      title: 'Survivorship curves',
      content:
`A survivorship curve plots the number of survivors of a cohort against age. The three classic shapes reveal life-history strategies and predict population dynamics. Created by Edward Deevey (1947).

**Type I curve.** "Late mortality." Most individuals survive to old age, then die in rapid sequence near the end of the species' typical lifespan. The curve is high and flat through most of the lifespan, then drops sharply at the end.

Species: humans, large mammals (elephants, whales, gorillas, dolphins), large birds (eagles, condors), tree species like sequoias.

These are K-selected species. Heavy parental investment ensures most offspring reach reproductive age. Adults rarely die from predation or disease at low rates. Old age and senescence cause death.

Example numbers: human cohort of 1000 — at age 1, ~990 survive (low infant mortality in developed countries); at age 50, ~970 survive; at age 70, ~800 survive; at age 90, ~100 survive; nearly 0 at age 100.

**Type II curve.** "Constant mortality." Roughly equal probability of death at any age. The curve declines linearly on a logarithmic survival scale.

Species: many birds (small to medium-sized), rodents, lizards, some smaller mammals, some plants.

These species face roughly constant mortality from predation, disease, accidents throughout life. Adults don't have particular survival advantages over juveniles.

Example: a sparrow cohort might have a constant ~50% annual mortality. Year 1: 500 of 1000. Year 2: 250. Year 3: 125. Etc.

**Type III curve.** "Early mortality." Most offspring die young. The few that survive to adulthood often have long lives. The curve drops sharply early, then levels off.

Species: most insects (millions of eggs, few adult flies survive), most fish (thousands to millions of eggs, few reach adulthood), most marine invertebrates, oysters, many plants (thousands of seeds, few seedlings, fewer mature plants).

These are r-selected species. Adults produce huge numbers of offspring; the strategy is volume rather than per-offspring investment. Of millions of fish eggs, only a few thousand hatch; of those, a tiny fraction reach reproductive size.

Example numbers: oak tree produces 10,000 acorns per year. Of those, ~5,000 are eaten by squirrels and birds; ~3,000 fail to germinate; ~1,500 seedlings die before establishment; ~500 saplings die in first decade; ~10 reach mature canopy. Over a long-lived adult's 200-year lifetime, that adult might produce a million acorns and have a handful of mature offspring.

**Combinations and exceptions.** Real survivorship curves are often mixtures. A species might be Type III in early life (high egg mortality) and Type I as adults (low adult mortality once mature). Sea turtles fit this — virtually all eggs and hatchlings die; the few that reach adulthood live 50-100 years.

**Conservation implications.** Type III species can survive enormous offspring losses; the few survivors can sustain populations. Type I species are particularly vulnerable to adult mortality — losing breeding adults takes a long time to replace.

This is why whaling collapsed whale populations so dramatically: each adult killed had decades of potential reproduction ahead. Modern management protects adult age classes carefully.

**Habitat needs.** Different parts of the curve may need different habitats. Salmon hatch in freshwater (high egg/fry mortality), grow in the ocean (Type II-ish), return to freshwater to spawn. Conservation must address all life stages.

**Reading the curves.** AP problems often show survivorship curves and ask students to identify the type and the species' likely life-history strategy. Remember:
- Type I = bowed out (concave up) on log scale
- Type II = straight line on log scale
- Type III = bowed in (concave down) on log scale

**Key facts:**
- Type I (late mortality): K-selected. Humans, elephants, whales, sequoias.
- Type II (constant): birds, lizards, some rodents.
- Type III (early mortality): r-selected. Insects, fish, oysters, oaks.
- K-selected (Type I) species vulnerable to adult mortality.
- r-selected (Type III) species can survive high juvenile mortality.
- Many real species show mixed/transitional patterns by life stage.`,
    },
    {
      code: '3.4',
      title: 'Carrying capacity',
      content:
`Carrying capacity (K) is the maximum population size that an environment can support sustainably. It's not a fixed number — it depends on resource availability, predation, disease, climate, and human modification. Understanding K is essential to all of population ecology and to thinking about Earth's human carrying capacity.

**The concept.** A population in an environment grows until limited by something — food, water, space, predators, disease, climate. The level at which population growth stops or slows to balance death rates is the carrying capacity.

Mathematically, in the logistic model, K is the asymptote — the population level the curve approaches. Below K, population grows. Above K, population declines.

**Limiting factors.** The Law of the Minimum (Liebig 1840): the resource in shortest supply relative to need limits population growth. A plant needing nitrogen, phosphorus, water, and light is limited by whichever is least available. Even abundant supply of the other three doesn't help if the limiting one is short.

The Law of Tolerance (Shelford 1913): too much of a factor can be as harmful as too little. Temperature too high or too low; salinity too high or too low; etc.

**Density-dependent factors.** Forces that increase in strength as population density rises:
- Food competition: more individuals → less food per individual → reduced reproduction or increased mortality
- Disease transmission: density facilitates spread
- Predation: predator populations grow in response to abundant prey
- Territorial behavior: more conflict over space
- Waste accumulation: more individuals produce more waste

These factors regulate populations toward K.

**Density-independent factors.** Forces that act regardless of population density:
- Weather (drought, floods, hurricanes, blizzards)
- Natural disasters (fires, volcanoes, tsunamis)
- Pollution events (oil spills)
- Some catastrophic disease outbreaks

These can crash populations dramatically regardless of K.

**Variation in K.** Carrying capacity changes with environmental conditions. Examples:
- Drought reduces K for grasslands and dependent grazers.
- Cold snap reduces K for temperature-sensitive species.
- Habitat destruction reduces K dramatically.
- Habitat restoration can increase K.
- Climate change shifts K across regions.

**Overshoot.** Sometimes populations temporarily exceed K. When this happens:
- Resources are over-exploited
- Habitat may be degraded
- Population crashes back below K, often well below the original carrying capacity
- "Boom and bust" cycles

Famous examples: Saint Matthew Island reindeer (introduced 1944, peaked at ~6000 in 1963, crashed to ~50 by 1966 from forage depletion).

**Human population and K.** What is Earth's carrying capacity for humans? This is one of the oldest and most contested questions in population ecology.

The simplest estimates use available primary productivity and dietary requirements. Earth's net primary productivity could theoretically feed about 12-15 billion people on a plant-based diet. With current meat-heavy diets, estimates run lower (8-10 billion). These estimates assume continued food technology, water availability, and stable climate.

The Ecological Footprint approach (5.11) says we're already over carrying capacity — using ~1.7× the planet's renewable biocapacity. This includes the carbon-absorption capacity of the atmosphere, water supplies, soil, and forests. Population (~8 billion) exceeds long-term sustainable Earth carrying capacity.

Different framings give different answers:
- Food alone: 10-15 billion possible if vegetarian, less if meat-eating
- Total ecological footprint: ~5 billion at current US lifestyle, ~10-12 billion at modest lifestyle
- Climate-stable: ~4-5 billion at current high-income lifestyles

The variation reflects what we count and how we weight quality of life. There is no single "right" answer.

**Demographic transition lowering K.** As populations urbanize and incomes rise, fertility falls. K eventually stops being relevant because human populations stabilize and may decline. This is the optimistic framing: human population will peak (UN projects ~10.4 B around 2086) and decline, never quite reaching theoretical K.

**Cyclic populations.** Some predator-prey systems show cyclic patterns around K. Lynx-snowshoe hare cycle in northern Canada: hare populations grow, lynx follow, lynx overhunt hares, both crash, then both recover — a 10-year cycle. The carrying capacities for each species depend on the other's population.

**Conservation framing.** "Maximum sustainable yield" in fisheries and wildlife is half of K (in the logistic model). Maintaining populations at K/2 allows maximum sustainable harvest. Above K/2 (closer to K), growth rate falls. Below K/2, population becomes vulnerable.

**Key facts:**
- Carrying capacity K = maximum sustainable population given resources
- Liebig's Law of the Minimum: limited by shortest-supply resource
- Shelford's Law of Tolerance: too much can also harm
- Density-dependent factors (food, disease, predation) regulate toward K
- Density-independent factors (weather, disaster) act regardless of N
- Earth's human K: variously estimated 5-15 billion depending on assumptions
- Overshoot causes crashes below original K`,
    },
    {
      code: '3.5',
      title: 'Population growth and resource availability',
      content:
`Population growth models describe how N (number of individuals) changes over time. Two fundamental models — exponential and logistic — capture the essential dynamics. Real populations show more complex behavior but these baselines are essential.

**Exponential growth.** When resources are unlimited, populations grow exponentially. Each individual produces offspring at a constant per-capita rate; the more individuals, the more new individuals; growth accelerates.

Equation: dN/dt = rN
where N is population size, t is time, and r is the intrinsic per-capita growth rate (births minus deaths per individual per unit time).

Solution: N(t) = N₀ × e^(rt)
where N₀ is initial population.

A population starting at 1000 with r = 0.03/yr after 50 years: N = 1000 × e^(0.03 × 50) = 1000 × e^1.5 ≈ 4,482.

Examples in nature: bacteria in fresh nutrient medium; introduced species in new range; first colonizers of disturbed habitat; species recovering from disaster.

Exponential growth cannot continue indefinitely — eventually resources become limited. Either the population transitions to logistic-like growth, or it overshoots and crashes.

**Doubling time (Rule of 70).** A useful shortcut for exponential growth. Doubling time ≈ 70 / (r × 100), where r is expressed as a decimal fraction.

A population growing at 2% per year doubles in about 35 years. 1% per year doubles in 70 years. 7% per year doubles in 10 years.

**Logistic growth.** As resources become limited, growth slows. The logistic model adds a "braking" term — growth slows as N approaches K.

Equation: dN/dt = rN × (K − N) / K
where K is carrying capacity.

When N is small (much less than K), the term (K−N)/K ≈ 1, and growth is essentially exponential.
When N approaches K, the term approaches 0, and growth slows.
When N equals K, growth stops.

Solution: N(t) = K / (1 + ((K − N₀) / N₀) × e^(−rt))

The curve is S-shaped (sigmoidal): slow start, rapid middle phase, slow approach to K. Maximum growth rate occurs at N = K/2.

**Population growth rate vs per-capita growth rate.** Important distinction:

Population growth rate (dN/dt) is the absolute number of new individuals per unit time.
Per-capita growth rate is the rate per individual.

In exponential growth, per-capita rate (r) is constant; population growth rate (rN) accelerates.
In logistic growth, per-capita rate falls as N approaches K; population growth rate has a peak at K/2 then declines.

**The S-shaped curve in real populations.**

(1) **Bacteria in lab culture.** Classic example. Bacteria in fresh medium grow exponentially. As nutrients deplete and waste accumulates, growth slows. Final stationary phase at high density.

(2) **Sheep introduced to Tasmania.** Population grew from a few hundred (1814) to ~1.7 million by 1880. Approximately logistic, leveling off as pastoral capacity was reached.

(3) **Yeast in fermentation tanks.** Industrial yeast growth follows roughly logistic patterns.

(4) **Insect populations in a new habitat.** Initial rapid growth, eventually limited by predators, parasites, food.

**Boom-and-bust dynamics.** Some populations don't fit logistic neatly. Exponential growth overshoots K, then crashes. Examples:
- Saint Matthew Island reindeer: 6000 in 1963 → 50 in 1966 (overshoot crash)
- Lemmings: 4-year cycles
- Spruce budworm: ~30-year outbreak-collapse cycles
- Locusts in plague years

The boom-and-bust pattern is common in r-selected species; less in K-selected.

**Predator-prey cycles (Lotka-Volterra).** When two interacting populations have feedback, oscillations emerge. Lynx-snowshoe hare cycle (10-year period) is the classic example. Predator populations lag prey populations by ~1-2 years.

dH/dt = aH − bHL (hare; grows on its own, decays with lynx encounters)
dL/dt = cHL − dL (lynx; grows with hare encounters, dies on its own)

Where H = hare, L = lynx; a, b, c, d are rates.

The system oscillates: hares grow → lynx grow → hares decline → lynx decline → hares recover.

**Real populations have complications.** Time lags (delayed responses), age structure, multiple resources, environmental variability, evolution, social structure. The basic models are useful baselines but not complete descriptions.

**Human population.** Has been growing exponentially since the late 18th century. From ~1 billion (1804) to 2 billion (1927) to 4 billion (1974) to 8 billion (2022). Growth rate peaked at ~2% in 1965; now ~0.9% and falling. UN projections show population stabilizing and declining mid-century.

**Key facts:**
- Exponential: dN/dt = rN, unlimited resources, J-curve.
- Logistic: dN/dt = rN(K−N)/K, limited resources, S-curve.
- Doubling time = 70/(r×100). 2%/yr doubles in 35 years.
- Maximum growth rate occurs at N = K/2 (in logistic model).
- Boom-bust common in r-selected; smooth logistic more common in K-selected.
- Predator-prey cycles emerge from feedback (Lotka-Volterra).
- Human population: 1B (1804) → 8B (2022) → projected ~10.4B peak.`,
    },
    {
      code: '3.6',
      title: 'Age structure diagrams',
      content:
`An age structure diagram is a population pyramid — a horizontal bar chart showing the number of individuals in each age class, divided by sex. The shape reveals the population's history, present state, and demographic future. Age structure is one of the most useful demographic tools.

**The standard format.** X-axis: number of people (or fraction of total). Y-axis: age class, typically 5-year groupings (0-4, 5-9, 10-14, ... 100+). Males on left, females on right. The pyramid is read top to bottom for older to younger generations.

**Three main shapes.**

**Pyramid (expansive).** Wide base, narrowing toward the top. Each younger cohort is larger than the cohort above it.

Indicates: high birth rate, high (or formerly high) death rate, growing population, often youth-dominated.

Examples: Niger, Democratic Republic of Congo, Yemen, Tanzania, Afghanistan, Guatemala (slightly less pronounced).

Implication: rapid growth ahead. Even if fertility falls, the large cohort of young people will produce many children when they reach reproductive age (demographic momentum).

**Stationary (column).** Roughly straight sides. Each cohort similar in size to the others, except the oldest where mortality has taken its toll.

Indicates: low birth rate, low death rate, stable population at replacement level (TFR ≈ 2.1).

Examples: USA (approximately), France, Argentina.

Implication: stable population. Slow change unless TFR shifts.

**Inverted (contracting).** Narrow base, wider middle, especially wide upper-middle ages.

Indicates: very low birth rate (below replacement), historically low death rate, declining population, aging population.

Examples: Japan, Italy, Germany, South Korea.

Implication: future population decline as elderly cohorts pass. Workforce shrinks; eldercare needs grow; pension systems stressed.

**Reading specific features.**

**Baby boom bulge.** A wider cohort in the middle of the pyramid (e.g., people aged 60-75 in the 2020s in the US) indicates a historical baby boom. Visible in US, Russia, Japan, and other countries with post-WWII baby booms.

**Birth deficit.** A narrow cohort indicates a historical period of low fertility (war, famine, depression, pandemic). The Soviet Union shows narrow cohorts at ages 80+ (WWII losses) and a notch from the 1990s Russian economic crisis.

**Sex imbalance.** China and India show male-dominated pyramids in younger ages due to sex-selective abortion. Russia shows female-dominated older ages from male mortality.

**Migration patterns.** Sometimes visible in workforce-age bulges (oil states with male migrant workers; the UAE shows extreme male-skewed working-age cohorts).

**Demographic momentum.** A key concept. Even after TFR falls below replacement (2.1), population can continue growing for ~30 years because the existing population of young adults is still reproducing. This "momentum" is why population projections show India continuing to grow despite TFR now at 2.0.

The reverse: when fertility falls dramatically, the next generation is smaller. When THAT generation reaches reproductive age, even if their TFR is at replacement (2.1), they produce fewer babies than their parents did. Population growth slows further.

**Projections.** Age structure diagrams can be projected forward. Each cohort moves up one age class per year; mortality and migration adjust totals; new births fill the bottom.

Indian population pyramid 2024: pyramid shape with wide base. Projected 2050: stationary shape. Projected 2100: somewhat inverted.

Japanese pyramid 2024: heavily inverted with narrow base. Projected 2050: even more inverted, population declining rapidly.

**Economic and policy implications.**

**Pyramid-shape countries.** Need to expand education, jobs, food, infrastructure for growing young population. Demographic dividend possible if educational and economic opportunity follows.

**Stationary countries.** Steady-state economies; replacement-level investment in education and infrastructure.

**Inverted countries.** Aging population; growing eldercare needs; pension systems may be inadequate; immigration may compensate; productivity must rise to support fewer workers per retiree.

**Why is fertility falling globally?** The drivers:
- Female education (most important single factor)
- Urbanization (urban children are expensive; rural children contribute to farm labor)
- Contraception access
- Female labor force participation
- Economic insecurity (delays family formation)
- Cultural shifts toward smaller families

These shift age structure from pyramidal to stationary to inverted over generations.

**Indigenous and culturally specific patterns.** Some indigenous groups have different age-structure patterns. High TFR in some, very low TFR in others. Patterns reflect cultural values, economic conditions, and access to family planning.

**Climate considerations.** Climate change may amplify demographic stresses. Drought, food insecurity, sea-level rise can drive migration. Aging populations are particularly vulnerable to extreme heat. Climate adaptation must consider age-structure-specific vulnerabilities.

**Key facts:**
- Population pyramid shows age × sex distribution
- Three shapes: pyramid (growing), stationary (stable), inverted (declining)
- Wide-base indicates high fertility; narrow-base indicates low fertility
- Demographic momentum: ~30-year lag between fertility change and population stabilization
- Examples: Niger (pyramid), USA (stationary), Japan (inverted)
- Drivers of falling fertility: female education, urbanization, contraception, economic shifts`,
    },
    {
      code: '3.7',
      title: 'Total fertility rate',
      content:
`Total fertility rate (TFR) is the average number of children a woman would have over her lifetime if she experienced the current age-specific fertility rates at each age. It's the most important demographic indicator for future population projection.

**Definition.** TFR = sum of age-specific fertility rates (ASFRs) across all reproductive ages (typically 15-49), divided by some factor depending on how rates are expressed. Roughly: the average lifetime number of children per woman.

**Replacement rate.** TFR of approximately 2.1 children per woman maintains population at a constant level (assuming no migration). Why 2.1, not 2.0? Because:
- Not all girls survive to reproductive age (slight infant/child mortality)
- Slight birth ratio bias toward males (~105 boys per 100 girls)
- Some women don't reproduce

In developed countries with very low childhood mortality, replacement is closer to 2.05. In developing countries with higher child mortality, replacement can be 2.3-2.5.

Below 2.1: population eventually shrinks (with lag due to demographic momentum).
Above 2.1: population eventually grows.
At 2.1: population stabilizes.

**Global TFR trends.**

Historical: 5.0 (1965) → 4.5 (1980) → 3.4 (2000) → 2.4 (2024) and falling.
Projected: ~2.0 globally by 2050; possibly ~1.5 globally by 2100.

The decline is dramatic. Most countries followed roughly the same trajectory, lagging behind the leaders by decades. East Asia transitioned in the 1970s-1990s; South Asia 1990s-2010s; sub-Saharan Africa in transition now.

**By region (2024):**
- Sub-Saharan Africa: ~4.4 (Niger 6.7 is highest)
- South Asia: ~2.1 (India 2.0)
- Middle East/North Africa: ~2.8
- East Asia: ~1.3 (China 1.1, South Korea 0.8 — world's lowest)
- Southeast Asia: ~2.0
- Latin America: ~1.8
- Europe: ~1.5
- North America: ~1.7
- Oceania: ~2.2

**Drivers of TFR decline.**

(1) **Female education.** The single most important driver across nearly all studies. Educated women marry later, have children later, work outside the home, and have access to information about family planning. Each additional year of female schooling reduces TFR by ~0.3-0.5 children on average.

(2) **Urbanization.** Urban families have lower TFR than rural families. Children are less economically useful in cities (no farm labor); more expensive to raise; housing is constrained. Urbanization correlates strongly with falling TFR.

(3) **Contraceptive access.** Effective family planning increases when contraceptives are available, affordable, and culturally acceptable. Many countries that maintained higher TFR did so because of limited access.

(4) **Female labor force participation.** Women working outside the home face opportunity costs of children and tend toward smaller families.

(5) **Economic development.** As GDP rises, TFR typically falls. The relationship is robust but not perfectly linear.

(6) **Government policy.** Some countries have explicit policies to lower fertility (China's One-Child Policy 1979-2015), to raise fertility (Hungary, Russia, Japan, Italy with parent subsidies), or neutral.

(7) **Marriage age.** Later marriage tends to reduce TFR.

(8) **Cultural shifts.** Smaller families becoming culturally normative.

**The demographic transition.** The classical model has four stages:

Stage 1: High birth rate, high death rate. Low growth. Pre-industrial societies. TFR ~5-7.
Stage 2: High birth rate, falling death rate. Rapid growth. Industrializing societies. TFR ~5-6.
Stage 3: Falling birth rate, low death rate. Slowing growth. Mature industrial societies. TFR ~2-3.
Stage 4: Low birth rate, low death rate. Stable population. Post-industrial societies. TFR ~2.

Some demographers propose Stage 5: Very low birth rate, low death rate. Declining population. Post-replacement societies. TFR <2.

Many countries are now at Stage 5 (Japan, Italy, Germany, South Korea). The pattern is unprecedented in human history.

**Below-replacement fertility and its consequences.**

When TFR is well below replacement (1.0-1.5), the population pyramid inverts dramatically. Eventually:
- Workforce shrinks
- Pension and healthcare systems strain
- GDP growth slows (fewer workers, more dependents)
- Innovation may slow
- Cultural and demographic shifts

Japan is the bellwether. Population peaked in 2010 at 128 million; now ~125 million; projected ~88 million by 2065 if current TFR (1.3) continues. Korea peaked in 2020 at 51.7 million; projected ~25 million by 2100 at current TFR (0.8 — extraordinary low).

European countries with very low TFR have used immigration to offset declines. Politically contentious.

**Pronatalist policies.** Countries with very low TFR have tried various incentives:
- Direct subsidies (cash for births) — Hungary, Russia, Singapore
- Tax credits — Sweden, France
- Extended parental leave (often 1+ year) — Nordic countries
- Subsidized childcare — France
- Housing assistance for families
- Educational subsidies

Effects have been modest in most countries. France and Nordic countries have somewhat higher TFR (~1.7-1.9) than other European countries, but no country has restored 2.1 sustainably.

**Pronatalist policies that hurt women.** Some policies (Italy, Korea, Japan) have made fertility decisions women's responsibility, with limited support. These have been ineffective. Sweden's approach (extensive support for working parents) has been more effective.

**Climate implications.** Lower TFR slowly shrinks global population, reducing total emissions. But the relationship is slow. Population reductions take generations. Lifestyle and policy changes affect emissions faster than population changes.

The argument that "lower fertility solves climate change" is partly true but operates on a timescale of generations. Climate requires action on emissions in the next 10-30 years.

**Key facts:**
- TFR = average children per woman over reproductive lifetime
- Replacement rate ≈ 2.1
- Global TFR: 5.0 (1965) → 2.4 (2024); projected ~2.0 by 2050
- Niger 6.7 highest; Korea 0.8 lowest (2024)
- Drivers of decline: female education, urbanization, contraception, female employment
- Most powerful single driver: female education
- Stage 5 (TFR <2): Japan, Italy, Germany, Korea
- Pronatalist policies have had modest effects`,
    },
    {
      code: '3.8',
      title: 'Human population dynamics',
      content:
`Human population history is one of the most consequential stories in environmental science. Population grew slowly for most of history, then rapidly in the past three centuries — and the trajectory we're on now will reach peak population in this century, then decline.

**Historical population.**

10,000 BCE (end of last ice age): ~5-10 million humans.
1 CE: ~200 million.
1500: ~500 million.
1800: ~1 billion.
1927: 2 billion.
1960: 3 billion.
1974: 4 billion.
1987: 5 billion.
1999: 6 billion.
2011: 7 billion.
2022: 8 billion.

Note the doublings: 10,000 BCE to 1800 took ~12,000 years to roughly double several times to reach 1B. The 8B was reached in just over 200 years (1800-2022). Modern population growth is unprecedented in human history.

**The growth rate.** Maximum annual growth rate ~2.1% peaked in 1965-1970. Current global growth rate is ~0.9% per year (2024) and falling.

Doubling times:
At 1800 growth rate: ~200 years
At 1900: ~100 years
At 1965 peak: ~35 years
At current rate (0.9%): ~78 years

**Drivers of the explosion.** Why did populations grow so dramatically?

(1) **Agriculture and food.** Improved agriculture (irrigation, fertilizer, machinery, high-yield crops — the Green Revolution) increased food supply faster than population growth.

(2) **Public health.** Sanitation (clean water, sewage treatment), vaccines (smallpox eradicated 1980; polio nearly so), antibiotics (since 1940s), nutrition. Child mortality fell from ~50% to ~5% globally over 200 years.

(3) **Medicine.** Surgery, pharmaceuticals, hospitals. Life expectancy roughly doubled from ~35 years (1800) to ~73 years (2024).

(4) **Industrial revolution.** Energy from fossil fuels allowed enormous productivity gains. Population could be supported in cities working in factories.

(5) **Economic development.** Wealth allowed investment in health, food, and housing.

**Global population projections.**

The UN World Population Prospects (UN WPP, updated biennially) is the gold standard.

Median projection (2024): peak around 10.4 billion in approximately 2086. Then gradual decline.
Lower scenario: peak ~9.5 billion in 2050-2070.
Higher scenario: continued growth past 12 billion.

The wide range reflects uncertainty about future TFR in sub-Saharan Africa (currently ~4.4 and falling but uncertain trajectory).

**Regional projections (2024 UN WPP).**

**Sub-Saharan Africa.** Currently ~1.2 billion. Projected ~2.0 billion by 2050 and ~3.5 billion by 2100. The dominant source of future global population growth.

**Asia.** Currently ~4.7 billion. Projected to peak around 2050 at ~5.3 billion, then decline.

**Europe.** Currently ~745 million. Projected to decline to ~720 million by 2050 and ~650 million by 2100.

**North America.** Currently ~380 million. Modest growth to ~430 million by 2050.

**Latin America.** Currently ~660 million. Projected to peak around 2055 at ~750 million, then decline.

**India and China.** India became the largest country in 2023, surpassing China. India: ~1.43 billion currently; projected to peak around 2065 at ~1.7 billion. China: ~1.41 billion currently; declining since 2022.

**Demographic regions.**

(a) **Pre-transition:** still in Stage 1-2 of demographic transition. Some rural sub-Saharan Africa. High TFR, falling death rate, high growth.

(b) **In transition:** Stage 2-3. India, Pakistan, Indonesia, Egypt. Falling TFR, low death rate, slowing growth.

(c) **Post-transition:** Stage 4-5. Most developed countries plus China. Low TFR, low death rate, stable or declining population.

**Aging populations.** As fertility falls and life expectancy rises, populations age. Median age was 22 in 1950; 30 in 2020; projected to be 38 by 2050.

Examples: Japan median age 49 (2024); Niger median age 16. The contrast is stark.

Aging populations create economic challenges (workforce shrinkage), social challenges (eldercare), political challenges (intergenerational equity).

**Migration.** International migration is a small but growing share of global population dynamics. About 3.5% of people live outside their country of birth. Migration is concentrated from poorer to richer countries.

Climate-driven migration is expected to grow. The World Bank's Groundswell report (2021) projects 216 million internal climate migrants in Africa, Asia, and Latin America by 2050 in a high-warming scenario.

**Population and consumption.** Per-capita consumption varies enormously across countries (factor of 50+ from richest to poorest). Population × per-capita consumption = total environmental impact. Reducing per-capita consumption among the wealthy is much more impactful per person than reducing population.

The IPAT identity: Impact = Population × Affluence × Technology. All three matter. Some climate analysts argue the wealthy world is the major driver of impacts; some argue population is critical. Both have valid points. Climate solutions need to address both.

**Earth's carrying capacity.** Already discussed in 3.4. Estimates range widely (4-15+ billion sustainable) depending on diet, technology, lifestyle assumptions, and what counts as sustainable.

**Key facts:**
- World population: 1B (1804), 8B (2022), projected peak ~10.4B (2086 UN median)
- Growth rate peaked at ~2.1% in 1965-70; now ~0.9% and falling
- Subaharan Africa: dominant source of future global growth (1.2B → 3.5B by 2100)
- Median age: 22 (1950) → 30 (2020) → projected 38 (2050)
- India became largest country in 2023, surpassing China
- China population peaked in 2022; declining
- Climate-driven migration: ~216M by 2050 (World Bank Groundswell)
- IPAT identity: Impact = Population × Affluence × Technology`,
    },
    {
      code: '3.9',
      title: 'Demographic transition',
      content:
`The demographic transition is the historical shift from high birth rates and high death rates to low birth rates and low death rates that has accompanied industrialization and development. It's one of the most important patterns in human history and a key concept for understanding global demographic change.

**The classical model.** Developed by Frank Notestein (1945) and refined since. Four stages:

**Stage 1 — Pre-industrial / Pre-transition.**
- High birth rate (CBR ~30-50/1000)
- High death rate (CDR ~30-50/1000), with substantial year-to-year variability from famine, disease, war
- Low growth rate (births and deaths roughly balance)
- High child mortality
- Population stable to slowly growing
- Most pre-industrial societies. By the 20th century, few examples remained.

**Stage 2 — Early industrial / Death rate falls.**
- High birth rate maintained (cultural lag)
- Death rate falls dramatically (sanitation, nutrition, medicine)
- High growth rate (population explosion)
- Child mortality falls
- Life expectancy rises
- Examples: Western Europe and North America in the late 18th and 19th centuries. Many developing countries in mid-20th century. Sub-Saharan Africa now in Stage 2-3.

**Stage 3 — Late industrial / Birth rate falls.**
- Birth rate falling
- Death rate continuing to fall, then stabilizing
- Growth rate declining
- Cultural shift: smaller families normative
- Urbanization advances
- Examples: Western Europe in late 19th and 20th century. India, Brazil, Mexico in late 20th century.

**Stage 4 — Post-industrial / Stable.**
- Low birth rate (CBR ~10-15/1000)
- Low death rate (CDR ~8-10/1000)
- Low or zero growth
- Population stable
- Aging populations
- Examples: USA, France, Argentina at various points. Many high-income countries in late 20th century.

**Stage 5 — Post-transition / Below replacement.** A proposed addition to the classical model.
- Very low birth rate (CBR <10/1000)
- Low death rate
- Negative growth rate
- Rapidly aging population
- Workforce shrinkage
- Examples: Japan, Italy, Germany, South Korea, most of Eastern Europe.

**Why fertility falls.** The drivers in detail.

(1) **Reduced child mortality.** In pre-industrial societies, families had many children because many would die before adulthood. As infant/child mortality fell, parents adjusted toward fewer pregnancies. This is the most important historical driver — possibly necessary but not sufficient.

(2) **Urbanization.** Rural children contribute to farm labor; urban children are expensive. Housing costs more, schooling expected, economic opportunities require investment. Urban families shrink.

(3) **Female education.** Educated women marry later, have children later, work outside the home, have more autonomy in reproductive decisions. Maximum education for women correlates with maximum fertility decline.

(4) **Female labor force participation.** Women working outside the home face opportunity costs.

(5) **Contraception availability.** Modern family planning enables couples to control family size to match desired size. Limited access maintains higher actual TFR than desired.

(6) **Cultural shifts.** Smaller families become normative. Marrying later becomes normative. Childlessness becomes more acceptable.

(7) **Economic shifts.** Pensions and social security reduce the need for adult children as old-age security. Wealth allows substitution of children with consumption and leisure.

**Country trajectories.** Different countries followed different paths through the transition.

**United States.** Stage 1 in 1600s; transitioned through Stage 2 and 3 in 19th century; reached Stage 4 by mid-20th century with the baby boom anomaly. Currently in Stage 4 with TFR ~1.7.

**United Kingdom.** Similar to US. Late 18th century death rate began falling; birth rate followed in mid-19th century; Stage 4 by mid-20th century.

**Japan.** Quasi-isolated in Stage 1 until the 19th century. Rapid industrialization 1860s-1940s. Stage 2 mid-20th century. Now firmly in Stage 5 with very low fertility.

**China.** Stage 1 in early 20th century. Mass mortality events (famines, war) and high fertility through 1960s. One-Child Policy (1979-2015) accelerated movement to Stage 4 and beyond. Now in Stage 5.

**India.** Slow demographic transition. Stage 2 from 1920s. Currently in Stage 3 with TFR ~2.0.

**Sub-Saharan Africa.** Late starters. Currently in late Stage 2 or early Stage 3. TFR ~4.4 and falling. Transition speed varies by country (urban areas faster).

**Implications for climate.**

The "demographic transition" framing matters for climate scenarios. Faster fertility decline → smaller peak population → lower cumulative emissions.

But: timing matters. Even with rapid TFR decline, demographic momentum carries population growth for 30+ years. Climate solutions must work even with continuing population growth.

The IPCC scenarios use different population trajectories. SSP1 (sustainability) assumes faster fertility decline; SSP5 (fossil-fueled development) assumes slower decline. Both have implications for emissions pathways.

**Female education as climate solution.** Project Drawdown (Hawken et al.) ranks educating girls and family planning as among the most effective climate solutions, by combined effects on energy demand and population.

**Migration and the transition.** Some countries with very low TFR maintain population through immigration. Germany, Canada, USA. Politically contentious but demographically essential.

**Health and longevity.** Across the transition, life expectancy roughly doubles from 35 years (Stage 1) to 75+ years (Stage 4-5). This is one of the largest changes in human history.

**Critique of the model.** The demographic transition is descriptive, not deterministic. Some countries lag; some accelerate; some skip stages. Specific patterns vary with culture, religion, economy, government policy.

The model also reflects a particular Western development trajectory. Some countries (Korea, Singapore) compressed centuries of demographic change into decades. Others (sub-Saharan Africa) are taking longer than the original pattern.

**Key facts:**
- Demographic transition: four (or five) stages from high-high to low-low birth and death rates
- Stage 1 (pre-industrial), Stage 2 (death rate falls), Stage 3 (birth rate falls), Stage 4 (stable low), Stage 5 (declining)
- Death rate falls first (sanitation, vaccines, antibiotics); birth rate follows (urbanization, female education)
- Female education is the most important single driver of falling TFR
- Demographic momentum: 30+ years between fertility shift and population stabilization
- Faster fertility decline reduces peak population and cumulative emissions
- Education and family planning rank high in climate solutions (Project Drawdown)`,
    },
  ],
  keyConcepts: [
    'Generalist vs specialist trade-off. Climate change selects for generalists.',
    'r-strategists (many offspring, little care) vs K-strategists (few offspring, heavy care).',
    'Three survivorship curves: Type I (late mortality, K-selected), II (constant), III (early mortality, r-selected).',
    'Carrying capacity K depends on resources; can change. Earth K for humans: 5-15 billion depending on assumptions.',
    'Exponential dN/dt = rN; doubling time ≈ 70/(r×100). Logistic dN/dt = rN(K−N)/K; S-curve.',
    'Population pyramids: expansive (Niger), stationary (USA), inverted (Japan).',
    'Demographic momentum: ~30-year lag between fertility change and population stabilization.',
    'Replacement TFR ≈ 2.1. Global TFR 2.4 (2024) and falling.',
    'Demographic transition: Stage 1 (pre-industrial) → Stage 5 (post-transition, below replacement).',
    'Female education is the most powerful single driver of falling fertility.',
  ],
  formulas: [
    {
      name: 'Exponential growth',
      equation: 'dN/dt = rN; N(t) = N₀ × e^(rt)',
      meaning: 'r is per-capita growth rate; N is population.',
      example: 'A population of 1000 with r = 0.03/yr after 50 years: N = 1000 × e^(0.03 × 50) ≈ 4,482.',
    },
    {
      name: 'Logistic growth',
      equation: 'dN/dt = rN × (K − N) / K',
      meaning: 'r is intrinsic growth rate; K is carrying capacity. Growth slows as N → K.',
      example: 'r = 0.4, K = 1000, N = 500. dN/dt = 0.4 × 500 × 500/1000 = 100. Max growth rate occurs at N = K/2 = 500.',
    },
    {
      name: 'Doubling time (Rule of 70)',
      equation: 't_double ≈ 70 / (r × 100)',
      meaning: 'For growth rate r (as decimal), doubling time in years.',
      example: '2%/yr doubles in 35 years. 1%/yr doubles in 70 years. 7%/yr doubles in 10 years.',
    },
    {
      name: 'Maximum sustainable yield',
      equation: 'MSY = rK/4',
      meaning: 'In logistic model, MSY = (intrinsic growth rate × carrying capacity) / 4.',
      example: 'r = 0.6/yr, K = 10,000 → MSY = 1,500/yr at N = K/2.',
    },
  ],
  practice: [
    {
      q: 'A country has TFR of 1.4. Population is 50 million; life expectancy is 84; net migration is zero. Predict trajectory.',
      a: 'Declining. TFR below replacement (2.1) by 0.7. Without migration, population will fall over the next 30-50 years.',
    },
    {
      q: 'Compare recovery times of r-selected fish vs K-selected whale population after each loses 50% of individuals.',
      a: 'r-selected fish: months to a few years via rapid reproduction. K-selected whale: decades to centuries via slow reproduction.',
    },
    {
      q: 'A population grows at r = 0.04/yr. How long until it doubles? After doubling, what is the per-capita rate?',
      a: '~17.5 years (70/4). Per-capita rate stays at 0.04/yr — r doesn\'t change with N in exponential model.',
    },
    {
      q: 'A fish stock with K = 5,000 and r = 0.5/yr is harvested. What is the maximum sustainable yield?',
      a: 'MSY = rK/4 = 0.5 × 5000 / 4 = 625 fish/yr.',
    },
    {
      q: 'A country in Stage 2 demographic transition has CBR = 40/1000 and CDR = 10/1000. What is the growth rate?',
      a: '3.0%/yr. Growth rate = (CBR − CDR)/1000 = 30/1000 = 0.030 = 3.0%.',
    },
  ],
  pitfalls: [
    '"Below replacement = immediate decline" — incorrect. Demographic momentum keeps growth positive for ~30 years after TFR falls below 2.1.',
    '"Replacement TFR is exactly 2.0" — incorrect. Replacement is ~2.1 (accounts for childhood mortality and sex ratio).',
    '"Carrying capacity is fixed" — incorrect. K changes with environment, technology, disease, climate.',
    '"K-selected species have higher reproductive output" — backwards. They have lower output per individual but more parental investment per offspring.',
    '"All r-selected species are pests" — many are essential pioneers and ecological recyclers.',
    '"Survivorship curves predict species identity" — they reveal life-history strategy; many species have transitional curves.',
    '"Lowering global population is THE climate solution" — partial. Population reductions take generations; emissions must fall in decades.',
    '"Demographic transition is mandatory" — historical pattern; specific paths vary by country.',
  ],
};
