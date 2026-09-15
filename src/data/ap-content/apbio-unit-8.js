// AP Biology Unit 8 — Ecology (10-15% of exam)

export const APBIO_UNIT_8 = {
  number: 8,
  title: 'Ecology',
  weight: '10-15%',
  subunits: [
    {
      code: '8.1',
      title: 'Responses to the environment',
      content:
`Organisms must respond to their environment to survive. Responses range from quick reflexes to long-term adaptations.

**Types of responses:**

**Behavioral responses** — actions:
- **Innate** (instinctive) — genetically programmed; same in all members of species. Examples: spider web building, bee waggle dance, infant suckling, fixed action patterns (greylag goose egg-rolling).
- **Learned** — modified by experience. Habituation (ignore repeated stimuli), classical conditioning (Pavlov's dogs), operant conditioning (reward-based), insight (problem-solving), imprinting (Konrad Lorenz with geese).
- Most behaviors combine both — songbirds have innate song templates that are refined by hearing other birds.

**Physiological responses** — body adjusts:
- Sweating to cool down; shivering to warm up.
- Increased heart rate during exercise.
- Hormonal stress response (cortisol, epinephrine).

**Morphological responses** — body changes over longer time:
- Plants grow toward light (phototropism).
- Trees grow thicker bark in cold climates.
- Some species shift body proportions to environment.

**Communication.** Signals between organisms:
- Visual (color displays, body postures).
- Chemical (pheromones).
- Auditory (bird songs, whale songs, frog calls).
- Tactile (grooming, mating).
- Electrical (electric fish).

**Cooperation and altruism.** Many species cooperate (wolf packs hunting, meerkat sentries, social insects). True altruism (helping others at cost to self) seems puzzling under natural selection — explained by:
- **Kin selection** (Hamilton's rule): altruism toward relatives shares genes (B × r > C where B = benefit to recipient, r = relatedness, C = cost to altruist).
- **Reciprocal altruism**: helping unrelated others who may help you later.
- **Group selection** (debated): traits that help groups but cost individuals.

**Migration.** Periodic movement between habitats:
- **Monarch butterflies** — 3,000 miles to overwinter in Mexico.
- **Arctic terns** — 44,000 km annually between Arctic and Antarctic — longest known.
- **Salmon** — return from ocean to natal stream to spawn.
- **Wildebeest** — Serengeti migration.

**Circadian rhythms** — ~24-hour internal clocks. Sleep-wake cycles, hormone fluctuations, temperature variation. Disrupted by jet lag, shift work.

**Annual cycles** — hibernation (bears, ground squirrels), estivation (some snails, lungfish), torpor (hummingbirds at night).`,
    },
    {
      code: '8.2',
      title: 'Energy flow through ecosystems',
      content:
`Energy flows one direction through ecosystems: from sun to producers to consumers to decomposers, ultimately lost as heat.

**Trophic levels.** Position in the food chain:
- **Producers (autotrophs)** — capture energy from sun (plants, algae, cyanobacteria) or chemicals (chemosynthetic bacteria at deep-sea vents).
- **Primary consumers (herbivores)** — eat producers.
- **Secondary consumers (carnivores)** — eat herbivores.
- **Tertiary consumers (top predators)** — eat carnivores.
- **Decomposers** — break down dead material at all levels (bacteria, fungi); return nutrients to abiotic pool.

**10% rule** (Lindeman 1942). Roughly 10% of energy in one trophic level transfers to the next. Rest is lost as heat (respiration), in waste, or in unconsumed parts.

**Why energy is lost:**
- Most energy (60-90%) used in respiration for the organism's own metabolism.
- Waste products (feces, urine) contain energy.
- Heat dissipation.
- Inedible parts (bones, fur).
- Predation success isn't 100%.

**Implication.** Food chains rarely exceed 4-5 trophic levels — energy runs out.

**Energy pyramid.** Visualizes the 10% rule. Producers form the wide base; each subsequent level is ~10% the energy of the one below. Always pyramid-shaped because of thermodynamics.

**Biomass pyramid.** Usually pyramid-shaped on land (more plant biomass than animal). Can be inverted in some aquatic systems where short-lived phytoplankton support longer-lived zooplankton (instantaneous biomass small but turnover high).

**Number pyramid.** Variable. One tree can support thousands of caterpillars.

**Net primary productivity (NPP).** Energy fixed by producers minus their respiration costs. Available to consumers. Global NPP ~90 Gt C/yr (~half on land, half in oceans). Humans appropriate ~25% of terrestrial NPP.

**Biomagnification.** Toxins (DDT, mercury, PCBs) concentrate up the food chain — opposite of energy. Each predator eats many prey; persistent toxins accumulate at each level. Apex predators have highest body burdens. DDT and bald eagles (eggshell thinning), mercury in tuna, PCBs in orcas.`,
    },
    {
      code: '8.3',
      title: 'Population ecology',
      content:
`Population ecology studies how populations grow, decline, and interact with environment and other species.

**Population characteristics:**
- **Density** — individuals per unit area.
- **Dispersion** — spatial pattern (clumped, uniform, random).
- **Age structure** — distribution by age class. Affects future growth.
- **Sex ratio** — male:female.

**Growth models:**

**Exponential growth.** Resources unlimited. dN/dt = rN. J-curve. Population doubles in regular intervals. Pre-equilibrium populations, invasive species in new environments, bacteria in fresh culture.

**Logistic growth.** Resources finite. dN/dt = rN × (K-N)/K. S-curve. Growth slows as population approaches carrying capacity (K). Density-dependent factors increase as crowding increases.

**Doubling time** in exponential growth: t = 70/r% (rule of 70). For 1% annual growth, population doubles in 70 years. Human population grew at ~2% in 1960s (doubling ~35 years).

**Density-dependent factors** — operate more strongly at high density:
- Competition for food, shelter, mates.
- Predation (predator response).
- Disease (faster transmission).
- Parasites.
- Behavioral effects (stress).

**Density-independent factors** — operate regardless of population size:
- Weather (storms, drought, freezes).
- Natural disasters.
- Habitat destruction.

**r-selected vs K-selected** life history strategies:
- **r-selected**: many small offspring, little care, fast maturity, short life, opportunistic. Insects, weeds, mice, oysters.
- **K-selected**: few large offspring, parental care, slow maturity, long life, near carrying capacity. Elephants, whales, oaks, humans.

A continuum, not a strict dichotomy.

**Survivorship curves.** Three types:
- **Type I** — high survival to old age then steep decline (humans, large mammals).
- **Type II** — constant mortality across ages (many birds, small mammals, lizards).
- **Type III** — high early mortality, survivors live long (oysters, frogs, fish).

**Human population.** ~8 billion today; projected to peak at ~10-11 billion this century. Growth slowing as fertility falls in most countries. Major shift from rural to urban (56% urban now → 68% by 2050).`,
    },
    {
      code: '8.4',
      title: 'Community ecology',
      content:
`Community ecology studies how species interact in shared environments.

**Types of interactions:**

| Interaction | Species A | Species B | Example |
|---|---|---|---|
| Mutualism | + | + | bees + flowers |
| Commensalism | + | 0 | barnacles on whale |
| Predation | + | − | wolf eats elk |
| Herbivory | + | − | rabbit eats grass |
| Parasitism | + | − | tapeworm in human |
| Competition | − | − | two species for water |
| Amensalism | 0 | − | walnut tree allelopathy |

**Competition.** Two species using same resource compete. **Competitive exclusion principle** (Gause): two species cannot stably coexist if they use the exact same niche; one will outcompete the other.

**Niche partitioning** — species evolve to use slightly different resources or different times. Famous example: MacArthur's warblers (5 species in same conifer trees but different parts).

**Predator-prey dynamics.** Cyclic — predator population follows prey with a lag. **Lotka-Volterra** equations model these cycles. Classic: snowshoe hare and Canadian lynx data shows ~10-year cycles.

**Coevolution.** Two species evolve in response to each other:
- Predator-prey: cheetahs and gazelles in escalating speed.
- Plant-herbivore: chemical warfare (plant toxins, insect detoxification).
- Mutualistic: figs and fig wasps (each species pair coadapted).
- Pollinator coevolution: long-tube flowers + long-tongued moths.

**Keystone species.** Disproportionate effect on community structure relative to abundance.
- Sea otters → eat sea urchins → kelp forests thrive. Remove otters → urchin barrens.
- Wolves at Yellowstone → control elk → riparian vegetation recovers → trophic cascade.
- Starfish at rocky intertidal (Pisaster) → controls mussels → diversity maintained.
- Beavers → ecosystem engineers create wetlands.

**Trophic cascade.** Effects ripple through food web. Loss of top predator → mesopredator release → prey of mesopredators collapse → vegetation changes → ...

**Community structure.**
- **Species richness** — number of species.
- **Species evenness** — how evenly distributed.
- **Diversity indices** — Shannon (H' = -Σpi ln pi), Simpson.
- **Productivity** — total energy flow.
- **Stability** — resistance to disturbance.

**Succession.** (Already in APES.) Primary (no soil) and secondary (soil intact). Communities change over time toward more diverse, stable states.`,
    },
    {
      code: '8.5',
      title: 'Biodiversity',
      content:
`Biodiversity is the variety of life at all levels — genetic within species, species within communities, ecosystems across landscapes.

**Three levels of biodiversity:**
1. **Genetic** — variation within species. Allows adaptation.
2. **Species** — number and abundance of species (richness + evenness).
3. **Ecosystem** — variety of habitats and communities.

**Global biodiversity.**
- ~1.5 million species described.
- Estimated 8-10 million total (most undescribed).
- Tropical forests host ~50% of species in ~6% of land area.
- Coral reefs host ~25% of marine species in ~0.1% of ocean area.

**Hotspots.** 36 regions worldwide that contain >70% of vascular plant species in <2.5% of land area. Tropical Andes, Madagascar, Sundaland (Borneo + Sumatra), Eastern Afromontane, Mediterranean Basin, etc.

**Why biodiversity matters:**
- **Ecosystem services** — pollination ($235-577B/yr), water purification, soil formation, climate regulation.
- **Food security** — wild relatives of crops provide genetic resources for breeding.
- **Medicine** — ~50% of pharmaceuticals derive from natural products.
- **Resilience** — diverse ecosystems recover from disturbance better.
- **Ethics/aesthetics** — intrinsic value, cultural connections.

**Current threats (HIPPO + C):**
- **H** Habitat loss (largest single cause — esp. tropical deforestation)
- **I** Invasive species (especially on islands)
- **P** Pollution (chemicals, plastics, light, noise, climate)
- **P** Population (human, 8 billion and rising)
- **O** Overharvesting (fishing, hunting, gathering)
- **C** Climate change (rising as a major driver)

**Sixth Mass Extinction.** Current extinction rate is 100-1000× background rate, driven by humans. ~25% of mammals, 40% of amphibians, 35% of conifers threatened with extinction. Comparable to past mass extinctions in scale.

**Conservation strategies:**
- **Protected areas** — currently ~16% of land, target 30% by 2030.
- **Habitat corridors** — connect fragmented populations.
- **Captive breeding** — California condor, black-footed ferret restored from near-extinction.
- **Seed banks** — Svalbard Global Seed Vault stores 1M+ crop varieties.
- **Climate action** — limiting warming limits extinction.
- **Sustainable use** — sustainable forestry, fisheries.
- **Indigenous-led conservation** — indigenous lands have lower deforestation rates than national parks in many regions.

**Why each extinction matters.** Species play unique roles in ecosystems. Losing them disrupts pollination, nutrient cycling, food webs. Ethical considerations and intrinsic value also at stake.`,
    },
    {
      code: '8.6',
      title: 'Ecosystem disruption',
      content:
`Human activity is altering ecosystems globally at unprecedented rates.

**Climate change.**
- CO₂ from 280 to 425 ppm (pre-industrial → 2024).
- Global temperature: ~1.2°C warmer than pre-industrial.
- Effects: heat waves, drought, intense storms, sea-level rise, ocean acidification, species range shifts, phenological mismatches, coral bleaching, permafrost thaw.
- Causes: fossil fuels (75% of emissions), land-use change (deforestation, ~15%), agriculture (~10%).

**Habitat destruction and fragmentation.**
- ~50% of habitable land now agricultural.
- Forest loss ~10 million ha/year (net ~5 million ha).
- Wetlands: ~35-50% lost since 1900.
- Mangroves: ~35% lost since 1980.
- Coral reefs: ~50% lost in past 30 years; bleaching events recurring.
- Fragmentation isolates populations, reduces gene flow.

**Pollution.**
- Air: 7 million premature deaths/year from PM and ozone.
- Water: eutrophication causes dead zones (Gulf of Mexico, Chesapeake, Baltic).
- Plastic: 8-12 million tonnes enter oceans annually; microplastics everywhere.
- Persistent organic pollutants bioaccumulate.
- Mercury, lead, PFAS spread globally.

**Invasive species.**
- Zebra mussels, Asian carp, kudzu, Burmese python, lionfish, brown tree snake (Guam).
- Disrupt native communities; cost ~$20+ billion/year in US.

**Overharvesting.**
- 34% of fish stocks overfished.
- Bushmeat trade depletes forest wildlife.
- Illegal trade — elephants for ivory, pangolins, rhinos.

**Land use change.**
- Conversion of forest to cropland, pasture, urban.
- Industrial agriculture monocultures.
- Suburban sprawl.

**Eutrophication.** Excess N + P in waterways → algal blooms → oxygen depletion → dead zones. Major source: agricultural runoff.

**Ocean acidification.** CO₂ + water → carbonic acid → ocean pH dropping (~30% more H⁺ since pre-industrial). Calcifying organisms (corals, shellfish, plankton) struggle.

**Hypoxia.** Low-oxygen zones in lakes and oceans. Gulf of Mexico dead zone ~5,000-8,000 sq mi each summer.

**Tipping points.** Some ecosystem changes are abrupt and irreversible. Amazon dieback (rainforest → savanna), West Antarctic ice sheet collapse, methane release from permafrost, monsoon shifts. Crossing tipping points compounds impacts.

**Solutions.** Reduce emissions, protect habitat, transition energy, reform agriculture, manage fisheries, control invasives, recognize ecosystem services in policy and economics.`,
    },
    {
      code: '8.7',
      title: 'Biogeochemical cycles',
      content:
`Chemical elements cycle between organisms and environment. Major cycles: water, carbon, nitrogen, phosphorus, sulfur.

**Water (hydrologic) cycle.**
- Solar-driven (evaporation) + gravity-driven (precipitation, runoff).
- Reservoirs: oceans (97.5%), ice (1.74%), groundwater (0.76%), surface (0.014%), atmosphere (0.001%).
- Residence times: atmosphere ~9 days; ocean ~3,000-4,000 years.
- Human impacts: dam construction, groundwater overdraft (Ogallala), irrigation, climate change.

**Carbon cycle.**
- Reservoirs: atmosphere (~875 Gt C), ocean (~38,000 Gt C — largest fast pool), terrestrial biomass (~2,000 Gt C), fossil fuels (~5,000 Gt C in reserves).
- Fluxes: photosynthesis (~170 Gt C/yr fixed), respiration (returns most), combustion.
- Human impact: ~12 Gt C/yr from fossil fuels + ~1.5 Gt from land-use change. ~45% accumulates in atmosphere (rest absorbed by oceans and biosphere).
- Result: atmospheric CO₂ 280 → 425 ppm; climate change.

**Nitrogen cycle.**
- Reservoir: atmosphere (78% N₂) — but most life can't use N₂ directly.
- **Fixation**: N₂ → ammonia (NH₃/NH₄⁺). By Rhizobium bacteria (with legumes), Azotobacter (free-living), cyanobacteria, lightning, or industrial Haber-Bosch.
- **Nitrification**: NH₄⁺ → NO₂⁻ → NO₃⁻ by soil bacteria.
- **Assimilation**: plants take up NO₃⁻ to build proteins; animals eat plants.
- **Ammonification**: decomposers return organic N to NH₄⁺.
- **Denitrification**: bacteria return NO₃⁻ → N₂ (closes cycle).
- Human impact: Haber-Bosch (~150 Tg N/yr) now exceeds all natural fixation; eutrophication; N₂O greenhouse gas.

**Phosphorus cycle.**
- No atmospheric step (no gaseous P form).
- Reservoirs: rocks (>95%), soil, ocean sediments, biota.
- Slow cycle on geologic timescales (uplift over millions of years).
- Often the limiting nutrient in freshwater.
- Human impact: mining (~25 Mt P/yr) for fertilizer; agricultural runoff drives algal blooms.

**Why cycles matter.** Life depends on nutrient availability. Human disruption (combustion, fertilization, deforestation) shifts global cycles, with consequences for climate, water quality, productivity, and biodiversity.

**Coupling.** Cycles interact — climate change accelerates carbon and water cycles; fertilizer changes both N and P; ocean warming affects all.`,
    },
  ],
  keyConcepts: [
    'Organisms respond to environment via behavior (innate/learned), physiology, and morphology.',
    'Energy flows one direction (sun → producers → consumers); ~10% transfers per trophic level.',
    'Population growth: exponential (J-curve, no limits) vs logistic (S-curve, approaches carrying capacity K).',
    'Density-dependent vs density-independent factors limit populations.',
    'Survivorship curves: Type I (humans), II (birds), III (oysters).',
    'Community interactions: mutualism, commensalism, predation, parasitism, competition.',
    'Competitive exclusion: two species can\'t share exact same niche stably.',
    'Keystone species (sea otters, wolves) have disproportionate impact.',
    'Biodiversity: 3 levels (genetic, species, ecosystem); Sixth Mass Extinction underway.',
    'HIPPO + climate change drive ecosystem disruption.',
    'Biogeochemical cycles (water, C, N, P) connect organisms to environment; humans disrupt all.',
  ],
  formulas: [
    {
      name: 'Exponential growth',
      equation: 'dN/dt = rN',
      meaning: 'Population grows in proportion to current size; produces J-curve.',
      example: 'Bacteria in fresh medium; introduced species in new habitat before resources limit.',
    },
    {
      name: 'Logistic growth',
      equation: 'dN/dt = rN × (K - N) / K',
      meaning: 'Growth slows as N approaches K (carrying capacity). S-curve.',
      example: 'Yeast in batch culture; deer reintroduced to managed area.',
    },
    {
      name: 'Doubling time (rule of 70)',
      equation: 't = 70 / r%',
      meaning: 'In exponential growth, time to double population.',
      example: 'Human population growing at 1% doubles in 70 years.',
    },
    {
      name: '10% rule (Lindeman)',
      equation: 'Energy at level n+1 ≈ 10% × energy at level n',
      meaning: 'Why food chains are short (4-5 levels max).',
      example: 'Producer 10,000 kcal → herbivore 1,000 → carnivore 100 → top predator 10.',
    },
  ],
  practice: [
    {
      q: 'A population of 100 grows at r = 0.05 per year under exponential conditions. What is the population after 30 years?',
      a: 'N(t) = N₀ × e^(rt) = 100 × e^(0.05 × 30) = 100 × e^1.5 ≈ 448 individuals.',
    },
    {
      q: 'Why do food chains rarely exceed 4-5 trophic levels?',
      a: '10% rule. Energy is lost at each transfer (heat, respiration, waste). By the 5th level, only 0.01% of producer energy remains — not enough to support a viable predator population.',
    },
    {
      q: 'A reservoir holds 1,000 trout. Despite no fishing pressure, the population doesn\'t grow above ~1,000. Why?',
      a: 'Carrying capacity K is ~1,000. Density-dependent factors (food competition, oxygen, disease) limit growth as N approaches K. Population at logistic equilibrium.',
    },
  ],
  pitfalls: [
    '"Energy cycles in an ecosystem" — wrong. Energy flows one direction (sun → heat). Matter cycles.',
    '"Apex predators are abundant" — wrong. Each higher trophic level has ~10% the energy, so apex predators are rare.',
    '"Carrying capacity is fixed" — varies with environmental conditions and over time.',
    '"All invasive species are bad" — most introduced species don\'t become invasive. Specific traits + conditions make them problematic.',
    '"Biodiversity = number of species" — also includes genetic diversity within species and ecosystem diversity.',
  ],
};
