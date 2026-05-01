import React, { useState } from 'react';

// AP-aligned curriculum across 9 paths. Subject tags reference the AP course
// content frameworks: APES (Environmental Science), AP Chem, AP Bio, AP Physics,
// AP Stats. Each path mixes concept cards, knowledge quizzes, and worked-math
// scenarios with given inputs and full calculation chains in the explanation.
const paths = [
  {
    id: 'climate-101',
    title: 'Climate change in 5 minutes',
    desc: 'What it actually is, in plain language. No math.',
    subject: 'Anyone can start here',
    level: 'intro',
    estMin: 4,
    steps: [
      {
        type: 'concept',
        heading: 'What people mean when they say "climate change"',
        body: 'Earth\'s average temperature is going up. Slowly in human terms — about 1.2 °C since the 1800s — but really fast in geological terms. The cause is well-understood: humans burning fossil fuels (coal, oil, gas) releases carbon dioxide (CO₂) into the atmosphere, and CO₂ traps heat that would otherwise escape to space.',
      },
      {
        type: 'concept',
        heading: 'The greenhouse effect, simply',
        body: 'Imagine a parked car on a sunny day. Sunlight gets in through the windows. The seats warm up. They radiate that warmth back as heat. The glass blocks some of it from escaping, so the car gets hotter than the air outside. Earth\'s atmosphere works the same way — certain gases (CO₂, methane, water vapor) act like the car\'s glass. More CO₂ = more heat trapped = warmer planet.',
      },
      {
        type: 'quiz',
        question: 'Where does most of the extra CO₂ come from?',
        options: [
          { text: 'Burning fossil fuels — gas, oil, coal', correct: true, explanation: 'Right. About 75% of human CO₂ emissions come from burning fossil fuels for energy, heating, and transportation. The other 25% mostly comes from cutting down forests and from industrial processes like cement production.' },
          { text: 'Volcanoes', correct: false, explanation: 'Volcanoes do release CO₂ — but humans now release ~100× more per year than all volcanoes combined.' },
          { text: 'People breathing', correct: false, explanation: 'People do exhale CO₂, but the carbon comes from food we eat, which came from plants that just absorbed it from the air. It\'s a closed loop.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Why does it matter?',
        body: 'Warmer global average → more extreme heat waves, stronger storms, rising sea levels, shifting where crops grow, melting ice, and changes to ecosystems. Even small temperature changes have big effects because the climate system is a chain of dominoes — once one falls, others follow.',
      },
      {
        type: 'concept',
        heading: 'What\'s being done?',
        body: 'Countries agreed in Paris (2015) to try to limit warming to 1.5–2 °C. Schools, businesses, and individuals are measuring and reducing emissions. KUA\'s carbon dashboard is one piece of that — knowing the number is the first step to changing it.',
      },
      {
        type: 'finish',
        heading: 'You\'ve got the basics',
        body: 'Earth is warming. Cause: human CO₂ emissions, mostly from burning fossil fuels. The greenhouse effect is real physics, well-understood for over a century. Reducing emissions is the only long-term fix. Now you can dive into more specific topics — pick another path.',
      },
    ],
  },

  {
    id: 'carbon-plain',
    title: 'Carbon footprints, in plain English',
    desc: 'What is a "carbon footprint"? Why do we measure them?',
    subject: 'Anyone can start here',
    level: 'intro',
    estMin: 4,
    steps: [
      {
        type: 'concept',
        heading: 'What is a carbon footprint?',
        body: 'It\'s the total amount of CO₂ (and other warming gases, converted to CO₂-equivalent) that something — a person, a school, a country — is responsible for releasing in a year. Like counting calories, but for greenhouse gas emissions instead of food.',
      },
      {
        type: 'concept',
        heading: 'How big is one ton of CO₂?',
        body: 'A metric ton (mt) is 1,000 kg — about the weight of a small car. One ton of CO₂ as a gas would fill a sphere about 8 meters across. The average American emits about 16 tons of CO₂ per year. The average KUA student\'s school-related emissions are roughly 5–8 tons (we\'re still measuring exactly).',
      },
      {
        type: 'concept',
        heading: 'Why measure it?',
        body: 'You can\'t reduce what you don\'t measure. If a school says "we\'re working on sustainability" without a number, there\'s no way to tell if it\'s actually working. With a number, you can set a goal, track progress, and compare to other schools. Measurement is what turns vague good intentions into specific projects.',
      },
      {
        type: 'concept',
        heading: 'KUA\'s situation',
        body: 'KUA emits roughly 4,150 tons of CO₂-equivalent per year (preliminary estimate) from heating fuel, electricity, food, travel, and other sources. The campus forest pulls roughly 3,000 tons back out of the air through photosynthesis. Net: about 1,150 tons per year, or roughly 1.9 tons per student.',
      },
      {
        type: 'quiz',
        question: 'Why is measuring on-campus tree absorption important for our footprint number?',
        options: [
          { text: 'It makes the school look better on paper', correct: false, explanation: 'That\'s a side effect, not the reason. The real reason is more honest.' },
          { text: 'It\'s real CO₂ being pulled out of the air on KUA land — a true offset, not an accounting trick', correct: true, explanation: 'Right. Photosynthesis is real chemistry: trees take CO₂ from the air and lock it into wood and soil. If we don\'t count it, we underreport the school\'s true climate impact. Most schools don\'t measure this — KUA is unusual.' },
          { text: 'Because trees are pretty', correct: false, explanation: 'They are, but that\'s not the methodology argument.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You can read the dashboard now',
        body: 'A carbon footprint is the annual gas emissions a person or institution is responsible for. KUA\'s is about 1,150 tons net, after counting the campus forest as a sink. The whole point of measuring is to give the community something concrete to act on. Pick another path to dig deeper.',
      },
    ],
  },

  {
    id: 'first-impact',
    title: 'Your first impact at KUA',
    desc: 'What you can actually do, ranked by impact. Quick.',
    subject: 'Anyone can start here',
    level: 'intro',
    estMin: 3,
    steps: [
      {
        type: 'concept',
        heading: 'Some choices matter way more than others',
        body: 'Not all "green" actions are equal. Turning off a light feels good but barely moves the number. Choosing not to take one international flight saves more carbon than turning off lights for a decade. If you only have time for one thing, do the big thing.',
      },
      {
        type: 'quiz',
        question: 'Which of these saves the most carbon over one year?',
        options: [
          { text: 'Always turning off your dorm light when you leave', correct: false, explanation: 'Helpful but small — about 5 kg CO₂/year saved.' },
          { text: 'One fewer round-trip international flight', correct: true, explanation: 'Right. A single long-haul round-trip is about 3,000 kg CO₂ — about 600× as much as a year of conscientious light-switching. If you can only pick one thing, the flight is where the leverage is.' },
          { text: 'Recycling every plastic bottle for a year', correct: false, explanation: 'Recycling matters but is small in carbon terms — maybe 30 kg CO₂/year for a typical student.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Your three biggest levers',
        body: '1. Travel: long-haul flights are by far the biggest. Combining trips, taking trains for shorter distances, and carpooling all matter. 2. Food: eating less beef is the single biggest dietary change. Beef has roughly 10× the carbon footprint of chicken and 50× that of plant foods. 3. Energy use at home and dorm: small per item, but adds up.',
      },
      {
        type: 'concept',
        heading: 'And one bigger lever — what you push for',
        body: 'Voting, joining a club, organizing for change at KUA, choosing a college based on its climate goals — these can move much bigger numbers than your personal footprint. A student who organizes a switch from oil heating to heat pumps in one dorm has helped offset hundreds of times their own emissions.',
      },
      {
        type: 'finish',
        heading: 'You have a starting place',
        body: 'Travel beats most other personal choices in scale. Food is meaningful too. Daily small things matter, but only collectively. The biggest leverage of all is what you push for at the institutional level. Pick another path to go deeper into any of these.',
      },
    ],
  },

  {
    id: 'basics',
    title: 'Carbon basics',
    desc: 'What Scope 1, 2, 3 and sinks mean. Combustion stoichiometry from first principles.',
    subject: 'APES · AP Chem',
    level: 'standard',
    estMin: 9,
    steps: [
      {
        type: 'concept',
        heading: 'Why we organize emissions into "scopes"',
        body: 'Carbon emissions come from many sources, but who controls each source matters. The Greenhouse Gas Protocol — the global standard — splits them into three scopes by who owns the source. This makes accounting consistent across institutions.',
      },
      {
        type: 'concept',
        heading: 'Scope 1 — direct emissions',
        body: 'Things KUA owns and operates that burn fuel. Heating oil in boilers, propane water heaters, refrigerant leaks from air conditioners, gasoline in school vans. If we can choose to turn it off, it\'s Scope 1.',
      },
      {
        type: 'quiz',
        question: 'A campus van fills up at the gas station. Which scope is that?',
        options: [
          { text: 'Scope 1', correct: true, explanation: 'Right. KUA owns the van and operates it; the combustion happens here.' },
          { text: 'Scope 2', correct: false, explanation: 'Scope 2 is purchased electricity. Vehicle fuel that KUA burns directly is Scope 1.' },
          { text: 'Scope 3', correct: false, explanation: 'Close — student travel is Scope 3. But for KUA-owned fleet, it\'s Scope 1.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Chem: where the EPA factor 10.16 kg CO₂/gal comes from',
        body: 'Heating oil (#2 distillate) is mostly C₁₂H₂₃-ish hydrocarbons — about 87% carbon by mass. The combustion reaction is: CₓHᵧ + (x + y/4) O₂ → x CO₂ + (y/2) H₂O. The EPA factor isn\'t magic — it\'s the carbon mass per gallon converted to CO₂ via stoichiometry. Every fuel\'s factor is derived this way; you can do it yourself.',
      },
      {
        type: 'math',
        heading: 'Math: derive the heating-oil factor from first principles',
        scenario: 'Heating oil is approximately 87% carbon by mass, with density 0.84 kg/L and 3.785 L/gallon. Use stoichiometry to derive the kg of CO₂ produced when one gallon is fully combusted, and verify it matches the EPA published value (10.16 kg CO₂/gal).',
        given: [
          { label: 'Mass per gallon', value: '0.84 kg/L × 3.785 L/gal = 3.18 kg/gal' },
          { label: 'Carbon fraction by mass', value: '0.87' },
          { label: 'C molar mass', value: '12.01 g/mol' },
          { label: 'CO₂ molar mass', value: '44.01 g/mol' },
          { label: 'C → CO₂ ratio', value: '44.01 / 12.01 ≈ 3.667' },
        ],
        question: 'kg CO₂ produced per gallon (complete combustion):',
        options: [
          { text: '~3.18 kg CO₂/gal', correct: false, explanation: 'That\'s the mass of the FUEL per gallon, not the CO₂ produced.' },
          { text: '~10.16 kg CO₂/gal', correct: true, explanation: 'Right. 3.18 kg/gal × 0.87 (C fraction) = 2.77 kg C/gal × 44.01/12.01 = 10.15 kg CO₂/gal. The EPA factor is just stoichiometry on a typical fuel composition. Same approach derives propane (5.72), gasoline (8.78), diesel (10.21) from their molecular formulas.' },
          { text: '~24 kg CO₂/gal', correct: false, explanation: 'Too high. You may have multiplied by 12.01/44.01 backwards.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Scope 2 — purchased electricity',
        body: 'KUA never burns fuel to make electricity, but the power plants on the New England grid do — on our behalf — every time someone flips a light switch. We use ISO-NE\'s 2024 emission factor (643 lb CO₂/MWh) to convert kWh into mtCO₂e.',
      },
      {
        type: 'math',
        heading: 'Math: kWh to mtCO₂e',
        scenario: 'A KUA dorm uses 80,000 kWh of electricity over the school year. The ISO-NE 2024 grid emission factor is 643 lb CO₂ per MWh. Convert that to metric tons of CO₂.',
        given: [
          { label: 'Electricity used', value: '80,000 kWh' },
          { label: 'Grid factor', value: '643 lb CO₂ / MWh' },
          { label: 'Conversion', value: '1 MWh = 1,000 kWh; 1 lb = 0.4536 kg; 1 mt = 1,000 kg' },
        ],
        question: 'How many mtCO₂e?',
        options: [
          { text: '~2.3 mtCO₂e', correct: false, explanation: 'Too low. Check unit conversions — kWh→MWh divides by 1,000.' },
          { text: '~23.3 mtCO₂e', correct: true, explanation: 'Right. 80,000 kWh ÷ 1,000 = 80 MWh × 643 lb/MWh = 51,440 lb × 0.4536 kg/lb = 23,333 kg = 23.3 mtCO₂e.' },
          { text: '~233 mtCO₂e', correct: false, explanation: 'Too high by 10×. Watch the kg→mt conversion at the end.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Scope 3 — everything else',
        body: 'The supply chain. Food in the dining hall, paper for class, flights students take home for break. At residential schools, Scope 3 — especially student travel — is usually the LARGEST scope, even though it\'s the hardest to measure because the data lives outside the school.',
      },
      {
        type: 'quiz',
        question: 'A student flies home to Tokyo for winter break. Which scope?',
        options: [
          { text: 'Scope 1', correct: false, explanation: 'KUA doesn\'t own the airplane.' },
          { text: 'Scope 2', correct: false, explanation: 'Scope 2 is electricity.' },
          { text: 'Scope 3', correct: true, explanation: 'Right. Student travel is Scope 3 — indirect emissions from KUA\'s activities, but not under direct control.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Sinks — the only category that goes the other way',
        body: 'Trees and soils on campus pull CO₂ OUT of the atmosphere via photosynthesis. KUA\'s ~1,000 acres of forest sequesters roughly 3,000 mtCO₂e/year. Most peer schools never measure this — but it\'s a real, physical drawdown.',
      },
      {
        type: 'concept',
        heading: 'Stocks vs flows — APES distinction that matters',
        body: 'Annual emissions (4,150 mtCO₂e/yr) are a FLOW — a rate. The atmospheric CO₂ concentration (~425 ppm) is a STOCK — total accumulated. Stopping emissions doesn\'t reduce the stock; it just stops the stock from growing. CO₂ residence time is centuries, so even after we cut emissions to zero, today\'s atmospheric CO₂ stays mostly stuck for the lifetime of every student now in school.',
      },
      {
        type: 'math',
        heading: 'Math: net carbon balance',
        scenario: 'Suppose a small school has gross annual emissions of 850 mtCO₂e (Scope 1: 200, Scope 2: 150, Scope 3: 500) and on-campus forest sequestration of 320 mtCO₂e/year. What is the net carbon balance?',
        given: [
          { label: 'Scope 1', value: '200 mtCO₂e' },
          { label: 'Scope 2', value: '150 mtCO₂e' },
          { label: 'Scope 3', value: '500 mtCO₂e' },
          { label: 'Sequestration', value: '320 mtCO₂e' },
        ],
        question: 'Net carbon balance per year:',
        options: [
          { text: '+1,170 mtCO₂e', correct: false, explanation: 'You added all four — sinks should be subtracted.' },
          { text: '+530 mtCO₂e', correct: true, explanation: 'Right. Gross = 200 + 150 + 500 = 850. Net = 850 − 320 = 530 mtCO₂e/yr.' },
          { text: '+850 mtCO₂e', correct: false, explanation: 'That\'s the gross, not the net.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You\'ve got the framework AND the chemistry',
        body: 'Four buckets: Scope 1 (direct), Scope 2 (electricity), Scope 3 (indirect), and Sinks (drawdown). Stocks vs flows distinction. Combustion stoichiometry derives every fuel\'s emission factor — no need to take EPA at their word, you can verify it.',
      },
    ],
  },

  {
    id: 'greenhouse-science',
    title: 'The greenhouse effect, in detail',
    desc: 'Earth\'s energy balance, Stefan-Boltzmann, vibrational modes, ocean acidification.',
    subject: 'AP Physics 2 · AP Chem',
    level: 'ap',
    estMin: 14,
    steps: [
      {
        type: 'concept',
        heading: 'Earth as a thermal balance',
        body: 'Energy in must equal energy out at steady state. The Sun delivers ~340 W/m² of solar irradiance (averaged over Earth\'s surface). About 30% reflects back to space (the albedo). The remaining 70% is absorbed and re-radiated as infrared (IR). The greenhouse effect determines what fraction of that IR escapes vs gets re-absorbed.',
      },
      {
        type: 'concept',
        heading: 'Stefan-Boltzmann law — AP Physics 2 connection',
        body: 'A blackbody at temperature T (Kelvin) emits total power per unit area equal to σT⁴, where σ = 5.67 × 10⁻⁸ W/m²/K⁴. Earth absorbs ~240 W/m² of solar energy and must re-emit the same in steady state. Without atmosphere, that fixes Earth\'s effective temperature — and the answer is much colder than what we actually observe.',
      },
      {
        type: 'math',
        heading: 'Math: Earth\'s effective temperature without greenhouse effect',
        scenario: 'Use Stefan-Boltzmann to find the temperature an idealized blackbody Earth would reach if it absorbed 240 W/m² and had no atmospheric greenhouse effect. (σ = 5.67 × 10⁻⁸ W/m²/K⁴.)',
        given: [
          { label: 'Absorbed solar', value: '240 W/m²' },
          { label: 'Stefan-Boltzmann constant σ', value: '5.67 × 10⁻⁸ W/m²/K⁴' },
          { label: 'Equation', value: 'σT⁴ = 240' },
        ],
        question: 'Effective temperature (in K and °C):',
        options: [
          { text: '~256 K (−18 °C)', correct: true, explanation: 'Right. T = (240 / 5.67e−8)^(1/4) = (4.23e9)^(1/4) ≈ 255 K = −18 °C. Earth\'s actual surface temperature is ~288 K (15 °C). The 33 K difference IS the greenhouse effect — it\'s real and natural; CO₂, water vapor, methane all contribute.' },
          { text: '~288 K (15 °C)', correct: false, explanation: 'That\'s the actual surface temperature WITH the greenhouse effect — what we want is the temperature WITHOUT it.' },
          { text: '~310 K (37 °C)', correct: false, explanation: 'Way too high — that\'s body temperature. Recheck the fourth root.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Chem: why N₂ and O₂ don\'t trap IR',
        body: 'IR absorption requires a vibrational mode that changes the molecule\'s dipole moment. Symmetric diatomics like N₂ and O₂ have only one vibrational mode (stretch), and stretching them doesn\'t change their dipole — they have no permanent dipole, and the symmetric stretch keeps it that way. CO₂ has three modes (symmetric stretch, antisymmetric stretch, bend); two of them DO change the dipole, so CO₂ absorbs strongly at 4.3 µm and 15 µm — right in Earth\'s IR emission range.',
      },
      {
        type: 'quiz',
        question: 'CO₂ has three vibrational modes. Which mode is IR-active and contributes most to the greenhouse effect?',
        options: [
          { text: 'Symmetric stretch', correct: false, explanation: 'Not quite. The symmetric stretch doesn\'t change the dipole moment, so it\'s IR-inactive (though Raman-active).' },
          { text: 'Antisymmetric stretch and bend', correct: true, explanation: 'Right. Both modes change CO₂\'s dipole moment as it vibrates. The bend at 15 µm sits squarely in Earth\'s peak IR emission wavelength, which is why CO₂ is such an effective greenhouse gas despite being only 0.04% of the atmosphere.' },
          { text: 'Rotation', correct: false, explanation: 'CO₂ does rotate, but rotation contributes far less to greenhouse trapping than the bend mode.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Global Warming Potential (GWP)',
        body: 'GWP100 measures how much heat one molecule traps over 100 years, relative to CO₂. CO₂ = 1 (the reference). CH₄ = 28. N₂O = 273. R-410A = 2,256. SF₆ = 24,300. GWP combines two factors: the molecule\'s IR absorption strength and its atmospheric lifetime.',
      },
      {
        type: 'concept',
        heading: 'Time horizon effects — methane\'s twist',
        body: 'CO₂ persists in the atmosphere for centuries. Methane oxidizes to CO₂ + H₂O in about 12 years. So methane is more potent NOW (GWP20 ≈ 84) but less so over a century (GWP100 = 28). This is why the time horizon you choose changes the policy you write.',
      },
      {
        type: 'math',
        heading: 'Math: mixed-gas CO₂-equivalent',
        scenario: 'A landfill releases 50 kg CO₂, 4 kg CH₄, and 0.1 kg N₂O over one year. Convert to total CO₂-equivalent using GWP100.',
        given: [
          { label: 'CO₂ released', value: '50 kg' },
          { label: 'CH₄ released', value: '4 kg' },
          { label: 'N₂O released', value: '0.1 kg' },
          { label: 'GWP100: CO₂ / CH₄ / N₂O', value: '1 / 28 / 273' },
        ],
        question: 'Total CO₂-equivalent:',
        options: [
          { text: '~54 kg CO₂e', correct: false, explanation: 'You only added the masses. Each gas needs its GWP first.' },
          { text: '~189 kg CO₂e', correct: true, explanation: 'Right. 50×1 + 4×28 + 0.1×273 = 50 + 112 + 27.3 = 189.3 kg CO₂e. Methane (only 4 kg of mass!) contributes more than the 50 kg of CO₂.' },
          { text: '~512 kg CO₂e', correct: false, explanation: 'Too high. Recheck.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: methane on a 20-year horizon',
        scenario: 'Same landfill, but use GWP20 for methane (84 instead of 28). What\'s the total CO₂-equivalent over a 20-year horizon? (Keep N₂O at 273.)',
        given: [
          { label: 'CO₂', value: '50 kg × 1' },
          { label: 'CH₄', value: '4 kg × 84 (GWP20)' },
          { label: 'N₂O', value: '0.1 kg × 273' },
        ],
        question: 'Total over 20-year horizon:',
        options: [
          { text: '~189 kg CO₂e', correct: false, explanation: 'That was the GWP100 answer. The 20-year multiplier for methane is 3× higher.' },
          { text: '~413 kg CO₂e', correct: true, explanation: 'Right. 50 + 336 + 27.3 = 413 kg CO₂e — more than 2× the GWP100 number, all from re-weighting methane.' },
          { text: '~6,000 kg CO₂e', correct: false, explanation: 'Way too high. Recheck multiplications.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Chem: ocean acidification — the equilibrium nobody talks about enough',
        body: 'About 25% of anthropogenic CO₂ dissolves in the ocean. There it reacts: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. More CO₂ shifts the equilibrium right (Le Chatelier), increasing H⁺ concentration — meaning lower pH. Ocean surface pH has dropped from ~8.21 (pre-industrial) to ~8.10 (today). That\'s a ~30% increase in H⁺ concentration on the logarithmic pH scale.',
      },
      {
        type: 'math',
        heading: 'Math: ocean acidification on log scale',
        scenario: 'Pre-industrial ocean surface pH: 8.21. Today\'s ocean surface pH: 8.10. Calculate the percent increase in H⁺ concentration.',
        given: [
          { label: 'pH(then)', value: '8.21' },
          { label: 'pH(now)', value: '8.10' },
          { label: 'Definition', value: '[H⁺] = 10⁻ᵖᴴ' },
        ],
        question: 'Approximate percent increase in [H⁺]:',
        options: [
          { text: '~1%', correct: false, explanation: 'pH is logarithmic — small numerical changes are big concentration changes.' },
          { text: '~30%', correct: true, explanation: 'Right. [H⁺]_now / [H⁺]_then = 10⁻⁸·¹⁰ / 10⁻⁸·²¹ = 10⁰·¹¹ ≈ 1.288. That\'s a 28.8% increase. Marine organisms with calcium carbonate shells (corals, oysters, pteropods) struggle to build shells in more acidic water — and the shift is happening fast on geological timescales.' },
          { text: '~110%', correct: false, explanation: 'Too high. The difference is 0.11 pH units.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Atmospheric concentration history',
        body: 'Pre-industrial CO₂ (1750): ~280 ppm. Today: ~425 ppm. That\'s a 50% increase over 270 years, with most of it in the last 70. Ice cores show ~425 ppm is the highest in over 3 million years — long before modern humans existed.',
      },
      {
        type: 'concept',
        heading: 'What 1.5°C and 2°C actually mean',
        body: 'The Paris Agreement targets limiting warming to "well below 2°C" with an aspirational 1.5°C cap. We\'re at ~1.2°C now. To stay under 1.5°C the remaining "carbon budget" is ~250 GtCO₂.',
      },
      {
        type: 'math',
        heading: 'Math: how many years of carbon budget remain?',
        scenario: 'Remaining global carbon budget for 50% chance of staying under 1.5°C: ~250 GtCO₂. Annual global emissions: ~37 GtCO₂. At current rates, when is the budget exhausted?',
        given: [
          { label: 'Budget', value: '250 GtCO₂' },
          { label: 'Annual', value: '37 GtCO₂/yr' },
        ],
        question: 'Years until budget gone:',
        options: [
          { text: '~3 years', correct: false, explanation: 'Too short.' },
          { text: '~7 years', correct: true, explanation: 'Right. 250 ÷ 37 ≈ 6.76 years. This is why the IPCC says emissions need to peak before 2025 and roughly halve by 2030 to stay on track for 1.5°C.' },
          { text: '~25 years', correct: false, explanation: 'Too long. You may have used the 2°C budget.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You can derive the physics yourself',
        body: 'Stefan-Boltzmann gives Earth\'s 33-K natural greenhouse effect. Vibrational modes explain why some gases absorb IR and others don\'t. GWPs combine absorption strength + atmospheric lifetime. Ocean acidification is logarithmic and faster than the surface pH change suggests. Carbon budget remaining: ~7 years at current rates. The chemistry and physics are solid.',
      },
    ],
  },

  {
    id: 'kua-footprint',
    title: 'KUA\'s footprint',
    desc: 'Walk through KUA\'s preliminary numbers — verify them yourself with statistics.',
    subject: 'APES · AP Stats',
    level: 'standard',
    estMin: 9,
    steps: [
      {
        type: 'concept',
        heading: 'KUA\'s headline number is ~1,150 mtCO₂e/year',
        body: 'That\'s the NET balance — gross emissions minus on-campus sequestration. The range is wide right now (−760 to +3,572) because most of the inputs are estimates. Once measured data fills in, the range tightens.',
      },
      {
        type: 'concept',
        heading: 'AP Stats: range, point estimate, and uncertainty',
        body: 'A point estimate (1,150) by itself is misleading without an uncertainty range. Our range is roughly ±1,400 — meaning the "true" value is most plausibly somewhere between −250 and +2,500. AP Statistics calls this a confidence interval. The width of the interval comes from the uncertainty in each line item: heating fuel ±25%, student travel ±40%, sink rate ±30%, etc. These uncertainties propagate.',
      },
      {
        type: 'concept',
        heading: 'Where does the headline come from?',
        body: 'Gross: ~4,150 mtCO₂e/yr (Scope 1 ~1,000 + Scope 2 ~222 + Scope 3 ~3,000). Sequestration: ~3,000 mtCO₂e/yr drawdown. Net: 4,150 − 3,000 = 1,150.',
      },
      {
        type: 'math',
        heading: 'Math: KUA\'s Scope 1 from heating fuel',
        scenario: 'Suppose KUA receives 95,000 gallons of #2 heating oil deliveries in one fiscal year. The EPA emission factor is 10.16 kg CO₂/gal.',
        given: [
          { label: 'Heating oil', value: '95,000 gal' },
          { label: 'EPA factor', value: '10.16 kg CO₂/gal' },
        ],
        question: 'Annual Scope 1 from heating oil:',
        options: [
          { text: '~96.5 mtCO₂e', correct: false, explanation: 'Off by 10×.' },
          { text: '~965 mtCO₂e', correct: true, explanation: 'Right. 95,000 × 10.16 = 965,200 kg = 965.2 mtCO₂e.' },
          { text: '~9,650 mtCO₂e', correct: false, explanation: 'Off by 10× the other way.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: international student travel',
        scenario: 'KUA has ~50 international students. Each takes one round-trip flight per year to East Asia. DEFRA factor: 0.195 kg CO₂e/passenger-km (with radiative forcing). One-way: ~7,500 km.',
        given: [
          { label: 'Students', value: '50' },
          { label: 'Round trips', value: '1 each' },
          { label: 'One-way distance', value: '7,500 km' },
          { label: 'DEFRA factor', value: '0.195 kg CO₂e / passenger-km' },
        ],
        question: 'Annual total:',
        options: [
          { text: '~73 mtCO₂e', correct: false, explanation: 'Forgot to multiply by 2 (round trip)?' },
          { text: '~146 mtCO₂e', correct: true, explanation: 'Right. 50 × 7,500 × 2 × 0.195 / 1,000 = 146.25 mtCO₂e/yr.' },
          { text: '~580 mtCO₂e', correct: false, explanation: 'Too high. Recheck.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: per-student net footprint',
        scenario: 'KUA gross: ~4,150 mtCO₂e. Sequestration: ~3,000 mtCO₂e. Enrollment: ~600 students.',
        given: [
          { label: 'Gross', value: '4,150 mtCO₂e/yr' },
          { label: 'Sequestration', value: '3,000 mtCO₂e/yr' },
          { label: 'Students', value: '600' },
        ],
        question: 'Net per student:',
        options: [
          { text: '~1.9 mtCO₂e/student', correct: true, explanation: 'Right. Net = 1,150. Per student = 1,150/600 = 1.92 mtCO₂e.' },
          { text: '~6.9 mtCO₂e/student', correct: false, explanation: 'You divided GROSS by students.' },
          { text: '~4.2 mtCO₂e/student', correct: false, explanation: 'Almost — that\'s the gross-only per student.' },
        ],
      },
      {
        type: 'math',
        heading: 'AP Stats: propagating uncertainty',
        scenario: 'Suppose Scope 1 has ±25% uncertainty (1,000 ± 250 mt), Scope 3 ±40% (3,000 ± 1,200), and Sinks ±33% (3,000 ± 1,000). Assuming independent errors, the combined uncertainty isn\'t the simple sum — it\'s the square root of the sum of squares (quadrature). Estimate the net uncertainty.',
        given: [
          { label: 'σ(Scope 1)', value: '±250 mt' },
          { label: 'σ(Scope 3)', value: '±1,200 mt' },
          { label: 'σ(Sinks)', value: '±1,000 mt' },
          { label: 'Combined formula', value: 'σ_total = √(σ₁² + σ₃² + σ_S²)' },
        ],
        question: 'Approximate net uncertainty:',
        options: [
          { text: '±250 mt', correct: false, explanation: 'Just the smallest source — not how independent errors combine.' },
          { text: '±2,450 mt (linear sum)', correct: false, explanation: 'That assumes errors all push the same way. For independent random errors, the quadrature sum is smaller.' },
          { text: '±1,580 mt', correct: true, explanation: 'Right. √(250² + 1,200² + 1,000²) = √(62,500 + 1.44M + 1M) = √2,502,500 ≈ 1,582 mt. Note that the largest source (Scope 3) dominates — uncertainty in small terms barely matters. AP Stats students recognize this as the formula for combining standard deviations of independent variables.' },
        ],
      },
      {
        type: 'quiz',
        question: 'KUA\'s ~1.9 mtCO₂e/student. How does that compare to peer boarding schools?',
        options: [
          { text: 'About the same', correct: false, explanation: 'Most peer boarding schools are 6–10 mt/student because they don\'t count sinks.' },
          { text: 'Lower than peers', correct: true, explanation: 'Right. Phillips Exeter ~10, Andover ~9. KUA looks lower mostly because we measure on-campus sequestration.' },
          { text: 'Higher than peers', correct: false, explanation: 'Boarding schools have similar gross emissions; the difference is whether sinks are measured.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You can verify the dashboard yourself',
        body: 'Net ~1,150 mt/yr ± ~1,580 (combined uncertainty). 72% of gross from Scope 3. Per student ~1.9 mt. Every claim is reproducible from primary inputs and basic arithmetic — and you now know how to combine the uncertainties on those inputs into a defensible total.',
      },
    ],
  },

  {
    id: 'photosynthesis',
    title: 'From photosynthesis to forest carbon',
    desc: 'Light vs dark reactions, Calvin cycle stoichiometry, GPP/NPP, allometric biomass.',
    subject: 'AP Bio',
    level: 'ap',
    estMin: 12,
    steps: [
      {
        type: 'concept',
        heading: 'The reaction you already know — at the right detail',
        body: 'Net photosynthesis: 6 CO₂ + 6 H₂O + light energy → C₆H₁₂O₆ + 6 O₂. But this hides two distinct stages.',
      },
      {
        type: 'concept',
        heading: 'AP Bio: light reactions vs Calvin cycle',
        body: 'The light reactions (in the thylakoid membrane) split water (photolysis), pump H⁺ into the thylakoid lumen, and produce ATP and NADPH. The Calvin cycle (in the stroma) USES that ATP and NADPH to fix CO₂ into G3P, which becomes glucose. The net stoichiometry: producing one G3P (a 3-carbon sugar) requires fixing 3 CO₂, using 9 ATP and 6 NADPH. Two G3P combine to make one glucose — so glucose costs 18 ATP and 12 NADPH from the light reactions.',
      },
      {
        type: 'quiz',
        question: 'In the Calvin cycle, what enzyme catalyzes the initial fixation of CO₂?',
        options: [
          { text: 'ATP synthase', correct: false, explanation: 'ATP synthase makes ATP from ADP + Pi using a proton gradient — it\'s in the light reactions.' },
          { text: 'RuBisCO (rubisco)', correct: true, explanation: 'Right. Ribulose-1,5-bisphosphate carboxylase/oxygenase fixes CO₂ onto a 5-carbon sugar (RuBP) to form two 3-carbon molecules (3-PGA). It\'s the most abundant protein on Earth — and it\'s remarkably slow and inefficient, which is why C4 plants evolved a CO₂-concentrating workaround.' },
          { text: 'NADP reductase', correct: false, explanation: 'NADP reductase produces NADPH in the light reactions, not Calvin cycle.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Bio: GPP, R, NPP — the ecosystem-level math',
        body: 'Gross Primary Productivity (GPP): total carbon fixed by photosynthesis per unit time. Plant Respiration (R_a, autotrophic): some of that carbon is burned back to CO₂ to fuel the plant\'s own metabolism. Net Primary Productivity (NPP) = GPP − R_a. NPP is what becomes new biomass — the part that actually grows the tree. For a typical temperate forest, R_a ≈ 50% of GPP, so NPP ≈ 0.5 GPP.',
      },
      {
        type: 'math',
        heading: 'Math: NPP from biomass accumulation',
        scenario: 'A KUA forest stand accumulates 2.0 metric tons of dry biomass per acre per year. About 50% of biomass is carbon by mass. The forest\'s autotrophic respiration is roughly equal to its NPP. Estimate the GPP for this stand in mtC/acre/yr.',
        given: [
          { label: 'Annual biomass accumulation', value: '2.0 mt/acre/yr' },
          { label: 'Carbon fraction', value: '50%' },
          { label: 'NPP = biomass × C fraction', value: '' },
          { label: 'R_a ≈ NPP', value: '' },
          { label: 'GPP = NPP + R_a', value: '' },
        ],
        question: 'Approximate GPP:',
        options: [
          { text: '~1.0 mtC/acre/yr', correct: false, explanation: 'You stopped at NPP — but the question asks for GPP, which adds back the respired carbon.' },
          { text: '~2.0 mtC/acre/yr', correct: true, explanation: 'Right. NPP = 2.0 × 0.5 = 1.0 mtC/acre/yr. R_a ≈ NPP = 1.0. GPP = NPP + R_a = 2.0 mtC/acre/yr. Roughly half of all carbon a forest fixes goes to fueling its own metabolism — the other half becomes new wood, leaves, and roots.' },
          { text: '~0.5 mtC/acre/yr', correct: false, explanation: 'Too low. Biomass accumulation IS NPP, before subtracting respiration from GPP.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Bio: C3, C4, and CAM photosynthesis',
        body: 'Most temperate trees (including KUA\'s maples and oaks) are C3 — they fix CO₂ directly via RuBisCO. RuBisCO occasionally fixes O₂ instead of CO₂ (photorespiration), which wastes energy. C4 plants (corn, sugarcane) use a CO₂-concentrating spatial mechanism with PEP carboxylase to suppress photorespiration. CAM plants (cacti, pineapple) do it temporally — opening stomata at night to minimize water loss. C4 and CAM are evolutionary adaptations to hot, dry, or low-CO₂ environments. Climate change is shifting the C3/C4 balance regionally.',
      },
      {
        type: 'concept',
        heading: 'Carbon → CO₂ conversion',
        body: 'Biomass is ~50% C by dry mass. C atomic mass = 12; CO₂ molar mass = 44. So 1 g of biomass-carbon corresponds to 44/12 ≈ 3.67 g of CO₂ pulled from the atmosphere.',
      },
      {
        type: 'math',
        heading: 'Math: biomass to CO₂',
        scenario: 'A maple tree gains 12 kg of dry biomass over one growing season. Calculate the CO₂ pulled from the atmosphere.',
        given: [
          { label: 'Biomass gained', value: '12 kg dry weight' },
          { label: 'Carbon fraction', value: '50%' },
          { label: 'C → CO₂', value: '× 44/12' },
        ],
        question: 'CO₂ pulled:',
        options: [
          { text: '~6 kg CO₂', correct: false, explanation: 'You stopped at carbon mass.' },
          { text: '~22 kg CO₂', correct: true, explanation: 'Right. 12 × 0.50 = 6 kg C. 6 × 44/12 = 22 kg CO₂.' },
          { text: '~44 kg CO₂', correct: false, explanation: 'Forgot the carbon fraction (×0.5).' },
        ],
      },
      {
        type: 'concept',
        heading: 'DBH and allometric scaling',
        body: 'DBH (diameter at breast height, 1.3 m above ground) is the standard forestry measurement. Species-specific allometric equations convert DBH into total above-ground biomass, including roots and branches. Jenkins-style equations have form: biomass = exp(β₀ + β₁ × ln(DBH)).',
      },
      {
        type: 'math',
        heading: 'Math: a Jenkins-style allometric',
        scenario: 'Jenkins (2003) for mixed hardwoods: biomass (kg) = exp(−2.4800 + 2.4835 × ln(DBH_cm)). A KUA sugar maple has DBH = 50 cm. Estimate its total stored CO₂.',
        given: [
          { label: 'DBH', value: '50 cm' },
          { label: 'ln(50)', value: '≈ 3.912' },
          { label: 'biomass formula', value: 'exp(−2.48 + 2.4835 × ln(DBH))' },
          { label: 'C fraction', value: '0.5' },
          { label: 'C → CO₂', value: '44/12' },
        ],
        question: 'Approximately how much CO₂ is stored in this single mature tree?',
        options: [
          { text: '~150 kg CO₂', correct: false, explanation: 'Too low. Recheck the exp() result.' },
          { text: '~2,500 kg CO₂', correct: true, explanation: 'Right (within ~20%). −2.48 + 2.4835 × 3.912 ≈ 7.23. exp(7.23) ≈ 1,380 kg biomass. × 0.5 = 690 kg C. × 44/12 = ~2,530 kg CO₂. Roughly 2 metric tons stored in one mature maple.' },
          { text: '~50,000 kg CO₂', correct: false, explanation: 'Way too high. The Jenkins formula gives biomass in kg, not tons.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Above ground vs below ground',
        body: 'Average US forest holds 41% of carbon above ground and 59% below ground (roots and soil organic carbon). The soil pool is overlooked but huge — and most at risk when land is disturbed. Disturbance (clearing, plowing, paving) accelerates microbial respiration of the soil organic matter, releasing carbon stored over centuries.',
      },
      {
        type: 'quiz',
        question: 'Why does paving over a forest release MORE carbon than just letting trees stand and decay naturally?',
        options: [
          { text: 'Pavement temperature is irrelevant — the release comes from biology', correct: true, explanation: 'Right. The trees go into a pile or landfill, releasing carbon over years. PLUS the soil carbon that took centuries to build releases as the disturbed soil decomposes faster. Total release per acre: 200–400 mtCO₂e over years. Unmanaged decay would have stored some of that carbon back into soil instead.' },
          { text: 'Pavement is dark and absorbs heat', correct: false, explanation: 'Surface temperature isn\'t the carbon mechanism.' },
          { text: 'They release the same amount', correct: false, explanation: 'Disturbing the soil dramatically accelerates carbon loss.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: KUA\'s forest annual sequestration',
        scenario: 'KUA has ~1,000 acres of forested land. Use Birdsey (1992) US average rate: 1,252 lb C/acre/yr. Convert to mtCO₂e/yr.',
        given: [
          { label: 'Forested area', value: '1,000 acres' },
          { label: 'Birdsey rate', value: '1,252 lb C/acre/yr' },
          { label: 'lb → kg', value: '× 0.4536' },
          { label: 'C → CO₂', value: '× 44/12' },
        ],
        question: 'Annual sequestration:',
        options: [
          { text: '~570 mtCO₂e/yr', correct: false, explanation: 'Stopped at C mass — multiply by 44/12.' },
          { text: '~2,083 mtCO₂e/yr', correct: true, explanation: 'Right. 1,000 × 1,252 × 0.4536 / 1,000 = 568 mtC × 44/12 = 2,083 mtCO₂e/yr (Birdsey conservative end). Dashboard mid-estimate of ~3,000 blends with the higher Nowak rate for open-grown trees.' },
          { text: '~10,000 mtCO₂e/yr', correct: false, explanation: 'Recheck lb → kg conversion.' },
        ],
      },
      {
        type: 'finish',
        heading: 'AP Bio at ecosystem scale',
        body: 'Light reactions → ATP/NADPH → Calvin cycle → C fixation. GPP minus respiration equals NPP — the new biomass. C3 vs C4 vs CAM are the three evolutionary photosynthetic strategies. DBH gives biomass; biomass × 0.5 = carbon; × 44/12 = CO₂. KUA\'s forest pulls roughly 2,000 mtCO₂e/yr conservatively, ~3,000 mid-estimate.',
      },
    ],
  },

  {
    id: 'energy-grid',
    title: 'Energy and the New England grid',
    desc: 'Carnot efficiency, capacity factors, heat pump physics, kWh sizing, AP Physics applications.',
    subject: 'AP Physics 2',
    level: 'ap',
    estMin: 13,
    steps: [
      {
        type: 'concept',
        heading: 'AP Physics: power vs energy',
        body: 'Power (watts) = energy per unit time. Energy (joules, kWh) = power × time. A 100 W bulb running 10 hours uses 1,000 Wh = 1 kWh. A 200 kW solar array could PRODUCE energy at 200 kW for some hours but not all — that\'s why we need capacity factors. Confusing power with energy is the most common AP Physics mistake when sizing systems.',
      },
      {
        type: 'concept',
        heading: 'The grid is a balancing act, every second',
        body: 'Electricity can\'t be stored at scale on most grids. Supply and demand must match instantaneously, or frequency drifts and protective relays trip plants offline. ISO New England coordinates dozens of generators in real time.',
      },
      {
        type: 'concept',
        heading: 'New England grid mix 2024',
        body: 'Natural gas: 51%. Nuclear: 23%. Renewables (solar/wind/biomass): ~14%. Net imports (mostly Canadian hydro): ~12%. Coal/oil: <1%.',
      },
      {
        type: 'quiz',
        question: 'Why does the grid emission factor change throughout the day?',
        options: [
          { text: 'Different generators run at different times', correct: true, explanation: 'Right. At 3am, baseload (nuclear, hydro, wind) covers low demand. At 6pm summer evening, gas peakers fire up to meet demand. The marginal kWh changes with time of day.' },
          { text: 'The factor is constant year-round', correct: false, explanation: 'No.' },
          { text: 'The grid runs only nuclear at night', correct: false, explanation: 'Oversimplification.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Physics: capacity factor',
        body: 'A 100 kW nameplate solar array could generate 100 kW × 8,760 hr = 876 MWh/year if running at full output 24/7. It can\'t — clouds, night, seasonal angle. Capacity factor = actual ÷ theoretical max. NH solar: 13–16%. Onshore wind in NE: 25–35%. Nuclear: 90%+. Gas peakers: 5–15%. The capacity factor lets you compare a 100 MW solar farm to a 100 MW gas plant — they don\'t produce the same energy.',
      },
      {
        type: 'math',
        heading: 'Math: solar array annual output',
        scenario: 'KUA installs a 200 kW solar array on a dorm rooftop. Plainfield NH has a typical capacity factor of 14%. How many kWh of electricity will it produce in one year?',
        given: [
          { label: 'Nameplate', value: '200 kW' },
          { label: 'Capacity factor', value: '14% = 0.14' },
          { label: 'Hours per year', value: '8,760' },
        ],
        question: 'Annual electricity production:',
        options: [
          { text: '~24,500 kWh', correct: false, explanation: 'Too low by an order of magnitude.' },
          { text: '~245,000 kWh', correct: true, explanation: 'Right. 200 × 8,760 × 0.14 = 245,280 kWh. About 10% of KUA\'s total annual electricity from one rooftop.' },
          { text: '~1.75M kWh', correct: false, explanation: 'Forgot the capacity factor.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: avoided grid emissions from that solar',
        scenario: 'The 245,000 kWh from your rooftop solar is mostly self-consumed by KUA, displacing grid electricity. The ISO-NE 2024 grid factor is 643 lb CO₂/MWh.',
        given: [
          { label: 'Self-consumed solar', value: '245,000 kWh' },
          { label: 'Grid factor', value: '643 lb CO₂ / MWh' },
          { label: 'lb → kg', value: '× 0.4536' },
        ],
        question: 'Annual avoided emissions:',
        options: [
          { text: '~7 mtCO₂e/yr', correct: false, explanation: 'Off by 10×.' },
          { text: '~71 mtCO₂e/yr', correct: true, explanation: 'Right. 245 MWh × 643 lb/MWh = 157,535 lb × 0.4536 = 71,458 kg ≈ 71.5 mtCO₂e. About a third of KUA\'s entire Scope 2.' },
          { text: '~700 mtCO₂e/yr', correct: false, explanation: 'Way too high.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Physics: heat pumps as reversed Carnot engines',
        body: 'A heat engine takes heat from a hot reservoir, does work, and dumps cooler heat to a cold reservoir. Carnot efficiency is η = 1 − T_cold/T_hot (in Kelvin). A heat pump runs the cycle backward — uses work to MOVE heat from cold (outdoors) to hot (indoors). Its theoretical max COP_heating = T_hot / (T_hot − T_cold). At 0°C (273 K) outdoors and 22°C (295 K) indoors: theoretical max COP ≈ 295/22 ≈ 13.4. Real heat pumps achieve 2.5–3.5 because of friction, motor losses, defrost cycles, and the temperature lift across the heat exchangers.',
      },
      {
        type: 'math',
        heading: 'Math: theoretical max COP for a cold-day heat pump',
        scenario: 'On a cold New Hampshire day, outdoor temp is −10°C and indoor temp is 22°C. Use the Carnot formula to find the THEORETICAL maximum COP for heating. Then compare to a real cold-climate heat pump that achieves COP 2.5 in those conditions.',
        given: [
          { label: 'T_cold (outdoor)', value: '−10°C = 263 K' },
          { label: 'T_hot (indoor)', value: '22°C = 295 K' },
          { label: 'COP_max formula', value: 'T_hot / (T_hot − T_cold)' },
        ],
        question: 'Theoretical max COP, and how the real 2.5 compares:',
        options: [
          { text: 'Max ~9.2; real 2.5 is ~27% of max', correct: true, explanation: 'Right. COP_max = 295 / (295 − 263) = 295 / 32 ≈ 9.22. A real cold-climate heat pump at COP 2.5 captures about 2.5/9.22 ≈ 27% of the theoretical Carnot maximum. Even at 27% Carnot efficiency, you\'re STILL getting 2.5 kWh of heating per 1 kWh of electricity — because Carnot heat pumps for these temperatures are extremely effective in principle.' },
          { text: 'Max ~3.0; real 2.5 is ~83% of max', correct: false, explanation: 'You may have used the heat-engine formula instead of the heat-pump formula.' },
          { text: 'Max ~1.0; real 2.5 violates physics', correct: false, explanation: 'Heat pumps regularly exceed COP 1 — they don\'t make heat from electricity, they MOVE existing heat. No conservation laws violated.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: heat pump retrofit savings',
        scenario: 'A KUA dorm currently burns 6,000 gallons of heating oil per year through an 80% efficient boiler. Replace it with a cold-climate heat pump (COP 2.5) on the New England grid. Calculate the annual emissions savings.',
        given: [
          { label: 'Heating oil', value: '6,000 gal/yr' },
          { label: 'Oil emission factor', value: '10.16 kg CO₂/gal' },
          { label: 'Oil HHV', value: '138,500 BTU/gal' },
          { label: 'Boiler efficiency', value: '80%' },
          { label: 'Heat pump COP', value: '2.5' },
          { label: 'BTU/kWh', value: '3,412' },
          { label: 'Grid factor', value: '0.292 kg CO₂/kWh' },
        ],
        question: 'Approximate annual savings:',
        options: [
          { text: '~5 mtCO₂e/yr', correct: false, explanation: 'Walk through old vs new emissions separately.' },
          { text: '~38 mtCO₂e/yr', correct: true, explanation: 'Right. OLD: 6,000 × 10.16 = 61 mt. NEW: 6,000 × 138,500 × 0.80 = 665M BTU; ÷ 3,412 = 195,000 kWh thermal; ÷ 2.5 = 78,000 kWh electric; × 0.292 = 22.8 mt. Savings = 61 − 22.8 = 38 mtCO₂e/yr.' },
          { text: '~61 mtCO₂e/yr', correct: false, explanation: 'You assumed the heat pump uses zero energy.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Physics: kinetic energy and wind power',
        body: 'A wind turbine extracts power from moving air. Kinetic energy = ½ m v². For a wind stream through area A at speed v, mass flow rate = ρAv, so power available = ½ρAv³. Power scales with the CUBE of wind speed — doubling wind speed gives 8× the power. This is why wind farms cluster on ridges and coasts. The Betz limit says at most 16/27 ≈ 59% of that available power can be extracted; real turbines reach 35–45%.',
      },
      {
        type: 'concept',
        heading: 'Intermittency isn\'t fatal',
        body: 'A common myth: "renewables are too intermittent to run a grid." Texas (50%+ renewable on many days), California (60%+ on sunny days), Iowa (55%+ wind annually) prove the engineering is solvable. Recipe: geographic diversification, transmission, storage, demand response, overbuilding.',
      },
      {
        type: 'finish',
        heading: 'You can size projects yourself',
        body: 'Solar output = nameplate × hours × capacity factor. Avoided emissions = kWh × grid factor. Heat pump output = electricity × COP, with theoretical max set by Carnot. Wind power scales as v³, capped by Betz. With these formulas you can roughly size and evaluate any electrification project.',
      },
    ],
  },

  {
    id: 'compare',
    title: 'How KUA compares',
    desc: 'Why peer comparisons are tricky, and what they actually show.',
    subject: 'APES · AP Stats',
    level: 'standard',
    estMin: 4,
    steps: [
      {
        type: 'concept',
        heading: 'The peer chart shows shape, not just totals',
        body: 'Each bar splits a school\'s per-student emissions by scope, with sinks and offsets to the LEFT of zero. Boarding-secondary peers cluster on a similar shape (heavy heating + heavy travel). Middlebury\'s "net zero" turns out to be purchased offsets, not physical removal.',
      },
      {
        type: 'quiz',
        question: 'Why is comparing schools\' carbon numbers tricky?',
        options: [
          { text: 'Different scope inclusion', correct: true, explanation: 'Right. Scope 3 inclusion, denominators (FTE vs headcount), offset treatment all vary. Valls-Val & Bovea (2021) reviewed 35 university footprint studies and found this exact problem.' },
          { text: 'Different climates', correct: false, explanation: 'Climate matters but isn\'t the main reason.' },
          { text: 'Different student counts', correct: false, explanation: 'Schools normalize per-student.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: same school, different methodology',
        scenario: 'Two schools have IDENTICAL physical operations: 600 students, 4,150 mtCO₂e gross, 3,000 mtCO₂e of forest sequestration. School A reports the net (subtracts sinks). School B reports gross only.',
        given: [
          { label: 'Gross (both)', value: '4,150 mtCO₂e' },
          { label: 'Sequestration (real)', value: '3,000 mtCO₂e' },
          { label: 'Students (both)', value: '600' },
        ],
        question: 'Difference in published per-student footprint:',
        options: [
          { text: 'Both publish ~1.9 mt/student', correct: false, explanation: 'Only A subtracts sinks.' },
          { text: 'A: ~1.9 mt; B: ~6.9 mt — same campus, very different number', correct: true, explanation: 'Right. A: (4,150 − 3,000) / 600 = 1.92. B: 4,150 / 600 = 6.92. Same physical campus, 3.6× higher because Sinks are excluded. This is the Valls-Val & Bovea (2021) finding in one example.' },
          { text: 'Both publish ~6.9 mt', correct: false, explanation: 'A subtracted sinks first.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Middlebury\'s "net zero" is not the same as KUA\'s drawdown',
        body: 'Middlebury reports as carbon-neutral by purchasing offsets equal to gross emissions. The CO₂ molecules they emit still go up; they paid someone else to remove an equal amount somewhere else. KUA\'s 3,000 mtCO₂e/yr from the campus forest is physical — those molecules are actually pulled out, on KUA land.',
      },
      {
        type: 'concept',
        heading: 'AP Stats: when comparison is and isn\'t valid',
        body: 'A valid comparison requires consistent measurement methodology. Comparing two schools with different scope inclusions is like comparing GPA systems with different scales. AP Stats students recognize this as confounding by methodology — the difference in published numbers might reflect real differences, OR just measurement choices. The Valls-Val & Bovea (2021) finding that 35 university studies use inconsistent methods means cross-study meta-analysis requires careful normalization.',
      },
      {
        type: 'finish',
        heading: 'Comparison context, not a leaderboard',
        body: 'KUA\'s shape (heavy travel + green sinks bar) is structurally normal for a NH boarding school. Methodology determines whether two schools with the same physical footprint look 3× different on paper.',
      },
    ],
  },

  {
    id: 'actions',
    title: 'What actually changes the number',
    desc: 'Action levers ranked by impact, with cost-effectiveness and ROI math.',
    subject: 'APES · economics',
    level: 'standard',
    estMin: 6,
    steps: [
      {
        type: 'concept',
        heading: 'Some actions matter much more than others',
        body: 'A student who turns off lights, a heat-pump retrofit, one fewer round-trip flight per international student — all reduce emissions, but by very different amounts. Magnitudes matter when you decide what to spend time on.',
      },
      {
        type: 'quiz',
        question: 'Which has the biggest annual impact on KUA\'s carbon footprint?',
        options: [
          { text: 'Student turning off dorm lights', correct: false, explanation: 'Tiny — about 0.005 mtCO₂e per LED bulb saved.' },
          { text: 'One fewer round-trip flight per international student', correct: true, explanation: 'Right. 50 × 1 × 2.93 = 146 mtCO₂e/yr.' },
          { text: 'Composting in dining hall', correct: false, explanation: 'Real but smaller — ~10–24 mt/yr at full diversion.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: stack-rank three reduction levers',
        scenario: '(a) Heat pump retrofit on one dorm using 6,000 gal/yr oil → ~38 mt savings. (b) LED retrofit cutting electricity 12% from current 2.3M kWh. (c) 30 international students take 1 fewer round trip to East Asia.',
        given: [
          { label: '(a) Heat pump', value: '~38 mt savings' },
          { label: '(b) LED retrofit', value: '12% × 2.3M kWh × 0.292 kg/kWh' },
          { label: '(c) 30 students × 1 fewer trip', value: '× ~2.93 mtCO₂e per trip' },
        ],
        question: 'Order biggest to smallest:',
        options: [
          { text: '(c) > (b) > (a)', correct: true, explanation: 'Right. (c) = 30 × 2.93 ≈ 88 mt. (b) = 0.12 × 2,300,000 × 0.292 / 1,000 ≈ 81 mt. (a) = 38 mt.' },
          { text: '(a) > (b) > (c)', correct: false, explanation: 'Heat pump is real but smallest at this scale.' },
          { text: '(b) > (a) > (c)', correct: false, explanation: 'Recheck (c) — 30 × 3 ≈ 88 mt.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: cost-effectiveness ($/ton CO₂ avoided)',
        scenario: 'Suppose the heat-pump retrofit costs $80,000 (net of fuel-cost savings) and reduces emissions by 38 mtCO₂e/yr for 20 years. The LED retrofit costs $40,000 and saves 50 mtCO₂e/yr for 15 years. Calculate $ per ton CO₂ avoided for each, ignoring discounting.',
        given: [
          { label: 'Heat pump cost', value: '$80,000' },
          { label: 'Heat pump savings', value: '38 mt/yr × 20 yrs = 760 mt' },
          { label: 'LED cost', value: '$40,000' },
          { label: 'LED savings', value: '50 mt/yr × 15 yrs = 750 mt' },
        ],
        question: 'Approximate $/ton CO₂ avoided:',
        options: [
          { text: 'Heat pump ~$105/ton; LED ~$53/ton', correct: true, explanation: 'Right. Heat pump: $80K / 760 mt ≈ $105/ton. LED: $40K / 750 mt ≈ $53/ton. The LED retrofit is roughly 2× more cost-effective per ton avoided. This is how a "marginal abatement cost curve" gets built — order interventions by $/ton, do the cheap ones first.' },
          { text: 'Heat pump ~$2,100/ton; LED ~$800/ton', correct: false, explanation: 'You divided by yearly savings, not lifetime savings. Multiply the annual savings by the project lifetime first.' },
          { text: 'Heat pump ~$50/ton; LED ~$80/ton', correct: false, explanation: 'You may have inverted the ratios.' },
        ],
      },
      {
        type: 'concept',
        heading: 'The biggest individual lever: travel',
        body: 'A long-haul economy round-trip from East Asia produces ~3 mtCO₂e per passenger. If 50 international students replace one trip with extended on-campus stay, that\'s 146 mtCO₂e/yr — about 12% of KUA\'s entire net balance.',
      },
      {
        type: 'concept',
        heading: 'The biggest infrastructural lever: heat pumps',
        body: 'Replacing a single 6,000-gal/year oil boiler with a cold-climate heat pump (COP 2.5) saves ~38 mtCO₂e/yr per dorm.',
      },
      {
        type: 'concept',
        heading: 'The biggest sink lever: don\'t pave the forest',
        body: 'Each acre of forest converted to pavement releases ~500–2,000 mtCO₂e cumulatively over decades. Preventing even one such conversion is more valuable than years of dorm-electricity efficiency upgrades.',
      },
      {
        type: 'concept',
        heading: 'Rebound effect (Jevons paradox) — APES vocabulary',
        body: 'When efficiency goes up, sometimes total consumption goes up too. LED bulbs use less electricity per bulb, so people install more bulbs. Better gas mileage encourages more driving. This is the rebound effect — a piece of the energy-efficiency picture economists and policymakers fight about. Real-world rebound effects are usually 10–40% of the engineered savings, not 100%, but they\'re not zero either.',
      },
      {
        type: 'finish',
        heading: 'Magnitude AND cost matter',
        body: 'Action recommendations come with order-of-magnitude impact ranges plus $/ton estimates so you can see what moves the needle AND what each ton costs. Open any scope page and click "Show data + math" on a lever to see the calculation.',
      },
    ],
  },

  {
    id: 'personal-action',
    title: 'What can YOU change?',
    desc: 'Personal-scale actions ranked by impact — dorm life, food, travel, civic engagement.',
    subject: 'Civics · personal finance',
    level: 'standard',
    estMin: 9,
    steps: [
      {
        type: 'concept',
        heading: 'Individual action — the honest answer',
        body: 'No single student\'s choices solve climate change. But high-emitting individuals (frequent flyers, big homes, beef-heavy diets) have outsized footprints, and choices send market signals. Cordero et al. (2020) tracked students who calculated their own footprints and found measurable behavior changes years later. The educational value is real even when per-person tons are small.',
      },
      {
        type: 'concept',
        heading: 'For KUA students, travel is the biggest lever',
        body: 'A student\'s personal annual footprint at KUA might be 5–8 mtCO₂e. A single intercontinental round-trip is ~3. Domestic flight: ~1. Driving 1,000 miles: ~0.4. Train BOS↔NYC: ~0.05.',
      },
      {
        type: 'math',
        heading: 'Math: drive vs fly for 700 miles',
        scenario: 'Round trip 700 miles. (a) Solo drive in a 25 mpg car. (b) Domestic flight, economy. Gasoline = 8.78 kg CO₂/gal. Short-haul air = 0.395 kg CO₂e/passenger-mi.',
        given: [
          { label: 'Distance', value: '700 mi' },
          { label: 'Car MPG', value: '25' },
          { label: 'Gasoline factor', value: '8.78 kg/gal' },
          { label: 'Air factor', value: '0.395 kg/passenger-mi' },
        ],
        question: 'Which is lower, and by how much?',
        options: [
          { text: 'Drive: 246 kg, Fly: 277 kg — fly is slightly worse solo', correct: true, explanation: 'Right. DRIVE: 700/25 × 8.78 = 245.8 kg. FLY: 700 × 0.395 = 276.5 kg. Driving wins by ~30 kg solo. With 2-3 passengers, driving wins by a lot more (per passenger). Below ~500 mi, driving usually wins; above ~1,000 mi, flying often wins on CO₂.' },
          { text: 'Drive: 24 kg', correct: false, explanation: 'You divided by 25 then forgot to multiply by the gas factor.' },
          { text: 'Both ~280 kg', correct: false, explanation: 'Close but not equal.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Food choices — pound-for-pound',
        body: '1 kg beef ≈ 60 kg CO₂e. 1 kg chicken: ~6. 1 kg rice: ~4 (mostly methane from paddy fields). 1 kg beans: ~0.9. 1 kg potatoes: ~0.4. Ruminant meat is roughly 10× chicken and 50–100× plant foods.',
      },
      {
        type: 'math',
        heading: 'Math: a year of beef-to-chicken meal swaps',
        scenario: 'A student eats 2 beef-burger meals per week (each ~150 g of beef) over 36 school weeks, and switches HALF to chicken (same 150 g portion).',
        given: [
          { label: 'Meals/week swapped', value: '1 (half of 2)' },
          { label: 'School weeks', value: '36' },
          { label: 'Beef per meal', value: '0.15 kg' },
          { label: 'Beef factor', value: '60 kg CO₂e/kg' },
          { label: 'Chicken factor', value: '6 kg CO₂e/kg' },
        ],
        question: 'Annual savings from this one swap:',
        options: [
          { text: '~3 kg CO₂e', correct: false, explanation: 'Way too low.' },
          { text: '~292 kg CO₂e', correct: true, explanation: 'Right. 36 swaps × 0.15 kg × (60 − 6) = 36 × 8.1 = 291.6 kg CO₂e ≈ 0.29 mt. One student over four years saves ~1.2 mt just from one weekly swap.' },
          { text: '~3,000 kg CO₂e', correct: false, explanation: 'Used the full beef factor instead of the difference.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which has the biggest carbon footprint per pound?',
        options: [
          { text: 'Beef', correct: true, explanation: 'Right. Cattle digestion produces methane; cattle take more land and feed. Beef is ~10× chicken and 50–100× plant foods.' },
          { text: 'Chicken', correct: false, explanation: 'Chicken is much lower than beef.' },
          { text: 'Wheat', correct: false, explanation: 'Plant foods are usually lowest.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Dorm-scale choices',
        body: 'Turning off lights and electronics: small but free. Setting your radiator one notch lower in winter: real impact across a year. Showering shorter: water+heating savings. Reusable over disposable: avoids the upstream emissions baked into single-use products.',
      },
      {
        type: 'math',
        heading: 'Math: cost per ton avoided — your personal portfolio',
        scenario: 'Three choices: (a) skip 1 international round trip (saves 3 mtCO₂e, "costs" 0 dollars but real travel inconvenience). (b) Switch to a vegetarian diet for one year (saves ~1 mtCO₂e, ~$0–$200 cost depending on substitutions). (c) Buy 3 mtCO₂e of high-quality offsets (~$100/ton premium = $300, saves "3 mtCO₂e" on paper).',
        given: [
          { label: '(a) Skip flight', value: '3 mt @ $0' },
          { label: '(b) Vegetarian year', value: '1 mt @ $100' },
          { label: '(c) Buy offsets', value: '3 mt @ $300' },
        ],
        question: 'Which is most cost-effective per mt CO₂ avoided?',
        options: [
          { text: '(a) skip flight — $0/mt', correct: true, explanation: 'Right. (a) costs nothing in dollars. (b) ≈ $100/mt. (c) ≈ $100/mt but is also offsets-not-removal, which means you\'re paying someone else to do something they may or may not actually do. Direct emission reductions you can verify yourself dominate offsets in the cost-effectiveness ranking when you have the choice.' },
          { text: '(c) offsets — fastest', correct: false, explanation: 'Same dollar cost as (b) per mt, but (c) is offsets — you\'re still emitting the gases.' },
          { text: 'They\'re all about the same', correct: false, explanation: 'Skipping a flight is genuinely free in dollars.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Civic action — sometimes more impactful than personal',
        body: 'Voting, organizing, choosing colleges/employers based on climate stance, advocating for institutional change — these can move much larger numbers than your personal footprint. A student who organizes a campus heat-pump retrofit has helped offset hundreds of times their own emissions.',
      },
      {
        type: 'finish',
        heading: 'You have a portfolio of choices',
        body: 'Big lever: travel decisions, especially long-haul flights. Medium: diet patterns, especially red meat. Small (but free): dorm-scale choices. Multiplier: civic and institutional action. None alone is the answer — the portfolio is. Always check $/ton when comparing choices that cost real money.',
      },
    ],
  },
];

const styles = {
  wrap: { maxWidth: 880, margin: '0 auto', padding: '0 16px' },
  card: { background: 'linear-gradient(160deg, #0f172a 0%, #0b1220 100%)', border: '1px solid #1f2937', borderRadius: 16, padding: '32px 36px', borderLeft: '3px solid #06b6d4' },
  intro: { marginBottom: 24 },
  badge: { fontSize: 11, padding: '4px 10px', borderRadius: 4, background: '#155e75', color: '#a5f3fc', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, border: '1px solid #0e7490', display: 'inline-block' },
  title: { fontSize: 28, fontWeight: 700, color: '#e5e7eb', marginTop: 14, lineHeight: 1.3 },
  introBody: { fontSize: 16, color: '#cbd5e1', marginTop: 12, lineHeight: 1.7 },
  pathGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 24 },
  pathCard: { padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, cursor: 'pointer', textAlign: 'left', color: '#e5e7eb' },
  pathHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  pathSubject: { fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 },
  levelBadge: (level) => ({
    fontSize: 10, padding: '3px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap',
    background: level === 'intro' ? '#052e1a' : level === 'standard' ? '#1e3a8a' : '#2e1065',
    color: level === 'intro' ? '#86efac' : level === 'standard' ? '#bfdbfe' : '#d8b4fe',
    border: `1px solid ${level === 'intro' ? '#14532d' : level === 'standard' ? '#1e40af' : '#5b21b6'}`,
  }),
  pathTitle: { fontSize: 17, fontWeight: 700, color: '#e5e7eb' },
  pathDesc: { fontSize: 13, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 },
  pathMeta: { fontSize: 11, color: '#64748b', marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  groupTitle: { fontSize: 13, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, marginTop: 24, marginBottom: 10 },
  groupTitleFirst: { fontSize: 13, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700, marginTop: 8, marginBottom: 10 },
  groupBlurb: { fontSize: 13, color: '#94a3b8', marginBottom: 14, lineHeight: 1.6 },

  progressBar: { height: 4, background: '#1f2937', borderRadius: 2, overflow: 'hidden', marginBottom: 24 },
  progress: (pct) => ({ height: '100%', width: pct + '%', background: 'linear-gradient(90deg, #22d3ee, #3b82f6)', transition: 'width 0.3s' }),
  pathHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, fontSize: 13, color: '#94a3b8' },
  step: { minHeight: 240 },
  stepHeading: { fontSize: 22, fontWeight: 700, color: '#e5e7eb', lineHeight: 1.3 },
  stepBody: { fontSize: 16, color: '#cbd5e1', lineHeight: 1.8, marginTop: 14 },
  question: { fontSize: 18, fontWeight: 600, color: '#e5e7eb', marginBottom: 16, lineHeight: 1.4 },
  optionList: { display: 'grid', gap: 10 },
  option: (state) => ({
    padding: '14px 16px', background: state === 'correct' ? '#052e1a' : state === 'wrong' ? '#3a0d0d' : '#0b1220',
    border: `1px solid ${state === 'correct' ? '#14532d' : state === 'wrong' ? '#7f1d1d' : '#334155'}`,
    borderRadius: 8, color: state === 'correct' ? '#86efac' : state === 'wrong' ? '#fca5a5' : '#e5e7eb',
    cursor: state ? 'default' : 'pointer', fontSize: 15, fontWeight: 500, textAlign: 'left', transition: 'background 0.15s, border-color 0.15s',
  }),
  explanation: { marginTop: 14, padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },

  mathBadge: { display: 'inline-block', fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#3a2a0d', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, border: '1px solid #92400e', marginBottom: 12 },
  scenario: { fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 14 },
  givenBox: { padding: '12px 14px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 8, marginBottom: 16 },
  givenLabel: { fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 },
  givenList: { display: 'grid', gap: 4 },
  givenRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#cbd5e1' },
  givenK: { color: '#94a3b8' },
  givenV: { color: '#e5e7eb', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontWeight: 500 },

  buttons: { marginTop: 28, display: 'flex', gap: 12, justifyContent: 'space-between' },
  primary: { padding: '10px 20px', background: '#06b6d4', color: '#0b1220', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  secondary: { padding: '10px 20px', background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  done: { padding: 28, background: '#052e1a', border: '1px solid #14532d', borderRadius: 12, textAlign: 'center', color: '#86efac' },
  doneTitle: { fontSize: 24, fontWeight: 700 },
  doneBody: { fontSize: 16, color: '#cbd5e1', marginTop: 12, lineHeight: 1.7 },
};

export function LearnAgent() {
  const [activePathId, setActivePathId] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answer, setAnswer] = useState(null);

  const path = paths.find((p) => p.id === activePathId);
  const step = path && path.steps[stepIdx];
  const totalSteps = path ? path.steps.length : 0;
  const progress = path ? ((stepIdx + 1) / totalSteps) * 100 : 0;

  const startPath = (id) => { setActivePathId(id); setStepIdx(0); setAnswer(null); };
  const reset = () => { setActivePathId(null); setStepIdx(0); setAnswer(null); };
  const next = () => { setAnswer(null); setStepIdx((i) => i + 1); };
  const prev = () => { setAnswer(null); setStepIdx((i) => Math.max(0, i - 1)); };
  const choose = (i, opt) => { setAnswer({ idx: i, correct: opt.correct }); };

  if (!path) {
    return (
      <div style={styles.wrap}>
        <section style={styles.card}>
          <div style={styles.intro}>
            <span style={styles.badge}>AI learning agent</span>
            <h2 style={styles.title}>Pick a path that matches where you are.</h2>
            <p style={styles.introBody}>
              Eleven learning paths organized by difficulty. <strong>Intro</strong> paths are for
              anyone — short, no math, plain language. <strong>Standard</strong> paths add real
              numbers and walk through KUA\'s data. <strong>AP-Level</strong> paths go deep with
              chemistry, biology, physics, and statistics math at the AP framework level.
            </p>
          </div>

          {[
            { level: 'intro',    title: 'Start here', blurb: 'Short, no math required. Anyone can learn the basics in a few minutes.' },
            { level: 'standard', title: 'Standard',  blurb: 'KUA-specific data with calculations you can verify. Mix of concept and worked math.' },
            { level: 'ap',       title: 'AP-level deep dives', blurb: 'Chemistry, biology, physics, and statistics math at AP framework rigor. For students who want to derive every number from first principles.' },
          ].map((group, gi) => {
            const groupPaths = paths.filter((p) => p.level === group.level);
            if (groupPaths.length === 0) return null;
            return (
              <div key={group.level}>
                <div style={gi === 0 ? styles.groupTitleFirst : styles.groupTitle}>{group.title}</div>
                <p style={styles.groupBlurb}>{group.blurb}</p>
                <div style={styles.pathGrid}>
                  {groupPaths.map((p) => (
                    <button key={p.id} type="button" style={styles.pathCard} onClick={() => startPath(p.id)}>
                      <div style={styles.pathHead}>
                        {p.subject && <div style={styles.pathSubject}>{p.subject}</div>}
                        <span style={styles.levelBadge(p.level)}>
                          {p.level === 'intro' ? 'Intro' : p.level === 'standard' ? 'Standard' : 'AP-Level'}
                        </span>
                      </div>
                      <div style={styles.pathTitle}>{p.title}</div>
                      <div style={styles.pathDesc}>{p.desc}</div>
                      <div style={styles.pathMeta}>{p.steps.length} steps · ~{p.estMin} min</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 24, fontStyle: 'italic' }}>
            Currently rule-based — content is curated and the conversation is scripted. The
            architecture supports swapping to an LLM-driven free-form tutor in Phase 3.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.pathHeader}>
          <span><strong style={{ color: '#22d3ee' }}>{path.title}</strong> · step {stepIdx + 1} of {totalSteps}</span>
          <button type="button" style={styles.secondary} onClick={reset}>Pick another path</button>
        </div>
        <div style={styles.progressBar}><div style={styles.progress(progress)} /></div>

        <div style={styles.step}>
          {step.type === 'concept' && (
            <>
              <div style={styles.stepHeading}>{step.heading}</div>
              <p style={styles.stepBody}>{step.body}</p>
            </>
          )}

          {step.type === 'quiz' && (
            <>
              <div style={styles.question}>{step.question}</div>
              <div style={styles.optionList}>
                {step.options.map((opt, i) => {
                  let state = null;
                  if (answer) {
                    if (i === answer.idx) state = answer.correct ? 'correct' : 'wrong';
                    else if (opt.correct && answer && !answer.correct) state = 'correct';
                  }
                  return (
                    <button key={i} type="button" style={styles.option(state)} disabled={!!answer} onClick={() => choose(i, opt)}>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {answer && (
                <div style={styles.explanation}>
                  <strong style={{ color: answer.correct ? '#86efac' : '#fbbf24' }}>
                    {answer.correct ? '✓ Correct.' : '— Not quite.'}
                  </strong>{' '}
                  {step.options[answer.idx].explanation}
                </div>
              )}
            </>
          )}

          {step.type === 'math' && (
            <>
              <div style={styles.mathBadge}>Work it out</div>
              <div style={styles.stepHeading}>{step.heading}</div>
              <p style={styles.scenario}>{step.scenario}</p>
              <div style={styles.givenBox}>
                <div style={styles.givenLabel}>Given</div>
                <div style={styles.givenList}>
                  {step.given.map((g, i) => (
                    <div key={i} style={styles.givenRow}>
                      <span style={styles.givenK}>{g.label}</span>
                      <span style={styles.givenV}>{g.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.question}>{step.question}</div>
              <div style={styles.optionList}>
                {step.options.map((opt, i) => {
                  let state = null;
                  if (answer) {
                    if (i === answer.idx) state = answer.correct ? 'correct' : 'wrong';
                    else if (opt.correct && answer && !answer.correct) state = 'correct';
                  }
                  return (
                    <button key={i} type="button" style={styles.option(state)} disabled={!!answer} onClick={() => choose(i, opt)}>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {answer && (
                <div style={styles.explanation}>
                  <strong style={{ color: answer.correct ? '#86efac' : '#fbbf24' }}>
                    {answer.correct ? '✓ Correct.' : '— Not quite.'}
                  </strong>{' '}
                  {step.options[answer.idx].explanation}
                </div>
              )}
            </>
          )}

          {step.type === 'finish' && (
            <div style={styles.done}>
              <div style={styles.doneTitle}>{step.heading}</div>
              <p style={styles.doneBody}>{step.body}</p>
            </div>
          )}
        </div>

        <div style={styles.buttons}>
          <button type="button" style={styles.secondary} onClick={prev} disabled={stepIdx === 0}>
            ← Back
          </button>
          {stepIdx < totalSteps - 1 ? (
            <button type="button" style={styles.primary} onClick={next} disabled={(step.type === 'quiz' || step.type === 'math') && !answer}>
              {(step.type === 'quiz' || step.type === 'math') && !answer ? 'Pick an answer' : 'Continue →'}
            </button>
          ) : (
            <button type="button" style={styles.primary} onClick={reset}>
              Pick another path
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
