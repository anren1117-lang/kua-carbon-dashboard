// APES Unit 6 — Energy Resources and Consumption — full teaching content.
// Climate-relevant peak outside Unit 9. Each subunit a complete lesson.


export const APES_UNIT_6 = {
  number: 6,
  title: 'Energy Resources and Consumption',
  weight: '10-15%',
  fit: 'core',
  notes: 'The Energy policy branch (20 policies) maps directly. The Fossils and Minerals map layers; the Permian Basin, Lithium Triangle in the Glossary.',
  weeks: [18, 22],
  subunits: [
    {
      code: '6.1',
      title: 'Renewable and nonrenewable resources',
      content:
`Energy resources are classified as renewable or nonrenewable based on how quickly they replenish relative to human use. The distinction is important for sustainability, climate policy, and resource economics, but the categories are not as clean as they first appear — biomass is technically renewable but only if regrowth keeps pace; uranium is nominally non-renewable but the global supply is large enough for centuries at projected use.

**Renewable resources** are those replenished on human timescales:
- Solar — directly from sunlight; effectively infinite on any human horizon.
- Wind — solar-driven (winds form from differential atmospheric heating).
- Hydro — solar-driven (evaporation lifts water; gravity returns it); infinite as flux but sites finite.
- Geothermal — radioactive decay in Earth's mantle; effectively infinite per site.
- Biomass — solar-driven via photosynthesis; renewable IF harvested at or below regrowth rate.
- Tidal/wave — driven by lunar/solar gravity and wind; infinite as flux.

**Nonrenewable resources** form on geologic timescales (millions of years) but are extracted on human timescales:
- Coal — buried plant material in swamps over 100-300 million years.
- Oil (petroleum) — marine algae and zooplankton buried in seafloor sediments over 100-300 million years.
- Natural gas — formed alongside oil from similar marine sources; sometimes from coal.
- Uranium — naturally occurring element; not formed continuously but mined. Reserves are finite.

**Carbon-neutral vs renewable.** Related but not identical. Carbon-neutral: emits net zero CO₂ over lifecycle. Renewable: replenishes on human timescales. A renewable can be carbon-positive (biomass burned faster than regrown). A nonrenewable can be carbon-neutral (nuclear). The distinction matters for climate policy.

**Why this taxonomy matters.** Knowing whether an energy source is renewable matters for three reasons. (1) Long-term sustainability — civilizations that depend on nonrenewable resources eventually exhaust them. (2) Climate impact — fossil fuels release carbon stored underground for hundreds of millions of years into the atmosphere on a timescale of decades. Renewables don't release fossil carbon. (3) Geopolitical security — renewables are widely distributed; fossils are concentrated.

**Energy units essential for AP problems.** Joule (J): SI unit. Kilowatt-hour (kWh): 3.6 × 10⁶ J = 3.6 MJ. BTU: British thermal unit, ~1,055 J. Barrel of oil equivalent (boe): ~6.1 GJ. Quad: 10¹⁵ BTU; US energy use ~100 Quads/year. Ton of coal equivalent (tce): ~29 GJ.

Power vs energy: Power is the rate of energy transfer (watts = J/s). A 100 W bulb uses 100 J every second. Over 10 hours: 100 × 10 × 3600 = 3.6 MJ = 1 kWh.

**Global energy mix (2023 IEA data).**
- Coal: ~26% of primary energy
- Oil: ~30%
- Natural gas: ~23%
- Nuclear: ~4%
- Hydro: ~7%
- Other renewables (solar, wind, geothermal, modern biomass): ~6%
- Traditional biomass (wood, charcoal): ~4%

Fossil fuels (coal + oil + gas): about 79% of global primary energy in 2023. The fraction is slowly declining as renewables grow, but the absolute amount of fossil energy is still rising as total energy demand grows.

**Key facts:**
- Renewable: solar, wind, hydro, geothermal, biomass (sustainable), tidal/wave
- Nonrenewable: coal, oil, natural gas, uranium
- Carbon-neutral ≠ renewable (nuclear is carbon-neutral but nonrenewable)
- Global energy mix 2023: ~79% fossil, ~7% hydro, ~6% other renewables, ~4% nuclear, ~4% traditional biomass
- US energy use: ~100 Quads/year
- 1 kWh = 3.6 MJ; 1 barrel oil = ~6.1 GJ`,
    },
    {
      code: '6.2',
      title: 'Global energy consumption',
      content:
`Global primary energy consumption was about 620 exajoules (EJ, 10¹⁸ J) in 2023, equivalent to roughly 14.6 billion tonnes of oil equivalent. Understanding where this energy goes and how it varies across countries is foundational to climate policy and development.

**Per-capita variation.** Energy use per person varies enormously: US ~95 GJ/year; EU ~60 GJ; China ~80 GJ; India ~25 GJ; Bangladesh ~10 GJ; Sub-Saharan Africa ~5 GJ. The poorest countries use less than a tenth what the richest do. The variation reflects both wealth and lifestyle. Americans drive more, live in larger homes, and consume more manufactured goods than Europeans, despite similar wealth.

The energy-equity question is central to climate justice. Developing countries argue that historical responsibility for fossil emissions lies with developed countries, and that developing countries should have the same right to industrialize using available fossil fuels. Developed countries argue that the world cannot afford the additional emissions and must help developing countries leapfrog to renewables.

**Sectoral breakdown.** Energy consumption divides among four major sectors:
- **Electricity generation**: ~40% of primary energy. About one-third is converted to electricity (the rest is lost as waste heat). Of the electricity generated, about 60% comes from fossil fuels.
- **Transportation**: ~30% of primary energy. About 95% is petroleum-based (gasoline, diesel, jet fuel). Hardest sector to decarbonize.
- **Industry**: ~20% of primary energy. Steel, cement, chemicals, glass, aluminum, paper. Some uses (steel reduction with coke; petrochemical feedstocks) are particularly hard to decarbonize.
- **Buildings**: ~10% of primary energy in residential + commercial heating/cooling/appliances.

**Fuel mix by sector.** Electricity: coal + gas + nuclear + renewables. Transportation: oil dominant; electricity, biofuels, natural gas, hydrogen emerging. Industry: gas + coal + electricity. Buildings: gas + electricity + heating oil + coal + wood.

**Trends.** Global primary energy use has grown about 2% per year on average over 50 years, decelerating since 2010. Population growth (1% per year), per-capita energy growth (1% per year), partially offset by efficiency gains. The fraction from fossil fuels has been declining slowly — ~87% in 1990 to ~79% in 2023. But the absolute amount of fossil energy is still rising as total demand grows.

Major shift: coal peaked globally around 2014 and has been roughly flat since. Natural gas continues to grow. Oil is approaching peak demand projected around 2030 (per IEA scenarios; oil-producing countries dispute this).

**The energy ladder.** A development-economics concept. As countries develop, their energy mix climbs: (1) Biomass (wood, dung, crop residue, charcoal). (2) Coal. (3) Oil and gas. (4) Electricity. (5) Renewables + nuclear. Countries in transition are at different rungs.

The climate question: can developing countries leapfrog stages — going directly from biomass to renewables without passing through coal? The economic case for solar in sunny developing countries is now strong, but transmission, storage, and grid infrastructure are barriers.

**Energy efficiency.** Same useful output with less energy input. A 100 W incandescent bulb produces 1500 lumens; an LED producing the same light uses 10 W — 10× more efficient. Efficiency is the cheapest "fuel." Lawrence Berkeley National Lab estimates that improving building efficiency in the US could save 30% of building energy use cost-effectively.

**Geopolitical implications.** Energy distribution is uneven and creates international tensions. Russia and Norway dominate European gas markets. Saudi Arabia, Iran, Iraq, UAE control much of global oil capacity (OPEC). China dominates critical-mineral processing (lithium, cobalt, nickel). The US is the largest oil and gas producer (Permian Basin) and largest electricity consumer. The Lithium Triangle (Chile, Argentina, Bolivia) holds ~50% of global lithium reserves. DRC provides ~70% of global cobalt.

The transition to renewables reduces fossil-fuel geopolitical leverage but introduces new dependencies in critical-mineral supply chains.

**Key facts:**
- Global primary energy 2023: ~620 EJ/year, or ~14.6 Gtoe
- Per capita varies 19× from poorest (~10 GJ/yr) to richest (~95 GJ/yr)
- Sectoral split: electricity ~40%, transport ~30%, industry ~20%, buildings ~10%
- Transportation is ~95% oil-fueled
- Coal peaked around 2014; oil peak around 2030 (IEA)
- Efficiency = negawatts = often cheapest climate intervention`,
    },
    {
      code: '6.3',
      title: 'Fuel types and uses',
      content:
`Each energy source has characteristics that determine its main applications. Coal is cheap and energy-dense per unit mass but bulky and dirty; useful for stationary high-temperature applications like steel-making and electricity. Oil is energy-dense per unit volume and liquid at room temperature; ideal for portable applications like vehicles. Natural gas is gaseous and clean-burning; great for heating, electricity, and chemical feedstock.

**Coal.** Black or brown sedimentary rock made of carbon plus some sulfur, nitrogen, ash. Energy density: 24-30 MJ/kg.

Four ranks (in order of increasing carbon content and quality):
- Lignite (~25% carbon, low energy density, dirty)
- Sub-bituminous
- Bituminous (~80% carbon, primary thermal coal)
- Anthracite (~95% carbon, highest energy density, lowest sulfur)

Main uses: electricity generation (~60% of global coal use), steel-making (~25%, as metallurgical coke), cement (~10%).

Largest reserves: US (Wyoming Powder River Basin and Appalachia), Russia, China, Australia, India. China is the largest producer and consumer. US coal use has declined sharply since 2008 as gas displaced it.

Coal has the highest CO₂ emissions per unit of energy of any fossil fuel: ~95 kg CO₂/GJ.

**Oil (petroleum).** Liquid hydrocarbon mixture. Energy density: 42-46 MJ/kg — the highest of any common fossil fuel.

Refining splits crude oil into fractions: gasoline (cars, ~12% of crude), diesel/heating oil (trucks, ships, heating, ~30%), jet fuel/kerosene (~12%), heavy fuel oil (ships, industrial boilers, ~10%), petrochemical feedstock (plastics, fertilizers, pharmaceuticals, ~12%).

Main uses: transportation (~95% of oil use); industry; petrochemicals.

Largest reserves: Saudi Arabia, Venezuela (heavy oil), Canada (oil sands), Iran, Iraq, Russia, US. Saudi Arabia and the US are the two largest producers.

The Permian Basin in West Texas and southeastern New Mexico is the world's most productive single oil field — 2023 production: 5.8 million barrels per day.

CO₂ emissions per unit energy: ~70 kg CO₂/GJ.

**Natural gas.** Primarily methane (CH₄). Energy density (mass): 55 MJ/kg — highest of fossil fuels by mass. Volume: only 0.04 MJ/L (it's a gas). Liquid (LNG, at -162°C) is 25 MJ/L.

Main uses: electricity generation (~35% of US gas use), heating (~30%), industry (~30%), transportation (~5%). Also a chemical feedstock for fertilizer (ammonia via Haber-Bosch process).

Largest reserves: Russia, Iran, Qatar, Turkmenistan, US, Saudi Arabia.

CO₂ emissions per unit energy: ~55 kg CO₂/GJ — lowest of fossil fuels. Plus methane leakage: about 2-4% of extracted gas leaks before combustion (recent satellite measurements suggest higher than 2% IPCC default). CH₄ has GWP-100 of 28, so leakage substantially reduces gas's climate advantage.

**Comparing fuels: CO₂ per kWh of electricity.**
- Coal: ~820-1050 g CO₂
- Oil: ~700-900 g CO₂
- Natural gas: ~400-500 g CO₂
- Nuclear: ~10-30 g CO₂ (lifecycle)
- Solar PV: ~30-60 g CO₂ (lifecycle)
- Wind: ~10-20 g CO₂ (lifecycle)

**Energy density and portable applications.** Why is gasoline so dominant in transportation? Energy density per unit volume.
- Gasoline: 32 MJ/L
- Diesel: 36 MJ/L
- Natural gas (compressed): ~9 MJ/L (at 200 atm)
- Hydrogen (compressed): ~3-5 MJ/L (at 350-700 bar)
- Lithium-ion battery: ~1 MJ/L

A gallon (3.8 L) of gasoline contains 122 MJ. Replacing that with batteries means carrying about 100× more volume. This is why electric cars have heavy batteries, and why long-range trucking, aviation, and shipping are hard to decarbonize with batteries alone.

**Why gas is replacing coal.** Multiple drivers: cheaper at current prices (especially in US after shale revolution); lower CO₂ per kWh (~half of coal); lower local air pollution; faster ramp-up time; smaller capital cost per kW capacity. But gas isn't fully clean: methane leakage and ongoing CO₂ emissions mean gas is a "bridge" not a destination.

**Key facts:**
- Coal: ~95 kg CO₂/GJ. Bulk uses: electricity, steel. Largest producer: China.
- Oil: ~70 kg CO₂/GJ. ~95% used for transportation. Largest producer: US.
- Natural gas: ~55 kg CO₂/GJ. Uses: electricity, heating, industry, chemical feedstock. Largest producer: US.
- Methane leakage 2-4% reduces gas's climate advantage.
- Gasoline 32 MJ/L vs Li-ion battery ~1 MJ/L — why batteries struggle for long-range transport.`,
    },
    {
      code: '6.4',
      title: 'Distribution of natural resources',
      content:
`Energy resources are unevenly distributed across the planet. This unevenness has been central to international politics and economic development for the past 150 years.

**Fossil fuel reserves.**

**Oil reserves** (proved reserves at end of 2023):
- Venezuela: 304 billion barrels (heavy oil, expensive to extract)
- Saudi Arabia: 267 billion barrels
- Iran: 209 billion barrels
- Iraq: 145 billion barrels
- Canada: 168 billion barrels (mostly oil sands)
- UAE: 111 billion barrels
- Russia: 80 billion barrels
- USA: 73 billion barrels (mostly tight oil/shale)

Total global proved reserves: ~1,700 billion barrels. Current consumption: ~36 billion barrels per year. R/P ratio: ~47 years.

**Natural gas reserves** (trillion cubic meters): Russia 37, Iran 32, Qatar 25, Turkmenistan 14, USA 13. R/P ~50 years.

**Coal reserves** (billion tonnes): USA 250, Russia 162, Australia 150, China 143, India 110. R/P ~140 years.

**Concentration risks.** Oil and gas are concentrated in few countries. OPEC (formed 1960) coordinates production among Middle Eastern producers; OPEC+ extends to Russia and others. Coal is more widely distributed but heavily concentrated.

R/P ratios aren't "how many years we have." Technology, demand, and price changes shift recoverable amounts. Peak oil predictions based on R/P have repeatedly missed actual production patterns.

**The "resource curse."** Countries that depend heavily on natural-resource exports often have weaker institutions, slower diversification, more corruption, and more authoritarian governments. Examples: Venezuela's collapse from highest GDP per capita in Latin America; Nigeria's persistent poverty despite massive oil revenues. Counter-examples: Norway carefully invests oil revenues in a sovereign wealth fund ($1.5 trillion as of 2024); Botswana has used diamond revenues for education and infrastructure. The difference is institutional strength when the resource boom hit.

**Critical minerals.** The energy transition introduces new geographic concentrations.

**Lithium.** Used in batteries. "Lithium Triangle" of Chile, Argentina, and Bolivia holds ~50% of identified global resources. Australia is the largest producer. China dominates lithium processing.

**Cobalt.** Democratic Republic of Congo holds ~70% of global production. Concerns about artisanal mining and child labor. Some battery makers (Tesla) have moved toward cobalt-free chemistries (LFP).

**Nickel.** Indonesia, Philippines, Russia, New Caledonia are top producers.

**Copper.** Chile, Peru, China, USA are top producers. The energy transition requires massive copper expansion.

**Rare earth elements (REEs).** Used in wind-turbine magnets, EV motors. China dominates global production (~70%) and processing (~85%).

**Silicon.** For solar PV. Polysilicon production dominated by China (~80% as of 2024).

The IEA Critical Minerals Outlook (2024) projects 2040 demand multiples: lithium ~9×, rare earths ~5-7×, cobalt ~3×, nickel ~3×, copper ~2×.

**Distribution of renewables.** Solar: best in deserts of tropics/subtropics (Sahara, Arabian Peninsula, Australia, southwestern US). Wind: best in midlatitude jet stream regions, polar areas, coastlines. Hydro: requires water flow and elevation drop. Geothermal: best where Earth's heat is shallow. Biomass: anywhere plants grow.

**Implications.** Fossil fuel exporters (Russia, Saudi Arabia, Iran) lose leverage as renewables grow. Critical-mineral producers (DRC, Chile, Indonesia, Australia) gain leverage. China gains industrial leverage through manufacturing dominance. Renewable-rich tropical countries gain potential domestic energy independence — IF they have capital to invest.

**Sub-Saharan Africa case study.** Africa has enormous renewable potential and limited fossil reserves. Most of the continent has high solar insolation. Yet ~600 million Africans lack reliable electricity access (2024). Off-grid solar (Pay-As-You-Go) has been a bright spot. The path forward involves leapfrogging the central-grid-with-fossil-plants model.

**Key facts:**
- Top oil reserves: Venezuela, Saudi Arabia, Iran, Iraq, Canada
- Top gas reserves: Russia, Iran, Qatar
- Top coal reserves: US, Russia, Australia, China, India
- R/P: oil ~47, gas ~50, coal ~140 years
- Lithium Triangle: ~50% of identified lithium
- DRC: ~70% of global cobalt production
- China: ~80% of polysilicon, ~85% of REE processing`,
    },
    {
      code: '6.5',
      title: 'Fossil fuels',
      content:
`Fossil fuels are hydrocarbons formed from buried organic matter over hundreds of millions of years. About 79% of primary energy in 2023.

**Formation.** Coal formed primarily during the Carboniferous Period (359-299 million years ago), in tropical swamps. Plant material accumulated in stagnant waters; sediments buried it; heat and pressure compressed it. Four ranks (increasing carbon): peat → lignite → bituminous → anthracite.

Oil and natural gas formed from marine organisms (algae, plankton, zooplankton) buried in seafloor sediments. Under heat and pressure, the buried organic matter transformed into kerogen, then oil (60-150°C) or gas (150-200°C). The hydrocarbons migrated upward through porous rock until hitting an impermeable layer (cap rock), where they accumulated in reservoirs.

The "source rock" + "reservoir rock" + "cap rock" + "trap geometry" combination required for conventional oil/gas is uncommon. Most petroleum is in giant fields — about 1% of fields hold 70% of known reserves.

**Unconventional oil and gas** stays in the source rock — typically shale. Hydraulic fracturing ("fracking") cracks the rock with high-pressure fluid, releasing trapped hydrocarbons. Permian Basin (US), Bakken (US), Eagle Ford (US), Marcellus (US, gas) are the most productive shale plays. Fracking enabled the US to become the world's largest oil and gas producer.

**Oil sands** (Canada, Venezuela) are deposits of bitumen — heavy, viscous oil mixed with sand. Extraction requires surface mining or in-situ steam injection. Energy-intensive, expensive, high-carbon per barrel.

**Extraction processes.** Coal mining: surface (strip, open-pit, mountaintop removal) vs underground (shaft, drift). Oil drilling: onshore conventional; offshore (platforms in shallow or deep water); tight oil/shale (horizontal drilling + hydraulic fracturing — a single well can extend 3 km with 30+ frac stages).

**Environmental impacts.**

**CO₂ emissions.** Per unit of energy: coal ~95 kg CO₂/GJ; oil ~70; gas ~55. Burning all current proved fossil reserves would release ~3,000 Gt CO₂, pushing CO₂ concentrations far above 600 ppm and warming far above 3°C. This is the "carbon budget" framing.

**Local pollution.** SO₂ and NOx from coal cause acid rain and respiratory disease. Particulate matter (PM₂.₅) kills millions per year. Mercury and other heavy metals bioaccumulate. VOCs and ozone cause photochemical smog. WHO attributes ~7 million premature deaths per year to outdoor air pollution; most from fossil-fuel combustion.

**Land impacts.** Mountaintop removal mining destroys habitat and contaminates waterways. Oil sands mining transforms vast areas of Alberta forest. Pipeline leaks contaminate groundwater (Exxon Valdez, Deepwater Horizon, Kalamazoo River). Fracking can cause induced seismicity in Oklahoma.

**Water impacts.** Fracking requires 3-5 million gallons per well. Oil refining requires water. Coal plants need cooling water. Oil spills devastate marine ecosystems.

**Climate impacts beyond CO₂.** Methane leakage from gas extraction (2-4% or higher per recent satellite data). Black carbon from coal combustion contributes to Arctic warming. Aerosols from coal partially mask CO₂ warming locally.

**The "stranded asset" problem.** Fossil reserves on company balance sheets are valued assuming they can be extracted and sold. If climate policy limits future extraction, those reserves become "stranded." Estimates suggest 60-80% of proved reserves must stay underground to limit warming to 2°C.

**Peak oil and peak demand.** Production hasn't peaked due to supply constraints; it might peak due to demand. IEA's Stated Policies Scenario projects peak oil demand around 2030.

**Decarbonization pathways.** Fossil fuels can be displaced by renewables in electricity; electrification of transport (EVs) and heating (heat pumps); green hydrogen for industrial heat and chemical feedstock; nuclear for baseload electricity; energy efficiency reducing total demand. The "just transition" framework addresses workforce, community, and financial transitions in fossil-fuel-dependent regions.

**Key facts:**
- Coal: tropical swamps; ranks lignite → bituminous → anthracite
- Oil/gas: marine organisms in deep sediments
- Fracking enabled US to become #1 oil and gas producer in 2010s
- CO₂ per GJ: coal 95 > oil 70 > gas 55
- Burning current proved reserves would push CO₂ >600 ppm
- Fossil-fuel air pollution kills ~7 million/year (WHO)
- 60-80% of fossil reserves must stay underground (2°C scenarios)`,
    },
    {
      code: '6.6',
      title: 'Nuclear power',
      content:
`Nuclear power generates electricity by harvesting the energy released when heavy atomic nuclei (uranium-235, plutonium-239) split through fission. About 10% of global electricity comes from nuclear, but its role is contested — uniquely powerful for decarbonization, but expensive, slow to build, and politically charged.

**The fission reaction.** A neutron strikes a uranium-235 nucleus, which absorbs it, becoming unstable uranium-236, which immediately splits into two smaller "fission product" nuclei plus 2-3 free neutrons and a burst of energy (~200 MeV per fission, ~3.2 × 10⁻¹¹ J — about a million times more per atom than a chemical reaction).

Chain reaction: each fission releases neutrons that can trigger further fissions. The neutron multiplication factor k: if k > 1, super-critical (exponential growth — bomb behavior); if k = 1, critical (steady-state — reactor); if k < 1, sub-critical (dies out). Control rods absorb excess neutrons to keep k = 1 precisely.

**Reactor types.**

**Pressurized Water Reactor (PWR)** is the most common type (~65% of operating reactors). Fuel: uranium oxide (~3-5% enriched U-235). Water acts as both coolant and moderator. Heat from fission boils water in a secondary loop; steam drives a turbine connected to a generator.

**Boiling Water Reactor (BWR)** similar but with water boiling directly in the reactor vessel. Fukushima used BWRs.

**Pressurized Heavy Water Reactor (PHWR/CANDU)** uses heavy water (D₂O) as moderator and coolant. Can use natural (un-enriched) uranium fuel. Used in Canada, India.

**Generation IV designs** (research stage): Small Modular Reactors (SMRs, factory-built, passive safety); Molten Salt Reactors; High-Temperature Gas Reactors; sodium-cooled fast reactors.

**Uranium.** Natural element is mostly U-238 (99.3%) with small fraction U-235 (0.7%). Only U-235 is easily fissile. Enrichment increases U-235 to ~3-5% for light-water reactors. Enrichment technology is dual-use — civilian enrichment can pivot to weapons enrichment, creating proliferation concerns.

**Major accidents.**

**Three Mile Island (1979).** Partial meltdown. No deaths attributed. Major public confidence blow; effectively halted new US construction for 30 years.

**Chernobyl (1986).** Operator error during safety test caused power excursion and explosion in a reactor with no containment dome (RBMK design). 30 immediate deaths; estimated 4,000-93,000 long-term cancer deaths. Exclusion zone (30 km) still uninhabited.

**Fukushima Daiichi (2011).** Earthquake triggered tsunami that disabled backup generators for three BWRs. Loss of cooling caused fuel meltdown. No immediate radiation deaths. About 100,000 people displaced. Germany announced phase-out within 10 years.

**Nuclear waste.** Spent fuel is highly radioactive and remains dangerous for hundreds of thousands of years. A typical 1 GW reactor produces about 20 tonnes of spent fuel per year. Three approaches: reprocessing (chemical separation); direct disposal (deep geologic repository — Finland's Onkalo, planned 2025); on-site storage (dry casks at reactor sites; default in the US since Yucca Mountain was canceled in 2009).

**Costs.** New nuclear is expensive in Western markets. Recent US projects (Vogtle 3-4, completed 2023-2024 after 7+ years delay): about $15 billion per reactor for ~1.1 GW capacity — $13,600 per kW. Solar PV: ~$1,000-1,500/kW.

Asian builders (China, South Korea) build nuclear faster and cheaper. China's typical 1 GW unit costs $3-5B and builds in 5-6 years.

**Climate context.** Nuclear has very low life-cycle CO₂ emissions: ~10-30 g CO₂/kWh, comparable to wind. IPCC and IEA scenarios for staying below 2°C generally require nuclear capacity to grow.

China leads new construction (~20 GW under construction). France is extending operating reactor lifetimes. The US is similarly extending lifetimes. Germany completed phase-out in 2023.

**Small Modular Reactors (SMRs).** 50-300 MW per unit. Built in factories, shipped to site, assembled. Theoretical advantages: lower capital cost, faster build time, passive safety. NuScale received NRC design approval in 2023.

**Fusion.** Combining light nuclei (the Sun's process). The "holy grail" of clean energy. ITER (France) is the largest experimental project; first plasma planned 2025. NIF achieved ignition in December 2022. Commercial fusion power still decades away.

**Why nuclear is controversial.** Public opposition rooted in accident risk, waste disposal uncertainty, proliferation risk, cost overruns. Counter-arguments: per kWh nuclear is among the safest sources by death rate; climate change is the larger existential threat; new designs address many safety concerns.

**Key facts:**
- Fission of U-235 releases ~200 MeV per nucleus
- Light-water reactor fuel: ~3-5% enriched U-235
- Major accidents: TMI (1979), Chernobyl (1986), Fukushima (2011)
- Nuclear ~10% of global electricity; 50% in France; 20% US and China
- New US reactors: ~$13,600/kW vs solar PV ~$1,000-1,500/kW
- Spent fuel: ~20 t/yr per GW reactor
- Life-cycle CO₂: 10-30 g/kWh (very low)`,
    },
    {
      code: '6.7',
      title: 'Energy from biomass',
      content:
`Biomass is plant or animal matter used as energy — burned for heat, converted to biofuels for vehicles, or processed to biogas. It accounts for about 10% of global primary energy, most of it as traditional cooking and heating fuel in developing countries.

**Categories of biomass energy.**

**Traditional biomass.** Wood, charcoal, animal dung, crop residues used for cooking and heating. About 2.4 billion people globally rely on traditional biomass. Inefficient (most heat lost in smoke), polluting (3.2 million premature deaths per year from household air pollution per WHO), labor-intensive (women and children spend hours collecting firewood).

**Modern bioenergy.** Wood pellets for industrial heating and co-firing in coal plants. Biofuels for vehicles. Biogas from anaerobic digestion. Solid recovered fuel from municipal solid waste.

**Liquid biofuels.**

**Ethanol** is made by fermenting sugar or starch with yeast. Corn ethanol dominant in the US (~15 billion gallons/year); sugarcane ethanol dominates Brazil. Mixed into gasoline at 10% (E10) or 85% (E85). Energy density ~70% of gasoline by volume.

The corn-ethanol controversy: net energy balance debates range from "ethanol is a net energy loss" to "ethanol returns ~1.4× fossil input." Climate balance: corn ethanol's CO₂ savings vs gasoline are small (~10-25%) and may be offset by land-use change (corn for fuel displaces corn for food, pushing food production to new cropland, often via deforestation).

Sugarcane ethanol is much more favorable — 80%+ CO₂ savings vs gasoline.

Cellulosic ethanol (from grass, wood, crop residues) has promised but disappointed — making sugar from cellulose is hard and expensive.

**Biodiesel** is made from oilseeds (soybean, palm, canola). Major palm oil expansion in Indonesia and Malaysia has driven deforestation.

**Renewable diesel** (more recent) is chemically identical to petroleum diesel, made via hydrotreating of fats or oils. Drops into existing diesel infrastructure.

**Sustainable aviation fuel (SAF)** is a renewable diesel-like product. Aviation is hard to decarbonize via electrification or hydrogen.

**Biogas.** Methane plus CO₂ produced when organic matter is digested by methanogens in absence of oxygen. Sources: animal manure, sewage treatment plants, landfills, food waste. Burned for electricity, heat, or upgraded to "renewable natural gas" (RNG) and injected into gas pipelines.

Methane that would otherwise leak (from landfills, manure) is captured and converted to useful energy. The captured CH₄ has 28× the warming impact of CO₂ if released; burning it converts to CO₂. Biogas systems often have a strong climate benefit beyond just replacing fossil fuel.

**Biochar.** Charcoal made from biomass via pyrolysis. Half the carbon becomes fuel gas; the other half is stable solid carbon. Spread on soil, biochar can sequester carbon for 100+ years.

**The sustainability question.** Is biomass renewable? It depends.

Truly renewable: crop residues that would otherwise be burned; sustainable forest management with replanting; energy crops on marginal land; waste streams; Brazilian sugarcane with adequate safeguards.

Unsustainable: net deforestation; land-use change (food crops → fuel crops); crop production depleting soil.

The "carbon neutral" claim for biomass is contested. When wood is burned, CO₂ is released. If the forest regrows fully, that CO₂ is recaptured — but only over decades. "Carbon debt" framing: burning wood now creates a debt that takes 30-100 years to repay.

**BECCS.** Bioenergy with Carbon Capture and Storage. Burn biomass for energy (CO₂ released), capture and sequester the CO₂. Result: net-negative emissions. IPCC scenarios for 1.5°C without overshoot rely heavily on BECCS.

**Health impacts of traditional biomass.** Household air pollution kills about 3.2 million people per year (WHO). The smoke contains PM₂.₅ at concentrations 10-100× WHO guideline. Women and children are disproportionately exposed.

**Bioenergy in IEA scenarios.** Modern bioenergy projected to grow from ~10% of primary energy to ~15-20% in net-zero scenarios by 2050. Land-use constraints are severe — replacing all transportation fuel with biofuels would require land area comparable to all current agriculture.

**Key facts:**
- Biomass ~10% of global primary energy
- Traditional biomass: 3.2 million deaths/yr (WHO)
- US corn ethanol: 15B gallons/yr; modest CO₂ savings
- Brazilian sugarcane ethanol: 80%+ CO₂ savings
- Biogas captures methane (28× CO₂ as GHG)
- Wood is "carbon neutral" only if regrowth keeps pace
- BECCS could give negative emissions`,
    },
    {
      code: '6.8',
      title: 'Solar energy',
      content:
`Solar energy is the most abundant renewable resource — the Sun delivers about 174,000 terawatts of power to Earth's surface, more than 10,000× total human energy use. The cost of solar PV has fallen approximately 89% from 2010 to 2024, making it the cheapest new electricity source in most markets.

**Two distinct technologies.**

**Photovoltaic (PV) solar.** Converts sunlight directly to electricity via the photovoltaic effect. Silicon (or other semiconductor) absorbs photons; electrons are excited from valence band to conduction band; an electric field across the cell drives them through an external circuit. Direct current (DC) output is converted to alternating current (AC) by an inverter for grid use.

Crystalline silicon dominates (~95% of installed PV). Monocrystalline (higher efficiency, more expensive) and polycrystalline (lower efficiency, cheaper). Modern panels achieve 20-22% efficiency at the cell level.

Other PV technologies: thin film (cadmium telluride, CIGS); perovskite (high efficiency potential, durability issues); concentrating PV; building-integrated PV.

**Concentrating solar power (CSP).** Uses mirrors to focus sunlight onto a receiver that heats a fluid to high temperatures (~400-600°C). The hot fluid drives a steam turbine, often with thermal storage. CSP has succeeded in a few high-insolation locations (Spain, US Southwest, Morocco, China, UAE).

**The cost crash.**
- Solar PV LCOE 2010: ~$0.40 per kWh
- Solar PV LCOE 2023: ~$0.04 per kWh

90% decline in 13 years. Drivers: manufacturing scale (China dominates); learning curve (each doubling of cumulative production cuts cost ~20% — Swanson's law); module efficiency gains; soft costs.

By 2023, solar PV is the cheapest new electricity in most markets. IEA: "Solar will dominate the future of electricity."

**Capacity factor.** PV systems generate at full capacity only when the sun is overhead.
- US Southwest: 25-30%
- US Midwest, Northeast: 18-22%
- Northern Europe: 11-15%
- Desert solar in Saudi Arabia: 25-30%

A 1 MW PV system in California produces ~2.2 GWh/year. In Germany, about half that.

**The intermittency challenge.** Solar PV produces nothing at night and reduced output on cloudy days. Solutions:
- Battery storage: lithium-ion costs have also fallen ~85% since 2010. 4-hour battery storage shifts mid-day solar to evening peak.
- Pumped hydro: water pumped uphill during solar peak.
- Demand response: shift loads to match solar output.
- Geographic diversification.
- Backup: gas peaker plants or batteries.
- Long-distance transmission (HVDC).

A grid with 50%+ solar share is technically achievable. Grids in California, Australia, Spain approaching this.

**Land use.** A 100 MW solar farm covers ~400-500 acres (~2 km²). For US-scale deployment, solar would need ~0.3-0.5% of US land. Distributed rooftop solar avoids land-use conflicts. Agrivoltaics (combining solar panels with agriculture) is emerging.

**Manufacturing geography.** China dominates solar manufacturing — about 80% of global polysilicon, wafers, cells, and modules. The US, EU, India have pushed to diversify supply chains. The 2022 US Inflation Reduction Act includes manufacturing incentives.

**Solar in developing countries.** Africa has enormous solar potential. "Distributed solar with battery storage" (Pay-As-You-Go solar with mobile-money payments) has been a major success — millions of off-grid households now have basic electricity.

**Floating solar.** Solar panels on water surfaces. Advantages: no land use, cooling improves efficiency, reduces water evaporation.

**Solar fuels.** Green hydrogen via PV-powered electrolysis; synthetic hydrocarbons via PV + CO₂ capture. Essential for hard-to-electrify sectors.

**Key facts:**
- Solar PV LCOE fell 90% from 2010 to 2024 (IRENA)
- Cheapest new electricity in most markets
- Capacity factor 18-30% depending on location
- Crystalline silicon ~95% of installed PV
- Cell efficiency: ~20-22% modern panels
- China dominates manufacturing (~80% globally)
- A 1 MW solar farm covers ~5-10 acres; 100 MW farm ~400-500 acres`,
    },
    {
      code: '6.9',
      title: 'Hydroelectric power',
      content:
`Hydroelectric power harnesses the energy of falling water. It's the oldest renewable electricity source (Niagara Falls 1881), and still the largest globally — providing ~16% of electricity worldwide.

**Basic operation.** Water held behind a dam at higher elevation flows through a controlled penstock to turbines below. The pressure difference drives water through turbine blades; the rotating turbine connects to a generator.

The energy depends on head (height differential), flow rate, and turbine efficiency (modern Francis or Kaplan turbines: 85-90% efficient).

P (power, watts) = ρ × g × Q × h × η
where ρ = water density (1000 kg/m³), g = 9.81 m/s², Q = flow rate (m³/s), h = head (m), η = efficiency.

For 100 m head and 100 m³/s flow at 90% efficiency: P = 1000 × 9.81 × 100 × 100 × 0.9 = 88.3 MW.

**Types of installations.**

**Conventional impoundment dam.** Most common. Examples: Hoover Dam (US, 2.1 GW), Three Gorges Dam (China, 22.5 GW — largest in the world), Itaipu Dam (Brazil-Paraguay, 14 GW), Grand Coulee (US, 6.8 GW), Aswan High Dam (Egypt, 2.1 GW).

**Pumped storage.** Two reservoirs at different elevations. During excess electricity, water is pumped from lower to upper. When electricity is needed, water flows from upper to lower through turbines. Net energy storage with ~75% round-trip efficiency. ~95% of installed utility-scale electricity storage globally.

**Run-of-river.** No large reservoir; the dam diverts a fraction of river flow through turbines. Less environmental impact but variable output.

**Tidal.** Tidal barrages harness twice-daily ocean tides. La Rance (France, 240 MW) and Sihwa Lake (South Korea, 254 MW) are main examples.

**Capacity factor.** Hydroelectric plants typically have capacity factors of 30-50%. Hydro is dispatchable — output can be ramped up or down within minutes.

**Global distribution.**
- China: ~390 GW installed (largest in the world)
- Brazil: ~110 GW
- Canada: ~85 GW
- USA: ~80 GW
- Russia: ~52 GW
- Norway: ~33 GW (95%+ of Norwegian electricity is hydro)

Most accessible large hydro sites in developed countries are already used. Expansion frontier is in Africa (Inga Dam complex in DRC at planned 39 GW), Southeast Asia, parts of Latin America.

**Environmental and social costs.**

**Reservoir flooding.** Three Gorges Dam displaced about 1.3 million people; flooded ancient archaeological sites; destroyed habitat.

**Methane emissions from reservoirs.** When vegetation is flooded, decomposition in anaerobic conditions produces methane. Tropical hydro reservoirs can have GHG footprints comparable to fossil power for the first 20-30 years.

**Fish migration.** Dams block fish migration routes. Salmon populations in the Pacific Northwest collapsed largely because of Columbia and Snake River dams. Some dams have been removed (Elwha Dam in Washington, removed 2011-2014, with subsequent salmon recovery).

**Sediment trapping.** Rivers carry sediment downstream; reservoirs trap it. Sediment-starved downstream rivers experience erosion, beach loss, delta retreat. The Mississippi Delta is sinking partly because of sediment trapping.

**Water rights and downstream flow.** Large hydro can fundamentally alter river ecology. The Mekong River dams affect Cambodia, Vietnam, Thailand, Laos — political tensions.

**Climate change interaction.** Drought reduces reservoir levels and hydro output. The 2022 European heatwave reduced French hydro output significantly. Climate change is expected to increase drought frequency in many hydro regions.

**Dam removal.** Increasingly common as old dams reach end-of-life. The US has removed over 1,500 dams since 1990.

**Key facts:**
- Hydro ~16% of global electricity — largest renewable source
- Three Gorges (China, 22.5 GW) is the largest single facility
- Pumped hydro ~95% of global utility-scale electricity storage
- Capacity factor typically 30-50%; dispatchable
- Norway: 95%+ of electricity from hydro
- Major impacts: displacement, methane from reservoirs, fish-migration blocking, sediment trapping
- Growth slowing in developed countries`,
    },
    {
      code: '6.10',
      title: 'Geothermal energy',
      content:
`Geothermal energy harvests heat from Earth's interior — sustained by radioactive decay of uranium, thorium, and potassium in the mantle, plus residual heat from planetary formation. Geothermal supplies ~0.5% of global electricity and a larger fraction of direct heating in geothermal-rich countries.

**Two main forms.**

**Hydrothermal geothermal** uses natural reservoirs of hot water or steam underground. Three plant types:

(1) **Dry steam plants** use naturally occurring steam (250-350°C). The Geysers in California is the largest and oldest example (~700 MW; peaked at ~2 GW in 1980s before drawdown). Larderello (Italy, since 1913).

(2) **Flash steam plants** are most common globally. They use hot water (180-300°C) that flashes (boils suddenly) when pressure drops.

(3) **Binary cycle plants** are used for cooler reservoirs (120-180°C). Hot water heats a secondary working fluid with lower boiling point.

**Enhanced geothermal systems (EGS).** The frontier. Most of Earth's heat is in dry rock. EGS drills deep into hot dry rock, fractures it, and circulates injected water to extract heat. Could potentially extract heat anywhere — not just volcanic areas.

**Geographic distribution.**
- Iceland: 25% of electricity and 90% of heating from geothermal
- Indonesia: 2 GW operating; potential for 28 GW
- Philippines: ~2 GW operating, ~10% of national electricity
- USA: ~3.7 GW operating (mostly California and Nevada)
- Kenya: ~950 MW operating, ~50% of national electricity (Olkaria field, Great Rift Valley)
- New Zealand: ~1 GW operating, ~17% of electricity
- Italy: ~900 MW

**Capacity factor.** Geothermal is exceptionally reliable: typically 90%+ capacity factors. The heat doesn't fluctuate seasonally or daily. Valuable as baseload, similar to nuclear.

**Direct-use geothermal.** Beyond electricity, geothermal heat is used directly for district heating (Iceland heats most of Reykjavik), greenhouse heating, aquaculture, industrial processes. Direct use is about as large globally as geothermal electricity.

**Ground-source heat pumps.** Different technology — uses Earth's near-surface (5-30 ft depth) constant temperature (~10-15°C) as a thermal reservoir. Heat pumps move heat from ground (warming buildings in winter) or to ground (cooling in summer). Major energy-saving potential in residential heating.

**Environmental impacts.**

**Induced seismicity.** Injection of water into deep rock can trigger small earthquakes. The Pohang (South Korea) earthquake of 2017 was attributed to a geothermal injection well; magnitude 5.5, caused damage.

**Air emissions.** Geothermal fluids often contain hydrogen sulfide (H₂S), CO₂, and trace metals. Modern plants capture H₂S. Lifecycle CO₂ ~5-50 g/kWh.

**Land subsidence.** Withdrawing fluid from underground reservoirs can cause ground above to subside.

**Resource sustainability.** Geothermal fields can be over-exploited. The Geysers declined from ~2 GW peak in 1980s to ~700 MW now due to drawdown.

**Economics.** Geothermal capital costs are high — typical $3,000-7,000 per kW. Operating costs are low. LCOE: $50-100/MWh.

**Potential and growth.** IEA projects geothermal could grow from ~16 GW today to ~150 GW by 2050 in net-zero scenarios. But that requires breakthrough in EGS. Fervo Energy demonstrated a successful EGS pilot in Nevada (2023).

**Key facts:**
- Geothermal provides ~0.5% of global electricity; much larger in volcanic countries (Iceland 25%, Kenya ~50%)
- Three plant types: dry steam, flash steam (most common), binary cycle
- Capacity factor ~90%+ — exceptional baseload
- Risk: induced seismicity (Pohang 2017 magnitude-5.5)
- Lifecycle CO₂: 5-50 g/kWh (very low)`,
    },
    {
      code: '6.11',
      title: 'Hydrogen fuel cell',
      content:
`Hydrogen is the simplest element and the most abundant in the universe. Hydrogen is not an energy source; it is an energy carrier. We don't mine hydrogen from Earth (essentially none exists in molecular H₂ form naturally); we produce it from water or hydrocarbons.

**Why hydrogen matters for climate.**
- Heavy industry (steel, cement, glass, fertilizer) needs high-temperature heat (1000+°C). Hydrogen combustion can deliver these temperatures.
- Long-distance transport (shipping, aviation, long-haul trucking) needs high-energy-density portable fuel. Hydrogen offers 33 kWh/kg vs 0.25 kWh/kg for lithium batteries.
- Energy storage for grid-scale, especially seasonal. Hydrogen can be stored in salt caverns.
- Chemical feedstock. Ammonia (fertilizer), methanol, hydrogen peroxide are all made from hydrogen today.

**How hydrogen is produced.** Distinguished by color codes.

**Grey hydrogen.** Made from natural gas via steam-methane reforming (SMR). Dominant method today (>90% of global H₂). Releases ~9 kg CO₂ per kg H₂. Cheap (~$1-2/kg).

**Blue hydrogen.** Grey hydrogen + carbon capture. ~85-95% capture achievable. Adds about $1/kg. Still uses natural gas.

**Green hydrogen.** Made by electrolysis of water using renewable electricity. Zero direct CO₂. Current cost: $4-8/kg. Projections: $1.50-3/kg by 2030.

**Electrolyzers.** Three main types: alkaline (mature, lowest cost), PEM (newer, more efficient, fast ramp), solid oxide (highest efficiency, high temperature). Electrolyzer costs have fallen 50%+ since 2015.

**Energy efficiency.** Hydrogen loses energy at each conversion:
- Electrolysis: ~70-80% efficient
- Compression: ~10-15% energy loss
- Storage/transport: 1-5% loss per day
- Fuel cells: ~60% efficient

End-to-end "well-to-wheels" efficiency for hydrogen vehicles: ~25-30% (vs ~70% for battery electric). For the same renewable input, a battery EV drives ~3× farther than a hydrogen vehicle. This is why BEVs have won the passenger car market.

But for applications where batteries don't work (aviation, shipping, long-haul trucking, industrial heat), hydrogen wins.

**Hydrogen storage.**
- Compressed gas: at 350-700 bar. Most common. Energy density ~5 MJ/L.
- Liquefied (LH₂): at -253°C. Higher density (~9 MJ/L) but requires 30% of energy to liquefy.
- Metal hydrides: hydrogen absorbed into solid metals.
- Liquid organic hydrogen carriers (LOHC).

**Hydrogen embrittlement.** Hydrogen atoms migrate into metals (especially steel) and weaken them. Pipelines, tanks, valves all require special materials.

**Where hydrogen makes sense.**

**Steel.** Direct reduced iron with hydrogen (DRI-H₂) produces steel with near-zero direct CO₂. HYBRIT (Sweden) commissioned the world's first commercial DRI-H₂ plant in 2023.

**Ammonia/fertilizer.** Green ammonia (green H₂ → ammonia) is the decarbonization route.

**Aviation.** Airbus is developing ZEROe (hydrogen aircraft) for 2030s.

**Shipping.** Ammonia or methanol synthesized from green H₂ as marine fuel.

**Long-haul trucking.** Hydrogen fuel cells competing with batteries.

**Where hydrogen doesn't make sense.** Passenger cars (BEVs ~3× more efficient). Home heating (heat pumps 4× more efficient). Short-distance shipping/trucking.

**Key facts:**
- Hydrogen is an energy carrier, not a source
- Grey H₂: from natural gas; ~9 kg CO₂/kg H₂; ~$1-2/kg
- Blue H₂: grey + carbon capture; ~$2-3/kg
- Green H₂: electrolysis; ~$4-8/kg, target $1.50-3 by 2030
- End-to-end efficiency: H₂ vehicle ~25%, BEV ~70%
- Energy density: 33 kWh/kg but only 5 MJ/L compressed
- Where it works: steel, ammonia, aviation, shipping, long-haul trucking, industrial heat
- Where it doesn't: passenger cars, home heating, short-haul shipping`,
    },
    {
      code: '6.12',
      title: 'Wind energy',
      content:
`Wind energy converts the kinetic energy of moving air into electricity. The wind is solar-driven. Wind has become the second-cheapest source of new electricity and provides about 8% of global electricity.

**How a wind turbine works.** Three blades on a horizontal axis face into the wind. Wind pushes the blades, which rotate around a central shaft. The shaft connects to a gearbox that increases rotational speed (from ~10-20 rpm at the blades to ~1500-1800 rpm at the generator), which drives a generator. The whole assembly sits at the top of a tall tower (80-150 m for large modern turbines).

The mathematics: P = ½ × ρ × A × v³ × Cp
where P = power (W); ρ = air density (~1.225 kg/m³); A = swept area (m²); v = wind speed (m/s); Cp = power coefficient (theoretical max ~0.59 — Betz limit; real turbines ~0.45-0.50).

The cubic dependence on wind speed is critical. Doubling wind speed multiplies power by 8.

A modern 5 MW turbine has a swept area of ~13,000 m² (rotor diameter ~130 m).

**Capacity factors.**
- Onshore continental US: 35-45%
- Offshore North Sea: 45-55%
- Coastal regions: 30-45%
- Less windy inland: 20-30%

Wind blows more at night than during the day in many regions, partly complementary to solar.

**Onshore vs offshore.**

**Onshore wind.** Cheaper to install (~$1,400-1,900/kW), faster to permit. LCOE: $30-60/MWh in good sites. Constraints: visual impact, noise, bird and bat strikes, land-use competition. US Great Plains and Western Europe are major markets.

**Offshore wind.** Cheaper at scale per unit energy because winds are stronger and steadier; but installation is more expensive (~$3,000-5,000/kW). LCOE has fallen from $200+/MWh in 2010 to $60-100/MWh in 2024.

**Floating offshore wind.** A frontier technology. Floating turbines on tethered platforms allow deeper waters — opening huge new resources off the US West Coast, Japan, Mediterranean.

**Wind power costs.**
- Onshore 2010: ~$80/MWh
- Onshore 2023: ~$30-40/MWh (often cheapest source for new electricity)
- Offshore 2010: ~$160/MWh
- Offshore 2023: ~$80-100/MWh

Drivers: larger turbines, better aerodynamics, scale economies.

**Environmental impacts.**

**Bird and bat mortality.** Wind turbines kill some birds and bats. Estimates: 200,000-500,000 bird deaths per year in the US (vs ~1-3 billion from cats, 600+ million from buildings).

**Land use.** Modern wind farms use ~50-100 acres per MW of capacity, but the actual ground footprint of towers is ~1% of land; the rest can be used for farming or other purposes.

**Noise.** Modern turbines emit ~40-50 dB at 300 m distance.

**Material requirements.** Steel (towers), copper (wiring, generator), rare-earth elements (permanent-magnet generators), fiberglass (blades). Recycling of fiberglass blades has been a challenge.

**Wind growth.** Cumulative global capacity: 17 GW (2000) → 198 GW (2010) → 743 GW (2020) → ~1,000+ GW (2024). China leads (~470 GW); US #2 (~150 GW).

**Regional examples.**
- Denmark: 50%+ of national electricity from wind some years
- Iowa: 60%+ of electricity from wind (highest in US)
- Texas: Largest wind market in the US (~40 GW installed)
- UK: Dogger Bank will be the world's largest offshore wind farm at 3.6 GW

**Key facts:**
- P_wind = ½ ρ A v³ × Cp; cubic dependence; Betz limit Cp = 0.59
- LCOE 2023: onshore $30-40/MWh, offshore $80-100/MWh
- Capacity factor: onshore 35-45%, offshore 45-55%
- Modern onshore turbine: 3-5 MW with ~150 m tower
- Wind kills 200,000-500,000 birds/yr in US vs 1-3 billion from cats
- Wind provides ~8% of global electricity (2024)
- Top installed: China, US, Germany`,
    },
    {
      code: '6.13',
      title: 'Energy conservation',
      content:
`Energy conservation — using less energy through efficiency, behavior, and design — is the cheapest "fuel" available. A kilowatt-hour not consumed is one that doesn't need to be generated, transmitted, or backed up. The IEA estimates that energy efficiency could deliver 35-40% of total emissions reductions needed for net zero.

**The negawatt concept.** Coined by Amory Lovins. A unit of energy not used (a "negawatt") is functionally equivalent to a unit generated, often at lower cost. McKinsey's "cost of abatement curve" shows efficiency measures as negative-cost — they save money AND reduce emissions.

**Why isn't all "free" efficiency already deployed?** Markets fail for efficiency:

(1) **Principal-agent problem.** Building owners pay for upgrades; tenants pay utility bills. Solutions: efficiency mandates, green leases.

(2) **Information asymmetry.** Energy labels reduce but don't eliminate.

(3) **Upfront cost.** A heat pump costs $10,000 upfront. Financing solutions help.

(4) **Behavioral inertia.** People keep using what they know. Defaults matter.

(5) **Rebound effect.** When efficiency makes energy services cheaper, people use more. Captures 10-30% of technical savings.

**Major efficiency frontiers.**

**Building heating and cooling.** Largest single energy-use category in cold-climate developed countries.
- **Building insulation.** R-19 (typical 1970s US) vs R-30+ modern construction. Payback typically 5-15 years.
- **Windows.** Single-pane → double-pane → triple-pane with low-e coatings.
- **Heat pumps.** Replace gas furnaces and AC. Modern air-source heat pumps achieve COP (coefficient of performance) of 3-4 — three to four units of heat per unit of electricity. Ground-source even higher.
- **Heat recovery ventilation.**
- **Smart thermostats.** Reduce energy use by 10-15% via automation, scheduling, learning algorithms (Nest, Ecobee).

**Lighting.** LEDs have transformed this sector.
- Incandescent: 5-10 lumens/W
- Compact fluorescent: 50-60 lumens/W
- LEDs: 100-200 lumens/W

US lighting electricity declined from 15% of residential electricity in 2007 to ~5% today.

**Appliances.** ENERGY STAR labeled products typically use 10-30% less energy than standard. New refrigerators are about 3× more efficient than 1980s models.

**Industrial efficiency.** Motor systems (~40% of industrial electricity): variable-frequency drives. Process heating: cogeneration (CHP) captures waste heat. Chemical processes: catalyst improvements, heat integration.

**Transportation efficiency.**
- US CAFE standards have driven fleet-average fuel economy from ~17 mpg (1976) to ~25-30 mpg today.
- Aerodynamics, lightweighting, hybrids, BEVs.

**Industrial process heat.** About 50% of global industrial energy. Low temperature (<150°C): electrify with heat pumps. Medium (150-400°C): electrify or solar thermal. High (400-1000°C): industrial heat pumps or hydrogen. Very high (>1000°C): hydrogen or capture-and-storage.

**Building codes and policy.** Building codes drive efficiency more than any other single policy lever. California Title 24 has progressively tightened. The EU's Energy Performance of Buildings Directive (EPBD) requires near-zero-energy new buildings since 2021.

**Smart cities and infrastructure.** Mass transit reduces per-capita transport energy 50-70% vs car-dependent transit. Walkability and bicycle infrastructure shift trips from cars. District heating and cooling shares thermal infrastructure across buildings.

**Behavioral programs.** Real-time energy displays reduce household energy use 1-3% via social comparison. Time-of-use pricing shifts loads to off-peak. Demand response programs pay customers to reduce use during grid stress.

**The economics of conservation.** McKinsey's 2017 analysis: efficiency improvements yield $230 billion/year in US energy savings at investment cost of $50-130 billion. ROI 1.7-4.6×.

Yet investment lags. Solutions: utility-led efficiency programs (now in most US states), mandates, financial incentives, information disclosure.

**Why conservation matters more as the grid decarbonizes.** Counter-intuitively, as electricity gets cleaner, efficiency matters more, not less. Renewable electricity is variable; reducing demand makes integration easier. Even with clean electricity, generation has lifecycle emissions. Lower demand means less infrastructure to build.

**Key facts:**
- Negawatt (energy not used) often costs less than equivalent megawatt of new generation
- Efficiency could deliver 35-40% of net-zero emissions reductions (IEA)
- Heat pump COP: 3-4 (3-4× more efficient than gas furnace)
- LED bulbs: 100-200 lumens/W vs incandescent 5-10
- US CAFE: 17 mpg (1976) → 25-30 mpg (today)
- Building codes drive most efficiency gains
- Rebound effect: 10-30% of technical savings recaptured`,
    },
  ],
  keyConcepts: [
    'Energy density per fuel: coal ~24-30 MJ/kg, oil ~42-46 MJ/kg, natural gas 55 MJ/kg.',
    'CO₂ per GJ: coal ~95, oil ~70, natural gas ~55. Per kWh electricity: coal ~820-1050 g, gas ~400-500, nuclear ~10-30, wind ~10-20, solar ~30-60.',
    'Solar PV LCOE fell 90% from 2010 to 2024. Now cheapest new electricity in most markets.',
    'Wind P = ½ ρ A v³ Cp; cubic dependence on wind speed; Betz limit Cp = 0.59.',
    'Nuclear: ~10% global electricity. France 50%+. New US reactors ~$13,600/kW vs solar PV ~$1,000-1,500/kW.',
    'Capacity factors: nuclear ~90%, hydro 30-50%, wind onshore 35-45%, solar 18-30%, coal 50-70%.',
    'Hydrogen is an energy carrier, not source. Grey/Blue/Green colors. End-to-end H₂ vehicle ~25% efficient vs BEV ~70%.',
    'Negawatt = energy not used. Efficiency could deliver 35-40% of net-zero emissions reductions per IEA.',
    'Heat pump COP 3-4. LEDs 100-200 lm/W vs incandescent 5-10.',
    'Critical minerals (lithium, cobalt, nickel, copper, REE): supply concentration creates new geopolitics.',
  ],
  formulas: [
    {
      name: 'Wind power equation',
      equation: 'P = ½ × ρ × A × v³ × Cp',
      meaning: 'P = power (W); ρ = air density (~1.225 kg/m³); A = swept area (m²); v = wind speed (m/s); Cp = power coefficient.',
      example: 'A 130 m rotor (A ≈ 13,300 m²) at 12 m/s with Cp = 0.48: P = 0.5 × 1.225 × 13,300 × 12³ × 0.48 ≈ 5.6 MW.',
    },
    {
      name: 'Hydropower equation',
      equation: 'P = ρ × g × Q × h × η',
      meaning: 'ρ = water density (1000 kg/m³); g = 9.81 m/s²; Q = flow rate (m³/s); h = head (m); η = efficiency (~0.85-0.9).',
      example: '100 m head, 100 m³/s, η = 0.9: P = 1000 × 9.81 × 100 × 100 × 0.9 = 88 MW.',
    },
    {
      name: 'CO₂ from electricity generation',
      equation: 'kg CO₂ = (kWh used) × (kg CO₂/kWh of fuel)',
      meaning: 'Multiply energy used by carbon intensity of the source.',
      example: '500 kWh of coal power: 500 × 1.0 = 500 kg CO₂.',
    },
    {
      name: 'LCOE',
      equation: 'LCOE = (Capital + O&M + Fuel) / Lifetime energy output',
      meaning: 'Levelized cost of energy. Lifetime average $/MWh.',
      example: 'Solar PV LCOE 2023: $30-40/MWh. Wind onshore: $30-40/MWh. Gas peaker: $80-120/MWh. New nuclear: $90-150/MWh.',
    },
  ],
  practice: [
    {
      q: 'A US household uses 11,000 kWh/yr of electricity. If grid mix is 30% coal, 40% gas, 20% nuclear, 10% renewable, estimate annual CO₂ emissions.',
      a: '~5,400 kg CO₂/yr',
      work: '(11,000 × 0.30 × 1.0) + (11,000 × 0.40 × 0.45) + (11,000 × 0.20 × 0.02) + (11,000 × 0.10 × 0.04) ≈ 5,400 kg.',
    },
    {
      q: 'A 5 MW wind turbine at 40% capacity factor: how much energy per year?',
      a: '~17,520 MWh/yr',
      work: '5 MW × 24 hr × 365 × 0.40 = 17,520 MWh.',
    },
    {
      q: 'A 1 GW solar farm (25% CF) and a 1 GW nuclear plant (90% CF) have how much annual generation difference?',
      a: '~5.7 TWh/yr more from nuclear',
      work: 'Nuclear: 1 × 8760 × 0.90 = 7.88 TWh. Solar: 1 × 8760 × 0.25 = 2.19 TWh.',
    },
    {
      q: 'Replacing 10 incandescent 60W bulbs with 6W LEDs used 5 hr/day: how much energy saved per year?',
      a: '~985 kWh/yr',
      work: '54 W saved per bulb × 10 × 5 × 365 = 985 kWh.',
    },
    {
      q: 'Why does wind power scale with the cube of wind speed?',
      a: 'Power = (1/2)ρAv³. Mass flow rate is ρAv. Kinetic energy per unit mass is (½)v². Multiplying gives ½ρAv³.',
    },
    {
      q: 'Why is green hydrogen ~3× less efficient end-to-end than battery EVs?',
      a: 'Electricity → electrolysis (70-80%) → compression (10-15% loss) → fuel cell (50-60%) ≈ 25-30% total. BEV: electricity → battery (90%) → motor (90%) ≈ 70-80%.',
    },
  ],
  pitfalls: [
    '"Solar can\'t replace fossils because it\'s intermittent" — partial. Storage + transmission + flexibility integrate high VRE shares.',
    '"Hydrogen is a clean fuel source" — incorrect. Hydrogen is an energy carrier.',
    '"Biomass is automatically carbon-neutral" — only if regrowth keeps pace. Carbon debt 30-100 years possible.',
    '"Nuclear waste is unmanageable" — quantities are small. Technical solutions exist; politics is the bottleneck.',
    '"All renewables are equal" — capacity factors and dispatchability vary enormously.',
    '"Wind kills huge numbers of birds" — kills some but far less than cats, windows, and oil/gas operations.',
    '"Replacing transportation with biofuels is feasible" — not at full scale.',
    '"Nuclear is the same risk as Chernobyl" — modern designs are fundamentally safer (passive safety, containment, light water that slows reaction if overheated).',
  ],
};
