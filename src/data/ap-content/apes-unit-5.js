// APES Unit 5 — Land and Water Use — full teaching content.
// Climate-relevant. 17 subunits, each a complete lesson.


export const APES_UNIT_5 = {
  number: 5,
  title: 'Land and Water Use',
  weight: '10-15%',
  fit: 'core',
  notes: 'Regions browser is precisely a tragedy-of-the-commons interface. The land-use system on each hex maps to the AP\'s "impacts of practices" subunits.',
  weeks: [13, 17],
  subunits: [
    {
      code: '5.1',
      title: 'Tragedy of the commons',
      content:
`The tragedy of the commons is one of the most-cited concepts in environmental policy. Garrett Hardin's 1968 essay (Science) described it through a hypothetical pasture: a number of herders share the right to graze cattle on a common pasture. Each herder, acting rationally to maximize personal benefit, adds more cattle. Each animal added to one's own herd yields full personal benefit, but the cost (degraded pasture from overgrazing) is shared among all users. As each rational herder adds more animals, the pasture is destroyed. The tragedy: collective ruin from individually rational decisions.

**The structure.** A shared resource (the commons) is over-exploited because:
- Benefits are concentrated (each user captures the full benefit of their own use)
- Costs are diffuse (degradation is shared among all)
- No mechanism limits individual use

The pattern recurs throughout environmental problems:
- **Atmospheric carbon dioxide** as a global commons: each country/firm/individual emits because they capture the benefits (energy use, transport, industry) while the costs (climate damage) are spread across all of humanity and future generations.
- **Ocean fisheries**: each fishing vessel catches as much as it can; the total catch can exceed sustainable yield; fisheries collapse.
- **Groundwater aquifers**: each farmer pumps; the aquifer drains; eventually all users lose access (Ogallala in US Great Plains).
- **Tropical rainforest**: each landowner can clear for agriculture; collective deforestation drives Amazon dieback.
- **Antibiotic resistance**: each prescription provides individual benefit; the public health cost (resistant pathogens) is borne collectively.

**Three classic solutions.**

(1) **Regulation.** Government sets limits. Quota systems for fisheries; pollution permits with caps; cap-and-trade for emissions; protected-area designations. Effective when enforceable and politically acceptable, but requires monitoring, capacity, and political will. The Montreal Protocol on ozone-depleting chemicals is the most successful example at global scale.

(2) **Privatization.** Convert the commons to private property. Each owner has a personal stake in long-term resource health. Works well when boundaries can be defined (a lake; a forest plot) and the resource can be excluded from outsiders. Examples: individual transferable quotas (ITQs) in fisheries; private forest holdings; private water rights. Concerns: equity (initial allocation matters), exclusion of traditional users, and some commons can't be effectively privatized (the atmosphere).

(3) **Community management.** Elinor Ostrom (Nobel Prize 2009) showed that local communities can sustainably manage commons through self-organization. Her eight design principles describe what makes community management work: clear boundaries, congruence between rules and local conditions, participatory rule-making, monitoring, graduated sanctions, conflict-resolution mechanisms, recognition by external authorities, nested governance. Examples: traditional irrigation systems in Bali (subaks), Japanese village forests, Maine lobster fisheries, Mongolian grasslands.

**The climate version.** Climate change is a global commons problem at maximum difficulty. The "commons" is the atmosphere's capacity to absorb CO₂. The "users" are 200+ sovereign nations plus countless firms and individuals. There is no global government to regulate. Privatization (a global carbon tax) requires multilateral agreement that has been elusive. Community management at the global scale is unprecedented.

The Paris Agreement (2015) attempts a hybrid: nations submit Nationally Determined Contributions (NDCs) and report progress; peer pressure and ratchet mechanisms aim to converge toward adequate ambition. Whether this voluntary framework can sustain the trajectory required is the open question.

**Key facts:**
- Hardin 1968, Science. The hypothetical was actually wrong about most historical commons — most were governed by community rules. But the abstract structure is real.
- Three solution categories: regulation, privatization, community management
- Ostrom (Nobel 2009): community management can work; eight design principles
- Climate is the largest tragedy of the commons humanity has faced
- Examples: fisheries, aquifers, tropical forests, antibiotic resistance, atmosphere`,
    },
    {
      code: '5.2',
      title: 'Clearcutting',
      content:
`Clearcutting is the removal of all (or nearly all) trees in a defined area at one time. It's the dominant timber-harvest method in industrial forestry — cheap, mechanizable, productive — but ecologically the most disruptive.

**The economic case.** Cutting all trees at once is much cheaper than selective cutting per unit of wood produced. Loggers can use large machines (feller-bunchers, skidders, log-loaders) efficiently in clearcuts; selective cutting requires careful navigation around residual trees and limits machine size. Industrial timber economics has historically favored clearcuts.

**Ecological impacts.**

**Soil erosion.** Without the protective canopy and the network of roots that hold soil in place, exposed soil washes away in rain. Sediment-laden runoff degrades downstream watersheds. The 1949 floods in the Pacific Northwest were attributed partly to upstream clearcuts.

**Watershed disruption.** Forests intercept rainfall, slowing its journey to streams. Clearcuts release water more abruptly, increasing flood risk during storms and reducing dry-season flow. Tributaries can become flashier (rapid peaks and troughs).

**Habitat loss.** Many forest species depend on intact mature canopy: northern spotted owl, marbled murrelet, fisher, certain salamanders, woodland warblers. Old-growth forest cannot be replaced quickly — recovery to mature forest takes decades to centuries. Clearcutting on a landscape scale fragments habitat into isolated patches.

**Carbon release.** Mature forest stores 200-400 tonnes of carbon per hectare in trees, soil, and dead wood. Clearcutting releases most of this as CO₂ either immediately (burned slash, decaying woody debris) or over decades (decomposing soil organic matter, used wood products). The replanting of clearcut areas does eventually re-sequester carbon, but creates a multi-decade "carbon debt" period.

**Edge effects.** A clearcut creates a sharp boundary between cleared and forested land. Wind dries out the forest interior near the edge; sun exposure changes microclimate; invasive species establish on the boundary. The effective forest area is smaller than the remaining canopy implies — edge effects penetrate 50-200 m into the remaining forest.

**Loss of seed source.** Some tree species (large-seeded oaks, hickories) depend on seed dispersal from adjacent mature trees. Clearcutting removes the local seed source for these species, biasing regeneration toward wind-dispersed or pioneer species (Douglas-fir, alder, birch).

**Stream temperature.** Removing riparian forest exposes streams to direct sunlight, raising water temperature. Salmon and trout populations decline as water temperatures rise above their tolerance range (about 15°C for many salmonids).

**Alternatives.**

**Selective cutting.** Harvesting individual or small groups of trees while maintaining the surrounding canopy. Slower, more expensive, but maintains canopy cover, biodiversity, and most ecosystem services. Used in some private forests and increasingly in public-forest management.

**Shelterwood cutting.** A two-stage process. First cut removes lower-quality trees; second cut, often 5-15 years later, removes mature trees while leaving regenerating seedlings. Maintains some canopy cover throughout. Used for shade-tolerant species (oak, maple).

**Strip cutting.** Long, narrow clearcuts (50-100 m wide). Edges allow seed dispersal from adjacent uncut areas. Less efficient than full clearcuts but reduces some impacts.

**Variable retention harvest.** A modern approach: 5-30% of the trees are retained in clusters or scattered patterns. Mimics natural disturbance patterns (wildfire, blowdown). Used in Pacific Northwest US.

**Aggregate retention.** All harvest concentrated in small areas; large adjacent areas left uncut.

**Plantation forestry.** Areas planted with single species (Douglas-fir, southern pine) for industrial timber. Often clearcut on 30-80 year rotations. Higher productivity than natural forest but lower biodiversity and ecological function.

**Regulatory frameworks.** Forest Stewardship Council (FSC) certification limits clearcut size and prohibits clearcutting in some ecosystems (old-growth, wetlands). Sustainable Forestry Initiative (SFI), Programme for the Endorsement of Forest Certification (PEFC), and various national certifications have similar provisions.

**Key facts:**
- Clearcutting is cheap but ecologically disruptive
- Mature forest stores 200-400 tonnes carbon/ha
- Erosion, watershed disruption, habitat loss, edge effects, stream temperature
- Alternatives: selective, shelterwood, strip, variable retention, aggregate retention
- FSC certification limits clearcut size
- Forest carbon recovery takes decades to centuries`,
    },
    {
      code: '5.3',
      title: 'The Green Revolution',
      content:
`The Green Revolution is the mid-20th-century transformation of agriculture through high-yield crop varieties, synthetic fertilizers, pesticides, irrigation, and mechanization. It dramatically increased food production and is credited with averting predicted famines, particularly in India and other developing countries. Its environmental costs are now major sustainability concerns.

**The historical context.** In the 1940s-1960s, much of the world faced food scarcity. Population was growing rapidly. Thomas Malthus's 18th-century prediction of demographic catastrophe seemed to be confirming. The 1943 Bengal famine killed 2-3 million people. India in the 1960s appeared to face mass starvation.

Norman Borlaug (1914-2009), an American agronomist working with the Rockefeller Foundation, led plant-breeding efforts in Mexico from the 1940s. His team developed "dwarf wheat" varieties — short, sturdy plants that could support heavy grain heads, respond to fertilizer, and resist fungal diseases. These varieties produced 2-3× the yield of traditional varieties. The technology was transferred to India and Pakistan in the late 1960s; food production surged, and predicted famines were averted. Borlaug received the Nobel Peace Prize in 1970.

**The technological package.** The Green Revolution was not a single innovation but a coordinated set:

(1) **High-yield variety (HYV) crops.** Wheat (dwarf varieties), rice (IR8 "miracle rice" from the International Rice Research Institute), maize, sorghum. Bred for response to fertilizer, disease resistance, photoperiod insensitivity (so they could be grown in different latitudes).

(2) **Synthetic nitrogen fertilizer.** The Haber-Bosch process (developed 1909, scaled in the 20th century) extracts atmospheric N₂ and combines it with hydrogen to form ammonia (NH₃). Ammonia is converted to fertilizer compounds (urea, ammonium nitrate, ammonium phosphate). Synthetic nitrogen fertilizer now provides about half the nitrogen used in agriculture globally.

(3) **Phosphorus and potassium fertilizers.** Mined phosphate rock; mined potash.

(4) **Synthetic pesticides.** DDT (insecticide, since 1940s; banned in most uses 1970s), atrazine (herbicide), glyphosate (herbicide; Roundup, 1974).

(5) **Irrigation.** Surface water diverted from rivers (dams, canals); groundwater pumped from aquifers (tube wells in India).

(6) **Mechanization.** Tractors, combines, machinery for sowing and harvesting.

(7) **Improved seeds and seed distribution systems.** Farmer access to new genetic stocks.

**Yields and outcomes.**

Wheat yield in India: ~10 quintals/hectare (1965) → ~30 quintals/ha (1990) → ~36 quintals/ha (2020).
Rice yield: doubled or tripled in many regions.
Global cereal production: tripled from 1960 to 2020.

The Green Revolution allowed global population to grow from 3 billion (1960) to 8 billion (2022) without the predicted Malthusian collapse.

**Environmental and social costs.**

(1) **Soil degradation.** Intensive tilling, monoculture, and chemical fertilizer use deplete soil organic matter and structure. Topsoil eroded faster than naturally regenerates (1 inch in ~500-1000 years). FAO 2015: 33% of global soil is moderately or highly degraded.

(2) **Water depletion.** Irrigation drew down groundwater. The Ogallala Aquifer (US Great Plains) has dropped ~30% since 1950 from irrigation overdraft. India's groundwater levels are falling rapidly in agricultural regions (NASA GRACE satellite data).

(3) **Nutrient pollution.** Excess nitrogen and phosphorus fertilizer runs off into waterways, causing eutrophication. The Gulf of Mexico "dead zone" (6,000-8,000 sq mi) is sustained by Mississippi River nutrient runoff.

(4) **Pesticide resistance.** Targeted pests evolve resistance through natural selection. By the 2010s, glyphosate-resistant weeds (palmer amaranth, marestail) are common in US croplands. The "treadmill" of new pesticide development barely keeps up.

(5) **Biodiversity loss.** Monocultures replace diverse landscapes. Hedgerows, pollinator habitats, and traditional crop varieties have been lost. Insect populations in agricultural areas have declined dramatically (Hallmann 2017: 76% decline in flying insect biomass in German nature reserves).

(6) **Fossil fuel dependence.** The Green Revolution runs on fossil energy. Haber-Bosch ammonia synthesis requires natural gas as feedstock (the hydrogen) and energy (high pressures/temperatures). Synthetic ammonia production accounts for ~2% of global energy use and ~1.5% of global CO₂ emissions. Tractors and machinery use diesel. Pesticide production requires fossil-fuel feedstocks.

(7) **Social effects.** Green Revolution disproportionately benefited larger farms with capital to invest in fertilizer, pesticide, irrigation, and machinery. Small farmers without resources fell behind; some lost land. Rural-urban migration accelerated.

(8) **Health impacts.** Pesticide exposure of agricultural workers; pesticide residues on food (though typically below regulatory limits). Health effects of long-term low-dose exposure remain debated.

**Carbon footprint.** Modern industrial agriculture, particularly with intensive fertilizer use, emits significant greenhouse gases:
- N₂O from fertilized soils (a potent greenhouse gas; GWP-100 of 273)
- CO₂ from fossil-fuel inputs (ammonia production, machinery, pesticide production)
- Methane from rice paddies (anaerobic conditions; methanogens)
- Methane from livestock (enteric fermentation)
- CO₂ from land-use change (deforestation for new cropland)

Agriculture and land use account for ~22% of global greenhouse gas emissions.

**Critiques and alternatives.** Some criticisms: the Green Revolution made food systems more vulnerable (dependence on inputs, monocultures, fewer crop varieties), increased inequality, and shifted attention from social/political causes of famine (Sen 1981, "Poverty and Famines"). Alternatives have emerged: agroecology, regenerative agriculture, organic farming, permaculture, integrated pest management, sustainable intensification.

**The next agricultural transition.** Many call for a "Second Green Revolution" focused on reducing inputs while maintaining yields: precision agriculture (apply fertilizer/pesticides only where needed), GMO crops with built-in pest resistance (reduces pesticide use), no-till farming (preserves soil), cover crops (cycles nutrients in living systems), agroforestry (combines trees with crops).

**Key facts:**
- Norman Borlaug Nobel 1970; "father of the Green Revolution"
- Wheat yields tripled; global cereal production tripled (1960-2020)
- Averted predicted famines in India and elsewhere
- Costs: soil degradation, water depletion, nutrient pollution, biodiversity loss, fossil dependence
- Agriculture + land use = ~22% of global GHG emissions
- Alternatives: regenerative agriculture, agroecology, sustainable intensification`,
    },
    {
      code: '5.4',
      title: 'Impacts of agricultural practices',
      content:
`Modern agriculture transforms landscapes and biogeochemical cycles at planetary scale. Most environmental impacts of agriculture are aggregated through specific practices — tillage, monoculture, irrigation, livestock — each with its own dynamics.

**Tillage.** The plowing or stirring of soil before planting. Traditional moldboard plowing inverts soil to bury weeds and incorporate residues; chisel plows break up subsoil without inverting; harrows smooth the surface.

Effects: kills weeds and pests; mixes nutrients; aerates compacted soil; buries crop residue. Negatives: damages soil structure (breaks up aggregates and channels); accelerates organic-matter decomposition (exposes carbon to air and microbes); increases erosion risk (loose soil washes away in rain); compacts subsoil where machinery passes; reduces water infiltration.

The 1930s Dust Bowl in the US Great Plains was partly caused by overly aggressive plowing of marginal land combined with drought. Approximately 80 million tonnes of topsoil were lost.

**No-till farming.** Increasingly common alternative. Seeds planted directly into uncultivated soil. Special equipment (disc openers, coulters) cuts a narrow slot for seed placement. Residue from previous crop remains on the surface. Cover crops between cash crops protect soil year-round. Benefits: less erosion, more soil organic matter, less fuel use, more soil biology. Drawbacks: higher reliance on herbicides for weed control; sometimes lower yields initially; slow adoption (~25% of US cropland in 2020).

**Monoculture.** Growing a single crop species on a large area for one or more growing seasons. Industrial efficiency favors monoculture: easier planting, harvest, mechanization. Costs: higher pest pressure (specialist pests proliferate when their preferred host is everywhere); higher fertilizer needs (no nitrogen cycling from leguminous companion plants); higher pesticide use; biodiversity loss; soil exhaustion over time.

**Crop rotation.** Sequencing different crops over multiple years on the same field. Classic rotation: corn-soybean (the soybean fixes nitrogen, replenishing it for the next year's corn). Three-year rotations (corn-soybean-wheat or corn-soybean-cover crop) maintain soil fertility and disrupt pest cycles. Six-year rotations (older diversified farming) preserve fertility better but reduce specialization.

**Polyculture.** Multiple crops on the same field at the same time. "Three sisters" (maize, beans, squash) is the classic example — Indigenous American agriculture. Modern intercropping experiments are showing yield advantages in some contexts (especially for smallholder farmers in tropical regions).

**Fertilizer use.** Synthetic fertilizer use globally has grown from ~30 Mt nitrogen (1960) to ~115 Mt N (2020). About half of the nitrogen used in agriculture comes from Haber-Bosch ammonia synthesis. Per-hectare application rates vary enormously: developed countries 150-250 kg N/ha; developing countries 50-100 kg N/ha; subsistence agriculture <10 kg N/ha.

Nitrogen runoff is a major water-quality issue. Approximately 50% of applied nitrogen is taken up by crops; the rest is lost to: leaching into groundwater (causing nitrate contamination of wells); runoff into surface waters (causing algal blooms); volatilization as ammonia (NH₃) or nitrous oxide (N₂O — a potent greenhouse gas).

**Pesticide use.** Synthetic pesticides include insecticides (target insects), herbicides (target weeds), fungicides (target fungi), and rodenticides. Approximately 5 million tonnes of pesticide active ingredients are applied globally each year.

Impacts: target pest population decline; non-target species impact (pollinators, beneficial insects, soil organisms); selection pressure driving resistance; chronic and acute toxicity for agricultural workers; residues on food (typically below regulatory limits but with ongoing scientific debate about long-term low-dose effects).

**Irrigation.** ~70% of global freshwater withdrawal is for irrigation. Excessive irrigation in arid regions has multiple consequences:
- Aquifer depletion (Ogallala Aquifer, Central Valley of California, North China Plain, Punjab)
- Salinization (water evaporates, leaving salts in topsoil; productivity declines over decades)
- Waterlogging in poorly-drained soils
- Reduction in river flow downstream (Colorado River dries before reaching the Gulf of California; Indus and Yellow Rivers similarly)

**Livestock.** Animal agriculture has enormous environmental footprint:
- Land use: ~30% of Earth's ice-free land surface for grazing and feed crops
- Water use: ~30% of agricultural water
- Methane: 30% of human methane emissions from livestock (enteric fermentation, manure)
- Nutrient pollution: manure runoff
- Deforestation driver: especially Amazon and Cerrado for cattle ranching and feed (soy)

Per kg of protein, environmental impacts vary enormously by livestock type. Beef has 10-20× the greenhouse gas footprint of pork or chicken per kg of protein; 100× of legumes.

**CAFOs and concentration.** "Concentrated animal feeding operations" — thousands to millions of animals in confined buildings. High feed efficiency but concentrated waste (lagoons, runoff), antibiotic overuse (driving resistance), disease risk, animal welfare concerns.

**Long-term productivity.** Many regions show declining productivity from cumulative soil degradation, despite continued yield growth. The "yield gap" between actual and potential yield is widening in some areas. Sustaining global food production over the 21st century requires reducing environmental damage while maintaining or growing output — sustainable intensification.

**Key facts:**
- Tillage degrades soil; no-till preserves
- Monocultures pest-vulnerable; rotations and polycultures more resilient
- Synthetic N use grew 4× since 1960; ~50% lost as runoff/leaching
- Irrigation: 70% of global freshwater withdrawal
- Livestock: 30% of ice-free land; major methane source
- Beef GHG footprint 10-20× chicken per kg protein; 100× legumes
- Agriculture + land use ~22% of global GHG emissions`,
    },
    {
      code: '5.5',
      title: 'Irrigation methods',
      content:
`Irrigation provides controlled water supply to crops, allowing agriculture in arid regions and stabilizing yields in seasonal climates. About 20% of cultivated land is irrigated, but that 20% produces ~40% of global food. The choice of irrigation method has major implications for water efficiency, energy use, and environmental impact.

**Flood (or surface) irrigation.** The oldest and most widely used method globally. Water is released to flow across the field surface by gravity. Variants:
- Furrow: water runs in shallow channels between crop rows
- Border strip: water flows over a wider band
- Basin: water pools in level fields (common in rice paddies)

Efficiency: typically 40-60% — about half the water is lost to runoff (unused water flowing off the field), deep percolation (water sinking below the root zone), and evaporation. Cheap to install (just channels and small dikes) and operate (no pumps needed for gravity-fed systems). Used in much of Asia and parts of the developing world.

**Sprinkler irrigation.** Water sprayed through the air onto crops, like rain. Center-pivot systems (large rotating arms that pivot around a central well, creating circular irrigated patches visible from satellites) are the dominant US system. Hand-moved and solid-set systems are smaller-scale alternatives.

Efficiency: typically 65-80%. Better than flood — less runoff and percolation losses. But evaporation losses are significant (water on the plant surface evaporates before being absorbed). High-pressure sprinklers can also damage delicate crops and create wind drift.

Energy: requires pumping. Center-pivot systems are very energy-intensive (perhaps 3-5 kWh per acre-inch of water).

**Drip irrigation (micro-irrigation).** Water delivered slowly directly to plant roots through a network of small tubes and emitters. Wetted patches around each plant; rest of soil stays dry.

Efficiency: 85-95% — the highest of any irrigation method. Almost no evaporation (water doesn't sit on the surface); no runoff (delivered at root zone); minimal deep percolation.

Other advantages: less weed competition (only crop area is wetted); reduced disease (foliage stays dry); easy fertilizer mixing (fertigation); works on uneven terrain. Drawbacks: expensive to install ($1,000-3,000 per acre); requires filtered, clean water (emitters clog easily); maintenance required.

Widespread in Israel (which developed the technology in the 1960s), California, Spain, Australia, increasingly in India. Total global drip irrigation: ~12 million hectares, growing rapidly.

**Subsurface drip irrigation (SDI).** Drip tubes buried below the soil surface. Even higher efficiency than surface drip. No evaporation; weed seeds at the soil surface don't germinate (no water there). Used for permanent crops (orchards) and increasingly for row crops.

**Subirrigation.** Water table maintained at root depth, supplying water by capillary action. Used in some places with shallow water tables. Limited applicability.

**Center pivot fact-check.** The aerial pattern of crop circles in the western US plains is from center-pivot irrigation systems. Each circle is typically 130 acres (one quarter-section). Visible from satellites; striking in places like Kansas, Nebraska, and Texas.

**Water conservation framing.** As water scarcity increases (drought, population growth, climate change), irrigation efficiency becomes critical. The Israel/California path — switching from flood to drip — can cut water use by 50% while maintaining yields. Estimates suggest 30-50% reductions in irrigation water use globally are technically achievable through efficient methods.

**Aquifer depletion.** Most US irrigation uses groundwater. The Ogallala Aquifer underlying the Great Plains (Texas to Nebraska) has been drawn down ~30% since 1950 from irrigation. Recharge rates are tiny (<1 cm/year on average); current use is fundamentally unsustainable. Some Texas Panhandle counties have already exhausted their economically pumpable water.

The North China Plain aquifer is similarly being mined. Many of India's agricultural regions face groundwater depletion.

**Salinization.** A subtle long-term cost of irrigation. All irrigation water contains some dissolved salts (river water typically 100-500 ppm). When water is applied to a field and evaporates, the salts are left behind. Over decades, salt accumulates in the topsoil. Above a threshold, crops cannot tolerate the saline soil; yields decline; fields are abandoned.

Mesopotamia and the Fertile Crescent have been salinized over thousands of years; once-fertile lands are now wasteland. Modern Pakistan, India, Egypt, and California's Central Valley face the same threat. Drainage systems can flush salt downward; but if drainage water has nowhere to go, the problem moves rather than solving.

**Water rights and politics.** Water-rights frameworks vary: prior appropriation (US West: "first in time, first in right"), riparian rights (US East: based on land adjacency), public ownership with permits (most other countries). Climate change is straining these frameworks as historical supplies decline. The Colorado River Basin is in chronic over-allocation — paper rights exceed actual flow.

**Key facts:**
- Irrigation: 70% of global freshwater withdrawal; 20% of cropland; 40% of food
- Flood efficiency: 40-60%; Sprinkler: 65-80%; Drip: 85-95%
- Center-pivot is dominant in US; visible from satellites
- Israel pioneered modern drip; ~95% of Israeli agriculture is drip-irrigated
- Aquifer depletion: Ogallala dropped 30% since 1950
- Salinization: accumulation of dissolved salts in topsoil; ruins agriculture over decades
- Colorado River is over-allocated; paper rights exceed flow`,
    },
    {
      code: '5.6',
      title: 'Pest control methods',
      content:
`Crop pests reduce yields and quality. Industrial agriculture relies heavily on synthetic pesticides; integrated pest management aims for a more nuanced approach. Understanding the options, their trade-offs, and the evolution of pest resistance is essential.

**The pest problem.** Insects, weeds, fungi, nematodes, rodents, and birds collectively reduce global crop yields by 30-40%. Without pest control, yields would fall dramatically, and food security would be compromised.

**Chemical pesticides.** The dominant approach since the 1940s.

**Insecticides.** Target insect pests. Several chemical classes:
- Organochlorines (DDT, dieldrin, lindane). First-generation synthetic insecticides. Long-lasting, broad-spectrum, lipid-soluble. Banned in most uses since the 1970s due to bioaccumulation, biomagnification, and ecological damage.
- Organophosphates (parathion, malathion, chlorpyrifos). Acetylcholinesterase inhibitors. Effective but acutely toxic; many now restricted.
- Carbamates (carbaryl, methomyl). Similar mode of action; somewhat less persistent than OPs.
- Pyrethroids (permethrin, cypermethrin). Synthetic versions of natural pyrethrins. Lower mammalian toxicity but toxic to bees and fish.
- Neonicotinoids (imidacloprid, clothianidin). Nicotinic acetylcholine receptor agonists. Systemic — plants absorb and distribute throughout their tissue. Effective; controversial for pollinator impacts.
- Bt (Bacillus thuringiensis): bacterial protein toxin specific to certain insect groups. Used as spray or expressed in GM crops.

**Herbicides.** Target weeds.
- Glyphosate (Roundup, 1974). The most widely used herbicide globally. Inhibits an enzyme essential for plant amino acid synthesis (not found in animals). Effective and (under most regulatory conclusions) low toxicity to mammals — though IARC classified it as "probably carcinogenic to humans" in 2015, contested by many regulatory agencies.
- Atrazine. Selective herbicide for corn. Effective against broadleaf weeds; not corn. Banned in EU; widely used in US Corn Belt; persistent in waterways; endocrine disruptor concerns.
- Paraquat. Quick-acting non-selective. Acutely toxic to humans; restricted use.

**Fungicides.** Target plant pathogens. Used heavily in fruit, vegetable, and ornamental crops. Examples: chlorothalonil, mancozeb, copper compounds.

**Pesticide use trends.** Total synthetic pesticide use globally: ~5 million tonnes active ingredients per year. Use grew steadily through the late 20th century; has plateaued in many developed countries; continues to grow in developing countries.

Per-hectare intensity varies enormously: vegetables/fruits (high), row crops (moderate), pasture/forage (low). Pesticide use in fruit/vegetable production can be 10-50× that of grain production.

**Resistance.** Natural selection drives pests to evolve resistance to pesticides. Each generation, susceptible individuals die; resistant individuals survive and reproduce. Over years to decades, the pest population becomes dominated by resistant strains. Then a new pesticide is needed; resistance develops to that one; and so on — the "pesticide treadmill."

Documented resistance: ~600 insect pest species have populations resistant to one or more pesticides; ~500 weed species resistant to herbicides; many plant pathogens resistant to fungicides. Glyphosate-resistant weeds (palmer amaranth, mare's tail, johnsongrass) now common in US croplands.

**Biological control.** Using natural enemies of pests to control them. Three main approaches:

(1) **Conservation.** Protect and encourage existing natural enemies through habitat management — hedgerows, beetle banks, pollinator strips. The most cost-effective and ecologically sound approach.

(2) **Augmentation.** Periodically release laboratory-reared natural enemies. Trichogramma wasps released for moth pests. Whitefly parasitoids in greenhouses.

(3) **Classical biocontrol.** Introduce non-native natural enemies to control non-native pests. Sometimes spectacularly successful (cottony cushion scale controlled by Australian vedalia beetle). Sometimes spectacular failures (cane toads introduced to Australia in 1935 to control cane beetles; toads now invasive across half the continent and poisoning native predators).

**Genetic pest control.** Crops engineered for pest resistance.

**Bt crops.** Plants expressing Bacillus thuringiensis toxins (Cry proteins). Bt-corn, Bt-cotton, Bt-soybean. Toxins specific to certain insect groups (Cry1Ab for European corn borer; Cry3Bb1 for corn rootworm). Reduces need for spray insecticides. Pest resistance evolution is the long-term concern; resistance management requires "refuge" areas of non-Bt crop.

**Herbicide-tolerant crops.** Roundup Ready (glyphosate-tolerant) corn, soybean, cotton. Allows broadcast spraying of glyphosate during crop growth. Simplifies weed management; reduces tillage. But has driven weed resistance and increased herbicide use.

**Sterile insect technique.** Release sterilized males of a pest species; they mate with wild females; no offspring. Used successfully for screwworm fly (eradicated from North America by 1966), Mediterranean fruit fly. Limited to species with specific biology.

**Cultural and mechanical methods.** Often the most underappreciated.
- Crop rotation: disrupts pest life cycles.
- Resistant crop varieties: bred for natural pest resistance.
- Sanitation: removing crop residue, alternate hosts, diseased plants.
- Tillage: buries weed seeds.
- Hand weeding, mowing.
- Flame weeding (organic farms).
- Pheromone traps: lure pests to traps.

**Integrated Pest Management (IPM).** Combines all the above. Monitor pest populations. Apply control measures only when populations exceed economic thresholds. Use cultural and biological controls first; chemicals as last resort. Achieves pest control with 50-90% less pesticide than conventional approaches in many crops.

**Pollinator impacts.** Many insecticides are toxic to honeybees and wild pollinators. Neonicotinoids have been particularly implicated in pollinator declines. The EU banned major neonicotinoids for outdoor use in 2018. The US has restricted some uses. Approximately 75% of global crops benefit from pollinators.

**Key facts:**
- Pests reduce global crop yields by 30-40%
- Chemical pesticides: organochlorines (banned), organophosphates, pyrethroids, neonicotinoids
- Glyphosate is the most-used herbicide; classified "probably carcinogenic" by IARC 2015 (contested)
- 600+ insect species resistant to pesticides
- Bt crops express bacterial toxin; reduce spray pesticide use
- Biological control: conservation, augmentation, classical
- IPM combines methods; 50-90% pesticide reduction possible
- Pollinator declines associated with neonicotinoids`,
    },
    {
      code: '5.7',
      title: 'Meat production methods',
      content:
`Meat production is one of the largest contributors to global environmental impact. Beef, pork, chicken, and dairy combined account for ~14% of global GHG emissions (FAO), use ~70% of agricultural land, drive significant water use and deforestation, and account for major nutrient pollution. Understanding production methods and their relative impacts is essential to environmental policy and dietary choices.

**Types of meat production.**

**Confined animal feeding operations (CAFOs).** Industrial-scale concentrated animal facilities. Thousands to millions of animals in confined buildings, fed externally-produced feed (typically corn and soy). Dominant model in US, increasingly globally.

Pros: highest feed efficiency, lowest land area per animal, cheapest meat per kg. Cons: concentrated waste (lagoons can fail catastrophically; manure runoff to waterways); antibiotic overuse (subtherapeutic dosing for growth promotion and disease prevention drives antibiotic resistance); animal welfare concerns; concentrated air pollution affecting nearby communities.

**Pasture-raised / grass-fed.** Animals graze on grassland or pasture. Beef in much of South America, Australia, New Zealand. Lower feed efficiency, higher land area, more meat fat (more saturated, also more omega-3 in beef), often considered more ethical. Cows on pasture emit more methane per kg of beef than feedlot cows (slower growth, longer lifetime). But pasture can sequester carbon in soil if grazing is managed.

**Mixed/extensive.** Combination of pasture and supplemental feed. Common in developed-country smallholders.

**Aquaculture (fish farming).** Discussed separately in 5.16. Major and growing protein source.

**Greenhouse gas footprints per kg of meat or protein** (approximate, FAO/Poore-Nemecek 2018):

| Product | kg CO₂eq per kg of food |
|---|---|
| Beef (beef herd) | 60-100 |
| Beef (dairy herd, secondary product) | 30 |
| Lamb | 24 |
| Pork | 6-12 |
| Chicken | 5-7 |
| Eggs | 4.5 |
| Dairy (cheese) | 13-23 |
| Dairy (milk) | 3.2 |
| Plant proteins (legumes, tofu) | 1-3 |

Beef is by far the most carbon-intensive food. The reasons:
- **Methane.** Cows are ruminants — their digestive system produces methane via methanogens. Each cow emits 80-100 kg CH₄/yr. Methane has GWP-100 of 28.
- **Slow growth.** Cows take 18-30 months to reach slaughter weight (vs ~6 weeks for chickens). All that time they're eating and emitting.
- **Low feed efficiency.** Cows convert ~7 kg of feed into 1 kg of beef (vs ~2 kg feed per 1 kg chicken).
- **Land use.** Beef requires 25× the land of an equivalent protein from legumes.

**Water footprints.**

| Product | Liters water per kg |
|---|---|
| Beef | 15,400 |
| Lamb | 10,400 |
| Pork | 6,000 |
| Chicken | 4,300 |
| Eggs | 3,300 |
| Cheese | 5,000 |
| Wheat | 1,800 |
| Potatoes | 290 |

Animal proteins generally require 3-10× the water of plant proteins. Beef requires the most by far.

**Land use.** Animal agriculture occupies about 80% of agricultural land globally (combination of pasture and feed crops). Livestock provides about 18% of global calories and 37% of global protein. The land-efficiency math is striking: animals are 3-10× less efficient at converting plant calories to human-edible calories than direct plant consumption.

**Deforestation.** Cattle ranching is the single largest driver of Amazon deforestation. About 80% of Amazon deforested area is now cattle pasture. Brazil's beef exports drive deforestation; environmental policies under different administrations have created different rates of clearing. Soy production (much of it for animal feed) is another major driver, both directly and through habitat conversion in cerrado (savanna) and chaco regions.

**Antibiotic use.** Approximately 70% of medically important antibiotics sold in the US are used in livestock — at subtherapeutic doses for growth promotion and disease prevention. This drives selection for antibiotic-resistant bacteria. The FDA restricted some uses in 2017; the EU banned subtherapeutic uses in 2006.

The 2014 WHO report on antimicrobial resistance estimated that resistant infections could cause 10 million deaths per year by 2050 if not addressed.

**Animal welfare.** A major concern with industrial production. Sows in gestation crates; chickens in battery cages; calves in veal crates. EU regulations have phased out some of these; US standards vary by state (California Proposition 12; other state laws).

**Health impacts.** Beyond climate: high meat consumption (especially red and processed meat) is associated with increased cardiovascular disease, type 2 diabetes, colorectal cancer. The 2015 IARC classification: processed meat as Group 1 carcinogen; red meat as Group 2A (probable carcinogen).

**Dietary shifts.** The EAT-Lancet Commission (2019) proposed a "planetary health diet" — reducing red meat consumption to about 14 g/day (about one serving per week), maintaining moderate poultry and fish, and increasing plant proteins. This shift would reduce global agricultural emissions by 30-50% while supporting food security and improving health.

**Alternative proteins.**

**Plant-based meat.** Burgers, sausages, milks made from plant proteins (peas, soy, wheat). Beyond Meat, Impossible Foods, Oatly. Have grown rapidly but plateaued in some markets. GHG and water footprints typically 50-90% lower than animal equivalents.

**Cultivated meat.** Real animal muscle and fat grown from cells in bioreactors. Approved for sale in Singapore (2020), US (2023). Currently very expensive; commercialization scaling.

**Insect protein.** Already part of traditional diets in 80+ countries. Cricket flour, mealworm-based foods. Lower environmental footprint than vertebrate meat. Slow adoption in Western markets due to cultural barriers.

**Precision fermentation.** Microbes engineered to produce specific proteins (cow milk proteins, egg proteins). Perfect Day, EVERY Company.

**Key facts:**
- Animal agriculture: ~14% of global GHG emissions
- CAFOs: high efficiency, concentrated waste, antibiotic overuse
- Beef GHG footprint: 60-100 kg CO₂eq/kg vs chicken 5-7, plants 1-3
- Beef water: 15,400 L/kg vs wheat 1,800
- Cattle ranching drives 80% of Amazon deforestation
- 70% of US medically important antibiotics used in livestock
- EAT-Lancet diet: 14 g red meat/day; would reduce ag emissions 30-50%
- Plant-based and cultivated meat are emerging alternatives`,
    },
    {
      code: '5.8',
      title: 'Impacts of overfishing',
      content:
`The world's fisheries face a sustainability crisis. Approximately one-third of global fish stocks are overfished; another 60% are at maximum sustainable yield. Without major changes in management, many commercial fisheries will collapse. Understanding overfishing — its mechanics, its drivers, and its consequences — is essential to ocean conservation.

**Sustainable yield.** A fish population, harvested at the right rate, can produce sustained catches indefinitely. The maximum sustainable yield (MSY) is the largest catch that can be taken year after year without depleting the stock. Catches below MSY allow the population to grow; catches at MSY hold the population steady; catches above MSY shrink the population.

The mathematical model behind MSY (Schaefer 1954): a logistic growth model where the population grows until it approaches carrying capacity. Maximum growth rate occurs at K/2 (half of carrying capacity). MSY is achieved by holding population at this level. If catches exceed MSY, population falls below K/2 and growth rate declines, creating a downward spiral.

Modern fishery science uses more sophisticated stock-recruitment models that account for environmental variability, age structure, and ecosystem effects. But MSY remains the conceptual foundation.

**The Atlantic cod collapse.** The textbook example. Cod fishing on the Grand Banks (off Newfoundland, Canada) was a 500-year-old industry. By the 1960s, factory trawlers from many nations were taking enormous catches. Stocks declined through the 1970s and 1980s. The Canadian government instituted a moratorium in 1992, expecting recovery in a few years. Three decades later, the stock has not fully recovered — possibly because of "regime shifts" in the ecosystem (cod's role taken by other species; predator-prey relationships altered).

The collapse displaced about 35,000 fishers and processing workers. The economic and social cost was enormous. The biological recovery has been incomplete.

**Other major collapses or declines.** Atlantic bluefin tuna (Eastern Atlantic), Pacific bluefin tuna, Mediterranean swordfish, North Sea herring (collapsed in 1970s, recovered with management), Peruvian anchovy (collapse 1972 partly El Niño-related but also overfishing), Patagonian toothfish (Chilean sea bass).

**Drivers of overfishing.**

(1) **Open access and tragedy of the commons.** International waters are essentially open to anyone with a vessel. Each fishing nation, firm, or vessel maximizes its catch; collectively, the catch exceeds sustainable yield.

(2) **Subsidies.** Many countries subsidize their fishing fleets (fuel, vessel construction, port fees). Subsidies allow fleets to fish unprofitable stocks longer than the market would otherwise. WTO has tried to discipline harmful subsidies; partial agreement (June 2022).

(3) **Distant-water fleets.** Industrial vessels from a few countries (China, Japan, Spain, Russia, Korea, Taiwan, US) fish far from home waters. Industrial-scale operations.

(4) **Technological improvement.** Sonar to locate fish; longer-lasting refrigerated holds; bigger and stronger nets. Total fishing effort has continued to grow even as stocks decline.

(5) **Demand growth.** Global fish consumption has grown faster than population growth. Per-capita consumption has tripled since 1960. Income growth in Asia drove much of this.

**Bycatch.** The unintended catch of non-target species. Trawling nets catch everything in their path. Estimated bycatch: 8-25% of total catch globally (40+ million tonnes/year). Sea turtles, marine mammals, seabirds, juvenile fish all caught and often killed. "Ghost fishing" — abandoned or lost nets continuing to catch animals — adds further mortality.

Mitigation: turtle-excluder devices on shrimp trawls; bird-deterring streamers on longliners; circle hooks reducing turtle mortality; ban on bottom trawling in some areas.

**Habitat destruction.** Bottom trawling drags heavy nets across the seafloor, ripping up corals, sponges, and sessile communities. Recovery can take centuries for cold-water coral systems. Approximately one-third of the global continental shelf has been trawled at some point.

**Cascading ecological effects.** Removing predators triggers trophic cascades.
- Removing cod allowed populations of capelin, shrimp, and crab to grow on the Grand Banks.
- Removing sea otters in the Pacific allowed urchin populations to explode and graze kelp forests to nothing ("urchin barrens").
- Removing tuna and large predators allows tiny fish and squid populations to proliferate, changing oceanic food webs.

**Management approaches.**

(1) **Catch limits / quotas.** Total allowable catch set scientifically. Individual fishing rights allocated. Strong management when enforced (Norway, Iceland, US fisheries under the Magnuson-Stevens Act). Enforcement is challenging.

(2) **Individual transferable quotas (ITQs).** Quotas allocated to vessels or fishers that can be bought and sold. Creates incentive for fishing efficiency (you don't need to catch as much as possible — your quota is secured). Successful in New Zealand, Iceland, Alaska. Equity concerns: initial allocation often favored established interests.

(3) **Marine Protected Areas (MPAs).** Areas closed to all fishing or restricted to specific gear. Allows fish populations to recover. The "spillover effect" — fish moving out of MPAs into adjacent areas — supports nearby fisheries. Global MPA coverage has grown from <1% in 2000 to ~8% in 2024. Kunming-Montreal 30 by 30 target.

(4) **Gear restrictions.** Banning destructive gear types (driftnets, bottom trawls in sensitive areas).

(5) **Seasonal closures.** Closing fisheries during spawning seasons.

(6) **Co-management.** Engaging local communities in management decisions. Effective for small-scale fisheries.

**Aquaculture as alternative.** Already provides >50% of seafood consumed globally. Discussed in 5.16. Sustainability varies enormously by species and method.

**Climate change interactions.** Warming oceans, acidification, and oxygen loss are all stressing fish stocks. Some species are shifting poleward (cod and shrimp are moving north). Marine heatwaves cause mass mortality events. Stratification reduces nutrient supply to phytoplankton, weakening food webs. Climate change is making sustainable fisheries management harder even as it makes it more urgent.

**Consumer choices.** The Marine Stewardship Council (MSC) certifies sustainably-caught seafood. The Seafood Watch program (Monterey Bay Aquarium) rates fisheries. Eating lower on the food chain (small forage fish, mussels, oysters) is generally more sustainable than eating apex predators (tuna, swordfish).

**Key facts:**
- ~33% of global fish stocks overfished; ~60% at MSY
- Atlantic cod collapse 1992: 35,000+ jobs lost; stock still not fully recovered
- Bycatch: 8-25% of total catch (40+ Mt/yr)
- Bottom trawling has impacted ~33% of global continental shelf
- Global MPA coverage: 8% in 2024; target 30% by 2030
- Climate change adds new stressors: warming, acidification, deoxygenation
- Aquaculture now provides >50% of seafood`,
    },
    {
      code: '5.9',
      title: 'Impacts of mining',
      content:
`Mining extracts metals, minerals, and fuels from the Earth's crust. It's foundational to industrial civilization and to the energy transition (which requires vast amounts of lithium, cobalt, copper, rare earths). It's also one of the most environmentally damaging human activities, with major impacts on land, water, and air.

**Types of mining.**

**Surface mining.** Reaching ores at or near the surface. Three main subtypes:

(1) **Strip mining.** Removing overlying soil and rock ("overburden") in long strips to expose seam-form deposits. Used for coal in regions with shallow seams (Appalachia, Wyoming Powder River Basin).

(2) **Open-pit mining.** Excavating a large pit; expanding the pit outward and downward as ore is removed. Used for hard rock deposits (gold, copper, iron, diamond). Pits can be over 1 km wide and 1 km deep. Bingham Canyon (Utah, copper) is one of the largest pits.

(3) **Mountaintop removal.** Most controversial form. Mountains are literally leveled — blasted apart, scraped away — to expose coal seams underneath. The overburden is dumped into adjacent valleys ("valley fill"). Has destroyed hundreds of mountains and thousands of stream miles in Appalachia.

Surface mining is cheaper than underground (no shafts, ventilation, water pumping). About 75% of global mining is surface mining.

**Underground mining.** Necessary when ores are too deep for economical surface mining. Tunnel networks (drifts, declines, shafts) reach the ore body. Less landscape disruption than surface mining but worse for worker safety (cave-ins, methane explosions, black lung disease in coal miners). Also generates large quantities of waste rock that must be disposed of.

**Placer mining.** Extracting minerals from stream sediments. Sluice boxes, dredges. Used historically for gold; continues in some regions (Amazon, Indonesia).

**Solution mining (in-situ leaching).** Pumping chemicals (cyanide for gold; sulfuric acid for copper; brine for lithium) into ore-bearing rock; the solution dissolves the target mineral; the laden solution is pumped to the surface and processed. Used for some uranium and copper. Lithium from salt flats uses solution mining.

**Specific impacts.**

**Land destruction.** Surface mining transforms landscapes. Mountaintop removal in Appalachia has flattened hundreds of mountains; rivers have been buried by valley fill; communities have been displaced; entire ecosystems destroyed. The land does not return to pre-mining condition; even "reclaimed" areas have different soil, vegetation, and hydrology.

Open-pit mines create permanent scars. Some are eventually flooded to form lakes (acidic from sulfide oxidation, often unsuitable for life).

**Water pollution.**

**Acid mine drainage (AMD).** When rocks containing sulfide minerals (pyrite, FeS₂) are exposed to air and water, they oxidize to form sulfuric acid plus iron. The acidic water dissolves heavy metals from surrounding rock and flows into streams. Streams become orange-stained and toxic; aquatic life is killed; the contamination can persist for centuries.

The 2015 Animas River spill in Colorado (3 million gallons of toxic water released from the Gold King Mine) is one of many examples. AMD affects thousands of stream miles globally.

**Tailings.** The waste rock and fine slurry from ore processing. Tailings dams are huge engineered structures holding the slurry; they can fail catastrophically. The Brumadinho dam collapse (Brazil, 2019) killed 270 people and contaminated the Paraopeba River. The Mount Polley spill (BC, 2014) released 24 million m³ of tailings.

**Chemical leakage.** Cyanide-based gold processing uses sodium cyanide to dissolve gold. Spills or routine leakage can poison streams and groundwater. The 2000 Baia Mare spill in Romania contaminated the Tisza and Danube rivers.

**Sediment.** Mining stripping vegetation increases erosion. Sediment loads in streams below mines are often 10-100× higher than upstream.

**Air pollution.** Dust (from blasting, hauling, processing) affects nearby communities. Particulate matter, silica dust (lung disease), heavy metals.

Sulfur dioxide from copper, lead, zinc smelting acidifies soil and water downwind.

**Climate impacts.** Coal mining is intrinsically climate-damaging — coal burned for energy releases CO₂. Mining itself uses fossil energy. Methane is released from coal seams during mining. Cement production for concrete requires limestone calcination, releasing CO₂.

**Critical mineral mining and the energy transition.** Renewable energy and battery technology require specific minerals.

**Lithium.** Mostly from salt-flat brines in Chile, Argentina, Bolivia, and hard-rock spodumene in Australia. Lithium brine extraction depletes groundwater and damages high-altitude wetlands.

**Cobalt.** ~70% from Democratic Republic of Congo (DRC). Concerns about artisanal mining conditions, child labor, conflict financing.

**Nickel.** Major expansion in Indonesia for batteries; deforestation and water pollution concerns.

**Rare earths.** Concentrated in China; processing is chemical-intensive and toxic.

**Copper.** Already at scale; needs to roughly double for the energy transition.

The IEA projects these minerals will need to grow 3-9× over the next two decades. The environmental cost of this scaling is significant. Some argue the transition cost is much lower than continued fossil-fuel impacts; some worry the transition is replacing one extractive harm with another.

**Mining and indigenous rights.** Mines disproportionately affect indigenous lands. Many proposed mines (Pebble Mine in Alaska; Standing Rock pipeline; various Amazon projects) have faced indigenous resistance. The ILO Convention 169 and UN Declaration on the Rights of Indigenous Peoples require "free, prior and informed consent" (FPIC) for mining on indigenous lands. Compliance varies enormously.

**Mining waste.** The volume of waste rock produced is typically 10-100× the volume of useful metal. For gold, the ratio can be 1:1,000,000 — extracting a gram of gold requires moving a ton of rock. Mountains of waste are a permanent fixture of mining regions.

**Reclamation.** US Surface Mining Control and Reclamation Act (1977) requires reclamation of surface coal mines. EU and Australia have similar laws. Reclaimed land is not equivalent to pre-mining; soil structure, vegetation, and hydrology differ. Long-term outcomes depend on quality of reclamation work.

**Recycling.** A way to reduce primary mining. Battery recycling, electronic recycling, scrap metal recovery. Currently underdeveloped relative to demand growth, but improving. The "circular economy" framing envisions a future where mined materials are reused indefinitely.

**Key facts:**
- Surface mining (strip, open-pit, mountaintop removal): cheap, environmentally devastating
- Mountaintop removal in Appalachia has flattened hundreds of mountains
- Acid mine drainage: sulfide oxidation produces sulfuric acid; affects thousands of stream miles
- Tailings dam failures: Brumadinho 2019 (270 deaths), Mount Polley 2014
- IEA: lithium ~9×, rare earths ~5-7×, cobalt ~3× demand by 2040
- DRC: ~70% of global cobalt; concerns about labor conditions
- Mining waste: 10-1,000,000× the volume of extracted metal
- Reclamation required but not equivalent to pre-mining ecosystem`,
    },
    {
      code: '5.10',
      title: 'Impacts of urbanization',
      content:
`Approximately 56% of the global population lives in urban areas (2024). The UN projects this to reach 68% by 2050. Urbanization is a major global trend with complex environmental impacts — some negative (heat islands, pollution, habitat loss) and some positive (per-capita emissions often lower than suburban or rural; concentrated infrastructure can be more efficient).

**Urban heat island (UHI).** Cities are warmer than surrounding rural areas, often by 1-5°C on average and 10°C+ on extreme summer nights. Causes:

(1) **Surface materials.** Asphalt, concrete, and dark roofs absorb more solar radiation than vegetation. They release this heat slowly into the evening and night.

(2) **Reduced evapotranspiration.** Trees and grass cool the air through evaporation. Cities have much less vegetation; what cooling exists in suburbs/parks is absent in dense urban cores.

(3) **Reduced wind flow.** Buildings block wind that would otherwise cool air.

(4) **Anthropogenic heat.** Heating, cooling, transportation, industry all release waste heat directly into the city.

The UHI effect is dangerous during heat waves. The 2003 European heat wave killed 70,000+ people; mortality was concentrated in cities. Modern urban planning emphasizes "green infrastructure" — trees, parks, green roofs, light-colored pavement — to mitigate UHI.

**Increased runoff.** Cities have impervious surfaces (roofs, roads, parking lots) instead of natural soil. Rainfall runs off rapidly rather than infiltrating. Consequences:

(1) **Flooding.** Stormwater overwhelms drainage systems during heavy rain. Climate change is intensifying this through more extreme rainfall events. Urban flooding has become a major risk in many cities.

(2) **Pollution transport.** Runoff carries pollutants from city surfaces (oil, brake dust, fertilizer, dog waste, cigarette butts, microplastics) into streams and harbors. The first-flush effect: the initial runoff after dry periods is the most polluted.

(3) **Stream channel erosion.** High flows scour stream channels, eroding banks and depositing sediment downstream.

(4) **Groundwater depletion.** Less infiltration means less aquifer recharge.

Solutions: permeable pavement, green roofs, rain gardens, bioswales, retention ponds, replanting riparian buffers. See 5.13.

**Reduced biodiversity.** Urban areas typically have fewer species than surrounding natural areas, but the species present often have specific traits — generalists, those tolerant of human disturbance and food sources. Examples: raccoons, rats, pigeons, sparrows, deer (in suburban areas).

Habitat fragmentation: green spaces in cities are isolated patches. Some species can move between them (small mammals, songbirds); larger predators and specialists cannot. Wildlife corridors (greenways, parks connected to surrounding habitat) help.

**Air pollution.** Cities have higher concentrations of vehicle emissions, industrial emissions, household combustion (heating, cooking), and dust. Particulate matter, NOx, ozone, CO are all elevated. Most of the WHO's 9 million annual deaths from air pollution are in cities or near urban industrial areas.

Air-quality progress is real in developed countries: London's pea-soup fog of the 1950s ("The Great Smog" killed 12,000) is gone; LA's smog has improved dramatically since the 1970s. But developing-country cities (Delhi, Lahore, Cairo, Jakarta) face severe air quality problems.

**Solid waste.** Urban populations generate enormous waste streams. New York City alone generates ~12,000 tons of trash per day. Waste management challenges: landfill space, transportation costs, methane from decomposing organics, e-waste containing heavy metals and toxic materials.

**Climate impacts of urbanization, both ways.**

**Negative:** Direct urban emissions (heating, cooling, transport). Concrete and asphalt manufacturing emit CO₂. Urbanization often drives deforestation in the surrounding region.

**Positive:** Per-capita emissions are often *lower* in dense urban areas than suburban ones:
- Shorter trips, more walking and transit, less driving per person
- Smaller dwellings consuming less energy
- Multifamily housing more efficient than detached
- Density supports public transit, which is more efficient than cars

A New Yorker has roughly 60% the per-capita CO₂ footprint of an Atlantan, mostly due to density. A resident of Manhattan has ~30% the footprint of an Alaska resident.

So urbanization can be a climate solution if it densifies rather than sprawls — building up rather than out.

**Sprawl.** Low-density suburban development is the opposite of density. Vehicle-dependent; energy-intensive; biodiversity-destructive (converts natural land to lawns and pavement at low density). Many US cities sprawled aggressively from 1950-2000; recent decades have seen partial reversal (gentrification, urban renewal) but most US growth still occurs in suburban edges.

**Urban metabolism.** A framework for understanding cities as systems that consume inputs (energy, food, water, materials) and produce outputs (waste, emissions, products). Tokyo, New York, London, and Shanghai have been studied this way. The framing identifies bottlenecks and inefficiencies.

**Indigenous and historic land use.** Many cities are built on lands that were previously diverse ecosystems (Mexico City was Tenochtitlan, on a lake) and on indigenous lands. Urbanization erases historical land relationships. Indigenous-led restoration projects in some cities reclaim historic ecosystems.

**Sustainable urban development goals.**
- Densify without overcrowding
- Public transit, bike, walking infrastructure
- Green roofs and walls
- Urban forests and parks
- Mixed-use development (live/work/shop in same neighborhood)
- Efficient buildings
- Renewable energy procurement
- Stormwater management as green infrastructure
- Affordable housing (gentrification creates new sprawl pressure)

**Examples of well-designed cities.** Copenhagen, Amsterdam, Tokyo, Singapore are often cited as denser, lower-emission, livable urban environments.

**Megacities.** Cities of 10+ million people. Tokyo (37M metro), Delhi (32M), Shanghai (30M), Mumbai (22M), Mexico City (22M), Sao Paulo (22M), Cairo (22M), Dhaka (22M), Beijing (21M), Lagos (15M). Most growth is in megacities of the developing world.

**Key facts:**
- 56% of global population is urban (2024); 68% by 2050
- Urban heat island: cities 1-5°C warmer than rural; 10°C+ extreme nights
- Impervious surfaces cause runoff problems; green infrastructure mitigates
- Dense city dwellers have ~60-70% lower per-capita carbon footprint than suburbs
- Most growth in megacities of the developing world
- Cars + sprawl = high-carbon urban form; density + transit = low-carbon`,
    },
    {
      code: '5.11',
      title: 'Ecological footprints',
      content:
`The ecological footprint is a quantification of human demand on nature. It measures the biologically productive land and sea area required to provide the resources a population consumes and absorb its wastes. Developed by Wackernagel and Rees in 1992.

**Definition and method.** Footprint accounting categorizes biologically productive land and sea into six types:
- Cropland (food, fiber, biofuel)
- Pasture (livestock)
- Forest (timber, paper, carbon sequestration)
- Built-up land (urban, infrastructure)
- Fishing grounds (marine and inland fisheries)
- Carbon (forest area required to absorb anthropogenic CO₂ emissions)

For each, the global average productivity per hectare is calculated and called a "global hectare" (gha). Demand and capacity are expressed in global hectares.

**The accounting.** For a person, country, or activity:
1. Identify what's consumed (food, materials, energy).
2. Calculate land/sea area required to produce these.
3. Add carbon emissions converted to forest-area equivalent.
4. Sum to get total ecological footprint.

Earth's biocapacity is the total productive area available. Footprint > biocapacity = overshoot.

**Current numbers (Global Footprint Network).**

Global average ecological footprint: ~2.7 gha per person
Global average biocapacity: ~1.6 gha per person

Global overshoot: humanity uses about 1.7× as much as Earth's renewable capacity. This is sustained by drawing down natural capital (forests, fisheries, soils, fossil fuels, atmospheric carbon-absorption capacity).

**National variation.** Ecological footprint per person:
- USA: ~8 gha
- Australia: ~7.3 gha
- Canada: ~6.7 gha
- Germany: ~5.6 gha
- Japan: ~4.6 gha
- UK: ~4.3 gha
- China: ~3.7 gha
- Brazil: ~3.0 gha
- India: ~1.3 gha
- Bangladesh: ~0.8 gha
- Sub-Saharan African averages: 1-2 gha

Earth Overshoot Day: the day each year when humanity's footprint exceeds the planet's annual biocapacity. In 1971: late December (essentially in balance). 2024: July 25. Each year, overshoot day comes earlier.

US Overshoot Day (if everyone consumed like Americans): March 14 — i.e., we'd exhaust Earth's annual capacity by mid-March.

**What drives high footprints.**

Carbon footprint (related to CO₂ emissions for energy) is the largest single component for high-income countries — typically 50-70% of total footprint. Transportation, heating/cooling, electricity all contribute.

Diet: animal products require much more land per calorie than plants. A meat-heavy diet has ~50% larger footprint than a vegetarian diet.

Housing: larger homes use more energy. Detached suburban housing is less efficient than multifamily urban.

Consumption: clothing, electronics, vehicles, manufactured goods — all require resources.

Travel: air travel is particularly footprint-intensive.

**Critiques.** The ecological footprint has been critiqued on several grounds:

(1) **Carbon component dominates.** For most developed countries, the carbon footprint accounts for 60%+ of total — and carbon footprint is essentially CO₂ emissions × conversion factor. So the ecological footprint is largely a CO₂ measure.

(2) **Doesn't capture all impacts.** Water scarcity, biodiversity loss, soil degradation, freshwater pollution, ocean acidification — many environmental harms aren't well-captured by area-based accounting.

(3) **Aggregation problems.** "Global hectares" assume substitutability — a hectare of cropland equals a hectare of fishing grounds. This obscures specific resource constraints.

(4) **Static analysis.** Doesn't capture dynamic ecosystem responses.

Despite critiques, the ecological footprint is a widely-used communications tool because it produces a single intuitive number.

**Related concepts.**

**Carbon footprint** (subset of ecological footprint). Tons of CO₂eq per person per year. US per capita: ~14-16 t/yr; EU: ~6-8 t/yr; India: ~2 t/yr; Bangladesh: <0.5 t/yr. Total US carbon footprint: ~5 Gt CO₂/yr.

**Water footprint** (Hoekstra). Liters of water per unit of consumption. Includes "blue water" (surface and groundwater), "green water" (rainwater), and "grey water" (water polluted in production).

**Material footprint.** Tons of raw materials extracted per year. Includes hidden flows (overburden, tailings, ore).

**Land footprint.** Area of land directly and indirectly required.

**Planetary boundaries.** Rockström et al. (2009, updated 2023). Identifies nine biophysical systems with thresholds below which human activity must operate to maintain "safe" Holocene-like conditions. As of 2023, six of nine boundaries are exceeded:
- Climate change (CO₂, energy imbalance)
- Biosphere integrity (biodiversity, ecosystem function)
- Land-system change
- Freshwater change
- Biogeochemical flows (nitrogen, phosphorus)
- Novel entities (plastics, chemicals, radioactive waste)

The framing complements footprint analysis but emphasizes thresholds rather than aggregate consumption.

**Doughnut Economics** (Raworth 2017). A framework that combines planetary boundaries (outer ring — ecological ceiling) with a "social foundation" (inner ring — basic human needs). The space between is the "safe and just operating space" within which humanity should aim to live.

**How to reduce your footprint.** Effective actions for high-income individuals:
- Reduce or eliminate air travel
- Switch to plant-based diet
- Use renewable electricity
- Drive less / use electric vehicle
- Reduce meat consumption (especially beef)
- Use heat pump for heating/cooling
- Buy less stuff
- Live in smaller home
- Have one less child (controversial; included in some analyses)

For policy: tax carbon, mandate efficiency, build transit, regulate pollutants, support clean energy.

**Key facts:**
- Global ecological footprint: ~2.7 gha/person vs biocapacity ~1.6 gha/person
- Overshoot: 1.7× planet's capacity used
- Earth Overshoot Day: July or August in recent years
- US footprint: ~8 gha vs Bangladesh ~0.8 gha — 10× variation
- Carbon footprint dominates ecological footprint for high-income countries
- Planetary Boundaries: 6 of 9 exceeded as of 2023
- Doughnut Economics: combines ecological ceiling and social foundation`,
    },
    {
      code: '5.12',
      title: 'Introduction to sustainability',
      content:
`Sustainability has become one of the most frequently invoked concepts in environmental policy, business, and politics — and one of the most contested. Understanding its origins, its definitions, and its operationalizations is essential to APES.

**The Brundtland definition.** The most-cited definition comes from the 1987 UN report "Our Common Future" (Brundtland Commission):

"Sustainable development is development that meets the needs of the present without compromising the ability of future generations to meet their own needs."

This formulation has three implicit components: intergenerational equity (don't deplete what future generations need); needs (not wants); and development (some progress, not just preservation).

The Brundtland framing has been criticized as too vague (it doesn't specify what "needs" are, or how to balance competing needs) and too anthropocentric (it doesn't recognize non-human values directly). But its strength is its simplicity — a definition almost anyone can endorse, even if implementations differ wildly.

**Three pillars of sustainability** (often called the "triple bottom line"). Environmental, economic, and social. A sustainable activity meets all three:
- Environmental: doesn't degrade ecosystems or deplete natural resources beyond their renewal rate
- Economic: provides livelihoods and economic value
- Social: distributes benefits equitably; respects human rights

Many projects fail one or more pillars. A clean technology that's too expensive is unsustainable economically. A profitable industry that destroys ecosystems is unsustainable environmentally. A wind farm that displaces an indigenous community is unsustainable socially.

**Weak vs strong sustainability.** A long-running debate in environmental economics.

**Weak sustainability** assumes substitutability between natural capital (forests, fisheries, atmosphere) and manufactured capital (factories, technology, knowledge). As long as total capital is maintained or grown, sustainability is achieved. Loss of one type can be offset by gain in another. Champions: traditional neoclassical economists. Implication: as long as we invest in technology and education, we can "use up" natural resources.

**Strong sustainability** insists that natural capital has irreplaceable functions that can't be substituted by manufactured capital. Some natural systems are "critical" — atmosphere, freshwater, biodiversity — and must be maintained as such. Champions: ecological economists (Daly, Costanza, Røpke). Implication: there are hard limits we cannot trade off.

The mainstream view today is somewhere between, often termed "limited substitutability." Some natural capital is substitutable; some is critical.

**Sustainability indicators.**

**Genuine Progress Indicator (GPI).** Modifies GDP to subtract environmental costs (pollution, resource depletion) and social costs (inequality, crime, family breakdown). GDP keeps rising in most countries; GPI typically plateaus or declines. Used by some US states (Maryland, Vermont) for policy purposes.

**Happy Planet Index** (New Economics Foundation). Multiplies life expectancy × wellbeing, divides by ecological footprint. High-income countries score poorly because of high footprints; countries like Costa Rica score high because they achieve high wellbeing with moderate footprints.

**Human Development Index (HDI).** UN measure: life expectancy × education × income. Doesn't include environmental dimension. Adjusted HDI variants include environmental factors.

**UN Sustainable Development Goals (SDGs).** 17 goals adopted in 2015 with 169 specific targets. Cover health, education, poverty, climate, biodiversity, gender, water, energy, justice. Universal application — all countries committed to all goals. 2030 deadline (originally; many off track).

**The circular economy.** A specific operationalization of sustainability. Aims to:
- Design products for longevity, repairability, and recyclability
- Keep materials in productive use as long as possible
- Recover and regenerate materials at end-of-life
- Eliminate waste and pollution by design

Linear economy: extract → manufacture → use → dispose. Circular economy: extract → manufacture → use → recover → manufacture again. Ellen MacArthur Foundation has been the major advocate.

Examples: aluminum is highly circular (recycled many times, with most aluminum in use today having been recycled). Plastics are less circular (most plastic recycling is downcycling to lower-value products).

**Bioregionalism.** Managing for ecosystem boundaries rather than political ones. Watersheds, biomes, vegetation types as units of governance. Influential in some conservation thinking (Klamath Basin restoration, Yellowstone-to-Yukon corridor).

**Resilience.** The capacity to absorb disturbance and reorganize. Different from sustainability — a resilient system might continue functioning under stress; a sustainable one might not need to. Both are necessary.

**Sustainable yield in resource extraction.**

In forestry: annual growth equals annual harvest. Sustainable forest management requires not exceeding net growth.

In fisheries: catch equals natural production. MSY model (5.8).

In groundwater: extraction equals recharge.

In agriculture: nutrient and water cycles maintained.

Each requires specific monitoring and adjustment.

**Sustainability in practice — the difficulty.** A coal mine cannot be sustainable because coal is nonrenewable. A petroleum refinery cannot be sustainable for the same reason. Most heavy industry as currently practiced is unsustainable.

What can be sustainable: renewable-energy electricity (sun, wind, hydro), sustainable forestry, well-managed fisheries, organic agriculture (if yields suffice), reuse and recycling, much of services and information technology.

The fundamental challenge: the current global economy is largely unsustainable. The transition to sustainability requires restructuring most industrial sectors, with major costs and dislocations.

**Greenwashing.** Misleading marketing claiming environmental benefits without substance. "Natural," "green," "eco-friendly," and similar terms are often used without verification. Regulatory frameworks (FTC Green Guides in US, EU Green Claims Directive) are tightening to require substantiation.

**Indigenous perspectives on sustainability.** Many indigenous cultures have implicit sustainability frameworks. "Seven generations" thinking (Haudenosaunee/Iroquois) considers impacts seven generations into the future. "Living in good relationship" with the more-than-human world (various Indigenous traditions). These frameworks predate Western sustainability discourse by millennia and often contain insights now being rediscovered.

**Key facts:**
- Brundtland 1987: "meet present needs without compromising future generations"
- Triple bottom line: environment, economy, society
- Weak vs strong sustainability debate
- UN SDGs: 17 goals, 169 targets, 2030 deadline
- Circular economy: design for longevity, repair, recycling
- Planetary boundaries: 6 of 9 exceeded as of 2023
- Indigenous frameworks predate Western sustainability discourse`,
    },
    {
      code: '5.13',
      title: 'Methods to reduce urban runoff',
      content:
`Urban runoff is a major source of pollution to streams, rivers, lakes, and coastal waters. Conventional gray infrastructure (pipes, drains, concrete channels) moves water quickly away from cities into surface waters; modern green infrastructure aims to retain water on-site, slow it down, filter it, and infiltrate it into the ground. The shift represents a major redesign of urban hydrology.

**The problem.** When rain falls on natural landscapes, much of it is intercepted by vegetation, infiltrates into soil, or evaporates. Only a small fraction runs off as overland flow. In a forested watershed, perhaps 10-15% of rainfall ends up as direct runoff to streams.

In a city of impervious surfaces (roofs, roads, parking lots), 50-80% of rainfall runs off rapidly. This produces:
- Higher peak flows in receiving streams (flooding)
- More flashy hydrographs (rapid rise and fall)
- Streambank erosion from high flows
- Pollutant transport (oil, brake dust, fertilizer, sediment, microplastics, dog waste, cigarette butts)
- Combined sewer overflows (in older cities with combined storm-sewer systems)
- Reduced groundwater recharge
- Stream temperature elevation (warm runoff from heated surfaces)

**Combined sewer overflows.** Older cities (Chicago, Philadelphia, Boston, etc.) have sewer systems that carry both sewage and stormwater in one pipe. In dry weather, all flow goes to wastewater treatment. In storms, the combined flow exceeds treatment capacity, and the excess (sewage + stormwater) overflows directly to surface waters. Many older cities have hundreds of combined-sewer overflow points; raw sewage releases during storms.

EPA estimates the US needs $271 billion over 20 years to address combined sewer overflows and other water infrastructure deficits.

**Green infrastructure (also called low-impact development).** Techniques that mimic pre-development hydrology by capturing rain where it falls.

**Rain gardens.** Shallow depressions planted with native vegetation that capture runoff from adjacent surfaces (roofs, sidewalks, driveways). Water pools temporarily and infiltrates into the ground. Can capture 30-80% of runoff from connected impervious surfaces.

Sized typically as 5-10% of the contributing impervious area. Plants are native, drought-and-flood tolerant species (sedges, switchgrass, blueflag iris in Eastern US). Soil amendments improve infiltration.

**Bioswales.** Linear vegetated channels that convey and filter runoff. Slow water through vegetation; allow infiltration along the path. Common along highway medians, parking-lot edges, and urban streetscapes.

**Permeable pavement.** Hard surfaces designed to allow water to pass through. Three main types:
- Pervious concrete: voids in the cement allow infiltration
- Pervious asphalt: similar with asphalt binder
- Permeable pavers: blocks with gaps between them

Costs more than conventional pavement and requires maintenance (clogging is a concern in dusty environments). But can replace impervious area while supporting traffic.

**Green roofs.** Vegetated roofs that intercept rainfall, evapotranspire water, and slow runoff. Two main types:
- Extensive: thin (3-6 inches) soil; drought-tolerant plants; lower cost; minimal maintenance
- Intensive: deep (1+ ft) soil; trees and gardens possible; higher cost; like a rooftop park

Captures 50-70% of typical rainfall. Provides building energy benefits (insulation, evaporative cooling), urban biodiversity habitat, recreation/amenity. Costs $10-25 per ft² extensive; $25-50 per ft² intensive.

Major retrofits: Chicago City Hall (popular early example); Vancouver Convention Centre (largest green roof in North America at ~6 acres).

**Cisterns and rain barrels.** Capture roof runoff for later use (irrigation, toilet flushing). Useful in dry-climate cities (Phoenix, San Diego, Tucson) where harvested rain extends municipal water supply. Sized from small residential (50 gallons) to large institutional (10,000+ gallons).

**Trees and urban forestry.** Trees intercept rainfall in their canopies, reduce wind, lower urban temperatures, improve air quality, and increase soil infiltration. Estimated benefit: each mature street tree intercepts 700-3,000 gallons of runoff annually.

Targets: many cities have set canopy cover targets (Atlanta 40%, Seattle 30%, NYC 30%). Programs to plant trees especially in lower-income neighborhoods (canopy equity).

**Constructed wetlands.** Engineered wetlands that treat stormwater. Larger scale than rain gardens; can serve neighborhoods or industrial sites. Plants and soil microbes filter pollutants. Often combined with retention ponds.

**Disconnect downspouts.** A simple intervention. Instead of roof gutters draining directly to storm sewers, redirect them to lawns or rain gardens. Common municipal program in older cities with combined sewers.

**Retention ponds.** Larger basins that hold stormwater, allowing sediment and nutrients to settle out and infiltrate. Common in newer suburban developments. Less effective at filtering dissolved pollutants than green-infrastructure approaches.

**Hybrid systems.** Most cities now combine traditional gray infrastructure (pipes, treatment plants) with green infrastructure. New construction in many jurisdictions requires green stormwater management. Retrofitting existing cities is slower.

**Examples.**

**Philadelphia Green City, Clean Waters.** A $2.5 billion 25-year plan to use green infrastructure to manage stormwater. Half of Philadelphia's impervious area to be drained through green infrastructure by 2036. Major scale.

**NYC Green Infrastructure Plan.** $1.5 billion plan to manage stormwater on 10% of impervious area through green infrastructure.

**Seattle's Roadside Bioretention.** Rain-garden installations along streets, capturing runoff.

**Portland, Oregon.** Pioneer of green-street design with rain gardens, swales, and permeable surfaces.

**Net-zero stormwater.** Goal of some new developments: capture all stormwater on-site, no discharge. Achievable through combinations of the above.

**Climate adaptation framing.** Climate change is intensifying extreme rainfall events. Stormwater systems designed for historical rainfall are now inadequate. Increasing the design rainfall (the storm size systems must handle) is a key climate adaptation strategy. Green infrastructure can be more cost-effective than expanding gray infrastructure for this.

**Maintenance.** Green infrastructure requires maintenance: clearing inlets, removing invasive plants, ensuring infiltration. Maintenance costs are typically lower than gray infrastructure but require sustained municipal capacity.

**Equity.** Distributing green infrastructure to lower-income neighborhoods (which often have less canopy cover and worse drainage) is a priority for environmental justice.

**Key facts:**
- Urban impervious surfaces increase runoff from ~10% (natural) to 50-80%
- Combined sewer overflows are major water-quality issue in older cities
- Green infrastructure: rain gardens, bioswales, permeable pavement, green roofs, cisterns, trees, constructed wetlands
- Philadelphia, NYC, Portland, Seattle leading retrofits
- Trees provide major stormwater + co-benefits (air quality, cooling)
- Climate change intensifies extreme rainfall; gray infrastructure inadequate
- Maintenance and equity are ongoing challenges`,
    },
    {
      code: '5.14',
      title: 'Integrated pest management',
      content:
`Integrated Pest Management (IPM) is a coordinated approach to crop protection that uses biological, cultural, mechanical, and chemical controls in combination. The goal: control pests effectively while minimizing pesticide use, ecological damage, and economic cost. IPM emerged in the 1960s as a response to pesticide resistance, environmental concerns, and rising costs.

**The IPM framework.**

(1) **Identification.** Knowing which pest, at which life stage. Many supposed pests are actually beneficial organisms (predators, pollinators, decomposers) that look similar. Misidentification leads to unnecessary or counterproductive intervention.

(2) **Monitoring.** Regular checking of pest populations. Scouting fields, using pheromone traps, deploying sticky traps, photographic surveys. Pest populations vary spatially and temporally; intervention needs to be triggered by actual problems, not assumptions.

(3) **Economic threshold.** The pest population level at which control is justified. Below threshold, the cost of pest damage is less than the cost of intervention. Above threshold, intervention is economically justified. This avoids prophylactic spraying.

(4) **Multiple controls.** Combining methods (see below).

(5) **Evaluation.** Monitoring results; adjusting approach next season.

**Control methods.**

**Cultural controls.** Practices that prevent or limit pest establishment.
- Crop rotation: rotating between unrelated crops disrupts pest life cycles. A corn-soybean rotation reduces corn rootworm pressure; soybean cyst nematodes need consecutive soybeans to build up.
- Resistant varieties: breeding crops that naturally resist pests. Hessian-fly resistant wheat; corn rootworm-tolerant varieties.
- Planting date: timing crops to avoid peak pest activity.
- Tillage: burying weed seeds, exposing soil-dwelling pests.
- Sanitation: removing crop residue, alternate hosts, diseased plants between seasons.

**Mechanical and physical controls.**
- Cultivation (mechanical weeding)
- Hand weeding
- Row covers (physical barriers against insects)
- Sticky traps and pheromone traps
- Solarization (covering moist soil with clear plastic to heat soil and kill pests/seeds)

**Biological controls.**
- Conservation of natural enemies: providing habitat for predators (hedgerows, beetle banks, flower strips)
- Augmentation: releasing reared natural enemies (Trichogramma wasps for moth pests)
- Classical biocontrol: introducing non-native natural enemies of non-native pests (cottony cushion scale and vedalia beetle in California citrus)

**Chemical controls** (used selectively).
- Reduced-risk pesticides: products with lower environmental impact
- Selective pesticides: those that target specific pests with less impact on non-targets
- Targeted application: spray only when monitoring confirms threshold exceeded
- Spot treatment: treat only problem areas, not whole field
- Timing: spray at most vulnerable pest life stage

**Biopesticides.**
- Bacillus thuringiensis (Bt) sprays for caterpillar pests
- Beauveria bassiana fungus for various insects
- Pheromones for mating disruption
- Plant-derived: neem, pyrethrins (natural form)

**Genetic controls.**
- Resistant crop varieties
- Bt-engineered crops (express insect toxins)
- Sterile insect technique (release sterile males)

**Effectiveness of IPM.** Properly implemented, IPM typically:
- Reduces pesticide use by 50-90% in many crops
- Maintains or improves yield
- Reduces costs (initial implementation cost vs ongoing pesticide savings)
- Reduces environmental impact
- Slows resistance development

**Crops where IPM has been successful.**
- California cotton: pesticide use cut dramatically through IPM (introduction of resistant varieties, pink bollworm sterile-insect technique, beneficial-insect conservation)
- California citrus: cottony cushion scale (controlled by vedalia beetle), red scale (controlled by various parasitoids)
- Apples in some regions: codling moth controlled by mating disruption with synthetic pheromones
- Greenhouse vegetables (Netherlands, Belgium): biological controls dominant
- Florida sugarcane: many pests controlled biologically and culturally

**Crops where IPM is less developed.**
- Soybean: aphids and stink bugs increasingly require sprays
- Corn: many growers use prophylactic seed treatments
- Wheat: pest pressures vary; IPM adoption uneven
- Fruits and vegetables in developing-country smallholders

**Barriers to IPM adoption.**
- Information and training: farmers need to learn monitoring and threshold approach
- Risk aversion: prophylactic spraying feels safer than waiting until threshold reached
- Marketing: pesticide companies promote calendar-based spraying
- Cosmetic standards: consumers expect "perfect" produce, requiring more spraying
- Field size: scouting is harder on very large farms
- Subsidies: in some regions, pesticide subsidies encourage overuse

**IPM in developing countries.** IPM training programs (FAO, NGOs) have had successes in rice (Indonesia, Vietnam), cotton (China, India), and other crops. IPM has reduced pesticide use 30-70% in many of these projects.

**Sustainable Agriculture and IPM connection.** IPM is one component of broader sustainable agriculture frameworks. Regenerative agriculture, organic agriculture, and agroecology all incorporate IPM principles.

**Organic vs IPM.** Organic agriculture prohibits synthetic pesticides entirely. IPM allows them as a last resort. The two overlap substantially: both rely heavily on cultural, mechanical, and biological controls. Most organic farms use IPM principles.

**Key facts:**
- IPM combines biological, cultural, mechanical, and chemical controls
- Five steps: identify, monitor, threshold, intervene, evaluate
- Reduces pesticide use 50-90% in many crops
- Cultural: crop rotation, resistant varieties, timing, sanitation
- Biological: predators, parasites, pathogens
- Mechanical: barriers, traps, cultivation
- Chemical only as last resort, targeted
- Adoption barriers: training, risk aversion, marketing, cosmetic standards`,
    },
    {
      code: '5.15',
      title: 'Sustainable agriculture',
      content:
`Sustainable agriculture aims to produce food, fiber, and fuel while maintaining or improving the natural resource base. It encompasses multiple frameworks (regenerative, agroecology, organic, permaculture) with shared principles: build soil, reduce inputs, support biodiversity, integrate livestock and crops, work with natural systems.

**Core principles.**

(1) **Build soil health.** The foundation of sustainable agriculture. Healthy soil holds water, cycles nutrients, sequesters carbon, hosts diverse microbial communities, resists erosion. Practices: cover cropping, reduced tillage, organic amendments, crop rotation, leguminous nitrogen fixation.

(2) **Minimize external inputs.** Reduce reliance on synthetic fertilizers, pesticides, and irrigation through better management. Match nutrient inputs to crop needs through soil testing; use IPM to reduce pesticides; design irrigation for efficiency.

(3) **Maximize biological diversity.** Crop rotations, polycultures, hedgerows, pollinator habitats. Diverse systems are more pest-resistant, more resilient to weather extremes, support more wildlife.

(4) **Integrate livestock.** Animals and crops have complementary cycles. Manure fertilizes crops; crop residues feed animals; grazing controls weeds and incorporates carbon into soil.

(5) **Local and circular.** Reducing food miles; building local food economies; closing nutrient cycles.

**Specific practices.**

**Cover cropping.** Planting non-cash crops between cash crops to protect soil during fallow periods. Cover crops:
- Reduce erosion (canopy protects soil)
- Add organic matter (decomposing biomass)
- Fix nitrogen (legumes like clover, vetch, peas)
- Suppress weeds (compete for resources)
- Improve soil structure (roots create channels)
- Sequester carbon (biomass below ground)

Common covers: cereal rye (winter cover before corn), crimson clover (legume), tillage radish (deep-rooted, breaks compaction). Some farmers use multi-species "cocktail" covers.

US cover crop acreage: about 22 million acres in 2022 (~7% of cropland), up from ~10 million in 2012.

**Reduced and no-till.** Discussed in 5.4. Preserves soil structure, sequesters carbon, reduces erosion, saves fuel.

**Crop rotation.** Sequence different crops over multiple years. Three-year corn-soybean-cover-crop, or six-year mixed grain-legume-pasture-fallow. Disrupts pest cycles, balances nutrients, builds soil.

**Agroforestry.** Combining trees with crops or livestock. Forms:
- Alley cropping: rows of trees with crops between
- Silvopasture: grazing animals in forested areas
- Riparian buffers: trees along streams
- Forest farming: cultivating crops under forest canopy
- Windbreaks: tree lines protecting crops

Benefits: timber/fruit/nut yield from trees; carbon sequestration; biodiversity; soil protection; microclimate moderation.

**Organic agriculture.** Defined by exclusion: no synthetic fertilizers, pesticides, GMOs. Certified organic standards in US (USDA Organic), EU (EU Organic), and most countries. Costs about 20-30% more than conventional; commands premium prices.

Yields are typically 15-30% lower than conventional (varies by crop and region). Land-area implications: replacing all conventional agriculture with organic would require ~25% more land. The argument: yes, but lower environmental damage per hectare.

Major organic crops: vegetables, fruits, dairy, eggs, some grains. About 1% of US farmland is certified organic; 9% in EU; 1.5% globally.

**Regenerative agriculture.** A newer framework emphasizing soil health restoration. Adoption growing rapidly. Practices: no-till, cover crops, diverse rotations, integrated livestock, minimal synthetic inputs. Goal: sequester carbon, regenerate soils, restore ecosystem function.

Carbon-sequestration claims have been contested — some studies show real soil carbon gains; others suggest gains are modest and not the dramatic numbers sometimes promoted. The 4 per 1000 Initiative (proposed at COP21) suggested 0.4% annual increase in soil carbon globally would offset most emissions; many soil scientists view this as optimistic.

**Agroecology.** A framework that applies ecological principles to agricultural systems. Influential in Latin America, parts of Africa. Emphasizes farmer knowledge, traditional varieties, diversification, food sovereignty. Connected to social-justice movements (La Via Campesina).

**Permaculture.** A design approach combining traditional knowledge with ecological principles. Emphasizes designing landscapes that mimic ecosystems. Influential in homestead and small-farm contexts.

**Precision agriculture.** Using GPS, sensors, satellite imagery, and analytics to apply inputs (water, fertilizer, pesticides) only where and when needed. Reduces inputs while maintaining yields. Adoption growing rapidly with falling costs of sensors and analytics.

**Conservation tillage.** Generic term for reduced-disturbance tillage including no-till, strip-till, ridge-till, mulch-till. Maintains crop residue on the surface.

**Integrated crop-livestock systems.** Combining grazing and cropping on the same land or in regional networks. Increases nutrient cycling, diversifies income, reduces inputs.

**Sustainable intensification.** A framework arguing that we need both: higher yields (to avoid expanding cropland into ecosystems) AND lower environmental impact per hectare. Achieved through improved varieties, precision agriculture, IPM, and other techniques that improve both efficiency and ecological outcomes.

**Yields and sustainability trade-offs.** A perpetual debate. Some research suggests well-managed sustainable systems can match conventional yields; other research suggests trade-offs exist. Context matters — what's sustainable in temperate North America may not work in semi-arid Africa.

**Climate change implications.** Sustainable agriculture is more resilient to weather extremes (drought, heavy rain) than industrial monoculture. Soil with high organic matter holds more water and resists erosion. Diverse systems are less vulnerable to specific weather impacts. These advantages will grow as climate change intensifies.

**Carbon sequestration.** Soils can store substantial carbon — globally, 1,500+ Gt C in soils, 2-3× atmospheric CO₂ inventory. Agricultural soils have lost much of this; restoration could re-sequester some. Estimates of potential vary: from 0.5 to 5 Gt CO₂/year. Not a solution to emissions on its own but a meaningful contribution.

**Subsidies and policy.** Agricultural subsidies in most rich countries (US Farm Bill, EU Common Agricultural Policy) primarily support conventional industrial agriculture. Shifting subsidies to support sustainable practices is a major policy lever — under active debate.

**Key facts:**
- Sustainable agriculture: build soil, minimize inputs, maximize biodiversity, integrate livestock, local circularity
- Cover crops: 22M US acres in 2022, ~7% of cropland
- No-till: ~25% of US cropland
- Organic: 1% of US, 9% of EU, 1.5% global cropland
- Regenerative agriculture: focused on soil-carbon restoration
- Sustainable intensification: high yields + low impact
- Climate change makes sustainable practices more competitive
- Soils could re-sequester 0.5-5 Gt CO₂/year`,
    },
    {
      code: '5.16',
      title: 'Aquaculture',
      content:
`Aquaculture is the farming of aquatic organisms — fish, shellfish, crustaceans, plants. It has grown from a small industry in 1980 to providing over 50% of seafood consumed globally in 2024. As wild fisheries face overfishing limits, aquaculture growth has continued. Sustainability varies enormously by species and method.

**The scale.** Global aquaculture production: ~120 million tonnes per year (2023, FAO). Compare: global wild fisheries production has plateaued at ~90 million tonnes.

Major producers: China (~60% of global), Indonesia, India, Vietnam, Bangladesh, Norway, Chile.

Major species farmed: carps (Asian carp species; ~25 million tonnes globally), tilapia, salmon, shrimp, oysters, mussels, clams, seaweed.

**Categories of aquaculture.**

**Freshwater aquaculture.** Inland ponds, lakes, recirculating systems. Major species: carp, tilapia, catfish, trout. Predominantly in Asia. Pond aquaculture has been practiced for thousands of years in China.

**Marine aquaculture (mariculture).** Coastal and open-ocean operations. Major species: Atlantic salmon (Norway, Chile, Scotland, Canada), shrimp (Asia and Latin America), oysters and mussels (Pacific Northwest, France, China), seaweed (Asia).

**Categorized by intensity.**

**Extensive systems.** Low-density, minimal inputs. Pond aquaculture relying on natural feed; mangrove aquaculture. Limited yield but low impact.

**Intensive systems.** High-density with significant inputs (feed, oxygenation, water exchange). Industrial salmon farming. High yield but more potential impact.

**Recirculating aquaculture systems (RAS).** Closed-loop indoor facilities with high control over conditions. Highest density and most expensive; minimal water exchange or environmental impact. Emerging technology.

**Aquaculture types by species ecology.**

**Filter feeders (mussels, oysters, clams, scallops).** Net positive environmental impact often. The animals filter plankton out of water as they grow; no external feed needed; provide ecosystem services (water clarification, habitat creation). Considered the most sustainable aquaculture.

**Herbivores (tilapia, carp).** Eat algae and plants. Lower environmental footprint than carnivores; feed efficiency is reasonable.

**Carnivores (salmon, shrimp, tuna).** Require feed containing fish meal and fish oil. Until recently, salmon farming required ~3 kg of wild-caught fish (for feed) to produce 1 kg of salmon — net protein loss. Industry has improved to ~1.3 kg wild fish per kg salmon through better feed formulations (more plant proteins, more by-product use). But salmon farming still extracts protein from wild ocean ecosystems.

**Sustainability issues by species.**

**Atlantic salmon farming (Chile, Norway, Scotland, Canada).** Major issues:
- Escaped fish breed with wild salmon, degrading wild gene pools
- Sea lice (parasites) from farms infect wild salmon migration paths
- Antibiotic and pesticide use
- Concentrated waste (fish feces, uneaten feed) pollutes nearby waters
- Fish meal from anchovy and forage fish
- Marine bird and mammal interactions (depredation; sometimes culled)

Major reform efforts: certification (Aquaculture Stewardship Council, ASC), closed-containment systems, vaccination programs.

**Shrimp aquaculture (Asia, Latin America).** Major issues:
- Mangrove destruction. Shrimp ponds are often built by clearing mangrove forests — destroying critical nursery habitat for wild fisheries, removing storm protection for coastal communities, releasing buried carbon.
- Pesticide and antibiotic use
- Water pollution
- Disease outbreaks (white spot syndrome, etc.)
- Labor abuses (forced labor in some Southeast Asian shrimp supply chains)

About 35% of global mangrove loss is attributed to shrimp aquaculture.

**Oyster, mussel, clam farming.** Generally sustainable to highly sustainable. Some considerations:
- Some species are non-native (Pacific oyster in many regions); ecological impacts variable
- Climate change threatens shellfish via ocean acidification

**Seaweed.** Possibly the most sustainable form. No feed required; sequesters CO₂; provides habitat; can absorb excess nutrients. Major and growing in Asia. Some applications in fish feed, plant fertilizer, food, biofuels.

**Tilapia (China, Brazil, Indonesia, Egypt).** Generally moderately sustainable. Some operations have problems with overcrowding and disease.

**Catfish (Vietnam Pangasius, US).** Issues vary by region.

**Aquaculture and the energy transition.** Several emerging technologies:

**Cellular aquaculture (cultivated seafood).** Producing fish or shellfish meat from cells in bioreactors. Companies: Wildtype, BlueNalu, Finless Foods. Early commercial. Could in principle eliminate environmental impacts of conventional aquaculture.

**Insect protein for fish feed.** Black soldier fly larvae fed on food waste, then used as fish meal replacement. Reduces wild-fish dependency.

**Algae for fish feed.** Microalgae as omega-3 source replacing fish oil. Reduces wild-fish dependency.

**RAS expansion.** Closed-loop salmon aquaculture on land. Higher capital cost but lower environmental impact and no sea lice problem. Major investments by Atlantic Sapphire, Salmon Evolution, and others.

**Sustainability certifications.**

- **Marine Stewardship Council (MSC):** for wild fisheries
- **Aquaculture Stewardship Council (ASC):** for farmed seafood
- **Best Aquaculture Practices (BAP):** another certification
- **Global Seafood Alliance**

These provide labels for consumers and pressure for industry improvements. Coverage is partial; certification doesn't guarantee all problems are addressed.

**Future of aquaculture.** Most projections show aquaculture providing the majority of growth in seafood production. The IEA-equivalent for aquaculture (the WorldFish Center, FAO) projects 50%+ growth by 2030. The sustainability of this growth depends on:
- Which species (filter feeders and herbivores most sustainable)
- Which methods (RAS, certified systems more sustainable)
- Where (avoiding mangrove conversion; pollutant management)
- Climate impacts (warming, acidification, disease)

**Key facts:**
- Aquaculture provides >50% of global seafood consumed
- 120 million tonnes/yr; China ~60% of global
- Filter feeders (oysters, mussels): most sustainable
- Carnivores (salmon, shrimp): more environmental concerns
- Atlantic salmon farming: escapes, sea lice, antibiotic use, concentrated waste
- Shrimp aquaculture: 35% of global mangrove loss
- Certifications: MSC (wild), ASC and BAP (farmed)
- Emerging: cellular aquaculture, insect protein, algae feed, RAS systems`,
    },
    {
      code: '5.17',
      title: 'Sustainable forestry',
      content:
`Sustainable forestry aims to harvest timber and other forest products while maintaining the ecological, economic, and social functions of forests over the long term. Industrial timber economics has historically favored short-term gains; sustainable forestry emphasizes multi-generational stewardship and ecological integrity.

**Definition variations.**

**Sustained yield.** Annual harvest equals annual growth. The minimum requirement: a forest is sustainably managed if the amount taken doesn't exceed what's added. Simple but doesn't address biodiversity, soil, water, social values.

**Sustainable forest management (SFM).** Broader concept incorporating ecological, economic, and social dimensions. Maintains forest health, diversity, productivity over time. Manages for multiple values: timber, water, biodiversity, recreation, climate, cultural significance.

**Ecological forestry.** Emphasizes mimicking natural disturbance patterns (fire, blowdown) and maintaining structural complexity. Often involves retention of old trees, snags, and downed wood that wildlife uses.

**Forest stewardship.** A traditional view emphasizing long-term land relationships, often integrating indigenous and local knowledge.

**Practices of sustainable forestry.**

(1) **Selective cutting.** Removing individual or small groups of trees while maintaining the surrounding canopy. Slower, more expensive, but preserves forest structure and biodiversity.

(2) **Shelterwood cutting.** A two-stage process: first cut removes lower-quality trees; second cut, 5-15 years later, removes mature trees while leaving regenerating seedlings.

(3) **Variable retention harvest.** Modern approach: 5-30% of trees retained in clusters or scattered patterns. Mimics natural disturbance.

(4) **Diameter limits.** Setting minimum cutting diameter (e.g., trees must be over 50 cm DBH). Allows younger trees to mature; maintains structural diversity.

(5) **Group selection.** Cutting small (0.1-1 ha) groups of trees, creating gaps that mimic natural canopy openings (windthrow, lightning strikes).

(6) **Reduced impact logging (RIL).** Especially in tropical forests. Pre-harvest planning to minimize unnecessary damage; vine cutting before felling; directional felling; trained skid-trail crews. Reduces damage to remaining trees by 30-50% vs conventional logging.

(7) **Riparian buffers.** Leaving forested zones along streams. Protects water quality, fish habitat, stream temperature.

(8) **Snag and downed-wood retention.** Standing dead trees and fallen logs provide habitat for cavity-nesters, insects, fungi.

(9) **Longer rotations.** Allowing trees to grow longer than the economic-optimum harvest age. Trees over 60-80 years old store more carbon, provide more habitat, and have higher wood quality.

(10) **Conservation set-asides.** Leaving portions of forest entirely unharvested. Provides reference areas, biodiversity refugia.

**Plantation vs natural forest.** Two very different management contexts.

**Plantations.** Single or few species, even-aged, intensively managed for timber. High productivity (5-10× natural forest). Low biodiversity. Common species: Douglas-fir (Pacific Northwest), loblolly pine (US South), eucalyptus (subtropics), spruce (Northern Europe). Plantations on previously-cropped or degraded land can be environmentally positive; replacing natural forest with plantations is a major source of biodiversity loss.

**Natural and semi-natural forests.** Multi-species, multi-aged, often with structural diversity. Lower per-hectare timber yield but supports higher biodiversity, water quality, ecological function.

**Forest certification.**

**Forest Stewardship Council (FSC).** Founded 1993. The gold-standard certification. 10 principles covering ecology, indigenous rights, community relations, worker welfare, ecosystem function. Certified ~240 million hectares globally (2024).

**Sustainable Forestry Initiative (SFI).** Industry-aligned certification, common in US and Canada. Less stringent than FSC on some metrics; covers ~150 million hectares.

**Programme for the Endorsement of Forest Certification (PEFC).** European umbrella system. Covers ~350 million hectares globally; varies in stringency by country.

**National certifications.** Many countries have their own (Canadian CSA, US Tree Farm System).

Coverage: about 11% of global forests are certified. Tropical forests are particularly under-certified.

**Tropical forest issues.** Different challenges from temperate forestry. Most tropical timber comes from selective logging in primary forest, which can be reasonably sustainable IF done carefully. But:
- Forest fragmentation from logging roads enables further deforestation by farmers
- Reduced impact logging (RIL) techniques add cost; not always used
- Corruption and illegal logging widespread
- Indigenous rights often inadequately recognized
- Primary forest, once logged, cannot fully recover ecological complexity

REDD+ (Reducing Emissions from Deforestation and forest Degradation) is a UN program providing financial incentives to tropical countries that reduce deforestation. Modest results so far.

**Old-growth forests.** Forests that have developed over long periods without significant disturbance. Pacific Northwest Douglas-fir forests, Eastern hemlock-hardwood forests, primary tropical rainforests, Amazonian terra firme forest. Particularly valuable for biodiversity (specialist species), carbon storage, and ecosystem services. Less than 10% of original old-growth remains globally. Loss is essentially irreversible on human timescales — recovery takes centuries.

**Climate change implications.** Forest health is declining in many regions from climate change:
- Drought stress and tree mortality (Western US conifer die-off)
- Insect outbreaks (mountain pine beetle in Western North America; emerald ash borer)
- Increased wildfire (Western US, Mediterranean, Russia)
- Wind disturbance (Hurricane Maria in Caribbean forests)
- Shifting ranges of forest species

Sustainable forest management increasingly must adapt to climate change — selecting species that will thrive in future conditions, reducing fire fuel loads, protecting refugia.

**Carbon storage and forestry.** Forests store ~660 Gt C globally — about 80% of terrestrial biosphere carbon. Net flux: forests sequester ~3 Gt C/year globally. Sustainable forestry can maintain or enhance this; deforestation and unsustainable logging reduce it.

The carbon storage of harvested wood:
- Saw timber goes into long-lived products (buildings, furniture) — stored for decades to centuries
- Pulp goes into short-lived products (paper, packaging) — released within years to decades
- Wood waste and beverages — typically burned, released quickly
- Wood fuel — released immediately

Forest products replacing fossil fuels or concrete (in buildings) can be net-positive for climate; replacing standing forests with plantations is net-negative.

**Indigenous-led forestry.** Many indigenous communities have managed forests sustainably for millennia. Modern indigenous-led forestry combines traditional knowledge with contemporary practices. Studies consistently show indigenous-managed forests have lower deforestation rates than state-managed protected areas. The UN Declaration on the Rights of Indigenous Peoples (2007) emphasizes self-determination in resource management.

**Examples of successful sustainable forestry.**
- Menominee Forest (Wisconsin): managed by Menominee Tribe since the 19th century; sustainable yield maintained while increasing standing volume
- Finland and Sweden: extensive certification and management; major timber producers
- New Zealand plantation forestry: managed on long rotations with reforestation
- German "Dauerwald" (continuous-cover forestry): widely practiced
- Brazilian community forestry: forest extraction by traditional communities

**Key facts:**
- Sustained yield = harvest ≤ growth (minimum requirement)
- Practices: selective cutting, shelterwood, variable retention, diameter limits
- Plantation vs natural forest management differ fundamentally
- FSC, SFI, PEFC are major certifications; ~11% of global forests certified
- Old-growth: <10% remaining globally; irreplaceable
- Climate change driving forest mortality from drought, insects, fire
- Forests store ~660 Gt C globally; net sink of ~3 Gt C/year
- Indigenous-managed forests show better deforestation outcomes than state-managed`,
    },
  ],
  keyConcepts: [
    'Tragedy of the commons: unregulated shared resources get over-exploited. Solutions: regulation, privatization, community management (Ostrom).',
    'Green Revolution tripled yields; introduced fertilizer/pesticide/water dependencies and biodiversity loss.',
    'Irrigation efficiency: flood ~40-60%; sprinkler 65-80%; drip 85-95%.',
    'Beef GHG footprint ~60-100 kg CO₂eq/kg; chicken ~5-7; plants 1-3. Cattle ranching drives ~80% of Amazon deforestation.',
    '~33% of global fisheries overfished; ~60% at MSY. Atlantic cod collapse 1992 is the textbook case.',
    'Mining: surface (strip, open-pit, mountaintop removal) cheap but devastating. Critical-mineral demand 3-9× by 2040.',
    'Urban heat island: cities 1-5 °C warmer; impervious surfaces increase runoff from ~10% to 50-80%.',
    'Ecological footprint: global 2.7 gha/person vs biocapacity 1.6 gha/person — 1.7× overshoot.',
    'IPM combines biological, cultural, mechanical, chemical controls; reduces pesticide use 50-90%.',
    'Sustainable forestry: selective cut, variable retention; FSC certifies ~240M ha; old-growth <10% remains.',
  ],
  formulas: [
    {
      name: 'Maximum Sustainable Yield',
      equation: 'MSY = rK/4',
      meaning: 'In a logistic growth model, MSY = (intrinsic growth rate × carrying capacity) / 4. Achieved at population N = K/2.',
      example: 'A fish stock with r = 0.6/yr and K = 10,000 has MSY = 0.6 × 10,000 / 4 = 1,500 fish/yr.',
    },
    {
      name: 'Ecological footprint',
      equation: 'EF = Σ (consumption_i / yield_i) per resource type',
      meaning: 'Sum of land/sea area needed to provide each consumption category. Includes "carbon footprint" as forest equivalent.',
      example: 'US per-capita EF ≈ 8 gha vs biocapacity ~1.6 gha — 5× over.',
    },
    {
      name: 'GHG footprint of food',
      equation: 'kg CO₂eq = (kg food) × (emissions factor)',
      meaning: 'Multiply food consumption by its carbon intensity.',
      example: 'Switching one meal of beef (200 g) to chicken: 200 g × (99.5 - 9.9) g CO₂/g = 17.9 kg CO₂eq avoided per meal.',
    },
  ],
  practice: [
    {
      q: 'A village shares 100 acres of pasture among 50 farmers. Each adds one more cow per year. After 10 years, what predictable outcome?',
      a: 'Overgrazing. Each farmer gains full benefit of the additional cow but pays only 1/50 of the cost (degraded pasture). Classic tragedy of the commons.',
    },
    {
      q: 'Switching from beef to chicken for one meal per week saves how much CO₂eq compared to a beef equivalent? (Use beef ~80 kg CO₂eq/kg; chicken ~7.)',
      a: '~14.6 kg CO₂eq/week, ~760 kg/yr',
      work: '(80 − 7) kg CO₂eq/kg × 0.2 kg meal = 14.6 kg CO₂eq/week × 52 = 759 kg/yr.',
    },
    {
      q: 'A fish stock has carrying capacity K = 10,000 and intrinsic growth rate r = 0.6/yr. What is MSY?',
      a: '1,500 fish/yr',
      work: 'MSY = rK/4 = 0.6 × 10,000 / 4 = 1,500.',
    },
    {
      q: 'A farmer applies 200 kg N/ha synthetic fertilizer. If crops absorb 50%, what is the fate of the rest?',
      a: '100 kg N/ha lost to runoff (groundwater nitrate, surface eutrophication), volatilization as NH₃, or denitrification to N₂O (potent GHG).',
    },
    {
      q: 'Why is drip irrigation 85-95% efficient while flood is 40-60%?',
      a: 'Drip delivers water slowly directly to roots, with no evaporation from soil surface, no runoff, minimal deep percolation. Flood loses water to evaporation, runoff off the field, and deep percolation past the root zone.',
    },
    {
      q: 'A US per-capita ecological footprint is ~8 gha. Earth biocapacity is ~1.6 gha/person. If everyone lived like Americans, how many Earths would we need?',
      a: '~5 Earths',
      work: '8 gha / 1.6 gha/person = 5.',
    },
  ],
  pitfalls: [
    '"Privatization always solves commons problems" — Ostrom showed community management can also work, sometimes better than markets.',
    '"Organic farming is automatically sustainable" — not necessarily. Lower yield per acre means more land needed; depends on baseline and management.',
    '"All aquaculture is environmentally beneficial" — false. Salmon and shrimp farming have serious impacts; oyster and mussel farming are net positive.',
    '"Eating local always reduces footprint" — sometimes, but transport is often a small fraction of food carbon footprint compared to production (especially meat).',
    '"No-till always saves carbon" — net effect varies; sometimes more herbicide use offsets soil carbon gains.',
    '"Sustainable forestry means no logging" — sustainable forestry includes harvest at or below growth rate, with appropriate practices.',
    '"Free trade is incompatible with sustainability" — trade can be either positive (transfers efficiency, supports specialization) or negative (encourages externalities). Policy matters.',
    '"Indigenous practices are always sustainable" — many were/are; some have failed (Easter Island deforestation, ancient Mesopotamian salinization). Important not to romanticize but to learn from success cases.',
  ],
};
