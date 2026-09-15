// APES Unit 1 — The Living World: Ecosystems — full teaching content.
// Foundational unit. 11 subunits.


export const APES_UNIT_1 = {
  number: 1,
  title: 'The Living World — Ecosystems',
  weight: '6-8%',
  fit: 'core',
  notes: 'Biome map layer in Terra Council corresponds 1:1 with the AP biome list. Carbon cycle is the per-turn CO₂ drift equation.',
  weeks: [2, 4],
  subunits: [
    {
      code: '1.1',
      title: 'Introduction to ecosystems',
      content:
`An ecosystem is the complete community of living organisms and the nonliving environment in a given area, plus the energy and matter that flow between them. The concept unifies biology with physical sciences — ecology is the study of how living systems interact with each other and with light, water, soil, and air.

**Components.** Every ecosystem has two fundamental categories of components:

**Biotic factors** are living: plants, animals, fungi, bacteria, protists. They produce, consume, decompose, compete, cooperate.

**Abiotic factors** are nonliving: temperature, sunlight, water, soil, nutrients, pH, salinity, oxygen, atmospheric composition. They set the physical-chemical conditions that determine which life can exist where.

The interactions between biotic and abiotic factors define how an ecosystem functions. Biotic components depend on abiotic conditions; biotic activity in turn modifies abiotic conditions (plants release oxygen; trees regulate microclimate; soils are built by biological activity).

**Levels of biological organization.** Ecosystems sit in a hierarchy:

- **Organism**: a single individual (one oak tree, one wolf, one bacterium)
- **Population**: all individuals of one species in an area (the wolves of Yellowstone)
- **Community**: all populations interacting (Yellowstone wolves + elk + grizzlies + plants + microbes)
- **Ecosystem**: community + abiotic factors (Yellowstone community + soil, climate, rivers)
- **Biome**: a large-scale ecosystem type defined by climate (temperate coniferous forest)
- **Biosphere**: the global sum of all ecosystems (all of life on Earth)

Each level emerges from the one below. Ecology operates at all these scales.

**Ecosystem functions.** What ecosystems do:

(1) **Energy flow.** Solar energy enters via photosynthesis (or chemosynthesis in some deep-sea systems). It moves through food webs, dissipating as heat at every step. Energy doesn't cycle — it flows one direction, ultimately lost as low-grade heat.

(2) **Nutrient cycling.** Matter (carbon, nitrogen, phosphorus, water) cycles through the system, used and reused by organisms. Decomposers return nutrients to the abiotic pool, available for primary producers.

(3) **Water cycling.** Precipitation, evapotranspiration, runoff, infiltration.

(4) **Climate regulation.** Forests cool the surface through transpiration and shading. Oceans absorb heat. Wetlands buffer storms.

(5) **Pollination, seed dispersal, pest control, soil formation.** Specific services performed by particular organisms.

(6) **Habitat for biodiversity.** Each ecosystem hosts characteristic species; loss of ecosystem = loss of species.

**Ecosystem services.** Human-relevant outputs of ecosystem function (Millennium Ecosystem Assessment 2005):

- **Provisioning**: food, water, fiber, fuel, genetic resources
- **Regulating**: climate regulation, water purification, flood mitigation, disease control
- **Supporting**: nutrient cycling, soil formation, primary production
- **Cultural**: recreation, spiritual/religious, aesthetic, educational

Estimated value: $44-145 trillion/year globally (Costanza et al.), comparable to or exceeding global GDP. Almost entirely unpriced in markets.

**The "balance of nature" view vs. dynamic equilibrium.** Pre-20th-century ecology often viewed ecosystems as static "balanced" systems. Modern ecology sees them as dynamic — constantly changing on multiple time scales. Forests after fire, ecosystems after invasive species arrive, communities in response to climate change — all undergo continual reorganization. "Equilibrium" is approximate at best.

**System boundaries.** Where does one ecosystem end and another begin? Often unclear. Boundaries can be sharp (forest meets prairie) or gradual (estuary). For analysis, we draw boundaries pragmatically — a pond, a watershed, a biome.

**Open vs closed systems.** Ecosystems exchange energy and matter with surroundings — they're open systems. Energy flows in (sunlight) and out (heat). Matter flows in (immigration, atmospheric deposition) and out (emigration, leaching, erosion). Even apparent "closed" systems like islands have inputs and outputs.

**Trophic structure.** Every ecosystem has primary producers (autotrophs — plants, algae, photosynthetic bacteria), primary consumers (herbivores), secondary consumers (carnivores), and decomposers (recycle dead organic matter). More on this in 1.9-1.11.

**Limiting factors.** Ecosystems' productivity is constrained by whichever resource is in shortest supply.

**Liebig's Law of the Minimum** (1840): plant growth is limited by the resource that is scarcest relative to need, even if other resources are abundant. If a plant needs nitrogen, phosphorus, water, and light, the one in shortest supply determines maximum growth.

**Shelford's Law of Tolerance** (1913): a species can survive only within a range of conditions. Outside that range (too hot, too cold, too acidic, too salty), survival declines. Each species has its own range, called its fundamental niche.

These laws together explain why species are distributed where they are and why ecosystems vary.

**Disturbance and recovery.** Most ecosystems experience periodic disturbance — fire, flood, drought, storms, disease outbreaks. Many ecosystems are adapted to specific disturbance regimes (savannas need fire; redwood forests need fog and occasional fire).

After disturbance, ecosystems undergo ecological succession (covered in 2.7). Pioneer species establish first; specialist species come later. The endpoint (climax community) varies by climate.

**Disturbance frequency and intensity.** Different ecosystems have different "natural" disturbance regimes. Tropical forests rarely burn but get hurricanes; chaparral burns every 30-50 years; tundra is very stable but cold-adapted. Climate change is altering disturbance regimes — fires more frequent in many forests; storms more intense in coastal areas.

**Ecosystem stability and resilience.** Two distinct concepts:
- **Stability**: how much an ecosystem changes under stress (resistance to change)
- **Resilience**: how quickly it returns to its original state after disturbance

Some ecosystems are stable but not resilient (tropical rainforest hard to disturb but slow to recover). Some are resilient but not stable (grasslands change with seasons but bounce back quickly). High biodiversity tends to increase both stability and resilience.

**The Terra Council connection.** In the game, players manage Earth's ecosystems as a planetary council. Every biotic and abiotic factor in the simulator has an analog here: hex biomes correspond to the biome list in 1.2; the carbon-cycle equations come from 1.4; tipping cascades represent loss of ecosystem stability beyond the resilience point.

**Key facts:**
- Ecosystem = biotic + abiotic in a defined area, plus interactions
- Levels: organism → population → community → ecosystem → biome → biosphere
- Energy flows one way; matter cycles
- Liebig's Law of the Minimum (limiting factor)
- Shelford's Law of Tolerance (range of conditions)
- Ecosystems are dynamic, not static; disturbance and recovery are part of normal function
- Stability and resilience are distinct properties
- Ecosystem services valued at $44-145 trillion/year globally`,
      video: {
        url: 'https://www.khanacademy.org/science/ap-environmental-science',
        title: 'Khan Academy — AP Environmental Science: ecosystems',
        provider: 'Khan Academy',
      },
      extendedContent:
`**Why the abiotic/biotic split is more than a label.** Most APES exam questions that look like simple recall are really testing whether you can trace a chain of consequences through this split. A fertilizer runoff prompt is not asking you to define "eutrophication" — it's testing whether you can identify the abiotic change (nutrient pulse, lowered O₂), the biotic response (algal bloom, fish die-off), the resulting feedback (decomposers consuming more O₂, deepening hypoxia), and the management lever (reducing the abiotic input). When you read a question, name the abiotic factor changing first, then the biotic populations responding, then the loop.

**Where students lose points.** "Producers" is not the same as "plants." Photosynthetic bacteria and algae are producers; some non-photosynthetic producers (chemoautotrophs at deep-sea vents) exist too. Conversely, fungi are not producers — they're decomposers. Treating producers and plants as synonyms costs you on questions about marine ecosystems and extremophiles.

**Linking to later units.** The energy-flow language here (10% rule, trophic pyramids) sets up Unit 8 (aquatic and terrestrial pollution) and Unit 9 (climate change). The cycling vocabulary (carbon, nitrogen, phosphorus) sets up Unit 4. Don't memorize this unit in isolation — every ecology term reappears.

**One number worth knowing cold.** ~10% energy transfer between trophic levels. That single rule explains why apex predators are rare, why top-of-food-chain fish biomagnify pollutants, and why eating lower on the food chain is more energetically efficient. It will appear in three different units.`,
    },
    {
      code: '1.2',
      title: 'Terrestrial biomes',
      content:
`A biome is a large-scale terrestrial ecosystem type defined primarily by climate (temperature and precipitation) and characterized by distinctive vegetation and life. The same biome on different continents has different species but similar overall structure — convergent evolution under similar conditions.

**Two axes determine biomes.** Temperature (driven by latitude and altitude) and precipitation (driven by latitude and proximity to oceans + mountain barriers). Plot any place on these two axes and you can predict its biome reasonably well.

**Eight major terrestrial biomes** (memorize these for AP):

**Tropical rainforest.** Hot and wet year-round. Mean annual temperature 25-30°C; precipitation 2000-4500 mm. Tall multilayered canopy with most of the biodiversity. Found near the equator: Amazon Basin, Congo Basin, Indonesia/Malaysia, parts of Central America, Madagascar.

Soils are surprisingly poor — most nutrients are in the living biomass, not the soil. Heavy rainfall leaches soil; nutrients are recycled rapidly through decomposition by abundant fungi.

Hosts ~50% of all terrestrial species despite covering ~6% of land area. Threatened by deforestation, especially in the Amazon and Borneo.

**Tropical seasonal forest / savanna.** Tropical, but with distinct dry and wet seasons. Annual rainfall 250-2000 mm. Found in tropical regions outside equatorial belt: African savannas, Central American dry forests, much of India, northern Australia, the Brazilian Cerrado.

Savannas have scattered trees and abundant grasses. Frequent natural fires (often human-set) maintain grass dominance over forest. Charismatic megafauna: African Serengeti's elephants, lions, giraffes, zebra, wildebeest. Indigenous peoples manage these landscapes through fire for hunting and pastoralism.

**Desert.** Arid, with less than 250 mm annual rainfall. Wide temperature swings (cold nights, hot days; cold winters and hot summers in some). Found at ~30° N and S latitudes (subtropical deserts from Hadley cells) and in rain shadows.

Major deserts: Sahara, Arabian, Mojave, Sonoran, Atacama, Australian outback, Gobi (cold). Sparse vegetation; specialized animals (kangaroo rats with extreme kidney function; succulents storing water). Antarctica's interior is the largest cold desert by area.

**Temperate grassland.** Moderate temperatures, low to moderate precipitation (250-750 mm). Found in continental interiors: North American prairies, South American pampas, Eurasian steppes, African veld.

Naturally dominated by perennial grasses; few trees due to low rainfall and periodic fire. Very fertile soils (deep, rich in organic matter from grass roots). Heavily converted to cropland — the world's grain-producing regions. Less than 1% of North American tallgrass prairie remains in pristine state.

**Mediterranean / chaparral.** Hot dry summers, mild wet winters. Annual precipitation 250-750 mm, falling mostly in winter. Found at ~30-40° latitudes on western coasts: California, Mediterranean Basin, central Chile, southwestern Australia, the South African Cape.

Distinctive scrub vegetation (chaparral, maquis, fynbos). Highly fire-adapted; most plants resprout after burning or have fire-stimulated seeds (serotinous cones in some pines). Disproportionate biodiversity for the area covered.

**Temperate deciduous forest.** Moderate temperatures, abundant precipitation (750-1500 mm). Four distinct seasons; trees lose leaves in winter to conserve water. Found in eastern US, much of Europe, eastern China, southern Japan.

Diverse mix of oak, maple, hickory, beech, basswood, birch. Rich soils. Heavily modified by human use (much was cleared for agriculture in 19th century; recovered partially as agriculture moved west).

**Temperate coniferous forest (boreal precursor).** Cool to cold winters, mild summers, moderate to abundant precipitation. Trees are mostly evergreen conifers (Douglas-fir, redwood, Sitka spruce, hemlock). Found in Pacific Northwest US, southwestern Canada, parts of Europe (Scotland), New Zealand south island. Rainforests in the highest-precipitation portions.

**Boreal forest (taiga).** Cold, with short growing season; moderate precipitation. Dominated by hardy conifers (spruce, pine, fir) and aspen/birch. Found in a circumpolar belt across Canada, Russia, Alaska, Scandinavia.

The largest biome by land area (after considering total tundra + boreal). Slow-growing, but enormous total carbon storage. Permafrost underlies much of it. Climate change is causing massive disturbance: more frequent fires, pest outbreaks (mountain pine beetle in western North America), permafrost thaw.

**Tundra.** Cold, with very short growing season (2-4 months). Permafrost (permanently frozen subsoil) common. Low precipitation (~150-250 mm). Found near the Arctic Circle (Alaska's North Slope, northern Canada, Siberia) and on high mountains (alpine tundra).

Vegetation: low shrubs, sedges, mosses, lichens. No trees due to short growing season and cold. Critical caribou/reindeer habitat. Permafrost stores enormous quantities of carbon — thawing permafrost is one of the climate tipping cascades.

**Ice cap.** Permanent ice cover. Antarctica's interior, Greenland's interior. Very limited biological activity.

**Biome boundaries.** Real boundaries are gradual and shifting. Climate change is pushing biomes poleward (in latitude) and upward (in elevation) by roughly 4-6 km/decade and 4-11 m/year, respectively.

**Convergent evolution.** Different lineages, similar environments → similar adaptations. Cactus (Americas) and euphorbia (Africa, Asia) look similar but are unrelated — both evolved water-storage in desert biomes. Marsupial wolves (Tasmania) and placental wolves (Eurasia) had similar morphology before the marsupial went extinct.

**Net primary productivity by biome** (g/m²/year):
- Tropical rainforest: 2,200
- Estuaries: 2,000
- Wetlands: 1,800
- Temperate deciduous forest: 1,200
- Boreal forest: 800
- Savanna: 700
- Temperate grassland: 600
- Tundra: 140
- Open ocean: 125
- Desert: 90

Biomes with the most life are the warm-and-wet ones — water and warmth enable photosynthesis. Cold and dry constrain productivity.

**Why biomes matter.** Climate change is shifting biomes. Models project tropical and subtropical biomes expanding into temperate latitudes; temperate biomes expanding into former boreal areas; boreal forest losing its southern margins to grasslands; tundra losing ground to boreal forest. The pace of biome shifts may exceed the migration speed of slow-moving species (especially trees), creating mismatches.

**Key facts:**
- Biomes defined by climate (temperature × precipitation)
- Eight major terrestrial biomes plus ice caps
- Tropical rainforest: 50% of species; high productivity
- Desert: <250 mm precipitation; ~30° latitude or rain shadow
- Temperate grasslands: world's grain-producing regions
- Boreal forest: largest land biome; permafrost; climate-sensitive
- Tundra: stores enormous carbon in permafrost
- Convergent evolution: similar adaptations in similar environments`,
    },
    {
      code: '1.3',
      title: 'Aquatic biomes',
      content:
`Aquatic biomes are classified by salinity (marine vs freshwater), depth, water flow, light penetration, and temperature. They cover most of Earth's surface — oceans alone account for 71% — and contain the most ecosystem-service value globally per area, despite hosting fewer total species than terrestrial biomes.

**Two major groups.**

**Marine biomes.** Saltwater (~3.5% salinity by mass). 71% of Earth's surface, but most of it (open ocean) has low productivity.

**Freshwater biomes.** Less than 1% salinity. Lakes, rivers, wetlands. Much less area than oceans but with disproportionate biodiversity (especially fish) and ecosystem services.

**Marine subdivisions.**

**Open ocean (oligotrophic).** Far from coasts. Most of the ocean by area. Low primary productivity (~125 g/m²/yr) because nutrients are scarce — phosphorus and nitrogen sink to the seafloor and only mix to the surface in limited regions.

The open ocean has three zones by depth:
- **Photic zone** (0-200 m): sunlight penetrates; phytoplankton photosynthesize
- **Aphotic zone** (200-1000 m): no light, but cool water with abundant prey
- **Abyssal zone** (1000+ m): deep, dark, cold; specialized ecosystems including hydrothermal vents (chemosynthesis-based, independent of sunlight)

**Coastal ocean.** Highly productive. Sunlight penetrates to seafloor; nutrients from land runoff. Hosts most marine biomass.

- **Estuaries**: where rivers meet ocean; brackish water; highly productive (2000 g/m²/yr); nurseries for many marine species; cradled by tides; major fish/shellfish nurseries; vulnerable to pollution and habitat loss. Chesapeake Bay, San Francisco Bay, Gulf of Mexico estuaries.

- **Salt marshes and mangroves**: vegetated coastal wetlands. Salt marshes in temperate latitudes; mangroves in tropics. Buffer coasts from storm surge; sequester enormous carbon ("blue carbon"); nurseries for fish. ~35% of global mangroves lost since 1980, primarily to aquaculture (shrimp ponds) and development.

- **Coral reefs**: warm tropical waters (mostly 20-30°C); shallow depths (0-50 m); high biodiversity (25% of marine species in 0.1% of ocean area). Symbiotic relationship between coral animals and photosynthetic zooxanthellae algae. Threatened by warming (bleaching) and acidification. The Great Barrier Reef has experienced major bleaching in 2016, 2017, 2020, 2022, 2024.

- **Kelp forests**: cold-temperate coastal waters. Giant kelp (Macrocystis) and other large brown algae form underwater forests. California coast, Chile, southern Australia, South Africa. Sea otter ecosystem (Pacific) — sea otters control sea urchin populations that would otherwise destroy kelp.

- **Intertidal zone**: between high and low tide. Extreme conditions (alternately submerged and exposed). Specialized organisms (barnacles, mussels, sea stars, anemones).

**Freshwater subdivisions.**

**Lakes and ponds.** Standing water. Classified by productivity:
- **Oligotrophic**: low nutrients, low productivity, high oxygen, clear water. Mountain lakes, deep alpine lakes (Lake Tahoe).
- **Mesotrophic**: intermediate.
- **Eutrophic**: high nutrients (from runoff), high productivity, sometimes low oxygen, often murky. Many lower-elevation lakes; many human-impacted lakes.

Eutrophication is when nutrient input (mostly nitrogen and phosphorus from fertilizers, sewage, atmospheric deposition) causes excessive algal growth. The algae die; bacteria decompose them; bacteria consume oxygen; oxygen levels drop; fish die. This is the mechanism of "dead zones."

Lakes have vertical zones:
- **Littoral**: shallow shore zone with rooted plants
- **Limnetic**: open water above the depth where photosynthesis stops
- **Profundal**: deep below the photic zone; few organisms
- **Benthic**: lake bottom

Lakes also have seasonal turnover in temperate climates: in spring and fall, water mixes vertically as temperature equalizes; this brings nutrients up and oxygen down, supporting productivity.

**Rivers and streams.** Flowing water. Classified by stream order — smallest tributaries are 1st order; their confluence makes 2nd order; etc. Mississippi River is 10th order at its mouth.

Upstream sections (1st-2nd order): clear, cold, rocky bottoms, high oxygen, low productivity, trout and salmon species.
Downstream sections (higher order): warmer, turbid, sandy/muddy bottoms, lower oxygen, higher productivity, warmwater fish species.

The "river continuum concept" describes how stream ecology changes from headwaters to mouth.

**Wetlands.** Lands saturated with water for at least part of the year. Three types:

- **Marshes**: dominated by grasses, sedges. Both freshwater (cattail marshes) and salt (salt marshes).
- **Swamps**: dominated by trees. Cypress swamps in Southeast US.
- **Bogs/fens**: peat-dominated, acidic. Northern hemisphere bog.

Wetlands provide enormous ecosystem services: flood mitigation, water filtration, fish nursery, wildlife habitat, carbon storage, recreation. The US has lost ~50% of original wetland area since European settlement; protected since 1970s under Clean Water Act.

**Productivity comparison.**

Highest productivity (g C/m²/yr):
- Estuaries: 2,000
- Wetlands: 1,800
- Coral reefs: 2,500
- Kelp forests: 1,800

Moderate:
- Continental shelf: 360
- Open ocean upwelling zones: 500

Low:
- Open ocean (oligotrophic): 125

Coral reefs and estuaries are among the most productive ecosystems on Earth. Open ocean, despite being vast, is roughly a desert per unit area.

**Threats to aquatic biomes.**

- Overfishing (5.8)
- Pollution: agricultural runoff, sewage, oil, plastics, microplastics
- Ocean acidification (9.7)
- Ocean warming (9.6)
- Coral bleaching
- Coastal development (mangrove loss, salt marsh loss)
- Damming (river fragmentation, sediment trapping)
- Eutrophication (dead zones)
- Aquaculture (shrimp ponds destroying mangroves)
- Plastic pollution (~8-12 million tonnes enter ocean annually)
- Microplastics ubiquitous in water bodies
- Invasive species (zebra mussels, lionfish, Asian carp)

**Why aquatic biomes matter.** Beyond their direct services, aquatic biomes provide:
- About half of global oxygen (marine phytoplankton)
- Climate regulation through ocean heat absorption (~93% of excess heat)
- Carbon sequestration (oceans absorb 25% of human CO₂ emissions; mangroves/salt marshes sequester massive blue carbon)
- Food (fish provide 17% of animal protein consumed globally)
- Drinking water (freshwater systems)
- Transportation (oceans carry 90% of global trade)

**Key facts:**
- Two groups: marine (salinity) and freshwater
- Open ocean: 71% of Earth but oligotrophic (low productivity)
- Coastal/estuaries: high productivity; nurseries
- Coral reefs: 25% of marine species in 0.1% of area
- Lakes: oligotrophic → eutrophic gradient; seasonal turnover
- Wetlands: highly productive; 50% of US lost since settlement
- Phytoplankton produce ~50% of global oxygen
- Aquatic threats: warming, acidification, pollution, fishing, eutrophication`,
    },
    {
      code: '1.4',
      title: 'The carbon cycle',
      content:
`Carbon is the foundation of life on Earth — every organic molecule contains carbon. Carbon also drives Earth's climate through its role in the atmosphere (as CO₂ and CH₄). The carbon cycle is the movement of carbon between four major pools — atmosphere, ocean, terrestrial biosphere, and fossil reserves — and the human disruption of this cycle is the central cause of climate change.

**Four major pools.** Sizes (estimates; recent literature):
- **Atmosphere**: ~875 Gt C (as CO₂ and CH₄)
- **Oceans**: ~38,000 Gt C (mostly as dissolved inorganic carbon — bicarbonate ion)
- **Terrestrial biosphere**: ~2,000 Gt C (in living vegetation and soil organic matter)
- **Fossil reserves**: ~5,000 Gt C still underground (coal, oil, natural gas not yet extracted)

The ocean is by far the largest fast-exchange pool. Surface oceans equilibrate with atmosphere on year-to-decade scales; deep oceans on century-to-millennium scales.

**Major fluxes.** Carbon moves between pools through various processes:

(1) **Photosynthesis.** Plants and algae take CO₂ from the atmosphere (or dissolved in water), combine with water, and produce glucose. Global photosynthesis: ~120 Gt C/year fixed by terrestrial plants, ~50 Gt C/year by marine phytoplankton. About 170 Gt C/year total flux from atmosphere to biosphere.

  6 CO₂ + 6 H₂O + sunlight → C₆H₁₂O₆ + 6 O₂

(2) **Respiration.** All organisms (plants, animals, microbes) use oxygen to break down organic molecules and release CO₂ back to the atmosphere. Plant respiration ~60 Gt C/year; ecosystem respiration (including decomposers) totals ~120 Gt C/year. Roughly half of photosynthesis is balanced by respiration; the other half is balanced by burial of organic matter into long-term carbon pools (and human disturbance).

  C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energy

(3) **Decomposition.** Dead plants and animals are broken down by decomposers (bacteria, fungi). Most carbon released as CO₂; some as methane (in anaerobic conditions like wetlands). Most decomposed material returns to the atmosphere as CO₂; a small fraction is buried in sediments where it slowly forms fossil fuels over millions of years.

(4) **Ocean dissolution.** Atmospheric CO₂ dissolves in seawater (Henry's Law). Ocean takes up ~25% of human emissions each year. The dissolved CO₂ acidifies seawater (9.7). About 90 Gt C/year exchanged between atmosphere and ocean naturally; the human net addition (~2.5 Gt C/yr) is small compared to natural flux but accumulates.

(5) **Sedimentation.** Marine organisms with calcium carbonate shells (foraminifera, coccolithophores, mollusks) settle to the seafloor when they die. Some of the calcium carbonate dissolves; some accumulates as sediment. Over millions of years, sediments compress to form limestone and other carbonate rocks. This is the slow long-term carbon cycle.

(6) **Volcanic emissions.** Volcanoes release CO₂ from Earth's interior, primarily from the breakdown of carbonate rocks under metamorphic conditions. ~0.1 Gt C/year, very small compared to human emissions (~10 Gt C/year).

(7) **Silicate weathering.** CO₂ + water + silicate minerals → bicarbonate ion + clay. This reaction consumes CO₂ over geologic time. Balances volcanic emissions in the long-term carbon cycle. ~0.1 Gt C/year.

(8) **Combustion.** Burning of organic material (wood, fossil fuels) releases CO₂. This is normally a balanced part of the cycle for biological materials (the carbon was recently atmospheric anyway). For fossil fuels (formed over hundreds of millions of years), combustion releases ancient carbon to the atmosphere on a timescale of decades — the major human disruption.

**Human disruption.** The major anthropogenic perturbation:
- Fossil fuel combustion: ~10 Gt C/year (~37 Gt CO₂/yr)
- Cement production: ~0.6 Gt C/year
- Land-use change (deforestation, soil disturbance): ~1.2 Gt C/year
- **Total**: ~11.8 Gt C/year of new CO₂ added to the atmosphere

This is small compared to natural fluxes (~150-200 Gt C/yr in photosynthesis-respiration), but those natural fluxes balance each other. The 11.8 Gt is a net addition.

**The airborne fraction.** Of human emissions:
- ~25% is absorbed by oceans
- ~30% is absorbed by terrestrial sinks (forests, soils)
- ~45% accumulates in the atmosphere

So of the ~11.8 Gt C added each year, ~5.3 Gt C remains airborne, contributing to rising atmospheric concentration.

**The math.** Atmospheric CO₂ has risen from 280 ppm (pre-industrial) to 425 ppm (2024). Each ppm of CO₂ equals about 2.13 Gt C. The increase is:
(425 - 280) × 2.13 = 309 Gt C added to the atmosphere.

Human emissions since 1850 total roughly 650 Gt C. About 50% (~310 Gt C) is now in the atmosphere; the rest is in oceans and biosphere.

**Carbon residence times.** How long does carbon stay in each pool?
- Atmosphere: ~5 years (one molecule) before being absorbed by a plant or ocean
- Ocean (surface): ~50 years
- Ocean (deep): ~1,500 years
- Terrestrial biosphere (live): years to centuries
- Soil organic matter: decades to millennia
- Fossil fuels: hundreds of millions of years

The atmospheric "residence time" is short for any single molecule, but the "perturbation lifetime" — how long a pulse of new CO₂ takes to mostly disappear — is much longer because the molecules re-exchange. Roughly: 50% gone in 30 years; 20% remains for 1000+ years.

**Methane in the carbon cycle.** Methane (CH₄) is a secondary carbon-cycle gas but climatically important. Sources: livestock (enteric fermentation), wetlands, rice paddies, landfills, oil/gas leakage, biomass burning. Atmospheric concentration: 700 ppb pre-industrial → ~1,930 ppb today. Methane oxidizes to CO₂ in the atmosphere over ~12 years.

**Disrupted equilibrium and feedbacks.** As humans add CO₂, several feedbacks operate:
- Warming oceans dissolve less CO₂ (positive feedback: reduces ocean sink)
- Permafrost thaw releases stored carbon (positive feedback)
- Amazon dieback could shift the Amazon from carbon sink to source (positive feedback)
- Forest fires release stored carbon (positive feedback)
- CO₂ fertilization of plants: plants grow faster with more CO₂, increasing biological sink (negative feedback)

Net effect of feedbacks is uncertain but probably positive (amplifying warming).

**Carbon-cycle restoration.** Possible ways to draw carbon back out:
- Reforestation/afforestation (planting trees on previously forested or unforested land)
- Soil carbon sequestration (regenerative agriculture, biochar)
- Mangrove and salt marsh restoration ("blue carbon")
- Bioenergy with carbon capture and storage (BECCS)
- Direct air capture (DAC) — currently expensive
- Mineral weathering acceleration (crushing silicate rocks for surface area)

Together these might draw down a few Gt C/year — useful but not at the scale of current emissions.

**Key facts:**
- Four pools: atmosphere (875 Gt C), ocean (38,000), biosphere (2,000), fossil (5,000)
- Photosynthesis and respiration each move ~120-170 Gt C/yr (largely balanced)
- Human net emissions: ~12 Gt C/yr (37 Gt CO₂/yr)
- Airborne fraction: 45% (25% in oceans, 30% in biosphere)
- CO₂ rose 280 → 425 ppm; 309 Gt C added to atmosphere
- Each ppm CO₂ ≈ 2.13 Gt C
- Perturbation lifetime: 50% gone in 30 yr; 20% remains 1000+ yr
- Methane: 700 → 1,930 ppb; 12-year lifetime; oxidizes to CO₂`,
    },
    {
      code: '1.5',
      title: 'The nitrogen cycle',
      content:
`Nitrogen is essential to all life — proteins and DNA contain nitrogen. Earth's atmosphere is 78% N₂ gas, but most organisms cannot use N₂ directly. The nitrogen cycle describes how nitrogen moves between atmosphere, soil, organisms, and water, with several steps converting it between forms.

**Why N₂ is hard to use.** The N₂ molecule has a triple bond between two nitrogen atoms — one of the strongest covalent bonds in nature. Breaking it requires enormous energy. Most organisms simply can't do it. A few specialized bacteria can, and human industrial processes can. These few pathways are the gateways to all biological nitrogen.

**Major processes.**

**(1) Nitrogen fixation.** Conversion of N₂ to ammonia (NH₃) or ammonium (NH₄⁺) — forms life can use. Three routes:

**Biological fixation.** Performed by specialized bacteria:
- *Rhizobium* (and related genera) form symbioses with legume plant roots (beans, peas, alfalfa, clover, soybeans, peanuts). The plant provides energy; the bacteria provide nitrogen. About 100-200 kg N/ha/year fixed in legume crops.
- *Cyanobacteria* (blue-green algae) fix nitrogen in aquatic environments and some soils.
- *Azotobacter* and *Clostridium* are free-living soil nitrogen fixers.
- *Frankia* fixes nitrogen in symbiosis with alder, casuarina, and other woody plants.

Biological fixation: ~100-200 Tg N/year globally.

**Atmospheric fixation.** Lightning provides enough energy to break N₂. Each lightning bolt produces nitrogen oxides (NOx) which react with water to form nitrates (NO₃⁻), eventually deposited as nitric acid rain. ~10-20 Tg N/year.

**Industrial (Haber-Bosch) fixation.** Human industrial process: N₂ + 3 H₂ → 2 NH₃, at high pressure (200-300 atm) and temperature (400-500°C) with iron catalyst. Developed by Fritz Haber and Carl Bosch (Nobel Prize 1918 for Haber; 1931 for Bosch). The hydrogen comes from natural gas (steam methane reforming).

Industrial fixation: ~150 Tg N/year (mostly as fertilizer ammonia + ammonium nitrate + urea + ammonium phosphate). Now exceeds total natural fixation. About 50% of nitrogen in food crops globally comes from Haber-Bosch.

**(2) Nitrification.** Soil bacteria oxidize ammonium to nitrate in two steps:

NH₄⁺ + O₂ → NO₂⁻ + 2H⁺ (by *Nitrosomonas*; called nitritation)
NO₂⁻ + ½O₂ → NO₃⁻ (by *Nitrobacter*; called nitratation)

Nitrate is the form most plants prefer. Nitrification happens rapidly in well-oxygenated agricultural soils. Acidifies soil (releases H⁺ ions).

**(3) Assimilation.** Plants take up nitrate (and some ammonium) and incorporate it into amino acids, proteins, DNA, RNA. Animals eat plants (or other animals) and assimilate the protein for their own tissues.

**(4) Ammonification.** When organisms die or excrete waste, decomposers break down organic nitrogen compounds and release ammonium (NH₄⁺) back to soil. Ammonification recycles biological nitrogen back into the pool that nitrifiers and plants can use.

**(5) Denitrification.** Anaerobic bacteria convert nitrate back to N₂ gas (and some N₂O), releasing it back to the atmosphere.

NO₃⁻ → NO₂⁻ → NO → N₂O → N₂

Common in waterlogged soils, sediments, and wastewater treatment. Closes the cycle.

**Anammox.** A more recently discovered process: anaerobic ammonium oxidation. NH₄⁺ + NO₂⁻ → N₂ + 2 H₂O. Important in marine sediments and wastewater.

**The full cycle.** Atmosphere (N₂) → fixation → ammonium/nitrate → assimilation → organisms → death/excretion → ammonification → ammonium → nitrification → nitrate → assimilation OR denitrification → back to atmosphere.

**Human disruption of the nitrogen cycle.** Like the carbon cycle, the nitrogen cycle has been radically altered by human activity.

Pre-industrial natural fixation: ~100-200 Tg N/year.
Current total fixation: ~360 Tg N/year (incl. Haber-Bosch + atmospheric NOx).
Human contribution: ~150 Tg N/year from Haber-Bosch + ~25 Tg from fossil fuel combustion.

Humans have roughly doubled the global nitrogen fixation rate. This is one of the largest perturbations to a major biogeochemical cycle in geological history.

**Consequences of nitrogen pollution.**

**Eutrophication.** Excess nitrogen in waterways (from agricultural runoff, sewage) causes algal blooms; algae die; bacterial decomposition consumes oxygen; dead zones form. The Gulf of Mexico dead zone (6,000-8,000 sq mi) is sustained by Mississippi River nitrogen runoff.

**Nitrous oxide (N₂O).** Soil bacteria release N₂O during nitrification and denitrification, especially when nitrogen fertilizer is over-applied. N₂O is a potent greenhouse gas (GWP-100 = 273) and also depletes stratospheric ozone. Atmospheric concentration has risen from 270 to 335 ppb.

**Ammonia volatilization.** Some fertilizer N is lost to atmosphere as NH₃, contributing to particulate-matter pollution and acid rain. About 10-15% of fertilizer N is volatilized.

**Nitrate leaching.** Nitrate is water-soluble and leaches from agricultural soils into groundwater. Excess nitrate in drinking water causes "blue baby syndrome" (methemoglobinemia) in infants and is regulated under EPA at 10 mg/L. Many rural wells in the Midwest exceed this.

**Soil acidification.** Nitrification releases H⁺, acidifying soil over time. Excessive fertilizer application requires lime to neutralize.

**Atmospheric NOx pollution.** Vehicle emissions, power plants release NOx, contributing to smog formation, acid rain, ozone production. Catalytic converters and scrubbers reduce these.

**Nitrogen use efficiency.** Globally, only about half the nitrogen applied to fields is taken up by crops. The rest is lost to volatilization, leaching, denitrification. Improving nitrogen use efficiency is a major goal of sustainable agriculture.

**Methods to reduce nitrogen pollution:**
- Precision agriculture (apply only where needed)
- Cover crops to absorb residual nitrogen
- Buffer strips along streams
- Manure management (covered storage; timing)
- Crop rotation with legumes (substitutes for synthetic N)
- No-till farming (reduces N₂O emissions)

**The Haber-Bosch climate footprint.** Ammonia synthesis consumes about 2% of global energy and produces about 1.4% of global CO₂ emissions. Green hydrogen (from renewable electricity) could allow "green ammonia" with much lower carbon footprint. Several pilot plants in operation.

**Key facts:**
- N₂ has strong triple bond; most organisms can't use it directly
- Three fixation routes: biological (bacteria), atmospheric (lightning), industrial (Haber-Bosch)
- Haber-Bosch: 150 Tg N/year; ~50% of nitrogen in food
- Cycle: fixation → nitrification → assimilation → ammonification → denitrification
- Human activity has doubled global nitrogen fixation
- Consequences: eutrophication, N₂O greenhouse gas, nitrate leaching, soil acidification
- Only ~50% of applied fertilizer N is absorbed by crops`,
    },
    {
      code: '1.6',
      title: 'The phosphorus cycle',
      content:
`Phosphorus is essential to life — it's in DNA, RNA, ATP (the energy currency of cells), and bones. Unlike nitrogen and carbon, the phosphorus cycle has no atmospheric step. Phosphorus moves between rocks, soil, water, and organisms. It's the often-limiting nutrient in freshwater systems and a major driver of eutrophication when excess.

**The unusual phosphorus cycle.** Most phosphorus in Earth's crust is in rocks containing phosphate minerals (apatite, primarily Ca₅(PO₄)₃(OH,F,Cl)). Weathering of these rocks releases phosphate ion (PO₄³⁻) to soils and waters. Plants absorb phosphate; animals eat plants; eventually, phosphorus returns to soil through decomposition or to water through runoff.

Unlike CO₂, N₂, and water vapor, phosphorus has no significant atmospheric reservoir or gaseous form. The cycle is slow at the geological scale.

**Major reservoirs.**

(1) **Marine sediments.** The largest reservoir; ~95% of Earth's phosphorus. Mostly in dissolved or particulate form on the seafloor.

(2) **Crustal rock.** Phosphate minerals in continental and oceanic crust.

(3) **Soil and freshwater.** Phosphate in soil organic matter, available phosphate in soil solution, dissolved phosphate in lakes and rivers.

(4) **Biota.** Living organisms (including humans); ~3 Gt P globally.

**Major fluxes.**

**Weathering.** Rocks containing phosphate minerals are broken down by physical and chemical weathering, releasing phosphate to soil and water. Slow on human timescales — typically <1% of crustal phosphorus releases per million years.

**Plant uptake.** Plants absorb phosphate from soil solution through their roots. Mycorrhizal fungi (symbiotic with roots) greatly increase the uptake area. Most phosphate is taken up as orthophosphate (H₂PO₄⁻ or HPO₄²⁻ depending on pH).

**Trophic transfer.** Animals eat plants; phosphorus passes through food chains.

**Decomposition.** Death and decay return organic phosphorus to soil and water; some becomes available phosphate again; some is bound to soil minerals (especially iron and aluminum oxides) and locked up.

**Runoff.** Phosphate moves from soil to water through erosion (attached to sediment) and dissolved transport. Eventually reaches the ocean.

**Sedimentation.** In ocean sediments, phosphate accumulates. Some is bound to organic matter (carrying carbon down with it); some forms phosphate minerals.

**Uplift.** Geologic processes lift seafloor sediments back to land, completing the cycle on million-year timescales. Some phosphate minerals form economic deposits — Florida's phosphate mines, Moroccan phosphate fields.

**Human disruption.**

**Fertilizer use.** Humans mine phosphate rock and apply it to agricultural fields. Annual global mining: ~50 million tonnes phosphate rock; ~25 Mt of P. Much higher than natural weathering rate.

Phosphate fertilizer is the third major chemical fertilizer (after nitrogen and potassium). NPK ratios on fertilizer bags reflect this — N for nitrogen, P for phosphorus, K for potassium.

Major reserves: Morocco (75% of global), China, US, Russia. Strategic importance of phosphate has political dimensions; some have spoken of "peak phosphorus" — when production peaks and declines. Estimates of remaining reserves vary widely but most suggest several hundred years at current rates.

**Phosphate runoff.** Agricultural fields release phosphate into nearby waterways. About 30-40% of applied fertilizer phosphorus is lost via runoff and erosion.

**Eutrophication.** Phosphate is often the limiting nutrient in freshwater ecosystems. Excess phosphate triggers algal blooms; algae die; bacterial decomposition consumes oxygen; aquatic life dies. Lake Erie has experienced major eutrophication events; the Gulf of Mexico dead zone is partly phosphate-driven.

The "Redfield ratio" — 106 C : 16 N : 1 P — is the typical ratio in marine phytoplankton. Excess of one nutrient can trigger growth limited by another.

**Detergents.** Phosphate-based detergents (laundry, dishwashing) were a major phosphate source to waterways in the 1960s-70s. Largely banned or restricted in most countries since the 1980s.

**Sewage.** Human waste contains phosphorus. Tertiary sewage treatment removes phosphate; secondary treatment doesn't. Many municipalities have upgraded treatment plants to reduce phosphate discharge.

**Erosion.** Soil erosion (which carries phosphate-rich topsoil) is a major loss from agricultural lands.

**The acid mine drainage connection.** Coal and metal mining can release phosphate-binding metals (iron, aluminum) that move to streams and affect phosphate availability.

**Phosphate availability and soil pH.** Phosphate availability depends on soil pH. At low pH (acidic), phosphate binds to iron and aluminum oxides. At high pH (alkaline), it binds to calcium. Optimum pH for available phosphate is 6.0-7.5.

Soil testing for phosphate is part of agricultural management. The Bray P-1 and Mehlich-3 tests are common.

**Phosphate cycling on islands and isolated systems.** Some Pacific islands have phosphate deposits from millennia of seabird guano (bird excrement). Nauru's economy was largely phosphate mining for ~100 years; the resource was exhausted in the 2010s, leaving the island devastated. Banaba (Kiribati) similarly mined out.

**Bones.** Bones are ~50% calcium phosphate. Vertebrate bones over geological time can form phosphate deposits. Some phosphate ores derive from bone deposits.

**Peak phosphorus debate.** Several analyses (Cordell et al. 2009 and others) raised concerns about peak phosphorus — when global phosphate mining peaks and declines. Estimates range from a few decades to several hundred years. The USGS suggests current global reserves are sufficient for ~250-400 years at current use rates, but quality of available reserves declines over time. Phosphorus recycling from urban waste (sewage, food waste) is increasingly viewed as essential for long-term food security.

**Recycling.** Several pathways for closing the phosphorus loop:
- Composting organic waste returns phosphorus to soil
- Manure application returns animal-source P
- Urine and feces recovery (Sweden has experimented with urine diversion)
- Struvite (magnesium ammonium phosphate) recovery from wastewater
- Bone-meal application in agriculture

**Key facts:**
- Phosphorus has no significant atmospheric step
- Major reservoir: marine sediments
- Cycle is slow on geologic timescales (uplift takes millions of years)
- Phosphate is often limiting in freshwater ecosystems
- Industrial mining: ~25 Mt P/year; doubled the cycle
- Morocco holds 75% of global reserves
- Eutrophication driven by P excess
- Soil pH affects phosphate availability; optimum 6.0-7.5
- Detergent bans and tertiary sewage treatment reduce P pollution
- Peak phosphorus concerns; ~250-400 years of reserves`,
    },
    {
      code: '1.7',
      title: 'The hydrologic cycle',
      content:
`The hydrologic cycle (water cycle) is the continuous movement of water between the ocean, atmosphere, and land. Solar energy drives evaporation; gravity drives precipitation; the cycle moves water around the planet. Understanding the cycle is essential to ecology, agriculture, water resource management, and climate change.

**Reservoirs.** Most of Earth's water is in oceans. Tiny fractions are accessible fresh water:
- **Oceans**: 97.5% of all water
- **Ice caps and glaciers**: 1.74% of all water (most of Earth's freshwater)
- **Groundwater**: 0.76%
- **Surface freshwater** (lakes, rivers, swamps): 0.014%
- **Soil moisture**: 0.005%
- **Atmosphere** (water vapor and clouds): 0.001%
- **Biota**: 0.0001%

Despite their small fraction, accessible fresh waters (rivers, lakes, shallow groundwater, soil moisture) support most terrestrial life and human use.

**Major processes.**

**(1) Evaporation.** Solar energy heats water; molecules gain energy and escape into the atmosphere as water vapor. Major source: oceans (about 85% of total). Smaller sources: lakes, rivers, wet soil.

**(2) Evapotranspiration.** Combined evaporation + plant transpiration (water released from leaves through stomata). On vegetated land, transpiration is often the dominant pathway. Global evapotranspiration: ~65,000 km³/year.

**(3) Condensation.** Water vapor in the atmosphere cools as it rises (adiabatic cooling) or moves over cool surfaces. Cooler air can hold less water; excess condenses on aerosol particles (cloud condensation nuclei) to form droplets — clouds.

**(4) Precipitation.** Droplets in clouds grow by collision and coalescence; eventually they become heavy enough to fall as rain, snow, sleet, or hail. Global precipitation: ~510,000 km³/year.

**(5) Runoff.** Water that flows over land surfaces. From precipitation, gravity drives water downhill into streams, rivers, eventually to the ocean.

**(6) Infiltration.** Water seeping into soil. Depends on soil type, vegetation cover, slope, intensity of precipitation. Goes into soil moisture (used by plants) or deeper to groundwater.

**(7) Groundwater flow.** Water below the water table moves slowly through porous rock and sediment toward streams, lakes, or the ocean. Speeds: cm/day to m/year.

**(8) Sublimation.** Solid water (ice, snow) directly becoming water vapor without melting. Small but real contribution from glaciers, snow, ice caps.

**Residence times.** How long water stays in each reservoir:
- Atmosphere: ~9 days
- Soil moisture: weeks to months
- Lakes and rivers: weeks to centuries
- Groundwater: years to thousands of years (deep aquifers — millennia)
- Ice caps: thousands to hundreds of thousands of years
- Oceans: ~3,000-4,000 years

The atmosphere has very short residence time but very high flux — atmospheric water is constantly being replenished.

**Annual fluxes.** Global water balance:
- Evaporation from oceans: ~430,000 km³/year
- Precipitation over oceans: ~400,000 km³/year
- Evapotranspiration from land: ~70,000 km³/year
- Precipitation over land: ~110,000 km³/year
- Runoff (land to ocean): ~40,000 km³/year

Land receives more precipitation than its evapotranspiration; ocean has more evaporation than precipitation; runoff completes the cycle.

**Sub-cycles.** Different time/space scales:
- Daily/diurnal: morning dew, evening fog
- Seasonal: spring snowmelt, summer rainfall
- Annual: monsoons
- Decadal: drought cycles
- Centennial: glacial advance/retreat
- Geological: ice ages

**Watersheds and the hydrologic cycle.** A watershed is the area where all precipitation flows to one outlet. The hydrologic cycle within a watershed determines its water resources. (Covered in 4.6.)

**Human impacts on the hydrologic cycle.**

**Groundwater pumping.** Humans withdraw groundwater faster than it recharges in many regions. Ogallala Aquifer (US Great Plains), North China Plain, Punjab (India), Central Valley California — all experiencing depletion. Recharge takes thousands of years; pumping is essentially mining ancient water.

**Damming and diversion.** Dams alter flow patterns, reduce sediment transport, reduce flow downstream. Some major rivers (Colorado, Yellow, Indus) now run dry before reaching the sea due to dams and diversions.

**Land use change.** Forests increase evapotranspiration; clearing reduces it. Urbanization increases runoff (impervious surfaces); reduces infiltration. Wetlands absorb water; draining wetlands reduces this. Land-use change affects local and regional water balance.

**Pollution.** Sewage, agricultural runoff, industrial discharge contaminate water. About 80% of wastewater globally is discharged without treatment. Drinking water becomes a major issue in poor regions.

**Climate change.** Warmer temperatures intensify the hydrologic cycle. More evaporation means more water vapor; more precipitation; but more variable and intense. Some regions get drier (Mediterranean, southwest US); others wetter. Glaciers retreat; permafrost thaws; sea level rises.

**Water availability and stress.**

**Water-stressed regions.** Where demand exceeds supply: Middle East, North Africa, much of India and China, parts of Sub-Saharan Africa, much of the US Southwest. UN estimates 2 billion people lack access to safely managed drinking water.

**Water footprint.** Total water used to produce a product. Beef: 15,400 L/kg. Coffee: ~140 L/cup. Cotton T-shirt: ~2,700 L. Water-conscious consumption has measurable impact.

**Water scarcity types.**
- Physical scarcity: not enough water in the region (Middle East)
- Economic scarcity: water exists but lacks infrastructure (much of Africa)
- Quality scarcity: water exists but is polluted

**Climate change projections.** IPCC AR6:
- More extreme precipitation events (~7% increase per °C warming)
- More intense droughts in already-dry regions
- More flooding in wet regions
- Snowpack reduction in mountains (less spring melt for summer flow)
- Sea-level rise contaminating coastal aquifers
- Tropical cyclones intensifying with warmer SSTs

**Adaptation.**
- Water-efficient irrigation (drip vs flood)
- Demand reduction (efficient appliances, behavior)
- Water recycling and reuse
- Desalination (energy-intensive but growing)
- Stormwater capture
- Watershed protection
- Cross-basin transfers (controversial)

**Key facts:**
- Water is 97.5% in oceans; <1% accessible freshwater
- Driven by solar energy (evaporation) and gravity (precipitation, runoff)
- Atmospheric residence time ~9 days; ocean ~3,000-4,000 years
- Land receives more precipitation than ET; runoff carries excess to ocean
- Climate change intensifies the cycle: more evaporation, more variable precipitation
- 2 billion people lack safe drinking water
- Water footprint: beef 15,400 L/kg; T-shirt 2,700 L
- Groundwater depletion is widespread and difficult to reverse`,
    },
    {
      code: '1.8',
      title: 'Primary productivity',
      content:
`Primary productivity is the rate at which producers (autotrophs — plants, algae, photosynthetic bacteria) convert solar (or chemical) energy into organic matter. It sets the energy budget for all life — the foundation of every food web. Understanding productivity is fundamental to ecology.

**Gross primary productivity (GPP).** The total rate of energy capture by producers. GPP is the rate at which producers fix carbon dioxide and water into organic compounds via photosynthesis (or chemosynthesis).

Global GPP: ~120 Gt C/year on land + ~50 Gt C/year in oceans = ~170 Gt C/year total. About half this is performed by tropical forests; the other half by all other ecosystems combined (though oceans contribute significantly).

**Net primary productivity (NPP).** GPP minus respiration losses by producers themselves.

NPP = GPP − R_a (autotrophic respiration)

Plants use about 30-50% of fixed energy for their own growth, maintenance, and reproduction. The rest (NPP) is available to consumers.

Global NPP: ~60 Gt C/year on land + ~30 Gt C/year in oceans = ~90 Gt C/year total.

**Net ecosystem productivity (NEP).** NPP minus heterotrophic (consumer) respiration.

NEP = NPP − R_h

If NEP > 0: the ecosystem is a net carbon sink (more uptake than respiration).
If NEP < 0: the ecosystem is a net carbon source.

Most natural ecosystems are at or near zero NEP (in long-term equilibrium); recently disturbed ecosystems are typically sources; growing forests are typically sinks.

**Units.** NPP is typically expressed in:
- Carbon: g C/m²/year, or g C/m²/day
- Energy: kcal/m²/year, or kJ/m²/year
- Dry mass: g dry mass/m²/year, or g organic matter/m²/year

Conversion: 1 g C ≈ 2 g organic matter (approximate; varies by composition).

**Productivity by biome** (g C/m²/year). Approximate global averages:
- Tropical rainforest: ~2,200
- Temperate forest: ~1,250
- Boreal forest: ~800
- Savanna: ~700
- Temperate grassland: ~600
- Tundra: ~140
- Hot desert: ~90
- Cold desert: ~60

**Aquatic biome productivity:**
- Estuaries: ~2,000
- Coral reefs: ~2,500
- Kelp forests: ~1,800
- Wetlands: ~1,800
- Open ocean: ~125
- Continental shelf: ~360
- Upwelling zones: ~500

The most productive ecosystems are warm-and-wet (tropical rainforest, estuaries, coral reefs). The least productive are cold (tundra, ice cap) and dry (desert, open ocean).

**Why tropical rainforests are so productive.** Year-round high temperature → enzymes function efficiently. Year-round precipitation → no water limitation. Year-round sunlight (near-equator). Rapid nutrient cycling through fungi and microbial decomposition. All factors together produce very high productivity.

**Why oceans are mostly low-productivity.** Open oceans have plenty of light at the surface and plenty of water (obviously), but they lack nutrients. Nitrogen and phosphorus rapidly settle to the seafloor as marine organisms die; mixing back to the surface is slow. The open ocean is essentially an aquatic desert.

Exceptions: upwelling zones (where deep nutrient-rich water comes to the surface — Peru, Namibia coastal areas, Antarctic Ocean) are highly productive. Coastal areas with riverine inputs are productive. Coral reefs are exceptions (highly productive, nutrient-poor) because of extensive nutrient recycling.

**Limiting factors for productivity.**

**On land:** water availability is the primary global limit. Within wet regions, temperature, nutrients (especially N and P), and light availability matter.

**In water:** nitrogen and phosphorus availability are typically primary limits in oceans. Light is also important — productivity drops sharply below ~200 m where light fades.

**Iron limitation.** Some open-ocean regions are iron-limited. Adding iron triggers phytoplankton blooms. Geoengineering proposals have considered ocean iron fertilization to draw down CO₂; ecological consequences poorly understood.

**Net primary productivity and the human footprint.** Humans appropriate ~25% of global terrestrial NPP for food, fiber, fuel, and infrastructure (Vitousek et al. 1986). This is one of the most direct measures of human dominance — we capture a quarter of the planet's photosynthetic energy.

**NPP and climate.** Climate change affects productivity in complex ways:
- More CO₂ → enhanced photosynthesis (CO₂ fertilization effect) up to a point
- Warmer temperatures → faster growth in cool ecosystems; stress in already-warm ones
- Changes in water availability → very regional impacts
- Longer growing seasons in cold regions
- Drought stress reduces productivity
- Wildfires release carbon, reduce productivity temporarily

Net effect: globally, NPP has increased slightly with CO₂ fertilization, but increasingly offset by drought, heatwaves, fires.

**Measuring productivity.** Direct measurement is challenging. Methods:
- Eddy covariance flux towers: measure CO₂ flux above ecosystems
- Satellite remote sensing: MODIS, Landsat measure vegetation indices (NDVI, EVI)
- Biomass measurements: harvest plots and weigh
- Forest inventories: tree-by-tree measurement
- Marine: oxygen-flux measurements, chlorophyll concentrations

**Why productivity matters for human society.**
- Sets food supply: NPP appropriation determines how much food humans can produce
- Sets carbon-storage potential: only producers fix carbon from atmosphere
- Sets ecosystem services: most services scale with biomass production
- Sets biodiversity: high productivity often supports higher biodiversity (but not always)

**Key facts:**
- GPP = total energy captured; NPP = GPP − autotrophic respiration
- Global GPP ~170 Gt C/year; NPP ~90 Gt C/year
- Most productive: tropical rainforest, estuaries, coral reefs, kelp forests
- Least productive: hot/cold deserts, open ocean, tundra
- Land limited by water, temperature, nutrients
- Ocean limited by nutrients (especially in open ocean), light below 200 m
- Humans appropriate ~25% of terrestrial NPP
- NPP units: g C/m²/year is standard`,
    },
    {
      code: '1.9',
      title: 'Trophic levels',
      content:
`Trophic levels organize organisms by what they eat — their position in the energy-flow hierarchy. Each level depends on energy from the level below. The framework is a simplification (most species eat at multiple levels), but it's essential to understanding energy flow and biodiversity.

**Level 1: Producers (Autotrophs).** Make their own food from inorganic materials. Two types:

**Photoautotrophs.** Use sunlight as the energy source. Photosynthesis converts CO₂ + H₂O into glucose. Examples: plants, algae, cyanobacteria, photosynthetic protists.

**Chemoautotrophs.** Use chemical energy from inorganic substances. Found in extreme environments without sunlight — hydrothermal vents, sulfur springs, deep subsurface biospheres. Examples: sulfur bacteria, nitrifying bacteria, methanogens. Less abundant globally but ecologically important in specific niches.

Producers are the foundation of nearly all food webs.

**Level 2: Primary consumers (Herbivores).** Eat producers. Examples: cows, deer, elephants, rabbits, caterpillars, aphids, grasshoppers, zooplankton, sea urchins.

In ecosystem terms, herbivores are typically the most numerous animal trophic level (because more energy is available at this level than higher).

**Level 3: Secondary consumers (Carnivores).** Eat primary consumers. Examples: weasels eating mice; bass eating minnows; wolves eating deer; baleen whales eating krill (krill are primary consumers).

**Level 4: Tertiary consumers (Carnivores).** Eat other carnivores. Examples: hawks eating snakes; sharks eating mackerel; eagles eating salmon.

**Level 5+: Apex predators.** Top of the food chain. Few or no predators of their own. Examples: lions, tigers, polar bears, great white sharks, killer whales, humans.

**Omnivores.** Eat both plants and animals. Examples: bears, raccoons, humans, pigs, opossums. Operate at multiple trophic levels.

**Decomposers.** Break down dead organic matter, returning nutrients to the abiotic pool. Bacteria and fungi are the primary decomposers. Some specialized invertebrates (earthworms, termites, dung beetles) also contribute. Decomposers function at every trophic level — they recycle dead matter from every level.

**Detritivores.** Animals that feed on dead organic matter directly (vs decomposers that primarily metabolize molecules). Examples: earthworms, vultures, some crabs and shrimp, fly larvae.

**The energy pyramid.** Energy decreases sharply at each step up the food chain. (Covered in 1.10.) This pyramid shape is the most important pattern in trophic ecology.

**Real ecosystems are food webs, not chains.** A single grasshopper might be eaten by a frog (3rd level), bird (3rd or 4th), spider (3rd or 4th), or human (3rd level). Most animals eat at multiple trophic levels.

The "trophic level" of an organism is often calculated as the weighted average of its food sources. A wolf that eats 80% deer (2nd level) and 20% rabbit (2nd level) is 3rd level. A wolf that eats 50% deer and 50% bear (carnivore) would be somewhere between 3rd and 4th.

**Keystone species.** Species whose effect on the community is disproportionate to their abundance. Often top predators or ecosystem engineers.

Famous examples:
- Sea otters (Pacific kelp forests): otters eat urchins; urchins eat kelp; without otters, urchins explode and kelp is destroyed (the "urchin barren" state).
- Wolves (Yellowstone): wolves reduce elk populations; elk browsing decreases; riparian vegetation recovers; beavers thrive; stream temperature drops; salmon return. The "trophic cascade" of wolf reintroduction.
- Beavers: ecosystem engineers create wetlands. Removing beavers eliminates wetlands.
- Elephants in African savanna: knock down trees; maintain grassland; create water holes used by other species.
- Sharks in coral reefs: top predators that regulate populations of mid-level predators that would otherwise overharvest reef fish.

**Indicator species.** Species whose presence (or absence) indicates ecosystem condition. Examples: mayflies in streams (indicate good water quality); amphibians overall (sensitive to pollution and habitat change); some lichens (sensitive to air quality).

**Climate change effects on trophic structure.**

Top predators are particularly vulnerable. They have:
- K-selected life histories (slow reproduction)
- Low population densities (high range requirements)
- Cumulative pollutant burdens (biomagnification — high concentrations of contaminants)
- Often specific habitat needs

Many top predators are climate-sensitive — polar bears (sea ice), tigers (forest cover), African elephants (vegetation), apex sharks (ocean conditions).

Trophic mismatches: when warming changes the timing of food availability. If insect emergence shifts but bird migration doesn't, breeding success drops. Documented in many systems.

**Apex predator removal cascades.** Removing top predators triggers cascading effects through the food web:
- Mesopredator release: smaller predators proliferate (coyotes thriving as wolves are removed)
- Herbivore boom: primary consumers overgraze
- Vegetation loss: plants and producers decline
- Soil and water effects: erosion, altered hydrology
- Biodiversity loss

The Yellowstone wolf reintroduction (1995) is one of the most-studied cascades — wolf reintroduction reversed many of these effects.

**Biomagnification.** Some toxins (especially fat-soluble organics — DDT, PCBs, mercury) accumulate up the food chain. Each predator eats many prey, concentrating the toxin. Apex predators have the highest concentrations.

Famous example: DDT and birds of prey. Bald eagles, ospreys, peregrine falcons accumulated DDT through fish prey; the toxin caused eggshell thinning; populations crashed. Banning DDT in 1972 (US) and 1980s (most other countries) allowed populations to recover.

Mercury in fish: industrial mercury releases (coal burning, gold mining) volatilize, deposit in water, methylate to methylmercury, bioaccumulate in fish. Predator fish (tuna, swordfish, shark) accumulate high concentrations. EPA advises pregnant women to limit consumption of large predator fish.

**Trophic level efficiency.** How much of one level's energy ends up at the next level? Typically 10% (the famous 10% rule, covered in 1.10). Some ecosystems are more or less efficient — efficient ones can support longer food chains.

**The size of trophic levels.** Each level typically contains less biomass than the level below. Biomass pyramids are characteristic of stable terrestrial ecosystems. (Some aquatic ecosystems show inverted biomass pyramids — phytoplankton biomass at any moment is small, but turnover is fast.)

**Key facts:**
- Level 1: producers (autotrophs)
- Level 2: primary consumers (herbivores)
- Level 3: secondary consumers (carnivores)
- Level 4+: tertiary, apex predators
- Omnivores eat at multiple levels; decomposers recycle from every level
- Keystone species: outsized ecosystem influence (otters, wolves, elephants, sharks)
- Biomagnification: toxins concentrate up the food chain
- Apex predator removal triggers cascading effects ("trophic cascades")
- Climate change disproportionately affects top predators`,
    },
    {
      code: '1.10',
      title: 'Energy flow and the 10% rule',
      content:
`Energy flows through ecosystems one direction: from sunlight to producers, through consumers, ultimately dissipating as heat. At each step, most energy is lost. The famous 10% rule captures this: roughly 10% of energy at one trophic level transfers to the next. Understanding this pattern explains food-chain length, ecosystem biomass, and why predators are rare.

**The fundamental observation.** Raymond Lindeman (1942) measured the energy at each trophic level in Cedar Bog Lake (Minnesota). He found that energy decreased by roughly an order of magnitude (10×) at each step up the food chain. The pattern has been replicated in many ecosystems since.

**Why energy is lost.**

(1) **Respiration.** Organisms use most of their captured energy for their own metabolism — maintaining body temperature, moving, growing, repairing tissue, reproducing. Plants respire about 30-50% of GPP. Animals respire 60-90% of consumed energy. The remaining 10-40% is available for growth or for consumers.

(2) **Waste.** Animals don't fully digest their food. Undigested material leaves as feces. Waste contains energy that the eater couldn't access.

(3) **Heat.** Endothermic animals (mammals, birds) spend major energy maintaining body temperature. Most of this becomes ambient heat — gone.

(4) **Activity.** Movement, hunting, escaping predators, finding mates — all consume energy.

(5) **Inedible parts.** Bones, hair, feathers, scales aren't usually consumed by predators. Even fully eaten prey isn't fully digested.

**The math.** If 10% transfers at each step:
- Producers: 10,000 kcal/m²/year
- Primary consumers: 1,000 kcal/m²/year
- Secondary consumers: 100 kcal/m²/year
- Tertiary consumers: 10 kcal/m²/year
- Apex predators: 1 kcal/m²/year

Each level supports 1/10 the biomass and energy of the level below.

**Why food chains are short.** Energy runs out. Most ecosystems support 4-5 trophic levels at most. By the 5th level, available energy is too small to support a viable predator population — the predator can't find enough prey to sustain itself.

The longest documented food chain is in pelagic marine ecosystems with many trophic levels of zooplankton-eating-zooplankton: ~6-7 levels.

**Variation in trophic efficiency.** The "10% rule" is a generalization. Actual transfer efficiency varies:

- Terrestrial herbivore-to-carnivore: often 5-15%
- Marine plankton-to-fish: often 5-10%
- Aquatic systems with cold-blooded ectotherms: can reach 25-40% (ectotherms don't waste energy on body heat)
- Endothermic predator-eating-endothermic prey: typically 1-5% (both species spend most energy on body heat)

Owl ecosystems can be quite efficient because mice don't expend much energy on heat (small mammals are not very thermoregulatory). Wolf ecosystems are less efficient (both wolves and elk are large endotherms).

**Productivity pyramids.** Stable ecosystems show energy/productivity decreasing with trophic level — the energy pyramid. Energy pyramids are always pyramids (greater base, smaller top). This is a thermodynamic law.

**Biomass pyramids** are usually pyramids too (more producer biomass than consumer biomass), but exceptions exist. Some aquatic ecosystems show inverted biomass pyramids — at any instant, primary producer biomass (phytoplankton) is small, but their fast turnover supports more consumer biomass.

**Number pyramids** can be variable. A single oak tree (1 individual) supports thousands of caterpillars (more numerous than the tree). But energy still decreases going up.

**Implications for human food systems.**

The 10% rule has major implications for feeding humanity.

**Eating lower on the food chain is more efficient.** If we eat plants directly (as primary consumers), we get more of the producer's energy than if we eat animals that ate plants. A pound of beef requires ~7-10 pounds of grain to produce; the rest is lost to cattle metabolism. Vegetarian diets generally have lower environmental footprints.

**Beef has the highest footprint.** Beef has the most inefficient food production: ~7 kg feed per 1 kg beef. Chicken: ~2 kg feed per 1 kg. Plants: ~1 kg.

**Aquaculture efficiency.** Filter-feeding aquaculture (oysters, mussels) is the most efficient form of animal protein production — comparable to or better than plant protein per land area.

**Why can humans eat lots of meat?** Modern industrial agriculture is highly subsidized energy-wise — fossil fuels feed crops, which feed cattle, which feed us. The 10% rule still applies; we just hide its consequences through cheap energy.

**Trophic-level effects of climate change.**

Climate change affects different trophic levels differently:
- Producers: respond to temperature, water, CO₂ (CO₂ fertilization)
- Herbivores: depend on producer health and quality
- Predators: depend on prey populations
- Apex predators: depend on entire chain working

Top predators are particularly vulnerable because they're at the end of the chain. Disruption anywhere below them propagates up.

**Bioaccumulation and biomagnification.** Toxins follow the same energy-flow pattern but become *more* concentrated up the food chain (the opposite of energy).

- Bioaccumulation: a single organism accumulates a pollutant over its lifetime (gets more of it each meal it eats).
- Biomagnification: the pollutant becomes more concentrated at higher trophic levels because each predator eats many prey.

For DDT, mercury, PCBs: top predators may have concentrations 1,000-100,000× higher than the water/soil. This is why tuna and sharks have higher mercury than smaller fish; why bald eagles were threatened by DDT.

**The fish-mercury problem.** Coal-burning emits mercury → atmospheric deposition → water → methylation by bacteria → uptake by plankton → bioaccumulation up food chain → high concentrations in long-lived top predators (tuna, swordfish, shark). EPA advisories restrict consumption of large predator fish, especially for pregnant women.

**Key facts:**
- Energy decreases ~10× at each trophic level (10% rule, Lindeman 1942)
- Loss mechanisms: respiration, waste, heat, activity, inedible parts
- Food chains rarely exceed 4-5 levels because energy runs out
- Variation: ectotherms more efficient (40%) than endotherms (1-5%)
- Eating lower on food chain is more efficient (plant > chicken > pig > beef)
- Biomagnification: toxins concentrate UP the food chain (opposite of energy)
- Apex predators have highest contaminant burdens (mercury in tuna, DDT in eagles)`,
    },
    {
      code: '1.11',
      title: 'Food chains and food webs',
      content:
`A food chain is a linear sequence showing who eats whom. A food web is the realistic network of feeding interactions across multiple species. Real ecosystems are food webs — every species has multiple food sources and predators. Understanding the distinction between chains and webs is essential to ecosystem ecology.

**Food chain.** A linear sequence of feeding relationships, showing energy and nutrient transfer from one organism to the next.

Example: Grass → grasshopper → robin → hawk.

Each arrow indicates "is eaten by" or "transfers energy to." The simplest representation of feeding relationships.

**Food web.** A network of multiple food chains, showing all feeding relationships in a community.

In a real grassland, the chain above is one strand in a web that includes:
- Grass eaten by grasshoppers, deer, mice, rabbits, voles, beetles
- Grasshoppers eaten by birds, frogs, spiders, lizards
- Mice eaten by hawks, owls, snakes, foxes
- Snakes eaten by hawks, larger birds, badgers
- Plus decomposers consuming dead organisms of any kind

**Why webs are more accurate.** Real organisms are rarely strict eaters of just one thing. They have multiple food sources and multiple predators. Most species in any ecosystem participate in many feeding interactions.

**Robustness of webs vs chains.** Food webs are more resilient than food chains.

In a food chain: if grasshopper population crashes, robins go hungry, hawks have less food, the whole chain collapses.

In a food web: if grasshopper population crashes, robins eat other insects, voles eat more grass, hawks eat voles. The community persists.

This is why ecosystem complexity provides resilience — multiple pathways buffer against disturbance.

**Trophic cascade.** A series of indirect effects propagating through a food web from one trophic level to another (often top-down).

Famous example: Yellowstone wolf reintroduction.
- Wolves added back (1995-96)
- Elk populations decreased and changed behavior (less time in valleys)
- Riparian vegetation (willows, aspens) recovered from overbrowsing
- Beavers returned (more willow available for dam-building)
- Streams stabilized (beaver dams + plant roots)
- Stream temperatures dropped
- Salmon returned
- Bird and amphibian populations recovered
- Soil-stabilization improved

The cascade affected ~30+ years of ecosystem dynamics from a single management decision.

**Other famous trophic cascades:**
- Sea otters → urchins → kelp (Pacific Coast)
- Sharks → mid-level predators → reef fish → corals (Caribbean)
- Cod removal → capelin/shrimp increase → cod can't recover (Grand Banks)
- Wolf reintroduction in Isle Royale → moose decline → boreal forest changes

**Trophic interactions.** Beyond eating, organisms interact in other ways that shape webs:

- **Mutualism**: both benefit (corals + zooxanthellae; bees + flowers; mycorrhizal fungi + plant roots)
- **Commensalism**: one benefits, other unaffected (birds following cattle for insects)
- **Parasitism**: one benefits, other harmed (tapeworms in humans; ticks on deer)
- **Competition**: both harmed (two carnivores hunting same prey)
- **Predation**: one kills and eats the other (the relationship that defines trophic levels)

**Niche.** Each species' role in the community — what it eats, what eats it, where it lives, when it's active. The "fundamental niche" is all conditions where a species could survive; the "realized niche" is where it actually lives given competition.

**Competitive exclusion principle.** Two species competing for the exact same resource cannot stably coexist; one outcompetes the other. The principle (Gause 1934) drives niche differentiation — species in the same habitat tend to use different resources or different times.

Example: Three species of warblers in a single tree, occupying different vertical zones — separated by their realized niches.

**Specialists vs generalists.** (Discussed in 3.1.) Specialists have narrow niches and specific food sources; generalists have broad niches. Webs of specialists are easier to disrupt; webs of generalists are more robust.

**Energy flow vs nutrient cycling.** Both happen in webs but differently:

- **Energy flows one direction**: sun → producers → consumers → heat. Lost as heat at each step. Once lost, it's gone (need new solar input).
- **Nutrients cycle**: carbon, nitrogen, phosphorus, water flow between living and abiotic pools. Reused.

A complete view of an ecosystem tracks both — energy as a flow, nutrients as cycles.

**Aquatic food webs.** Often more complex than terrestrial. Phytoplankton at the base; zooplankton; small fish; predator fish; apex marine predators (sharks, tuna, marine mammals). Many overlapping connections. Aquatic systems often have inverted biomass pyramids — the phytoplankton biomass at any moment is small, but turnover is high.

**Decomposer webs.** Often invisible but essential. Bacteria, fungi, and detritivores break down dead organic matter from all trophic levels and return nutrients to the abiotic pool. Without decomposers, ecosystems would run out of usable nutrients.

**Microbial loops.** In aquatic ecosystems, bacteria consume dissolved organic matter, then are eaten by protists, which are eaten by zooplankton. This "microbial loop" is a parallel pathway in marine food webs.

**Climate change and food web disruption.**

Climate change is disrupting food webs in multiple ways:
- Phenological mismatches: timing of predator and prey shifts differently
- Range shifts: species moving poleward at different rates create new mismatches
- Direct mortality: heat stress, oxygen depletion
- Loss of keystone species: cascades downward
- Acidification: affects calcifying organisms (food chain base)

Coral reef food webs are especially vulnerable — warming + acidification disrupts the entire reef community.

**Conservation framing.** Understanding food webs is essential to conservation:
- Single-species protection is often inadequate (saving the lion requires saving its prey base)
- Keystone species deserve special protection
- Habitat restoration must consider whole webs
- Top predators are particularly vulnerable
- Trophic cascades can drive ecosystem-scale recovery

**The "save the bees" example.** Pollinator declines (mostly bees) affect ~75% of crop species. Saving pollinators requires protecting their habitat (flower-rich meadows, hedgerows), reducing pesticides (especially neonicotinoids), and limiting climate change.

**Key facts:**
- Food chain = linear; food web = network
- Webs more robust than chains
- Trophic cascades: indirect effects propagating through web (Yellowstone wolves)
- Competitive exclusion: same niche can't be shared stably
- Niche differentiation: similar species use different parts of resources
- Decomposers and microbial loops are parallel pathways
- Keystone species drive web structure (otters, wolves, sharks, beavers, elephants)
- Climate change disrupts webs through mismatches and direct effects`,
    },
  ],
  keyConcepts: [
    'Ecosystem = biotic + abiotic components and their interactions.',
    'Levels: organism → population → community → ecosystem → biome → biosphere.',
    'Eight biomes determined by climate: tropical rainforest, savanna, desert, temperate grassland, Mediterranean, deciduous forest, boreal forest, tundra.',
    'Aquatic biomes: oceans (most of Earth, mostly low-productivity), coral reefs (highly productive), estuaries (highly productive).',
    'Carbon cycle: 4 pools (atmosphere, ocean, biosphere, fossil); humans add ~12 Gt C/yr to atmosphere.',
    'Nitrogen cycle: N₂ fixation by bacteria, lightning, Haber-Bosch; humans doubled global N fixation.',
    'Phosphorus cycle: no atmospheric step; mined for fertilizer; eutrophication driver.',
    'Hydrologic cycle: solar-driven; 97.5% in oceans; atmosphere only 0.001%.',
    'NPP = GPP − producer respiration. Most productive: tropical rainforest, estuaries, coral reefs.',
    'Trophic levels: producers → primary consumers → secondary → tertiary → apex predators.',
    '10% rule: only ~10% of energy transfers between trophic levels (Lindeman 1942).',
    'Food webs more robust than food chains; trophic cascades when keystone species change.',
  ],
  formulas: [
    {
      name: 'Net Primary Productivity',
      equation: 'NPP = GPP − Rₐ',
      meaning: 'GPP is gross primary productivity; Rₐ is autotrophic respiration; NPP is what consumers can eat.',
      example: 'A grassland: GPP = 5000 g/m²/yr, Rₐ = 2000. NPP = 3000 g/m²/yr available to consumers.',
    },
    {
      name: '10% rule (trophic efficiency)',
      equation: 'E_next ≈ 0.10 × E_prev',
      meaning: 'Energy available at trophic level n+1 is about 10% of level n.',
      example: 'Producers fix 50,000 kcal/m²/yr; herbivores get ~5,000; carnivores ~500; top predators ~50.',
    },
    {
      name: 'Carbon balance',
      equation: 'Atmosphere = Pre-industrial + Human emissions − Sink uptake',
      meaning: 'Of human emissions (~12 Gt C/yr), about 25% goes to ocean, 30% to terrestrial sinks, 45% accumulates in atmosphere.',
      example: 'Atmospheric CO₂ has risen 280 → 425 ppm (~309 Gt C added). About 50% of all human emissions since 1850 are still airborne.',
    },
  ],
  practice: [
    {
      q: 'A forest has GPP = 8,000 kcal/m²/yr and autotrophic respiration of 3,000 kcal/m²/yr. What is the maximum energy theoretically available to tertiary consumers?',
      a: '~5 kcal/m²/yr',
      work: 'NPP = 8000 - 3000 = 5000. Primary consumers: ~500. Secondary: ~50. Tertiary: ~5.',
    },
    {
      q: 'Atmospheric CO₂ rose from 280 ppm (1850) to 425 ppm (2024). If 1 ppm ≈ 2.13 Gt C, how many Gt of carbon were added to the atmosphere?',
      a: '~309 Gt C',
      work: '(425 - 280) × 2.13 = 145 × 2.13 ≈ 309.',
    },
    {
      q: 'Why is the phosphorus cycle considered slower than the nitrogen cycle?',
      a: 'Phosphorus has no atmospheric step; moves from rock to soil to organisms to ocean sediment over geologic time. Nitrogen cycles through the atmosphere on years-to-decades timescales via bacteria and the Haber-Bosch process.',
    },
    {
      q: 'Why do most ecosystems support only 4-5 trophic levels?',
      a: 'Energy is lost at each transfer (10% rule). By the 5th level, only 0.01% of producer energy remains — not enough to support viable predator populations.',
    },
    {
      q: 'Compare productivity (g C/m²/yr) of: tropical rainforest, open ocean, tundra.',
      a: 'Tropical rainforest: ~2,200 g/m²/yr (warm + wet). Open ocean: ~125 g/m²/yr (nutrient-poor). Tundra: ~140 g/m²/yr (cold).',
    },
  ],
  pitfalls: [
    '"The atmosphere is the largest carbon pool" — incorrect. Oceans hold ~50× more carbon than atmosphere.',
    '"Trophic efficiency is always exactly 10%" — varies 1-25% by ecosystem. AP accepts ranges.',
    '"Decomposers are at trophic level 5" — decomposers operate at every level by recycling dead matter.',
    '"GPP = NPP" — incorrect. NPP excludes producer respiration.',
    '"Food chains are how nature actually works" — chains are simplifications. Real ecosystems are food webs.',
    '"Eating local always reduces carbon footprint" — sometimes, but transport is small fraction of food carbon; diet composition (meat vs plants) matters more.',
    '"Producers are at trophic level 1" — by convention, but the level naming is just descriptive.',
    '"Nitrogen and phosphorus cycles are the same" — N has atmospheric step (78% of air); P has no atmospheric reservoir.',
    '"Climate change only affects top trophic levels" — disruption propagates down from any level.',
  ],
};
