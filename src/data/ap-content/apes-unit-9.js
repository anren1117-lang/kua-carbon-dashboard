// APES Unit 9 — Global Change — full student-facing teaching content.
// Each subunit is a complete lesson, not a summary. ~1200-2000 words
// per subunit; a student should be able to learn the topic from
// reading the content alone.


export const APES_UNIT_9 = {
  number: 9,
  title: 'Global Change',
  weight: '15-20%',
  fit: 'core',
  notes: 'This is the unit Terra Council was built for. The whole simulator is Unit 9 by another name. Deploy The 2100 Verdict here.',
  weeks: [27, 32],
  subunits: [
    // ============================================================
    // 9.1 STRATOSPHERIC OZONE DEPLETION
    // ============================================================
    {
      code: '9.1',
      title: 'Stratospheric ozone depletion',
      content:
`Ozone (O₃) is a molecule of three oxygen atoms that occurs naturally in two parts of Earth's atmosphere with very different consequences. In the troposphere (the lower atmosphere, 0-12 km altitude), ozone is a pollutant — formed by photochemical reactions involving nitrogen oxides and volatile organic compounds from human emissions; it damages lungs, harms crops, and is a major component of urban smog. In the stratosphere (12-50 km altitude), ozone forms a layer that absorbs nearly all of the Sun's most damaging ultraviolet radiation before it reaches Earth's surface. Approximately 90% of all atmospheric ozone resides in this stratospheric layer.

**The role of UV radiation.** The Sun emits radiation across the electromagnetic spectrum. Ultraviolet (UV) light has wavelengths shorter than visible light, divided into three bands by biological effect. UV-A (315-400 nm) is the least energetic; about 95% of solar UV reaching Earth's surface is UV-A. It causes skin aging and contributes to some skin cancers but has weak DNA-damaging power. UV-B (280-315 nm) is intermediate. The atmosphere absorbs about 95% of incoming UV-B, leaving 5% to reach the surface; this fraction is what produces sunburn, cataracts, and most skin cancers. UV-C (100-280 nm) is the most energetic and most biologically damaging — DNA absorbs strongly in this range, causing direct genetic damage. Essentially all incoming UV-C is absorbed by the ozone layer; none reaches the surface in significant amounts.

Without the ozone layer, surface life as we know it could not exist. Even the partial thinning observed since the 1980s is associated with measurable increases in skin cancer (~2% increase in non-melanoma skin cancer per 1% decrease in stratospheric ozone), cataracts, immune-system suppression, damage to terrestrial plant growth, and damage to phytoplankton in the upper ocean (which feeds the entire marine food chain).

**Natural ozone chemistry: the Chapman cycle.** Stratospheric ozone is created and destroyed naturally in a continuous photochemical cycle, first described by Sydney Chapman in 1930. Four reactions:

  O₂ + UV → 2 O           (high-energy UV-C splits O₂ into oxygen atoms)
  O + O₂ + M → O₃ + M     (oxygen atom combines with O₂; M is any third molecule to absorb energy)
  O₃ + UV → O + O₂        (UV-B splits O₃ back into O + O₂)
  O + O₃ → 2 O₂           (oxygen atom combines with O₃; closes the loop)

In balance, this cycle creates a steady-state population of O₃ molecules in the stratosphere. The number is small — peak concentration is about 10 ppm (parts per million) at ~25-30 km altitude — but the layer is effective because the total path length through it absorbs most UV before it reaches the surface. The ozone column above any point is measured in Dobson units (DU); pre-industrial normal column ozone over mid-latitudes was about 300 DU. (One DU = 0.01 mm of ozone if compressed to surface pressure and temperature.)

The Chapman cycle is balanced naturally — UV creates and destroys ozone at similar rates. The total amount in the steady-state varies seasonally and with latitude (highest near polar regions in winter, lowest over equator). Until the 1970s the ozone column was reasonably stable.

**The catalytic-destruction threat.** The Chapman cycle keeps ozone in steady state assuming no other reactions destroy it. The threat emerges when something interferes with the cycle — specifically, a catalyst that destroys ozone faster than the natural cycle can replenish it.

Chlorofluorocarbons (CFCs) are synthetic chemicals invented in the 1930s and used in refrigeration, aerosol propellants, foam-blowing, and electronics manufacturing. CFCs (CFCl₃ is "CFC-11", CF₂Cl₂ is "CFC-12") were marketed as a triumph: non-toxic, non-flammable, chemically inert at the surface. The same inertness that made them safe at the surface meant they didn't react with anything in the troposphere — they just slowly diffused upward, eventually reaching the stratosphere over 5-10 years.

Once in the stratosphere, intense UV light breaks off a chlorine atom from each CFC molecule. That chlorine atom then catalytically destroys ozone in a chain reaction:

  Cl + O₃ → ClO + O₂
  ClO + O → Cl + O₂

The chlorine atom comes out of the reactions unchanged, ready to repeat. Each Cl atom can destroy approximately 100,000 O₃ molecules before being deactivated (typically by reaction with methane: ClO + CH₄ → HCl + CH₃O₂, forming HCl which eventually rains out, or by reaction with NO₂ to form ClONO₂). This catalytic amplification is why such small concentrations of CFCs caused such dramatic ozone loss.

Halons (compounds containing bromine, like CF₂ClBr used in fire extinguishers) work similarly but with bromine atoms in place of chlorine. Bromine is roughly 50× more effective at destroying ozone than chlorine atom-for-atom because Br has lower bond energy with the oxidized states and so cycles back to active form more readily. So halons are particularly damaging.

Methyl bromide (CH₃Br) — used as an agricultural fumigant — releases bromine when broken down in the stratosphere. Carbon tetrachloride (CCl₄) — a solvent — releases chlorine. Both are also controlled by the Montreal Protocol.

**The Antarctic ozone hole.** The most famous example of human-caused atmospheric chemistry. The hole was discovered in 1985 by British Antarctic Survey scientists (Farman, Gardiner, Shanklin in Nature). Each austral spring (September-November), the column ozone over Antarctica falls dramatically — from normal values around 250-300 DU down to as low as 100 DU. The geographic shape is roughly circular and matches the Antarctic polar vortex.

Why is the hole over Antarctica and not equally global? Three conditions combine to make Antarctica special:

(1) The polar vortex. A stable winter wind pattern that isolates Antarctic stratospheric air from the rest of the atmosphere. Temperatures inside the vortex fall to about -80°C in mid-winter, far colder than mid-latitudes.

(2) Polar stratospheric clouds (PSCs). The very low temperatures inside the vortex allow PSCs to form — clouds of ice and nitric-acid trihydrate crystals. These clouds appear at altitudes of 15-25 km where temperatures drop below -78°C. Type I PSCs (nitric acid trihydrate) form around -78°C; Type II (water ice) form below -85°C.

(3) Heterogeneous chemistry. PSC crystals provide surfaces for reactions that don't happen efficiently in the gas phase. Specifically, chlorine reservoir species — HCl and ClONO₂ — react on the cloud surfaces to form Cl₂ and HOCl:
  HCl + ClONO₂ → Cl₂ + HNO₃     (on PSC surfaces)
  H₂O + ClONO₂ → HOCl + HNO₃    (on PSC surfaces)
The HNO₃ stays bound to the cloud particles; the chlorine compounds are released as gas. Critically, the cloud particles eventually settle out, removing nitrogen oxides from the gas phase. This means that when chlorine atoms are released later, there's no NO₂ available to reform the chlorine reservoir.

When the Sun returns in spring, UV photolyzes Cl₂ and HOCl into Cl atoms and Cl-containing radicals. These then destroy ozone via the catalytic cycle. The result: dramatic September-October ozone depletion every year.

The Arctic is warmer and more meteorologically disturbed than the Antarctic. The Arctic polar vortex breaks down more easily; PSCs form less consistently. So while Arctic ozone loss does occur (and was severe in 2011 and 2020), it doesn't produce the same persistent "hole" as Antarctic.

**Discovery and scientific consensus.** Mario Molina and F. Sherwood Rowland published the theory of CFC-driven ozone destruction in 1974 (Nature). They calculated that CFCs already in the atmosphere would eventually destroy 7-13% of stratospheric ozone. The chemistry was widely disputed by industry — DuPont initially said the science was "purely speculative" and called for "no overreaction." Paul Crutzen had independently established the ozone-destruction chemistry through different routes (NO₂ from supersonic transports, nitrous oxide).

The Antarctic hole, discovered in 1985, was much bigger than theoretical predictions — about 50% loss compared to predicted 5%. The mystery was that the chemistry models predicted gas-phase reactions, but the polar hole required surface reactions on cloud particles, which weren't in the models. The 1986-87 Airborne Antarctic Ozone Experiment confirmed both the chemistry mechanism and the catalytic role of chlorine.

The 1995 Nobel Prize in Chemistry went to Crutzen, Molina, and Rowland "for their work in atmospheric chemistry, particularly concerning the formation and decomposition of ozone." This is one of the few times the Nobel was awarded for work that prevented a global catastrophe.

**Persistence in the atmosphere.** CFCs are extraordinarily long-lived in the atmosphere. CFC-11 has an atmospheric lifetime of about 52 years; CFC-12 about 100 years; CFC-113 about 85 years. Halons have lifetimes of 25-65 years. This means that even though production stopped in the early 1990s, atmospheric concentrations of CFCs are only slowly declining. The ozone layer's recovery will take decades because the ozone-destroying chlorine is still up there.

**Key numbers to memorize:**
- Stratospheric ozone column normal: ~300 DU (Dobson units)
- Antarctic ozone hole minimum: ~100 DU (in worst years)
- Each Cl atom destroys ~100,000 O₃ molecules
- Bromine atom: ~50× more effective than chlorine
- CFC-11 atmospheric lifetime: ~52 years
- CFC-12 atmospheric lifetime: ~100 years
- 1% decrease in ozone column ≈ 2% increase in non-melanoma skin cancer
- Antarctic hole discovered 1985 (Farman et al., Nature)
- Molina-Rowland theory: 1974 (Nature)
- Nobel Prize: 1995 (Crutzen, Molina, Rowland)`,
    },

    // ============================================================
    // 9.2 REDUCING OZONE DEPLETION
    // ============================================================
    {
      code: '9.2',
      title: 'Reducing ozone depletion',
      content:
`The Montreal Protocol on Substances That Deplete the Ozone Layer is the most successful international environmental treaty in history. Signed in 1987 and ratified by every UN member state — universal ratification, the only treaty with this status — it phased out the production and import of ozone-depleting substances. The recovery of the ozone layer is now observed and is on track to return to 1980 levels by the mid-21st century. Understanding why Montreal succeeded, what it actually did, and how its successor amendments (notably Kigali 2016) extended its reach to climate gases is essential.

**The political moment.** Montreal was negotiated rapidly — only two years after the Antarctic ozone hole was confirmed and well before all the underlying chemistry was understood. The speed was driven by three things working in concert.

First, the science was clear enough that major chemical manufacturers — particularly DuPont, the largest CFC producer — accepted the conclusion. DuPont had initially opposed regulation in the 1970s; by the mid-1980s, internal research at the company confirmed the ozone threat and DuPont publicly supported a phase-out. ICI (UK) and other manufacturers followed.

Second, technically and commercially viable substitutes existed or were in development. CFCs were used in five main applications: refrigeration, aerosol propellants, foam-blowing, solvents, and electronics cleaning. Each had alternative chemistries that could be deployed at reasonable cost. The aerosol problem (which by 1978 was already banned in the US) was solved by switching to hydrocarbon propellants. Foam-blowing could use alternative blowing agents. Refrigeration was the harder problem, but research had begun.

Third, the consequences of inaction were severe enough to mobilize political will. Models predicted that if global CFC production continued growing at the pre-1987 rate of ~5% per year, ozone loss could be catastrophic by 2050 — UV intensities reaching the surface increased by 30-50%, hundreds of millions of additional skin cancers, food-chain disruption, ecosystem damage. The vision of a depleted ozone layer was a manageable threat that, if not addressed, would become an unmanageable disaster.

**The treaty structure.** Montreal applied to a specific list of ozone-depleting substances (Annex A through Annex E, expanded over time). Each substance has a control schedule: developed countries phased out faster than developing countries (a "common but differentiated responsibilities" approach common to environmental treaties).

The original 1987 protocol called for a 50% reduction in CFCs by 2000. Over the next decade, as evidence worsened (the Antarctic hole was bigger than predicted; scientists found CFC effects in northern mid-latitudes; the warming trend was confirmed), the schedule was strengthened through amendments:

- London 1990: full phase-out of CFCs by 2000 in developed countries (10 years earlier than originally planned).
- Copenhagen 1992: faster phase-out; added methyl bromide, methyl chloroform.
- Vienna 1995: enforcement provisions strengthened.
- Montreal 1997: HCFCs (transition substances) added to control list.
- Beijing 1999: methyl bromide phase-out accelerated.

By the late 1990s, CFC production in developed countries was essentially zero. Developing countries had a longer schedule (full phase-out by 2010, with financial assistance for the transition).

**The Multilateral Fund.** Montreal succeeded partly because it included a financial mechanism to help developing countries comply. The Multilateral Fund for the Implementation of the Montreal Protocol pays for technology transfer and demonstration projects in developing countries. As of 2023, it has disbursed about $4.5 billion to ~150 countries. Without this mechanism, developing countries would have lacked the resources to switch to ozone-safe alternatives, and global emissions would have continued.

**Trade sanctions.** Article 4 of the protocol prohibits trade in controlled substances (and products containing them) with non-parties. This created strong compliance incentives: a country could not opt out without losing access to global markets for refrigeration equipment, electronics, etc. The trade-sanction mechanism is widely credited with achieving universal ratification.

**The substitutes.**

First generation: hydrochlorofluorocarbons (HCFCs). Similar to CFCs but with a hydrogen atom, which makes them susceptible to attack by OH radicals in the troposphere. So most HCFCs break down before reaching the stratosphere. They have an ozone-depletion potential (ODP) of 0.01-0.1 relative to CFC-11 (ODP = 1.0). Much less damaging but not zero. HCFCs were a transitional technology. The protocol calls for their phase-out in developed countries by 2020 and in developing countries by 2030.

Second generation: hydrofluorocarbons (HFCs). Contain only hydrogen, fluorine, and carbon — no chlorine, so they have zero ozone-depletion potential. HFCs filled the gap left by HCFCs in refrigeration and air conditioning. However, HFCs are extremely potent greenhouse gases. HFC-134a (used in car air conditioning until recently) has a global warming potential of 1,430 — one ton of HFC-134a is climatically equivalent to 1,430 tons of CO₂. As HFC use grew globally, total HFC emissions were on track to become a major contributor to climate change.

**The Kigali Amendment (2016).** Negotiated in Rwanda, Kigali brought HFCs under the protocol. The genius of Kigali was framing this as continuation of Montreal's mission: HFCs replaced CFCs to protect ozone, but at the cost of climate damage. Both problems can be addressed by one treaty.

Kigali calls for phase-down (not phase-out, since some uses lack good substitutes) of HFCs:
- Developed countries: 10% reduction by 2019, 85% reduction by 2036.
- Developing countries (Group 1): 10% reduction by 2029, 80% reduction by 2045.
- Developing countries with high HFC use (Group 2: India, Iran, Iraq, Pakistan, others): freeze by 2028, 85% reduction by 2047.

By 2050, HFC production is projected to be 80-85% lower than the 2011-2013 baseline. If Kigali is fully implemented, it is expected to avoid 0.4 °C of warming by 2100 — a major climate win achieved through an ozone-treaty amendment.

**Third generation substitutes.** Hydrofluoroolefins (HFOs) and natural refrigerants. HFOs have GWPs of 1-4 (essentially negligible compared to HFC-134a's 1,430). They're being deployed in new automotive air conditioning (HFO-1234yf, GWP 1) and other applications. Natural refrigerants — ammonia (R-717), CO₂ (R-744), hydrocarbons like propane (R-290) and isobutane (R-600a) — are increasingly used in industrial refrigeration and some appliances. Each has trade-offs: ammonia is toxic but efficient; CO₂ requires high pressures; hydrocarbons are flammable.

**Observed recovery.** UNEP and WMO publish a Scientific Assessment of Ozone Depletion every four years. The 2022 assessment (with updates in 2024) confirms that the Antarctic ozone hole is on track to return to 1980 levels by approximately 2066. The global ozone layer is on track to recover by ~2040. The Arctic recovery is also progressing.

The recovery is slow because of CFC longevity. CFC-11 has an atmospheric lifetime of 52 years; CFC-12, 100 years. Even though production stopped decades ago, the existing atmospheric load is only slowly removed by chemical destruction. The lag between emission cessation and atmospheric concentration decline is decades.

In 2018, atmospheric measurements suggested an unexpected slowdown in the decline of CFC-11. Investigation traced this to illegal production in China; the rogue facilities were shut down in 2019 and CFC-11 decline has resumed. This episode demonstrates that compliance monitoring is essential.

**Why Montreal succeeded while climate treaties have struggled.** Several reasons, useful to compare against climate-treaty politics.

(1) Smaller number of substances and producers. CFCs were made by a handful of companies in a few countries; the negotiation was manageable. Climate gases come from every economy.

(2) Clear and tractable substitutes existed. Refrigeration could switch chemistries without fundamentally restructuring economies. Climate policy requires transforming energy systems, transportation, agriculture, industry.

(3) Effects were observable on short timescales. The Antarctic ozone hole appeared each spring and was visible in satellite data. Climate change is real but distributed; the same "you can see it happen" moment is harder.

(4) The treaty included financial mechanisms (Multilateral Fund) to help developing countries comply. Climate treaties have similar funds (Green Climate Fund) but at smaller scale relative to need.

(5) Trade sanctions against non-parties created strong compliance incentives. Climate treaties have not used trade sanctions to the same degree.

(6) Industry could be persuaded once substitutes were available. CFC manufacturers ultimately backed Montreal because they could profit from selling alternatives. Fossil-fuel companies face a more existential transition.

**Important distinction: ozone depletion ≠ climate change.** This deserves repetition. The ozone hole is depletion of stratospheric O₃ by chlorine from CFCs. Climate change is greenhouse-gas accumulation in the troposphere. They share some chemistry (CFCs are also greenhouse gases) and some politics (international treaties), but the underlying problems, time-scales, geographical signatures, and mitigation routes are distinct. Recovery of the ozone layer is happening; resolving climate change requires much harder structural change.

**Key facts to remember:**
- Montreal Protocol signed 1987; universal ratification by every UN member state
- 1995 Nobel Prize to Crutzen, Molina, Rowland for ozone chemistry
- Kigali Amendment (2016) phases down HFCs; expected to avoid ~0.4 °C of warming
- Antarctic ozone hole expected to recover by ~2066
- Global ozone layer expected to recover by ~2040
- Multilateral Fund has disbursed ~$4.5 billion since inception
- CFC-11 atmospheric lifetime ~52 years; CFC-12 ~100 years (why recovery is slow)`,
    },

    // ============================================================
    // 9.3 THE GREENHOUSE EFFECT
    // ============================================================
    {
      code: '9.3',
      title: 'The greenhouse effect',
      content:
`The greenhouse effect is the most important concept in climate science. It explains why Earth's surface is warm enough for liquid water (~15 °C average) instead of frozen (~–18 °C), why Venus is hot enough to melt lead (~470 °C), and why human emissions of CO₂ and other gases are warming the planet. Mastering this concept means understanding three layered ideas: (1) how energy moves in and out of the Earth system; (2) why some gases interact with infrared radiation while others don't; and (3) how adding greenhouse gases changes the energy balance.

**Solar input.** The Sun is a black body at about 5,800 K. Wien's displacement law says peak emission wavelength is λ_max = 2,898 μm·K / T, so the Sun peaks near 0.5 μm — visible light. The total solar power per area at Earth's distance is called the solar constant, S₀ ≈ 1,361 W/m² (measured by satellites; varies slightly over the 11-year solar cycle and over orbital eccentricity). This is the energy delivered to a square meter at the top of Earth's atmosphere when facing the Sun.

But Earth doesn't face the Sun uniformly. The planet intercepts solar radiation as a circular disk of area π R² (geometric cross-section) and re-radiates as a full sphere of area 4π R². So the average incoming solar power per square meter of Earth's surface is S₀ × (π R² / 4π R²) = S₀ / 4 ≈ 340 W/m². This factor of 4 appears in every energy-balance calculation in climate science and is the single most-used number in Earth-system science.

**Albedo.** Not all of the incoming 340 W/m² is absorbed. About 30% is reflected back to space. This fraction is Earth's albedo (α ≈ 0.30). Components of albedo: clouds reflect ~20 percentage points (the biggest single component); ice and snow reflect another 4–5 points; ocean and dark land surfaces reflect another 5 points; atmospheric aerosols a few more. Albedo varies regionally and over time. Snow has high albedo (~0.9); fresh sea ice ~0.7; ocean water ~0.06; tropical forest ~0.13; desert ~0.4. Climate change alters albedo: melting sea ice lowers albedo (positive feedback), shifting forests can lower or raise depending on the biome.

So the absorbed solar power per square meter is (1 − α) × S₀/4 = 0.70 × 340 = 238 W/m². This is the energy that must be radiated away for the planet to be in thermal equilibrium.

**Outgoing radiation.** Earth radiates energy back to space as thermal infrared (longwave) radiation. At Earth's surface temperature (~288 K), Wien's law gives peak wavelength near 10 μm — far infrared, invisible to the human eye but felt as heat. The Stefan-Boltzmann law says the total power radiated per area by a blackbody is P/A = σT⁴, where σ = 5.67 × 10⁻⁸ W/m²/K⁴ is the Stefan-Boltzmann constant and T is absolute temperature.

For equilibrium, the power coming in must equal the power going out: (1 − α) × S₀/4 = σT⁴. Solving for T: T = ((1 − α) × S₀ / 4σ)^(1/4). Plugging in numbers: T = (238 / 5.67 × 10⁻⁸)^(1/4) = (4.20 × 10⁹)^(1/4) ≈ 255 K, or –18 °C. This is Earth's "effective radiating temperature."

**The 33 °C bump.** Earth's actual average surface temperature is about 288 K (+15 °C). The 33 °C difference between the effective radiating temperature and the surface temperature is the natural greenhouse effect. Without this effect, Earth would be a frozen ball — ice down to the tropics, no liquid water at the surface, no life as we know it.

**Mechanism.** How do greenhouse gases produce this 33 °C bump? Visible solar radiation passes mostly unimpeded through the atmosphere to the surface (the atmosphere is "transparent" to visible light). The surface heats up and emits thermal infrared upward. Some of that IR is absorbed by greenhouse-gas molecules in the air. The excited molecules re-emit IR in random directions — some up to space, some down back to the surface, some sideways. The downward fraction is "back radiation" and adds energy to the surface beyond what the Sun delivers directly. Equilibrium is re-established at a higher surface temperature.

**Quantum mechanics of absorption.** Why do some gases absorb IR while others don't? The answer is in molecular vibrations. A molecule has discrete vibrational states; absorbing a photon promotes the molecule from one state to a higher one. The selection rule for IR absorption: the molecule's electric dipole moment must change during the vibration. This requires asymmetric mass distribution or polarity.

Diatomic homonuclear molecules — N₂, O₂, H₂ — have two identical atoms bonded together. Their only vibrational mode is a symmetric stretch (bond length oscillating). Symmetric vibration doesn't change the dipole moment (it's always zero by symmetry). So these molecules don't absorb IR. This is why the bulk of the atmosphere (78% N₂, 21% O₂) is transparent to thermal infrared.

CO₂ is linear (O=C=O) and has three vibrational modes: symmetric stretch (both C–O bonds oscillating in unison; doesn't change dipole — not IR-active), asymmetric stretch (one bond stretching while the other compresses; changes dipole — IR-active at 4.3 μm), and two degenerate bending modes (the molecule flexing into and out of bent shape; changes dipole — IR-active at 15 μm). The 15-μm bending band is the most important for climate because Earth radiates strongly at those wavelengths. CO₂ absorbs hard at 15 μm and at 4.3 μm.

Water vapor (H₂O) is non-linear (bent) and has three vibrational modes, all IR-active. H₂O absorbs across a much broader range than CO₂ — much of the IR spectrum has water vapor absorption. This is why water vapor is the dominant natural greenhouse gas at any given moment.

Methane (CH₄) is tetrahedral and has nine vibrational modes, four of which are IR-active. Strong absorption around 3.3 and 7.7 μm.

**Atmospheric windows.** There are wavelengths where no significant atmospheric molecule absorbs. The biggest window sits roughly 8–12 μm — what we call the "atmospheric window" or "atmospheric IR window." Through this window, IR radiation escapes directly from the surface to space. Without this window, Earth would be uninhabitably hot — as hot as Venus. With it, we have the natural greenhouse plus a clear escape valve.

Why does the window matter for climate change? Any greenhouse gas that absorbs IN the window closes part of it, and has outsized warming impact per molecule. CFCs, HFCs, SF₆, and ozone (in the troposphere) all absorb in the window. This is why their global warming potentials are so high. CFCs have GWPs of 5,000–10,000+; SF₆ has 23,500. They're closing the only easy exit for thermal IR.

**Beer-Lambert in the atmosphere.** The fraction of light that passes through an absorbing medium is e^(−τ), where τ is the optical depth (proportional to concentration × path length × absorption strength). When τ is large, the medium is "optically thick" — most of the photons are absorbed. When τ is small, most pass through.

For CO₂'s 15 μm band in the current atmosphere, the troposphere is already optically thick — essentially all of the IR at 15 μm is absorbed within a few hundred meters of the surface. So why does adding more CO₂ make any difference? This is the most-misunderstood point in climate physics, often called the "saturation argument" by climate skeptics.

The answer: it doesn't matter that the band is saturated near the surface — what matters is the altitude at which IR finally escapes to space. As CO₂ concentration rises, the atmosphere becomes optically thick higher up; the "emission altitude" rises. Because the temperature drops with altitude in the troposphere (the lapse rate is about –6.5 K per km), the emission level moves to colder air. Cold air emits less (σT⁴ falls fast with T). To maintain energy balance with the unchanged incoming sun, the surface must warm enough that the top of the radiating column emits at the same total rate. Even when a band is "saturated" at the surface, adding more gas pushes the radiating altitude up and forces the surface to warm.

**Lapse rate and the cold top.** The troposphere has a temperature lapse rate of about –6.5 K per km. So if the emission level rises by 100 m, the emitting layer is 0.65 K colder. To re-balance, the surface must warm by about 0.65 K. This is the operational mechanism by which adding CO₂ warms the surface. (A more sophisticated derivation accounts for the lapse rate adjustments themselves — a positive feedback.)

**Radiative-convective equilibrium.** A simple but useful climate model: the atmosphere has absorbed solar at the surface, radiative cooling at the emission layer, and convective heat transport in between. The lapse rate is set by convection (in moist air, about –6.5 K/km; in dry air, –9.8 K/km — the moist adiabatic vs dry adiabatic lapse rates). The emission level depends on greenhouse-gas concentrations. Putting these together gives a reasonable approximation of Earth's actual temperature profile.

**The Earth Energy Budget.** A canonical diagram. Top of atmosphere: 340 W/m² incoming, 100 W/m² reflected, 240 W/m² absorbed. Surface: receives ~165 W/m² of direct solar (cloud-passing) and ~340 W/m² of downward thermal IR from the atmosphere (back radiation). Surface emits ~398 W/m² (σT⁴ at 288 K). The surface gives up energy as ~75 W/m² latent (evapotranspiration), ~25 W/m² sensible heat (convection), and ~340 W/m² thermal IR (with ~40 W/m² escaping through the window directly to space; the rest absorbed and re-emitted by the atmosphere). The atmosphere absorbs the surface's IR and the latent + sensible fluxes; it emits ~240 W/m² out to space and ~340 W/m² down to the surface. Net: balanced — but only because of the back radiation. Without back radiation, the surface would lose 398 W/m² and receive only ~165 W/m². It would cool catastrophically.

**Tropopause-level forcing.** When we talk about "radiative forcing" in W/m², we mean the change in net radiative flux at the tropopause (top of the troposphere, about 12 km) after holding the surface and tropospheric temperatures fixed but letting the stratosphere adjust. The IPCC AR6 estimates the net anthropogenic radiative forcing since 1750 at about +2.7 W/m² (with uncertainty range of +1.96 to +3.48). Of this, CO₂ alone contributes about +2.16 W/m²; CH₄ about +0.54; N₂O about +0.21; halocarbons about +0.41; tropospheric ozone about +0.47; aerosols about –1.1 (cooling — they reflect sunlight); volcanic aerosols and solar variability are minor on multi-decade scales.

**Historical discovery.** The greenhouse effect is one of the older results in physics. Joseph Fourier (1827) first proposed that Earth was warmer than it should be from solar heating alone. John Tyndall (1859) demonstrated experimentally that water vapor, CO₂, and methane absorb IR — actual laboratory measurements with gas tubes. Svante Arrhenius (1896) was the first to calculate the climate sensitivity to doubled CO₂; he got 5–6 °C, surprisingly close to modern estimates. He thought it would take millennia and would be a benefit to humanity. The modern era began with Roger Revelle (1957) showing the ocean couldn't absorb CO₂ as fast as previously assumed, and Charles Keeling (1958) starting the Mauna Loa record.

**Fingerprints of greenhouse warming.** The greenhouse effect predicts specific patterns of warming distinct from natural causes (solar variability, volcanic activity, internal variability):
- Tropospheric warming + stratospheric cooling: greenhouse gases warm the troposphere by trapping outgoing IR, but the stratosphere cools because less IR reaches it from below to be absorbed and re-radiated. This vertical pattern is a robust fingerprint of greenhouse forcing.
- Night warming faster than day: greenhouse warming raises nighttime minimum temperatures more than daytime maxima, because daytime is dominated by direct solar heating while nights are dominated by IR loss to space. Observation: nighttime warming rates are about 30% faster than daytime.
- Faster warming at high latitudes (Arctic amplification): ice-albedo feedback amplifies warming at high latitudes.
- Vertical pattern in the tropics: greenhouse warming amplifies in the mid-troposphere relative to the surface. Hard to measure directly; signal still ambiguous.
These fingerprints distinguish greenhouse warming from solar (which would heat the whole atmospheric column uniformly) or albedo (which would have different latitudinal patterns).

**Planetary comparisons.**
- Mars: thin atmosphere (~1% Earth's surface pressure), almost entirely CO₂. Very weak greenhouse effect (~5 °C). Effective temperature ~210 K, surface ~210 K. The CO₂ atmosphere is too thin to matter.
- Earth: dense atmosphere, ~0.04% CO₂, ~1–4% H₂O (varies with location). Natural greenhouse 33 °C, lifts surface from 255 to 288 K.
- Venus: dense atmosphere (90× Earth's surface pressure), 96.5% CO₂. Massive greenhouse effect of ~500 °C. Effective temperature ~230 K (much higher albedo than Earth, 0.77 from cloud cover); surface ~735 K. Venus runaway greenhouse is what happens when atmospheric water can no longer be returned by cool surface and is photolyzed in upper atmosphere.

The Venus case is sometimes raised as a worst-case Earth scenario; it isn't physically achievable from current CO₂ levels (Earth's water content and Sun-distance are wrong for runaway). But Venus illustrates that greenhouse effects can scale dramatically.

**Numbers to memorize:**
- Solar constant S₀ = 1,361 W/m²
- Stefan-Boltzmann σ = 5.67 × 10⁻⁸ W/m²/K⁴
- Earth's albedo α ≈ 0.30
- Average insolation S₀/4 ≈ 340 W/m²; absorbed ~238 W/m²
- Effective temperature 255 K (–18 °C)
- Actual surface temperature 288 K (+15 °C)
- Natural greenhouse: +33 °C
- Current anthropogenic radiative forcing: ~+2.7 W/m²
- CO₂ radiative forcing per doubling: 3.7 W/m²
- Lapse rate (troposphere): –6.5 K/km`,
    },

    // ============================================================
    // 9.4 INCREASES IN GREENHOUSE GASES
    // ============================================================
    {
      code: '9.4',
      title: 'Increases in the greenhouse gases',
      content:
`Three greenhouse gases dominate human-caused climate change: carbon dioxide (CO₂), methane (CH₄), and nitrous oxide (N₂O). Each has a distinct source profile, atmospheric lifetime, and warming potential per molecule. A fourth category — fluorinated gases (HFCs, PFCs, SF₆, NF₃) — is much smaller in mass terms but disproportionately powerful per molecule. And a fifth contributor, water vapor, is the largest single greenhouse gas at any moment but functions as a feedback rather than a forcing. Understanding sources, sinks, and lifetimes is essential to climate policy.

**Carbon dioxide (CO₂): the master variable.** Pre-industrial concentration was 280 parts per million (ppm), as measured in ice cores from Greenland and Antarctica. The Mauna Loa Observatory in Hawaii has measured atmospheric CO₂ continuously since 1958, producing the famous Keeling Curve — a record showing both the seasonal sawtooth (Northern Hemisphere photosynthesis pulling CO₂ down in summer, releasing it in winter) and the steady upward trend.

Today's concentration: ~425 ppm and rising at about 2.5 ppm per year. The 51% increase since 1850 is the single most important number in climate science.

Sources of anthropogenic CO₂:
- Fossil-fuel combustion: ~75% of emissions. Coal (28% of energy), oil (32%), natural gas (24%) — all release CO₂ when burned. Coal releases the most CO₂ per joule of energy (~95 g CO₂/MJ); oil less (~70 g CO₂/MJ); natural gas least (~55 g CO₂/MJ).
- Land-use change: ~25% of emissions. Tropical deforestation (Amazon, Indonesia, Congo Basin) releases carbon stored in vegetation and soil. About 7-10 million hectares of forest are lost annually; net flux is reduced by reforestation in temperate latitudes.
- Cement production: ~4% of emissions. The chemical reaction CaCO₃ → CaO + CO₂ releases CO₂ when limestone is calcined to make clinker.

Total annual global emissions: about 37 gigatonnes (Gt) of CO₂ per year (2024), or ~10 Gt of carbon equivalent.

Sinks. Not all emitted CO₂ stays in the atmosphere. About half is absorbed by natural sinks each year:
- Oceans take up roughly 25% — physical dissolution (Henry's Law) plus biological uptake by phytoplankton. The ocean sink is observable as ocean acidification (subunit 9.7).
- Terrestrial sinks (forests, grasslands, soils, peatlands) absorb another ~30%. Northern temperate and boreal forests are net sinks; tropical forests are nearly balanced (sinks if not deforested; sources if cleared).
- The remainder (~45%) stays in the atmosphere and accumulates. This "airborne fraction" has been roughly constant at 45% for decades — a remarkable feature given how much emissions have grown.

The airborne fraction matters because it sets the relationship between emissions and atmospheric concentration. Of the ~37 Gt CO₂ emitted in 2023, about 16 Gt stayed in the atmosphere, raising concentration by ~2.5 ppm. If sinks weaken (as warming reduces ocean CO₂ solubility and stresses forests), the airborne fraction will rise.

**CO₂ atmospheric lifetime.** The most-misunderstood concept in climate science. CO₂ doesn't have a single lifetime like a radioactive isotope does. Instead, a CO₂ pulse has multi-timescale decay:
- About 50% of the pulse is removed within ~30 years (rapid ocean uptake, fast biospheric absorption).
- About 20% remains in the atmosphere for 1,000+ years (slow ocean mixing into deep waters).
- About 7% remains for tens of thousands of years, removed only by silicate weathering on geologic timescales.

The "effective lifetime" of CO₂ for policy purposes is often quoted as 100 years, but the long tail is what makes CO₂ a multi-millennium problem. Cumulative emissions matter, not just current rates — the carbon dumped into the atmosphere this decade will affect Earth's energy balance for centuries.

**Methane (CH₄): the most potent short-term forcer.** Pre-industrial concentration: ~700 parts per billion (ppb). Today: ~1,930 ppb. The 175% increase is the largest fractional change of any greenhouse gas.

Sources of anthropogenic methane:
- Enteric fermentation in livestock (cows, sheep, goats, buffalo): ~30% of human emissions. Ruminants harbor methanogenic archaea in their stomachs that produce CH₄ during digestion. A single dairy cow emits about 80-100 kg of CH₄ per year.
- Rice paddies: ~10% of human emissions. Flooded paddies create anaerobic conditions where methanogens thrive.
- Landfills and wastewater treatment: ~10%. Anaerobic decomposition of organic waste produces CH₄.
- Coal mining: ~8%. Methane trapped in coal seams is released during extraction.
- Oil and gas operations: ~10%. Methane leakage during drilling, processing, and pipeline transport. Recent satellite monitoring (MethaneSAT, GHGSat) has shown leakage is much larger than industry self-reports suggest.
- Biomass burning: ~5%. Wildfires and crop residue burning.

Natural sources (~40% of total): wetlands (the largest natural source), termites, geological seeps, oceans.

**Methane lifetime: short, with huge implications.** CH₄ has an atmospheric lifetime of about 12 years. It's removed primarily by reaction with hydroxyl radicals (OH·) in the troposphere:
  CH₄ + OH → CH₃· + H₂O    (initial attack)
  CH₃ → eventually CO₂ + H₂O (after additional reactions)

The hydroxyl radical is sometimes called the atmosphere's "cleaning agent" — it removes many trace gases. The reservoir of OH is regenerated by photochemistry involving water vapor and ozone.

The short methane lifetime has two huge implications:
(1) Cutting methane emissions reduces atmospheric concentration on a decade timescale. If we stopped emitting methane tomorrow, the atmospheric concentration would fall by roughly half within ~12 years (one e-folding). This is the fastest available climate lever.
(2) Methane is much more potent per molecule than CO₂, but only for a limited time. The "global warming potential" (GWP) compares cumulative warming over a time horizon. CH₄ has GWP-100 = 28 (one tonne CH₄ = 28 tonnes CO₂eq over 100 years). GWP-20 = 82 (over 20 years).

The choice of time horizon matters for policy framing. If we want to slow warming in the next 30 years, methane reduction is the highest-leverage move available. If we want to address long-term warming, CO₂ matters more.

**Methane policy.** The Global Methane Pledge, announced at COP26 (2021) and now signed by 150+ countries, commits to cutting global methane emissions 30% by 2030 (relative to 2020). Strategies: leak detection and repair at oil/gas facilities; feed additives that reduce ruminant methanogenesis; rice paddy water management (mid-season drainage cuts methane by 30-50%); landfill gas capture (and combustion to CO₂, which is 28× less potent).

Recent satellite observations have shown methane emissions from oil and gas operations are roughly 2× larger than official inventories. EPA's 2023 OOOOb/c rule requires regular leak detection. Permian Basin operations particularly target for monitoring and remediation.

**Nitrous oxide (N₂O).** Pre-industrial: ~270 ppb. Today: ~335 ppb. A 24% increase. Smaller fractional change than CO₂ or CH₄, but extremely potent.

Sources (~50% anthropogenic):
- Synthetic nitrogen fertilizers on agricultural soils: largest source (~50% of anthropogenic). Nitrification and denitrification of applied nitrogen produces N₂O as a byproduct.
- Manure management: 15%.
- Combustion (cars, power plants): 10%.
- Industrial processes (nitric acid, adipic acid production): 10%.

Lifetime: ~114 years. 100-year GWP of 273.

N₂O is troubling for two reasons. First, its lifetime is long (a CO₂-like multi-decade problem). Second, it's also an ozone-depleting substance — N₂O reaches the stratosphere where it converts to NO, which catalytically destroys ozone (similar to chlorine but slower). N₂O is now the largest ozone-depleting substance being emitted, having overtaken CFCs.

**Fluorinated gases.** Synthetic compounds. Tiny atmospheric concentrations but extreme GWPs.

- Hydrofluorocarbons (HFCs): used in refrigeration, air conditioning (replacing CFCs and HCFCs). HFC-134a has GWP-100 = 1,430. Kigali Amendment phasing them down.
- Perfluorocarbons (PFCs): byproducts of aluminum smelting and semiconductor manufacture. GWP-100 of 7,400-12,200.
- Sulfur hexafluoride (SF₆): used in high-voltage electrical insulation, magnesium production. GWP-100 of 23,500 — one of the most powerful greenhouse gases per molecule. Atmospheric concentrations rising fast.
- Nitrogen trifluoride (NF₃): semiconductor manufacture. GWP-100 of 17,200.

Total F-gas contribution to current radiative forcing: about 0.4 W/m² — significant. Growing fast.

**Water vapor: feedback, not forcing.** Water vapor (H₂O) is the single largest contributor to the greenhouse effect at any moment in time — accounting for 50-70% of the natural greenhouse. So why isn't it the focus of climate policy?

Because atmospheric water vapor is not a direct climate driver. The atmosphere's water content depends on temperature, not on emissions. Clausius-Clapeyron: warmer air holds more water vapor (about 7% more per °C). When CO₂ warms the surface, more water evaporates, which adds more greenhouse effect, which warms more — a positive feedback that roughly doubles the warming from CO₂ alone. Water vapor concentrations adjust quickly (days to weeks) to changes in temperature.

This is what we call "feedback" vs "forcing" in climate science. Forcings (CO₂, CH₄, N₂O) are externally imposed changes that drive the system. Feedbacks (water vapor, ice-albedo, clouds) are responses to those forcings that amplify or dampen the result. Policy can affect forcings; feedbacks happen automatically once forcings change.

Stratospheric water vapor (from CH₄ oxidation and aircraft emissions) does have a direct radiative effect, but it's small (~0.05 W/m²).

**Ozone.** Tropospheric ozone (created by NOx + VOCs + sunlight, mostly from human emissions) is a greenhouse gas with current radiative forcing of about 0.4 W/m². Different chemistry than stratospheric ozone (which protects against UV).

**Aerosols: a cooling counter-balance.** Sulfate aerosols, organic carbon, dust, sea spray. Industrial sulfate (from coal-burning) reflects sunlight, cooling the planet. Without anthropogenic aerosols, current warming would be about 0.5-1.0 °C greater than observed. Air-quality regulations that reduce aerosol pollution thus inadvertently accelerate warming — the so-called "aerosol unmasking" effect.

**Where the numbers come from.** Atmospheric concentrations are measured by:
- NOAA Global Monitoring Laboratory and partner networks worldwide (~50 stations).
- Ice cores from Greenland (Camp Century, NEEM, GRIP) and Antarctica (Dome C, EPICA) for pre-industrial concentrations going back 800,000 years.
- Satellite missions: OCO-2, OCO-3, GOSAT, MethaneSAT, TROPOMI for spatially-resolved measurements.

Ice cores show CO₂ has never been above 300 ppm during the past 800,000 years. The 425 ppm of 2024 is unprecedented in the entire ice-core record. To find CO₂ levels comparable to current we need to look at the Pliocene (~3-5 million years ago) when CO₂ was ~400-450 ppm and sea level was 15-25 meters higher than today.

**Why small concentrations matter.** A common skeptical argument: "CO₂ is only 0.04% of the atmosphere — how can it matter?" The answer: greenhouse gases work by absorbing specific IR wavelengths. The relevant question isn't the mass fraction but the absorption. At current concentrations, CO₂ absorbs essentially all of the IR in its 15 μm band over short atmospheric paths. The effect on the energy budget scales logarithmically with concentration — each doubling adds ~3.7 W/m² of forcing. So even small fractional increases at high concentrations continue to matter.

**Summary numbers:**
- CO₂: 280 → 425 ppm (51% increase); ~37 Gt/yr emissions; ~half absorbed by sinks
- CH₄: 700 → 1,930 ppb (175%); ~570 Mt/yr emissions; 12-yr lifetime; GWP-100 = 28
- N₂O: 270 → 335 ppb (24%); ~10 Mt/yr emissions; 114-yr lifetime; GWP-100 = 273
- HFC-134a: GWP-100 = 1,430. SF₆: 23,500. Kigali phasing them down.
- Net current anthropogenic radiative forcing: ~+2.7 W/m²
- Ice-core record: CO₂ has not been above 300 ppm in 800,000 years. Current 425 ppm is geological-scale anomaly.`,
    },

    // ============================================================
    // 9.5 GLOBAL CLIMATE CHANGE
    // ============================================================
    {
      code: '9.5',
      title: 'Global climate change',
      content:
`Anthropogenic greenhouse-gas accumulation has produced measurable warming. The 2024 global mean surface temperature was about 1.5 °C above the 1850-1900 baseline — the standard "pre-industrial" reference. This is the largest and fastest sustained warming in the geologic record of human civilization. To understand what this means and what it implies, we need to look at the instrumental record, the spatial pattern, attribution science, climate sensitivity, and observed impacts.

**The instrumental temperature record.** Surface temperatures have been measured by thermometers at thousands of land stations since the 1850s, on ships and buoys at sea, and from satellites since 1979 (microwave sounding units measuring atmospheric temperature). Four major synthesis datasets are produced independently: NASA GISS (Goddard Institute for Space Studies), NOAA NCEI (National Centers for Environmental Information), Hadley Centre / UEA HadCRUT (UK), and Berkeley Earth (independent academic). They use overlapping but distinct station networks, different methods to fill data gaps, different ocean-data treatments. Despite these differences, the four agree closely on the rate and pattern of warming. Disagreement is mostly at short timescales (a few hundredths of a degree); the long-term trends are robust to methodology.

The record shows distinct periods. A relatively flat baseline from 1850 to 1910. Modest warming 1910–1945 (about 0.4 °C, driven partly by greenhouse-gas accumulation, partly by reduced volcanic activity, partly by recovery from late-19th-century cool period). A flat or slightly cooling period 1945–1975 — this is the "industrial-aerosol cooling" period, when sulfate aerosols from coal combustion in the developed world reflected enough sunlight to partly cancel the greenhouse warming. After 1975, aerosols were reduced (Clean Air Act, scrubber technology) and CO₂ continued rising. The result: rapid sustained warming, with each decade hotter than the last since 1980. The 2010s were the warmest decade on record; the 2020s are on track to exceed them.

**Pre-instrumental records.** Before 1850, temperatures must be reconstructed from proxies — natural archives that record temperature indirectly. Tree rings record growing-season temperature and precipitation (widths and density). Ice cores preserve air bubbles trapped at the time of snow accumulation, providing direct measurements of past atmospheric composition and indirect temperature via oxygen and deuterium isotopes. Speleothems (cave formations) record temperature through isotope ratios in their calcite layers. Coral skeletons record sea-surface temperature.

The synthesis is famous: Michael Mann's "hockey stick" (1998, updated since by many groups including IPCC AR6). For the past 2,000 years, Northern Hemisphere temperatures show roughly flat variation of about ±0.3 °C (the Medieval Climate Anomaly and the Little Ice Age are real but small). Beginning in the 19th century, the curve turns sharply upward — the "blade" of the hockey stick. Reconstructions for the last 800,000 years from Antarctic ice cores show CO₂ has never exceeded ~300 ppm during interglacial peaks. Current 425 ppm is well above the entire ice-age record.

**Spatial pattern of warming.** The warming is unevenly distributed across the Earth's surface, with implications for both attribution and impacts.

Land vs ocean. Land has warmed about 1.6 °C since pre-industrial; oceans about 0.9 °C. The difference is mainly because of heat capacity: oceans absorb more heat per degree, and they mix that heat downward into the deep ocean. Land surfaces respond faster.

Northern vs Southern Hemisphere. North has warmed faster (~1.5 °C vs ~1.1 °C). This is because the Northern Hemisphere has more land area (and land warms faster) and because of Arctic amplification.

Arctic amplification. The Arctic has warmed about 3 °C since pre-industrial — roughly twice the global average rate. Driven by sea-ice loss (ice-albedo feedback), reduced ice insulation between cold ocean and atmosphere, and other regional factors. The signature is consistent with model predictions for greenhouse-driven warming.

Vertical pattern. In the lower troposphere (where weather happens), greenhouse gases warm the atmosphere. In the stratosphere (above 12 km), the same gases cool the atmosphere — because less outgoing IR reaches them from below to be re-absorbed. Stratospheric cooling is observed and is one of the strongest fingerprints of greenhouse warming, distinguishing it from solar variability (which would warm both troposphere and stratosphere) or albedo changes.

Diurnal pattern. Greenhouse warming is faster at night than during the day, because nights are dominated by IR cooling to space (which greenhouse gases trap) while days are dominated by direct solar heating. Observation: nighttime temperatures rising about 30% faster than daytime. Consistent with greenhouse driving.

These spatial patterns (vertical, latitudinal, diurnal) are the "fingerprints" of greenhouse warming — they match the predicted signatures and are inconsistent with alternative drivers (changes in solar output, internal variability, volcanic activity).

**Attribution science.** Distinguishing the human-caused warming from natural variability is a central scientific task. The method involves running climate models with and without human emissions and comparing the simulated outcomes to observations.

Two questions:
1. Detection: Has the climate changed beyond what natural variability alone could produce? IPCC AR6 detection: yes, with virtually certain confidence.
2. Attribution: What fraction of the change is due to human activities? IPCC AR6: human activities have caused approximately all of the observed warming since 1850-1900. Natural drivers (solar, volcanic, internal variability) have caused essentially zero net warming — they cancel out at the global level over decades.

The methods include: pattern recognition (matching observed spatial and vertical patterns to fingerprints of different forcings), optimal detection (statistical projection of observed change onto patterns expected from each forcing), and now extreme-event attribution. The Otto et al. World Weather Attribution group routinely quantifies how much human warming altered the probability of specific extremes (e.g., the 2003 European heat wave was 10× more likely with anthropogenic warming; the 2021 Pacific Northwest heat dome was virtually impossible without it).

**Climate sensitivity.** The most important question in climate science is: how much will warming continue? This is "climate sensitivity" — the warming per unit forcing. Two key metrics:

Equilibrium Climate Sensitivity (ECS) is the warming after the entire system fully equilibrates to a doubling of CO₂ (concentration of ~560 ppm vs 280 ppm pre-industrial). IPCC AR6 central estimate: ~3 °C, with "likely" range 2.5–4 °C and "very likely" range 2.0–5.0 °C. Equilibrium would take centuries, perhaps millennia (the deep ocean is slow).

Transient Climate Response (TCR) is the warming at the moment of CO₂ doubling under a steady 1%/yr increase. AR6 central estimate: ~1.8 °C, likely 1.4–2.2 °C. TCR is the more relevant number for 21st-century policy because it accounts for the lag from ocean uptake.

The derivation of climate sensitivity:
- CO₂ doubling produces radiative forcing of ΔF = 5.35 × ln(2) ≈ 3.7 W/m².
- Planck feedback parameter (the response without other feedbacks, just the Stefan-Boltzmann response of a warmer Earth) is λ_planck ≈ 3.2 W/m²/K. So no-feedback temperature change is ΔF/λ_planck ≈ 1.2 K.
- Feedbacks roughly triple this to ~3 K, the central ECS.

The feedbacks:
- Water vapor: warming evaporates more water; water vapor is a greenhouse gas; warming begets warming. Adds about +1.5 K per CO₂ doubling. Largest positive feedback.
- Ice-albedo: warming melts ice, exposes dark land or ocean, lowers albedo, absorbs more solar. Adds ~0.3 K. Robust positive feedback.
- Lapse-rate feedback: changes in the vertical temperature profile. Slightly negative.
- Cloud feedback: clouds reflect sunlight (cooling) and absorb IR (warming); net effect depends on cloud type and altitude. Best estimate: +0.4 K, but uncertainty is the biggest source of uncertainty in total ECS. Likely positive overall.
- Biogeochemical feedbacks: warmer permafrost releases CH₄ + CO₂; warmer ocean releases CO₂; longer growing seasons absorb more CO₂; some feedbacks positive, some negative. Generally treated separately from "fast" feedbacks.

Paleoclimate constraints on ECS use the records of how Earth's temperature varied during ice ages (atmospheric CO₂ was 180 ppm during glacial maxima; 280 ppm during interglacials; the 5 °C difference in global temperature gives an ECS-like measurement of ~3 °C per CO₂ doubling — consistent with model-based estimates).

**Observed and projected effects.** Climate change is not a future problem; impacts are observed today.

Sea level. Has risen about 24 cm globally since 1900 (about 1.7 mm/yr early 20th century; 3.7 mm/yr from 2006 to 2018; accelerating). Two sources: thermal expansion of warming ocean water (~40% of historical rise) and melting land ice — Greenland, Antarctica, mountain glaciers (~60%). Greenland is losing ~280 Gt of ice per year; Antarctica ~150 Gt. AR6 projects ~30 to 110 cm of additional rise by 2100 depending on emissions scenario; multi-meter rises by 2200 if high emissions continue.

Sea-level rise is not uniform geographically. The Greenland ice sheet's gravity holds ocean water near it; melting Greenland causes water to rebound away, raising sea level farther from Greenland (NE US gets relatively more rise; NW Europe gets relatively less). Ocean currents also redistribute heat and therefore expansion. Local subsidence (from groundwater extraction, sediment compaction) compounds the rise: Jakarta is sinking at multiple cm/yr while the ocean rises a few mm/yr.

Glaciers and snow. Mountain glaciers have lost about 50% of their volume since 1850 in many regions. Arctic sea-ice September minimum declined from ~7.5 million km² in 1980s to ~4.5 million km² in the 2010s — about 13% per decade. Greenland's ice sheet is losing mass on net (more melt and runoff than snow accumulation). Antarctica is also losing mass (West Antarctic Ice Sheet is the largest contributor), though some interior parts are still gaining.

Heatwaves and extremes. Heatwaves are getting more frequent, longer, and more intense. The 2003 European heat wave killed ~70,000 people across the EU; would have been ~10× less likely without anthropogenic warming. The 2021 Pacific Northwest heat dome reached 49.6 °C in Lytton, BC (subsequently burned to the ground by wildfire); a 1-in-1,000-year event in current climate, virtually impossible in pre-industrial. The 2022 European heat wave killed ~62,000.

Wildfires. Larger, more frequent, more intense. Climate change drives more "fire weather" (hot, dry, windy days) and increased fuel loads (drought-stressed forests). Recent megafires: 2019-2020 Australian bushfires (47 million acres burned; estimated 3 billion vertebrate animals affected), 2018 Camp Fire in California (killed 85, destroyed Paradise), 2023 Canadian wildfires (45 million acres). Attribution studies show climate change made these more likely and more severe.

Precipitation. Heavy precipitation events are intensifying everywhere because warmer air holds more water (Clausius-Clapeyron: ~7% more moisture per °C of warming). Net precipitation patterns are shifting: drying in some regions (Mediterranean, southwest US, parts of Africa), wetting in others (high latitudes, parts of tropics). Drought is more frequent in dry regions; floods are more severe in wet ones.

Tropical cyclones. Frequency may not change much, but intensity is shifting: more Category 4 and 5 storms; more "rapid intensification" (rapid strengthening). Storms move more slowly (their warm-pool fuel covers more area and changes circulation), causing more rain in any given location. Hurricane Harvey 2017: ~60 inches of rain over parts of Texas; >$125B in damage.

Ecosystems. Species ranges shifting poleward and upslope. Spring arriving earlier; growing seasons longer. Phenological mismatches: flowers blooming before pollinators emerge; predators arriving after their prey have already migrated. Coral bleaching events more frequent and more severe.

Health. Heatwave deaths rising. The 2003 European event and many since are documented health crises. Lancet Countdown 2023: ~489,000 heat-related deaths in elderly people globally in 2022, 61% above the 2000-2004 baseline. Mosquito-borne disease ranges (malaria, dengue, Lyme) expanding poleward. Mental-health effects from disaster exposure and climate anxiety are increasingly documented.

**The Paris Agreement.** Signed in 2015 at COP21 in Paris; legally binding under the UNFCCC framework. Two stated temperature goals: limit warming to "well below 2 °C above pre-industrial levels" and "pursuing efforts to limit the temperature increase to 1.5 °C." The 1.5 °C target was added at the insistence of small-island states for whom 2 °C means inundation.

Each country submits a Nationally Determined Contribution (NDC) — a pledge of emissions reductions. NDCs are not directly enforceable, but the treaty requires periodic update (every 5 years) and includes review mechanisms. The collective effect of current NDCs is well above what the temperature targets require.

Carbon budget. The cumulative CO₂ emissions consistent with a given temperature limit. IPCC AR6 estimated the remaining global CO₂ budget for a 50% chance of staying below 1.5 °C at about 315 Gt CO₂ as of 2025 — about 8 years at current emission rates (37 Gt/yr). For a 67% chance, the budget is about 215 Gt — 6 years. For a 50% chance of 2.0 °C, the budget is about 1,150 Gt — 30 years.

**What different warming levels look like.** The differences across temperature targets are not linear. AR6 WGII synthesizes the differences:

At 1.5 °C: 70–90% of warm-water coral reefs lost. 9% of population exposed to severe heatwaves at least once every 5 years. 14% face water scarcity. 6 million additional people flood-exposed.

At 2.0 °C: nearly all coral reefs lost (~99%). 13% of population exposed to severe heat. 28% face water scarcity. 8 million flood-exposed. 90% of crop areas show yield reductions.

At 3.0 °C: West Antarctic Ice Sheet likely committed to collapse over centuries (multi-meter sea-level rise in the long run). Tipping cascades likely; food system stresses widespread; large-scale displacement.

At 4.0 °C: the system is fundamentally different from any state human civilization has known. Beyond planning horizons; major food-system collapses likely; sea-level rise eventually 5+ meters.

These are AR6 WGII summaries; specific numbers vary by source. The key point: small differences in temperature target translate to large differences in habitability.

**Numbers to memorize:**
- 2024 global mean surface temperature: ~1.5 °C above 1850-1900 baseline
- Equilibrium climate sensitivity (ECS): ~3 °C per CO₂ doubling (likely 2.5-4 °C)
- Transient climate response (TCR): ~1.8 °C
- Radiative forcing for CO₂ doubling: 3.7 W/m²
- Sea level since 1900: ~24 cm rise; accelerating to ~3.7 mm/yr
- Remaining 1.5 °C CO₂ budget (50% chance, AR6): ~315 GtCO₂ as of 2025
- Current emissions: ~37 GtCO₂/year`,
    },

    // ============================================================
    // 9.6 OCEAN WARMING
    // ============================================================
    {
      code: '9.6',
      title: 'Ocean warming',
      content:
`The oceans absorb more than 90% of the excess heat trapped by anthropogenic greenhouse gases. This is the dominant heat sink in the climate system — and the place where most of the human-caused energy imbalance has gone. The atmosphere holds only about 1% of the excess; the rest goes to ocean (>90%), land (~5%), and ice (~3%). Understanding ocean warming is therefore understanding where the heat is.

**The physics: why oceans absorb so much heat.** Water has a heat capacity of about 4,186 J/kg/K, four times that of dry air (1,005 J/kg/K). For the same temperature change, water absorbs four times more energy per kilogram. The mass of the ocean is also enormous — about 1.4 × 10²¹ kg, more than 270 times the mass of the atmosphere. Multiplying mass by heat capacity gives the heat content. The ocean's heat capacity is more than 1,100 times that of the atmosphere. This is why warming an ocean by a fraction of a degree requires more total energy than warming the entire atmosphere by several degrees.

The ocean is also stratified: warm water near the surface (the "mixed layer," about 50-150 m deep) sits above colder deep water. Heat transfers down only slowly — through wind-driven mixing, thermohaline circulation, and seasonal convection in polar regions. So even though the surface has warmed measurably, the deeper ocean is still catching up.

**Observed ocean heat content (OHC).** Direct ocean temperature measurements come from several sources:

- Argo floats (since the early 2000s). A global array of about 4,000 autonomous instruments. Each float drifts at depth for 10 days, then rises to the surface measuring temperature and salinity from 2,000 m to the surface. Once at the surface, it transmits data via satellite and dives again. The Argo network provides continuous global coverage of the upper 2 km of ocean.

- XBT (expendable bathythermograph) drops, historically deployed from research vessels and commercial ships. Less consistent quality and coverage than Argo but provides the longer historical record (1960s-).

- CTDs (conductivity-temperature-depth instruments) on dedicated oceanographic cruises. Highest-quality data but sparse spatial coverage.

- Moored buoys at fixed locations for long time series.

- Satellite altimetry, which doesn't measure temperature directly but indirectly through sea-surface height (thermal expansion).

The synthesized record shows ocean heat content increasing essentially every year since records began, with the rate accelerating. From 1971 to 2018, OHC increased by about 380 zettajoules (ZJ, 10²¹ J). That averages to about 0.6 W/m² over Earth's surface — much more than total human energy consumption (~0.05 W/m² equivalent). The 2010s rate was about 0.9 W/m². The recent rate (2020-2024) appears higher still.

**Sea surface temperature.** Surface temperature is what most laypeople think of as "ocean warming." SST has risen about 0.9 °C since 1900, less than land surfaces (1.5+ °C) because of ocean's high heat capacity and the time required to mix heat down. The 0.9 °C global mean masks substantial regional variation: tropical western Pacific warming faster than eastern; North Atlantic warming with regional variability driven by AMOC; high latitudes warming most rapidly (sea-ice feedback).

**Marine heatwaves (MHWs).** Discrete events of unusually warm SST that persist for days to months. The 2013-2015 Pacific "Blob" — a vast region of anomalously warm water — sat off the West Coast for two years, devastating ecosystems and contributing to coral bleaching in Hawaii. The Great Barrier Reef has experienced major bleaching events in 1998, 2002, 2016, 2017, 2020, 2022, and 2024 — each tied to MHWs. The 2023 North Atlantic recorded the warmest temperatures ever observed.

Formal definition (Hobday et al. 2016): SST above the 90th percentile of the local historical record for at least 5 consecutive days. Frequency, intensity, and duration of marine heatwaves have all increased since 1980 — fingerprints of climate warming.

**Coral bleaching: a case study.** Corals are colonial cnidarians that live in symbiosis with photosynthetic algae (zooxanthellae of the genus Symbiodinium) inside their tissue. The algae provide approximately 90% of coral nutrition through photosynthesis; the coral provides the algae a habitat and CO₂ for photosynthesis.

When water temperature exceeds the local norm by ~1-2 °C for several weeks, the algae become stressed and produce excess reactive oxygen species. The coral expels them — turning white because the algae provided most of the color (coral itself is mostly transparent). This is "bleaching."

Bleached coral is not dead. If temperatures return to normal within days to weeks, the algae can recolonize and the coral can recover. But coral cannot survive long-term without its photosynthetic partner. If high temperatures persist for weeks or months, the coral starves and dies.

Mass bleaching events are tracked by NOAA's Coral Reef Watch using satellite SST. The "Degree Heating Week" (DHW) metric quantifies heat stress: 4 DHW typically triggers bleaching; 8+ DHW typically causes mortality.

The 2016-2017 events killed approximately 50% of shallow Great Barrier Reef corals. Globally, coral reefs face existential threat. At 1.5 °C of warming, 70-90% of warm-water corals lost. At 2.0 °C, nearly all lost (~99%). Reefs support 25% of marine species despite covering 0.1% of seafloor; their loss cascades through fisheries, coastal protection, and the livelihoods of ~500 million people who depend on reef resources.

**Thermal expansion.** Water expands as it warms (above 4 °C). The thermal expansion coefficient of seawater is about 2 × 10⁻⁴ per °C. For each 1°C of warming through a 1000 m water column, sea level rises by ~20 cm just from thermal expansion. Globally averaged, thermal expansion has contributed about 40% of observed sea level rise since 1900. This fraction is declining as land-ice melt accelerates.

**Stratification.** Warm water is less dense than cold. As surface waters warm, they sit on top of denser cold water below, reducing the mixing between them. This "stratification" has three consequences:

(1) Reduced oxygen transport to depth. Surface oxygen from atmospheric exchange and photosynthesis doesn't reach deep waters as effectively. Result: expanding oxygen-minimum zones (OMZs), already affecting fisheries in the Eastern Tropical Pacific.

(2) Reduced nutrient supply to the surface. Deep cold water normally upwells to fertilize surface phytoplankton with nitrogen and phosphorus. Stratification suppresses this. Tropical and subtropical surface waters become more nutrient-poor, reducing phytoplankton biomass — the base of marine food chains.

(3) Reduced ability to absorb additional heat. As the mixed layer warms, it becomes harder for the surface to take up more atmospheric heat. The ocean's heat-sponge role gradually weakens.

**Ocean circulation.** Ocean currents are driven by density differences (temperature and salinity), the "thermohaline circulation." The most studied branch is the Atlantic Meridional Overturning Circulation (AMOC) — warm surface water moves north in the Gulf Stream, gives up heat to the atmosphere as it travels, becomes denser, and sinks in the North Atlantic. The sinking water returns south at depth, eventually upwelling in other ocean basins.

The AMOC delivers about 1 petawatt of heat to the North Atlantic — equivalent to 50× total human energy use. Without it, northwestern Europe would be 5-10 °C colder, like the equivalent latitudes of Canada.

The AMOC has weakened approximately 15% since 1950 (Caesar et al. 2018, Nature). Causes: freshening of the North Atlantic from Greenland meltwater and increased precipitation reduces the salinity (density) of surface water there, weakening the sinking. Warming reduces density.

A full AMOC collapse would dramatically cool northwestern Europe (paradoxically cold from global warming), shift the Intertropical Convergence Zone southward (disrupting tropical rainfall and monsoons), accelerate sea-level rise on the US East Coast (by removing the AMOC's gravitational pull on water), disrupt fisheries, and likely trigger other tipping cascades.

IPCC AR6 considers AMOC slowdown highly likely but full collapse during the 21st century unlikely. A 2023 paper (Ditlevsen and Ditlevsen, Nature Communications) argued the collapse threshold could be reached as early as 2025-2095, with central estimate 2057 ± 17 years. The science is contested but the possibility space is taken seriously.

**Sea-ice loss.** Arctic sea-ice September minimum has declined from approximately 7.5 million km² in the 1980s to ~4.5 million km² in the 2010s — about 13% per decade. This is one of the most visible signatures of climate change. The minimum will likely fall below 1 million km² (effectively ice-free Arctic Ocean) during summer within a few decades.

Antarctic sea ice was stable or slightly growing until 2016, then dramatic loss began. The 2022 and 2023 austral winter (June-September) sea-ice extents set all-time lows. The 2023 maximum was about 1.6 million km² below the 1981-2010 average — an enormous departure.

Sea ice loss is doubly bad. (1) Dark ocean replaces reflective ice, lowering albedo and absorbing more solar heat (positive feedback). (2) Habitat for ice-dependent species (polar bears, walruses, seals, ice algae) shrinks. (3) Land ice exposed to warmer water and atmosphere is more vulnerable to melt.

**Tropical cyclones.** Warmer SSTs are more energetic for storms. The empirical relationship is approximately a 7% increase in maximum sustained winds per °C of SST warming. So a warming of 2 °C would intensify storms by about 14%.

Observational evidence:
- The proportion of Category 3+ storms (sustained winds > 178 km/h) has increased globally.
- "Rapid intensification" (RI, an increase of >55 km/h winds within 24 hours) has become more frequent. Hurricane Otis (October 2023) went from tropical storm to Category 5 in 12 hours, devastating Acapulco.
- Storms are moving more slowly, increasing the rainfall delivered to any given location. Hurricane Harvey (2017): >60 inches of rain over parts of Texas. >$125 billion in damage.

Hurricane Katrina (2005), Sandy (2012), Maria (2017), Harvey (2017), Otis (2023) — each tied to anthropogenic warming through attribution studies, increasing the probability or intensity of the storm.

**The buffer is finite.** Ocean uptake of heat slows surface warming but commits the planet to future warming we have not yet experienced. If all greenhouse gas emissions stopped today, surface temperatures would continue to rise for ~30 years as the ocean catches up. This is "committed warming" or "warming in the pipeline." It's why "we'll adjust if it gets bad" is not a strategy — the warming is already locked in.

The deep ocean is also slow to respond. The first 700 m of ocean is warming relatively fast; the 700-2000 m layer slower; below 2000 m, only a thin signal so far. But that's where most of the ocean mass is. Over centuries, the deep ocean will catch up. This is what gives Earth's climate system its long thermal inertia.

**Numbers to memorize:**
- Ocean absorbs >90% of excess heat (atmosphere ~1%, land ~5%, ice ~3%)
- Ocean heat capacity ~1,100× that of atmosphere
- OHC increase 1971-2018: ~380 zettajoules (10²¹ J)
- Recent OHC rate: ~0.9 W/m² imbalance
- SST warming since 1900: ~0.9 °C
- Sea-level rise contribution from thermal expansion: ~40% of historical rise
- AMOC weakening since 1950: ~15%
- Arctic sea-ice September minimum: ~7.5 → 4.5 million km² since 1980s (13%/decade decline)
- Hurricane intensity scales ~7% per °C SST warming`,
    },

    // ============================================================
    // 9.7 OCEAN ACIDIFICATION
    // ============================================================
    {
      code: '9.7',
      title: 'Ocean acidification',
      content:
`Ocean acidification is the chemical companion of ocean warming. While warming is driven by greenhouse-gas-trapped heat, acidification is driven by the chemistry of dissolved CO₂ in seawater. Both come from the same source — rising atmospheric CO₂ — but they proceed by different mechanisms, on different timescales, with different reversibility properties. This subunit explains the chemistry rigorously and traces its consequences for marine ecosystems.

**The carbonate system.** When CO₂ dissolves in seawater, it participates in a series of acid-base equilibria collectively called the carbonate system. There are five key chemical species: CO₂(aq), H₂CO₃, HCO₃⁻ (bicarbonate), CO₃²⁻ (carbonate), and H⁺. The reactions:

  (1) CO₂(g) + H₂O ⇌ CO₂(aq) (Henry's Law: gas dissolves in proportion to partial pressure)
  (2) CO₂(aq) + H₂O ⇌ H₂CO₃ (forms carbonic acid; this step is fast)
  (3) H₂CO₃ ⇌ HCO₃⁻ + H⁺ (first dissociation; equilibrium constant K₁ ≈ 10⁻⁶ at typical seawater conditions)
  (4) HCO₃⁻ ⇌ CO₃²⁻ + H⁺ (second dissociation; K₂ ≈ 10⁻⁹.3)

Note that H₂CO₃ is short-lived; in practice, the relevant reactions are direct CO₂(aq) → HCO₃⁻ + H⁺ at pH ~8 typical of seawater.

The system is in equilibrium at any given pCO₂. Increasing atmospheric pCO₂ shifts step (1) right: more CO₂ dissolves. The downstream reactions also shift right, generating more H⁺. Net result: lower pH and more bicarbonate; carbonate ion drops because it combines with H⁺ to form bicarbonate.

The crucial reaction for ecosystems is:
  CO₂ + H₂O + CO₃²⁻ → 2 HCO₃⁻

This says: adding CO₂ consumes carbonate ion. Carbonate ion is what calcifying organisms need to build CaCO₃ shells. Acidification isn't just lower pH — it's mineral starvation.

**Quantifying acidification.** Pre-industrial ocean surface pH: ~8.18. Today (2024): ~8.05. That looks like a small change, but pH is logarithmic — each unit change is 10× concentration. The 0.13 pH drop means [H⁺] has increased by 10^0.13 ≈ 1.35×, or about 35% more H⁺ than pre-industrial.

Future projections: pH could fall to ~7.7-7.8 by 2100 in high-emissions scenarios (an additional 0.25-0.35 unit drop, meaning H⁺ would more than double again). The ocean would still be alkaline (pH > 7) but would be more acidic relative to its evolutionary baseline than it has been in tens of millions of years.

The rate of change matters as much as the absolute value. Pre-industrial pH had been stable for thousands of years. The current rate of acidification — about 100× faster than the fastest past acidification event in the geologic record (the Paleocene-Eocene Thermal Maximum, ~55 million years ago) — gives marine ecosystems essentially no time to adapt.

**Spatial patterns.** Cold water dissolves more CO₂ — gas solubility is inversely related to temperature. So polar oceans are acidifying fastest. Surface acidification rates are about 0.001-0.002 pH units per year globally; faster in the Southern Ocean and North Atlantic. The aragonite saturation horizon (the depth below which seawater is undersaturated and aragonite dissolves) has shoaled (risen toward the surface) by about 40-100 m in 200 years; in some regions it now intersects the surface.

**Aragonite vs calcite.** Calcium carbonate (CaCO₃) crystallizes in two forms: calcite (more stable; rhombohedral) and aragonite (less stable; orthorhombic). Different organisms build different forms. Many shells (foraminifera, coccolithophores) build calcite. Many corals and pteropods build aragonite. Aragonite is more vulnerable to acidification because its solubility product is higher — it requires more carbonate ion to remain stable.

The saturation state (Ω) measures the carbonate-ion availability relative to the mineral's solubility:

  Ω = [Ca²⁺][CO₃²⁻] / K_sp

K_sp is the solubility product of the relevant CaCO₃ form (different for aragonite and calcite). When Ω > 1, water is supersaturated and shells form spontaneously. When Ω < 1, water is undersaturated and shells dissolve. As atmospheric CO₂ rises, [CO₃²⁻] falls, and Ω drops toward 1.

Current global average aragonite Ω at the surface ≈ 2.9 (still supersaturated, but lower than pre-industrial ~3.4). Polar surface Ω is already approaching or crossing 1. Calcite Ω is higher (more stable form) but also declining.

**Carbonate saturation depth.** Below the saturation horizon, mineral CaCO₃ dissolves. Aragonite saturation depth in the open ocean was at ~3,000 m in 1750; ~2,500 m in 2000; projected to shoal to ~150 m or less by 2100 in high emissions scenarios. Cold-water corals at depth are already affected by undersaturated water. Surface aragonite undersaturation will become common in polar regions within this century.

**Biological impacts.**

Coral reefs (warm-water, tropical). Reef-building corals build aragonite skeletons. They live near the upper end of their thermal range; warming pushes them into bleaching territory; acidification simultaneously slows their growth and makes their skeletons more dissolution-prone. Calcification rates of staghorn and elkhorn corals have already declined by 10-15% since pre-industrial. With both stressors compounded, coral reefs face an extreme threat. At 1.5 °C of warming + projected acidification, 70-90% of warm-water reefs lost. At 2.0 °C, nearly all (~99%). Reef ecosystems support 25% of marine species but cover only 0.1% of the seafloor — their loss cascades through fisheries, coastal protection, tourism.

Cold-water corals (deep-sea, polar). Lophelia pertusa and related species build aragonite skeletons in cold deep water. Some species form massive reefs (Norwegian fjords, North Atlantic seamounts) that have grown for thousands of years. These corals are particularly vulnerable to acidification because the cold deep water is already close to aragonite undersaturation. Some sites already show signs of corrosion. Projections: most cold-water coral habitat undersaturated by 2100.

Pteropods (sea butterflies / sea angels). Tiny swimming snails that form a major component of polar food webs. They build aragonite shells. Field surveys in the Southern Ocean and Arctic already show shell pitting and dissolution — visible damage to live animals from acidification. Pteropods feed many polar fish; their decline propagates through ecosystems.

Oysters, clams, mussels (bivalves). Build aragonite or mixed calcite-aragonite shells. Pacific oyster larvae (Crassostrea gigas) require Ω_aragonite > 2 for healthy development; current upwelling events on the US West Coast bring water with Ω < 1.5, sometimes < 1.0, to oyster hatcheries. Hatcheries (Whiskey Creek Hatchery, Netarts Bay) have had to buffer their seawater chemistry to maintain viable larval production. Wild populations are showing recruitment failures correlated with upwelling intensity.

Coccolithophores. Photosynthetic plankton with calcite plates. Some species (Emiliania huxleyi) form massive blooms visible from space. Effects of acidification mixed: some strains tolerate acidification, others don't. Coccolithophores are the largest single source of calcium carbonate to the ocean. Their decline would affect both food webs and the ocean's carbon storage capacity.

Foraminifera. Single-celled organisms with mostly calcite shells. Foraminifera assemblages in seafloor sediments are the primary record we have of past ocean chemistry. Modern observations show foraminifera shells thinning. Past acidification events (PETM) preserved as foraminifera dissolution layers in sediment cores — a fossil record of what current acidification means.

Sea urchins, starfish. Build skeletons of magnesian calcite — particularly soluble form. Larval and juvenile stages especially vulnerable.

Pteropod larvae, larval fish. Behavioral effects of acidification — not just structural. Studies (Munday et al. 2010, others) show acidified water disrupts olfaction in clownfish larvae; they can't detect predators. Behavioral effects could be more widespread than structural ones.

Fish. Adult fish appear less directly affected than calcifiers, but larval stages and otolith (ear-stone) development can be disrupted. Sensory changes in many species. Cascade effects through food webs.

**The buffering system.** Seawater is a buffer — the carbonate equilibria absorb some of the added acid. This buffering is what's letting the surface ocean dissolve as much CO₂ as it does (about 25% of human emissions). But buffering has a cost: the more CO₂ already in solution, the more H⁺ is generated and the less the ocean can absorb additional CO₂.

The Revelle factor measures this. R = (∂pCO₂ / pCO₂) / (∂DIC / DIC), where DIC is dissolved inorganic carbon. Pre-industrial Revelle factor ≈ 9; today ≈ 10-13 and rising. As R rises, oceans absorb less of each ton of CO₂ we emit. By late this century, the ocean's CO₂-absorbing capacity will be substantially reduced compared to today. This is a positive feedback: less ocean uptake means more atmospheric accumulation, which means more warming.

**Decoupling from warming.** Acidification proceeds independently of warming in important ways. Acidification depends on dissolved CO₂; warming depends on atmospheric CO₂ via the greenhouse effect. Even if greenhouse-gas-driven warming somehow stopped (e.g., via solar geoengineering), acidification would continue as long as CO₂ keeps rising.

The two stressors do interact: warmer water holds less dissolved CO₂ (lower solubility), partly offsetting acidification at the surface. But this offset is small; the acidification trajectory tracks atmospheric pCO₂ closely.

Bleached corals can't grow back faster in less acidic water; degraded acid-stressed corals can't withstand more warming. The two stressors are multiplicative.

**Reversibility.** On timescales relevant to ecosystem function (decades to centuries), ocean acidification is essentially irreversible. The carbonate equilibrium is fast; if we stopped emitting tomorrow, ocean surface pH would gradually rise as deep ocean mixed in unmodified water. But this would take hundreds to thousands of years. Mineral weathering of silicate rocks eventually neutralizes the acid (the long-term carbon cycle), but that's a 10,000-50,000 year process.

Once we lose coral reefs, pteropods, oyster populations, it would take evolutionary time (millions of years) to rebuild biodiversity.

**Historical analogs.** The Paleocene-Eocene Thermal Maximum (PETM, ~55.5 million years ago) saw a massive release of carbon to the atmosphere — possibly from methane-hydrate destabilization or volcanic activity — over ~5,000-10,000 years. Global temperatures rose ~5-8 °C; oceans acidified. Seafloor sediments from that time show foraminifera extinction, dissolution layers, and dramatic species turnover. It took 100,000-200,000 years for ocean chemistry to recover. The current rate of CO₂ release is about 100× faster than the PETM. We are running an experiment with no precedent in the geologic record.

**Mitigation: there's only one route.** Unlike many environmental problems, ocean acidification has no targeted intervention. Geoengineering schemes like alkalinity addition (dumping crushed olivine or limestone) face logistical problems at scale. Local protection — buffering hatchery water — works at small scales. The only thing that addresses the global acidification trajectory is reducing atmospheric CO₂.

Carbon dioxide removal (CDR) — direct air capture, BECCS (bioenergy with carbon capture and storage), accelerated weathering, ocean alkalinity enhancement — could in principle reduce atmospheric CO₂ and thereby reduce ocean acidification. But these are early-stage technologies; current CDR capacity is microscopic compared to needs.

**Key formulas and numbers to remember:**
- pH = −log₁₀ [H⁺]; ΔpH = −0.13 means [H⁺] up by factor 10^0.13 ≈ 1.35 (35% more H⁺)
- Henry's Law: [CO₂(aq)] ∝ pCO₂(atm)
- Carbonate saturation: Ω = [Ca²⁺][CO₃²⁻] / K_sp
- Aragonite Ω surface pre-industrial ≈ 3.4; today ≈ 2.9; below 1.0 is undersaturated
- Pre-industrial pH 8.18; today ~8.05; projected ~7.7-7.8 by 2100 (high emissions)
- Ocean uptake: ~25% of annual human emissions
- Revelle factor: rising; reduces future ocean uptake capacity`,
    },

    // ============================================================
    // 9.8 INVASIVE SPECIES
    // ============================================================
    {
      code: '9.8',
      title: 'Invasive species',
      content:
`Invasive species are non-native organisms that, introduced to a new range, cause ecological or economic harm. Climate change is accelerating both their introductions and their establishment success. The relationship between climate and invasives is not direct — climate change itself doesn't usually "invade" — but it removes barriers that previously held species in place, stresses native communities making them less competitive, and creates the disturbances that invaders exploit. Understanding this interaction is essential to conservation and biosecurity policy.

**Vocabulary you must know.**
- Native: present in an area before significant human introduction.
- Non-native (also: exotic, alien, introduced): present due to human introduction.
- Naturalized: established and reproducing without human assistance.
- Invasive: non-native AND causing ecological or economic harm.
- Endemic: native AND found only in a specific limited area (e.g., Galápagos species are endemic to those islands).
- Cryptic invasion: introduction of a genetically distinct population of the same species (often hard to detect; increasingly common as a category).

Not all non-natives are invasive. Honeybees (Apis mellifera) are non-native to the Americas but are not classified as invasive in most contexts. Most introductions don't establish; most established species don't cause harm. The invasive minority is hard to predict.

**The "tens rule" (Williamson 1996).** Roughly 10% of introduced species establish self-sustaining populations; of those, roughly 10% become invasive (causing detectable harm). So out of 100 introductions, perhaps 1 becomes a problematic invasive. This rule is approximate and varies by taxon and context, but it captures the general filter.

Traits that predict invasiveness:
- Broad environmental tolerance (generalists).
- Short generation time.
- High reproductive output (r-strategists).
- Lack of specialist predators, pathogens, or parasites in the new range.
- Dietary flexibility.
- High propagule pressure (many individuals introduced over time).

Native ecosystems vulnerable to invasion:
- Islands (limited evolutionary preparation for novel competitors). Hawaii has lost a majority of its native birds to introduced species and habitat change. Aotearoa New Zealand had massive species loss after Polynesian arrival 800 years ago and European arrival 200 years ago.
- Disturbed habitats. Forests recovering from logging or fire are vulnerable; pristine intact forests less so.
- Mid-latitude continents where multiple introduction pathways converge (ports, agriculture, horticulture).

**Mechanisms by which climate change increases invasion pressure.**

(1) Range shifts. Warming temperatures move climate envelopes poleward and upslope. Species that were previously climate-limited at boundaries can now establish in new areas. Globally, hundreds of species have shifted ranges over the past 50 years; the average rate is ~16 km poleward per decade and ~11 m upslope per decade (Chen et al. 2011, Science). Some shifts are "neutral" range expansions; others become invasions when the moving species displaces natives that cannot move fast enough.

(2) Disturbance increase. Climate change drives more frequent and severe extreme events — fires, floods, droughts, hurricanes. Disturbance creates ecological openings — bare ground, killed vegetation, disrupted soil structure, broken canopy. Many invasives are pioneer species (r-strategists with fast reproduction and broad tolerance) that exploit disturbance better than native communities can recover. Cheatgrass (Bromus tectorum) in the western US is the textbook case: an annual grass from Eurasia that invades after fire, increases fire frequency by drying out earlier, and is now dominant on millions of acres of former sagebrush habitat.

(3) Stress on natives. Climate-stressed native communities have reduced competitive ability. A native ecosystem dealing with drought, heat stress, pest outbreak, or disease provides openings for invaders that natives would otherwise outcompete in normal conditions. Bark beetles in western North America had range expansions enabled by warmer winters (which previously killed overwintering beetles); the stressed lodgepole and ponderosa pine forests became more vulnerable to other invasives.

(4) Direct facilitation. Some invasives are specifically favored by warming. The Burmese python in Florida tolerates cold poorly; warming winters extend its range northward. Tick species causing Lyme disease (Ixodes scapularis) have expanded northward in North America with milder winters.

(5) Phenological mismatch. As spring shifts earlier with warming, native species' timing may not keep up. Native plants that bloom earlier may miss their specialist pollinators. The empty niche favors generalist invaders.

(6) New routes. Ice-free Arctic shipping lanes (the Northwest Passage and Northern Sea Route) are opening new ocean pathways for marine species. Anti-fouling paint on ships transports organisms; ballast water tanks carry larvae thousands of miles.

**Case studies of major invasives.**

**Burmese python (Python molurus bivittatus) in Florida Everglades.** Native to Southeast Asia. Released from the pet trade in the 1980s and 1990s; now a self-sustaining population estimated at 30,000-300,000 in southern Florida. Adult pythons can reach 5 m and 90 kg. They eat virtually any vertebrate — birds, mammals, reptiles, even small alligators. Some surveys show 90%+ drops in small-mammal populations within the pythons' range (raccoons, opossums, marsh rabbits, deer). The Everglades food web has been radically altered. Climate connection: warming winters reduce cold-snap mortality that previously held the population back. Eradication is essentially impossible at current scale; management is now focused on slowing spread.

**Emerald ash borer (Agrilus planipennis).** Native to East Asia; an Asian jewel beetle. Introduced to North America via wood packaging materials in the 1990s. Larvae bore galleries through ash tree bark and phloem, killing the tree within 1-2 years. Has spread across the US and Canada; has killed over 100 million ash trees and is expected to functionally eliminate North American ash. Cost estimates: $11-13 billion in tree removal alone over the next decade. Climate connection: warmer winters and longer summers help the beetle complete more generations per year; range is moving north with warming.

**Zebra and quagga mussels (Dreissena polymorpha and D. bugensis).** Native to Ponto-Caspian region of Eurasia. Introduced to the Great Lakes in the 1980s via ballast water from Black Sea ships. Filter feeders that out-compete native mussels and clog water-intake pipes for municipal water, industrial cooling, and power plants. Damages estimated $1-7 billion per year in maintenance costs. The water-filtering activity has reduced phytoplankton concentrations in the Great Lakes, with cascading effects through food webs. Climate connection: shifting plankton communities in warmer lakes change food supply; warmer winters reduce ice cover that previously stressed populations.

**Spotted lanternfly (Lycorma delicatula).** Native to China. Established in the US East Coast since 2014. Damages grapevines, hops, ornamental trees, and timber species. Population spreading rapidly. Native to a similar climate; well-suited to mid-Atlantic conditions. The wine industry, in particular, faces significant losses.

**Lionfish (Pterois volitans, P. miles).** Native to Indo-Pacific. Established in the Caribbean and Atlantic since the 1990s, likely from aquarium releases off Florida. Voracious predators with no native predators of their own. Disrupting reef fish communities — population reductions of small native fish observed at 65-80% in invaded areas. Combined with reef stress from warming and acidification, multiplying the loss.

**Tropical mosquitoes.** Aedes aegypti and Aedes albopictus are vectors for dengue, Zika, chikungunya, and yellow fever. They are expanding poleward in the US and Europe as winters warm. Models project most of the continental US could support Aedes year-round by 2050. Dengue cases in Texas, Florida, and southern Europe have risen.

**Ticks and tick-borne disease.** Black-legged tick (Ixodes scapularis) range has expanded northward, increasing Lyme disease incidence in the Upper Midwest and Northeast. White-tailed deer populations have also grown, multiplying transmission. Lyme cases in the US doubled between 1992 and 2018.

**Cheatgrass (Bromus tectorum).** Eurasian annual grass. Now dominant on millions of acres of former sagebrush habitat in the Great Basin. Drives a positive feedback: cheatgrass cures early, providing fine fuel that increases fire frequency. Higher fire frequency kills native sagebrush (which cannot resprout) but doesn't affect cheatgrass (which reseeds quickly). The ecosystem transitions from sagebrush-shrubland to cheatgrass-annual-grassland. Climate warming and drought accelerate the transition.

**Asian carp (Hypophthalmichthys species — bighead, silver, grass, black carp).** Imported to North America in the 1970s for aquaculture and weed control; escaped during floods. Now dominant in the Mississippi River. Filter feeders that compete with native fish for plankton. Approaching the Great Lakes — the Asian Carp Action Plan has cost over $200 million in barriers and monitoring. Silver carp are notorious for jumping when boats approach, injuring boaters.

**Economic costs.** EPA estimates US economic damage from invasive species at $120+ billion per year. Globally, the IPBES Invasive Alien Species Assessment (2023) estimated $423 billion per year. These figures aggregate agricultural losses, infrastructure damage, control costs, and ecosystem-service losses.

**Management strategies.**

(1) Prevention. Most cost-effective by far. Border inspections, ballast-water treatment, quarantine restrictions on imported plant material. USDA APHIS in the US, MAF in New Zealand, CFIA in Canada. The Ballast Water Management Convention (entered force 2017) requires ships to treat ballast water to kill organisms.

(2) Early detection and rapid response (EDRR). Once an invasion is detected, removing it early is much cheaper than after it spreads. Most successful eradications have occurred when populations were small and localized.

(3) Mechanical removal. Manual or with machinery — pulling weeds, trapping animals, removing aquatic plants. Labor-intensive but environmentally specific.

(4) Chemical control. Pesticides, herbicides. Often broad-spectrum and damaging to non-targets. Sometimes the only option for severe infestations.

(5) Biological control. Introducing predators, parasites, or pathogens of the invader. Risky and historically full of disasters — the classic case is cane toads introduced to Australia in 1935 to eat cane beetles; the toads are now themselves an invasive species across half the continent, poisoning native predators that try to eat them. Modern biocontrol is regulated and tested far more carefully but still uncertain.

(6) Habitat restoration. Repairing damage caused by invasives and supporting native community recovery.

**The frontier: novel assemblages.** As ranges shift with climate change, "novel" combinations of species become common — species combinations that haven't existed before. The line between "native" and "invasive" blurs when neither species was historically present at a given location. Some ecologists (Hobbs et al. 2013) argue we need to abandon strict native-versus-invasive distinctions and manage for ecosystem function instead. Others worry this dilutes conservation priorities. The debate is unresolved.

**Indirect ecosystem effects.** Many ecosystem services depend on native species: pollination, pest control, carbon storage, soil formation. Invasions can disrupt these. Honey bees (themselves European introductions) are pollinator-service providers, but native bees do work that honey bees don't (native plants are often pollinated only by specific native insect species). Argentine ants in the southern US displace native ant communities, disrupting seed dispersal of native plants that evolved with the original ants. Cascading effects are common and often invisible until critical.

**Key facts to remember:**
- Tens rule: ~10% of introductions establish; ~10% of those become invasive
- Invasive traits: broad tolerance, fast reproduction, no specialist enemies
- Climate change accelerates invasions: shifted ranges, more disturbance, stressed natives
- US cost: $120+ billion/year; global: $423 billion/year
- Prevention is much cheaper than eradication
- Burmese python (Florida), emerald ash borer (US/Canada), zebra mussels (Great Lakes), lionfish (Caribbean), cheatgrass (Great Basin), cane toads (Australia) — canonical case studies`,
    },

    // ============================================================
    // 9.9 ENDANGERED SPECIES
    // ============================================================
    {
      code: '9.9',
      title: 'Endangered species',
      content:
`Climate change is one of the major drivers of species extinction. Combined with habitat loss, pollution, overexploitation, and invasive species, climate change pushes already-stressed populations toward and past extinction thresholds. This subunit covers what counts as endangered, how species are classified, why climate change is particularly dangerous for certain life histories, and what conservation responses are emerging.

**The IUCN Red List.** The International Union for the Conservation of Nature maintains the global standard for extinction-risk classification. Categories from least to most threatened:

- Least Concern (LC): widespread and abundant; no immediate concern.
- Near Threatened (NT): close to qualifying as threatened in the future.
- Vulnerable (VU): high risk of extinction in the wild.
- Endangered (EN): very high risk.
- Critically Endangered (CR): extremely high risk.
- Extinct in the Wild (EW): survives only in captivity.
- Extinct (EX): no individuals remaining.

Plus: Data Deficient (DD) — not enough information to assess. Not Evaluated (NE) — never been assessed.

"Threatened" in IUCN terminology means Vulnerable + Endangered + Critically Endangered combined.

Of approximately 150,000 species assessed (a small fraction of the ~8.7 million estimated species globally), more than 42,000 are threatened. The recent IPBES global assessment (2019) estimated that approximately 1 million species are at risk of extinction within decades — far above the IUCN's directly assessed count, because most species haven't been evaluated.

**Endangered Species Act (US, 1973).** The strongest piece of US conservation legislation. Provides federal protection for listed species. Two categories: Endangered (in danger of extinction throughout all or a significant portion of its range) and Threatened (likely to become endangered in the foreseeable future). Listing decisions are made by the US Fish and Wildlife Service (terrestrial and freshwater) and NOAA Fisheries (marine).

Authorized actions:
- Designation of critical habitat (areas containing physical or biological features essential to the species).
- Recovery plans (formal strategies for delisting).
- Prohibition on "take" (kill, harm, harass; include modifying habitat in ways that significantly impair feeding, breeding, or sheltering).
- Federal interagency consultation requirements for federal actions that might affect listed species.
- Civil and criminal penalties for violations.

Famous ESA successes:
- Bald eagle (delisted 2007 after recovery from DDT-driven decline).
- American alligator (delisted 1987 after recovery from hunting-driven decline).
- Peregrine falcon (delisted 1999).
- Brown pelican (delisted 2009).

The most controversial cases involved economic and political conflict:
- Northern spotted owl (Pacific Northwest, listed 1990). The owl was a flashpoint in the "owls vs jobs" debate; led to fundamental changes in federal forest management; populations have continued to decline despite protection.
- Polar bear (listed 2008 as Threatened "primarily due to the loss of sea ice habitat"). The first major climate-driven ESA listing; controversial because the legal framework wasn't designed for climate-driven threats.

**Why climate change is particularly dangerous.** The mechanisms differ from past extinction drivers.

(1) Climate envelopes shift faster than many species can migrate. Sessile species (plants, slow-moving animals) can't keep up. Range-shift studies (Chen et al. 2011, others) show species are moving poleward at ~16 km/decade on average, but the climate is moving much faster in some regions — in some plains and lowlands, the climate is moving 100+ km/decade. Species that can't track this fast face local extinction.

(2) Cold-adapted species have nowhere to go. Polar bears need sea ice; there's no ice further north. Mountain pikas (Ochotona princeps) can move upslope, but only until they run out of mountain. The American pika has been extirpated from parts of its historical range in the Great Basin. Joshua trees (Yucca brevifolia) face >90% habitat loss in moderate emissions scenarios.

(3) Specialists are more vulnerable than generalists. Koalas eat eucalyptus; their range tracks specific eucalyptus species. Pandas eat bamboo of specific species. Many pollinator-plant relationships involve specific bee-plant matches that climate change can disrupt. Generalists (raccoons, coyotes, cockroaches) thrive in changing environments.

(4) Phenological mismatches. Spring warming has caused many migratory birds to arrive earlier on their breeding grounds. But the insects they eat may peak at the same time as before, or shift differently. Caribou calving has historically synchronized with vegetation green-up; recent decoupling has caused calf mortality to rise in some Arctic populations. Pied flycatchers (Ficedula hypoleuca) in the Netherlands declined 90% in regions where their migration timing didn't match shifting caterpillar peaks.

(5) Disease and parasites move with warming. Chytrid fungus (Batrachochytrium dendrobatidis) has decimated amphibian populations globally; warmer mountain streams have favored its spread. White-nose syndrome has killed millions of bats across North America. Bark beetles in western North America had range expansions enabled by warmer winters and have killed millions of acres of pine.

(6) Direct heat stress. Some species are near the upper limit of their thermal tolerance. Mass mortality events from heat waves have been documented for shellfish, fish, and even birds. The 2021 Pacific Northwest heat dome killed about a billion intertidal organisms along the Salish Sea coast.

(7) Habitat fragmentation interacts with climate. Species in fragmented landscapes have nowhere to retreat. Migration corridors that don't exist or are blocked by infrastructure are barriers to climate adaptation.

**Case studies.**

**Polar bear (Ursus maritimus).** The textbook climate-driven endangered species. Lives on Arctic sea ice; hunts seals from ice edges. Sea ice loss reduces hunting time, reduces body condition, increases swimming distances. Listed under ESA in 2008 as threatened "due primarily to the loss of sea ice habitat." Population estimate (IUCN 2015): ~26,000; projected decline of 30%+ over three generations as Arctic sea ice continues to thin. Some sub-populations (Beaufort Sea, Western Hudson Bay) have declined significantly already.

**Coral species.** Many corals are listed as threatened or endangered. Staghorn coral (Acropora cervicornis) and elkhorn coral (Acropora palmata) in the Caribbean are listed under ESA; 80% population decline since the 1980s from bleaching, disease, and direct damage. Twenty additional coral species were added to the ESA in 2014.

**Pikas (Ochotona princeps).** Small mammals of mountain talus slopes. They don't tolerate temperatures above 25 °C; they pant heavily in heat and may die from prolonged exposure. They cache vegetation in summer for winter food. As temperatures rise, their elevation range compresses upward; populations at lower elevations have been extirpated. Some Sierra Nevada and Great Basin populations are gone.

**Joshua tree (Yucca brevifolia).** Mojave Desert iconic species. Pollinated by specific yucca moths in obligate mutualism. Climate models project >90% of current habitat unsuitable by 2100 in moderate emissions scenarios. Recent (2019) wildfires have killed millions of trees; without pollinators or seedling recruitment, recovery may not occur. Petitioned for ESA listing.

**North American moose (Alces alces).** Cold-adapted species. Vulnerable to heat stress (which makes them less able to forage) and to parasites (winter tick, Dermacentor albipictus) that proliferate in warmer winters. Some Upper Midwest populations have collapsed dramatically — Minnesota's moose population fell from ~9,000 in 2000 to ~3,000 by 2013.

**Migratory birds.** Climate change shifts food and breeding-site timing; in some studies, ~60% of migratory bird species in North America have shown range or timing shifts that disrupt life history. Pied flycatchers (above), red-winged blackbirds, tree swallows, and many others.

**Amphibians.** Globally, ~41% of amphibian species are threatened with extinction — the most threatened vertebrate class. Climate change interacts with the chytrid fungus, habitat loss, and pollution. The golden toad (Bufo periglenes), endemic to Costa Rica's cloud forest, went extinct in 1989 — one of the first extinctions attributed to climate change.

**Conservation responses to climate change.**

**(1) Assisted migration.** Deliberately moving species to areas projected to remain climatically suitable. Controversial: risks creating new "invasives" or disrupting recipient ecosystems. Has been used for some plant species (Torreya taxifolia in the southeastern US has been moved to higher-elevation Appalachian sites). Some conservation biologists advocate; others worry about cascading consequences.

**(2) Climate-adaptive corridors.** Connecting protected areas across elevational and latitudinal gradients to allow movement. The Yellowstone-to-Yukon Conservation Initiative is the most ambitious example — protecting a continuous north-south corridor along the Rocky Mountain spine. Conservation biology strongly supports corridors; politically and economically expensive.

**(3) Ex situ conservation.** Zoos, botanical gardens, seed banks. The Svalbard Global Seed Vault stores ~1.3 million crop variety samples in permafrost. Cryogenic preservation of gametes. Last-ditch backup but doesn't preserve ecological relationships, evolutionary processes, or cultural meaning.

**(4) Genetic rescue.** Introducing individuals from related populations to add genetic diversity to inbred or small populations. Successfully used for Florida panthers (introducing Texas cougar genes increased panther fitness). Sometimes controversial because it intentionally mixes populations.

**(5) Climate refugia.** Identifying and protecting areas projected to be climatically stable — typically deep ravines, north-facing slopes, deep groundwater-fed wetlands, high-elevation cool pockets. Recent emphasis in conservation planning. The "save the cool places first" strategy.

**(6) Ecosystem-based management.** Rather than focus on individual species, manage for ecosystem functions and resilience. The thinking: as climate shifts species ranges, individual species protection becomes harder; protecting functional ecosystems may preserve more of what matters.

**(7) Rewilding.** Restoring ecological processes (large herbivores, predators) and letting ecosystems self-recover. Yellowstone wolves are the textbook example — their reintroduction (1995) restored trophic cascades, eventually changing rivers, vegetation, and biodiversity throughout the park.

**The deeper issue.** Climate change is not just adding to existing extinction drivers — it's interacting multiplicatively with them. A species threatened by habitat loss is more vulnerable to climate shifts; a climate-stressed population is more vulnerable to disease. The result is compounded pressure. The "sixth mass extinction" framing (Kolbert 2014, "The Sixth Extinction: An Unnatural History") captures this — current extinction rates are 100-1,000× background, driven by humans rather than natural causes. Whether what we're seeing meets the formal definition of a mass extinction (typically requires >75% species loss in <2 million years) is debated; the trajectory is what matters.

**Key facts to remember:**
- IUCN categories: LC < NT < VU < EN < CR < EW < EX. "Threatened" = VU + EN + CR.
- ~42,000 species threatened on the Red List
- IPBES 2019: ~1 million species at risk of extinction within decades
- ESA (1973): listing, critical habitat, recovery plans, take prohibition, federal consultation
- Polar bear, golden toad, North American moose, pikas, Joshua tree, coral species — climate-driven cases
- Climate-conservation tools: assisted migration, corridors, ex situ, genetic rescue, climate refugia, rewilding
- Current extinction rate: 100-1,000× background. Sixth mass extinction.`,
    },

    // ============================================================
    // 9.10 HUMAN IMPACTS ON BIODIVERSITY
    // ============================================================
    {
      code: '9.10',
      title: 'Human impacts on biodiversity',
      content:
`The current biodiversity crisis is comparable in scale to the five great extinctions in geologic history, but is happening on human timescales — orders of magnitude faster than past mass extinctions. The proximate causes are human activities; the framework that organizes them is the HIPPO mnemonic (Habitat loss, Invasive species, Pollution, Population/over-exploitation, climate change as a recently-added separate driver). Understanding the drivers, the documented losses, and the policy frameworks that aim to address them is essential to environmental science.

**Direct measurements of biodiversity loss.**

**The Living Planet Index (LPI).** WWF and Zoological Society of London publish the LPI biennially. Tracks population trends in 35,000+ vertebrate populations of 5,000+ species (mammals, birds, fish, reptiles, amphibians). The most recent (2024 edition): the LPI shows a 73% average decline in monitored populations from 1970 to 2020.

Note: this is not 73% of species lost. It's the average proportion-decline across monitored populations. The interpretation is subtle:
- Freshwater populations: 85% decline.
- Marine populations: 56% decline.
- Terrestrial populations: 60% decline.
- Latin America and Caribbean regions: 95% decline.
- Africa: 76% decline.
- Asia-Pacific: 60% decline.
- North America: 39% decline.
- Europe and Central Asia: 35% decline.

The LPI is constructed from population trend data (often abundance counts in specific locations over time) rather than species-level lists. It's a population-trend index, not an extinction rate. Buschke et al. 2021 (Communications Earth & Environment) critically examined the LPI methodology and found the headline number may be biased high, but the qualitative finding of significant decline is robust across analyses.

**IPBES Global Assessment (2019).** The Intergovernmental Science-Policy Platform on Biodiversity and Ecosystem Services produced the most comprehensive recent biodiversity assessment. Key findings:
- Approximately 1 million species (of an estimated 8.7 million total) face extinction within decades.
- Average abundance of native species in most major terrestrial biomes has fallen by at least 20% since 1900.
- Marine ecosystems are similarly stressed.
- Population sizes of vertebrates have declined by 60% globally since 1970.
- The 2019 IPBES estimate was widely cited and remains a benchmark.

**Background extinction rate.** Estimated at 1-10 species per million per year, based on the fossil record. Current rates are estimated at 100-1,000× background, with some estimates as high as 10,000× during peak loss periods. The exact comparison depends on which taxa and which time periods are used.

**The five drivers (IPBES ranking).**

(1) **Changes in land and sea use.** Largest single driver. Includes conversion of natural habitats for agriculture, urbanization, infrastructure, industry. About 75% of Earth's land surface has been "significantly altered" by humans (IPBES 2019); about 66% of marine environment shows "significant alteration."

Tropical deforestation is the single largest source of land-use biodiversity loss. The Amazon has lost ~17% of its forest area since 1970; tipping into savannization is a serious concern with 20-25% deforestation. Indonesia's palm-oil-driven peatland forest loss has been catastrophic for orangutan, tiger, and other species. The Congo Basin remains relatively intact but faces growing pressure.

The 30 by 30 framework (next section) targets land-use as the most leverage-able driver.

(2) **Direct exploitation of organisms.** Hunting, fishing, logging, harvesting, trade. Fishing: about one-third of global fish stocks are overfished; another 60% are at maximum sustainable yield. The Atlantic cod fishery collapsed in 1992 after extreme overfishing; despite moratorium, recovery has been slow. Tuna species, sharks, and many forage fish remain heavily pressured.

Wildlife trafficking is a $20+ billion/year industry. Demand for ivory (driving African elephant decline despite a 1989 international ivory ban), rhino horn (driving rhino extinction risk), exotic pets, bushmeat, traditional medicine ingredients.

(3) **Climate change.** Rising in significance fast. As discussed in subunits 9.5-9.9. Direct effects: species range shifts, phenological mismatches, ocean chemistry changes, fire regime shifts, drought, heat mortality. Indirect effects: climate-stressed ecosystems are more vulnerable to other drivers.

By the 2030s-2040s, climate change is projected to become the largest single driver in many ecosystems, surpassing land-use change in some regions.

(4) **Pollution.** Chemical, plastic, light, noise. Plastic pollution: 8-12 million tonnes enter the oceans each year; ~5 trillion pieces now floating in the ocean. Microplastics are now ubiquitous — found in drinking water, food, air, human placentas. Health effects under active investigation.

Chemical pollution: pesticides (neonicotinoids implicated in pollinator declines), heavy metals, persistent organic pollutants (PCBs, dioxins), endocrine disruptors. Agricultural fertilizer runoff causes dead zones in coastal waters (Gulf of Mexico dead zone covers 6,000-8,000 sq mi).

Light pollution disrupts nocturnal species behavior. Migratory birds collide with lit buildings; insect populations near artificial lights decline; sea turtle hatchlings move toward beach lighting instead of moonlit ocean.

Noise pollution: ship-engine noise interferes with whale and dolphin communication; near-shore noise stresses fish; chronic noise has been linked to cardiovascular effects in humans.

(5) **Invasive alien species.** Discussed in subunit 9.8. Cost: $400+ billion globally per year. Major driver of native species declines, especially on islands and in freshwater systems.

**The 30 by 30 framework.** Kunming-Montreal Global Biodiversity Framework (December 2022, COP15 of the Convention on Biological Diversity). The headline target: protect 30% of land and sea by 2030. Other targets:
- Restore 30% of degraded ecosystems.
- Halve risk of invasive species impact.
- Reduce pollutants harmful to biodiversity.
- Reduce extinction rates 10×.
- Mainstream biodiversity into government decisions across all sectors.
- $200 billion/year in biodiversity finance by 2030.

Current protected area coverage: about 17% of land and 8% of ocean. Achieving 30% requires roughly doubling existing protection. But "which 30%" matters as much as "30%" — protecting biodiversity hotspots, climate refugia, and indigenous lands matters far more than total area.

**Specific decline patterns.**

**Insect decline.** Hallmann et al. 2017 (PLoS ONE): 76% decline in flying insect biomass over 27 years in German nature reserves. Multiple subsequent studies have shown similar declines in other regions. Pollinator declines are particularly serious — about 75% of global crops benefit from pollinators. Honeybee colony collapse disorder, native bee population decline, and butterfly declines (monarchs have lost 80%+ of overwintering populations since 1996) are all documented.

The 2019 "insect apocalypse" framing was contested for methodological reasons but the qualitative pattern holds.

**Amphibian decline.** Approximately 41% of amphibian species are threatened with extinction — the most threatened vertebrate class. Causes interact: chytrid fungus pandemic (caused by Batrachochytrium dendrobatidis) has caused declines in ~500 species, with at least 90 extinctions in the past 40 years. Climate-related changes in mountain stream temperatures and timing favor chytrid. Habitat loss and pesticides add stress.

**Coral reefs.** Already discussed in 9.6 and 9.7. 70%+ of warm-water reefs at risk at 1.5 °C warming. The 2016-2017 Great Barrier Reef bleaching killed ~50% of shallow corals.

**Tropical forests.** Lost ~30% of tropical primary forest since 1990. Tropical deforestation accelerated in the 2010s in the Amazon (under specific political contexts), Indonesia (palm oil), and Congo Basin (cropland and mining expansion).

**Vertebrate populations.** LPI 73% average decline. Specifically: freshwater 85%, Latin America 95%, Africa 76%, Asia-Pacific 60%.

**Marine fisheries.** Cod, herring, sardines, anchovies. Many fisheries have collapsed and not recovered. Even in well-managed fisheries, climate-driven shifts in fish distributions cause political tensions between countries that previously shared stocks.

**Pollinators.** Western honey bees and many wild bee species in decline. Hummingbirds in some regions. Bat populations affected by white-nose syndrome.

**Why does biodiversity matter?** Multiple framings — economic, ecological, ethical, intrinsic.

**Economic.** Ecosystem services are valued at $44 trillion+ per year globally (Costanza 2020), comparable to global GDP. Pollination, water purification, climate regulation, fisheries, soil formation, pest control, recreation, cultural services. Loss of biodiversity reduces these services. Many of these are non-substitutable — once gone, they cannot be replaced with technology or with other species.

**Ecological.** Functional diversity matters — different species perform different jobs. Redundancy in a stable environment becomes critical insurance in a changing one. Diverse ecosystems are more resistant to disturbance and more resilient in recovery. Specialists provide irreplaceable functions; generalists provide buffering.

**Health.** Antibiotic and pharmaceutical discoveries depend on biological diversity. Approximately 50% of pharmaceutical compounds originate in natural products. New compounds continue to be discovered. Reservoirs of pathogens (spillover from wildlife) become more dangerous as biodiverse buffers shrink — connections between deforestation, wildlife trade, and zoonotic disease emergence are well-documented (Ebola, HIV, SARS, COVID-19 all have wildlife origins).

**Cultural and indigenous values.** Many indigenous cultures are inseparable from specific landscapes and species. Losing the species is also losing the culture — language, knowledge systems, identity. Indigenous peoples manage about 25% of Earth's land and hold disproportionate biodiversity. Their stewardship has been more effective than many state-led protected areas (per IPBES analysis).

**Ethical.** Some argue species have intrinsic value beyond human use — they exist, they have evolved over millions of years, we have an obligation to respect rather than destroy them. Different ethical frameworks (utilitarian, Kantian, biocentric) give different weight, but most modern ethical thought includes some recognition of non-human value.

**Conservation as ecosystem-scale problem.** Recent conservation thinking moves beyond species-by-species to ecosystem and landscape scale. The reasoning: species exist in webs; saving a few high-charisma species while their ecosystem collapses around them is ineffective.

Approaches include:
- **Indigenous-led conservation.** Indigenous peoples manage about 25% of Earth's land and hold disproportionate biodiversity. Their stewardship has been more effective than many state-led protected areas (per IPBES analysis). Recognized in the Kunming-Montreal framework.
- **Rewilding.** Restoring ecological processes (large herbivores, predators) and letting ecosystems self-recover. Yellowstone wolves are the textbook example.
- **Bioregionalism.** Managing for ecosystem boundaries rather than political ones.
- **Connectivity.** Wildlife corridors connecting protected areas to allow species to move with climate.
- **Functional restoration.** Restoring ecosystem processes (fire regime, hydrology, herbivory) rather than recreating historical species lists.

**The Anthropocene.** Geologic terminology. Human impact is now of geological-scale significance. The proposed boundary marker is the spike in radionuclides from atomic-weapon tests (mid-20th century). The Anthropocene Working Group recommended formal recognition; the International Commission on Stratigraphy declined formal acceptance in 2024 (it was held that 1950s does not yet meet criteria for a formal stratigraphic unit). Regardless of formal naming, the framing — human impact at geological scale — captures the current biodiversity moment.

**Key facts to remember:**
- Living Planet Index 2024: 73% average decline in monitored vertebrate populations since 1970
- IPBES 2019: ~1 million species at risk of extinction within decades
- Background extinction rate: 1-10 species per million per year. Current: 100-1,000× higher.
- HIPPO drivers (in order of historical importance): Habitat loss, Invasive species, Pollution, Population/over-exploitation
- Climate change ranks #3 in current importance, projected to rise
- 30 by 30: Kunming-Montreal (2022) target of 30% land + sea protected by 2030
- Ecosystem services value: ~$44 trillion/year globally
- Indigenous peoples manage ~25% of Earth's land; outperform state-led protection in many cases`,
    },
  ],

  keyConcepts: [
    'Stratospheric O₃ protects from UV-B and UV-C. CFCs catalytically destroy it; one Cl atom destroys ~100,000 O₃ molecules.',
    'Montreal Protocol (1987) is the most successful environmental treaty. Universal ratification; ozone layer recovering by ~2066.',
    'Natural greenhouse: +33 °C warming. Effective T 255 K (–18 °C); actual ~288 K (+15 °C).',
    'Three main human GHGs: CO₂ (280→425 ppm, +51%), CH₄ (700→1,930 ppb, +175%), N₂O (270→335 ppb, +24%). Half of CO₂ emissions stay airborne.',
    'Climate sensitivity ~3 °C per CO₂ doubling (IPCC AR6 central). Likely range 2.5–4 °C. Water vapor + ice-albedo + cloud feedbacks amplify the no-feedback 1.2 °C.',
    'Oceans absorb >90% of excess heat. Ocean heat content has gained 380 ZJ since 1971.',
    'Ocean pH fell from 8.18 to 8.05 — 35% more H⁺. Acidification independent of warming; threatens calcifying organisms.',
    'Climate change drives invasions by shifting envelopes, increasing disturbance, and stressing natives.',
    'IUCN Red List: LC → NT → VU → EN → CR → EW → EX. ~42,000 species threatened.',
    'IPBES 2019: ~1M species at risk. LPI 2024: 73% average vertebrate-population decline since 1970.',
    '30 by 30: Kunming-Montreal (2022) target of 30% land + sea protected by 2030.',
  ],

  formulas: [
    {
      name: 'Stefan-Boltzmann (effective temperature)',
      equation: 'σ T_eff⁴ = (1 − α) × S₀ / 4',
      meaning: 'Energy balance: outgoing IR = absorbed solar. T_eff is the effective temperature; α is albedo; S₀ = solar constant; σ = 5.67 × 10⁻⁸ W/m²/K⁴.',
      example: 'Earth: S₀ = 1361, α = 0.30. T_eff = ((0.7 × 1361)/(4σ))^(1/4) = 255 K = −18 °C. The 33 K bump to actual 288 K (+15 °C) is the natural greenhouse.',
    },
    {
      name: 'CO₂ radiative forcing',
      equation: 'ΔF = 5.35 × ln(C / C₀)  W/m²',
      meaning: 'Top-of-atmosphere radiative imbalance from CO₂ concentration C relative to baseline C₀.',
      example: 'Doubling CO₂ (280 → 560 ppm): ΔF = 5.35 × ln(2) ≈ 3.7 W/m². Current 425 ppm: ΔF = 5.35 × ln(425/280) ≈ 2.23 W/m².',
    },
    {
      name: 'Climate sensitivity',
      equation: 'ΔT = ΔF / λ_eff',
      meaning: 'Equilibrium temperature change for a given forcing. λ_eff = effective feedback parameter (~1.2 W/m²/K including all feedbacks; gives ECS ~3 K per CO₂ doubling).',
      example: '425 ppm: equilibrium ΔT = 2.23/1.2 ≈ 1.86 °C above pre-industrial (equilibrium; transient is less because oceans absorbing).',
    },
    {
      name: 'Global Warming Potential',
      equation: 'GWP(gas, t) = ∫₀ᵗ RF_gas / ∫₀ᵗ RF_CO₂',
      meaning: 'Cumulative warming of a gas relative to CO₂ over time horizon t.',
      example: 'CH₄ GWP-100 = 28. 1 tonne CH₄ = 28 tonnes CO₂eq over 100 years. CH₄ GWP-20 = 82. N₂O GWP-100 = 273. SF₆ = 23,500.',
    },
    {
      name: 'pH and H⁺ concentration',
      equation: 'pH = −log₁₀ [H⁺]',
      meaning: 'Each pH unit is a 10× change in [H⁺]. Ocean pH 8.18 → 8.05 means [H⁺] ratio 10^0.13 ≈ 1.35.',
      example: 'A pH change of 0.3 means [H⁺] doubled.',
    },
  ],

  practice: [
    {
      q: 'Compute Earth\'s effective temperature with solar constant 1361 W/m² and albedo 0.30. Compare to observed 288 K.',
      a: '255 K (–18 °C). Observed surface is 288 K, so the natural greenhouse effect adds 33 K.',
      work: 'σT⁴ = (1 − α) S₀ / 4 = 0.7 × 1361 / 4 = 238 W/m². T = (238 / 5.67e-8)^(1/4) = 254.6 K.',
    },
    {
      q: 'A scenario projects CO₂ reaching 700 ppm in 2100. Using climate sensitivity 3 °C per doubling, compute equilibrium temperature anomaly.',
      a: '~4.0 °C above pre-industrial (equilibrium; transient will be lower).',
      work: 'ΔT = 3 × ln(700/280)/ln(2) = 3 × ln(2.5)/ln(2) ≈ 3 × 1.32 = 3.97 °C.',
    },
    {
      q: 'A dairy farm emits 200 tonnes of CH₄ per year. What is the equivalent in CO₂ over a 100-year horizon? Over 20 years?',
      a: '100-year: 5,600 tonnes CO₂eq. 20-year: 16,400 tonnes CO₂eq.',
      work: '200 × GWP_100(CH₄) = 200 × 28 = 5,600. 200 × GWP_20(CH₄) = 200 × 82 = 16,400.',
    },
    {
      q: 'Ocean pH drops from 8.18 to 8.05. By what percentage did [H⁺] increase?',
      a: '~35%.',
      work: 'ΔpH = −0.13. [H⁺] ratio = 10^0.13 ≈ 1.35. So 35% more H⁺.',
    },
    {
      q: 'Why does cutting methane emissions reduce atmospheric concentration faster than cutting CO₂?',
      a: 'Methane atmospheric lifetime is ~12 years; CO₂ effective lifetime is centuries. Stopping methane sources lets the natural sink (reaction with OH) deplete atmospheric CH₄ within a decade. Cutting CO₂ stops accumulation, but most existing molecules stay for centuries.',
    },
    {
      q: 'A coral reef ecosystem provides $X in tourism, $Y in fisheries, and $Z in storm protection. Why might its loss be worth more than X + Y + Z?',
      a: 'Ecosystem services are often non-substitutable, with thresholds. The reef provides habitat for organisms used in pharmaceutical discovery; cultural and spiritual value; backup biodiversity insurance. Once destroyed, the reef does not regrow on policy-relevant timescales. The aggregated economic value typically undervalues option value (future possibilities) and existence value (intrinsic worth).',
    },
    {
      q: 'Identify three ways climate change increases the success rate of invasive species.',
      a: '(1) Shifting climate envelopes open new ranges. (2) Increased disturbance creates ecological openings. (3) Stressed natives are less competitive. (4) Warmer winters reduce cold-snap kills. (5) Phenological mismatches between natives and pollinators/predators favor generalist invaders.',
    },
    {
      q: 'The Antarctic ozone hole is severe but the Arctic shows less depletion. Explain the asymmetry.',
      a: 'Antarctic polar vortex is more stable in winter, isolating cold stratospheric air. Lower temperatures allow polar stratospheric clouds (PSCs) to form, providing surfaces for heterogeneous chlorine activation. Arctic vortex is more disturbed and warmer; fewer PSCs; less chlorine activation; less ozone destruction.',
    },
  ],

  pitfalls: [
    '"The ozone hole and climate change are the same problem" — incorrect. Ozone hole = CFCs destroying stratospheric O₃. Climate change = greenhouse-gas accumulation. Different mechanisms, different layers of the atmosphere, different molecules. CFCs are both ozone destroyers AND greenhouse gases, but that\'s a coincidence of chemistry.',
    '"Water vapor causes climate change, not CO₂" — water vapor is the largest greenhouse gas at any moment but is a feedback, not a forcing. Its concentration is set by temperature (Clausius-Clapeyron). CO₂ is a forcing — its concentration is set by emissions and slowly-acting sinks.',
    '"Climate sensitivity is a fixed 3 °C" — central estimate. Likely range 2.5–4 °C. Possible range 2–5 °C. The lower bound matters a lot for policy budgets.',
    '"Stopping emissions stops warming immediately" — most of the warming committed by past emissions is still in the pipeline because of ocean thermal inertia. Surface temperatures continue to rise for ~30 years after emissions stop.',
    '"Ocean is buffering CO₂, so we are fine" — the buffer comes at the cost of acidification. The Revelle factor rises as oceans absorb more, meaning the ocean\'s ability to absorb future CO₂ declines. Buffer is finite.',
    '"GWP-100 is the right number to compare gases" — only for some purposes. GWP-20 is more appropriate for near-term-decisive choices (short-lived forcers like methane). GWP-500 matters for multi-century commitments (CO₂ dominates).',
    '"All extinctions happen at the same rate naturally" — background rates are 1–10 per million species per year. Current rates are 100–1,000× higher. The "background rate" is the natural baseline; what we\'re seeing is well above it.',
    '"Endangered Species Act protects all wildlife" — only listed species. Listing is a multi-year administrative process and is politically contested. Many species at risk are not yet listed.',
    '"Ozone hole recovery means we solved climate" — they\'re separate problems. The ozone hole is recovering because Montreal worked; CFCs were a tractable molecule-by-molecule problem. Climate is a fundamentally different problem because CO₂ comes from energy use, which is much harder to substitute.',
    '"Coral reefs will adapt to acidification" — there\'s no path. Coral skeletal chemistry is fixed; the chemistry of carbonate dissolution is fixed. Adaptation would require evolutionary change on a timescale of hundreds to thousands of years; the acidification is happening in decades.',
  ],
};
