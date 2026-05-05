import React, { useState } from 'react';
import { SCOPE1_TOTAL_MT, SCOPE2_TOTAL_MT, SCOPE3_TOTAL_MT, GROSS_MT } from '../data/scopeTotals.js';
import { ANNUAL_SEQUESTRATION_MT } from '../data/sinks.js';
import { TOTAL_STUDENTS } from '../data/students.js';

// Reactive headline figures — composed from the same canonical sources the
// rest of the dashboard imports, so the lesson narrative cannot drift from
// the homepage hero. Quiz scenarios further down still use round legacy
// inputs so each scenario's math lines up with its answer choices; those
// blocks are flagged in-line where they appear.
const KUA = (() => {
  const gross = Math.round(GROSS_MT);
  const sinks = Math.round(ANNUAL_SEQUESTRATION_MT);
  const net   = gross - sinks;
  return {
    scope1: Math.round(SCOPE1_TOTAL_MT).toLocaleString(),
    scope2: Math.round(SCOPE2_TOTAL_MT).toLocaleString(),
    scope3: Math.round(SCOPE3_TOTAL_MT).toLocaleString(),
    gross:  gross.toLocaleString(),
    sinks:  sinks.toLocaleString(),
    net:    net.toLocaleString(),
    perStudent: (net / TOTAL_STUDENTS).toFixed(1),
  };
})();

