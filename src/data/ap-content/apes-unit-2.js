// APES Unit 2 — The Living World: Biodiversity — full teaching content.
// 7 subunits.


export const APES_UNIT_2 = {
  number: 2,
  title: 'The Living World — Biodiversity',
  weight: '6-8%',
  fit: 'core',
  notes: 'Biodiversity drives ecosystem stability — the Terra Council biome cards have a "diversity score" that resists tipping cascades.',
  weeks: [5, 6],
  subunits: [
    {
      code: '2.1',
      title: 'Introduction to biodiversity',
      content:
`Biodiversity is the variety of life at every level — genetic variation within species, the number of different species in a community, and the variety of ecosystems on Earth. It's a multidimensional concept and one of the most important measures of ecosystem health.

**Three levels.**

**Genetic diversity.** Variation among individuals within a species. Different populations carry different alleles; rare alleles may matter for survival under stress. A species with high genetic diversity is more adaptable to environmental change. A species reduced to a small population loses genetic diversity through drift (genetic bottleneck). Examples of bottlenecks: cheetahs (very low genetic diversity from prehistoric crash), Florida panthers (extremely inbred until genetic rescue from Texas cougars).

**Species diversity.** Number and abundance of species in a community. Two components:
- **Species richness**: how many different species (count)
- **Species evenness**: how evenly individuals are distributed among species

A community with 10 species evenly distributed (10% each) has higher evenness than one where one species dominates (90%) and 9 are rare (1.1% each).

The Shannon-Weaver diversity index (H' = -Σ pᵢ ln pᵢ) combines both into a single number. Higher H' = more diverse.

**Ecosystem diversity.** Variety of habitats, communities, and ecological processes in a region. A landscape with many habitat types (forest, wetland, prairie, river) has higher ecosystem diversity than monoculture cropland.

**Biodiversity hotspots.** Conservation International identified 36 regions globally that have:
- At least 1,500 endemic vascular plants (found nowhere else)
- Lost at least 70% of original habitat

These hotspots cover only 2.5% of Earth's land but contain 50% of plant species and 43% of vertebrates. Most are tropical: Mediterranean Basin, Caribbean, Mesoamerica, Tropical Andes, Brazil's Atlantic Forest, Madagascar/Indian Ocean Islands, eastern Afromontane, Indo-Burma, Sundaland (Borneo/Sumatra), Philippines, Polynesia/Micronesia.

The Tropical Andes hotspot alone has 30,000 vascular plant species (15% of Earth's total).

**Global biodiversity.** Estimated 8.7 million species globally; only ~1.5 million described. Most undescribed are bacteria, archaea, fungi, insects, deep-sea organisms.

- Insects: ~1 million described, possibly 6-10 million undescribed
- Plants: ~390,000 described
- Vertebrates: ~70,000 described (mostly fish, then birds, mammals)
- Mammals: ~5,500 species
- Birds: ~11,000 species

Tropical forests host ~50% of all species in ~6% of land area. The deep ocean is similarly under-explored — most species there remain undescribed.

**Why biodiversity matters.**

**Ecological reasons.**
- Stability: diverse ecosystems resist disturbance better
- Productivity: more diverse communities are more productive
- Nutrient cycling: efficient
- Pest control: predator-prey balances limit pest outbreaks
- Pollination: diverse pollinators support diverse plant communities

**Practical reasons.**
- Food: humans have used ~7,000 plant species for food historically; we're down to ~150 actively cultivated and just 12 providing 75% of calories. Most genetic diversity is in landraces and wild relatives — irreplaceable for crop breeding.
- Medicine: ~50% of pharmaceuticals derive from natural products. Penicillin from fungi; quinine from cinchona bark; taxol from Pacific yew; aspirin from willow bark.
- Materials: wood, fiber, oils.
- Genetic resources: traits in wild populations may enable future agricultural breeding, biotechnology.

**Cultural reasons.**
- Indigenous cultures often have deep relationships with specific species
- Aesthetic and recreational value
- Religious and spiritual significance
- Existence value (knowing it exists matters)

**Economic value.** Costanza et al. (2014): global ecosystem services valued at $125 trillion/year (more than global GDP). Most of this depends on biodiversity functioning normally.

**Threats to biodiversity.** Five major threats (HIPPO mnemonic):

- **H**abitat destruction (the largest cause, especially deforestation)
- **I**nvasive species (especially on islands)
- **P**ollution (chemical, plastic, noise, light, thermal)
- **P**opulation (human population growth and consumption)
- **O**verharvesting (fishing, hunting, gathering)

Plus increasingly **climate change** — sometimes added as the sixth threat.

**Current state of biodiversity.**

**Mass extinction in progress.** Background extinction rate: ~1-10 species per million per year. Current rate: 100-1,000× higher. WWF Living Planet Index: vertebrate populations declined 73% on average from 1970-2024.

**Recent extinctions:**
- Tasmanian tiger (1936)
- Caribbean monk seal (1952)
- Western black rhinoceros (2011)
- Pinta Island tortoise (2012)
- Many island birds (extensive)
- Probably many undescribed species

**Critical species.** Approximately 28% of all assessed species are threatened with extinction (IUCN Red List 2024).
- Mammals: 27% threatened
- Birds: 13%
- Reptiles: 17%
- Amphibians: 41%
- Fish: 36%
- Plants: 39%

**Functional biodiversity.** Even if a species isn't extinct, its functional role may collapse. A species reduced to <1% of historical abundance may no longer perform its ecosystem role even though some individuals remain. The American chestnut tree is functionally extinct (still exists but no longer ecologically important).

**Conservation responses.**

**Protected areas.** Currently ~16% of land and 8% of ocean is in protected areas (2024 data). The 30×30 goal (30% of land/ocean protected by 2030) is the international target.

**Convention on Biological Diversity (CBD).** International treaty. Conference of Parties (COP) negotiates targets.

**CITES.** Convention on International Trade in Endangered Species. Restricts international trade in 38,000+ species.

**IUCN Red List.** International list of conservation status: Least Concern → Near Threatened → Vulnerable → Endangered → Critically Endangered → Extinct in the Wild → Extinct.

**US Endangered Species Act (1973).** Federal law protecting listed species and their habitat. Listed: ~2,400 species. Major successes: bald eagle, peregrine falcon, American alligator.

**Species banks/seed banks.** Storage of genetic material for future use. Svalbard Global Seed Vault (Norway) holds ~1 million crop varieties. Millennium Seed Bank (UK) holds wild plant seeds. Frozen ark projects store animal cells/DNA.

**Captive breeding and reintroduction.** California condor reduced to 22 individuals (1987); now ~500+. Black-footed ferret rediscovered (1981) and rebuilt to ~300+. Przewalski's horse reintroduced to Mongolia.

**Rewilding.** Restoring ecological function by reintroducing missing species or removing barriers. European examples: Oostvaardersplassen (Netherlands), Knepp Estate (UK). North American: wolves in Yellowstone, sea otters in California.

**Climate change connection.** Climate change is becoming a leading driver of biodiversity loss:
- Range shifts: species can't move fast enough
- Coral bleaching: catastrophic reef losses
- Phenological mismatches: timing changes
- Ocean acidification: calcifying species impacted
- Drought-driven extinctions
- Habitat conversion (e.g., mangroves to shrimp farms)

**Indigenous-led conservation.** Indigenous peoples manage ~25% of Earth's land but hold ~80% of remaining biodiversity. Indigenous lands generally have lower deforestation rates than national parks. Effective conservation increasingly engages Indigenous communities as partners.

**Key facts:**
- Three levels: genetic, species, ecosystem
- 8.7 million estimated species; 1.5 million described
- Tropical forests: 50% of species in 6% of land
- 36 biodiversity hotspots: 2.5% of land, 50% of plants, 43% of vertebrates
- Current extinction rate: 100-1,000× background
- 28% of assessed species threatened with extinction
- HIPPO threats: habitat loss, invasives, pollution, population, overharvesting + climate change
- WWF: vertebrate populations down 73% (1970-2024)
- 30×30 international protected-area target`,
    },
    {
      code: '2.2',
      title: 'Ecosystem services',
      content:
`Ecosystem services are the benefits humans obtain from ecosystems. The concept formalized in the Millennium Ecosystem Assessment (2005) revolutionized environmental policy by making these benefits visible and economically quantifiable.

**Four categories.**

**(1) Provisioning services.** Material outputs from ecosystems.
- Food: fish, game, fruits, vegetables, grains
- Fiber: cotton, wool, wood, hemp
- Fuel: wood, peat, biofuels
- Genetic resources: traits in wild populations for breeding
- Biochemicals and natural medicines: ~25-50% of pharmaceuticals derive from natural products
- Fresh water: rivers, lakes, aquifers
- Ornamental resources: flowers, shells, decorative wood

**(2) Regulating services.** Benefits from ecosystem processes.
- Climate regulation: forests cool surfaces; oceans absorb heat
- Carbon sequestration: forests, soils, wetlands, oceans store carbon
- Water purification: wetlands, soils filter pollutants
- Pollination: bees, butterflies, birds enable crop reproduction (~75% of crop species; 35% of crop volume)
- Pest and disease control: predators, parasites limit pests
- Erosion prevention: roots stabilize soil
- Storm and flood mitigation: wetlands, mangroves, coral reefs buffer coasts
- Air quality regulation: trees filter pollution
- Wastewater treatment: microbes break down organic waste

**(3) Cultural services.** Non-material benefits.
- Recreation: parks, hiking, fishing, hunting
- Aesthetic value: beautiful landscapes
- Spiritual and religious significance: sacred groves, mountains, rivers
- Educational value: nature reserves, schools
- Sense of place: cultural identity tied to landscape
- Cultural heritage: traditional ecological knowledge
- Inspiration for arts, literature, science

**(4) Supporting services.** Processes that enable other services.
- Nutrient cycling: nitrogen, phosphorus, carbon cycles
- Soil formation: weathering + biological activity
- Primary production: photosynthesis
- Habitat provision: shelter for species
- Genetic diversity maintenance

**Economic valuation.** Costanza et al. (2014): global ecosystem services valued at ~$125 trillion/year (≥ global GDP). Updated estimates: $44-145 trillion/year depending on methodology. Either way, comparable to or greater than the entire global economy.

**Common valuation methods.**

- **Market value**: price of timber, fish, crops directly traded
- **Replacement cost**: cost to artificially replace the service (e.g., water treatment plant if wetland is lost)
- **Hedonic pricing**: implied value from property prices (homes near parks sell for more)
- **Travel cost**: how much people spend traveling to enjoy a natural site
- **Contingent valuation**: surveys asking willingness-to-pay for preservation

**Examples of quantified ecosystem services.**

**Wetlands and flood mitigation.** Wetlands in Louisiana save $13 billion/year in storm damage by buffering hurricane storm surge. Restoring 1 acre of coastal wetland can avoid ~$1,000/year in flood damage.

**Pollination.** ~$235-577 billion/year of global crop value depends on animal pollination. Bee declines threaten this. Many specialized crop-pollinator pairs (alfalfa, almonds depend on specific bees).

**Coral reefs.** Reefs provide ~$36 billion/year globally in tourism, fisheries, coastal protection.

**Mangroves.** Mangroves protect ~15 million people/year from storm surge globally; estimated $80 billion/year in storm protection.

**Forests for water.** Forested watersheds provide clean water cheaply. New York City's Catskills watershed protection saves NYC the cost of filtration plant (~$8 billion saved).

**Pest control.** Insectivorous birds and bats provide ~$23 billion/year in crop pest control in the US.

**The ecosystem-service approach to conservation.** Make the case for conservation by quantifying its economic value. If a wetland provides $X in services, it makes economic sense to protect it. This argument has driven policy:
- Costa Rica's PES (Payment for Ecosystem Services) program pays landowners not to deforest
- China's "Eco-compensation" payments
- REDD+ (Reducing Emissions from Deforestation and forest Degradation) — global climate-finance mechanism
- Watershed payments by downstream users to upstream landowners

**Limits of the approach.**

- Not all values can be quantified (cultural, spiritual)
- Aggregating across scales is uncertain
- May commodify nature in problematic ways
- May prioritize "useful" species over others
- Subject to market manipulation

**Ecosystem services under threat.** Climate change, habitat loss, pollution, and species loss are degrading services globally:

- Pollination: 40% of invertebrate pollinator species at risk of extinction
- Soil: 33% of global soils moderately to severely degraded
- Marine fisheries: 34% overfished
- Forests: 420 million ha lost since 1990
- Wetlands: 35% lost globally since 1970
- Freshwater: 84% of monitored freshwater populations declined since 1970

**Trade-offs.** Ecosystem services often trade off:
- Converting forest to cropland: more food (provisioning) but less carbon storage, less biodiversity
- Damming a river: more electricity but lower fish populations, sediment trapping
- Intensive agriculture: more food but more pollution, less pollinator habitat

Optimal land use considers all services, not just provisioning.

**The "natural capital" framing.** Treating ecosystems as capital assets that produce flows of services. Maintaining "natural capital" is essential for long-term economic sustainability. The UN Statistical Commission has been developing "natural capital accounting" — including ecosystem assets in national accounts.

**Insurance value.** Biodiversity provides "insurance" against environmental change. Diverse communities have multiple species that can perform similar functions; if one is lost, others can compensate. This is the "redundancy" hypothesis. Less diverse communities are more vulnerable.

**Key facts:**
- Four service categories: provisioning, regulating, cultural, supporting
- Global value: $44-145 trillion/year (Costanza 2014)
- Pollination: $235-577 billion/year global crop value
- Coral reefs: $36 billion/year
- Forests: 420 million ha lost since 1990
- Wetlands: 35% lost since 1970
- Payment-for-ecosystem-services programs (Costa Rica, REDD+, watershed payments)
- Insurance value: diverse ecosystems are more resilient`,
    },
    {
      code: '2.3',
      title: 'Island biogeography',
      content:
`Island biogeography is the study of factors that determine biodiversity on islands. The theory, developed by Robert MacArthur and Edward Wilson (1967), explains why some islands have more species than others. It's also crucial to conservation — habitat fragments behave like islands.

**The theory.**

Species richness on an island is determined by the balance between two rates:
- **Immigration rate**: new species arriving (declines as island fills with species)
- **Extinction rate**: species disappearing (increases with more species present)

At equilibrium, these rates are equal. The number of species (S*) is the equilibrium point.

S* depends on two key island characteristics:
- **Size**: larger islands → lower extinction → higher S*
- **Distance from source**: closer islands → higher immigration → higher S*

A small distant island has few species; a large nearby island has many.

**Why size matters.** Larger islands:
- Support larger populations (less prone to extinction by chance)
- Contain more habitat diversity (forests, wetlands, grasslands)
- Have less edge relative to interior
- Can support apex predators (needing large ranges)

Doubling area typically increases species count by ~10-15% (a "species-area relationship" with z ≈ 0.15-0.35).

**Why distance matters.** More distant islands receive fewer immigrants because:
- Fewer can survive the journey (raft, fly, swim)
- Sources of colonists are more distant
- Time and energy demands eliminate weaker travelers

Hawaii is one of the most isolated archipelagos. It has unusually low species richness for its size, but unusually high endemism (high % of unique species) — once a species arrives, it's likely to evolve into something new because it's so isolated.

**The species-area relationship.** S = cA^z, where:
- S = number of species
- A = area
- c = constant depending on taxonomic group and region
- z = slope (typically 0.15-0.35)

For islands: z ≈ 0.25 typically. For habitat fragments: z ≈ 0.20.

**Conservation application.** Habitat fragments behave like islands. As habitat is fragmented:
- Edge effects increase
- Population sizes within fragments decrease
- Species are lost over time
- The loss can be predicted from the species-area relationship

Example: tropical deforestation. If a forest is reduced to 25% of original area (loss of 75%), expected species loss is ~30-50% over time.

**Edge effects.** Habitat boundaries (forest edges) have different ecological conditions from interior:
- Higher temperature
- Lower humidity
- Wind exposure
- Light penetration
- Different predator and competitor pressures
- Easier invasion by exotic species

Fragmenting habitat increases edge-to-interior ratio. Many forest-interior species disappear from small fragments.

**Habitat corridors.** Connecting habitat fragments with corridors helps maintain populations and species. Examples:
- Banff wildlife crossings (highway overpasses for elk, bear, lynx)
- European wildlife corridors
- Yellowstone-to-Yukon initiative (connecting protected areas)
- Coral reef corridors

**Metapopulation theory.** Many species exist as networks of subpopulations connected by occasional migration. Subpopulations may go extinct locally but be recolonized from others. Habitat fragmentation that breaks connections can collapse the whole metapopulation.

**SLOSS debate.** Single Large Or Several Small? Conservation biologists once debated whether one big protected area is better than several smaller ones with the same total area. Now consensus is "it depends":
- Single large: protects more interior species; fewer edge effects
- Several small: protects more habitat diversity; spreads risk
- Both have value

**Examples of island biogeography in action.**

**Krakatoa (1883).** Volcanic eruption destroyed all life on the island and three smaller islets. Recolonization documented species-by-species over decades. Confirmed predictions of island biogeography theory.

**Caribbean.** Larger islands have more species; islands closer to mainland have more species. Pattern fits MacArthur-Wilson predictions well.

**Brazilian Atlantic Forest.** Reduced to <15% of original area. Species loss accelerating; species-area relationship predicts ongoing extinctions over centuries.

**Galápagos.** Closer islands to South America have more species (more immigration); distant islands have lower richness but higher endemism.

**Conservation lessons.**

(1) **Bigger is better.** Larger reserves protect more species.

(2) **Closer is better.** Connect reserves to other habitat for immigration.

(3) **Shape matters.** Round reserves have less edge than long ones.

(4) **Corridors matter.** Connecting fragments increases functional habitat.

(5) **Buffers matter.** Surrounding hostile habitat speeds extinction.

(6) **Time lags exist.** Species debt: after habitat is lost, extinctions continue for decades-centuries.

**Habitat fragmentation in agricultural landscapes.** Agricultural mosaics (cropland with patches of forest) have lower biodiversity than continuous forest but more than intensive monoculture. Hedgerows, woodlots, and conservation reserves preserve biodiversity in working landscapes.

**Marine protected areas.** Apply island biogeography concepts to oceans. Large MPAs with appropriate spacing maintain fish populations across regions. Studies of MPAs document spillover (fish moving from MPA to fished areas) and rapid population recovery.

**Climate-driven "moving islands".** Climate change is making habitat patches "move" — species need to track their suitable climates. Habitat connectivity is increasingly important to allow climate-driven range shifts.

**Key facts:**
- Species richness = immigration − extinction
- Larger islands → lower extinction → more species
- Closer islands → higher immigration → more species
- Species-area relationship: S = cA^z (z ≈ 0.25 for islands)
- Habitat fragments behave like islands
- Edge effects degrade interior habitat
- Corridors connecting fragments help maintain populations
- Krakatoa, Brazilian Atlantic Forest, Galápagos all illustrate principles
- Climate change makes habitat connectivity more important`,
    },
    {
      code: '2.4',
      title: 'Ecological tolerance',
      content:
`Ecological tolerance is the range of environmental conditions within which an organism can survive, reproduce, and thrive. Each species has a tolerance range for each environmental factor — temperature, water, salinity, pH, oxygen, light, nutrients. Outside these ranges, the species cannot persist. Understanding tolerance is fundamental to predicting species distributions and responses to environmental change.

**Shelford's Law of Tolerance.** Victor Shelford (1913) generalized that every species has both an upper and lower limit for each environmental factor. Within this range, the species can survive. Outside it, it cannot.

For a given factor, a species has:
- **Optimal range**: best conditions; maximum growth/reproduction
- **Zones of physiological stress**: organism survives but with reduced function
- **Zones of intolerance**: organism cannot survive

This creates a bell-shaped curve of performance vs environmental factor.

**Tolerance range.** Often expressed as "the temperature range from -X to Y°C" or "tolerates pH from A to B." Examples:
- Brook trout: 0-25°C, prefers <18°C
- Tropical coral: ~20-30°C
- Polar bear: -45 to +20°C (in tundra; warmer in summer)

**Multiple factors interact.** Real organisms must tolerate all relevant environmental factors simultaneously. A species can only thrive where all factors are within tolerance ranges. This is the concept of the "fundamental niche" — the full range of conditions where survival is possible.

**Realized niche.** The actual conditions where a species lives, accounting for competition, predation, and other biotic interactions. Usually smaller than the fundamental niche.

Example: Connell's barnacle experiments showed that the upper limit of *Chthamalus* on rocky shores is set by tolerance (desiccation in the high intertidal); the lower limit is set by competition with *Balanus* (which dominates lower zones). Remove *Balanus* and *Chthamalus* expands downward.

**Acclimation.** Many organisms can adjust their tolerance ranges over time (days to weeks) by changing physiology, behavior, or morphology. This is acclimation. Examples:
- Humans at altitude: more red blood cells over weeks
- Plants in autumn: produce antifreeze compounds (carbohydrates that lower freezing point)
- Fish moving to colder water: change enzyme isoforms

Acclimation differs from adaptation (which is genetic change across generations).

**Generalists vs specialists.**

**Generalists** have wide tolerance ranges and can use many habitats and food sources. Examples: coyotes (anywhere with food), raccoons (urban and rural), crows.

**Specialists** have narrow tolerance ranges and use specific habitats and food sources. Examples: pandas (bamboo), monarch butterflies (milkweed), koala (eucalyptus), Florida panther (specific forest type).

Specialists are more efficient in their niche but more vulnerable to environmental change. Generalists are jack-of-all-trades but masters of none. Climate change favors generalists.

**Latitudinal patterns.** Tropical species often have narrower tolerance ranges than temperate species. They evolved under relatively stable conditions and lack the physiological flexibility to handle wide fluctuations. This may make tropical species especially vulnerable to climate change — even small temperature shifts can exceed their tolerance.

**Indicator species.** Species whose presence or abundance indicates specific environmental conditions because of their narrow tolerance ranges.

- Mayflies (Ephemeroptera): indicate good water quality; sensitive to pollution
- Stoneflies (Plecoptera): indicate cold, clean, oxygen-rich water
- Lichens: indicators of air quality; sensitive to SO₂, NOx
- Amphibians: indicate ecosystem health overall; sensitive to many stresses
- Trout: indicate cold clean water with high dissolved oxygen
- Coral: temperature stress visible as bleaching

Monitoring indicator species provides early warning of environmental change.

**Indicator species in biological monitoring.** Many environmental regulations use indicator species. EPA's biological criteria for water quality use macroinvertebrate community composition. The presence of pollution-sensitive species (mayflies, stoneflies) suggests good water quality; their absence and the presence of pollution-tolerant species (chironomid midges, oligochaete worms) suggests degraded conditions.

**Climate change and tolerance.**

Climate change shifts environments. Species can:
- **Adapt in place** (genetic change over generations)
- **Shift range** (move to new locations with suitable conditions)
- **Acclimate** (adjust physiologically)
- **Phenological shift** (change timing of life events)
- **Become extinct locally** if none of the above suffices

The pace of climate change is exceeding the rate at which many species can move. Trees migrate at ~100 m/year; climate is moving at ~5 km/year. Even fast-moving species struggle.

**Phenological mismatch.** Some species respond to spring warming faster than others. If predator emerges earlier but prey doesn't follow, the predator starves. If pollinator emerges earlier but flowers don't follow, plant doesn't reproduce. Observed in many systems: forest tit feeding chick / caterpillar emergence mismatch in Europe.

**Acidification and aquatic species.** Marine and freshwater pH changes outside tolerance ranges harm many species. Coral cannot calcify well below ~7.8 pH. Salmon eggs cannot hatch below ~6.0. Acidification narrows the available habitat range.

**Pollution tolerance.** Different species have very different tolerance to specific pollutants:
- Lichens: very low tolerance to SO₂
- Some bacteria: extremely high tolerance to heavy metals (used in bioremediation)
- Eels: high tolerance to low oxygen
- Daphnia: low tolerance to toxic chemicals (used in toxicity testing)

**Stress response.** Even within tolerance, organisms expend energy resisting suboptimal conditions:
- HSP (heat shock proteins) repair damaged proteins
- Antioxidants neutralize free radicals
- Behavioral thermoregulation
- Metabolic depression

Energy spent on stress reduces growth, reproduction, and immune function. Marginal-habitat populations are less fit than core populations.

**Implications for conservation.** Species with narrow tolerance ranges need careful conservation:
- Maintain specific microhabitats
- Manage temperature, water quality, food availability
- Plan for climate change (assisted migration may be needed)
- Connect populations to allow gene flow and range shifts

**Key facts:**
- Each species has optimal range, stress zones, intolerance zones for each factor
- Fundamental niche: full possible range; realized niche: actual due to competition/predation
- Acclimation: short-term physiological adjustment (not genetic)
- Generalists: wide ranges; vulnerable in stable times. Specialists: narrow ranges; efficient but fragile.
- Tropical species often have narrower tolerance ranges than temperate
- Indicator species: presence reveals environmental conditions (mayflies, lichens, amphibians)
- Climate change is shifting environments faster than many species can adapt
- Phenological mismatches disrupt predator-prey and pollinator-plant relationships`,
    },
    {
      code: '2.5',
      title: 'Natural disturbances',
      content:
`Natural disturbances are events that change ecosystem structure and function. They're a normal and essential part of ecosystem dynamics — most ecosystems have evolved with specific disturbance regimes. Distinguishing natural disturbances from human-caused ones is essential to ecology.

**Types of natural disturbances.**

**(1) Fire.** Wildfires shape many ecosystems. Some require fire (chaparral, savanna, longleaf pine). Some are normally fire-resistant (tropical rainforest). Fire releases nutrients, opens gaps, recycles biomass.

**Fire-adapted species:**
- Lodgepole pine: serotinous cones open only with heat
- Giant sequoia: cones open after fire; clears competing vegetation
- Chaparral plants: resprout from underground tissues
- Savanna trees: fire-resistant bark
- Many grasses: protected meristems below ground

**Suppressed fire problems.** A century of fire suppression (Smokey Bear policy) led to fuel accumulation in fire-adapted forests. Modern megafires (much larger and more intense than historical fires) result. Combined with climate change, this has produced record-breaking fire seasons.

The Yellowstone fires of 1988 burned 36% of the park. Australia's Black Summer (2019-2020) burned 18 million ha and killed ~1 billion animals. California's 2018-2024 fire seasons each broke records.

**(2) Storms.** Hurricanes, tornadoes, windstorms damage forests; coastal storms reshape shorelines.

Hurricanes and ecosystem effects:
- Forest blowdowns create gaps for regeneration
- Coastal erosion alters shorelines, creates new habitats
- Saltwater intrusion damages freshwater wetlands
- Sediment dispersal nutrients downstream
- Storm surge floods estuaries, redistributes salinity

Tropical cyclones evolved alongside Caribbean and Gulf Coast ecosystems — those ecosystems are adapted to periodic disturbance. Mangroves recover from hurricanes; coral reefs may take decades.

**(3) Floods.** Riverine flooding shapes riparian and floodplain ecosystems. Floods deposit nutrients, recharge groundwater, transport seeds.

Many riparian species require flooding:
- Cottonwoods: seed germination tied to spring floods
- Floodplain forests: depend on periodic inundation
- Salmon: spawn in flood-recharged streams

Dams that prevent flooding have devastated floodplain ecosystems globally. The Mississippi's natural levees and bottomland forests are largely gone.

**(4) Droughts.** Extended dry periods stress ecosystems. Some species adapt (deep roots, dormancy); some die.

Major drought episodes:
- US Dust Bowl (1930s): plowed prairie devastated by drought
- California 2012-2016 drought: forest die-offs, fish kills
- Australia's Millennium Drought (1996-2010): ecosystem-wide effects
- Sahel drought (1970s-90s): contributed to desertification

**(5) Disease outbreaks.** Pathogen epidemics can devastate populations. Often triggered by stress, novel pathogens, or invasive vectors.

Major examples:
- American chestnut blight (1904-): wiped out ~3 billion trees in eastern North America
- Dutch elm disease (1920s-): killed most American elms
- White-nose syndrome (2006-): killed millions of bats in North America
- Mountain pine beetle (2000s-): killed millions of acres of western US pine forests (climate-aided)
- Coral diseases: stony coral tissue loss in Caribbean

**(6) Volcanic eruptions.** Massive disturbance but localized.

Mount St. Helens (1980): primary succession from a sterile substrate documented over 40+ years. New ecosystems are still developing. Fast-establishing species (lupine, fireweed, alder) preceded later forests.

**(7) Glacial advance/retreat.** Long-term disturbance. Ice ages reshape continents over millennia.

**(8) Earthquakes and tsunamis.** Sudden disturbance, localized.

**Disturbance regimes.** Each ecosystem has a characteristic disturbance regime:
- Fire-prone (chaparral, savanna, longleaf pine): frequent fires
- Storm-prone (Caribbean, southeast US): hurricanes every decades
- Stable (tropical rainforest, deep-sea benthos): rare large disturbances
- Pulse-disturbance (rivers, intertidal): regular small disturbances

Species are adapted to their ecosystem's disturbance regime. Disrupting it (suppressing fire, building seawalls, damming rivers) damages the ecosystem.

**Disturbance and biodiversity — the intermediate disturbance hypothesis.** Connell (1978) proposed that biodiversity is highest under intermediate levels of disturbance.

- Low disturbance: competitive dominants exclude weaker species; biodiversity low
- Intermediate disturbance: opens gaps for many species; biodiversity high
- High disturbance: only disturbance-tolerant species survive; biodiversity low

This is most visible in marine intertidal communities, coral reefs, and forests. Some support comes from experiments; many ecologists now see the hypothesis as a useful simplification rather than a universal law.

**Press disturbances vs pulse disturbances.**

- **Pulse disturbance**: short-term shock (fire, storm, flood)
- **Press disturbance**: ongoing chronic stress (warming temperatures, ocean acidification, fragmentation)

Many ecosystems can recover from pulse disturbances but not from sustained press disturbances. Climate change is press disturbance.

**Resilience to disturbance.** How quickly an ecosystem returns to its original state after disturbance. Influenced by:
- Diversity (more diverse = more redundancy = more resilient)
- Connectivity (connected fragments allow recolonization)
- Soil and nutrient stock (legacy of pre-disturbance ecosystem)
- Climate (warm, wet recovery is faster)
- Species' life-history (long-lived species are slow to recover)

**Ecological succession after disturbance.** (Covered in 2.7.) The process of community development from disturbed conditions to a mature, often diverse community.

**Anthropogenic vs natural disturbance.** Humans add new types of disturbance:
- Logging
- Mining
- Agriculture conversion
- Urbanization
- Damming
- Pollution
- Invasive species
- Climate change (the biggest new disturbance)

Many of these are press disturbances that ecosystems cannot recover from.

**The 1988 Yellowstone fires.** Initial public outrage at the loss; later understanding that fire was a natural part of the lodgepole pine ecosystem. The post-fire landscape is now thriving with new lodgepole regeneration. Demonstrated that "natural" fire is not destructive but renewing.

**Salvage logging.** Logging after fire or storm. Controversial — often disrupts the natural recovery that would otherwise occur. Standing dead trees provide habitat and seed sources.

**Climate change and disturbances.** Climate change is intensifying many natural disturbances:
- More frequent and intense fires
- Stronger hurricanes (higher wind speed, more rainfall, slower movement)
- More extreme floods
- Longer/deeper droughts
- Disease outbreaks spreading
- New diseases emerging in new ranges
- Bleaching events more frequent

The IPCC AR6 attributes increased frequency and severity of extreme weather events partially to human-caused climate change.

**Key facts:**
- Types: fire, storms, floods, droughts, disease, volcanic, glacial
- Many ecosystems are fire-adapted (chaparral, savanna, longleaf pine)
- Fire suppression leads to megafires
- Hurricanes shape coastal ecosystems; recovery often natural
- Floods are essential to riparian and floodplain ecosystems
- Drought stresses ecosystems variably
- Disease outbreaks can devastate populations (chestnut blight, white-nose syndrome)
- Pulse vs press disturbances: pulse recoverable; press not always
- Intermediate disturbance hypothesis: max biodiversity at moderate disturbance
- Climate change intensifying many natural disturbances`,
    },
    {
      code: '2.6',
      title: 'Adaptations',
      content:
`Adaptations are heritable traits that increase an organism's fitness — survival and reproduction — in its environment. They are the result of natural selection acting over generations. Understanding adaptation is essential to understanding how species fit their ecosystems.

**Adaptation defined.**

An adaptation is a trait that:
- Is heritable (genetic basis)
- Improves the bearer's fitness
- Resulted from natural selection

Adaptations evolve over many generations through differential reproduction. Variation in traits exists; some variants confer better survival/reproduction; those genes spread through the population.

**Types of adaptations.**

**(1) Morphological adaptations.** Physical structures.
- Polar bears: thick fur, white coloration, large paws for snow walking
- Cactus: spines (modified leaves) reduce water loss; thick fleshy stems store water
- Giraffe: long neck for browsing high
- Tubular feet of woodpeckers
- Streamlined body of dolphins

**(2) Behavioral adaptations.** Patterns of action.
- Migration: monarch butterflies (3,000 miles), Arctic terns (44,000 km annually)
- Hibernation: black bears, ground squirrels conserve energy
- Pack hunting: wolves, lions
- Caching food: squirrels, woodpeckers
- Communal nesting: penguins for warmth
- Tool use: chimpanzees, crows, otters
- Defensive behaviors: opossum playing dead, skunk spray

**(3) Physiological adaptations.** Internal mechanisms.
- Kangaroo rat: extremely concentrated urine, no need to drink
- Wood frog: produces antifreeze, freezes solid in winter, thaws in spring
- Camel: tolerates extreme dehydration, thermal stress
- Mammals at high altitude: more red blood cells
- Anaerobic respiration in some fish (carp) for low-oxygen water

**(4) Reproductive adaptations.** Strategies for offspring success.
- R-selected vs K-selected (3.5)
- Brood parasitism: cuckoos lay in other birds' nests
- Parental care: birds raising chicks, mammals nursing
- Asexual reproduction in some species
- Sexual selection: peacock tails, elk antlers

**Convergent evolution.** Different lineages develop similar adaptations to similar environments. Examples:
- Eyes evolved independently in vertebrates and cephalopods
- Streamlined bodies in fish, dolphins, ichthyosaurs (extinct reptiles)
- Wings in birds, bats, insects, pterosaurs
- Antifreeze proteins in fish from different lineages
- Cacti (Americas) and euphorbia (Africa): both desert succulents but unrelated
- Marsupial wolves (Australia) and placental wolves (Europe): similar morphology

Convergent evolution suggests that environments shape morphology — there are predictable solutions to certain ecological problems.

**Coevolution.** Two species evolving together because they interact closely.

Examples:
- Flowering plants and pollinators: floral shapes match pollinator anatomy
- Parasites and hosts: arms races (host immunity vs parasite countermeasures)
- Predators and prey: speed vs speed
- Insects and toxic plants: insect detoxification vs plant defense
- Coral and zooxanthellae: mutualism in coral reefs
- Mycorrhizal fungi and plant roots: deeply intertwined

The "Red Queen Hypothesis" (Van Valen 1973): "It takes all the running you can do to keep in the same place." Species must continuously evolve just to maintain relative fitness in their ecological interactions.

**Adaptive radiation.** Rapid evolution of many species from a single ancestor as they fill different niches.

Famous examples:
- Darwin's finches: 17 species in Galápagos, each adapted to different food sources
- Hawaiian honeycreepers: ~50 species from single ancestral finch
- Cichlids in African Great Lakes: ~500+ species in Lake Victoria alone
- Australian marsupials: from one ancestral type to wolves, mice, mules, etc.
- Mammalian radiation after dinosaurs (~65 mya)

**Evolutionary timescales.**

- Microevolution: changes within a species over generations (drug-resistant bacteria, pesticide-resistant insects, antibiotic resistance in pathogens)
- Macroevolution: speciation events; emergence of new groups
- Speciation: typically requires reproductive isolation + time. Time varies — bacteria in days, plants in centuries, vertebrates in thousands to millions of years

**Reproductive isolation.** Mechanisms preventing gene flow between groups, allowing them to diverge:
- Geographic isolation: separation by water, mountains, distance
- Temporal isolation: different breeding seasons
- Behavioral isolation: different mate choice
- Mechanical isolation: incompatible reproductive structures
- Gametic isolation: incompatible cells
- Hybrid sterility: offspring infertile (mules)

**Speciation.** When reproductive isolation leads to populations that can no longer interbreed even if reunited. Allopatric speciation (geographic separation) is most common; sympatric speciation (in same location) is rarer but documented.

**Adaptive vs maladaptive traits.** A trait may be adaptive in one environment but maladaptive in another.
- Polar bear fur: adaptive in Arctic, maladaptive at equator
- Dark coloration in cool climates: adaptive (heat absorption), maladaptive in warm
- High-elevation adaptation: maladaptive at sea level

If the environment changes faster than the species can evolve, formerly adaptive traits become maladaptive. This is the climate-change challenge.

**Vestigial structures.** Reduced or non-functional remnants of ancestral adaptations.
- Human appendix
- Whale pelvis (vestige of land ancestor)
- Blind cavefish eyes
- Wisdom teeth

These are evidence of evolution.

**Selection pressures from human activity.**

Modern human activity creates strong new selection pressures:
- Antibiotic resistance: rapid evolution in bacteria
- Pesticide resistance: in insects, weeds, fungi
- Drug resistance: in HIV, tuberculosis, malaria
- Fishing pressure: fish populations evolve smaller body sizes (selection against large reproductive individuals)
- Hunting pressure: tuskless elephants increasing in poached populations
- Urban evolution: pigeons, rats, foxes adapting to cities

**Climate change adaptation.** As climate changes:
- Some species adapt genetically (rapid evolution observed)
- Some species shift range (limited by dispersal)
- Some species acclimate (limited by physiological flexibility)
- Some species die out

The rate of climate change is fast enough that many species cannot keep up. Trees in particular face this challenge — they reproduce slowly and disperse slowly.

**Conservation implications.**

- Protect genetic diversity (raw material for future adaptation)
- Maintain connected habitats (allow range shifts)
- Consider assisted migration (controversial)
- Captive breeding can maintain endangered species but with reduced genetic diversity
- "Ark species" debate: which species to save

**Lamarckism vs Darwinism.** A common misconception is that organisms can will themselves to adapt. They cannot. Natural selection acts on variation that already exists; lucky variants survive and reproduce. Organisms don't "develop" adaptations on demand. (Lamarck's idea of inheritance of acquired characteristics is rejected by modern biology.)

**Key facts:**
- Adaptation = heritable trait increasing fitness
- Types: morphological, behavioral, physiological, reproductive
- Convergent evolution: similar adaptations in similar environments
- Coevolution: species evolving together (Red Queen hypothesis)
- Adaptive radiation: rapid speciation filling niches (Darwin's finches)
- Reproductive isolation enables speciation
- Adaptation requires time (microevolution in days for bacteria; macroevolution in millions of years for vertebrates)
- Human activity creates new selection pressures (resistance evolution)
- Climate change may exceed adaptive capacity of many species`,
    },
    {
      code: '2.7',
      title: 'Ecological succession',
      content:
`Ecological succession is the process of community change over time after a disturbance or in a newly created habitat. It's how ecosystems develop from bare ground or disturbed states to mature, diverse communities. Understanding succession is essential to ecology, conservation, and ecosystem restoration.

**Two types of succession.**

**Primary succession.** Begins on bare, lifeless substrate with no soil. Examples:
- Cooled lava flows (Hawaiian Islands)
- Glacial retreat (revealing bare rock)
- Volcanic eruptions (Mount St. Helens, Krakatoa)
- New islands forming
- Bare rock exposed by erosion or mining

**Secondary succession.** Begins after a disturbance to an existing ecosystem where soil and some biota remain. Examples:
- After forest fire (soil remains)
- After abandoned agriculture (old field succession)
- After clear-cutting (soil intact)
- After hurricane (forest damaged but soil there)
- After flooding (soil disturbed but present)

Secondary succession proceeds much faster than primary because soil and seed banks are already in place.

**Stages of primary succession.**

**(1) Pioneer species.** First colonizers. Tolerate harsh conditions: lichens, mosses, some bacteria. They:
- Break down rock by chemical and physical weathering
- Add organic matter when they die
- Begin soil formation

Pioneer species are typically:
- Small
- Drought-tolerant
- Fast-reproducing
- Wind-dispersed
- Generalist (broad tolerance)

**(2) Soil formation.** Pioneer species accelerate weathering and add organic matter. Bacteria, fungi, and small invertebrates colonize. Soil develops — usually starting with thin organic-rich crust.

**(3) Herbaceous plants.** Grasses, forbs, weeds colonize as soil deepens. They:
- Capture more solar energy
- Hold soil with roots
- Contribute more organic matter
- Provide habitat for invertebrates and small animals

**(4) Shrubs and small trees.** As soil deepens and conditions improve, larger plants establish. These shade out earlier species and outcompete them.

**(5) Climax community.** A relatively stable, mature community. The composition depends on regional climate:
- Temperate east: oak-hickory forest
- Temperate west (Pacific Northwest): Douglas-fir or hemlock-spruce
- Arid west: pinyon-juniper or sagebrush
- Tropical: rainforest

The concept of a single, fixed climax community is now debated. Most ecosystems exist in a dynamic mosaic of successional patches.

**Time scales.** Primary succession from bare rock to forest typically takes 1,000+ years in temperate climates. Secondary succession from old field to forest: 100-200 years.

**Stages of secondary succession (forest example).**

**Year 0-2:** Bare ground; pioneer weeds, grasses establish.

**Year 2-5:** Annual herbs, grasses dominate; perennial plants moving in.

**Year 5-15:** Shrubs and small woody plants establish; some pioneer trees (aspen, alder, birch) appear.

**Year 15-50:** Pioneer tree forest develops; shade-intolerant species dominate.

**Year 50-100:** Shade-tolerant trees (oak, maple, beech) establish under canopy and gradually replace pioneers.

**Year 100+:** Mature forest; "climax" community.

**Old field succession in eastern North America.** Studied extensively. Sequence:
- Annual weeds (year 1-2)
- Perennial grasses (year 2-5)
- Shrubs (year 5-15)
- Pine forest (year 15-100)
- Oak-hickory mixed forest (year 100-200+)

**Mechanisms of succession.**

**Facilitation.** Early species modify the environment, enabling later species to establish.
- Pioneer plants build soil, allowing larger plants
- Alder fix nitrogen, enriching soil for subsequent trees
- Mycorrhizal fungi from earlier plants support later plants

**Inhibition.** Early species prevent later species from establishing.
- Some grasses inhibit tree seedlings
- Mature trees outcompete shrubs

**Tolerance.** Later species establish regardless of earlier species — they're simply waiting their turn.

Real succession involves all three mechanisms.

**Mount St. Helens — a primary succession case study.** Volcanic eruption (May 18, 1980) created vast sterile landscape. Long-term study has documented:

Year 1: First arrivals — wind-borne fungi, bacteria, lichens
Year 2-5: Lupines (nitrogen-fixers) established
Year 5-15: Lupine cover increased; other forbs, small grasses arrived
Year 15-25: Shrubs (huckleberry, alder) became prominent
Year 25-40: Conifer seedlings (Pacific silver fir, noble fir, Douglas-fir) growing
Year 40+: Young forest developing; still 100+ years from old-growth equivalent

The pattern matches classical succession theory but with regional specifics. Mount St. Helens is one of the most studied primary succession sites globally.

**Glacial retreat at Glacier Bay, Alaska.** Glaciers retreating since 1700s. Different ages of substrate visible at increasing distances from current ice front. Sequence:
- Year 0-50: Pioneer mosses, lichens; alder establishing
- Year 50-150: Sitka spruce forest (alder fixing nitrogen, supporting spruce)
- Year 150-250: Spruce-hemlock forest
- Year 250+: Mature hemlock-cedar forest

The Glacier Bay chronosequence provided much of the empirical foundation for succession theory.

**Disturbance and succession.** Most ecosystems are mosaics of patches at different successional stages. After patches of disturbance (windthrow, small fires, tree falls), succession begins anew in each patch. The "shifting mosaic" creates spatial heterogeneity and supports diverse species.

**Climax community concept — current view.** Older ecology proposed a single fixed climax. Modern ecology sees more dynamic, context-dependent endpoints. Communities can have multiple stable states; succession may not end at a single "climax."

In some cases, recurring fire, herbivory, or other disturbance prevents succession from reaching a "climax." Savanna persists as grass-tree mosaic due to fire and herbivory; without these, it would become forest.

**Restoration ecology.** Designing succession deliberately to restore degraded ecosystems.
- Identify reference ecosystem (target)
- Remove invasives
- Plant native species
- Allow succession to proceed
- Monitor and adjust

Examples:
- Tallgrass prairie restoration (Konza Prairie, Kansas)
- Wetland restoration (Florida Everglades)
- Stream and river restoration (Elwha River dam removal)
- Forest restoration after deforestation

**Succession and invasive species.** Invasive species disrupt natural succession. They may:
- Outcompete native pioneers
- Establish where natives would
- Prevent later natives from establishing
- Create new alternative successional pathways

Invasive species management is now part of most restoration projects.

**Land-use change and succession.**

In abandoned agricultural land, succession often proceeds rapidly because soil is already developed. After several decades, vegetation can look mature, but ecological function may not have fully recovered (soil microbial communities, invertebrate diversity, etc., can take longer).

In landscape mosaics with cropland, hedgerows, woodlots, and abandoned fields, succession creates valuable patchwork habitat for wildlife.

**Climate change and succession.** Climate change is affecting succession:
- Faster decomposition in warmer conditions
- New invasives spreading
- Species range shifts disrupt expected sequences
- Drought slows succession
- Fire frequency changes (e.g., more frequent in fire-adapted ecosystems)

Forests now growing on disturbed land may end up as different forests than 100 years ago because the climate is different.

**Key facts:**
- Primary succession: bare substrate, no soil (lava, glacier, new island)
- Secondary succession: after disturbance with soil remaining (fire, agriculture, hurricane)
- Pioneer species: hardy, fast-reproducing, generalist
- Stages: pioneers → herbaceous → shrubs → tree forest → "climax"
- Climax: not always single endpoint; some communities have multiple stable states
- Time scales: primary 1000+ years; secondary 100-200 years
- Mechanisms: facilitation, inhibition, tolerance
- Mount St. Helens and Glacier Bay are classic primary succession sites
- Restoration ecology applies succession theory to ecosystem recovery`,
    },
  ],
  keyConcepts: [
    'Three levels of biodiversity: genetic, species, ecosystem.',
    'Tropical forests: ~50% of species in 6% of land.',
    'Current extinction rate: 100-1,000× background.',
    'HIPPO threats: habitat loss, invasive species, pollution, population, overharvesting; + climate change.',
    'Four ecosystem-service categories: provisioning, regulating, cultural, supporting.',
    'Global ecosystem services valued at $44-145 trillion/year (Costanza).',
    'Island biogeography: S = cA^z; larger and closer islands have more species.',
    'Shelford\'s Law of Tolerance: every species has tolerance range for each environmental factor.',
    'Indicator species reveal environmental conditions through their narrow tolerance.',
    'Natural disturbances: fire, storms, floods, drought, disease, volcanic, glacial. Most ecosystems are adapted to specific regimes.',
    'Adaptation = heritable trait increasing fitness. Convergent evolution shapes similar species in similar environments.',
    'Ecological succession: primary (no soil) and secondary (soil intact); pioneer → herbaceous → shrubs → trees.',
  ],
  formulas: [
    {
      name: 'Species-area relationship',
      equation: 'S = cA^z',
      meaning: 'S = species count; A = area; c, z = constants for taxa/region. z ≈ 0.25 for islands.',
      example: 'If a forest is reduced from 10,000 ha to 1,000 ha (90% loss), species count drops to (0.1)^0.25 ≈ 56% — a ~44% extinction debt.',
    },
    {
      name: 'Shannon-Weaver diversity index',
      equation: "H' = -Σ pᵢ ln pᵢ",
      meaning: 'pᵢ is the proportion of individuals in species i. Higher H\' = more diversity.',
      example: 'Community of 5 species at 20% each: H\' = -5 × 0.2 × ln(0.2) = 1.61. Community with one species at 80% and four at 5% each: H\' = -(0.8 × ln 0.8) - 4(0.05 × ln 0.05) = 0.78. Less even = lower H\'.',
    },
  ],
  practice: [
    {
      q: 'An island originally had 200 species. Habitat is reduced to 25% of original area. Using z = 0.25, how many species are likely to persist?',
      a: '~141 species (29% loss). 200 × (0.25)^0.25 = 200 × 0.71 = 141.',
    },
    {
      q: 'What are the four categories of ecosystem services? Give one example of each.',
      a: 'Provisioning (food, fiber, water). Regulating (climate regulation, pollination, water purification). Cultural (recreation, spiritual). Supporting (nutrient cycling, soil formation).',
    },
    {
      q: 'A monoculture cornfield is replaced with a mixed agroforestry system. Why does ecological tolerance theory predict the new system will be more resilient to drought?',
      a: 'Different species have different tolerance ranges. Some agroforestry components (trees with deep roots) will survive drought even if corn fails. Diverse system has redundancy — multiple species can provide ecosystem function, so loss of any single species doesn\'t collapse the system.',
    },
    {
      q: 'After a forest fire, secondary succession begins. What stage typically dominates 10 years later?',
      a: 'Herbaceous plants and shrubs. Pioneer trees (aspen, alder, birch) may be establishing but not dominant.',
    },
    {
      q: 'Define the difference between fundamental niche and realized niche.',
      a: 'Fundamental niche: full range of conditions where a species could survive given only abiotic factors. Realized niche: actual conditions where the species lives, accounting for competition, predation, and other biotic interactions. Realized is usually smaller than fundamental.',
    },
  ],
  pitfalls: [
    '"Biodiversity = number of species" — incomplete. Also includes genetic diversity and ecosystem diversity.',
    '"Tropical species are more adaptable to change" — opposite. They often have narrower tolerance ranges than temperate species.',
    '"Climax community is fixed and permanent" — modern ecology sees more dynamic, context-dependent endpoints.',
    '"Smaller islands have fewer species because of lower habitat diversity only" — also extinction rate. Smaller populations are more prone to chance extinction.',
    '"Habitat fragmentation doesn\'t hurt if some habitat remains" — small fragments accumulate "extinction debt"; species disappear over decades.',
    '"Pioneer species are weak competitors that disappear permanently" — they fill ecological roles in early succession and may persist in disturbed patches.',
    '"Ecosystem services are luxury concerns" — they\'re economic essentials; ecosystem-service loss directly affects human welfare.',
    '"Adaptation can happen in one generation" — adaptation is genetic change over many generations. Within-generation adjustment is acclimation, not adaptation.',
    '"All natural disturbances are bad" — most ecosystems are adapted to specific disturbance regimes. Suppressing fire in fire-adapted ecosystems creates worse problems.',
  ],
};
