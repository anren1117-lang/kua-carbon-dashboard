import React, { useState } from 'react';

// Curriculum: 8 learning paths spanning carbon basics, KUA-specific, comparison,
// action, plus high-school-level deep dives that connect to chemistry, biology,
// physics, and civics. Every numerical claim references the same preliminary
// estimate the rest of the dashboard uses, so the agent and the dashboard never
// disagree.
const paths = [
  {
    id: 'basics',
    title: 'Carbon basics',
    desc: 'What Scope 1, 2, 3 and sinks mean — start here.',
    subject: 'Foundations',
    estMin: 4,
    steps: [
      {
        type: 'concept',
        heading: 'Why we organize emissions into "scopes"',
        body: 'Carbon emissions come from many sources, but who controls each source matters. The Greenhouse Gas Protocol — the global standard — splits them into three scopes by who owns the source.',
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
        type: 'concept',
        heading: 'Scope 3 — everything else',
        body: 'The supply chain. Food in the dining hall, paper for class, flights students take home for break. At residential schools, Scope 3 — especially student travel — is usually the LARGEST scope, even though it\'s the hardest to measure.',
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
        type: 'finish',
        heading: 'You\'ve got the framework',
        body: 'Now you know the four buckets: Scope 1 (direct), Scope 2 (electricity), Scope 3 (indirect), and Sinks (drawdown). Every number on this dashboard fits into one of them.',
      },
    ],
  },

  {
    id: 'greenhouse-science',
    title: 'The greenhouse effect, in detail',
    desc: 'Why some gases warm Earth and others don\'t — molecular vibrations, GWP, atmospheric chemistry.',
    subject: 'Connects to chemistry & physics',
    estMin: 6,
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
        body: 'CO₂ persists in the atmosphere for centuries. Methane oxidizes to CO₂ + H₂O in about 12 years. So methane is more potent NOW (GWP20 ≈ 84) but less so over a century (GWP100 = 28) and barely matters over 1,000 years. This is why the time horizon you choose changes the policy you write — short-term action benefits more from cutting methane; long-term cumulative warming is more about CO₂.',
      },
      {
        type: 'quiz',
        question: 'A school produces 1 kg of methane and 100 kg of CO₂. Which contributes more warming over 100 years?',
        options: [
          { text: '100 kg of CO₂', correct: true, explanation: 'Right. 1 kg CH₄ × 28 GWP = 28 kg CO₂-equivalent. That\'s less than 100 kg of plain CO₂. Still significant — methane punches above its weight per kg — but not enough to win against 100× more CO₂. The arithmetic of carbon accounting is just multiplication.' },
          { text: '1 kg of methane', correct: false, explanation: '1 kg × 28 = 28 kg CO₂e. That\'s less than 100 kg of CO₂. But methane is still a much bigger problem than its mass suggests.' },
          { text: 'They\'re roughly equal', correct: false, explanation: 'Not equal — methane\'s 28× per kg multiplier is offset by being only 1% of the mass.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Atmospheric concentration history',
        body: 'Pre-industrial CO₂ (1750): ~280 ppm. Today: ~425 ppm. That\'s a 50% increase over 270 years, with most of it in the last 70. Ice cores show that ~425 ppm is the highest atmospheric CO₂ in over 3 million years — long before modern humans existed. The chemistry causing the warming is undisputed; the policy debate is about what to do.',
      },
      {
        type: 'concept',
        heading: 'What 1.5°C and 2°C actually mean',
        body: 'The Paris Agreement targets limiting warming to "well below 2°C" with an aspirational 1.5°C cap. We\'re at about 1.2°C now. Each tenth of a degree changes the frequency of extreme heat, drought, and storms. To keep warming under 1.5°C, the remaining "carbon budget" is ~250 GtCO₂ — about 6 years at current emission rates. So either emissions fall fast or we exceed 1.5°C and aim for the 2°C target.',
      },
      {
        type: 'finish',
        heading: 'You understand the chemistry',
        body: 'Different gases have different molecular structures → different IR absorption → different GWPs. Atmospheric chemistry isn\'t mysterious — it\'s vibrational modes, residence times, and concentration math. Now when you read about climate policy, you can decode why some interventions matter on different timescales.',
      },
    ],
  },

  {
    id: 'kua-footprint',
    title: 'KUA\'s footprint',
    desc: 'Walk through KUA\'s preliminary estimated numbers.',
    subject: 'Foundations',
    estMin: 5,
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
        type: 'quiz',
        question: 'Which scope is the biggest contributor to KUA\'s gross emissions?',
        options: [
          { text: 'Scope 1 (heating)', correct: false, explanation: 'Heating fuel is significant (~1,000 mt) but not the biggest.' },
          { text: 'Scope 2 (electricity)', correct: false, explanation: 'Electricity is actually our smallest scope at 222 mt — the New England grid is fairly clean.' },
          { text: 'Scope 3 (indirect/travel)', correct: true, explanation: 'Right. Student travel + supply chain is ~72% of KUA\'s gross emissions. International student round-trip flights are ~3 mtCO₂e EACH.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Why is Scope 3 so dominant?',
        body: 'KUA is a residential boarding school in cold-climate New Hampshire. International students fly home, and a long-haul economy round-trip from East Asia is roughly 3 mtCO₂e per passenger — by far the most carbon-intensive single thing a student does each year. Kool (2025) found this same pattern at Royal Roads University.',
      },
      {
        type: 'concept',
        heading: 'The 1,000 acres of forest changes everything',
        body: 'Most peer schools don\'t even measure their sinks. KUA\'s forest pulls roughly 3,000 mtCO₂e/year out of the air via photosynthesis. On the optimistic end of our range, that drawdown EXCEEDS our gross emissions — KUA could be net carbon-negative.',
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
        heading: 'You understand KUA\'s number',
        body: 'Net ~1,150 mt/yr. ~72% of gross from Scope 3 (mostly student travel). 1,000-acre forest pulls back roughly 3,000 mt/yr. Net per student: ~1.9 mtCO₂e — strong relative to peers because we measure our forest.',
      },
    ],
  },

  {
    id: 'photosynthesis',
    title: 'From photosynthesis to forest carbon',
    desc: 'How trees actually pull CO₂ out of the air, why DBH matters, and where the carbon goes.',
    subject: 'Connects to biology',
    estMin: 6,
    steps: [
      {
        type: 'concept',
        heading: 'The reaction you already know',
        body: 'Photosynthesis: 6 CO₂ + 6 H₂O + sunlight → C₆H₁₂O₆ + 6 O₂. Trees take in CO₂ through stomata in their leaves, combine it with water from their roots and energy from sunlight, and produce glucose plus oxygen. The glucose becomes the cellulose, lignin, and other compounds that make wood. About half of a tree\'s dry biomass is carbon by mass.',
      },
      {
        type: 'quiz',
        question: 'A tree gains 1 kg of dry biomass in a year. How much CO₂ did it pull out of the atmosphere?',
        options: [
          { text: '1 kg', correct: false, explanation: 'Not quite. The biomass is about half carbon, but CO₂ has more mass per atom of C.' },
          { text: 'About 1.83 kg', correct: true, explanation: 'Right. 1 kg biomass × 50% carbon = 0.5 kg C. Convert to CO₂ by multiplying by 44/12 (the ratio of CO₂\'s molar mass to C\'s) = 1.83 kg CO₂. This conversion shows up everywhere in carbon accounting.' },
          { text: 'About 0.5 kg', correct: false, explanation: 'That\'s the carbon CONTENT, but you asked about CO₂ — and CO₂ is heavier per atom of C because of the two oxygens. Multiply by 44/12.' },
        ],
      },
      {
        type: 'concept',
        heading: 'DBH — diameter at breast height',
        body: 'Forest researchers measure DBH (the trunk diameter at 1.3 m above ground) with a simple tape. Species-specific allometric equations convert DBH into total biomass — including roots, branches, and leaves — based on decades of cut-and-weigh studies. From biomass we get carbon (× 0.5) and CO₂-equivalent (× 44/12).',
      },
      {
        type: 'concept',
        heading: 'Above ground vs below ground',
        body: 'Average US forest holds 41% of its carbon above ground (trunks, branches, leaves) and 59% below ground (roots and soil organic carbon). The soil carbon is overlooked but huge — and it\'s the part most at risk when land is disturbed. Disturbing soil releases stored carbon over years.',
      },
      {
        type: 'quiz',
        question: 'Why does paving over a forest release MORE carbon than just letting it stand?',
        options: [
          { text: 'Pavement is dark and absorbs heat', correct: false, explanation: 'Pavement surface temperature is irrelevant to carbon accounting. The release comes from biology.' },
          { text: 'You lose the standing biomass AND the soil carbon decays once the soil is disturbed', correct: true, explanation: 'Right. The trees go into a pile or landfill — the wood\'s carbon comes back to the atmosphere over years to decades. PLUS the soil carbon that took centuries to build releases as the disturbed soil decomposes faster. Total release per acre: 200–400 mtCO₂e over years.' },
          { text: 'Cutting trees doesn\'t release carbon — only burning does', correct: false, explanation: 'Decay is just slow combustion at biological temperatures. The CO₂ comes out either way; burning is just faster.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Why old forests still matter',
        body: 'It\'s commonly said "young forests sequester faster, old forests are saturated." Both true and incomplete. Young forests grow fast in mass but young trees are small. Mature forests have more total carbon and continue accumulating in their soils for centuries. KUA\'s mixed-age forest is doing both.',
      },
      {
        type: 'concept',
        heading: 'KUA\'s forest math',
        body: '~1,000 acres × 2.1 mtCO₂e/acre/yr (Birdsey 1992 average for US forests) ≈ 2,100 mtCO₂e/yr — and that\'s the conservative estimate. Open-grown campus trees can reach 4.2 mtCO₂e/acre/yr (Nowak 2013). Mid estimate: ~3,000 mtCO₂e/yr drawdown. The biology says yes, the dashboard counts it.',
      },
      {
        type: 'finish',
        heading: 'You can do the forest math now',
        body: 'Photosynthesis → biomass → carbon (× 0.5) → CO₂ (× 44/12). DBH gives biomass via allometric equations. Above-ground + below-ground stocks add up to the forest\'s total. Keep this math close — it\'s the foundation of every nature-based climate solution.',
      },
    ],
  },

  {
    id: 'energy-grid',
    title: 'Energy and the New England grid',
    desc: 'How the grid mixes sources every hour, why heat pumps work, and the physics of capacity factors.',
    subject: 'Connects to physics & engineering',
    estMin: 7,
    steps: [
      {
        type: 'concept',
        heading: 'The grid is a balancing act, every second',
        body: 'Electricity can\'t be stored at scale (yet) on most grids. Supply and demand must match instantaneously, or frequency drifts and protective relays trip plants offline. ISO New England — the regional grid operator — coordinates dozens of generators in real time to keep that balance.',
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
          { text: 'Different generators run at different times — gas peakers fire up at high demand', correct: true, explanation: 'Right. At 3am demand is low and the cleanest baseload sources (nuclear, hydro, wind) cover it. At 6pm on a hot summer evening, demand spikes and gas peakers — sometimes oil — fire up to meet it. The marginal kWh you consume at peak is dirtier than the marginal kWh you consume overnight. ISO-NE publishes real-time emission data.' },
          { text: 'The factor is constant year-round', correct: false, explanation: 'No — both seasonally and hourly the mix shifts. Annual averages mask big swings.' },
          { text: 'The grid switches off solar at night and runs only nuclear', correct: false, explanation: 'Solar IS unavailable at night, but the rest of the grid keeps running — gas, nuclear, hydro, imports.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Heat pumps — moving heat is cheaper than making it',
        body: 'A heat pump is essentially a refrigerator running backward. Instead of moving heat OUT of a fridge, it moves heat IN to your building, pulling it from outdoor air or the ground. Modern cold-climate heat pumps deliver 2.5–3.5 kWh of heating per 1 kWh of electricity — that ratio is the COP (coefficient of performance). It\'s thermodynamically free heat; the electricity just runs the pump.',
      },
      {
        type: 'quiz',
        question: 'KUA replaces an oil boiler (6,000 gal/yr, 80% efficient) with a heat pump (COP 2.5). Roughly how much CO₂ is avoided per year?',
        options: [
          { text: '~0', correct: false, explanation: 'There are real savings — even though the heat pump uses electricity, that electricity is much less carbon-intensive per useful BTU than oil combustion.' },
          { text: '~38 mtCO₂e', correct: true, explanation: 'Right. Old: 6,000 × 10.16 = 61 mtCO₂e. New: 6,000 × 138,500 BTU × 0.80 / 3,412 / 2.5 = 78,000 kWh × 0.292 kg/kWh = 22.8 mtCO₂e. Net savings: 61 − 23 = 38 mtCO₂e. The exact number depends on the COP and grid factor, but the order of magnitude is correct.' },
          { text: '~100 mtCO₂e', correct: false, explanation: 'Too high — the heat pump still uses real electricity. The savings are 30–60 mt, not 100+.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Capacity factor — how much you actually get',
        body: 'A 100 kW solar array could generate 100 kW × 8,760 hr = 876 MWh per year if it ran at full output 24/7. It doesn\'t — clouds, night, and seasonal angle limit it. New Hampshire solar capacity factor: 13–16%. Onshore wind in NE: 25–35%. Nuclear: 90%+. Gas peakers: 5–15% (only fire up when needed). Knowing the capacity factor lets you compare a 100 MW solar farm to a 100 MW gas plant — they don\'t produce the same number of kWh.',
      },
      {
        type: 'concept',
        heading: 'Intermittency isn\'t fatal',
        body: 'A common myth: "renewables are too intermittent to run a grid." Texas (50%+ renewable on many days), California (60%+ on sunny days), Iowa (55%+ wind annually) prove the engineering is solvable. The recipe: geographic diversification, transmission upgrades, storage (battery, pumped hydro), demand response, and overbuilding. None of these are technological miracles — they\'re investment decisions.',
      },
      {
        type: 'finish',
        heading: 'You understand the grid',
        body: 'Supply must equal demand every second. The mix changes hour-by-hour. Heat pumps win on cleaner grids because of their COP. Capacity factors translate nameplate to actual energy. And the future grid is mostly an engineering problem, not a physics one.',
      },
    ],
  },

  {
    id: 'compare',
    title: 'How KUA compares',
    desc: 'Why peer comparisons are tricky, and what they actually show.',
    subject: 'Foundations',
    estMin: 3,
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
        type: 'concept',
        heading: 'Middlebury\'s "net zero" is different from KUA\'s drawdown',
        body: 'Middlebury reports as carbon-neutral, but they get there by purchasing carbon offsets equal to their gross emissions. The CO₂ molecules they emit still go up; they just paid someone else to remove an equal amount somewhere else. KUA\'s 3,000 mtCO₂e/yr from the campus forest is physical — those CO₂ molecules are actually pulled out of the air, on KUA land.',
      },
      {
        type: 'finish',
        heading: 'Comparison context, not a leaderboard',
        body: 'KUA\'s shape (heavy travel, with a green sinks bar) is structurally normal for a NH boarding school. The unique thing is that we measure the sinks at all — Valls-Val & Bovea (2021) found this gap in HEI carbon reporting, and the dashboard exists partly to close it.',
      },
    ],
  },

  {
    id: 'actions',
    title: 'What actually changes the number',
    desc: 'Action levers ranked by impact, with the math behind each.',
    subject: 'Foundations',
    estMin: 4,
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
    estMin: 6,
    steps: [
      {
        type: 'concept',
        heading: 'Individual action — the honest answer',
        body: 'No single student\'s choices solve climate change. But high-emitting individuals (frequent flyers, big homes, beef-heavy diets) have outsized footprints, and choices send market signals. Cordero et al. (2020) tracked students who calculated their own footprints and found measurable behavior changes years later. The educational value is real even when the per-person tons are small.',
      },
      {
        type: 'concept',
        heading: 'For KUA students, travel is by far the biggest lever',
        body: 'A student\'s personal annual footprint at KUA might be 5–8 mtCO₂e. A single intercontinental round-trip flight is ~3 of those. Domestic flights are ~1 mtCO₂e per round trip. Driving 1,000 miles in a typical car: ~0.4 mtCO₂e. Train BOS↔NYC: ~0.05 mtCO₂e per round trip. The mode and the distance both matter.',
      },
      {
        type: 'quiz',
        question: 'A student replaces ONE round-trip flight to East Asia with a winter on-campus stay. Roughly how much CO₂ is avoided?',
        options: [
          { text: '~0.3 mtCO₂e', correct: false, explanation: 'Way too low — that would be more like a regional drive.' },
          { text: '~3 mtCO₂e', correct: true, explanation: 'Right. ~7,500 km × 2 × 0.195 kg CO₂e per passenger-km (with radiative forcing) ≈ 2.93 mtCO₂e. That single decision is roughly half a typical student\'s annual personal footprint.' },
          { text: '~30 mtCO₂e', correct: false, explanation: 'Too high — that\'d be ten round trips.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Food choices — pound-for-pound',
        body: 'A rough order: 1 kg of beef is ~60 kg CO₂e. 1 kg of chicken: ~6. 1 kg of rice: ~4 (mostly methane from paddy fields). 1 kg of beans: ~0.9. 1 kg of potatoes: ~0.4. The dominant pattern: ruminant meat (beef, lamb) is roughly 10× the impact of poultry, and 50–100× the impact of common plant foods.',
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
        body: 'Turning off lights and electronics: small but free. Setting your radiator one notch lower in winter: real impact across a year. Showering shorter: water+heating savings. Choosing reusable over disposable: avoids the upstream emissions baked into single-use products. None individually huge, but together they shift the dorm-level baseline that infrastructure decisions then optimize against.',
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
  pathCard: { padding: '18px 20px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, cursor: 'pointer', textAlign: 'left', color: '#e5e7eb', transition: 'border-color 0.15s' },
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
              Eight learning paths, ordered roughly by depth. The "Foundations" paths cover the
              dashboard itself. The class-tagged paths go deeper — they connect to topics from
              chemistry, biology, physics, and civics so the carbon math meets your classwork.
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
                    <button
                      key={i}
                      type="button"
                      style={styles.option(state)}
                      disabled={!!answer}
                      onClick={() => choose(i, opt)}
                    >
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
            <button
              type="button"
              style={styles.primary}
              onClick={next}
              disabled={step.type === 'quiz' && !answer}
            >
              {step.type === 'quiz' && !answer ? 'Pick an answer' : 'Continue →'}
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
