// AP Macro Unit 2 — Economic Indicators and the Business Cycle (12-17%)

export const APMACRO_UNIT_2 = {
  number: 2,
  title: 'Economic Indicators and the Business Cycle',
  weight: '12-17%',
  subunits: [
    {
      code: '2.1',
      title: 'The circular flow and GDP',
      content:
`**Circular flow model.** Money and resources flow between households, businesses, and government.

**Households** sell labor/capital to firms; firms sell goods to households.

**Two main approaches to measuring economic output:**

**Gross Domestic Product (GDP).** Market value of all final goods and services produced within a country in a year.

**Two ways to measure GDP** (should equal each other):
1. **Expenditure approach**: GDP = C + I + G + (X - M).
   - C: Consumption (60-70% of US GDP).
   - I: Investment (business spending).
   - G: Government spending.
   - X - M: Net exports.

2. **Income approach**: sum of all income earned (wages, profits, rent, interest).

**What\'s NOT in GDP:**
- Used goods (already counted).
- Intermediate goods (only final).
- Stocks and bonds (financial transfers).
- Government transfers (Social Security; not new production).
- Underground economy.
- Household production.
- Volunteer work.

**Nominal GDP** uses current prices.
**Real GDP** adjusts for inflation (uses base-year prices).

**Real GDP per capita** = (Real GDP) / population. Best measure of standard of living.

**Limitations of GDP:**
- Doesn\'t measure income distribution.
- Doesn\'t account for environmental damage.
- Doesn\'t capture quality of life, health, leisure.
- Doesn\'t include non-market production.
- "Bads" (pollution cleanup) and "goods" both counted equally.

Despite limits, GDP is the workhorse economic measure.`,
    },
    {
      code: '2.2',
      title: 'Limitations of GDP',
      content:
`GDP measures output but not well-being. Major limitations:

**Distribution.** Doesn\'t show who gets the income. Country could have rising GDP with falling incomes for most people if gains concentrate at top.

**Non-market activities.** Home production, volunteer work, illegal activities not counted.

**Environmental damage.** Pollution and resource depletion not subtracted. GDP up when forests cleared.

**Quality changes.** Hard to capture (your smartphone vs 1985 brick phone).

**Leisure.** Country with shorter workweeks has lower GDP but possibly higher well-being.

**Alternatives:**
- **Human Development Index (HDI)**: combines income, education, life expectancy.
- **Genuine Progress Indicator (GPI)**: subtracts costs of environmental damage, crime, etc.
- **Happiness indices** (Bhutan\'s GNH, World Happiness Report).
- **Sustainable Development Goals**.

**Why GDP persists.** Easy to measure, standardized internationally, related to many other measures (employment, tax revenue).`,
    },
    {
      code: '2.3',
      title: 'Unemployment',
      content:
`**Unemployment rate** = (# unemployed) / (labor force) × 100.

**Labor force** = employed + unemployed (actively seeking work).
**Unemployment** = no job + actively seeking + available.

**NOT in labor force**: students, retired, homemakers, discouraged workers (gave up looking).

**Types of unemployment:**

**Frictional.** Short-term between jobs. New grads, job-switchers. Healthy economy has some.

**Structural.** Mismatch of skills and jobs. Coal miners after coal decline. Long-term.

**Cyclical.** Due to economic downturns. High in recessions.

**Seasonal.** Tied to time of year (lifeguards, ski instructors).

**Natural rate of unemployment** = frictional + structural. ~4-5% in US. Cyclical at zero means economy at "full employment."

**Labor force participation rate** = LF / working-age population. Fallen in US since 2000.

**Limitations:**
- Doesn\'t count underemployed (working part-time, want full-time).
- Doesn\'t count discouraged workers.
- "U-3" official rate; "U-6" broader (includes part-time, discouraged) — usually higher.

**Cost of unemployment:**
- Lost output (Okun\'s Law: 1% unemployment ≈ 2% lost GDP).
- Personal: health, depression, lost skills.
- Government: lower taxes, higher welfare spending.

**Full employment** ≠ 0% unemployment. Means cyclical = 0 (only natural unemployment remains).`,
    },
    {
      code: '2.4',
      title: 'Inflation',
      content:
`**Inflation.** Sustained rise in general price level.

**Measured by:**
- **Consumer Price Index (CPI)**: tracks basket of consumer goods.
- **Producer Price Index (PPI)**: wholesale prices.
- **GDP deflator**: broader measure.

**Calculation:** Inflation rate = (CPI_this year - CPI_last year) / CPI_last year × 100.

**Real vs nominal:**
- **Nominal**: current dollars.
- **Real**: adjusted for inflation (constant dollars).
- Real interest rate = Nominal - Inflation.

**Causes of inflation:**
- **Demand-pull**: too much money chasing too few goods. Caused by ↑ AD.
- **Cost-push**: input cost rises (oil shock 1970s).
- **Built-in / wage-price spiral**: workers demand raises to keep up with inflation; firms raise prices; cycle continues.

**Types of inflation:**
- **Moderate** (1-3%): typical, manageable.
- **High** (10%+): disruptive.
- **Hyperinflation** (50%+/month): catastrophic. Weimar Germany, Zimbabwe 2008, Venezuela 2010s.
- **Deflation**: negative inflation; falling prices. Causes recession (people delay spending).

**Who hurts/benefits from inflation:**
- Hurt: lenders (paid back in cheaper dollars), fixed-income (pensions, savings), bondholders.
- Benefits: borrowers (debt easier to repay), workers in industries that raise wages first.

**Hyperinflation effects.**
- Currency loses confidence.
- Barter increases.
- Savings destroyed.
- Often ends in monetary reform or new currency.

**Fed targets ~2% inflation** as stable.`,
    },
    {
      code: '2.5',
      title: 'Real vs nominal GDP',
      content:
`**Nominal GDP** = current-year prices × current-year quantities. Mixes price and quantity changes.

**Real GDP** = base-year prices × current-year quantities. Holds prices constant; isolates quantity changes.

**Why distinction matters.** If nominal GDP grew 5% but inflation was 5%, real GDP grew 0% — no real growth.

**GDP deflator:**
GDP deflator = (Nominal GDP / Real GDP) × 100.

Measures average price level. Used to calculate inflation.

**Worked example.**
| Year | Nominal GDP | GDP Deflator | Real GDP |
|---|---|---|---|
| 1 | $1000 | 100 | $1000 |
| 2 | $1100 | 105 | $1047.6 |

Real growth = (1047.6 - 1000)/1000 = 4.76%.
Nominal growth = (1100 - 1000)/1000 = 10%.
Inflation = (105 - 100)/100 = 5%.
Real growth ≈ Nominal - Inflation. ✓

**Real GDP per capita** is the best single measure of standard of living over time. Adjusted for both inflation and population.

**US real GDP per capita** has risen ~2% annually for ~150 years. Massive accumulated growth.`,
    },
    {
      code: '2.6',
      title: 'Business cycles',
      content:
`Economies don\'t grow at constant rate — they cycle.

**Phases:**
- **Expansion**: GDP growing, unemployment falling, businesses investing.
- **Peak**: top of cycle.
- **Recession**: GDP falling, unemployment rising. Technically: 2 consecutive quarters of negative growth (NBER defines official).
- **Trough**: bottom of cycle.

**Recovery** then begins another expansion.

**Recession indicators:**
- Negative real GDP growth.
- Rising unemployment.
- Stock market declines.
- Inverted yield curve (short rates > long rates).
- Falling consumer confidence.

**Causes of business cycles:**
- Demand shocks (consumer panic, investment slowdown).
- Supply shocks (oil prices, COVID).
- Monetary policy errors.
- Asset bubbles bursting.
- Financial crises.

**Famous recessions/depressions:**
- **Great Depression (1929-1939)**: ~25% unemployment, banks failed.
- **1970s stagflation**: high unemployment + high inflation simultaneously.
- **Great Recession (2007-2009)**: housing/financial crisis.
- **COVID Recession (2020)**: sharp but short.

**Economic indicators**:
- **Leading**: predict future (stock market, consumer confidence, building permits).
- **Coincident**: occur with cycle (industrial production, employment).
- **Lagging**: confirm what already happened (CPI, unemployment rate).

**Government tools to manage cycles:**
- **Fiscal policy** (Congress + President): taxes and spending.
- **Monetary policy** (Federal Reserve): interest rates.`,
    },
  ],
  keyConcepts: [
    'GDP = C + I + G + (X-M).',
    'Real GDP adjusts for inflation; nominal doesn\'t.',
    'GDP per capita measures living standards.',
    'GDP excludes used goods, intermediate goods, transfers, household work.',
    'Unemployment = unemployed/labor force. Doesn\'t include discouraged workers.',
    'Types of unemployment: frictional, structural, cyclical, seasonal.',
    'Natural rate = frictional + structural. Full employment ≠ 0%.',
    'CPI measures inflation. ~2% target.',
    'Real interest rate = nominal - inflation.',
    'Business cycle: expansion, peak, recession, trough.',
  ],
  formulas: [
    {
      name: 'GDP (expenditure approach)',
      equation: 'GDP = C + I + G + (X - M)',
      meaning: 'Sum of consumption, investment, government, net exports.',
      example: 'US GDP ~$28 trillion in 2024. C ~70%, G ~17%, I ~17%, NX ~-4%.',
    },
    {
      name: 'Real vs nominal',
      equation: 'Real GDP = Nominal GDP / Price Index × 100',
      meaning: 'Strip out price changes to see real growth.',
      example: 'Nominal up 10%, inflation 5% → real up ~5%.',
    },
    {
      name: 'Unemployment rate',
      equation: 'U = Unemployed / Labor Force × 100',
      meaning: 'Labor force = employed + actively seeking. Discouraged workers not counted.',
      example: 'Labor force 165M; unemployed 6.5M → U = 3.9%.',
    },
  ],
  practice: [
    {
      q: 'GDP rose 6% nominally; inflation was 3%. What is real GDP growth?',
      a: 'Real GDP growth ≈ 6% - 3% = 3%.',
    },
    {
      q: 'A factory closed; workers can\'t find similar work. What kind of unemployment?',
      a: 'Structural unemployment (skills mismatch with available jobs).',
    },
  ],
  pitfalls: [
    '"GDP measures welfare" — wrong. Measures output only.',
    '"0% unemployment is the goal" — wrong. Always some frictional + structural. Full employment ≈ 4-5%.',
    '"Recession = depression" — recession (2 quarters negative GDP) is much milder than depression (catastrophic).',
    '"Inflation is always bad" — moderate inflation (2-3%) is healthy; deflation is more dangerous.',
  ],
};