// Inline formatter — handles **bold** markers and \n\n paragraph breaks without
// pulling in a markdown dependency.
function Fmt({ text }) {
  if (!text) return null;
  const renderInline = (s) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={i} style={{ color: '#e5e7eb', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{p}</React.Fragment>;
    });
  const paragraphs = text.split(/\n\n+/);
  if (paragraphs.length === 1) return <>{renderInline(text)}</>;
  return (
    <>
      {paragraphs.map((para, i) => (
        <span key={i} style={{ display: 'block', marginTop: i === 0 ? 0 : 14 }}>
          {renderInline(para)}
        </span>
      ))}
    </>
  );
}

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
        body: 'Earth\'s **average surface temperature is rising**. The numbers are unambiguous: about **1.2 °C of warming since the late 1800s**, with most of that increase happening in the past 50 years. In human terms this sounds slow. In geological terms it\'s extremely fast — for most of human history, global average temperatures shifted by tenths of a degree over thousands of years. We\'ve matched that kind of shift in roughly **one human lifetime**.\n\nThe basic mechanism has been understood for **over 170 years**. In the 1850s, the Irish physicist **John Tyndall** showed in his laboratory that certain gases — water vapor, carbon dioxide, methane, ozone — absorb infrared (heat) radiation while letting visible light pass through. In **1896**, the Swedish chemist **Svante Arrhenius** worked out the math: he calculated that doubling atmospheric CO₂ would warm the planet by 5–6 °C. His estimate was off by maybe a factor of two, but he got the basic physics right with pen and paper, **before computers**, before satellites, before any meaningful global temperature record.\n\nThe Cause we\'re dealing with today is well-established and **not seriously contested** within the scientific community. Humans burn **fossil fuels** (coal, oil, natural gas) for energy, transportation, heating, and industry, and we clear forests for farms and development. Both activities release **carbon dioxide (CO₂)** into the atmosphere far faster than the natural carbon cycle can absorb it. The result is the rapid concentration buildup we observe.\n\nThe evidence comes from many independent lines:\n\n**Direct measurement.** Atmospheric CO₂ has been measured continuously at Mauna Loa, Hawaii since 1958 by the Keeling Curve project. CO₂ has risen from **~315 ppm then to ~425 ppm today**. Pre-industrial CO₂ was roughly **280 ppm**.\n\n**Ice cores.** Bubbles trapped in Antarctic and Greenland ice contain ancient atmosphere. They show CO₂ levels going back **800,000 years** — and through that whole period, CO₂ stayed between ~180 and ~300 ppm. We are now far above that range. The ice cores also show that **temperature and CO₂ rise together**, every time.\n\n**Isotope analysis.** Fossil fuels have a specific carbon isotope signature (low ¹⁴C, depleted ¹³C). The CO₂ now in the atmosphere shows that exact signature, which is the **smoking gun** that the extra CO₂ is from us, not from natural sources.\n\n**Climate models.** Computer simulations that include greenhouse gases reproduce the observed warming. Simulations that don\'t include human emissions don\'t.\n\nThe science is summarized by the **Intergovernmental Panel on Climate Change (IPCC)**, a UN body that synthesizes thousands of peer-reviewed studies every few years. The IPCC\'s most recent assessment (**AR6, 2021**) states with **>99% confidence** that human activity is the dominant cause of observed warming since 1950. This level of confidence is unusual in science and reflects a large body of consistent evidence from many disciplines.\n\nFinally, "climate change" doesn\'t just mean warmer averages — it means **shifts in the entire climate system**. More extreme weather, changing precipitation patterns, melting ice, ocean warming and acidification, and the disruption of ecosystems that took millennia to evolve. Some of these changes feed back on themselves: melting Arctic ice exposes dark ocean that absorbs more sunlight, which melts more ice. **Feedback loops** are why small changes in CO₂ produce larger changes in climate, and why some warming, once started, is hard to stop.',
      },
      {
        type: 'concept',
        heading: 'The greenhouse effect, in detail',
        body: 'Start with the **parked-car analogy**. On a sunny day, sunlight passes through the windows of a car easily — that\'s **visible light**, wavelengths your eyes can see. The seats, dashboard, and interior surfaces absorb the sunlight and warm up. As they warm, they re-emit that energy as **infrared (heat) radiation**, which has a longer wavelength than visible light. But the glass behaves differently for infrared than for visible: it **transmits visible light freely but absorbs infrared**. So heat that came in as light can\'t easily escape as IR. The car interior temperature climbs until enough heat leaks out through other paths to balance what comes in. That\'s why a parked car in summer can hit 50 °C while it\'s only 25 °C outside.\n\n**Earth\'s atmosphere does almost exactly the same thing**, but the "glass" is made of gases. Specifically, **greenhouse gases** — molecules whose vibrational structure lets them absorb infrared. The major ones are:\n\n**Water vapor (H₂O)** — the dominant greenhouse gas in raw effect, but its concentration depends on temperature (more heat = more evaporation = more water vapor = more warming). Water vapor is therefore a **feedback** rather than a primary driver.\n\n**Carbon dioxide (CO₂)** — the main human-driven greenhouse gas. Long-lived (centuries in the atmosphere). Mostly from fossil fuel combustion and deforestation.\n\n**Methane (CH₄)** — much less abundant but **~28× as potent per molecule over 100 years**. Sources: livestock digestion, rice paddies, leaking natural gas, landfill decomposition, melting permafrost.\n\n**Nitrous oxide (N₂O)** — from agricultural fertilizers, fossil combustion, and industrial processes. ~273× as potent as CO₂.\n\n**Ozone (O₃)** — in the stratosphere it protects us from UV, but in the lower atmosphere (troposphere) it acts as a greenhouse gas.\n\n**Fluorinated gases** — refrigerants like R-410A (used in HVAC), and SF₆ (used in electrical equipment). Tiny atmospheric concentrations but **thousands of times** as potent per molecule as CO₂.\n\nWhat makes a gas a greenhouse gas? **Its molecular structure must allow infrared absorption.** A gas can absorb IR only when its **vibrational modes change the molecule\'s dipole moment** as it vibrates. Symmetric diatomic molecules like N₂ and O₂ — which together make up **99% of the atmosphere** — have no dipole moment to begin with, and their symmetric stretching doesn\'t create one. So they\'re essentially **transparent to IR**. CO₂ is asymmetric in two of its three vibrational modes, so it absorbs strongly in the infrared, even though it\'s only 0.04% of the atmosphere.\n\nThe greenhouse effect is **not inherently bad**. Without ANY greenhouse effect, Earth\'s average surface temperature would be about **−18 °C (0 °F)** — frozen, mostly uninhabitable. The natural greenhouse effect raises that to about **+15 °C (59 °F)**. Life as we know it depends on this 33 °C of natural warming.\n\nThe problem is that we\'re **intensifying** the effect by adding more greenhouse gases. Pre-industrial CO₂ was ~280 ppm, supporting the natural 15 °C average. Today it\'s ~425 ppm — and the atmosphere is responding accordingly. This isn\'t a binary "greenhouse effect bad" story; it\'s a **dose-response problem**. The natural amount keeps Earth livable; the extra amount we\'ve added is destabilizing the climate system.\n\nFor comparison: **Venus** has a runaway greenhouse atmosphere (96% CO₂, surface 460 °C — hot enough to melt lead). **Mars** has only a thin CO₂ atmosphere and averages −60 °C. Earth sits in the **habitable middle**, and the chemistry of how much CO₂ we keep in our air determines where in that range we land.',
      },
      {
        type: 'quiz',
        question: 'Where does most of the extra CO₂ come from?',
        options: [
          { text: 'Burning fossil fuels — gas, oil, coal', correct: true, explanation: 'Right. About 75% of human CO₂ emissions come from burning fossil fuels for energy, heating, and transportation. The other 25% mostly comes from cutting down forests and from industrial processes like cement production.' },
          { text: 'Volcanoes', correct: false, explanation: 'Volcanoes do release CO₂ — but humans now release ~100× more per year than all volcanoes combined. Volcanic CO₂ has been part of the natural carbon cycle for billions of years; what\'s new in the last 200 years is the fossil-fuel pulse.' },
          { text: 'People breathing', correct: false, explanation: 'People do exhale CO₂, but the carbon comes from food we eat, which came from plants that just absorbed it from the air. It\'s a closed loop — no NEW carbon enters the atmosphere from breathing.' },
          { text: 'The Sun heating up', correct: false, explanation: 'The Sun\'s output has actually been slightly DECREASING over the past 60 years, even as Earth warmed dramatically. If it were the Sun, the upper atmosphere would warm too — instead we see the lower atmosphere warming and the upper cooling, exactly the fingerprint of greenhouse trapping.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Atmospheric CO₂ has risen from about 280 ppm pre-industrial to what today?',
        options: [
          { text: '~310 ppm', correct: false, explanation: 'Higher than that. We crossed 310 ppm in the 1950s, decades ago.' },
          { text: '~425 ppm', correct: true, explanation: 'Right. ~280 ppm pre-industrial → ~425 ppm today is a **50% increase** in the gas that drives the greenhouse effect. Ice cores show this is the highest CO₂ concentration in **at least 3 million years** — long before modern humans existed. The Keeling Curve at Mauna Loa has been tracking this rise continuously since 1958.' },
          { text: '~600 ppm', correct: false, explanation: 'We\'re not there yet. ~600 ppm is what business-as-usual scenarios project by 2100 if emissions don\'t decline. Some lower-emission pathways keep us under 500 ppm; some higher-emission pathways push past 700.' },
          { text: '~250 ppm', correct: false, explanation: 'That\'s lower than pre-industrial. Atmospheric CO₂ has only risen since the late 1700s — never decreased on a sustained basis. The recent 425 ppm figure is the highest in 3 million years.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Why does it matter?',
        body: 'A warmer global **average** sounds harmless — what\'s a few degrees? — but the average **hides** the bigger changes that come with it. The same way an "average" 20 °C day in spring can mean either a steady 20 °C or a 5 °C night and a 35 °C afternoon, a small change in global mean temperature reflects much larger changes in extremes, patterns, and feedbacks.\n\n**More extreme weather.** Warmer air holds more moisture (~7% more per °C of warming), so when it rains, it tends to rain harder. Hurricanes intensify faster because warmer oceans give them more energy. Heat waves last longer and are hotter. Droughts in already-dry regions become more severe because heat accelerates evaporation. **The 10 hottest years on record have all occurred since 2014.** Insurance industries — who care about real costs, not politics — are already pricing climate risk into premiums and pulling out of coastal markets.\n\n**Rising sea levels.** Two effects combine: ice on Greenland and Antarctica is melting and adding water, and the existing ocean is **thermally expanding** as it warms (warmer water takes up more volume). Together they\'ve raised global mean sea level by about **20 cm since 1880**. Best-case scenarios for the rest of this century project an additional **30 cm by 2100**; worst-case scenarios with rapid Antarctic ice-sheet collapse exceed **100 cm**. Coastal cities — Miami, New York, Mumbai, Shanghai, Jakarta, Lagos, Manila, Dhaka — face existential adaptation challenges. Hundreds of millions of people live within a few meters of current sea level.\n\n**Shifting agriculture.** Where you can grow what you grow is changing. Wheat, corn, and rice yields decline above certain temperature thresholds. Wine regions are migrating poleward. Coffee growing regions in Central America are losing altitude. Adapting takes years, money, and political coordination — none of which scale at the rate the climate is shifting.\n\n**Ecosystem stress and species loss.** Marine ecosystems built around stable ocean chemistry are fracturing — coral reefs (which support ~25% of marine biodiversity) are dying from heat-driven **bleaching events**. Trees in western North America are losing the temperature window they evolved for. Species that can\'t move fast enough — or whose migration paths are blocked by human development — face **extinction**. The current rate of species loss is **100–1,000× the natural background rate** and accelerating.\n\n**Tipping points and irreversibility.** Some climate processes have **thresholds** beyond which they accelerate themselves. The Greenland ice sheet might reach a melt rate that becomes self-sustaining. The Amazon rainforest might transition from net carbon sink to net carbon source. Permafrost in Siberia and Canada is already melting, releasing methane that adds to warming. Once these thresholds are crossed, **stopping emissions doesn\'t reverse them on any human timescale**. CO₂ released today affects the climate for centuries.\n\n**Climate justice.** The countries that have emitted the most historical CO₂ (US, Europe, Japan, increasingly China) are not the same countries that are most affected by warming (small island nations, sub-Saharan Africa, South Asia). The poorest people in the most vulnerable regions face the worst impacts despite having contributed least to the problem. This **moral asymmetry** is one of the central tensions of international climate negotiations.\n\n**Why the urgency is real.** CO₂ is essentially permanent on human timescales. About 25% of CO₂ emitted today will still affect the climate **1,000 years from now**. There is no future technology that scrubs the atmosphere clean cheaply at scale — we have ideas, but at the prices and scales we\'d need, they\'re not on the horizon. The choices being made in the next decade or two will shape the climate every human alive today and most of the next ten generations will live in.',
      },
      {
        type: 'quiz',
        question: 'Roughly how much has global mean sea level risen since 1880?',
        options: [
          { text: '~5 cm', correct: false, explanation: 'More than that. We\'ve seen ~20 cm so far. The rate has also been accelerating — recent decades show ~3.5 mm/year vs ~1.4 mm/year in the early 1900s.' },
          { text: '~20 cm', correct: true, explanation: 'Right. About **20 cm of sea-level rise since 1880** — from two effects combined: ice melt (Greenland and Antarctica) plus thermal expansion (warmer water takes up more volume). Best-case projections add another **30 cm by 2100**; worst-case scenarios with rapid Antarctic ice-sheet collapse exceed **100 cm**. Hundreds of millions of people live within a few meters of current sea level.' },
          { text: '~100 cm', correct: false, explanation: 'That\'s a worst-case 2100 projection, not what has already happened. We\'re on track for somewhere between 30 and 100 cm by end of century depending on emissions trajectory and ice-sheet stability.' },
          { text: '~5 mm', correct: false, explanation: 'Way too small — that\'s about ONE year of recent rise, not 145 years\' worth. The cumulative figure is roughly 200 mm = 20 cm.' },
        ],
      },
      {
        type: 'concept',
        heading: 'What\'s being done?',
        body: 'In **2015**, nearly every country in the world signed the **Paris Agreement** — an international commitment to limit warming to "well below 2 °C" and ideally to **1.5 °C above pre-industrial levels**. We\'re currently at about 1.2 °C, so the room to maneuver is small.\n\nCountries set their own emission-reduction targets and report progress. Some are doing well; some aren\'t. The **technology** to reduce emissions exists — solar and wind are now cheaper than fossil fuels in most places, electric cars and heat pumps work, energy efficiency saves money. The **engineering problem is largely solved**. The challenges are mostly political, economic, and social.\n\nAt the institutional level, schools and companies are **measuring their footprints, setting reduction targets, and acting on them**. KUA\'s carbon dashboard is one piece of that effort — and the methodology principle behind it is simple: **you can\'t reduce what you can\'t measure**. Once a school knows its number and what drives it, the conversation shifts from vague good intentions to specific projects.',
      },
      {
        type: 'quiz',
        question: 'Methane (CH₄) has a much higher GWP100 per molecule than CO₂. So why does CO₂ get more attention in climate policy?',
        options: [
          { text: 'CO₂ is more potent in the long run', correct: false, explanation: 'Per molecule, CH₄ is 28× more potent than CO₂ over 100 years. CO₂ doesn\'t win on potency; it wins on TOTAL MASS.' },
          { text: 'There\'s vastly more CO₂ being emitted by mass than methane', correct: true, explanation: 'Right. Annual global CO₂ emissions: ~37 Gt. Annual global methane: ~0.4 Gt. Even with methane\'s 28× GWP, total CH₄-equivalent is only ~11 Gt vs CO₂ at 37 Gt. **CO₂ dominates because we emit so much more of it**, even though it\'s weaker per molecule. Policy attention follows total impact, which is concentration × potency.' },
          { text: 'Methane is natural and CO₂ isn\'t', correct: false, explanation: 'Both are natural gases that humans emit in addition to natural sources. Both contribute to anthropogenic warming.' },
          { text: 'CO₂ stays in the atmosphere longer', correct: false, explanation: 'True (centuries vs ~12 years for CH₄), but this is REFLECTED in GWP100 already. The relevant fact is that we emit so much more CO₂ by mass.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Earth has had warm periods before in geological history. Why is the current warming considered different?',
        options: [
          { text: 'It\'s warmer than ever before', correct: false, explanation: 'False. Earth has been warmer in the past — Cretaceous era, around 100 million years ago, was much warmer. The issue isn\'t the absolute temperature.' },
          { text: 'It\'s happening unprecedentedly fast and is caused by humans', correct: true, explanation: 'Right. Past warm periods happened over **millions of years**, giving species and ecosystems time to adapt. Current warming is happening in **decades to centuries** — orders of magnitude faster. The cause is also unique: previous shifts were driven by orbital cycles, volcanic activity, and natural CO₂ swings. Today\'s rise is from human burning of fossil fuels, with isotopic fingerprints that prove the source.' },
          { text: 'Volcanoes used to be more active', correct: false, explanation: 'Volcanic activity has been roughly steady on geological timescales. It\'s not the driver of recent warming.' },
          { text: 'Past warming was good and current warming is bad', correct: false, explanation: 'Whether warming is "good" or "bad" depends on context — what\'s being asked, what we\'re comparing to, what species and societies exist now. The scientific issue is the rate and the human cause, not a moral judgment about temperature.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which sector emits the most global CO₂?',
        options: [
          { text: 'Transportation (cars, trucks, planes, ships)', correct: false, explanation: '~16% of global emissions. Significant but not the largest. Most road-vehicle CO₂ comes from passenger cars and freight trucks.' },
          { text: 'Energy (electricity and heat generation)', correct: true, explanation: 'Right. **Energy generation is ~30% of global emissions** — the largest single sector. This includes electricity grids, district heating, and industrial process heat. It\'s also the most addressable: replacing fossil-fired power plants with wind, solar, nuclear, and storage is the most direct path to cutting global emissions. The IRA, EU Green Deal, and China\'s mass renewable buildout all target this sector first.' },
          { text: 'Agriculture (livestock and crops)', correct: false, explanation: '~11% of global emissions, but a higher share of methane and N₂O specifically. Important sector but smaller than energy.' },
          { text: 'Buildings (heating and cooling)', correct: false, explanation: '~6% direct emissions (boilers, etc.), but buildings also DRIVE significant electricity demand which lands in the energy sector. Combined heating + cooling load is large but the direct emissions are relatively concentrated.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which sector emits the most global CO₂?',
        options: [
          { text: 'Energy generation (electricity & heat)', correct: true, explanation: 'Right. **~30% of global emissions** — the largest single sector. Replacing fossil-fired plants with wind, solar, nuclear, and storage is the most direct path to cutting global emissions.' },
          { text: 'Transportation', correct: false, explanation: '~16% — significant but second to energy.' },
          { text: 'Agriculture', correct: false, explanation: '~11% of global, but dominant for methane and N₂O specifically.' },
          { text: 'Buildings (direct heating)', correct: false, explanation: '~6% direct, though buildings drive significant electricity demand which lands in the energy sector.' },
        ],
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
        body: 'A **carbon footprint** is the total amount of greenhouse gases — measured in **metric tons of CO₂-equivalent (mtCO₂e)** — that a person, a school, a company, or a country is responsible for releasing into the atmosphere over a given period (usually one year). It\'s a way to put a single number on a complicated reality so you can track it, compare it, and act on it.\n\nThink of it like **counting calories, but for greenhouse gas emissions instead of food**. Just as a calorie count summarizes diverse foods into one comparable number — a banana, a steak, a bowl of rice each have their own calorie count — a carbon footprint summarizes diverse emission sources (driving, flying, heating, eating, buying things, throwing things away) into one comparable number. The trick is that the actual gases involved differ (CO₂ from combustion, methane from cattle and landfills, nitrous oxide from fertilizers, refrigerants from leaky ACs), and they each have different warming potencies. So we **convert all of them to the CO₂-equivalent** that would have the same warming effect over a 100-year period — that\'s where the "e" in "mtCO₂e" comes from.\n\nThis conversion is done with **Global Warming Potentials (GWPs)** published by the **IPCC**:\n\n**CO₂** is the reference, GWP = 1.\n**Methane (CH₄)** has GWP100 = 28.\n**Nitrous oxide (N₂O)** has GWP100 = 273.\n**HFC-134a** (a common refrigerant) has GWP100 = 1,530.\n**SF₆** (used in electrical equipment) has GWP100 = 24,300.\n\nSo 1 kg of methane released has the same 100-year warming effect as 28 kg of CO₂. Multiply the gas emissions by their GWPs, sum the result, and you have a single number representing total warming impact.\n\nThe **footprint is split into three categories called "scopes"** based on who controls the emission source. The Greenhouse Gas Protocol — the global accounting standard developed by the World Resources Institute and World Business Council for Sustainable Development — defines them this way:\n\n**Scope 1 — direct emissions.** Things you (or your school) burn or release directly. Heating oil in the boiler, propane in the water heater, gasoline in your fleet vehicles, refrigerants leaking from HVAC equipment. If you can choose to turn it off, it\'s Scope 1.\n\n**Scope 2 — purchased electricity.** Indirect emissions from electricity you buy from the grid. You don\'t burn coal at the school — but the power company does, on your behalf, every time someone plugs in a laptop. We measure your kWh consumption and multiply by the average emission factor of the regional grid (for KUA, that\'s ISO New England at 643 lb CO₂ per MWh in 2024).\n\n**Scope 3 — everything else.** All other indirect emissions. The food in your dining hall (whose production emitted CO₂ on a farm hundreds of miles away). The flights students take home for break. The paper for textbooks. The waste truck that drives to the landfill. Construction materials. The Greenhouse Gas Protocol formally defines **15 separate Scope 3 categories**; for a residential boarding school, the dominant ones are usually student travel, food procurement, and waste.\n\nThe distinction matters because **who controls the emission determines who can reduce it**. A school can decide to switch its boilers to heat pumps (a Scope 1 reduction). It can negotiate a cleaner electricity supply contract (a Scope 2 reduction, market-based). It can encourage students to reduce flying or buy local food (Scope 3 reductions). Different categories require different strategies, partners, and authority.\n\nKUA\'s dashboard tracks all three scopes, plus a fourth category called **sinks** — the on-campus forest that pulls carbon **out** of the atmosphere via photosynthesis. Most peer schools don\'t measure their sinks; the gap that creates is large enough that it can dominate the comparison.\n\n**A few important limitations of footprint accounting** to keep in mind: it doesn\'t capture biodiversity loss, water use, or other environmental effects beyond climate. It can over- or under-count depending on methodology choices (which is why peer comparisons need to be careful — see the "How KUA compares" path). And it focuses on **flows** (annual emissions) rather than **stocks** (historical accumulated emissions, which is what actually drives current climate). Despite those limitations, it remains the most useful single number for tracking and acting on climate impact at any organizational scale.',
      },
      {
        type: 'quiz',
        question: 'Which greenhouse gas has the HIGHEST global warming potential per molecule?',
        options: [
          { text: 'CO₂', correct: false, explanation: 'CO₂ is the reference (GWP100 = 1). Other gases are measured RELATIVE to CO₂. CO₂ has the most TOTAL warming impact because there\'s so much of it, but per molecule it\'s the weakest of the major GHGs.' },
          { text: 'Methane (CH₄)', correct: false, explanation: 'Methane is potent (GWP100 = 28) but not the highest. It\'s a SHORT-lived gas — its 20-year potency is much higher (~84) but it oxidizes within ~12 years. Methane matters disproportionately for near-term warming.' },
          { text: 'SF₆ (sulfur hexafluoride)', correct: true, explanation: 'Right. **SF₆ has GWP100 = 24,300** — the highest of any major greenhouse gas. It\'s used in electrical equipment (high-voltage switches and substations) where its insulating properties are valuable, but any leakage has enormous warming impact. The good news: total atmospheric SF₆ is still tiny because it\'s used in small quantities. R-410A (a common refrigerant) is also significant at 2,256.' },
          { text: 'Water vapor (H₂O)', correct: false, explanation: 'Water vapor IS a greenhouse gas — and the most abundant one in the atmosphere — but it doesn\'t get a GWP value because it\'s a FEEDBACK rather than a forcing. Its concentration depends on temperature: warmer air holds more water vapor, which causes more warming, which holds more vapor. We don\'t add water vapor directly; we\'re indirectly amplifying it via CO₂ warming.' },
        ],
      },
      {
        type: 'concept',
        heading: 'How big is one ton of CO₂?',
        body: 'A **metric ton (mt) = 1,000 kilograms** — roughly the weight of a small car. But CO₂ is a gas, so the **physical volume** is harder to picture. At standard temperature and pressure, **one metric ton of CO₂ would fill a sphere about 8 meters across** — bigger than a typical house room.\n\nFor scale comparisons:\n\n**The average American** emits about **16 mtCO₂e per year** — among the highest per-capita rates in the world.\n**The average European** emits about **8 mtCO₂e per year** — half the US rate, despite similar standards of living.\n**The global average** is about **5 mtCO₂e per person per year**.\n**To stay under 1.5 °C** of warming, the global average needs to fall to about **2 mtCO₂e per person per year by 2050**.\n\n**KUA students\' school-related footprint** is roughly **5–8 mtCO₂e per year** before forest credits — meaning a typical KUA student\'s school carbon is about half their home-life carbon. (Personal home emissions are separate from the school dashboard.)',
      },
      {
        type: 'quiz',
        question: 'A typical American\'s annual carbon footprint is roughly:',
        options: [
          { text: '~5 mtCO₂e', correct: false, explanation: 'That\'s closer to the GLOBAL average per person, not the US average. The US sits well above global average.' },
          { text: '~16 mtCO₂e', correct: true, explanation: 'Right. The average American emits about **16 mtCO₂e per year** — among the highest per-capita rates in the world. The European average is ~8 (half), the global average is ~5, and to stay under 1.5°C of warming, the global average needs to fall to about **2 mtCO₂e per person per year by 2050**. KUA students\' school-related footprint is roughly 5–8 mt — about half their typical home-life carbon.' },
          { text: '~50 mtCO₂e', correct: false, explanation: 'Way too high. That would be more than 3× the actual US average. Even the highest-emitting individuals (frequent flyers, large homes) typically max out around 30–40 mt; nations with very heavy industry can hit ~30 per capita (Qatar, Trinidad) but the US is ~16.' },
          { text: '~1 mtCO₂e', correct: false, explanation: 'Way too low. 1 mt/year is what the global average needs to reach by mid-century to stay under 1.5°C of warming. The US is currently 16× that level.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Why measure it?',
        body: '**You can\'t reduce what you don\'t measure.** This is the single most important reason for any carbon dashboard to exist.\n\nIf a school says "we\'re working on sustainability" but doesn\'t publish a number, there\'s **no way to tell if anything is actually working**. The school could be doing meaningful work or doing nothing. Measurement turns vague good intentions into a concrete starting point.\n\nWith a measured number, the school can:\n\n**Set a real goal.** "Reduce emissions by 30% by 2030" only means something if you know what 100% looks like.\n**Track progress over time.** Year-over-year comparisons reveal whether projects are working.\n**Compare to peer institutions.** Without consistent measurement methodology, comparisons are meaningless. With it, you see how you stack up.\n**Identify the highest-leverage interventions.** It turns out some changes save dozens of tons; others save dozens of pounds. Knowing the difference shapes investment decisions.\n**Hold the institution accountable.** Public, sourced numbers are harder to spin than vague claims.\n\nCordero et al. (2020), a peer-reviewed study, found that **students who calculate their own carbon footprints** make **measurable pro-environmental choices for years afterward**. The educational value of measurement is real — and it\'s why this dashboard exists.',
      },
      {
        type: 'concept',
        heading: 'KUA\'s situation',
        body: `Here are the **headline numbers** for KUA's footprint, in plain language:\n\n**Gross emissions: ~${KUA.gross} tons CO₂e per year.** That's the total released by KUA's operations and indirect activities. About ${KUA.scope1} tons from heating fuel (Scope 1), ${KUA.scope2} tons from purchased electricity (Scope 2), and ${KUA.scope3} tons from indirect sources like student travel, food supply, and waste (Scope 3).\n\n**Sequestration: ~${KUA.sinks} tons CO₂e per year drawdown.** KUA owns roughly **1,000 acres of forest** in New Hampshire. Through photosynthesis, those trees pull CO₂ out of the atmosphere and lock it into wood, leaves, roots, and soil organic carbon. Most peer schools **don't even measure this** — KUA does, which is unusual.\n\n**Net carbon balance: ~${KUA.net} tons CO₂e per year.** That's gross minus sequestration. Per student: about **${KUA.perStudent} mtCO₂e/year**. For comparison, peer boarding schools are typically **6–10 mtCO₂e/student/year** — KUA looks lower largely because we count our forest, but also because the New England grid is fairly clean.\n\n**Important honesty:** these numbers are **preliminary estimates** until measured data is fully loaded. As fuel-delivery records, travel data, and tree-inventory measurements land, the range tightens.\n\n*(The worked-math quiz scenarios that follow use rounded baseline inputs so each scenario's arithmetic lines up cleanly with its answer choices — small differences from the headline above are expected.)*`,
      },
      {
        type: 'quiz',
        question: 'Why is measuring on-campus tree absorption important for our footprint number?',
        options: [
          { text: 'It makes the school look better on paper', correct: false, explanation: 'That\'s a side effect, not the reason. If you only count emissions and ignore real drawdown, you\'re reporting an inaccurate picture in either direction. The principle is honesty, not flattery.' },
          { text: 'It\'s real CO₂ being pulled out of the air on KUA land — a true offset, not an accounting trick', correct: true, explanation: 'Right. Photosynthesis is real chemistry: trees take CO₂ from the air and lock it into wood and soil. If we don\'t count it, we underreport the school\'s true climate impact. Most schools don\'t measure this — KUA is unusual. Valls-Val & Bovea (2021) reviewed 35 university footprint studies and found this gap consistently.' },
          { text: 'Because trees are pretty', correct: false, explanation: 'They are, but that\'s aesthetic, not methodological. Trees matter for the carbon footprint because of their physical sequestration role, regardless of how they look.' },
          { text: 'Because we have to count them by law', correct: false, explanation: 'There\'s no law requiring it. The GHG Protocol explicitly leaves on-site sequestration as optional reporting. KUA\'s choice to measure sinks is voluntary — that\'s what makes it unusual among peer schools.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which of these is Scope 3 for a school?',
        options: [
          { text: 'Refrigerant leaking from the cafeteria walk-in cooler', correct: false, explanation: 'Scope 1 — KUA owns and maintains the cooler.' },
          { text: 'Electricity used to run the cafeteria walk-in cooler', correct: false, explanation: 'Scope 2 — electricity purchased from the grid.' },
          { text: 'CO₂ from the trucks delivering food to the cafeteria', correct: true, explanation: 'Right. **Upstream transportation of purchased goods is Scope 3** (Category 4). KUA doesn\'t own the trucks or burn the fuel — but those emissions happened because KUA purchased the food. The supplier\'s logistics show up in KUA\'s Scope 3 supply chain accounting.' },
          { text: 'Heat from the cafeteria\'s gas range', correct: false, explanation: 'Scope 1 — KUA buys the gas and burns it directly.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: emissions from gasoline',
        scenario: 'A teacher drives a personal car to a conference in NYC and back, total 500 miles, in a 30-mpg car. Calculate the CO₂ emitted from gasoline combustion.',
        given: [
          { label: 'Distance', value: '500 mi' },
          { label: 'Fuel economy', value: '30 mpg' },
          { label: 'Gasoline factor', value: '8.78 kg CO₂/gal' },
        ],
        question: 'Total CO₂ emissions:',
        options: [
          { text: '~150 kg CO₂', correct: true, explanation: 'Right. 500 / 30 = 16.67 gallons × 8.78 = ~146.4 kg CO₂. About a 7th of a metric ton — significant for one trip. (Note: this would be Scope 3 for KUA since the teacher uses personal vehicle for business travel — Category 6 business travel.)' },
          { text: '~75 kg CO₂', correct: false, explanation: 'Half the right answer. Recheck the gallons calculation.' },
          { text: '~500 kg CO₂', correct: false, explanation: 'You may have multiplied miles directly by the kg/gal factor without dividing by mpg first. The car uses ~16 gal, not 500.' },
          { text: '~1,500 kg CO₂', correct: false, explanation: 'Way too high — that would be ~10x the actual figure.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Why is Scope 3 the hardest scope to measure accurately?',
        options: [
          { text: 'Because it\'s the smallest', correct: false, explanation: 'Scope 3 is usually the LARGEST scope at residential institutions, not the smallest. Difficulty isn\'t about size.' },
          { text: 'Because the data lives at suppliers, vendors, and individual people — not at the school\'s meters', correct: true, explanation: 'Right. **Scope 1 and 2 have on-site meters and invoices.** A school can read its own gas meter, count its propane deliveries, and pull its own electricity bill. **Scope 3 requires data from outside parties** — supplier invoices, individual student travel patterns, waste-hauler reports, vendor sustainability data. That data is fragmented and often estimated, which is why methodology choices matter so much in Scope 3.' },
          { text: 'Because it\'s subjective', correct: false, explanation: 'Scope 3 is rule-based, not subjective. The categories and methodologies are well-defined; the challenge is data availability, not arbitrariness.' },
          { text: 'Because it changes year to year', correct: false, explanation: 'All scopes change year to year. The Scope 3 challenge is data sourcing, not temporal variability.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Why can\'t we just plant enough trees to absorb all human CO₂ emissions?',
        options: [
          { text: 'Trees emit CO₂ at night', correct: false, explanation: 'Trees DO respire (consume sugars and emit CO₂), but on net over their lifespan they sequester carbon. This isn\'t why trees can\'t solve the problem.' },
          { text: 'Global emissions (~37 GtCO₂/yr) are larger than the global terrestrial sink (~12 GtCO₂/yr) — even doubling forests can\'t close the gap', correct: true, explanation: 'Right. **The math doesn\'t work at scale.** Humanity emits ~37 Gt of CO₂ per year. Global terrestrial ecosystems absorb ~12 Gt per year. Even tripling that capacity can\'t absorb our annual emissions, let alone the centuries of accumulated past emissions. Forests are NECESSARY but not SUFFICIENT — we have to reduce emissions AND grow sinks.' },
          { text: 'Trees are too expensive to plant', correct: false, explanation: 'Tree planting is among the cheapest carbon interventions per ton when done well. Cost isn\'t the binding constraint.' },
          { text: 'There isn\'t enough carbon dioxide for trees', correct: false, explanation: 'Backwards — there\'s too much CO₂. Trees would happily take more if they had the space and water.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You can read the dashboard now',
        body: `A carbon footprint is the annual gas emissions a person or institution is responsible for. KUA's is about ${KUA.net} tons net, after counting the campus forest as a sink. The whole point of measuring is to give the community something concrete to act on. Pick another path to dig deeper.`,
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
        body: 'Not all "green" actions are created equal. **The numbers vary by 100×, sometimes 1,000×.** Turning off a light feels good but barely moves the needle. Choosing not to take one international flight saves more carbon than a decade of conscientious light-switching.\n\nThis is **not** a reason to give up on small actions — they add up at scale, and they build habits. But it IS a reason to **pay attention to magnitude**. If you only have time and energy for one thing, **do the big thing first**.\n\nA rough guide for KUA students, ordered by yearly carbon impact:\n\n**Travel decisions** — by far the largest. One round-trip flight to East Asia ≈ **3,000 kg CO₂e**. One flight to California ≈ 1,000 kg. Driving 1,000 miles ≈ 400 kg. Train Boston-NYC ≈ 50 kg per round trip.\n**Diet patterns** — meaningful. Switching half your beef meals to chicken for a year ≈ **300 kg saved**. Going fully vegetarian ≈ 500–1,000 kg saved.\n**Daily energy use** — small per item, big at scale. Showering shorter, electronics off when not in use, lower thermostat at night ≈ **20–100 kg saved per year per habit**.\n**Civic + institutional action** — the multiplier. Pushing for a heat-pump retrofit, organizing for clean-energy procurement, voting for climate policy ≈ **hundreds of times your personal footprint** if you succeed.',
      },
      {
        type: 'quiz',
        question: 'Which of these saves the most carbon over one year?',
        options: [
          { text: 'Always turning off your dorm light when you leave', correct: false, explanation: 'Helpful but small — about **5 kg CO₂/year** saved. Worth doing as a habit; not enough to be your top priority.' },
          { text: 'One fewer round-trip international flight', correct: true, explanation: 'Right. A single long-haul round-trip is about **3,000 kg CO₂** — about **600× as much as a year of conscientious light-switching**. If you can only pick one thing, the flight is where the leverage is. The math is just the difference in scale: aviation per-passenger-km factor (with radiative forcing) × thousands of km.' },
          { text: 'Recycling every plastic bottle for a year', correct: false, explanation: 'Recycling matters but is small in carbon terms — maybe **30 kg CO₂/year** for a typical student. It saves resources and reduces virgin-material production, but the climate impact is modest compared to travel or diet.' },
          { text: 'Switching from beef to chicken for one weekly meal all year', correct: false, explanation: 'Significant but smaller than a flight reduction — about **300 kg CO₂/year** saved (36 weeks × 0.15 kg beef × 54 kg/kg difference). About 10× the recycling impact, but still 10× LESS than skipping a single flight.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Building a personal carbon budget',
        body: 'A useful mental tool for daily decisions: think of yourself as having a **carbon budget** — like a money budget, but for emissions.\n\n**A reasonable target.** To stay under 1.5 °C of global warming, the global average per-person carbon budget needs to fall to about **2 mtCO₂e/year by 2050**. That\'s far below the average American\'s current ~16 mt or even the global average ~5 mt. As a high-school student, you\'re not "hitting" that 2-mt target — but knowing the number gives you a frame.\n\n**Estimate your current footprint.** Add up rough magnitudes: international travel × 3 mtCO₂e per round trip, domestic flights × 1 mt each, food (heavy beef diet adds ~1-2 mt, mostly-plant subtracts ~1), home/dorm energy × 1-2 mt. A typical student lands around **5-8 mtCO₂e/year**.\n\n**Pick one or two changes that move the number.** Don\'t try to do everything. The point of a budget is to identify where the leverage is. If your budget is dominated by one international flight, the highest-leverage change is travel, not light bulbs.\n\n**Track and adjust.** Like a financial budget, a carbon budget is most useful when revisited periodically. After a year, look back: did the changes you committed to actually happen? What got in the way? What surprised you?\n\nThis isn\'t about guilt. It\'s about **visibility** — turning vague good intentions into a clear measurement loop. Cordero et al. (2020) found that students who calculated and tracked their own footprints made measurable behavior changes for years afterward. The act of measurement itself is the intervention.',
      },
      {
        type: 'concept',
        heading: 'Time, money, and effort tradeoffs',
        body: 'Different carbon reductions **cost different things**. Some cost money. Some cost time. Some cost convenience. Some cost nothing at all. Knowing which is which lets you pick the changes you can actually sustain.\n\n**Free or even profitable:** Lower thermostat at night (saves money). Turn off electronics not in use (saves money). Take shorter showers (saves water bill). Eat slightly less meat (often cheaper too). These cost nothing in dollars, sometimes save money, and require minimal effort — just habits.\n\n**Trade time for carbon:** Carpool with friends (coordination time, but socializing too). Take a train instead of flying for shorter trips (longer travel time, but you can work or sleep). Repair instead of replace (more time but skill-building too).\n\n**Trade money for carbon:** Buy carbon offsets (no time, real dollars). Buy fewer but higher-quality items (more dollars per item, fewer items). Choose green electricity supplier (slight monthly premium).\n\n**Trade convenience for carbon:** Skip a flight to a beautiful destination (lose the experience, save the emissions). Bike or walk where you\'d normally drive (more effort, slower).\n\n**The key insight: not everyone has the same constraints.** A student living at school doesn\'t pay utility bills, so saving money on heating doesn\'t directly accrue to them. A student with parents covering travel doesn\'t face the dollar cost of flying. The real test of which actions are "easy" depends on **whose budget the action affects**. Sometimes the highest-leverage change for you is the one you can directly control without asking permission — daily habits, food choices, what you push for at school.',
      },
      {
        type: 'concept',
        heading: 'Your three biggest personal levers',
        body: '**1. Travel.** Long-haul flights are by far the biggest single thing most students do. A round-trip from Boston to Tokyo emits about **3 metric tons** of CO₂e per passenger — that\'s roughly **half a typical KUA student\'s entire annual school-related footprint**, in one weekend of travel. Practical actions: **combine trips** when possible (one trip with two stops vs two separate trips), **take trains** for shorter distances (~70% lower CO₂ per mile than flying short-haul), and **carpool** with classmates over breaks.\n\n**2. Food.** Eating less beef is the single biggest dietary change you can make for the climate. Beef has roughly **10× the carbon footprint of chicken** and **50–100× that of plant foods** — because cattle digestion produces methane (a strong greenhouse gas), and cattle take far more land and feed than other meats. **You don\'t have to go fully vegetarian** to make a difference. Even **one or two fewer beef meals per week** saves hundreds of kg of CO₂e per year.\n\n**3. Energy at home and dorm.** Small per item, but adds up. **Setting your radiator one notch lower** in winter saves real fuel. **Showering shorter** saves both water and the energy used to heat it. **Turning off electronics when not in use** rather than leaving on standby. **Choosing reusable over disposable** avoids the upstream emissions baked into single-use products. None of these alone are huge, but **a portfolio of habits** shifts the dorm-level baseline.',
      },
      {
        type: 'quiz',
        question: 'A student who organizes a successful campaign to retrofit ONE dorm from oil heat to a heat pump has helped reduce KUA\'s annual emissions by roughly:',
        options: [
          { text: '~3 mtCO₂e', correct: false, explanation: 'That\'s about a single international flight saved — meaningful at the individual scale, but a heat-pump retrofit is bigger because heating is a major Scope 1 source for the entire building, not just one person.' },
          { text: '~38 mtCO₂e', correct: true, explanation: 'Right. A single 6,000-gal/year oil boiler replaced with a cold-climate heat pump (COP 2.5) on the New England grid saves about **38 mtCO₂e/year** — and that savings continues every year for the lifetime of the heat pump (~15-20 years). One organized student campaign can lock in **hundreds of mtCO₂e** of avoided emissions over the equipment\'s lifetime.' },
          { text: '~500 mtCO₂e', correct: false, explanation: 'A bit too high — that\'s closer to the campus-wide impact of converting MULTIPLE buildings. ~500 mt is roughly what KUA would save by retrofitting most of its largest buildings to heat pumps over time.' },
          { text: '~0.5 mtCO₂e', correct: false, explanation: 'Way too low — that\'s closer to a small individual habit change. Retrofits to building HVAC systems affect entire structures and produce institution-scale savings.' },
        ],
      },
      {
        type: 'concept',
        heading: 'And one bigger lever — what you push for',
        body: '**Civic and institutional action** is often the most underrated category — and the most impactful for a student in particular.\n\nWhy? Because **institutional emissions dwarf personal emissions**. A KUA student who organizes a successful campaign to switch a dorm from oil heating to a heat pump has just contributed to a **38 mtCO₂e/year reduction** — roughly **20× that student\'s own personal footprint** for years to come. A student who advocates effectively for clean-electricity procurement, or for protecting the campus forest from development, can move numbers in the **hundreds of mtCO₂e**.\n\nForms civic action takes:\n\n**Voting** for candidates and ballot measures with strong climate commitments.\n**Organizing** at school — proposing a policy, joining the sustainability committee, building coalitions of students and faculty.\n**Choosing colleges and employers** based on their climate stance. Universities and companies pay attention to applicant priorities.\n**Speaking up** about specific decisions — building a new parking lot vs preserving forest, fuel choices for campus heating, what gets served in the dining hall.\n**Participating in democratic processes** more broadly — climate policy is set largely by governments.\n\nThe research backs this up. Cordero et al. (2020) found students who calculated their own carbon footprints **continued to make pro-environmental choices for years afterward** — not just personal choices, but institutional and civic ones. **Knowing the math gave them confidence to advocate for change.**',
      },
      {
        type: 'quiz',
        question: 'Per kilogram of food, which has the LARGEST carbon footprint?',
        options: [
          { text: 'Beef', correct: true, explanation: 'Right. Beef ≈ **60 kg CO₂e per kg** — far higher than chicken (~6), rice (~4), or beans (~0.9). Cattle digestion produces methane (a 28× GWP gas), and cattle require enormous amounts of land and feed compared to other foods. Switching beef meals to chicken or plants is one of the most impactful single dietary changes.' },
          { text: 'Chicken', correct: false, explanation: 'Chicken is ~6 kg CO₂e/kg — about 10× lower than beef. Significant compared to plants but much smaller than ruminant meat.' },
          { text: 'Rice', correct: false, explanation: 'Rice is ~4 kg CO₂e/kg — moderately high among plant foods because flooded paddy fields produce methane. Still 15× lower than beef per kg.' },
          { text: 'Potatoes', correct: false, explanation: 'Potatoes are about ~0.4 kg CO₂e/kg — among the lowest of any food. Roughly 150× less impact per kg than beef.' },
        ],
      },
      {
        type: 'quiz',
        question: 'A student drives 1,000 miles solo in a 25-mpg car. Another student flies the same 1,000 miles. Who emits more CO₂?',
        options: [
          { text: 'They emit about the same', correct: false, explanation: 'Close but not equal — depends on flight type and car occupancy. At these specific values the flight emits slightly more.' },
          { text: 'The driver emits more', correct: false, explanation: 'Drive: 1,000 / 25 × 8.78 = 351 kg CO₂. Less than the flight per passenger.' },
          { text: 'The flight emits more', correct: true, explanation: 'Right. **Drive: 1,000 mi / 25 mpg × 8.78 kg/gal = ~351 kg CO₂**. **Flight: 1,000 mi × 0.395 kg/passenger-mi (with radiative forcing) = ~395 kg**. So flying solo is slightly worse than driving solo at this distance. With multiple drivers (carpool), driving wins by a lot. Above ~1,000 mi the math usually favors flying because of fuel economy at cruising altitude.' },
          { text: 'Driving has zero emissions if the car is electric', correct: false, explanation: 'EVs aren\'t zero emissions — they shift emissions from tailpipe to power plant. On the New England grid, an EV emits ~0.09 kg/mi (90 kg for 1,000 mi). Still much lower than gas, but not zero.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which of these is a "free" carbon reduction — no money, minimal time, just habit change?',
        options: [
          { text: 'Setting your radiator one notch lower at night', correct: true, explanation: 'Right. **No money, no time investment** — just a habit change. Lowering setpoint 2 °F overnight saves ~7% of heating energy. For a typical dorm using 6,000 gal/year heating oil, that\'s ~30 mtCO₂e of CO₂ across the building. The same applies to turning off lights and electronics when not in use.' },
          { text: 'Buying carbon offsets to cover your annual flights', correct: false, explanation: 'This costs money and doesn\'t actually reduce your emissions — you\'re paying someone else to reduce theirs. The CO₂ from your flight still goes up.' },
          { text: 'Installing solar panels on your house', correct: false, explanation: 'Solar costs significant up-front money (and isn\'t something most students can do anyway). Real impact, but not free.' },
          { text: 'Buying organic food', correct: false, explanation: 'Organic food is often slightly less carbon-intensive but costs more, and the carbon difference is small compared to switching from beef to plant-based foods.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You want to convince a friend to fly less. What\'s the most effective approach?',
        options: [
          { text: 'Tell them flying is morally wrong', correct: false, explanation: 'Lecturing triggers defensiveness, not change. Behavior research shows moralizing usually backfires.' },
          { text: 'Show them the carbon math and let them decide', correct: false, explanation: 'Information helps, but information alone rarely changes behavior. People know the right thing in many areas without doing it.' },
          { text: 'Mention casually that you\'re skipping a flight and what you\'ll do instead', correct: true, explanation: 'Right. **Modeling beats preaching**. Behavioral research consistently shows people copy what their peers actually do, not what they\'re told to do. Mentioning your choice without judgment ("I took the train, got 4 hours of reading done") plants a seed without triggering defenses. Over time, peer norms shift the bigger numbers than individual lectures ever do.' },
          { text: 'Refuse to travel anywhere with them until they agree', correct: false, explanation: 'Ultimatums damage relationships and rarely change behavior. Climate communication that lasts is patient and relational, not coercive.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which combination of changes saves the most CO₂ for a typical KUA student over one year?',
        options: [
          { text: 'Recycling everything + walking instead of driving short trips + turning off lights', correct: false, explanation: 'These together save maybe ~30-50 kg CO₂/year. Real, but small compared to bigger choices.' },
          { text: 'One fewer round-trip flight + half-as-much-beef + organizing for a school heat-pump retrofit', correct: true, explanation: 'Right. **Flight cut: ~3,000 kg. Beef reduction: ~300 kg. Heat-pump organizing (institutional impact spread over years): ~3,000+ kg over the equipment\'s life**. Combined personal + institutional impact: 6,000+ kg in year one with continuing benefit. The big-three combination dwarfs the small-many strategy.' },
          { text: 'Going vegetarian for one month per year', correct: false, explanation: 'Saves ~100 kg CO₂. Real, but small compared to a single flight reduction.' },
          { text: 'Switching to bamboo toothbrushes and reusable water bottles', correct: false, explanation: 'These are good circular-economy practices but the carbon impact is tiny — measured in kg, not metric tons. Useful complementary habits, not where you start.' },
        ],
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
        body: 'Imagine you\'re trying to figure out the carbon footprint of a school. **Carbon emissions come from many places**: oil burned in boilers, electricity bought from the utility, food trucked in from suppliers, students flying home for break, refrigerant slowly leaking from an old air conditioner. If you just added all of these into one giant pile, you\'d miss something important — **who actually controls each source matters**, both for accountability and for figuring out what you can do to reduce them.\n\nThe **Greenhouse Gas Protocol** is the global accounting standard for organizational carbon footprints. It was developed by the World Resources Institute and the World Business Council for Sustainable Development in the late 1990s, and it\'s used today by governments, corporations, and schools all over the world. Its key contribution: split emissions into **three categories called "scopes"** based on who owns or controls the source.\n\n**Scope 1: emissions from things YOU directly own and operate.** Think of the boiler in the basement, the school van in the parking lot, the propane tank behind the kitchen.\n\n**Scope 2: emissions from electricity you BUY.** You don\'t generate the power yourself, but the utility burns fuel to make it on your behalf, every time you flip a light switch.\n\n**Scope 3: emissions from your supply chain — everything else indirect.** The food in the dining hall, the paper for textbooks, the airplane fuel for flights students take, the trucks that haul your trash to the landfill.\n\nThis division **isn\'t arbitrary**. It maps onto **who can actually reduce what**. KUA can directly choose to switch its boilers from oil to heat pumps (a Scope 1 reduction). It can choose a cleaner electricity supplier (a Scope 2 reduction). It can encourage students to fly less or buy local food (Scope 3). Without this scope structure, you\'d have no way to figure out which lever to pull or who has the authority to pull it.',
      },
      {
        type: 'concept',
        heading: 'Scope 1 — direct emissions',
        body: '**Scope 1** is the emissions you can see from the parking lot. Things KUA owns and operates that release greenhouse gases directly into the atmosphere. If you can walk up to a piece of equipment and watch it burn fuel — or if a technician services equipment that contains a refrigerant — you\'re looking at a Scope 1 source.\n\nThe biggest Scope 1 source for a New Hampshire boarding school is **heating fuel**. KUA has roughly 18 buildings that need to be kept warm through winters that hit −15 °C and last six months. The fuel used is mostly **#2 heating oil** (a distillate similar to diesel) plus some **propane** for water heaters and smaller heating systems. When that fuel burns, it produces CO₂, water vapor, and small amounts of N₂O — the chemistry is straightforward combustion.\n\nThe **second category of Scope 1** is more obscure but real: **fugitive refrigerants**. Air conditioners, refrigerators, and large HVAC systems contain refrigerant gases like R-410A — fluorinated compounds with global warming potentials of 2,000–4,000× CO₂. Old or poorly maintained equipment slowly leaks these gases into the atmosphere. A school the size of KUA likely has 60–100 lb of total refrigerant charge across all its systems, and a leak rate of 5–15% per year is typical. That\'s small in mass but punches above its weight in warming impact.\n\nThe **third Scope 1 category** is **fleet vehicles** — the school\'s vans, maintenance trucks, and any other vehicles KUA owns and fuels. Gasoline burns to about 8.78 kg CO₂/gal, diesel to 10.21. These vehicles typically contribute 5–20 mtCO₂e/year for a school like KUA — small in absolute terms but tracked because they\'re directly under institutional control.\n\nOn the dashboard, all three of these are tracked in separate tables in the database — `scope1_heating_oil`, `scope1_propane`, `scope1_refrigerants`, `scope1_fleet` — each with its own emission factor source. The total Scope 1 estimate for KUA is around **1,000 mtCO₂e/year**, dominated by heating fuel.',
      },
      {
        type: 'quiz',
        question: 'A campus van fills up at the gas station. Which scope is that?',
        options: [
          { text: 'Scope 1', correct: true, explanation: 'Right. KUA owns the van and operates it; the combustion happens here. Fleet vehicles are a standard Scope 1 sub-category alongside heating fuel and refrigerants.' },
          { text: 'Scope 2', correct: false, explanation: 'Scope 2 is purchased electricity. Vehicle fuel that KUA burns directly is Scope 1. (If KUA had an electric van charging on the grid, the charging electricity would be Scope 2 — but the van itself wouldn\'t emit anything directly.)' },
          { text: 'Scope 3', correct: false, explanation: 'Close — student travel is Scope 3. But for KUA-owned fleet, it\'s Scope 1 because KUA controls the vehicle. The dividing line is ownership/control, not just whether wheels are involved.' },
          { text: 'It\'s the gas station\'s emissions, not ours', correct: false, explanation: 'The CO₂ comes out of the van\'s tailpipe, not the gas pump. The gas station\'s emissions (lights, refrigeration) are theirs; the burned fuel\'s emissions are whoever burns it. KUA bought the fuel and burns it through the van, so KUA owns the emissions.' },
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
          { text: '~3.18 kg CO₂/gal', correct: false, explanation: 'That\'s the mass of the FUEL per gallon, not the CO₂ produced. Combustion produces CO₂ that contains the fuel\'s carbon plus added oxygen — heavier than the original fuel.' },
          { text: '~10.16 kg CO₂/gal', correct: true, explanation: 'Right. 3.18 kg/gal × 0.87 (C fraction) = 2.77 kg C/gal × 44.01/12.01 = 10.15 kg CO₂/gal. The EPA factor is just stoichiometry on a typical fuel composition. Same approach derives propane (5.72), gasoline (8.78), diesel (10.21) from their molecular formulas.' },
          { text: '~24 kg CO₂/gal', correct: false, explanation: 'Too high. You may have multiplied by 12.01/44.01 backwards. The C → CO₂ ratio is 44/12 ≈ 3.67, not 12/44.' },
          { text: '~5.5 kg CO₂/gal', correct: false, explanation: 'About right for propane (5.72) but too low for heating oil. Heating oil has more carbon per gallon than propane because it\'s denser and longer-chain hydrocarbons.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Scope 2 — purchased electricity',
        body: '**Scope 2** is the strange middle category. KUA itself doesn\'t burn fuel to make electricity — there\'s no coal pile or gas plant behind the gym. But every kWh KUA uses came from somewhere, and that somewhere is a power plant on the New England grid that DID burn fuel (or run nuclear fission, or harvest wind, etc.) to generate the electricity that traveled hundreds of miles down transmission lines to a KUA building.\n\nThe GHG Protocol decided early on that you have to count those emissions, even though they happen elsewhere. The argument is simple: if you\'re consuming the electricity, you\'re responsible for the demand that caused the generation, even if you didn\'t turn the steam turbine yourself.\n\n**To convert kilowatt-hours into emissions, you need a "grid emission factor"** — how many kg of CO₂ are produced per kWh, on average across all the generators on your regional grid. New England\'s grid is run by **ISO New England (ISO-NE)**, an independent operator headquartered in Holyoke, Massachusetts. Each year ISO-NE publishes an Emissions Report listing the average factor: in 2024, that was **643 lb CO₂ per MWh** for in-region generation, or about **0.292 kg/kWh**. New England is cleaner than the US average because of significant nuclear (23%) and Canadian hydro imports (12%).\n\n**KUA\'s Scope 2 is the line currently sourced from real measurement.** The campus Distech Eclypse BMS captures every meter\'s kWh; combined with the latest BMS Meter Trends CSV the dashboard composes a Year 1 projection of **~1.9 million kWh annual**. Multiply by KUA\'s effective ISO-NE 2024 emission factor (~0.235 kg/kWh, derived from per-fuel output factors weighted across the 2024 mix) and you get **~395 mtCO₂e/year** — small compared to Scope 1 heating because the New England grid is relatively clean, and small compared to Scope 3 travel because student air travel is just so emissions-heavy per passenger.\n\n**A subtlety: location-based vs market-based.** The GHG Protocol actually requires reporting Scope 2 in TWO ways. **Location-based** uses the regional grid average (what we just calculated). **Market-based** lets you credit yourself for any specifically-procured renewable energy (e.g., if KUA bought RECs or signed a clean-electricity supply contract). KUA currently reports only the location-based number; the market-based view would show a lower figure if KUA chose to buy clean supply.',
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
          { text: '~80 mtCO₂e', correct: false, explanation: 'You may have skipped the emission factor entirely. 80 MWh is just the energy — you need to multiply by lb/MWh and convert to mt.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Scope 3 — everything else',
        body: '**Scope 3 is the biggest, messiest, and usually most important category** at any institution that doesn\'t own factories. It covers every emission that\'s indirectly caused by your activities but happens at someone else\'s facility, on someone else\'s account.\n\nThe GHG Protocol formally divides Scope 3 into **15 categories**: purchased goods and services, capital goods, fuel and energy upstream, upstream transportation, waste, business travel, employee commuting, upstream leased assets, downstream transportation, processing of sold products, use of sold products, end-of-life, downstream leased assets, franchises, investments. Most of those don\'t apply to a school (we don\'t sell physical products, we don\'t have franchises, we don\'t hold investments at scale), but several do.\n\n**For a residential boarding school, the dominant Scope 3 source is student travel.** When a student flies from Boston to Tokyo for winter break, the airline burns jet fuel, but it\'s indirectly caused by KUA\'s decision to enroll international students who need to fly home. The Yale Office of Sustainability formalized this as a "student travel" category outside the GHG Protocol\'s 15 because it\'s materially the largest source at residential institutions and was being missed in standard accounting.\n\n**Other Scope 3 sources for KUA:**\n\n**Purchased goods and services** — the food in the dining hall, the paper for class, the lab supplies, the cleaning products, the new computers. Each of these embodies emissions from production, transportation, and packaging. We estimate this using the EPA Supply Chain GHG Emission Factors (a method called Environmentally-Extended Input-Output, or EEIO), which gives kg CO₂e per dollar spent in each industry sector.\n\n**Waste** — landfilled trash, recycling, composting, hazardous waste. Each disposal pathway has its own emission factor in the EPA\'s WARM model. Landfilled food waste is particularly bad because it generates methane as it decomposes.\n\n**Commuting** — non-resident faculty and staff driving to campus. Smaller for KUA than for a day school, but real.\n\n**Upstream fuel and energy** — the emissions caused by drilling, refining, and transporting the heating oil that KUA already burns in Scope 1. The combustion is Scope 1, but the upstream supply chain is Scope 3.\n\n**Why Scope 3 is hardest to measure:** the data lives at suppliers, vendors, and individual students\' homes — not on a meter at KUA. We use estimation methods (spend-based, distance-based, average factors) that get better as more specific data comes in. KUA\'s Scope 3 estimate is **~3,000 mtCO₂e/year**, with about 70% from student travel and the rest split among goods, waste, commuting, and upstream fuel.',
      },
      {
        type: 'quiz',
        question: 'A student flies home to Tokyo for winter break. Which scope?',
        options: [
          { text: 'Scope 1', correct: false, explanation: 'KUA doesn\'t own the airplane or burn the fuel. Scope 1 requires direct ownership and operation of the emission source.' },
          { text: 'Scope 2', correct: false, explanation: 'Scope 2 is electricity from the grid. The airplane runs on jet fuel burned by an airline, not on grid electricity from a power station.' },
          { text: 'Scope 3', correct: true, explanation: 'Right. **Student travel is Scope 3** — indirect emissions caused by KUA\'s activities (enrolling international students who need to fly home) but not under KUA\'s direct control. The airline burns the fuel, but KUA\'s decisions drive the demand. Yale formalized this as a "student travel" sub-category outside the standard 15 GHGP categories.' },
          { text: 'It doesn\'t count because the student isn\'t at school', correct: false, explanation: 'GHG accounting follows ECONOMIC ACTIVITY, not physical location. The flight only happens because the student attends KUA, so it\'s associated with KUA\'s operations even though it occurs off-campus.' },
        ],
      },
      {
        type: 'concept',
        heading: 'Sinks — the only category that goes the other way',
        body: 'Up to this point, every category has counted carbon flowing INTO the atmosphere. Scope 1, Scope 2, and Scope 3 are all positive numbers — emissions added. **Sinks are the opposite**: they count carbon flowing OUT of the atmosphere, into stable storage on KUA\'s land.\n\nThe sink at KUA is the **~1,000 acres of campus forest**. Through **photosynthesis** — the chemistry every biology student learns — trees pull CO₂ from the air, combine it with water and sunlight to make glucose, and lock that carbon into wood, leaves, roots, and soil. The reaction is **6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂**. About half of a tree\'s dry weight is carbon, and that carbon stays put — for decades or centuries — until the tree dies and decomposes (slowly returning the carbon to the soil) or burns (returning it quickly to the atmosphere).\n\n**The math.** US forest research gives roughly **2.1 mtCO₂e per acre per year** of net annual sequestration (Birdsey 1992) for typical forests. Open-grown urban trees can hit 4.2 (Nowak 2013) because they grow faster without competition. KUA\'s ~1,000 acres × these rates = **2,000–4,000 mtCO₂e/year** drawdown, with a mid-estimate of about **3,000 mtCO₂e/year**.\n\n**Why does this matter so much?** Because it\'s **almost the same magnitude as KUA\'s gross emissions**. If gross emissions are ~4,150 mtCO₂e/year and sequestration is ~3,000 mtCO₂e/year, then **net emissions are only ~1,150 mtCO₂e/year**. Per student, that\'s about 3.4 mtCO₂e — far below most peer schools, which sit at 6–10 mtCO₂e per student. KUA looks low not because we emit less than peer schools (we emit similar amounts), but because **we measure our forest and they don\'t**.\n\n**Most peer schools never quantify their sinks.** Valls-Val and Bovea (2021) reviewed 35 university footprint studies and found that on-campus sequestration was rarely measured even at institutions with significant forested land. This gap — measured emissions on one side, unmeasured drawdown on the other — is what drove the design of KUA\'s dashboard. The point of measuring sinks isn\'t to make KUA look good; it\'s to **report the actual net carbon balance**, which is the number that matters for the climate.\n\nThere\'s an important caveat to add: **buying offsets is not the same as measuring physical sinks.** Middlebury College reports as "carbon neutral" by purchasing carbon credits equal to their gross emissions — a financial drawdown rather than a physical one. KUA\'s 3,000 mtCO₂e/year is REAL — those CO₂ molecules are actually being pulled out of the air, on KUA land, by trees you can walk up to and measure.',
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
          { text: '+850 mtCO₂e', correct: false, explanation: 'That\'s the gross, not the net. The whole point of measuring sinks is to subtract them from gross to get net.' },
          { text: '−320 mtCO₂e', correct: false, explanation: 'That\'s just the sequestration without subtracting from gross. The school is still net-positive emitting because gross > sinks.' },
        ],
      },
      {
        type: 'quiz',
        question: 'A KUA dorm has both a Scope 1 source AND a Scope 2 source under the same roof. Which combination is correct?',
        options: [
          { text: 'Heating oil furnace = Scope 1; lights = Scope 2', correct: true, explanation: 'Right. The furnace burns oil ON SITE — Scope 1 (direct combustion). The lights use electricity from the grid — Scope 2 (purchased electricity). Same building, different scopes, different reduction strategies.' },
          { text: 'Heating oil furnace = Scope 2; lights = Scope 1', correct: false, explanation: 'Reversed. Scope 1 is what KUA burns directly; Scope 2 is what KUA buys from the grid. Heating oil is burned at KUA, lights run on purchased electricity.' },
          { text: 'Both are Scope 1 because they\'re both at KUA', correct: false, explanation: 'Location isn\'t the criterion — control is. The furnace is operated by KUA, but the power plant generating the electricity is operated by someone else.' },
          { text: 'Both are Scope 3 because the dorm is a building', correct: false, explanation: 'Building maintenance might involve Scope 3 (e.g., upstream emissions of construction materials), but the active heating and lighting are Scope 1 and Scope 2 respectively.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Why does the GHG Protocol REQUIRE both location-based AND market-based Scope 2 reporting?',
        options: [
          { text: 'They give different answers and stakeholders need both perspectives', correct: true, explanation: 'Right. **Location-based** says "what was the average grid factor in your region?" — measures system-level reality. **Market-based** says "what did you specifically procure?" — credits voluntary clean-energy purchases. They CAN differ substantially: a school on a coal-heavy grid that buys 100% renewable supply has high location-based emissions but low market-based. Both are valid views; both are required to prevent gaming the system.' },
          { text: 'Because emissions are a moral question', correct: false, explanation: 'Whatever the moral framing, the methodology question is about accounting consistency.' },
          { text: 'To discourage RECs', correct: false, explanation: 'Actually the dual-reporting framework MAKES space for RECs in the market-based view while keeping location-based honest.' },
          { text: 'Because school administrators are confused', correct: false, explanation: 'Both methodologies are deliberate design choices, not accidents.' },
        ],
      },
      {
        type: 'quiz',
        question: 'A school has Scope 1 of 1,000 mt, Scope 2 of 200 mt, and Scope 3 of 3,000 mt. If it stops on-campus heating fuel use entirely (electrifies completely), what happens?',
        options: [
          { text: 'Scope 1 drops to ~0; Scope 2 grows from electrification load', correct: true, explanation: 'Right. **Electrification shifts emissions from Scope 1 (direct fuel combustion) to Scope 2 (purchased electricity).** On a clean grid like New England\'s, the new Scope 2 number is much smaller per BTU than the eliminated Scope 1 — that\'s the climate win. But the scope categorization changes regardless of total.' },
          { text: 'Total emissions drop to zero', correct: false, explanation: 'No — Scope 2 grows (the new heat pumps need electricity), and Scope 3 is unchanged. The reduction is real but partial.' },
          { text: 'Nothing changes since totals stay the same', correct: false, explanation: 'Totals don\'t stay the same. On the New England grid, electrified heat emits ~1/3 the CO₂ per BTU of oil heat. Total emissions fall meaningfully.' },
          { text: 'Scope 3 grows to compensate', correct: false, explanation: 'Scope 3 doesn\'t mechanically grow when Scope 1 falls. They\'re independent categories.' },
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
        body: 'Climate at the planetary scale is **a question of energy bookkeeping**. At equilibrium, the energy Earth absorbs from the Sun must equal the energy Earth radiates back to space. If absorbed > radiated, the planet warms. If absorbed < radiated, it cools. If they\'re equal, temperature stays steady. That\'s it — the rest is mechanism.\n\n**The numbers, top of the atmosphere:**\n\n**Solar constant: ~1,361 W/m²** at the top of Earth\'s atmosphere, perpendicular to the Sun. But Earth is a sphere, not a flat disk. Half of it is in shadow at any moment, and most of the lit half receives sunlight at an angle. Spread that incoming energy over the whole surface area and the **average is ~340 W/m²**.\n\n**Albedo: ~30%.** About a third of incoming sunlight reflects right back to space — bouncing off clouds, ice, and bright surfaces — without being absorbed. So **~240 W/m² is absorbed** by Earth\'s atmosphere and surface combined.\n\n**Outgoing radiation: ~240 W/m²** at equilibrium. Otherwise the planet would be heating or cooling without limit, which it isn\'t (on average, on geological timescales).\n\n**The wavelength shift is the key.** Incoming solar energy is mostly **visible and ultraviolet light** (high frequency, short wavelength) because the Sun is hot (~5,800 K). Outgoing energy from Earth\'s surface is **infrared** (lower frequency, longer wavelength) because Earth is cool (~288 K). This shift is governed by **Wien\'s displacement law**: hotter objects emit at shorter wavelengths. Earth\'s atmosphere is largely transparent to visible light but partially opaque to infrared — and that asymmetry is the entire greenhouse effect.\n\n**Common confusion:** The greenhouse effect doesn\'t **trap** heat permanently. Energy still escapes; the atmosphere just **slows the rate** at which it leaves. Think of it less as a bottle cap and more as a thermal blanket — the same amount of body heat escapes eventually, just more slowly.',
      },
      {
        type: 'concept',
        heading: 'Stefan-Boltzmann law — AP Physics 2 connection',
        body: 'The Stefan-Boltzmann law tells us how much energy a hot object radiates: **P = σT⁴**, where P is power per unit area (W/m²), T is absolute temperature in Kelvin, and σ is the Stefan-Boltzmann constant (5.67 × 10⁻⁸ W/m²/K⁴).\n\nThis applies to a **perfect blackbody** — an idealized object that absorbs and emits all wavelengths perfectly. Real objects have an **emissivity** ε between 0 and 1 that reduces output; for many problems we treat Earth as ε ≈ 1 because the average emissivity across the spectrum is close to that.\n\n**The fourth-power scaling matters enormously.** Doubling temperature gives **16× more radiation**. A small temperature rise (a few Kelvin) significantly increases the energy a planet radiates back to space. This is what stabilizes planetary temperatures — if Earth got too hot, it would radiate so much more energy that it would cool. If too cold, it radiates less and warms. The system finds equilibrium at the temperature where outgoing matches incoming.\n\n**Apply it to Earth:**\n\nIf Earth had no atmosphere and absorbed 240 W/m² of solar energy, what temperature would it reach? Set incoming = outgoing:\n\n240 = σT⁴\n\nT⁴ = 240 / (5.67 × 10⁻⁸) ≈ 4.23 × 10⁹\n\nT = (4.23 × 10⁹)^(1/4) ≈ **255 K = −18 °C**\n\nThat\'s the **effective temperature** of an airless Earth — about 33 °C colder than what we actually observe. Earth\'s surface is ~288 K (15 °C). The 33 K difference is **the entire natural greenhouse effect**: the warming caused by atmospheric CO₂, water vapor, methane, and other IR-absorbing gases trapping outgoing radiation longer before it escapes.\n\n**Common confusion:** Why doesn\'t the greenhouse effect just keep heating Earth indefinitely? Because **Stefan-Boltzmann acts as a built-in thermostat**. As surface temperature rises, outgoing radiation (which scales as T⁴) rises sharply, until incoming and outgoing balance again. The greenhouse effect doesn\'t turn radiation off; it shifts the equilibrium point to a warmer temperature. More greenhouse gases = warmer equilibrium = more frequent and intense heat extremes, but **always a steady state** at any given concentration.',
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
          { text: '~200 K (−73 °C)', correct: false, explanation: 'Too cold. You may have used T² instead of T⁴ in the rearrangement. Stefan-Boltzmann is fourth-power, not square.' },
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
          { text: 'All three vibrational modes equally', correct: false, explanation: 'They\'re NOT equal — the symmetric stretch has no IR-active dipole change, so it doesn\'t contribute. The bend mode is the dominant absorption at the wavelength matching Earth\'s peak IR emission.' },
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
          { text: '~512 kg CO₂e', correct: false, explanation: 'Too high. Recheck — you may have multiplied an extra factor somewhere.' },
          { text: '~50 kg CO₂e', correct: false, explanation: 'You only counted the CO₂ and ignored the methane and N₂O contributions. Each gas counts toward CO₂e through its own GWP.' },
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
          { text: '~150 kg CO₂e', correct: false, explanation: 'Too low. You may have used a smaller methane multiplier than 84 (GWP20).' },
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
          { text: '~110%', correct: false, explanation: 'Too high. The difference is 0.11 pH units, which corresponds to ~30% concentration change, not 100%+.' },
          { text: '~13%', correct: false, explanation: 'You may have linearly subtracted pH values. pH is on a log scale, so concentration changes are larger than linear pH differences suggest.' },
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
          { text: '~3 years', correct: false, explanation: 'Too short — that would imply current emissions of ~80+ Gt/yr.' },
          { text: '~7 years', correct: true, explanation: 'Right. 250 ÷ 37 ≈ 6.76 years. This is why the IPCC says emissions need to peak before 2025 and roughly halve by 2030 to stay on track for 1.5°C.' },
          { text: '~25 years', correct: false, explanation: 'Too long. You may have used the 2°C budget instead of the tighter 1.5°C budget.' },
          { text: '~50 years', correct: false, explanation: 'Way too long. The remaining budget is tight; even the 2°C budget gives only ~20-25 years at current rates.' },
        ],
      },
      {
        type: 'quiz',
        question: 'On a planet with no atmosphere absorbing 240 W/m² of sunlight, the Stefan-Boltzmann effective temperature is ~256 K. Earth\'s actual temperature is ~288 K. The difference is:',
        options: [
          { text: 'The natural greenhouse effect — water vapor, CO₂, and other gases trapping outgoing IR longer', correct: true, explanation: 'Right. **The 33 K difference between airless equilibrium and actual surface temperature is the natural greenhouse effect.** It\'s caused by water vapor (the dominant contributor naturally), CO₂, methane, and other IR-absorbing gases. Without it, Earth would be frozen and uninhabitable. The problem isn\'t the greenhouse effect itself — it\'s that humans are AMPLIFYING it beyond the natural baseline.' },
          { text: 'Solar variability', correct: false, explanation: 'Solar output has been roughly stable. The 33 K gap is steady-state with our current atmosphere, not a temporary excursion.' },
          { text: 'Earth being closer to the Sun than calculated', correct: false, explanation: 'The 240 W/m² figure already accounts for Earth\'s actual orbital distance and cross-section.' },
          { text: 'Volcanic heating from below', correct: false, explanation: 'Internal heat flux from Earth\'s mantle is ~0.09 W/m² — negligible compared to 240 W/m² solar input.' },
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
        type: 'quiz',
        question: 'Roughly what fraction of KUA\'s GROSS emissions comes from Scope 3?',
        options: [
          { text: '~25%', correct: false, explanation: 'Too low — Scope 3 dominates at residential boarding schools.' },
          { text: '~50%', correct: false, explanation: 'Closer, but Scope 3 is even bigger here.' },
          { text: '~72%', correct: true, explanation: 'Right. **~3,000 of ~4,150 mtCO₂e gross is Scope 3** — about 72%. Most of that is student travel: international students flying home, US boarders\' term-break trips. Scope 1 (~1,000) and Scope 2 (~222) together are only ~28%. Kool (2025) found this same pattern at Royal Roads University, where student air travel alone dominated all other sources combined.' },
          { text: '~95%', correct: false, explanation: 'Too high — Scope 1 and 2 still total ~28% (1,222/4,150). Scope 3 dominates but doesn\'t exclude the others.' },
        ],
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
          { text: '~96.5 mtCO₂e', correct: false, explanation: 'Off by 10× (you may have divided by 1,000 once too many times).' },
          { text: '~965 mtCO₂e', correct: true, explanation: 'Right. 95,000 × 10.16 = 965,200 kg = 965.2 mtCO₂e.' },
          { text: '~9,650 mtCO₂e', correct: false, explanation: 'Off by 10× the other way (kg → mt divides by 1,000, not multiplies).' },
          { text: '~95 mtCO₂e', correct: false, explanation: 'You may have used the gallon count alone without applying the emission factor.' },
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
          { text: '~580 mtCO₂e', correct: false, explanation: 'Too high. Recheck — you may have used the wrong unit conversion.' },
          { text: '~14.6 mtCO₂e', correct: false, explanation: 'Off by 10× — possibly an extra division by 1,000 somewhere in the chain.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: per-student net footprint',
        scenario: 'KUA gross: ~4,150 mtCO₂e. Sequestration: ~3,000 mtCO₂e. Enrollment: ~340 students.',
        given: [
          { label: 'Gross', value: '4,150 mtCO₂e/yr' },
          { label: 'Sequestration', value: '3,000 mtCO₂e/yr' },
          { label: 'Students', value: '600' },
        ],
        question: 'Net per student:',
        options: [
          { text: '~3.4 mtCO₂e/student', correct: true, explanation: 'Right. Net = 1,150. Per student = 1,150/340 = 3.38 mtCO₂e.' },
          { text: '~6.9 mtCO₂e/student', correct: false, explanation: 'You divided GROSS by students. Net subtracts sinks first.' },
          { text: '~4.2 mtCO₂e/student', correct: false, explanation: 'Almost — that\'s the gross-only per student. Net is lower because the forest pulls some carbon back.' },
          { text: '~8.8 mtCO₂e/student', correct: false, explanation: 'That is sequestration per student alone (3,000/340 = 8.8). The net is gross minus sinks, divided by enrollment.' },
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
          { text: '±820 mt (average)', correct: false, explanation: 'Averaging uncertainties isn\'t how they combine. The quadrature formula (root of sum of squares) gives the correct combined uncertainty for independent sources.' },
        ],
      },
      {
        type: 'quiz',
        question: 'KUA\'s ~3.4 mtCO₂e/student. How does that compare to peer boarding schools?',
        options: [
          { text: 'About the same', correct: false, explanation: 'Most peer boarding schools are 6–10 mt/student because they don\'t count sinks.' },
          { text: 'Lower than peers', correct: true, explanation: 'Right. Phillips Exeter ~10, Andover ~9. KUA looks lower mostly because we measure on-campus sequestration.' },
          { text: 'Higher than peers', correct: false, explanation: 'Boarding schools have similar gross emissions; the difference is whether sinks are measured.' },
          { text: 'It depends on how you count', correct: false, explanation: 'True in general — methodology choices matter — but for the apples-to-apples comparison shown on the peer chart, KUA\'s reported figure is lower because it includes sequestration that peer schools don\'t measure.' },
        ],
      },
      {
        type: 'quiz',
        question: 'KUA reports ~3.4 mtCO₂e per student net. If the school added 200 more students without changing anything else, what would happen to the per-student figure?',
        options: [
          { text: 'It would drop, because more students share the same fixed emissions', correct: true, explanation: 'Right. **Most KUA emissions are roughly fixed costs of operating the campus** — heating buildings, generating administrative emissions, maintaining facilities. Adding students adds some marginal emissions (more food, more travel) but proportionally less. Per-student would drop because the denominator grows faster than the numerator. This is why "per-student" can be a deceptive metric on its own — it rewards growth without necessarily reducing total impact.' },
          { text: 'It would stay exactly the same', correct: false, explanation: 'Per-student divides total by enrollment. Both numbers change with growth, but not proportionally. Per-student typically falls.' },
          { text: 'It would grow, because more students mean more emissions', correct: false, explanation: 'Total emissions grow but not as fast as enrollment. Per-student typically falls.' },
          { text: 'It depends on what the new students do', correct: false, explanation: 'Marginal student behavior matters less than the fixed-cost dilution effect at this scale.' },
        ],
      },
      {
        type: 'finish',
        heading: 'You can verify the dashboard yourself',
        body: 'Net ~1,150 mt/yr ± ~1,580 (combined uncertainty). 72% of gross from Scope 3. Per student ~3.4 mt. Every claim is reproducible from primary inputs and basic arithmetic — and you now know how to combine the uncertainties on those inputs into a defensible total.',
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
        body: 'Photosynthesis isn\'t a single reaction — it\'s **two distinct stages** happening in different parts of the chloroplast. AP Biology students often confuse them; let\'s walk through each carefully.\n\n**Stage 1 — Light reactions (in the thylakoid membrane):**\n\nThe thylakoid is a flattened membrane sac inside the chloroplast — like a stack of pancakes (thylakoids stacked into "grana"). The light reactions happen on this membrane.\n\n**What goes in:** light photons, water (H₂O), ADP + Pi, NADP⁺.\n\n**What happens:**\n1. **Photosystem II** absorbs light and uses the energy to **split water** (photolysis): 2 H₂O → 4 H⁺ + 4 e⁻ + O₂. *This is where atmospheric oxygen comes from* — not from CO₂.\n2. The freed electrons travel through an electron transport chain, releasing energy. That energy pumps H⁺ ions across the thylakoid membrane, creating a proton gradient.\n3. **Photosystem I** absorbs more light and re-energizes the electrons.\n4. The electrons end up reducing NADP⁺ to **NADPH** (a high-energy carrier).\n5. The proton gradient drives **ATP synthase** (like a tiny turbine), producing **ATP** as protons flow back across the membrane.\n\n**What comes out:** O₂ (released to the atmosphere), ATP, NADPH. The ATP and NADPH carry energy and reducing power into the next stage.\n\n**Stage 2 — Calvin cycle (in the stroma):**\n\nThe stroma is the gel-like fluid surrounding the thylakoids inside the chloroplast — analogous to cytoplasm. The Calvin cycle happens here, in solution.\n\n**What goes in:** CO₂ (from atmosphere via stomata), ATP and NADPH (from light reactions), and a 5-carbon sugar called RuBP that\'s already in the cell.\n\n**What happens:**\n1. **Carbon fixation** — the enzyme **RuBisCO** (the most abundant protein on Earth) attaches CO₂ to RuBP, forming an unstable 6-carbon intermediate that splits into two 3-PGA molecules.\n2. **Reduction** — ATP and NADPH from the light reactions energize and reduce 3-PGA to **G3P** (glyceraldehyde-3-phosphate, a 3-carbon sugar).\n3. **Regeneration** — most G3P cycles back to remake RuBP so the cycle can continue. A small fraction exits to make glucose, sucrose, starch, cellulose, and everything else the plant builds.\n\n**The full stoichiometry: producing ONE G3P requires fixing 3 CO₂, consuming 9 ATP and 6 NADPH.** Combining two G3P makes one glucose (C₆H₁₂O₆), so **one glucose costs 18 ATP and 12 NADPH** from the light reactions.\n\n**Common confusions:**\n\n*"Where does the oxygen come from?"* From water in the light reactions. Not from CO₂. We know this from a 1937 experiment using radioactive ¹⁸O — Robin Hill showed the released oxygen carried the water\'s oxygen isotopes, not the CO₂\'s.\n\n*"Does the Calvin cycle need light?"* The Calvin cycle was historically called "dark reactions" because it doesn\'t directly use light. But it depends on the ATP and NADPH from the light reactions, so in practice it stops when the lights go out — there\'s nothing to power it.\n\n*"Why is RuBisCO so inefficient?"* RuBisCO occasionally grabs O₂ instead of CO₂ (photorespiration), which wastes energy. Plants that evolved in hot/dry environments developed workarounds (C₄ and CAM photosynthesis). RuBisCO is slow because life evolved it when atmospheric O₂ was much lower than today; it\'s now stuck with the inefficiency.',
      },
      {
        type: 'quiz',
        question: 'In the Calvin cycle, what enzyme catalyzes the initial fixation of CO₂?',
        options: [
          { text: 'ATP synthase', correct: false, explanation: 'ATP synthase makes ATP from ADP + Pi using a proton gradient — it\'s in the light reactions.' },
          { text: 'RuBisCO (rubisco)', correct: true, explanation: 'Right. Ribulose-1,5-bisphosphate carboxylase/oxygenase fixes CO₂ onto a 5-carbon sugar (RuBP) to form two 3-carbon molecules (3-PGA). It\'s the most abundant protein on Earth — and it\'s remarkably slow and inefficient, which is why C4 plants evolved a CO₂-concentrating workaround.' },
          { text: 'NADP reductase', correct: false, explanation: 'NADP reductase produces NADPH in the light reactions, not Calvin cycle.' },
          { text: 'PEP carboxylase', correct: false, explanation: 'PEP carboxylase fixes CO₂ in C4 PLANTS as part of their concentrating mechanism, but the standard Calvin cycle initial fixation is done by RuBisCO. C4 plants then hand off the CO₂ from PEP carboxylase to RuBisCO afterward.' },
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
          { text: '~4.0 mtC/acre/yr', correct: false, explanation: 'Too high — you may have multiplied biomass by 2 instead of 0.5 for the carbon fraction. Biomass accumulation is the NET, not the gross, of carbon fixation.' },
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
          { text: '~6 kg CO₂', correct: false, explanation: 'You stopped at carbon mass without converting to CO₂. Multiply by 44/12 to convert C to CO₂.' },
          { text: '~22 kg CO₂', correct: true, explanation: 'Right. 12 × 0.50 = 6 kg C. 6 × 44/12 = 22 kg CO₂.' },
          { text: '~44 kg CO₂', correct: false, explanation: 'Forgot the carbon fraction (×0.5). The whole biomass isn\'t carbon — about half is.' },
          { text: '~12 kg CO₂', correct: false, explanation: 'You used the biomass mass directly as the CO₂ amount. They\'re not equal — half is carbon, and the carbon-to-CO₂ ratio is 44/12.' },
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
          { text: '~150 kg CO₂', correct: false, explanation: 'Too low. Recheck the exp() result — exp(7.23) is about 1,380, not 100.' },
          { text: '~2,500 kg CO₂', correct: true, explanation: 'Right (within ~20%). −2.48 + 2.4835 × 3.912 ≈ 7.23. exp(7.23) ≈ 1,380 kg biomass. × 0.5 = 690 kg C. × 44/12 = ~2,530 kg CO₂. Roughly 2 metric tons stored in one mature maple.' },
          { text: '~50,000 kg CO₂', correct: false, explanation: 'Way too high. The Jenkins formula gives biomass in kg, not tons.' },
          { text: '~700 kg CO₂', correct: false, explanation: 'You may have stopped at carbon mass without converting to CO₂ (× 44/12). Check the final step.' },
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
          { text: 'Pavement is dark and absorbs heat', correct: false, explanation: 'Surface temperature isn\'t the carbon mechanism. The carbon release comes from microbial decomposition of soil organic matter, not from heat.' },
          { text: 'They release the same amount', correct: false, explanation: 'Disturbing the soil dramatically accelerates carbon loss. Decay-in-place keeps some carbon in the soil; paving exposes and aerates the soil, accelerating microbial respiration.' },
          { text: 'Trees absorb pavement chemistry', correct: false, explanation: 'Living trees do absorb some pollutants, but cut-down trees aren\'t absorbing anything. The mechanism is about disturbed soil releasing decades of stored carbon.' },
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
          { text: '~570 mtCO₂e/yr', correct: false, explanation: 'Stopped at C mass — multiply by 44/12 to convert carbon to CO₂.' },
          { text: '~2,083 mtCO₂e/yr', correct: true, explanation: 'Right. 1,000 × 1,252 × 0.4536 / 1,000 = 568 mtC × 44/12 = 2,083 mtCO₂e/yr (Birdsey conservative end). Dashboard mid-estimate of ~3,000 blends with the higher Nowak rate for open-grown trees.' },
          { text: '~10,000 mtCO₂e/yr', correct: false, explanation: 'Recheck lb → kg conversion (×0.4536, not ×4.5).' },
          { text: '~1,252 mtCO₂e/yr', correct: false, explanation: 'You used the rate directly without scaling acreage and converting units. The given rate is per acre and in lb of CARBON.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which CANNOT be fixed by trees alone — even at planetary scale?',
        options: [
          { text: 'Annual emissions exceeding global terrestrial sink capacity', correct: true, explanation: 'Right. **Annual human CO₂ emissions (~37 Gt) far exceed the global terrestrial carbon sink (~12 Gt).** Trees take centuries to mature; we emit on a yearly timescale. Forests are essential but mathematically can\'t absorb our flow at scale — we have to cut emissions AND grow sinks. This is why "1 trillion trees" framings, while popular, don\'t close the gap on their own.' },
          { text: 'Local air quality issues', correct: false, explanation: 'Trees actually help with local air quality — filtering particulates and absorbing some pollutants.' },
          { text: 'Soil erosion on slopes', correct: false, explanation: 'Tree roots stabilize slopes effectively. This IS something trees can fix.' },
          { text: 'Loss of habitat for forest species', correct: false, explanation: 'Reforestation directly creates habitat. Trees fix this problem.' },
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
          { text: 'The factor is constant year-round', correct: false, explanation: 'No — the grid mix shifts hour-by-hour and seasonally. Annual averages mask big swings.' },
          { text: 'The grid runs only nuclear at night', correct: false, explanation: 'Oversimplification. Nuclear runs all the time; the day-night variation comes from how OTHER generators come and go to meet changing demand.' },
          { text: 'Customers pay different rates by time of day', correct: false, explanation: 'Some markets have time-of-use pricing, but that\'s a billing structure not a grid emissions phenomenon. The factor depends on what\'s actually generating.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Physics: capacity factor',
        body: 'When someone says "we built a 100 MW solar farm," that\'s **nameplate capacity** — the maximum the system can produce at any instant under ideal conditions. It\'s NOT the energy it actually produces over a year. The difference between those two numbers is the **capacity factor**.\n\n**Capacity factor (CF)** = actual energy delivered over a period ÷ theoretical maximum if running at nameplate 24/7.\n\nA 100 kW nameplate system running flat-out for a year would deliver:\n\n100 kW × 8,760 hr = **876,000 kWh = 876 MWh**\n\nBut no real-world generator runs flat-out continuously. CF accounts for:\n\n**For solar:** night (zero output), clouds (reduced output), seasonal sun angle (lower in winter), shading, panel degradation. NH solar lands at **13–16%** because winters are short on sunlight and Plainfield is at moderate latitude.\n\n**For wind:** wind speed isn\'t constant. Below cut-in speed (~3 m/s) the turbine doesn\'t spin. Above cut-out speed (~25 m/s) it shuts down to avoid damage. Between, output scales as v³ (because kinetic energy ∝ v²) and mass flow ∝ v. Onshore wind in NE: **25–35%**. Offshore: **35–45%** (wind is steadier over water).\n\n**For nuclear:** fission plants run continuously except during refueling outages (~1 month every 18 months). CF ~**90%+**.\n\n**For gas peakers:** these only fire up when grid demand spikes. They sit idle most of the time. CF ~**5–15%**.\n\n**For hydro:** highly variable depending on water availability and reservoir management.\n\n**Why this matters for sizing decisions:**\n\nIf you need 1 GWh per year of clean electricity, how many MW of nameplate do you need to install?\n\n**With nuclear (CF 90%):** 1,000,000 kWh / (8,760 hr × 0.90) = **127 kW** of nameplate.\n\n**With wind (CF 30%):** 1,000,000 / (8,760 × 0.30) = **381 kW** of nameplate. Three times the nameplate to deliver the same energy.\n\n**With solar (CF 14%):** 1,000,000 / (8,760 × 0.14) = **815 kW** of nameplate. Six times the nameplate.\n\nThis is why **solar farms occupy more land** for the same energy output — not because of fundamental inefficiency, but because the resource (sunlight) is intermittent.\n\n**Common confusion:**\n\n*"100 MW of solar = 100 MW of gas."* No — the 100 MW solar farm produces ~140 GWh/year (CF 16%); a 100 MW gas peaker if run baseload would produce ~876 GWh/year (CF 100%, theoretical). The same nameplate represents very different annual energy.\n\n*"Renewables can never match fossil fuels because of low CF."* False conclusion from a true premise. CF affects HOW MUCH NAMEPLATE you need to install, not whether the technology can replace fossil fuels. Texas, Iowa, and Denmark already get >50% of annual electricity from wind and solar despite their lower capacity factors — because they installed enough nameplate AND added storage and transmission to manage the variability.',
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
          { text: '~1.75M kWh', correct: false, explanation: 'Forgot the capacity factor — that\'s 200 kW × 8,760 hr without the 14% adjustment.' },
          { text: '~70,000 kWh', correct: false, explanation: 'You may have used a 4% capacity factor instead of 14%. NH solar typically lands at 13-16%.' },
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
          { text: '~7 mtCO₂e/yr', correct: false, explanation: 'Off by 10× (probably an extra unit conversion).' },
          { text: '~71 mtCO₂e/yr', correct: true, explanation: 'Right. 245 MWh × 643 lb/MWh = 157,535 lb × 0.4536 = 71,458 kg ≈ 71.5 mtCO₂e. About a third of KUA\'s entire Scope 2.' },
          { text: '~700 mtCO₂e/yr', correct: false, explanation: 'Way too high — probably forgot kg → mt.' },
          { text: '~157 mtCO₂e/yr', correct: false, explanation: 'You may have stopped at lb without converting to kg (×0.4536) or mt.' },
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
          { text: 'Max ~3.0; real 2.5 is ~83% of max', correct: false, explanation: 'You may have used the heat-engine formula instead of the heat-pump formula. Heat pump COP_max formula is T_hot / ΔT.' },
          { text: 'Max ~1.0; real 2.5 violates physics', correct: false, explanation: 'Heat pumps regularly exceed COP 1 — they don\'t make heat from electricity, they MOVE existing heat. No conservation laws violated.' },
          { text: 'Max ~32; real 2.5 is 8% of max', correct: false, explanation: 'You may have used the temperature DIFFERENCE in the numerator. The Carnot heat-pump COP is T_hot / (T_hot − T_cold), not (T_hot − T_cold) / T_hot.' },
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
          { text: '~61 mtCO₂e/yr', correct: false, explanation: 'You assumed the heat pump uses zero energy. The heat pump still consumes real electricity; the saving is the difference between old and new emissions.' },
          { text: '~85 mtCO₂e/yr', correct: false, explanation: 'Too high — recheck. The combined emissions chain doesn\'t cross 60 mt for old or 25 mt for new.' },
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
        type: 'quiz',
        question: 'What is the BIGGEST current obstacle to renewables replacing fossil fuels at global scale?',
        options: [
          { text: 'They\'re too expensive', correct: false, explanation: 'Solar and wind are now CHEAPER than new fossil generation in most places. Cost stopped being the binding constraint around 2020.' },
          { text: 'Grid integration: transmission, storage, and managing variability across hours and seasons', correct: true, explanation: 'Right. **The technology to generate clean power exists and is cheap. The harder problem is integrating it.** Variable solar and wind need transmission to move power from where it\'s windy/sunny to where demand is, storage to bridge nights and calm days, and operational changes to existing grids that were built around steady fossil baseload. These are engineering challenges with known solutions, but require investment.' },
          { text: 'Renewables can\'t make enough power', correct: false, explanation: 'Solar capacity factor in NH is only 14%, but at scale (millions of installations) total annual energy is enormous. Texas already gets >50% of electricity from renewables on many days.' },
          { text: 'People don\'t like solar panels', correct: false, explanation: 'Public support for renewables is high in most polls. Permitting and NIMBY issues are real but smaller than the technical integration challenges.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Why is hydrogen often called a "fuel of the future" but not yet widely deployed?',
        options: [
          { text: 'It\'s an energy CARRIER, not an energy SOURCE — its climate value depends on how the H₂ is made', correct: true, explanation: 'Right. **Burning H₂ produces only water — clean.** But making H₂ requires energy. "Green" hydrogen is electrolyzed using renewables (clean). "Gray" hydrogen is made from natural gas, releasing CO₂ in the process (not clean). Today most H₂ is gray. Hydrogen is most useful for sectors hard to electrify (steel, long-haul aviation, fertilizer) where its energy density helps.' },
          { text: 'Hydrogen is too dangerous to use', correct: false, explanation: 'Hydrogen has different safety properties than gasoline (lighter, dissipates faster) but is broadly manageable with proper engineering. Already used industrially at scale.' },
          { text: 'There isn\'t enough hydrogen on Earth', correct: false, explanation: 'Hydrogen is the most abundant element in the universe. We can produce as much as we want — the question is energy cost.' },
          { text: 'It only works in cold climates', correct: false, explanation: 'No climate dependence for hydrogen production or use.' },
        ],
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
          { text: 'Different climates', correct: false, explanation: 'Climate matters but isn\'t the main reason. Methodology differences are.' },
          { text: 'Different student counts', correct: false, explanation: 'Schools normalize per-student to control for size.' },
          { text: 'Different reporting years', correct: false, explanation: 'Real factor, but not the dominant one. Methodology choices matter more than reporting year alignment.' },
        ],
      },
      {
        type: 'math',
        heading: 'Math: same school, different methodology',
        scenario: 'Two schools have IDENTICAL physical operations: 340 students, 4,150 mtCO₂e gross, 3,000 mtCO₂e of forest sequestration. School A reports the net (subtracts sinks). School B reports gross only.',
        given: [
          { label: 'Gross (both)', value: '4,150 mtCO₂e' },
          { label: 'Sequestration (real)', value: '3,000 mtCO₂e' },
          { label: 'Students (both)', value: '600' },
        ],
        question: 'Difference in published per-student footprint:',
        options: [
          { text: 'Both publish ~3.4 mt/student', correct: false, explanation: 'Only A subtracts sinks. B reports gross only and would publish a higher number.' },
          { text: 'A: ~3.4 mt; B: ~12.2 mt — same campus, very different number', correct: true, explanation: 'Right. A: (4,150 − 3,000) / 340 = 3.38. B: 4,150 / 340 = 12.21. Same physical campus, 3.6× higher because Sinks are excluded. This is the Valls-Val & Bovea (2021) finding in one example.' },
          { text: 'Both publish ~6.9 mt', correct: false, explanation: 'A subtracted sinks first, so its published number is lower than B\'s.' },
          { text: 'A: ~5.0 mt; B: ~5.0 mt', correct: false, explanation: 'You may have used the sequestration per student. The actual reported numbers are 3.4 (A) and 12.2 (B).' },
        ],
      },
      {
        type: 'quiz',
        question: 'What\'s the fundamental difference between an "offset" and an on-campus "sink"?',
        options: [
          { text: 'They\'re the same thing', correct: false, explanation: 'They\'re not — and the distinction matters a lot for honest reporting.' },
          { text: 'Offsets are purchased credits paid for emissions reductions or removals elsewhere; sinks are physical drawdown happening on your own land', correct: true, explanation: 'Right. **An offset is a financial transaction** — you pay someone else (a forest project in Brazil, a wind farm in Texas) to either reduce their own emissions or pull carbon from the atmosphere on your behalf. **A sink is physical drawdown** happening on land you control. Offsets work in principle but their quality varies enormously, and there\'s no guarantee the seller actually delivered what they sold. KUA\'s 3,000 mtCO₂e/yr from the campus forest is real, measurable, and physically here. Middlebury\'s "net zero" via offsets is a financial claim about CO₂ molecules they paid someone else to handle — not the same thing.' },
          { text: 'Offsets are bigger than sinks', correct: false, explanation: 'Either can be bigger — depends on the project. The fundamental difference is offsets-as-payment vs sinks-as-physical-drawdown, not size.' },
          { text: 'Sinks are more expensive', correct: false, explanation: 'Sinks (your existing forest) are typically free if you already own the land. Offsets cost real money. The cost direction is opposite of what this option claims.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AASHE STARS — the standardized framework most peer schools use',
        body: 'There IS a partial solution to the comparison problem: a standardized framework called **AASHE STARS** (Sustainability Tracking, Assessment & Rating System), developed by the Association for the Advancement of Sustainability in Higher Education.\n\nSchools that participate report data using consistent definitions across categories: emissions (tracked through Scope 1, 2, and the GHG Protocol Scope 3 categories), energy, water, waste, transportation, food, and many social/governance factors. Reports are public, peer-reviewed, and updated every few years. Schools earn ratings from Bronze to Platinum based on their performance.\n\n**The catch:** AASHE STARS is **voluntary**, costs money to participate (~$1,200-3,000/year depending on institution size), and methodology choices still vary within the framework. Many secondary schools (including KUA) don\'t participate at all because the framework was designed for higher education. Even among universities that do participate, **Scope 3 is incomplete in most reports** — schools tend to track what\'s easiest to measure, not what\'s most material.\n\nThe practical situation: if you want to compare KUA to colleges that report through AASHE STARS, you can sometimes do so — but the comparison still requires careful interpretation about which Scope 3 categories each side included, and on-campus sequestration is rarely tracked even within STARS reporting.',
      },
      {
        type: 'concept',
        heading: 'What "carbon neutral" claims actually mean',
        body: 'Many institutions claim **"carbon neutral"** status. Reading the fine print is important — these claims vary enormously in what they actually represent.\n\n**The strongest version:** the institution has reduced its measured emissions to near-zero through real reductions (electrification, energy efficiency, clean electricity procurement, building retrofits) AND any residual emissions are offset by physical removal on owned land. Very few institutions reach this standard. Costs decades of investment.\n\n**The middle version:** the institution has reduced emissions partially and offsets the rest with a **mix** of physical sequestration on its own land and high-quality purchased offsets (third-party verified, with clear additionality and permanence). Better than the alternative but depends entirely on offset quality.\n\n**The weakest version:** the institution buys offsets equal to its gross emissions, claims neutrality, but emissions haven\'t actually fallen. The offsets may be cheap, low-quality, and have questionable additionality. This is the most common form of "neutrality" claim, and the most criticized.\n\nMiddlebury\'s "net zero" status (achieved in 2016) is closer to the middle version: significant real reductions through their biomass plant plus REC purchases plus offsets. But the gross emissions are still real — they\'re just balanced in accounting by purchased credits. KUA, by contrast, would only need to claim a much smaller net number because **the campus forest physically removes the carbon**, on land KUA owns.\n\n**Practical takeaway:** when you see a "net zero" claim, look for the breakdown. How much is reduction? How much is on-campus sequestration? How much is purchased offsets? The ratio tells you whether the claim represents real environmental impact or just accounting choices.',
      },
      {
        type: 'concept',
        heading: 'Middlebury\'s "net zero" is not the same as KUA\'s drawdown',
        body: 'Middlebury reports as carbon-neutral by purchasing offsets equal to gross emissions. The CO₂ molecules they emit still go up; they paid someone else to remove an equal amount somewhere else. KUA\'s 3,000 mtCO₂e/yr from the campus forest is physical — those molecules are actually pulled out, on KUA land.',
      },
      {
        type: 'quiz',
        question: 'Which of these schools\' "net zero" claim represents the most environmental impact?',
        options: [
          { text: 'A school that buys $50K of cheap forest offsets from Brazil and claims neutrality, with no on-campus reductions', correct: false, explanation: 'This is the weakest form of neutrality claim. The school\'s actual emissions haven\'t fallen, and the offset quality is uncertain. Recent journalism (the Guardian / Carbon Plan investigation, 2023) found that ~90% of REDD+ offsets sold by major registries didn\'t represent real additional emissions reductions.' },
          { text: 'A school that retrofitted its heating to heat pumps, signed a clean-electricity supply contract, and offsets the small remainder with verified physical sequestration on owned land', correct: true, explanation: 'Right. This represents the strongest form of neutrality — **real emissions reductions through electrification and clean procurement**, with the remainder addressed by physical sequestration the school can verify on its own land. The CO₂ molecules emitted are actually fewer; the rest are physically removed. This is what carbon neutrality is supposed to mean and is rare in practice.' },
          { text: 'A school that built a large solar farm and purchases carbon credits from a wind project in Texas to cover the rest', correct: false, explanation: 'Better than option 1 but still relies on purchased credits whose quality varies. The solar reduces Scope 2 emissions (good) but the credits address residual Scope 1 and Scope 3 by paying someone else. RECs from a wind project are high-quality but may not actually reduce the school\'s own emissions.' },
          { text: 'A school that doesn\'t track its emissions but says it\'s "committed to sustainability"', correct: false, explanation: 'No measurement = no claim, regardless of marketing. Without published numbers, there\'s no way to verify any reduction. The strength of a neutrality claim depends entirely on whether the underlying math is transparent.' },
        ],
      },
      {
        type: 'concept',
        heading: 'AP Stats: when comparison is and isn\'t valid',
        body: 'A valid comparison requires consistent measurement methodology. Comparing two schools with different scope inclusions is like comparing GPA systems with different scales. AP Stats students recognize this as confounding by methodology — the difference in published numbers might reflect real differences, OR just measurement choices. The Valls-Val & Bovea (2021) finding that 35 university studies use inconsistent methods means cross-study meta-analysis requires careful normalization.',
      },
      {
        type: 'quiz',
        question: 'How can you fairly compare two schools\' carbon footprints?',
        options: [
          { text: 'Look only at per-student totals', correct: false, explanation: 'Per-student normalization is necessary but not sufficient — you also need to know what scopes were included and what methodology was used.' },
          { text: 'Verify they used the same scope inclusions, denominator, and methodology before comparing', correct: true, explanation: 'Right. **Comparison requires methodology parity.** Did both count Scope 3 fully? Both use the same denominator (FTE vs headcount)? Both measure on-campus sinks? If any of those differ, the apparent comparison may be a methodology artifact. Valls-Val & Bovea (2021) found this was the dominant problem in their review of 35 university footprint studies.' },
          { text: 'Compare gross emissions only, ignoring sinks', correct: false, explanation: 'This makes comparison easier but penalizes schools that legitimately measure their physical sinks. Better to compare both gross and net side-by-side.' },
          { text: 'Trust the numbers schools self-report without verification', correct: false, explanation: 'Self-reported data without verification standards is notoriously unreliable. AASHE STARS adds some peer review but doesn\'t fully solve the problem.' },
        ],
      },
      {
        type: 'quiz',
        question: 'A school spends $50,000 to buy carbon offsets equal to its 1,000 mtCO₂e gross annual emissions. What\'s the average price per ton it paid?',
        options: [
          { text: '$5/ton', correct: false, explanation: 'The math: $50,000 ÷ 1,000 = $50/ton.' },
          { text: '$50/ton', correct: true, explanation: 'Right. $50,000 / 1,000 mtCO₂e = $50/ton CO₂. **This is in the upper-middle of the voluntary market range** ($5-50/ton typical). Higher quality offsets (engineered removal, verified additionality) cost more; cheap nature-based offsets cost less but face quality concerns. The Guardian / Carbon Plan investigation (2023) found ~90% of REDD+ offsets in major registries didn\'t represent real additional reductions.' },
          { text: '$500/ton', correct: false, explanation: 'That would be DAC-level pricing. Way above what the school paid.' },
          { text: '$5,000/ton', correct: false, explanation: 'No carbon market sells offsets at that price — even the most expensive removal credits cost a fraction of that.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Two schools each report 5 mtCO₂e/student net. School A measures on-campus sinks; School B doesn\'t. What\'s most likely true about their underlying physical reality?',
        options: [
          { text: 'They emit the same amount', correct: false, explanation: 'If A subtracts sinks and B doesn\'t, A\'s GROSS is likely higher than B\'s gross.' },
          { text: 'School A actually emits MORE than B; the sink subtraction makes A look equal', correct: true, explanation: 'Right. If School A reports 5 net AFTER subtracting (say) 2 mt of sinks, A\'s gross is 7. School B reports 5 with no sinks subtracted, so B\'s gross is 5. **A actually emits MORE in the atmosphere; the only thing equalizing them is A\'s methodology of counting drawdown.** This is exactly the comparison problem Valls-Val & Bovea (2021) flagged: "same number" can mean very different physical realities.' },
          { text: 'School B emits more than A', correct: false, explanation: 'You\'d need to know each school\'s gross before sinks to determine that. The methodology difference goes the other way.' },
          { text: 'You can\'t conclude anything', correct: false, explanation: 'You CAN conclude that the methodologies differ and that A\'s gross emissions are higher than B\'s gross emissions. That\'s a valid inference.' },
        ],
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
          { text: 'Student turning off dorm lights', correct: false, explanation: 'Tiny — about 0.005 mtCO₂e per LED bulb saved per year.' },
          { text: 'One fewer round-trip flight per international student', correct: true, explanation: 'Right. 50 × 1 × 2.93 = 146 mtCO₂e/yr saved across the international cohort. The single highest-leverage individual lever in the entire dashboard.' },
          { text: 'Composting in dining hall', correct: false, explanation: 'Real but smaller — ~10–24 mt/yr at full diversion. Captures fugitive methane that would otherwise leak from landfilled food.' },
          { text: 'Buying offsets equal to KUA\'s gross emissions', correct: false, explanation: 'Offsets equal gross would account for ~4,150 mt on paper, but the offset quality varies and KUA\'s emissions don\'t actually fall. Reduction wins over offsetting per dollar of effort.' },
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
          { text: '(a) > (b) > (c)', correct: false, explanation: 'Heat pump is real but smallest at this scale. The flight reduction across 30 students dominates.' },
          { text: '(b) > (a) > (c)', correct: false, explanation: 'Recheck (c) — 30 students × ~3 mt per round trip ≈ 88 mt, larger than the LED retrofit.' },
          { text: '(b) > (c) > (a)', correct: false, explanation: 'Close on the order — (c) is slightly larger than (b). 30 × 2.93 = 87.9 vs LED 80.6.' },
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
          { text: 'Heat pump ~$50/ton; LED ~$80/ton', correct: false, explanation: 'You may have inverted the ratios. The heat pump costs MORE per ton than the LED retrofit at these specific cost and savings figures.' },
          { text: 'Heat pump ~$80/ton; LED ~$40/ton', correct: false, explanation: 'You may have used $ alone without dividing by total tons saved over the project lifetime. The denominator is annual savings × years.' },
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
        type: 'quiz',
        question: 'Which of these intervention types typically has the LOWEST cost per ton of CO₂ avoided?',
        options: [
          { text: 'LED retrofit + thermostat setbacks', correct: true, explanation: 'Right. **Behavioral and lighting interventions are typically the cheapest** — payback in 1-3 years. The marginal abatement cost curve for almost any institution starts here, then moves up to electrification, then to procurement, then to offsets at the high end.' },
          { text: 'Buying premium DAC offsets', correct: false, explanation: 'DAC = $300-700/ton — among the most expensive options.' },
          { text: 'Installing residential solar', correct: false, explanation: 'Solar has dropped dramatically but is still ~$50-100/ton over its lifetime when you account for installation. Cheaper than offsets but more expensive than efficiency.' },
          { text: 'Demolishing buildings to plant forests', correct: false, explanation: 'Demolition releases huge embodied carbon and forests take decades to compensate. Almost never net-positive on reasonable timescales.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Why does the dashboard rank action levers by IMPACT (mtCO₂e/yr) rather than by cost?',
        options: [
          { text: 'Cost is irrelevant for school budgets', correct: false, explanation: 'Cost matters a lot for actual implementation. The point is impact and cost are different questions.' },
          { text: 'Impact tells you what moves the climate; cost is a separate question about feasibility', correct: true, explanation: 'Right. **Impact and cost-effectiveness are independent dimensions.** A $50/ton intervention saving 1 ton is cheaper but smaller than a $200/ton intervention saving 100 tons. Both questions matter, but impact has to come first to know what scale you\'re working at.' },
          { text: 'Impact is always positive and cost is always negative', correct: false, explanation: 'Cost can be negative (savings exceed investment) and impact can be small. They\'re independent.' },
          { text: 'Schools care about appearance over reality', correct: false, explanation: 'Opposite — measurement is for honesty, not optics.' },
        ],
      },
      {
        type: 'quiz',
        question: 'KUA replaces 4 dorm boilers with heat pumps over 5 years. Each saves ~38 mtCO₂e/yr. What\'s the total emission reduction by year 10?',
        options: [
          { text: '~152 mtCO₂e total', correct: false, explanation: 'That\'s just one year of savings × 4 dorms. The savings RECUR every year for the heat pumps\' lifetimes.' },
          { text: '~1,160 mtCO₂e cumulative', correct: true, explanation: 'Right. Year 1: 1 dorm × 38 = 38. Year 2: 2 × 38 = 76. ... Year 5: 5 × 38 = 190. Years 6-10 all 5 × 38 = 190. Cumulative through year 10: 38 + 76 + 114 + 152 + 190 + 5×190 = 1,520 mtCO₂e (or ~1,160 if you count from year 1 with each dorm starting in year of installation only). The compounding of recurring savings is why infrastructure changes have outsized long-term impact.' },
          { text: '~38 mtCO₂e total', correct: false, explanation: 'That\'s one dorm in one year — way too small.' },
          { text: '~10,000 mtCO₂e total', correct: false, explanation: 'Way too high — that would require ~30 retrofitted dorms or much higher per-dorm savings.' },
        ],
      },
      {
        type: 'quiz',
        question: 'KUA gets a $200K donation specifically for emission reduction. Which use likely yields the most CO₂ avoided per dollar?',
        options: [
          { text: 'Buy carbon offsets at $50/ton — guaranteed 4,000 tons retired', correct: false, explanation: 'Cheap on paper, but offset quality varies. The Guardian/Carbon Plan investigation found ~90% of REDD+ offsets didn\'t represent real reductions. And once spent, it\'s gone — no recurring benefit.' },
          { text: 'LED retrofit + thermostat controls campus-wide', correct: true, explanation: 'Right. **LED + behavioral controls typically pay back in 1-3 years with savings continuing for 15+ years.** $200K of LEDs across multiple buildings would save ~50-100 mt/year for the equipment\'s lifetime — total cumulative impact 1,500+ mtCO₂e over 20 years from one investment, all at KUA. Highest impact-per-dollar by far.' },
          { text: 'Premium DAC offsets at $500/ton — 400 tons retired', correct: false, explanation: 'High quality but expensive. $200K only buys ~400 tons of DAC. Smaller total impact than the LED option.' },
          { text: 'Plant 1,000 native trees on campus', correct: false, explanation: 'Long-term sequestration is real, but year-1 impact is tiny (~5-10 tons). Trees take 20-30 years to mature into significant sinks. LED savings start immediately.' },
        ],
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
          { text: 'Fly: 100 kg — flying is always greener', correct: false, explanation: 'A common myth. Flying is more efficient per passenger-mile than solo driving on **long** trips, but for a short 700-mile round trip, solo driving in a fuel-efficient car is comparable or slightly better. The "flying is greenest" assumption only holds when the alternative is one driver in a gas-guzzler.' },
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
          { text: '~3 kg CO₂e', correct: false, explanation: 'Way too low. You probably forgot to multiply by the 36 weeks.' },
          { text: '~292 kg CO₂e', correct: true, explanation: 'Right. 36 swaps × 0.15 kg × (60 − 6) = 36 × 8.1 = 291.6 kg CO₂e ≈ 0.29 mt. One student over four years saves ~1.2 mt just from one weekly swap.' },
          { text: '~3,000 kg CO₂e', correct: false, explanation: 'Used the full beef factor instead of the difference. Remember: the **swap** only avoids the beef-vs-chicken delta (54 kg/kg), not the entire beef footprint.' },
          { text: '~30 kg CO₂e', correct: false, explanation: 'Off by a factor of 10. You may have used 0.015 kg (15 g) instead of 0.15 kg (150 g) per portion.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which has the biggest carbon footprint per pound?',
        options: [
          { text: 'Beef', correct: true, explanation: 'Right. Cattle digestion produces **methane** (a 28× greenhouse gas); cattle also take more land, water, and feed per pound of meat. Beef is ~10× chicken and 50–100× plant foods.' },
          { text: 'Chicken', correct: false, explanation: 'Chicken is much lower than beef (~6 kg CO₂e/kg vs ~60 for beef). Chickens grow fast, eat less per pound of meat, and don\'t produce methane the way cattle do.' },
          { text: 'Wheat', correct: false, explanation: 'Plant foods are usually lowest. Wheat is ~1 kg CO₂e/kg — about 60× lower than beef.' },
          { text: 'Lamb', correct: false, explanation: 'Lamb is high (~24 kg CO₂e/kg) — also a ruminant that produces methane — but still less than beef per pound on most lifecycle datasets.' },
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
          { text: '(a) skip flight — $0/mt', correct: true, explanation: 'Right. (a) costs nothing in dollars. (b) ≈ $100/mt. (c) ≈ $100/mt but is also **offsets-not-removal**, which means you\'re paying someone else to do something they may or may not actually do. Direct emission reductions you can verify yourself dominate offsets in the cost-effectiveness ranking when you have the choice.' },
          { text: '(c) offsets — fastest', correct: false, explanation: 'Same dollar cost as (b) per mt, but (c) is offsets — you\'re still emitting the gases. The "3 mt avoided" is a paper accounting claim, not a physical reduction.' },
          { text: 'They\'re all about the same', correct: false, explanation: 'Skipping a flight is genuinely free in dollars — that breaks the tie. Cost-effectiveness ranking puts (a) clearly ahead.' },
          { text: '(b) vegetarian year — most reliable', correct: false, explanation: '(b) is solid (~$100/mt and a real reduction), but it\'s 3× more expensive in absolute mt-impact than (a). "Reliable" isn\'t the same as "cost-effective per ton."' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which has the LARGEST per-calorie carbon footprint?',
        options: [
          { text: 'Beef', correct: true, explanation: 'Right. **Beef** is high in carbon AND low in calories — about 8-15 kg CO₂e per 1,000 calories. Plant staples (rice, pasta, potatoes) are 0.5-1. Chicken is moderate at ~2.' },
          { text: 'Avocados', correct: false, explanation: 'Avocados are moderate (~2 kg per 1,000 cal). Higher than rice but lower than meat.' },
          { text: 'Pasta', correct: false, explanation: 'Pasta is among the lowest-footprint staples (~0.5 kg per 1,000 cal).' },
          { text: 'Eggs', correct: false, explanation: 'Eggs (~2-3 kg per 1,000 cal) are higher than plants but well below beef.' },
        ],
      },
      {
        type: 'quiz',
        question: 'A KUA international student\'s annual personal footprint is ~6 mt. The LARGEST single contributor is:',
        options: [
          { text: 'Dorm electricity', correct: false, explanation: 'Per-student dorm electricity is ~0.4 mt — small.' },
          { text: 'International round-trip flights home', correct: true, explanation: 'Right. **A single round-trip to East Asia ≈ 3 mtCO₂e** — half a typical student\'s personal annual footprint in one trip. Two round trips per year (winter + summer) = ~50-60% of personal footprint.' },
          { text: 'Cafeteria food', correct: false, explanation: 'Food contributes ~1 mt depending on diet. Smaller than long-haul flights.' },
          { text: 'Disposable bottles and cups', correct: false, explanation: 'Single-digit kg per year — tiny on the scale that matters.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Setting a dorm radiator from 22 °C to 20 °C overnight saves roughly:',
        options: [
          { text: '~14% of overnight heating energy', correct: true, explanation: 'Right. About **7% per °F of setback × ~2 °F ≈ 14%** of overnight heating. EPA ENERGY STAR documents this rule. Across an NH winter, ~30-50 kg CO₂e per dorm room saved from a free habit change.' },
          { text: '~1%', correct: false, explanation: 'Too low — 2 °F lower is real impact.' },
          { text: '~50%', correct: false, explanation: 'Too high — setback only applies to overnight hours.' },
          { text: '~80%', correct: false, explanation: 'Way too high — would risk frozen pipes.' },
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
  allExplain: { marginTop: 14, display: 'grid', gap: 10 },
  allExplainHeader: { fontSize: 13, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 4 },
  explainCard: (kind) => ({
    padding: '12px 14px',
    background: '#0b1220',
    borderLeft: `3px solid ${kind === 'correct' ? '#22c55e' : '#ef4444'}`,
    border: '1px solid #1f2937',
    borderRadius: 6,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 1.6,
  }),
  explainOpt: { fontWeight: 700, color: '#e5e7eb' },
  explainMark: (kind) => ({
    display: 'inline-block',
    fontSize: 11,
    padding: '2px 7px',
    borderRadius: 999,
    background: kind === 'correct' ? '#052e1a' : '#3a0d0d',
    color: kind === 'correct' ? '#86efac' : '#fca5a5',
    fontWeight: 700,
    marginRight: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  }),
  explainPicked: { fontSize: 11, color: '#fbbf24', marginLeft: 8, fontStyle: 'italic' },

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
  scoreCard: { marginTop: 20, padding: '20px 22px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, textAlign: 'left' },
  scoreLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700, marginBottom: 12 },
  scoreHero: { fontSize: 'clamp(28px, 6vw, 38px)', color: '#e5e7eb', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums' },
  scoreHeroUnit: { fontSize: 16, color: '#94a3b8', fontWeight: 500, marginLeft: 8 },
  scoreRow: { marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' },
  scorePill: (kind) => ({
    padding: '6px 12px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    border: '1px solid',
    borderColor: kind === 'right' ? '#14532d' : kind === 'wrong' ? '#7f1d1d' : '#334155',
    background: kind === 'right' ? '#052e1a' : kind === 'wrong' ? '#3a0d12' : '#0f172a',
    color: kind === 'right' ? '#86efac' : kind === 'wrong' ? '#fca5a5' : '#cbd5e1',
  }),
  scoreNote: { marginTop: 14, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 },
  reportSection: { marginTop: 22, padding: '20px 22px', background: '#0b1220', border: '1px solid #1f2937', borderRadius: 10, textAlign: 'left' },
  reportTitle: { fontSize: 14, color: '#e5e7eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 },
  reportRow: (kind) => ({
    padding: '14px 16px',
    marginTop: 10,
    background: '#0f172a',
    border: '1px solid',
    borderColor: kind === 'right' ? '#14532d' : kind === 'wrong' ? '#7f1d1d' : '#334155',
    borderLeft: '4px solid',
    borderLeftColor: kind === 'right' ? '#22c55e' : kind === 'wrong' ? '#ef4444' : '#64748b',
    borderRadius: 8,
  }),
  reportNum: { fontSize: 12, color: '#64748b', fontWeight: 700, letterSpacing: 0.6 },
  reportMark: (kind) => ({
    display: 'inline-block',
    fontSize: 11,
    padding: '3px 10px',
    borderRadius: 999,
    fontWeight: 700,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    background: kind === 'right' ? '#052e1a' : kind === 'wrong' ? '#3a0d12' : '#1e293b',
    color: kind === 'right' ? '#86efac' : kind === 'wrong' ? '#fca5a5' : '#cbd5e1',
  }),
  reportQ: { marginTop: 8, fontSize: 15, color: '#e5e7eb', fontWeight: 600, lineHeight: 1.5 },
  reportLine: { marginTop: 8, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },
  reportLineLabel: { color: '#64748b', fontWeight: 600, marginRight: 6 },
};

// Renders every option's explanation after the student answers — so they learn
// not just from the one they picked, but from why each distractor was wrong (or
// confirmation of why the right one is right).
function AllExplanations({ options, pickedIdx, pickedCorrect }) {
  return (
    <div style={styles.allExplain}>
      <div style={styles.allExplainHeader}>
        {pickedCorrect ? '✓ Correct — and here\'s why each option works the way it does:' : '— Not quite. Here\'s the breakdown of every option:'}
      </div>
      {options.map((opt, i) => {
        const kind = opt.correct ? 'correct' : 'wrong';
        return (
          <div key={i} style={styles.explainCard(kind)}>
            <span style={styles.explainMark(kind)}>{opt.correct ? '✓ Correct' : '✗ Wrong'}</span>
            <span style={styles.explainOpt}>{opt.text}</span>
            {i === pickedIdx && <span style={styles.explainPicked}>← you picked this</span>}
            <div style={{ marginTop: 8 }}>
              <Fmt text={opt.explanation} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LearnAgent() {
  const [activePathId, setActivePathId] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [scores, setScores] = useState({});

  const path = paths.find((p) => p.id === activePathId);
  const step = path && path.steps[stepIdx];
  const totalSteps = path ? path.steps.length : 0;
  const progress = path ? ((stepIdx + 1) / totalSteps) * 100 : 0;

  const startPath = (id) => { setActivePathId(id); setStepIdx(0); setAnswer(null); setScores({}); };
  const reset = () => { setActivePathId(null); setStepIdx(0); setAnswer(null); setScores({}); };
  const next = () => { setAnswer(null); setStepIdx((i) => i + 1); };
  const prev = () => { setAnswer(null); setStepIdx((i) => Math.max(0, i - 1)); };
  const choose = (i, opt) => {
    setAnswer({ idx: i, correct: opt.correct });
    setScores((s) => ({ ...s, [stepIdx]: { picked: i, correct: !!opt.correct } }));
  };

  const questionSteps = path ? path.steps.map((s, i) => ({ s, i })).filter(({ s }) => s.type === 'quiz' || s.type === 'math') : [];
  const totalQuestions = questionSteps.length;
  const scoredEntries = Object.values(scores);
  const rightCount = scoredEntries.filter((v) => v && v.correct === true).length;
  const wrongCount = scoredEntries.filter((v) => v && v.correct === false).length;
  const skippedCount = Math.max(0, totalQuestions - rightCount - wrongCount);
  const pct = totalQuestions > 0 ? Math.round((rightCount / totalQuestions) * 100) : 0;

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
              <p style={styles.stepBody}><Fmt text={step.body} /></p>
            </>
          )}

          {step.type === 'quiz' && (
            <>
              <div style={styles.question}>{step.question}</div>
              <div style={styles.optionList}>
                {step.options.map((opt, i) => {
                  let state = null;
                  if (answer) {
                    if (opt.correct) state = 'correct';
                    else if (i === answer.idx) state = 'wrong';
                  }
                  return (
                    <button key={i} type="button" style={styles.option(state)} disabled={!!answer} onClick={() => choose(i, opt)}>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {answer && <AllExplanations options={step.options} pickedIdx={answer.idx} pickedCorrect={answer.correct} />}
            </>
          )}

          {step.type === 'math' && (
            <>
              <div style={styles.mathBadge}>Work it out</div>
              <div style={styles.stepHeading}>{step.heading}</div>
              <p style={styles.scenario}><Fmt text={step.scenario} /></p>
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
                    if (opt.correct) state = 'correct';
                    else if (i === answer.idx) state = 'wrong';
                  }
                  return (
                    <button key={i} type="button" style={styles.option(state)} disabled={!!answer} onClick={() => choose(i, opt)}>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {answer && <AllExplanations options={step.options} pickedIdx={answer.idx} pickedCorrect={answer.correct} />}
            </>
          )}

          {step.type === 'finish' && (
            <div style={styles.done}>
              <div style={styles.doneTitle}>{step.heading}</div>
              <p style={styles.doneBody}><Fmt text={step.body} /></p>
              {totalQuestions > 0 && (
                <>
                  <div style={styles.scoreCard}>
                    <div style={styles.scoreLabel}>Your score on this path</div>
                    <div>
                      <span style={styles.scoreHero}>{rightCount}<span style={{ color: '#475569', fontWeight: 600 }}> / {totalQuestions}</span></span>
                      <span style={styles.scoreHeroUnit}>({pct}%)</span>
                    </div>
                    <div style={styles.scoreRow}>
                      <span style={styles.scorePill('right')}>✓ {rightCount} right</span>
                      <span style={styles.scorePill('wrong')}>✗ {wrongCount} wrong</span>
                      {skippedCount > 0 && <span style={styles.scorePill('skipped')}>– {skippedCount} skipped</span>}
                    </div>
                    <div style={styles.scoreNote}>
                      {pct === 100
                        ? 'Perfect run — you nailed every question on this path.'
                        : pct >= 80
                        ? 'Strong showing. Skim the explanations on the ones you missed and you\'re solid.'
                        : pct >= 50
                        ? 'Good effort. Worth re-running this path or going back to review the concepts behind the wrong answers.'
                        : 'Plenty to revisit. Re-running the path is a good move — the explanations on every option are designed to teach the misconception, not just mark it wrong.'}
                    </div>
                  </div>

                  <div style={styles.reportSection}>
                    <div style={styles.reportTitle}>Question-by-question report</div>
                    {questionSteps.map(({ s, i }, qNum) => {
                      const entry = scores[i];
                      const kind = !entry ? 'skipped' : entry.correct ? 'right' : 'wrong';
                      const correctOpt = s.options.find((o) => o.correct);
                      const pickedOpt = entry ? s.options[entry.picked] : null;
                      const qText = s.type === 'math' ? `${s.heading} — ${s.question}` : s.question;
                      return (
                        <div key={i} style={styles.reportRow(kind)}>
                          <div>
                            <span style={styles.reportNum}>Q{qNum + 1}</span>
                            <span style={styles.reportMark(kind)}>
                              {kind === 'right' ? '✓ Correct' : kind === 'wrong' ? '✗ Wrong' : '– Not answered'}
                            </span>
                          </div>
                          <div style={styles.reportQ}><Fmt text={qText} /></div>
                          {pickedOpt && (
                            <div style={styles.reportLine}>
                              <span style={styles.reportLineLabel}>You picked:</span>
                              <Fmt text={pickedOpt.text} />
                            </div>
                          )}
                          {kind !== 'right' && correctOpt && (
                            <div style={styles.reportLine}>
                              <span style={styles.reportLineLabel}>Correct answer:</span>
                              <Fmt text={correctOpt.text} />
                            </div>
                          )}
                          {(pickedOpt || correctOpt) && (
                            <div style={styles.reportLine}>
                              <span style={styles.reportLineLabel}>Why:</span>
                              <Fmt text={(pickedOpt && pickedOpt.explanation) || (correctOpt && correctOpt.explanation) || ''} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
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
