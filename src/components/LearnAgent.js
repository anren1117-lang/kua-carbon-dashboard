import React, { useState } from 'react';

// Curriculum: 8 learning paths covering foundations + chemistry/biology/physics/civics
// deep dives. Each path mixes concept cards, knowledge quizzes, and 'math' scenarios
// where the student is given inputs and works through a calculation.
const paths = [
  {
    id: 'basics',
    title: 'Carbon basics',
    desc: 'What Scope 1, 2, 3 and sinks mean — start here.',
    subject: 'Foundations',
    estMin: 6,
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
          { text: '+1,170 mtCO₂e', correct: false, explanation: 'You added all four together — sinks should be subtracted.' },
          { text: '+530 mtCO₂e', correct: true, explanation: 'Right. Gross = 200 + 150 + 500 = 850. Net = 850 − 320 = 530 mtCO₂e/yr. Net stays positive because gross exceeds sinks.' },
          { text: '+850 mtCO₂e', correct: false, explanation: 'That\'s the gross, not the net. The whole point of measuring sinks is to subtract them.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You\'ve got the framework',
        body: 'Now you know the four buckets: Scope 1 (direct), Scope 2 (electricity), Scope 3 (indirect), and Sinks (drawdown). Every number on this dashboard fits into one of them, and you can do the kWh-to-mtCO₂e and gross-to-net math to verify any total.',
      },
    ],
  },

  {
    id: 'greenhouse-science',
    title: 'The greenhouse effect, in detail',
    desc: 'Why some gases warm Earth and others don\'t — molecular vibrations, GWP, atmospheric chemistry.',
    subject: 'Connects to chemistry & physics',
    estMin: 10,
    steps: [
      {
        type: 'concept',
        heading: 'What sunlight does, in three steps',
        body: 'Solar energy reaches Earth as visible and ultraviolet light. The surface absorbs it, warms up, and radiates the energy back as infrared (IR) — longer wavelength than what came in. Most atmospheric gases let visible light through but interact with IR. The ones that absorb IR strongly are "greenhouse gases."',
      },
      {
        type: 'quiz',
        question: 'Earth\'s atmosphere is 78% nitrogen (N₂) and 21% oxygen (O₂). Why don\'t these big numbers cause a greenhouse effect?',
        options: [
          { text: 'They\'re too small to absorb IR', correct: false, explanation: 'Size isn\'t the criterion — it\'s the molecular structure.' },
          { text: 'Symmetric diatomic molecules don\'t have the vibrational modes that absorb IR strongly', correct: true, explanation: 'Right. N₂ and O₂ are symmetric — their vibrations don\'t change the molecule\'s dipole moment, so they\'re nearly transparent to IR. CO₂ and H₂O have asymmetric vibrational modes that DO interact with IR. This is straight out of physical chemistry.' },
          { text: 'They\'re actually greenhouse gases — we just ignore them', correct: false, explanation: 'No, the physics is real. They genuinely don\'t trap much IR.' },
        ],
      },
      {
        type: 'concept',
        heading: 'The major greenhouse gases by Global Warming Potential',
        body: 'GWP100 measures how much heat one molecule traps over 100 years, relative to CO₂. CO₂ = 1 (the reference). Methane (CH₄) = 28. Nitrous oxide (N₂O) = 273. R-410A refrigerant = 2,256. SF₆ (used in electrical equipment) = 24,300. Different gases, very different per-molecule impact.',
      },
      {
        type: 'concept',
        heading: 'The methane catch — short-lived but punchy',
        body: 'CO₂ persists in the atmosphere for centuries. Methane oxidizes to CO₂ + H₂O in about 12 years. So methane is more potent NOW (GWP20 ≈ 84) but less so over a century (GWP100 = 28) and barely matters over 1,000 years. This is why the time horizon you choose changes the policy you write.',
      },
      {
        type: 'math',
        heading: 'Math: mixed-gas CO₂-equivalent',
        scenario: 'A landfill releases the following over one year: 50 kg of CO₂, 4 kg of methane (CH₄), and 0.1 kg of nitrous oxide (N₂O). Convert to total CO₂-equivalent using GWP100 values.',
        given: [
          { label: 'CO₂ released', value: '50 kg' },
          { label: 'CH₄ released', value: '4 kg' },
          { label: 'N₂O released', value: '0.1 kg' },
          { label: 'GWP100: CO₂', value: '1' },
          { label: 'GWP100: CH₄', value: '28' },
          { label: 'GWP100: N₂O', value: '273' },
        ],
        question: 'Total CO₂-equivalent (over 100 years):',
        options: [
          { text: '~54 kg CO₂e', correct: false, explanation: 'You only added the masses. Each gas needs to be multiplied by its GWP first.' },
          { text: '~189 kg CO₂e', correct: true, explanation: 'Right. 50 × 1 = 50. 4 × 28 = 112. 0.1 × 273 = 27.3. Total: 50 + 112 + 27.3 = 189.3 kg CO₂e. Notice methane (only 4 kg of mass!) contributes more than the 50 kg of CO₂.' },
          { text: '~512 kg CO₂e', correct: false, explanation: 'Too high. You may have multiplied something extra. Check: only multiply each gas by its OWN GWP and sum.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: methane on a 20-year horizon',
        scenario: 'Take the same landfill emissions but use GWP20 for methane (84) instead of GWP100 (28). What\'s the total CO₂-equivalent over a 20-year horizon? (For simplicity, keep N₂O at 273.)',
        given: [
          { label: 'CO₂', value: '50 kg × 1' },
          { label: 'CH₄', value: '4 kg × 84 (GWP20)' },
          { label: 'N₂O', value: '0.1 kg × 273' },
        ],
        question: 'Total over 20-year horizon:',
        options: [
          { text: '~189 kg CO₂e', correct: false, explanation: 'That was the GWP100 answer. The 20-year multiplier for methane is 3× higher.' },
          { text: '~413 kg CO₂e', correct: true, explanation: 'Right. 50 × 1 = 50. 4 × 84 = 336. 0.1 × 273 = 27.3. Total: 413 kg CO₂e — more than 2× the GWP100 number, all from re-weighting methane. Choosing the time horizon is a value judgment with policy consequences.' },
          { text: '~6,000 kg CO₂e', correct: false, explanation: 'Way too high. Recheck the multiplications.' },
        ],
      },
      {
        type: 'quiz',
        question: 'A school produces 1 kg of methane and 100 kg of CO₂. Which contributes more warming over 100 years?',
        options: [
          { text: '100 kg of CO₂', correct: true, explanation: 'Right. 1 kg CH₄ × 28 GWP = 28 kg CO₂-equivalent. That\'s less than 100 kg of plain CO₂. Still significant — methane punches above its weight per kg — but not enough to win against 100× more CO₂.' },
          { text: '1 kg of methane', correct: false, explanation: '1 kg × 28 = 28 kg CO₂e. Less than 100 kg of CO₂. But methane is still a much bigger problem than its mass suggests.' },
          { text: 'They\'re roughly equal', correct: false, explanation: 'Not equal — methane\'s 28× per kg multiplier is offset by being only 1% of the mass.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Atmospheric concentration history',
        body: 'Pre-industrial CO₂ (1750): ~280 ppm. Today: ~425 ppm. That\'s a 50% increase over 270 years, with most of it in the last 70. Ice cores show that ~425 ppm is the highest atmospheric CO₂ in over 3 million years — long before modern humans existed.',
      },
      {
        type: 'concept',
        heading: 'What 1.5°C and 2°C actually mean',
        body: 'The Paris Agreement targets limiting warming to "well below 2°C" with an aspirational 1.5°C cap. We\'re at about 1.2°C now. Each tenth of a degree changes the frequency of extreme heat, drought, and storms. To keep warming under 1.5°C, the remaining "carbon budget" is ~250 GtCO₂.',
      },
      {
        type: 'math',
        heading: 'Math: how many years of carbon budget remain?',
        scenario: 'The remaining global carbon budget for a 50% chance of staying under 1.5°C is approximately 250 GtCO₂ (gigatons). Annual global emissions are ~37 GtCO₂. At current rates, how many years until the budget is exhausted?',
        given: [
          { label: 'Remaining 1.5°C budget', value: '250 GtCO₂' },
          { label: 'Annual emissions', value: '37 GtCO₂/yr' },
        ],
        question: 'Years until the budget is gone (at current emission rates):',
        options: [
          { text: '~3 years', correct: false, explanation: 'Too short. Recheck your division.' },
          { text: '~7 years', correct: true, explanation: 'Right. 250 ÷ 37 ≈ 6.76 years. This is why the IPCC says emissions need to peak before 2025 and roughly halve by 2030 to stay on track for 1.5°C. Time matters.' },
          { text: '~25 years', correct: false, explanation: 'Too long. You may have used the 2°C budget.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You understand the chemistry AND the math',
        body: 'Different molecular structures → different IR absorption → different GWPs. Mixed emissions multiply by their own GWP and sum. Time horizon choice changes results dramatically. The remaining carbon budget for 1.5°C is roughly 7 years at current rates. Now when you read about climate policy, you can decode why some interventions matter on different timescales.',
      },
    ],
  },

  {
    id: 'kua-footprint',
    title: 'KUA\'s footprint',
    desc: 'Walk through KUA\'s preliminary estimated numbers — and verify them yourself.',
    subject: 'Foundations',
    estMin: 7,
    steps: [
      {
        type: 'concept',
        heading: 'KUA\'s headline number is ~1,150 mtCO₂e/year',
        body: 'That\'s the NET balance — gross emissions minus on-campus sequestration. The range is wide right now (−760 to +3,572) because most of the inputs are estimates. Once measured data fills in, the range tightens.',
      },
      {
        type: 'concept',
        heading: 'Where does that number come from?',
        body: 'Gross: ~4,150 mtCO₂e/yr (Scope 1 ~1,000 + Scope 2 ~222 + Scope 3 ~3,000). Sequestration: ~3,000 mtCO₂e/yr drawdown from the campus forest. Net: 4,150 − 3,000 = 1,150.',
      },
      {
        type: 'math',
        heading: 'Math: KUA\'s Scope 1 from heating fuel',
        scenario: 'Suppose KUA receives 95,000 gallons of #2 heating oil deliveries in one fiscal year. The EPA emission factor for heating oil is 10.16 kg CO₂ per gallon. What\'s the Scope 1 contribution from heating oil alone, in mtCO₂e?',
        given: [
          { label: 'Heating oil delivered', value: '95,000 gal' },
          { label: 'EPA factor', value: '10.16 kg CO₂/gal' },
        ],
        question: 'Annual Scope 1 from heating oil:',
        options: [
          { text: '~96.5 mtCO₂e', correct: false, explanation: 'Off by 10×. Check kg → mt.' },
          { text: '~965 mtCO₂e', correct: true, explanation: 'Right. 95,000 × 10.16 = 965,200 kg = 965.2 mtCO₂e. This is why heating dominates KUA\'s Scope 1 — even one delivery season is a thousand mtCO₂e.' },
          { text: '~9,650 mtCO₂e', correct: false, explanation: 'Off by 10× the other way.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which scope is the biggest contributor to KUA\'s gross emissions?',
        options: [
          { text: 'Scope 1 (heating)', correct: false, explanation: 'Heating fuel is significant (~1,000 mt) but not the biggest.' },
          { text: 'Scope 2 (electricity)', correct: false, explanation: 'Electricity is actually our smallest scope at 222 mt — the New England grid is fairly clean.' },
          { text: 'Scope 3 (indirect/travel)', correct: true, explanation: 'Right. Student travel + supply chain is ~72% of KUA\'s gross emissions. International student round-trip flights are ~3 mtCO₂e EACH.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: international student travel',
        scenario: 'KUA has ~50 international students. Each takes one round-trip flight per year to East Asia. The DEFRA factor for long-haul economy travel (with radiative forcing) is 0.195 kg CO₂e per passenger-km. The one-way distance is ~7,500 km. What\'s the total annual emissions from international student travel?',
        given: [
          { label: 'Students', value: '50' },
          { label: 'Round trips per year', value: '1 each' },
          { label: 'One-way distance', value: '7,500 km' },
          { label: 'DEFRA factor', value: '0.195 kg CO₂e / passenger-km' },
        ],
        question: 'Annual total:',
        options: [
          { text: '~73 mtCO₂e', correct: false, explanation: 'Too low. Did you forget to multiply by 2 (round trip)?' },
          { text: '~146 mtCO₂e', correct: true, explanation: 'Right. 50 × 7,500 × 2 × 0.195 / 1,000 = 146.25 mtCO₂e per year, just from the international cohort\'s home-and-back. About 12% of KUA\'s entire net balance, from one cohort\'s travel.' },
          { text: '~580 mtCO₂e', correct: false, explanation: 'Too high. Recheck unit cancellation.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Why Scope 3 is so dominant',
        body: 'KUA is a residential boarding school in cold-climate New Hampshire. International students fly home, US boarders fly or drive 3–4 times per year, and faculty travel for conferences and recruiting. Kool (2025) found this same pattern at Royal Roads University, where student air travel alone dwarfed every other emissions category.',
      },
      {
        type: 'concept',
        heading: 'The 1,000 acres of forest changes everything',
        body: 'Most peer schools don\'t even measure their sinks. KUA\'s forest pulls roughly 3,000 mtCO₂e/year out of the air via photosynthesis. On the optimistic end of our range, that drawdown EXCEEDS our gross emissions — KUA could be net carbon-negative.',
      },
      {
        type: 'math',
        heading: 'Math: per-student footprint',
        scenario: 'KUA\'s gross annual emissions are ~4,150 mtCO₂e and on-campus sequestration is ~3,000 mtCO₂e. Enrollment is ~600 students. What is the net per-student carbon footprint in mtCO₂e?',
        given: [
          { label: 'Gross emissions', value: '4,150 mtCO₂e/yr' },
          { label: 'Sequestration', value: '3,000 mtCO₂e/yr' },
          { label: 'Students', value: '600' },
        ],
        question: 'Net per-student footprint:',
        options: [
          { text: '~1.9 mtCO₂e/student', correct: true, explanation: 'Right. Net = 4,150 − 3,000 = 1,150 mtCO₂e/yr. Per student = 1,150 / 600 = 1.92 mtCO₂e/student. This is unusually low because most peer schools don\'t measure sinks.' },
          { text: '~6.9 mtCO₂e/student', correct: false, explanation: 'You divided GROSS by students. The net subtracts sinks first.' },
          { text: '~4.2 mtCO₂e/student', correct: false, explanation: 'Almost — that\'s the gross-only per student. The forest drawdown brings it lower.' },
        ],
      },
      {
        type: 'quiz',
        question: 'KUA\'s preliminary per-student emissions (~1.9 mtCO₂e). How does that compare to peer boarding schools?',
        options: [
          { text: 'About the same', correct: false, explanation: 'Most peer boarding schools are 6–10 mt/student because they don\'t count sinks.' },
          { text: 'Lower than peers', correct: true, explanation: 'Right. Phillips Exeter is ~10, Andover ~9 — KUA looks lower largely because we\'re the only school in the chart that quantifies on-campus sequestration.' },
          { text: 'Higher than peers', correct: false, explanation: 'Boarding schools have similar gross emissions; the difference is whether sinks are measured.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You can verify the dashboard yourself',
        body: 'Net ~1,150 mt/yr. ~72% of gross from Scope 3 (mostly student travel). 1,000-acre forest pulls back roughly 3,000 mt/yr. Net per student: ~1.9 mtCO₂e. Every number you saw in this path can be reproduced from primary inputs and the same equations.',
      },
    ],
  },

  {
    id: 'photosynthesis',
    title: 'From photosynthesis to forest carbon',
    desc: 'How trees actually pull CO₂ out of the air, why DBH matters, and where the carbon goes.',
    subject: 'Connects to biology',
    estMin: 9,
    steps: [
      {
        type: 'concept',
        heading: 'The reaction you already know',
        body: 'Photosynthesis: 6 CO₂ + 6 H₂O + sunlight → C₆H₁₂O₆ + 6 O₂. Trees take in CO₂ through stomata in their leaves, combine it with water from their roots and sunlight energy, and produce glucose plus oxygen. The glucose becomes the cellulose, lignin, and other compounds that make wood. About half of a tree\'s dry biomass is carbon by mass.',
      },
      {
        type: 'concept',
        heading: 'The carbon → CO₂ conversion',
        body: 'When you measure a tree\'s biomass, the carbon content is about 50% by dry weight. But carbon comes from CO₂, which has more mass than carbon alone (CO₂ = 12 + 16 + 16 = 44; C = 12). So 1 g of carbon stored in a tree corresponds to 44/12 ≈ 3.67 g of CO₂ pulled from the atmosphere.',
      },
      {
        type: 'math',
        heading: 'Math: biomass to CO₂',
        scenario: 'A maple tree gains 12 kg of dry biomass over one growing season. Calculate the CO₂ pulled from the atmosphere by this tree.',
        given: [
          { label: 'Biomass gained', value: '12 kg dry weight' },
          { label: 'Carbon fraction of biomass', value: '50%' },
          { label: 'C → CO₂ conversion', value: '× 44/12' },
        ],
        question: 'CO₂ pulled from the atmosphere:',
        options: [
          { text: '~6 kg CO₂', correct: false, explanation: 'You stopped at carbon mass. Multiply by 44/12 to get CO₂.' },
          { text: '~22 kg CO₂', correct: true, explanation: 'Right. 12 × 0.50 = 6 kg C. 6 × 44/12 = 22 kg CO₂. So one moderate tree, in one season, can pull a kid\'s body weight in CO₂ from the air.' },
          { text: '~44 kg CO₂', correct: false, explanation: 'You multiplied by 44/12 but forgot the carbon fraction (×0.5).' },
        ],
      },
      {
        type: 'concept',
        heading: 'DBH — diameter at breast height',
        body: 'Forest researchers measure DBH (the trunk diameter at 1.3 m above ground) with a simple tape. Species-specific allometric equations convert DBH into total biomass — including roots, branches, and leaves — based on decades of cut-and-weigh studies. From biomass we get carbon (× 0.5) and CO₂-equivalent (× 44/12).',
      },
      {
        type: 'math',
        heading: 'Math: a Jenkins-style allometric',
        scenario: 'Use the simplified Jenkins (2003) equation for mixed hardwoods: total biomass (kg) = exp(−2.4800 + 2.4835 × ln(DBH_cm)). A KUA sugar maple has DBH = 50 cm. Estimate its total stored CO₂.',
        given: [
          { label: 'DBH', value: '50 cm' },
          { label: 'ln(50)', value: '≈ 3.912' },
          { label: 'biomass = exp(−2.48 + 2.4835 × ln(DBH))', value: '' },
          { label: 'Carbon fraction', value: '0.5' },
          { label: 'C → CO₂', value: '44/12' },
        ],
        question: 'Approximately how much CO₂ is stored in this single mature tree?',
        options: [
          { text: '~150 kg CO₂', correct: false, explanation: 'Too low. Recheck the exp() result for the biomass step.' },
          { text: '~2,000 kg CO₂', correct: true, explanation: 'Right (within ~20%). −2.48 + 2.4835 × 3.912 ≈ 7.23. exp(7.23) ≈ 1,380 kg biomass. × 0.5 = 690 kg C. × 44/12 = ~2,530 kg CO₂. So roughly 2 metric tons stored in one mature maple — and dozens of these grow on a forested acre.' },
          { text: '~50,000 kg CO₂', correct: false, explanation: 'Way too high. The Jenkins formula gives biomass in kg, not tons.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Above ground vs below ground',
        body: 'Average US forest holds 41% of its carbon above ground (trunks, branches, leaves) and 59% below ground (roots and soil organic carbon). The soil carbon is overlooked but huge — and it\'s the part most at risk when land is disturbed.',
      },
      {
        type: 'quiz',
        question: 'Why does paving over a forest release MORE carbon than just letting it stand?',
        options: [
          { text: 'Pavement is dark and absorbs heat', correct: false, explanation: 'Pavement surface temperature is irrelevant to carbon accounting. The release comes from biology.' },
          { text: 'You lose the standing biomass AND the soil carbon decays once the soil is disturbed', correct: true, explanation: 'Right. The trees go into a pile or landfill — wood\'s carbon comes back to the atmosphere over years. PLUS the soil carbon that took centuries to build releases as the disturbed soil decomposes faster. Total release per acre: 200–400 mtCO₂e over years.' },
          { text: 'Cutting trees doesn\'t release carbon — only burning does', correct: false, explanation: 'Decay is just slow combustion at biological temperatures. The CO₂ comes out either way; burning is just faster.' },
        ],
      },
      {
        type: 'concept',
        heading: 'KUA\'s forest baseline',
        body: '~1,000 acres of mostly maple/beech/birch (the dominant New Hampshire forest type). New Hampshire forests average 31.8 tons of carbon per acre stored (Morin et al. 2020). Sequestration rate: 1,252 lb C/acre/yr (Birdsey 1992) for typical US forest, up to 0.28 kg C/m²/yr for open-grown urban trees (Nowak 2013).',
      },
      {
        type: 'math',
        heading: 'Math: KUA\'s forest annual sequestration',
        scenario: 'KUA has roughly 1,000 acres of forested land. Use the Birdsey (1992) average annual accumulation rate of 1,252 pounds of carbon per acre per year. Convert this to mtCO₂e per year.',
        given: [
          { label: 'Forested area', value: '1,000 acres' },
          { label: 'Annual rate (Birdsey)', value: '1,252 lb C / acre / yr' },
          { label: 'lb → kg', value: '× 0.4536' },
          { label: 'C → CO₂', value: '× 44/12' },
        ],
        question: 'Annual sequestration (Birdsey rate):',
        options: [
          { text: '~570 mtCO₂e/yr', correct: false, explanation: 'You stopped at C mass. Multiply by 44/12 to get CO₂-equivalent.' },
          { text: '~2,083 mtCO₂e/yr', correct: true, explanation: 'Right. 1,000 × 1,252 = 1,252,000 lb C/yr × 0.4536 = 567,907 kg C × 44/12 = 2,082,326 kg CO₂ ≈ 2,083 mtCO₂e/yr. The dashboard\'s mid-estimate of ~3,000 mtCO₂e blends this with the higher Nowak rate for open-grown trees.' },
          { text: '~10,000 mtCO₂e/yr', correct: false, explanation: 'Way too high. Recheck the lb → kg conversion.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You can do the forest math now',
        body: 'Photosynthesis → biomass → carbon (× 0.5) → CO₂ (× 44/12). DBH → biomass via allometrics → carbon → CO₂. Acreage × annual rate per acre → annual sequestration. These three formulas explain every nature-based climate solution in print.',
      },
    ],
  },

  {
    id: 'energy-grid',
    title: 'Energy and the New England grid',
    desc: 'How the grid mixes sources every hour, why heat pumps work, and the physics of capacity factors.',
    subject: 'Connects to physics & engineering',
    estMin: 11,
    steps: [
      {
        type: 'concept',
        heading: 'The grid is a balancing act, every second',
        body: 'Electricity can\'t be stored at scale on most grids. Supply and demand must match instantaneously, or frequency drifts and protective relays trip plants offline. ISO New England — the regional grid operator — coordinates dozens of generators in real time to keep that balance.',
      },
      {
        type: 'concept',
        heading: 'What\'s on the New England grid in 2024',
        body: 'Natural gas: 51% (sets the marginal price most hours). Nuclear: 23% (Millstone in CT, Seabrook in NH — runs 24/7). Renewables (solar, wind, biomass): ~14%. Net imports from Canada: ~12% (mostly Hydro-Québec). Coal/oil: <1% combined — essentially gone except for winter peaks.',
      },
      {
        type: 'quiz',
        question: 'Why does the grid emission factor change throughout the day?',
        options: [
          { text: 'Different generators run at different times — gas peakers fire up at high demand', correct: true, explanation: 'Right. At 3am demand is low and the cleanest baseload sources (nuclear, hydro, wind) cover it. At 6pm on a hot summer evening, demand spikes and gas peakers fire up. The marginal kWh you consume at peak is dirtier than the marginal kWh you consume overnight.' },
          { text: 'The factor is constant year-round', correct: false, explanation: 'No — both seasonally and hourly the mix shifts.' },
          { text: 'The grid switches off solar at night and runs only nuclear', correct: false, explanation: 'Solar IS unavailable at night, but the rest of the grid keeps running.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Capacity factor — how much you actually get',
        body: 'A 100 kW solar array could generate 100 kW × 8,760 hr = 876 MWh per year if it ran at full output 24/7. It doesn\'t — clouds, night, and seasonal angle limit it. NH solar capacity factor: 13–16%. Onshore wind in NE: 25–35%. Nuclear: 90%+. Gas peakers: 5–15% (only fire up when needed).',
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
          { text: '~245,000 kWh', correct: true, explanation: 'Right. 200 kW × 8,760 hr × 0.14 = 245,280 kWh. About 10% of KUA\'s total annual electricity demand from one rooftop.' },
          { text: '~1.75M kWh', correct: false, explanation: 'You forgot the capacity factor — that\'s the theoretical max if the panels ran 24/7.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: avoided grid emissions from that solar',
        scenario: 'The 245,000 kWh from your rooftop solar is mostly self-consumed by KUA, displacing grid electricity. The ISO-NE 2024 grid factor is 643 lb CO₂/MWh. Convert the displacement to mtCO₂e avoided.',
        given: [
          { label: 'Self-consumed solar', value: '245,000 kWh' },
          { label: 'Grid factor', value: '643 lb CO₂ / MWh' },
          { label: 'lb → kg', value: '× 0.4536' },
        ],
        question: 'Annual avoided emissions:',
        options: [
          { text: '~7 mtCO₂e/yr', correct: false, explanation: 'Off by 10×. Did you accidentally divide instead of multiply somewhere?' },
          { text: '~71 mtCO₂e/yr', correct: true, explanation: 'Right. 245,000 ÷ 1,000 = 245 MWh × 643 lb/MWh = 157,535 lb × 0.4536 = 71,458 kg = 71.5 mtCO₂e. About a third of KUA\'s entire Scope 2 documented emissions, displaced by a single rooftop array.' },
          { text: '~700 mtCO₂e/yr', correct: false, explanation: 'Way too high — that\'d be displacing KUA\'s entire annual electricity use 3 times over.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Heat pumps — moving heat, not making it',
        body: 'A heat pump is essentially a refrigerator running backward. Instead of moving heat OUT of a fridge, it moves heat IN to your building, pulling it from outdoor air or the ground. Modern cold-climate heat pumps deliver 2.5–3.5 kWh of heating per 1 kWh of electricity — that ratio is the COP (coefficient of performance). It\'s thermodynamically free heat; the electricity just runs the pump.',
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
          { text: '~5 mtCO₂e/yr', correct: false, explanation: 'Way too low. Walk through both the old emissions and the new emissions separately.' },
          { text: '~38 mtCO₂e/yr', correct: true, explanation: 'Right. OLD: 6,000 × 10.16 = 60,960 kg ≈ 61 mt. NEW: heat needed = 6,000 × 138,500 × 0.80 = 665M BTU; ÷ 3,412 = 195,000 kWh thermal; ÷ COP 2.5 = 78,000 kWh electric; × 0.292 = 22,776 kg ≈ 22.8 mt. Savings = 61 − 22.8 = 38 mtCO₂e/yr per dorm.' },
          { text: '~61 mtCO₂e/yr', correct: false, explanation: 'You assumed the heat pump uses zero energy. It still uses electricity (just much less per BTU than oil).' },
        ],
      },
      {
        type: 'concept',
        heading: 'Intermittency isn\'t fatal',
        body: 'A common myth: "renewables are too intermittent to run a grid." Texas (50%+ renewable on many days), California (60%+ on sunny days), Iowa (55%+ wind annually) prove the engineering is solvable. The recipe: geographic diversification, transmission upgrades, storage, demand response, overbuilding. None of these are technological miracles — they\'re investment decisions.',
      },
      {
        type: 'finish',
        heading: 'You can size projects yourself',
        body: 'Solar output = nameplate × hours × capacity factor. Avoided emissions = kWh × grid factor. Heat pump output = electricity × COP. With these three formulas you can roughly size and evaluate any electrification project — in your dorm, your hometown, or anywhere on the grid.',
      },
    ],
  },

  {
    id: 'compare',
    title: 'How KUA compares',
    desc: 'Why peer comparisons are tricky, and what they actually show.',
    subject: 'Foundations',
    estMin: 4,
    steps: [
      {
        type: 'concept',
        heading: 'The peer chart shows shape, not just totals',
        body: 'Each bar splits a school\'s per-student emissions by scope, with sinks and offsets shown to the LEFT of zero. Two patterns become visible: boarding-secondary peers cluster on a similar shape (heavy heating + heavy travel), and Middlebury\'s "net zero" turns out to be purchased offsets, not physical removal.',
      },
      {
        type: 'quiz',
        question: 'Why is comparing schools\' carbon numbers tricky?',
        options: [
          { text: 'Different scope inclusion', correct: true, explanation: 'Right. Some schools count Scope 3 fully, others partially. Some count sinks, most don\'t. Different denominators (FTE vs headcount) also distort comparisons. Valls-Val & Bovea (2021) reviewed 35 university footprint studies and found this exact problem.' },
          { text: 'Different climates', correct: false, explanation: 'Climate matters but isn\'t the main reason. Methodology differences are.' },
          { text: 'Different student counts', correct: false, explanation: 'Schools normalize to per-student. The issue is methodological inconsistency.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: same school, different methodology',
        scenario: 'Two schools have IDENTICAL physical operations: 600 students, 4,150 mtCO₂e gross, 3,000 mtCO₂e of forest sequestration. School A reports the net (subtracts sinks). School B reports gross only (does not measure sinks). What per-student numbers do each publish?',
        given: [
          { label: 'Gross emissions (both)', value: '4,150 mtCO₂e' },
          { label: 'Sequestration (both, real)', value: '3,000 mtCO₂e' },
          { label: 'Students (both)', value: '600' },
        ],
        question: 'Difference in published per-student footprint:',
        options: [
          { text: 'Both publish ~1.9 mt/student', correct: false, explanation: 'Only the school that subtracts sinks lands at 1.9. The other ignores them.' },
          { text: 'A: ~1.9 mt; B: ~6.9 mt — same campus, very different number', correct: true, explanation: 'Right. School A: (4,150 − 3,000) / 600 = 1.92 mt. School B: 4,150 / 600 = 6.92 mt. The same physical campus shows up as 3.6× higher because Sinks are excluded from the methodology. This is the Valls-Val & Bovea (2021) finding in one example.' },
          { text: 'Both publish ~6.9 mt', correct: false, explanation: 'A subtracted sinks before dividing.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Middlebury\'s "net zero" is different from KUA\'s drawdown',
        body: 'Middlebury reports as carbon-neutral, but they get there by purchasing carbon offsets equal to their gross emissions. The CO₂ molecules they emit still go up; they just paid someone else to remove an equal amount somewhere else. KUA\'s 3,000 mtCO₂e/yr from the campus forest is physical — those CO₂ molecules are actually pulled out of the air, on KUA land.',
      },
      {
        type: 'finish',
        heading: 'Comparison context, not a leaderboard',
        body: 'KUA\'s shape (heavy travel, with a green sinks bar) is structurally normal for a NH boarding school. The unique thing is that we measure the sinks at all. Methodology determines whether two schools with the same physical footprint look 3× different on paper.',
      },
    ],
  },

  {
    id: 'actions',
    title: 'What actually changes the number',
    desc: 'Action levers ranked by impact, with the math behind each.',
    subject: 'Foundations',
    estMin: 5,
    steps: [
      {
        type: 'concept',
        heading: 'Some actions matter much more than others',
        body: 'A student who turns off lights, a heat-pump retrofit, a single fewer round-trip flight per international student — all reduce emissions, but by very different amounts. Knowing the magnitudes matters when you decide what to spend time on.',
      },
      {
        type: 'quiz',
        question: 'Which has the biggest impact on KUA\'s annual carbon footprint?',
        options: [
          { text: 'A student turning off dorm lights', correct: false, explanation: 'Helpful, but tiny. A single LED bulb running 6 fewer hours/day for a year saves about 0.005 mtCO₂e.' },
          { text: 'One fewer round-trip flight per international student', correct: true, explanation: 'Right. 50 students × 1 round trip × ~2.93 mtCO₂e = 146 mtCO₂e/yr saved. The single highest-leverage individual lever in the entire dashboard.' },
          { text: 'Composting in the dining hall', correct: false, explanation: 'Real impact but smaller — maybe 10–24 mt/yr at full diversion. Still a fraction of the flight reduction.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: stack-rank three reduction levers',
        scenario: 'You\'re comparing three reduction projects for KUA. Estimate the annual impact of each, then rank them. (a) Heat-pump retrofit on one dorm currently using 6,000 gal/yr oil → ~38 mt savings. (b) LED retrofit cutting electricity 12% from current 2.3M kWh. (c) 30 of the international students take 1 fewer round trip to East Asia.',
        given: [
          { label: '(a) Heat pump retrofit', value: '~38 mt savings' },
          { label: '(b) LED retrofit', value: '12% × 2.3M kWh × 0.292 kg/kWh' },
          { label: '(c) 30 students × 1 fewer round trip', value: '× ~2.93 mtCO₂e per round trip' },
        ],
        question: 'Which order, biggest to smallest?',
        options: [
          { text: '(c) > (a) > (b)', correct: true, explanation: 'Right. (c) = 30 × 2.93 ≈ 88 mt. (a) = 38 mt. (b) = 0.12 × 2,300,000 × 0.292 / 1,000 ≈ 81 mt. Order: (c) 88 > (b) 81 > (a) 38. Even small fractions of the international student cohort cutting a flight can beat a major infrastructure retrofit. Travel reduction is just that high-leverage at residential boarding schools.' },
          { text: '(a) > (b) > (c)', correct: false, explanation: 'The heat pump is real but smaller than either of the other two at this scale.' },
          { text: '(b) > (a) > (c)', correct: false, explanation: 'Re-check (c) — 30 students at ~3 mt each is ~88 mt.' },
        ],
      },
      {
        type: 'concept',
        heading: 'The biggest individual lever: travel',
        body: 'A long-haul economy round-trip flight from East Asia produces ~3 mtCO₂e per passenger. If 50 international students replace one trip with an extended on-campus stay (e.g., shoulder break), that\'s 146 mtCO₂e/yr — about 12% of KUA\'s entire net balance.',
      },
      {
        type: 'concept',
        heading: 'The biggest infrastructural lever: heat pumps',
        body: 'Replacing a single 6,000-gal/year oil boiler with a cold-climate heat pump (COP 2.5) saves ~38 mtCO₂e/yr per dorm. Across multiple buildings the numbers add up fast — and the New England grid means electrified heat is genuinely cleaner per BTU than oil.',
      },
      {
        type: 'concept',
        heading: 'The biggest sink lever: don\'t pave the forest',
        body: 'Each acre of forest converted to pavement releases ~500–2,000 mtCO₂e cumulatively over decades (standing biomass + soil carbon + lost future sequestration). Preventing even one such conversion is more valuable than years of dorm-electricity efficiency upgrades combined.',
      },
      {
        type: 'finish',
        heading: 'Magnitude matters',
        body: 'Action recommendations on this dashboard come with order-of-magnitude impact ranges so you can see what moves the needle. Open any scope page and click "Show data + math" on a lever to see the calculation.',
      },
    ],
  },

  {
    id: 'personal-action',
    title: 'What can YOU change?',
    desc: 'Personal-scale actions ranked by impact — dorm life, food, travel, civic engagement.',
    subject: 'Connects to civics & personal finance',
    estMin: 8,
    steps: [
      {
        type: 'concept',
        heading: 'Individual action — the honest answer',
        body: 'No single student\'s choices solve climate change. But high-emitting individuals (frequent flyers, big homes, beef-heavy diets) have outsized footprints, and choices send market signals. Cordero et al. (2020) tracked students who calculated their own footprints and found measurable behavior changes years later. The educational value is real even when the per-person tons are small.',
      },
      {
        type: 'concept',
        heading: 'For KUA students, travel is by far the biggest lever',
        body: 'A student\'s personal annual footprint at KUA might be 5–8 mtCO₂e. A single intercontinental round-trip flight is ~3 of those. Domestic flights are ~1 mtCO₂e per round trip. Driving 1,000 miles in a typical car: ~0.4 mtCO₂e. Train BOS↔NYC: ~0.05 mtCO₂e per round trip.',
      },
      {
        type: 'math',
        heading: 'Math: drive vs fly',
        scenario: 'Compare two ways to make a 700-mile round trip (one way 350 miles). (a) Solo drive in a 25 mpg car. (b) Domestic flight, economy. Use these factors: gasoline = 8.78 kg CO₂/gal, short-haul air = 0.395 kg CO₂e/passenger-mile (with radiative forcing).',
        given: [
          { label: 'Round-trip distance', value: '700 mi' },
          { label: 'Car fuel economy', value: '25 mpg' },
          { label: 'Gasoline factor', value: '8.78 kg CO₂/gal' },
          { label: 'Short-haul air factor', value: '0.395 kg CO₂e/passenger-mi' },
        ],
        question: 'Which has the lower emissions, and by how much?',
        options: [
          { text: 'Drive: 246 kg, Fly: 277 kg — fly is slightly worse', correct: true, explanation: 'Right. DRIVE: 700 ÷ 25 = 28 gal × 8.78 = 245.8 kg. FLY: 700 × 0.395 = 276.5 kg. Driving wins by ~30 kg solo. With 2-3 passengers, driving wins by a lot more (per-passenger). With 1 passenger flying, the gap is small. The break-even depends heavily on car occupancy and fuel economy.' },
          { text: 'Drive: 24 kg, Fly: 277 kg — drive wins big', correct: false, explanation: 'You may have divided by 25 then forgot to multiply by the gas factor. Recheck the drive math.' },
          { text: 'Both produce the same — about 280 kg', correct: false, explanation: 'They\'re close at this distance, but not identical.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Food choices — pound-for-pound',
        body: 'A rough order: 1 kg of beef is ~60 kg CO₂e. 1 kg of chicken: ~6. 1 kg of rice: ~4 (mostly methane from paddy fields). 1 kg of beans: ~0.9. 1 kg of potatoes: ~0.4. The dominant pattern: ruminant meat (beef, lamb) is roughly 10× the impact of poultry, and 50–100× the impact of common plant foods.',
      },
      {
        type: 'math',
        heading: 'Math: a year of meal swaps',
        scenario: 'Suppose a student eats two beef-burger meals per week (each ~150 g of beef, or 0.15 kg) over 36 school weeks, and switches half of those to chicken (same 0.15 kg portion). Estimate the annual savings using 60 kg CO₂e per kg beef and 6 kg CO₂e per kg chicken.',
        given: [
          { label: 'Meals/week swapped', value: '1 (half of 2)' },
          { label: 'School weeks', value: '36' },
          { label: 'Beef per meal', value: '0.15 kg' },
          { label: 'Beef factor', value: '60 kg CO₂e/kg' },
          { label: 'Chicken factor', value: '6 kg CO₂e/kg' },
        ],
        question: 'Annual savings from this one swap:',
        options: [
          { text: '~3 kg CO₂e', correct: false, explanation: 'Recheck. 36 weeks × 0.15 kg gives ~5.4 kg, not a few hundred grams.' },
          { text: '~292 kg CO₂e', correct: true, explanation: 'Right. 36 weeks × 1 swap = 36 swaps. Each swap: 0.15 kg × (60 − 6) = 0.15 × 54 = 8.1 kg saved. Annual: 36 × 8.1 = 291.6 kg CO₂e ≈ 0.29 mt. Modest but real — and one student over four years saves ~1.2 mt just from that single dietary change.' },
          { text: '~3,000 kg CO₂e', correct: false, explanation: 'Way too high. You may have used the full beef factor instead of the difference.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which has the biggest carbon footprint per pound consumed?',
        options: [
          { text: 'Beef', correct: true, explanation: 'Right. Cattle digestion produces methane; cattle take more land and feed than other meats. Beef is roughly 10× chicken and 50–100× plant foods.' },
          { text: 'Chicken', correct: false, explanation: 'Chicken is much lower than beef — about 1/10 the carbon per kg.' },
          { text: 'Wheat', correct: false, explanation: 'Plant-based foods are usually the lowest-carbon options per kg.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Dorm-scale choices that add up',
        body: 'Turning off lights and electronics: small but free. Setting your radiator one notch lower in winter: real impact across a year. Showering shorter: water+heating savings. Choosing reusable over disposable: avoids the upstream emissions baked into single-use products.',
      },
      {
        type: 'concept',
        heading: 'Civic action — sometimes more impactful than personal',
        body: 'Voting, organizing, choosing colleges/employers based on climate stance, advocating for institutional change — these can move much larger numbers than your personal footprint. A student who organizes a campus heat-pump retrofit has helped offset hundreds of times their own emissions.',
      },
      {
        type: 'finish',
        heading: 'You have a portfolio of choices',
        body: 'Big lever: travel decisions, especially long-haul flights. Medium lever: diet patterns, especially red meat. Small lever (but free): dorm-scale daily choices. Multiplier lever: civic and institutional action. None of them are the answer alone — the portfolio is.',
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
  pathSubject: { fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 6 },
  pathTitle: { fontSize: 17, fontWeight: 700, color: '#e5e7eb' },
  pathDesc: { fontSize: 13, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 },
  pathMeta: { fontSize: 11, color: '#64748b', marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.8 },

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
            <h2 style={styles.title}>Pick a path. Each is short, interactive, and grounded in real numbers.</h2>
            <p style={styles.introBody}>
              Eight learning paths spanning carbon basics, KUA-specific data, comparison, and
              high-school-level deep dives that connect to chemistry, biology, physics, and civics.
              Each path mixes concept cards, knowledge quizzes, and worked-math scenarios where
              you compute the answer from given inputs.
            </p>
          </div>
          <div style={styles.pathGrid}>
            {paths.map((p) => (
              <button key={p.id} type="button" style={styles.pathCard} onClick={() => startPath(p.id)}>
                {p.subject && <div style={styles.pathSubject}>{p.subject}</div>}
                <div style={styles.pathTitle}>{p.title}</div>
                <div style={styles.pathDesc}>{p.desc}</div>
                <div style={styles.pathMeta}>{p.steps.length} steps · ~{p.estMin} min</div>
              </button>
            ))}
          </div>
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
