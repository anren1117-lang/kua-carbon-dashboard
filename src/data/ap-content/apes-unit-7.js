// APES Unit 7 — Atmospheric Pollution — full teaching content.
// 8 subunits.


export const APES_UNIT_7 = {
  number: 7,
  title: 'Atmospheric Pollution',
  weight: '7-10%',
  fit: 'core',
  notes: 'Air pollution is the single largest environmental cause of premature death globally — ~7 million per year per WHO. Terra Council models PM2.5 as the "smog" overlay.',
  weeks: [22, 24],
  subunits: [
    {
      code: '7.1',
      title: 'Introduction to air pollution',
      content:
`Air pollution is the presence of substances in the atmosphere at concentrations that cause harm to human health, ecosystems, or property. It's one of the most pervasive environmental health risks, killing more people globally than smoking, malaria, and HIV combined.

**The scale of the problem.**

WHO (2024) estimates:
- 7 million premature deaths per year globally from air pollution
- 4.2 million from outdoor (ambient) air pollution
- 3.8 million from indoor (household) air pollution
- 99% of the global population breathes air exceeding WHO guidelines

Air pollution is the world's largest environmental health risk and a major cause of cardiovascular disease, stroke, lung cancer, chronic respiratory disease, and pneumonia.

**The six "criteria" pollutants (US EPA).** These are regulated by the Clean Air Act:

**(1) Particulate matter (PM).** Tiny particles suspended in air. Major categories:
- **PM10**: 10 micrometers or smaller. From dust, pollen, combustion.
- **PM2.5**: 2.5 micrometers or smaller. From combustion (cars, power plants, fires). Far more harmful — penetrates deep into lungs.
- **Ultrafine PM (PM0.1)**: 0.1 micrometers or smaller. Penetrate lung-blood barrier; enter bloodstream and brain.

Health effects of PM:
- Increased mortality, especially cardiovascular
- Lung cancer (PM2.5 is a confirmed carcinogen)
- Asthma exacerbation
- Reduced lung function in children
- Cardiovascular disease
- Premature death

PM2.5 alone causes ~3-4 million premature deaths per year globally.

**(2) Ground-level ozone (O₃).** Tropospheric ozone (the lowest atmosphere layer). Formed by photochemical reactions:

NOx + VOC + sunlight → O₃ + secondary pollutants

Health effects:
- Respiratory irritation
- Asthma exacerbation
- Reduced lung function
- Premature mortality
- Damages plants (reduces crop yields)

Different from stratospheric ozone (the "good ozone" that shields us from UV — covered in 9.10).

**(3) Carbon monoxide (CO).** Colorless, odorless gas. Produced by incomplete combustion. Sources: vehicle exhaust, heating, smoking, biomass burning.

Health effects:
- Binds to hemoglobin instead of oxygen (200× affinity)
- Reduces oxygen delivery to tissues
- High doses: death (silent killer in poorly-ventilated buildings)
- Lower doses: headaches, fatigue, reduced cognitive function

**(4) Sulfur dioxide (SO₂).** Strong-smelling gas. From sulfur-containing fuels (coal, especially), industrial processes, volcanic activity.

Health effects:
- Respiratory irritation
- Asthma exacerbation
- Bronchitis

Environmental effects:
- Acid rain (SO₂ + H₂O → H₂SO₃ → H₂SO₄)
- Damages forests, lakes, buildings
- Reduces visibility (haze)

US SO₂ emissions reduced ~95% since 1990 (acid rain controls). Still major issue in coal-heavy regions globally.

**(5) Nitrogen oxides (NOx).** NO and NO₂. From combustion (vehicles, power plants, industry).

Health effects:
- Respiratory irritation
- Asthma exacerbation

Environmental:
- Smog formation
- Acid rain
- Eutrophication of waterways
- Nitrate aerosol formation (significant PM2.5 contributor)

**(6) Lead (Pb).** Highly toxic metal. Major sources historically: leaded gasoline (phased out in US 1986; global by ~2021), industrial smelters, paint.

Health effects:
- Neurological damage, especially in children (developmental disabilities, IQ reduction)
- Cardiovascular disease in adults
- Anemia
- Kidney damage
- Reproductive effects

Removal of leaded gasoline reduced US blood lead levels ~95% from 1976 to 1991. Lead remains a major concern in some developing countries.

**Other significant air pollutants beyond the criteria six.**

**Volatile Organic Compounds (VOCs).** Carbon-containing gases that vaporize at room temperature. Sources: paints, solvents, gasoline, plastics, biological. Major contributors to smog. Examples: benzene (carcinogen), formaldehyde, methyl tertiary-butyl ether (MTBE).

**Hazardous Air Pollutants (HAPs).** Approximately 188 chemicals regulated by EPA. Include mercury, arsenic, asbestos, benzene, vinyl chloride. Many are carcinogens.

**Greenhouse gases.** CO₂, CH₄, N₂O. Not regulated as health pollutants but as climate concerns.

**Particulate-bound chemicals.** PM2.5 carries adsorbed chemicals — heavy metals, polycyclic aromatic hydrocarbons (PAHs), endotoxins.

**Sources of air pollution.**

**Mobile sources.** Vehicles — cars, trucks, ships, trains, aircraft. Account for ~30% of NOx, ~25% of VOCs, ~20% of PM2.5 in US. Increasing share globally.

**Stationary sources.** Power plants, industry, oil/gas operations.
- Coal power: SO₂, NOx, PM, mercury
- Natural gas power: NOx mostly
- Oil refining: VOCs, SO₂
- Steel mills: PM, SO₂

**Area sources.** Many small sources — homes, small businesses, agriculture, dust roads. Often regulated less but significant in aggregate.

**Natural sources.** Wildfires, volcanoes, dust storms, biogenic emissions (plants release VOCs). Often dominant in some regions.

**Acid deposition.** SO₂ and NOx in atmosphere react with water to form acids. Acid rain. (Covered in 7.7.)

**Photochemical smog.** Mix of pollutants formed by reactions in sunlight. (Covered in 7.2.)

**Thermal inversions.** Atmospheric conditions that trap pollution near ground. (Covered in 7.3.)

**Geographic patterns.**

**Megacities.** Beijing, Delhi, Cairo, Mexico City, Lagos, Mumbai have severe air pollution. PM2.5 often 5-10× WHO guideline.

**Developing world.** Indoor air pollution from solid fuel burning (coal, wood, charcoal, dung) kills ~3.8 million per year. Affects ~2 billion people who still cook with these fuels.

**Industrialized world.** Mostly outdoor pollution from vehicles, industry. Has declined dramatically since 1970s in US/EU due to regulation.

**East Asia.** Massive PM2.5 problem in China; partly improving since 2014 due to coal reduction and stricter regulation. Still major issue.

**South Asia.** Some of world's worst air quality (Delhi, Lahore). Multiple sources: coal, vehicles, agriculture (crop burning), biomass burning.

**US regulation: Clean Air Act.** Federal law passed 1970, amended 1977 and 1990. National Ambient Air Quality Standards (NAAQS) set for criteria pollutants. State Implementation Plans (SIPs) achieve compliance.

US air quality dramatically improved 1970-2020:
- SO₂: down ~95%
- CO: down ~85%
- NO₂: down ~70%
- PM10: down ~60%
- Lead: down ~99%
- Ozone: down ~25%

Despite economic growth and population growth, air pollution declined sharply due to regulation.

**Cost-benefit.** EPA estimates that benefits of Clean Air Act exceed costs by ~30:1. Air pollution control is one of the highest-return public investments.

**Air quality measurement.** EPA monitors air at ~4,000 stations nationally. Air Quality Index (AQI) reports air quality:
- 0-50: Good (green)
- 51-100: Moderate (yellow)
- 101-150: Unhealthy for sensitive groups (orange)
- 151-200: Unhealthy (red)
- 201-300: Very unhealthy (purple)
- 301+: Hazardous (maroon)

**Climate change connection.** Many air pollutants and greenhouse gases share sources (combustion). Reducing one often reduces the other. CO₂ regulation and PM2.5 regulation are often co-benefits.

But some pollutants have offsetting effects on climate:
- SO₂ aerosols cool the climate (block sunlight)
- PM2.5 generally cools (block sunlight)
- Reducing these for health benefits has slight climate warming effect
- Net of pollution control: better health, slightly more warming, but greenhouse gas reductions usually outweigh aerosol effects

**Future trajectories.** Most air pollution scenarios predict continued improvement in developed countries (technology, regulation) but possible worsening in some developing countries before they implement controls. The global air pollution trajectory depends largely on:
- China's coal phase-out
- India's pollution control measures
- Vehicle electrification globally
- Clean cooking fuel adoption

**Key facts:**
- 7 million premature deaths/year globally from air pollution (WHO)
- 6 criteria pollutants: PM, ozone, CO, SO₂, NOx, lead
- PM2.5 alone causes 3-4 million premature deaths/yr
- US Clean Air Act (1970) reduced air pollution dramatically
- AQI: 0-50 good; 200+ unhealthy
- Indoor air pollution kills 3.8 million/year (mostly from solid fuel cooking)
- US air pollution down 70-99% since 1970 despite economic growth
- Many air pollutants and GHG share sources; co-benefits of regulation`,
    },
    {
      code: '7.2',
      title: 'Photochemical smog',
      content:
`Photochemical smog is air pollution formed when sunlight reacts with NOx and VOCs to produce secondary pollutants including ozone, peroxyacyl nitrates (PANs), and aldehydes. It's a major urban air pollution problem and the dominant air-quality issue in many cities.

**The reaction.** Photochemical smog is "secondary" pollution — the harmful compounds are not directly emitted but formed in the atmosphere from emitted precursors:

NO₂ + sunlight → NO + O (atomic oxygen)
O + O₂ → O₃ (ozone)
VOCs + NO → various organic peroxides → PANs

The key sequence:
1. Combustion engines emit NO (and some NO₂)
2. NO oxidized to NO₂ in atmosphere
3. NO₂ + sunlight → NO + O
4. O + O₂ → O₃
5. Ozone reacts with VOCs to form additional secondary pollutants
6. Net result: ozone, aldehydes, PANs accumulate

**Required ingredients.**
- **NOx** from combustion (vehicles, power plants, industry)
- **VOCs** from gasoline vapor, paints, solvents, biological sources
- **Sunlight** (the photo-part of photochemical)
- **Heat** (faster reactions in summer)
- **Stagnant air** (trapped pollutants accumulate)

**Geographic concentration.** Smog forms in cities with:
- High vehicle traffic (NOx, VOC sources)
- Sunny, warm climate (driving the photochemistry)
- Air-stagnation tendencies (basins surrounded by mountains; thermal inversions)
- Population concentration (more emissions)

**Classic example: Los Angeles.** California's South Coast Air Basin has all four conditions. The basin is surrounded by mountains; coastal sea breeze tends to push pollution against mountains; sunny climate; many vehicles. LA had some of the worst smog in the US in the 1960s-80s.

By 2024, LA's air quality has improved dramatically (cleaner vehicles, stricter regulation) but ozone levels still often exceed federal standards.

**Other smog-prone cities.**

**Mexico City.** Surrounded by mountains, sunny, high vehicle density. One of the most smog-affected cities globally for decades. Improving with cleaner vehicles and natural gas heating.

**Beijing.** Different smog dominated (more sulfate-based traditionally; now mixed). PM2.5 + photochemical mix.

**Delhi.** Crop burning + vehicle emissions + dust + photochemical smog. World's worst air quality often.

**Houston.** Industrial petrochemical emissions + sun + heat + traffic. Major smog issues.

**Health effects.**

**Acute effects.** Even short-term exposure (hours) to ozone causes:
- Coughing, throat irritation
- Reduced lung function
- Asthma exacerbation
- Chest pain on deep breath
- Headache, fatigue

**Chronic effects.** Long-term exposure causes:
- Premature aging of lungs
- Reduced lung capacity (especially in children)
- Increased respiratory infections
- Cardiovascular disease
- Some studies suggest neurological effects

**Vulnerable populations.**
- Children (developing lungs)
- Asthmatics
- People with chronic respiratory disease
- Older adults
- Pregnant women
- Outdoor workers and athletes

**Ecological effects of ozone.**

Ozone damages plants. Mechanism: ozone enters through stomata, reacts with plant tissue, damages photosynthetic apparatus.

Crop yield reductions from ozone:
- Soybeans: 5-20% reduction
- Wheat: 5-15%
- Corn: 5%
- Cotton: ~10%

Global crop yield losses from ozone: ~$10-15 billion/year. Forests also affected — reduced growth.

**Smog management.**

**Vehicle regulation.** Catalytic converters dramatically reduce NOx, HC, CO emissions. Vehicle inspection programs. Cleaner gasoline (low sulfur, oxygenates, ethanol blends).

**Fuel regulation.** Sulfur removal from gasoline (low-sulfur diesel mandated in US 2006). Vapor recovery at gas stations. Reformulated gasoline in smog-prone regions.

**Vehicle technology.** Electric vehicles eliminate tailpipe emissions. EV adoption accelerating.

**Industrial regulation.** Selective catalytic reduction (SCR) on power plants for NOx control. Low-NOx burners. Activated carbon to absorb VOCs.

**Driving behavior.** Carpooling, telecommuting, public transit reduce vehicle miles traveled. Some cities have "no-drive" days or fees for entering certain areas.

**Indoor sources.** Some VOC sources are indoor (paint, cleaning products). Low-VOC products reduce indoor and outdoor pollution.

**The 2010s improvements.** Many smog-prone cities (LA, Houston, Tokyo, Seoul) saw substantial improvement in 2010s due to cleaner vehicles. Continued improvement projected through 2030s as fleets fully turn over to lower-emission vehicles.

**Beijing's air quality transformation.** Beijing's PM2.5 reduced ~40% between 2013 and 2022, largely from coal restrictions and vehicle controls. Ozone proved harder to reduce (NOx reductions can actually increase ozone in NOx-rich conditions; need coordinated NOx + VOC reductions).

**Ozone control paradox.** In areas with very high NOx, ozone is sometimes actually suppressed (NOx scavenges ozone). Reducing NOx in such areas first increases ozone before reducing it. Requires careful planning.

**Atmospheric chemistry of smog.**

The photochemistry is complex. Hundreds of compounds participate. Some reactions:

NO₂ + sunlight (λ < 420 nm) → NO + O(³P)
O(³P) + O₂ + M → O₃ + M (where M is a third molecule)
O₃ + NO → NO₂ + O₂ (oxidation back to NO₂; partly removes ozone)

Net result depends on VOC/NOx ratio:
- VOC-limited regime: VOC controls reduce ozone
- NOx-limited regime: NOx controls reduce ozone
- Transitional regime: both matter

City emissions and chemistry must be characterized to determine which approach to take.

**Peroxyacyl nitrates (PANs).** Phytotoxic compounds formed in photochemical smog. PAN is the most common. Damages plants and causes eye irritation. Long-lived in atmosphere (especially in cold temperatures).

**The Donora, PA disaster (1948).** Industrial smog event in Donora. Combined SO₂, fine particulates, fog under thermal inversion. 20 people died, hundreds sickened. Helped motivate US air pollution research and regulation.

**The London Fog of 1952.** Sulfurous coal-fueled smog under thermal inversion. ~4,000-12,000 estimated deaths. Led to UK Clean Air Act 1956.

**Key facts:**
- Smog = NOx + VOCs + sunlight → ozone, PANs, aldehydes (secondary pollution)
- Major urban air pollution problem
- LA, Mexico City, Beijing, Delhi are classic smog-affected cities
- Health: respiratory irritation, asthma exacerbation, chronic effects
- Ozone reduces crop yields: $10-15 billion/year globally
- Control: vehicle catalytic converters, low-sulfur gasoline, EV adoption
- VOC/NOx ratio determines control strategy (VOC-limited vs NOx-limited)
- Massive improvements in LA, Beijing from cleaner vehicles + fuels`,
    },
    {
      code: '7.3',
      title: 'Thermal inversions',
      content:
`A thermal inversion is an atmospheric condition where temperature increases with altitude rather than decreasing as normal. This traps air pollution near the ground because the cool, polluted air cannot rise through the warm air above. Thermal inversions cause severe air-pollution episodes in many cities.

**Normal atmosphere.** Normally, air temperature decreases with altitude at ~6.5°C per km. This creates an unstable atmosphere where warm surface air rises and mixes, carrying pollutants upward and away.

**Inversion atmosphere.** When a layer of warm air sits above cool surface air, the atmosphere is stable. Surface air can't rise. Pollutants accumulate.

The "lid" formed by the warm air above blocks vertical mixing. Pollution concentration increases the longer the inversion persists.

**Types of inversions.**

**(1) Radiation inversion.** Most common. Forms at night under clear skies. Earth's surface cools by radiating heat; lowest air layer cools below upper-air temperatures.

Common in:
- Winter mornings
- Clear nights
- Valleys (cold air sinks)
- Snow-covered ground (radiates heat efficiently)

Dissipates as sun rises and heats the surface (usually mid-morning).

**(2) Subsidence inversion.** Forms when high-pressure systems push warm air down over cool surface air. Common in:
- California (Pacific subtropical high pressure)
- Eastern Mediterranean
- Areas with marine layer (cool ocean air below warm continental air)

Can persist for days during high-pressure stagnation. Major contributor to LA smog episodes.

**(3) Frontal inversion.** Warm air mass overrides cool air mass at weather fronts. Localized but can be significant.

**(4) Marine inversion.** Cool ocean air comes ashore beneath warm inland air. Common on Pacific coasts in summer. Trap pollutants in coastal cities (LA, San Francisco).

**Geographic patterns.**

**Cities in basins.** Cities surrounded by mountains develop persistent inversions. Pollution can't escape over surrounding terrain. LA, Mexico City, Tehran, Lima, Salt Lake City all have basin-trapped pollution.

**Cold-climate cities.** Cities in cold climates have more radiation inversions. Calgary, Salt Lake City, Beijing all experience winter inversions.

**Coastal cities.** Cool marine layer creates inversions. LA's marine layer often persists through morning, lifting in afternoon.

**Famous inversion episodes.**

**Donora, Pennsylvania (1948).** Industrial valley town. Subsidence + radiation inversions trapped sulfurous coal smoke. 20 dead, ~7,000 sickened in 5 days. Major influence on US clean air legislation.

**London (1952).** Cold December air + coal heating + fog + radiation inversion = "the killer fog." 4,000-12,000 estimated deaths over 5 days. The biggest air pollution disaster in modern history. Led to UK Clean Air Act 1956.

**Meuse Valley, Belgium (1930).** Cold inversion + industrial pollution. ~60 dead. Earlier in century, less recognized.

**Bhopal, India (1984).** Methyl isocyanate gas release from pesticide plant. Cold night with inversion trapped gas at ground level. ~3,000 immediate deaths, ~25,000+ subsequent deaths, ~500,000+ injured. Industrial accident magnified by atmospheric conditions.

**Salt Lake City (modern).** Persistent winter inversions trap PM2.5 from cars, heating, and an oil refinery. State of Utah PM2.5 violations.

**Beijing (modern).** Winter inversions + coal heating creates extreme PM2.5 episodes ("airpocalypse"). The "Beijing cough" became famous.

**Mechanism of inversion-driven pollution.**

Under normal mixing:
- Surface emissions rise and disperse vertically (dilute)
- Atmospheric mixing extends ~1-3 km
- Pollution moves with winds, eventually disperses

Under inversion:
- Surface emissions cannot rise above inversion layer (~200-500 m)
- Pollution accumulates in shallow surface layer
- Concentration can build to 5-10× normal levels
- Until inversion breaks (sun heats surface, wind picks up, weather changes)

**Severity factors.**

(1) **Inversion strength.** Bigger temperature difference = stronger inversion = more trapping.

(2) **Inversion height.** Lower inversion = smaller mixing volume = higher pollution concentration.

(3) **Wind speed.** Calm conditions worsen inversion effects.

(4) **Emission rate.** More emissions = faster buildup.

(5) **Duration.** Longer persistence = more accumulation.

**Health impacts.**

Inversion episodes can dramatically increase mortality and morbidity:
- Respiratory hospitalizations spike
- Cardiovascular events increase
- Asthma attacks
- Premature deaths

Studies of inversion events show clear dose-response relationships between pollution concentration and health outcomes.

**Mitigation approaches.**

**Forecasting.** Meteorological forecasts predict inversion conditions. Cities issue air quality alerts:
- "Sensitive groups stay indoors"
- "Don't burn wood"
- "Limit driving"
- "Don't exercise outdoors"

**Source reduction.** Permanent emissions reduction reduces pollution buildup under inversions.

**Episode-based controls.** During inversion episodes, additional restrictions may be applied:
- Industrial emissions reductions
- No-burn days (no wood stoves)
- Vehicle restrictions (Mexico City's "no drive" days)
- Public health advisories

**Long-term solutions.**

- Cleaner energy sources (less combustion, less emissions)
- Electric vehicles
- Better building heating (natural gas, electric heat pumps)
- Industrial pollution controls
- Urban design that improves natural ventilation (avoid creating heat islands)

**Climate change connections.**

Climate change affects inversion patterns:
- More persistent high-pressure systems in some regions
- Stronger urban heat islands
- More extreme weather (alternating between blocked/active patterns)
- Drought conditions favor inversion formation

But climate change also changes overall atmospheric circulation in complex ways. Some regions may experience fewer severe inversions; others more.

**The "marine layer" in coastal California.** The cool marine layer is responsible for both maintenance and breakup of inversions:
- Marine layer caps inland air → maintains inversion
- When marine layer thins, inversion breaks
- Many LA-area communities live "above" or "below" the marine layer with very different climates

**Mountain valley inversions.** Common in winter when:
- Cold air drains into valley overnight (katabatic flow)
- Warm air remains aloft
- Valley becomes cold pool
- Pollution from valley heating, vehicles, industry accumulates

Examples: Cache Valley, Utah (Logan); Salt Lake Valley, Utah; many Colorado valleys (Denver, Greeley); China's Sichuan Basin; Iran's Tehran in mountains.

**Why inversions are educational.** They demonstrate that atmospheric conditions, not just emissions, determine local air quality. Two cities with identical emissions can have different air quality based on their geography and weather patterns.

**Key facts:**
- Inversion: temperature increases with altitude (opposite of normal)
- Types: radiation, subsidence, frontal, marine
- Cities in basins or with cold winters are most prone
- Donora 1948, London 1952, Bhopal 1984 are famous deadly inversions
- Mechanism: pollution trapped in shallow surface layer
- Salt Lake City, Beijing, Mexico City have persistent inversion problems
- Mitigation: forecast warnings, source reduction, episode-based controls
- Climate change affects inversion patterns in complex ways`,
    },
    {
      code: '7.4',
      title: 'Atmospheric CO₂ and particulates',
      content:
`Carbon dioxide (CO₂) and particulate matter (PM) are two of the most consequential air pollutants — though through different mechanisms. CO₂ drives climate change (a slow, global, irreversible problem). PM causes immediate health harm (a fast, local, partially reversible problem). Both are major foci of air-quality policy.

**Atmospheric CO₂.**

Pre-industrial CO₂: 280 ppm.
Current CO₂: ~425 ppm (2024).
The increase: 51% above pre-industrial.

(See 1.4 for full carbon cycle.)

CO₂ is not directly toxic at current atmospheric concentrations — humans live happily in air with 500-1,000 ppm. The harm is climate change (covered in Unit 9).

**Recent CO₂ data.**
- Mauna Loa Observatory: continuous measurement since 1958
- Currently rising ~2.5 ppm/year (annual average)
- Seasonal cycle: ~5-7 ppm amplitude (northern hemisphere photosynthesis)
- Annual growth varies with weather (El Niño/La Niña), economic activity

**Global emissions:**
- Total: ~37 Gt CO₂/year (2023)
- Coal: ~14 Gt
- Oil: ~12 Gt
- Natural gas: ~8 Gt
- Cement and other industrial: ~3 Gt

(1 Gt CO₂ = 1 billion tonnes; 3.67 t CO₂ ≈ 1 t carbon.)

**Top emitters (2023, % of global):**
- China: 30%
- United States: 14%
- India: 7.5%
- Russia: 5%
- Japan: 3%
- Indonesia: 2.5%
- Iran: 2%
- Saudi Arabia: 2%
- Germany: 2%
- Republic of Korea: 1.6%

Per capita rankings differ — Australia, US, Saudi Arabia, Canada have very high per-capita emissions.

**Particulate matter (PM).**

PM is the most lethal air pollutant globally. About 3-4 million premature deaths annually attributable to PM2.5.

**Sizes:**
- **PM10**: 10 micrometers or less. Larger; deposit in upper respiratory tract.
- **PM2.5**: 2.5 micrometers or less. Smaller; penetrate deep into lungs and alveoli.
- **PM1**: 1 micrometer or less. Very fine; enter bloodstream.
- **Ultrafine PM (PM0.1)**: 0.1 micrometers or less. Smallest; cross blood-brain barrier.

For perspective: human hair ~50 micrometers; red blood cell ~7 micrometers.

**Primary PM** is directly emitted: dust, soot, sea spray, smoke.

**Secondary PM** is formed in atmosphere from precursors:
- Sulfate aerosols (from SO₂)
- Nitrate aerosols (from NOx)
- Organic aerosols (from VOCs)
- Ammonium aerosols (from NH₃)

Sulfate and nitrate aerosols are major PM2.5 components in many regions.

**Sources of PM2.5:**
- Combustion: vehicles, power plants, industry (largest in most cities)
- Wildfires: increasingly important in western US
- Wood burning: residential heating, especially in winter
- Industrial: steel, cement, refining
- Construction and demolition
- Agriculture: dust, crop residue burning
- Natural: dust storms, volcanic, sea spray, biological

**Health effects of PM2.5.**

Mechanism: PM2.5 enters lungs, penetrates alveoli, can enter bloodstream. Damages tissues. Causes inflammation. Contributes to:
- Cardiovascular disease (60-80% of PM2.5 deaths from CVD)
- Lung cancer (PM2.5 is IARC Group 1 carcinogen)
- Chronic obstructive pulmonary disease (COPD)
- Asthma exacerbation
- Premature mortality
- Reduced cognitive function (in studies of children, adults, elderly)

Dose-response: ~10% increase in mortality per 10 μg/m³ increase in chronic PM2.5 exposure.

**WHO PM2.5 guidelines (2021):**
- Annual mean: 5 μg/m³ (revised down from 10)
- 24-hour mean: 15 μg/m³

US EPA standard (revised 2024):
- Annual mean: 9 μg/m³

For comparison:
- Pre-industrial natural background: ~2-5 μg/m³
- Clean rural US: ~5-8 μg/m³
- US urban: ~8-15 μg/m³
- Major Chinese cities: 25-50 μg/m³ (improved from 80+ a decade ago)
- Delhi: 80-150+ μg/m³ (often worse)

**Geographic patterns.**

**Dirty regions:**
- North India (Delhi, Lahore, Lucknow)
- China (some cities; improving)
- Eastern Europe
- West Africa (Sahara dust + emissions)
- Indonesia and Malaysia (forest fires)

**Cleaner regions:**
- Australia
- Scandinavia
- Pacific Northwest US (except during fire seasons)
- Iceland

**PM2.5 and climate.** PM2.5 has complex climate effects:
- Sulfate aerosols cool climate (reflect sunlight)
- Black carbon (soot) warms climate (absorbs sunlight)
- Net effect varies by location and PM composition
- Cooling effect of aerosols partially masked human-caused warming

Reducing PM2.5 has slight warming co-effect; reducing fossil-fuel-based PM2.5 also reduces CO₂, with net warming/cooling balance.

**Black carbon (soot).** A particularly damaging PM component:
- Strong climate warming (deposited on snow/ice reduces albedo)
- Major cause of glacier and snow melt acceleration
- Significant health impact
- Major sources: diesel engines, biomass burning, residential cooking

Reducing black carbon is "low-hanging fruit" for both climate and health.

**Dust transport.** Saharan dust crosses Atlantic, fertilizes Amazon basin and Caribbean Sea. Asian dust crosses Pacific. Major source of PM in some regions.

**Wildfire-PM.** Western US fires now produce more PM than industry in some years. 2020 fire smoke in West Coast US created the worst air quality recorded in many cities. Health impact of fire smoke is large and growing.

**PM2.5 reduction strategies.**

**Vehicle:** Diesel particulate filters, gasoline particulate filters, electric vehicles.

**Power generation:** Coal scrubbers, switch from coal to natural gas, transition to renewables.

**Industrial:** Baghouses (fabric filters), electrostatic precipitators.

**Residential:** Cleaner wood stoves, switch from wood to electric/gas heating.

**Agricultural:** Crop residue management (don't burn), dust control.

**Wildfire:** Forest management, reduced fire-prone fuel loads.

**Indoor:** Air purifiers, ventilation.

**Achievements.** US PM2.5 reduced ~40% since 2000. EU reductions similar. China has reduced PM2.5 ~30-40% since 2013. Continued improvement projected, especially as coal phases out.

**Disparities.** PM2.5 exposure is unequal:
- Lower-income communities often near pollution sources
- Communities of color disproportionately exposed
- Frontline communities near refineries, ports
- Children in older urban housing
- Outdoor workers

EPA tracks environmental justice in pollution exposure.

**Co-benefits of CO₂ + PM reduction.** Reducing fossil fuel use:
- Reduces CO₂ emissions (climate benefit)
- Reduces PM2.5 (health benefit)
- Reduces SO₂, NOx (further health and ecosystem benefits)
- Reduces ground-level ozone (more benefits)
- Reduces oil-spill risks
- Improves energy security

Quantified studies suggest health co-benefits often equal or exceed climate benefits in net present value terms.

**Future trajectories.** Most climate scenarios that meet Paris goals (1.5-2°C) require dramatic PM2.5 reductions through fossil fuel reduction. Health benefits in the 100s of millions of premature deaths avoided over the century.

**Key facts:**
- CO₂: 280 → 425 ppm (51% increase since pre-industrial)
- Top emitters: China (30%), US (14%), India (7.5%), Russia (5%)
- PM2.5 kills 3-4 million/year; IARC Group 1 carcinogen
- PM2.5 sizes: smaller = more dangerous
- WHO guideline 5 μg/m³ annual; US EPA 9 μg/m³
- Sources: combustion (dominant), fires, dust
- Sulfate, nitrate, organic aerosols are secondary PM
- Black carbon: climate warming + health damage; high-leverage reduction target
- CO₂ + PM2.5 reductions have synergistic benefits`,
    },
    {
      code: '7.5',
      title: 'Indoor air pollutants',
      content:
`Indoor air pollution is often worse than outdoor pollution and affects people for many more hours per day (humans spend ~90% of time indoors). It causes 3-4 million premature deaths per year globally, mostly from solid fuel cooking and heating in developing countries.

**Two major issues.**

**(1) Solid fuel cooking and heating (developing world).**

Approximately 2.4 billion people worldwide rely on solid fuels for cooking:
- Wood
- Charcoal
- Coal
- Agricultural residues
- Animal dung

These produce massive indoor air pollution:
- PM2.5 concentrations 100-500 μg/m³ (WHO guideline: 5 μg/m³)
- CO levels in dangerous range
- Polycyclic aromatic hydrocarbons (PAHs)
- Black carbon

**Health impact.** 3.8 million premature deaths/year from household air pollution. Main causes:
- Pneumonia in children (45% of pneumonia deaths in <5)
- COPD in adults
- Lung cancer
- Cardiovascular disease
- Stroke
- Low birth weight in children of exposed mothers

Disproportionately affects women and children (who spend more time near cooking).

**Mitigation.**
- Improved cookstoves (40-60% emission reduction)
- Liquefied petroleum gas (LPG) — major shift program in India under PMUY scheme
- Biogas systems (from animal manure)
- Solar cookers (slow but emission-free)
- Electricity (cleanest but requires reliable grid)
- Smoke hoods and improved ventilation

India has electrified ~99% of villages and is rapidly transitioning to LPG. China largely transitioned in past decades.

**(2) Developed-world indoor pollutants.**

Different pollutants but real issues:

**Radon.** Naturally occurring radioactive gas. From decay of uranium in soil and rock. Seeps from ground into buildings. Major cause of lung cancer (second only to smoking).

- 21,000 deaths/year in US attributed to radon
- Higher concentrations in areas with uranium-rich rock (e.g., parts of Pennsylvania, Iowa, Colorado, New England)
- EPA action level: 4 pCi/L
- Test homes; mitigation by ventilation under basement floor
- $500-2,000 typical mitigation cost

**Asbestos.** Mineral fibers historically used in insulation, fireproofing, brake pads. Inhalation causes mesothelioma (rare cancer), lung cancer, asbestosis (scarring).

- Banned in US for most uses since 1970s
- Still present in older buildings
- Mitigation: encapsulation or removal by licensed professionals

**Lead paint.** Used in homes before 1978. Children eating chips or inhaling dust cause lead poisoning. Major source of childhood lead exposure historically.

- Federal disclosure required when selling pre-1978 home
- Lead abatement under EPA regulations
- Blood lead levels in US children dropped 95% since 1976 due to combined elimination of leaded gasoline and lead paint controls

**VOCs from materials.**

Paint, varnishes, adhesives, particleboard, carpeting release VOCs after installation. Some are:
- Formaldehyde: from particleboard, plywood; suspected carcinogen
- Benzene: from many materials; confirmed carcinogen
- Methylene chloride: in solvents
- Toluene: in paint thinners

Most off-gassing decreases over months. Modern materials are lower-VOC than past materials.

**Mold.** Fungi growing in damp areas (basements, bathrooms, leaky walls). Spores cause:
- Allergic reactions
- Asthma exacerbation
- Some toxic species (Stachybotrys) cause severe symptoms

**Tobacco smoke.** Major source of indoor air pollution. Secondhand smoke causes ~41,000 deaths/year in US. Smoking bans in workplaces, restaurants, public spaces have reduced exposure dramatically.

**Combustion gases.**

Gas stoves, furnaces, fireplaces, smoking produce:
- CO (in poorly-ventilated combustion)
- NO₂
- Formaldehyde
- PM2.5
- Benzene

Gas stoves received attention 2022-2023 as a major source of indoor NO₂ — typical home gas stove exceeds WHO indoor NO₂ guidelines.

**Personal care products.** Air fresheners, candles, cleaning supplies release VOCs and particulates. Some have specific toxicity.

**Carpeting.** Off-gassing of carpet chemicals and adhesives. Modern carpeting much lower-VOC.

**Building materials with chemical concerns.**
- Particleboard: formaldehyde
- Vinyl flooring: VOCs, phthalates
- Some insulation foams: formaldehyde, isocyanates
- New construction generally: VOCs from many sources

**Air freshening and combustion in homes.**

Plug-in air fresheners, scented candles, incense all emit chemicals. Some have respiratory effects.

**Indoor mold prevention.**
- Control moisture
- Ventilate bathrooms and kitchens
- Fix leaks promptly
- Replace water-damaged materials within 24-48 hours
- Reduce humidity to 30-50%

**Indoor air quality measurement.**

Monitors available for:
- CO
- CO₂ (proxy for ventilation; high CO₂ indicates poor ventilation)
- PM2.5
- VOCs (less reliable consumer monitors)
- Radon (passive detectors)
- Humidity

**Building ventilation.**

Mechanical ventilation (HVAC with outside-air mixing) or natural ventilation (windows). Required by code in new construction.

**Heat Recovery Ventilation (HRV) / Energy Recovery Ventilation (ERV).** Bring in fresh air while recovering heat (or cooling) from exhausted air. Energy-efficient.

**Air filtration.**

- HEPA filters: remove PM2.5 and most particulates
- Activated carbon: removes VOCs
- HVAC filters: vary in efficiency (MERV rating)

**Health-conscious building practices.**

Green building certifications (LEED, WELL) emphasize indoor air quality:
- Low-VOC materials
- Proper ventilation
- Pollutant monitoring
- Daylight and views (mental health)

**Indoor air quality in offices and schools.**

- Sick building syndrome: symptoms attributed to specific buildings (lethargy, headaches, eye/throat irritation)
- Often inadequate ventilation
- Improving ventilation can significantly reduce absenteeism

**Coronavirus and indoor air.**

COVID-19 highlighted importance of indoor ventilation for disease transmission. Many buildings upgraded ventilation systems. CO₂ monitoring became popular to assess ventilation quality.

**Indoor vs outdoor exposure.** For typical adults:
- ~90% of breathing occurs indoors
- Outdoor pollution often penetrates indoors
- Indoor sources add to indoor exposure
- Indoor exposures often exceed outdoor exposures, especially for VOCs

**Climate change and indoor air quality.**

Warmer summers create more demand for AC. Better-sealed buildings (for energy efficiency) trap pollutants if ventilation isn't ensured. Wildfire smoke infiltrates buildings. Climate change is making indoor air a more important issue.

**Key facts:**
- 90% of time indoors → high importance
- 3.8 million deaths/year from household air pollution (mostly solid fuel cooking)
- Major issues: solid fuel cooking, radon, asbestos, lead paint, VOCs, mold, tobacco
- Radon causes 21,000 US lung cancer deaths/year
- Gas stoves are significant indoor NO₂ source
- Ventilation is key — fresh air dilutes pollutants
- Green building (LEED, WELL) prioritizes IAQ
- COVID-19 highlighted ventilation importance`,
    },
    {
      code: '7.6',
      title: 'Reduction of air pollutants',
      content:
`Air pollution can be dramatically reduced through technology, regulation, and behavior change. Over the past 50 years, dramatic improvements have been achieved in many countries — US air pollution down 70-99% on key pollutants despite economic growth — but global progress is uneven.

**Three approaches to reduction.**

**(1) Source reduction.** Eliminate or reduce pollution at the source. Most effective and often cheapest in the long run.

**(2) Pollution control technology.** Capture pollutants before they enter the atmosphere.

**(3) Dispersion and dilution.** Spread pollution to reduce local concentration. Tall stacks are a classic example — they don't reduce total emissions but reduce local impact.

**Technologies for major pollutants.**

**Sulfur dioxide (SO₂) control.**

- **Scrubbers (Flue Gas Desulfurization)**: chemical reaction in stack. Limestone or lime reacts with SO₂ to form gypsum (CaSO₄·2H₂O). Removes 90-95% of SO₂.
- **Switch to low-sulfur fuel**: low-sulfur coal, natural gas, oil.
- **Pre-combustion sulfur removal**: chemical processes to remove sulfur from fuel before combustion.

US SO₂ emissions reduced ~95% since 1990 (peak emissions). Acid rain effectively eliminated in US.

**Nitrogen oxides (NOx) control.**

- **Selective Catalytic Reduction (SCR)**: ammonia injected into exhaust + catalyst; NOx converted to N₂ + H₂O. 80-90% reduction. Standard on modern coal plants.
- **Selective Non-Catalytic Reduction (SNCR)**: ammonia or urea injected; lower reduction (40-70%).
- **Low-NOx burners**: combustion design that produces less NOx. ~30-50% reduction.
- **Three-way catalyst (vehicles)**: combines NOx, CO, HC reduction. 90%+ reduction.

**Particulate Matter (PM) control.**

- **Baghouses (fabric filters)**: porous fabric captures particles. >99% efficiency.
- **Electrostatic precipitators (ESP)**: charge particles, attract them to plates. >99% efficiency for fly ash.
- **Cyclones**: spinning air separates large particles. 70-90% efficient.
- **Wet scrubbers**: water captures particles.
- **Diesel particulate filters (vehicles)**: filter exhaust. 95%+ reduction.
- **Gasoline particulate filters**: similar for gasoline vehicles.

**Volatile Organic Compound (VOC) control.**

- **Activated carbon adsorption**: captures VOCs in carbon beds. Recover for reuse or destroy.
- **Thermal oxidation**: burn VOCs to CO₂.
- **Catalytic oxidation**: oxidize at lower temperature.
- **Condensation**: cool to condense VOCs.
- **Vapor recovery**: at gas stations, gasoline storage.

**Carbon monoxide (CO) control.**

- **Three-way catalyst (vehicles)**: oxidizes CO to CO₂.
- **Combustion optimization**: complete combustion produces less CO.
- **Industrial process modification**.

**Lead control.**

- **Removed from gasoline**: leaded gasoline phased out (US 1986; global 2021).
- **Removed from paint**: 1970s.
- **Smelter controls**.

**Vehicle pollution control evolution.**

**1970s.** Catalytic converters introduced (US 1975). Required removal of lead from gasoline (lead poisons catalysts).

**1980s.** Refinement of catalytic converters, on-board diagnostics.

**1990s-2000s.** Tier 1 → Tier 2 → Tier 3 EPA standards. Lower emission limits.

**2010s-2020s.** Hybrid and electric vehicles. Diesel particulate filters mandatory.

**2020s+.** Battery electric vehicles. Plug-in hybrids. Hydrogen fuel cells (limited deployment).

Modern gasoline vehicles emit 99%+ less than 1970s models per mile driven.

**Power plant pollution control evolution.**

**1970s.** Tall stacks (dispersion).

**1980s-90s.** Acid Rain Program (US 1990). SO₂ allowance trading reduced SO₂ ~50% at 1/4 expected cost. Successful market-based regulation.

**2000s-2010s.** Cross-State Air Pollution Rule. NOx and SO₂ reductions for downwind states.

**2010s-2020s.** Mercury and Air Toxics Standards (MATS). Major mercury reductions from coal.

**Switching from coal to natural gas.** Natural gas combustion produces:
- ~50% less CO₂ than coal per kWh
- ~99% less SO₂
- ~80% less NOx
- ~95% less PM

This switch has been the single largest factor in US power-sector emissions reductions.

**Renewable energy.** Solar, wind, hydro produce zero combustion emissions. As they replace fossil fuel generation, air pollution falls dramatically.

**Indoor cooking transitions.**

Transition from solid fuel to:
- **Improved biomass stoves** (intermediate step)
- **LPG (Liquefied Petroleum Gas)**: cleaner, still fossil
- **Biogas** (from animal waste, food waste)
- **Electric** (cleanest but requires grid)
- **Solar cookers** (sustainable but slow)

India's Ujjwala Yojana program has connected 100+ million households to LPG since 2016.

**Regulatory frameworks.**

**Clean Air Act (US 1970).** Federal law. National Ambient Air Quality Standards (NAAQS). State Implementation Plans (SIPs) achieve standards. Stationary source permitting. Mobile source standards (vehicles).

**Mercury and Air Toxics Standards (MATS).** Major HAP reductions.

**Acid Rain Program.** SO₂ trading; major success.

**Clean Air Act amendments.** 1977 (Prevention of Significant Deterioration); 1990 (Acid Rain Program, ozone control, mercury).

**EU equivalents.** Air Quality Framework Directive; National Emission Ceiling Directive; specific pollutant directives.

**International.**

**Long-range Transboundary Air Pollution Convention (LRTAP)**: European regional treaty.

**Gothenburg Protocol**: SO₂, NOx, VOC reductions in Europe.

**Montreal Protocol**: ozone-depleting substance phase-out (very successful).

**Behavioral changes.**

- Use public transit, walk, bike
- Telecommute
- Carpool
- Don't burn wood when air quality is bad
- Maintain vehicles (catalytic converter integrity)
- Don't idle unnecessarily
- Use less electricity (especially during peak coal/gas use)
- Avoid VOC-heavy products

**Economic instruments.**

**Emission permits / cap-and-trade.** SO₂ trading is the classic success. RGGI (CO₂ for Northeast US power sector). California cap-and-trade. EU ETS.

**Pollution taxes.** Direct price on emissions. Used in some countries.

**Subsidies for clean technology.** Tax credits for electric vehicles, solar, etc.

**Market-based vs command-and-control.** Market-based: regulator sets target, market figures out cheapest way to meet it. Command-and-control: regulator dictates specific technology/practices.

Market-based often more efficient for well-defined pollutants. Command-and-control often necessary for unfamiliar problems.

**Co-benefits of pollution reduction.**

Reducing combustion to control air pollution:
- Reduces CO₂ (climate benefit)
- Reduces local PM2.5 (health benefit)
- Reduces SO₂, NOx (further benefits)
- Reduces ground-level ozone
- Reduces oil dependence
- Reduces water use (fossil power plants are water-intensive)

Total benefits often exceed costs by 10-30:1 in cost-benefit analyses.

**Future direction.**

Most projections suggest:
- Continued PM2.5 reductions in US/EU through 2030s
- China continues PM2.5 reductions; may achieve WHO interim targets
- India scaling up controls
- Africa: mixed; some cities improving, many not
- Electric vehicles dominate new car sales 2030-2040
- Heat pumps replace combustion heating
- Fossil power plants retire (coal first, gas later)

**Key facts:**
- Three approaches: source reduction, control technology, dispersion
- SO₂ scrubbers: 90-95% removal
- SCR for NOx: 80-90% removal
- ESP/baghouses for PM: >99% removal
- Catalytic converters for vehicles: 90%+ all major pollutants
- US air pollution down 70-99% on key pollutants since 1970
- Coal-to-gas switching: 50%+ CO₂, 95%+ SO₂, 80%+ NOx, 95%+ PM reduction
- Acid Rain Program: market-based; SO₂ down 95% at 1/4 expected cost
- Major co-benefits of air pollution control with climate policy`,
    },
    {
      code: '7.7',
      title: 'Acid rain',
      content:
`Acid rain (or more broadly, acid deposition) is the deposition of acidic compounds from the atmosphere onto surfaces. It results primarily from SO₂ and NOx emissions reacting with atmospheric water to form sulfuric and nitric acids. Acid rain caused major ecological damage in the late 20th century before regulation dramatically reduced it.

**The chemistry.**

In the atmosphere:
- SO₂ + ½O₂ + H₂O → H₂SO₄ (sulfuric acid)
- NOx + H₂O → HNO₃ (nitric acid)

Both react with water vapor and rain droplets, lowering pH.

Normal rain pH: ~5.6 (slightly acidic from CO₂ + H₂O → H₂CO₃).
Acid rain pH: 4.0-4.5 or lower.
Severe episodes: pH 2.5-3.0 (vinegar is pH 2.8).

**Types of deposition.**

**Wet deposition.** Acid rain, snow, fog. The most visible form.

**Dry deposition.** SO₂ and HNO₃ gas, plus sulfate and nitrate particles, deposit directly on surfaces. May exceed wet deposition by mass in some areas.

**Cloud water.** Highly acidic in clouds (pH 2.5-3.0 documented in mountain clouds).

**Major sources.**

**SO₂.** Coal combustion (historically dominant). Sulfur in coal oxidizes to SO₂. Industrial SO₂ also significant.

**NOx.** Fossil fuel combustion (vehicles, power plants, industry). Some natural sources (lightning).

Both can travel hundreds to thousands of km before deposition. Pollution from US Midwest deposited on Adirondacks. UK pollution deposited on Norway, Sweden.

**Ecological impacts.**

**Lakes and streams.**

Acidification of surface waters:
- Lower pH → kills fish (especially salmonids, sensitive species)
- Aluminum mobilization → toxic to aquatic life
- Calcium loss from lakebed sediments
- Loss of plankton diversity
- Loss of invertebrate diversity
- Lakes "fishless" — entire ecosystems collapsed

By 1990s, ~14% of Adirondack lakes were "fishless" or "chronically acidic" due to acid rain. Norwegian and Swedish lakes had widespread fish kills.

**Forests.**

- Direct foliar damage (especially conifers)
- Nutrient leaching from soil (calcium, magnesium, potassium)
- Aluminum mobilization in soil → toxic to roots
- Reduced growth
- Susceptibility to disease and pests
- Decline syndrome (multiple stresses accumulating)

Major forest decline observed in:
- Eastern US (red spruce decline in Appalachians)
- Germany (Black Forest)
- Northern Europe
- Some Canadian forests

**Soils.**

- Soil acidification
- Loss of base cations (Ca, Mg, K) leached out
- Aluminum mobilization
- Reduced fertility for forestry, agriculture

**Buildings, monuments, infrastructure.**

Limestone, marble dissolve under acid attack. Major damage to:
- Cathedrals and historic buildings
- Statues
- Bridges and steel structures
- Some plastics

Restoration costs in billions of dollars globally.

**Visibility.** Sulfate aerosols cause haze, reducing visibility. National parks like Great Smoky Mountains and Acadia experienced visibility losses of 50-80% during high-pollution decades.

**Human health.** Indirect: acid mobilizes heavy metals in water systems (lead, mercury). PM2.5 from sulfate aerosols causes direct health harm.

**The science behind acid rain.**

Discovery: Robert Angus Smith identified acidic rainfall in Manchester in 1872. Long-range transport documented in 1960s-70s when Scandinavian scientists traced lake acidification to British emissions.

Eugene Likens at Hubbard Brook Experimental Forest (NH) demonstrated long-term acid deposition effects on forest ecosystems starting 1970s. Long-term data showed clear ecological response to changes in emissions.

**Regulatory response.**

**Clean Air Act Amendments 1990 (US).** Acid Rain Program. Established SO₂ allowance trading.

Mechanism:
- Set total US SO₂ emissions cap (much lower than 1990 levels)
- Each polluter gets allowances equal to their share of cap
- Polluters can buy/sell allowances
- Total emissions cannot exceed cap

Result: SO₂ emissions reduced ~95% from 1990 to 2020. Cost was 1/4 of expectations. One of the most successful environmental regulations in history.

**Helsinki Protocol (1985), Sofia Protocol (1988), Gothenburg Protocol (1999).** European agreements reducing SO₂, NOx, NH₃, VOCs.

**Long-range Transboundary Air Pollution Convention (LRTAP).** UN-led European treaty.

**Recovery.**

After SO₂ and NOx reductions:
- Wet deposition of sulfate down ~80% in US since 1990
- Surface water pH recovering (slowly)
- Some Adirondack lakes recovering biologically (with management help)
- Forest soils recovering nutrient base cations very slowly (decades to centuries)

Recovery is slower than damage was inflicted. Decades of acid deposition leached calcium and magnesium from soils; restoration requires geologic timescales without intervention.

**Liming.** Some lakes are limed (calcium added) to neutralize acidity. Used in Scandinavian and Adirondack lakes. Effective but temporary; requires repeat application.

**Global picture.**

US, EU made dramatic progress. China still has significant acid rain in some regions (though declining as coal use shifts and controls implemented). India has growing problem. Africa has some hotspots.

China cut SO₂ emissions ~70% from 2007 to 2020 through scrubber installation and shifts away from coal. India's emissions still growing.

**The Ozone-Acid Rain confusion.** Different problems:
- Acid rain: tropospheric (low altitude), wet deposition, sulfur and nitrogen
- Ozone hole: stratospheric (high altitude), chlorofluorocarbons
- Tropospheric ozone: ground-level, photochemical smog, NOx + VOCs

Common misperception confuses these. They have different causes and require different solutions.

**Climate connections.**

Sulfate aerosols cool climate. Reducing SO₂ for acid rain control:
- Better for health and ecosystems
- Slight climate warming effect (loss of cooling aerosol)
- Net: massive improvements in air quality, smaller climate impact

The climate impact of aerosol reduction has been studied; estimates suggest aerosol declines accounted for ~0.1-0.3°C of recent warming.

**Lessons from acid rain.**

(1) **International cooperation works.** Pollution that crosses borders requires shared action. LRTAP, Acid Rain Program achieved major reductions.

(2) **Market-based regulation can be efficient.** SO₂ trading set a model for other pollutants.

(3) **Recovery can take longer than damage.** Plan for prevention, not just remediation.

(4) **Science-policy linkage matters.** Hubbard Brook research informed Acid Rain Program design.

(5) **Co-benefits are real.** SO₂ reduction simultaneously addressed health, ecosystems, visibility.

**Key facts:**
- Acid rain = SO₂ + NOx + H₂O → H₂SO₄ + HNO₃
- Normal rain pH 5.6; acid rain pH 4.0-4.5; episodic <3.0
- Pollutants travel hundreds to thousands of km
- Damages lakes (fishless), forests, buildings, soils
- 14% of Adirondack lakes were fishless by 1990s
- US 1990 Acid Rain Program reduced SO₂ ~95% via cap-and-trade
- LRTAP and Gothenburg Protocol drove European reductions
- China cut SO₂ ~70% since 2007; India still growing
- Recovery slower than damage; some forests still calcium-depleted
- Sulfate aerosols cool climate; reducing them has slight warming effect`,
    },
    {
      code: '7.8',
      title: 'Noise pollution',
      content:
`Noise pollution is unwanted or harmful sound. Often dismissed as a minor annoyance, it's now recognized as a significant environmental health problem. WHO estimates 100,000+ premature deaths/year in Europe alone from noise-related cardiovascular disease.

**The scale.**

**Health impacts.**
- Hearing loss (occupational and recreational)
- Cardiovascular disease (chronic stress from noise)
- Sleep disturbance
- Cognitive effects (reduced reading performance in children near airports)
- Hypertension
- Mental health effects (depression, anxiety)
- Reproductive effects (premature birth in some studies)

WHO's Environmental Noise Guidelines (2018) recommend:
- Road traffic: average <53 dB during day; <45 dB at night
- Aircraft: <45 dB during day; <40 dB at night
- Train: <54 dB; <44 dB
- Industrial: <55 dB

Above these, health effects increase.

**Decibel scale.** Logarithmic. Each 10 dB increase = 10× sound intensity but ~2× perceived loudness.

- 0 dB: threshold of hearing
- 30 dB: whisper
- 50 dB: quiet office
- 60 dB: conversation
- 70 dB: dishwasher, vacuum
- 80 dB: heavy traffic; chronic exposure damages hearing
- 90 dB: lawn mower, motorcycle
- 100 dB: chainsaw, helicopter
- 110 dB: rock concert
- 120 dB: jet plane (close); painful
- 140 dB: gunshot, fireworks (close); immediate damage

Sustained exposure to >85 dB causes permanent hearing loss over time.

**Sources of noise pollution.**

**Transportation.**

**Road traffic.** Largest single source in most cities. ~80% of noise complaints relate to vehicles. Tires, engines, exhausts all contribute.

**Aircraft.** Major impact near airports. Noise contours extend several km. Sleep disturbance and cardiovascular impacts documented.

**Trains.** Especially freight and high-speed rail. Vibration also significant.

**Watercraft.** Recreational and commercial. Ship traffic affects marine ecosystems.

**Industrial.**

- Construction (jackhammers, machinery)
- Manufacturing (presses, grinders)
- Wind turbines (relatively low compared to other sources)
- Compressors and pumps

**Residential.**

- Lawn equipment
- Power tools
- Music, parties, parties
- HVAC equipment
- Loud appliances

**Commercial.**

- Bars, restaurants, clubs (interior and exterior)
- Music venues
- Stadiums and sporting events

**Ecosystem impacts of noise.**

Noise affects wildlife in many ways:

**Communication interference.**
- Birds adjust songs in noisy areas (higher pitch, longer)
- Frogs and whales similarly affected
- Mating calls less effective
- Population effects documented in noisy areas

**Predator-prey relationships.**
- Prey can't hear approaching predators
- Predators can't locate prey by sound
- Population dynamics altered

**Stress responses.**
- Elevated cortisol
- Reduced reproduction
- Reduced foraging efficiency
- Increased vigilance, reduced feeding

**Marine noise.**

Particularly impactful in oceans:

- **Ship noise.** Continuous, low-frequency. Disrupts whale communication. Some species (right whales) reduce calls or stop calling in noisy areas.
- **Naval sonar.** High-intensity. Documented to cause whale strandings.
- **Seismic surveys (oil/gas exploration).** Air guns produce 250+ dB pulses. Long-distance impact on whales, fish.
- **Offshore wind installation.** Pile driving briefly intense. Marine mammals avoid construction zones.

Marine mammals depend on sound for communication, navigation, mating, finding food. Anthropogenic noise has dramatically changed ocean soundscapes.

**Human health effects in detail.**

**Hearing loss.** Sustained >85 dB exposure causes permanent damage. ~50 million Americans have noise-induced hearing loss.

**Cardiovascular effects.** Chronic noise exposure linked to hypertension, ischemic heart disease, stroke. WHO estimates noise contributes to thousands of cardiovascular deaths annually.

**Sleep disturbance.** Even moderate nocturnal noise (50-65 dB) disrupts sleep. Cumulative effects on health from chronic poor sleep.

**Cognitive effects in children.** Studies near airports show:
- Reduced reading scores
- Reduced concentration
- Lower test performance

Munich airport relocation showed that students' performance improved after airport moved away from school, declined for students under new flight paths.

**Mental health.** Increased anxiety, depression in chronically noisy environments.

**Reproductive.** Some studies link noise exposure to premature birth and lower birth weight, possibly via stress mechanism.

**Disparities.** Lower-income and minority communities often live in noisier areas (near highways, industry, airports). Environmental justice issue.

**Mitigation strategies.**

**Source reduction.**
- Quieter engines (electric vehicles dramatically quieter)
- Lower-noise tires
- Mufflers and exhaust controls
- Quieter aircraft engines (newer planes much quieter)
- Equipment design for noise reduction

**Path interruption.**
- Sound walls along highways
- Building design (sound insulation)
- Vegetation buffers (limited effect)
- Distance and spatial planning

**Receiver protection.**
- Hearing protection (ear plugs, ear muffs) for workers
- Quiet rooms and offices
- Sound masking systems
- Building sound insulation

**Regulation.**

**US Noise Control Act of 1972.** Limited federal scope. Most noise regulation is state and local.

**Aircraft.** FAA regulates aircraft noise; airports have noise abatement procedures (curfews, flight paths).

**Vehicle noise.** Some states regulate; enforcement variable.

**OSHA hearing protection standards.** Workplace exposure limits.

**Local noise ordinances.** Many cities have noise codes — limits on residential noise, especially at night.

**EU Environmental Noise Directive (2002).** Requires noise mapping and action plans. More comprehensive than US.

**Electric vehicles and noise.**

EV adoption is dramatically reducing urban noise. Tire-noise becomes dominant above ~30 km/h (~20 mph), so EVs are quieter mostly in low-speed traffic, but in cities with stop-and-go traffic this is significant.

Some EVs now required to make artificial sound at low speeds to alert pedestrians (noise mitigation for safety).

**Climate connections.**

EV transition reduces noise as a co-benefit. Quieter cities, healthier residents. Some studies estimate health benefits from EV-driven noise reduction at billions of dollars/year in US/EU.

**Air conditioning and noise.**

HVAC equipment is significant noise source. Quieter heat pumps (replacing furnaces) is a co-benefit of electrification.

**The "quiet movement."**

Growing recognition of noise pollution. Some communities establish:
- Quiet zones in protected natural areas
- Quiet hours
- Limits on amplified sound
- Noise mapping

**Soundscape ecology.** New field studying how soundscapes affect ecosystems. Restoring natural soundscapes is becoming part of conservation.

**Personal mitigation.**

- Noise-canceling headphones
- Hearing protection at concerts, sporting events
- Limit personal listening volume
- White noise machines for sleep
- Avoid noisy environments when possible

**Key facts:**
- Noise pollution is significant environmental health threat
- 100,000+ deaths/yr in Europe attributed (WHO)
- Decibel scale logarithmic: 85 dB chronic exposure damages hearing
- WHO night limits: <45 dB road; <40 dB aircraft
- Sources: transportation, industry, residential
- Health effects: hearing loss, CVD, sleep disturbance, cognitive effects
- Ecosystem effects: communication interference, predator-prey, behavior
- Marine noise: shipping, sonar, seismic surveys impact whales
- EVs and electrification reduce noise as co-benefit
- Lower-income communities often noisier (environmental justice)`,
    },
  ],
  keyConcepts: [
    'Six criteria pollutants: PM, ozone, CO, SO₂, NOx, lead.',
    '7 million premature deaths/year globally from air pollution (WHO).',
    'PM2.5 causes 3-4 million deaths/year; IARC Group 1 carcinogen.',
    'WHO PM2.5 guideline: 5 μg/m³ annual; US EPA: 9 μg/m³.',
    'Photochemical smog: NOx + VOCs + sunlight → ozone, PANs, aldehydes.',
    'Thermal inversion: temperature increases with altitude; traps pollution near ground.',
    'Acid rain: SO₂ + NOx form sulfuric and nitric acid; damages lakes, forests, infrastructure.',
    'US 1990 Acid Rain Program: SO₂ trading reduced emissions ~95% at 1/4 expected cost.',
    'Indoor air pollution (mostly solid fuel cooking) kills 3.8 million/year.',
    'Pollution control technologies: scrubbers, SCR, baghouses, ESPs, catalytic converters.',
    'US air pollution down 70-99% on key pollutants since 1970 despite economic growth.',
    'Climate-pollution co-benefits: reducing combustion reduces CO₂ AND health-damaging pollutants.',
  ],
  formulas: [
    {
      name: 'Acid rain chemistry',
      equation: 'SO₂ + ½O₂ + H₂O → H₂SO₄',
      meaning: 'Sulfur dioxide reacts with oxygen and water to form sulfuric acid; nitric acid forms similarly from NOx.',
      example: 'Acid rain in Adirondacks has pH 4.5; normal rain pH 5.6. The lake water becomes too acidic for fish below pH 5.0.',
    },
    {
      name: 'Decibel scale',
      equation: 'dB = 10 × log₁₀(I/I₀)',
      meaning: 'Logarithmic. Each 10 dB increase = 10× sound intensity. Sustained >85 dB causes hearing damage.',
      example: '70 dB (dishwasher) vs 80 dB (heavy traffic): traffic is 10× more intense (and twice as loud perceived).',
    },
  ],
  practice: [
    {
      q: 'A city experiences a thermal inversion in winter. PM2.5 doubles from 20 μg/m³ to 40 μg/m³ over 3 days. Why?',
      a: 'The temperature inversion creates a cap on vertical mixing. Surface emissions cannot rise above the inversion layer; they accumulate in the shallow surface layer. Without dispersion, pollution levels build until the inversion breaks.',
    },
    {
      q: 'Compare the formation of photochemical smog vs sulfurous (industrial) smog.',
      a: 'Photochemical smog: NOx + VOCs + sunlight → ozone + PANs; characteristic of sunny, warm cities (LA, Mexico City); secondary pollution. Industrial smog: SO₂ + particulates + fog; characteristic of cool industrial cities (London 1952); primary pollution.',
    },
    {
      q: 'Why is reducing PM2.5 a "co-benefit" of climate action?',
      a: 'Most PM2.5 comes from fossil fuel combustion (vehicles, power plants, industry). Reducing fossil fuel use to fight climate change also reduces PM2.5 emissions. Health benefits often exceed climate benefits in dollar value.',
    },
    {
      q: 'What was the SO₂ allowance trading program, and why is it considered successful?',
      a: 'Part of 1990 US Clean Air Act amendments. Set national SO₂ cap; allocated allowances to polluters; permitted trading. Result: SO₂ emissions reduced ~95% from 1990 to 2020 at ~1/4 of expected cost. Market-based regulation that achieved environmental goals more efficiently than command-and-control.',
    },
    {
      q: 'A homeowner switches from natural gas stove to induction electric stove. What air-quality benefits result?',
      a: 'Eliminates indoor combustion. No NO₂ emissions from cooking (which can elevate indoor NO₂ to unhealthy levels). No CO emissions. No particulates from combustion. Slight reduction in CO₂ if grid is partly clean (full reduction if grid is renewable).',
    },
  ],
  pitfalls: [
    '"Ground-level ozone is the same as the ozone layer" — opposite. Tropospheric ozone is a pollutant; stratospheric ozone protects from UV.',
    '"Air pollution is just bad odors" — actually causes 7 million deaths/year globally, mostly from PM2.5.',
    '"Indoor air is cleaner than outdoor" — often worse. Indoor pollution kills 3.8 million/year (mostly developing world cooking).',
    '"Pollution is a developing-world problem" — many wealthy countries still have significant problems (ozone, PM2.5).',
    '"Air pollution is mostly visible smog" — PM2.5 is small and often invisible. Many of the most dangerous pollutants are gases.',
    '"Removing scrubbers would save money" — scrubbers are typically the cheapest way to comply with regulations. Air quality benefits far outweigh installation costs.',
    '"Switching to electric vehicles solves all air pollution" — reduces tailpipe emissions but doesn\'t address tire wear (rubber particles), brake wear (metal particles), or power generation emissions.',
    '"Aerosol pollution helps the climate by cooling" — technically true but unethical to maintain a pollution-based cooling system. Pollution kills millions while providing minor climate benefit.',
  ],
};
