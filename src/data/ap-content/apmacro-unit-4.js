// AP Macro Unit 4 — Financial Sector (17-27%)

export const APMACRO_UNIT_4 = {
  number: 4,
  title: 'Financial Sector',
  weight: '17-27%',
  subunits: [
    {
      code: '4.1',
      title: 'Financial assets',
      content:
`**Financial assets** are claims on real assets or future income.

**Types:**
- **Money**: most liquid. Currency, deposits.
- **Stocks**: ownership in companies.
- **Bonds**: loans to companies or governments.
- **Mutual funds, ETFs**: pooled investments.
- **Derivatives**: options, futures (advanced).

**Liquidity.** How easily an asset converts to cash without loss. Money = most liquid; real estate = less liquid.

**Risk-return trade-off.**
- T-bonds (US gov): low risk, low return.
- Corporate bonds: higher risk, higher return.
- Stocks: higher risk, higher return.
- Speculative investments (crypto, options): high risk, potentially high return.

**Diversification** reduces risk by spreading across investments. "Don\'t put all eggs in one basket."

**Time value of money.** $1 today > $1 tomorrow (because of interest + inflation + risk).

**Present value.** PV = FV / (1+r)^n. What\'s a future $ worth today?

**Compound interest.** Interest on interest. Powerful over time.
- Rule of 72: years to double = 72 / rate.`,
    },
    {
      code: '4.2',
      title: 'Nominal vs real interest rate',
      content:
`**Nominal interest rate.** Stated rate (e.g., 6% bank account).

**Real interest rate.** Adjusted for inflation. Real = Nominal - Inflation.

**Example.** 6% nominal interest, 4% inflation → 2% real return. Your purchasing power grew only 2%.

**If inflation > nominal rate.** Real interest negative. You\'re losing buying power.

**Expected vs actual inflation.**
- Borrowers and lenders agree on nominal rate based on EXPECTED inflation.
- If actual inflation higher than expected: borrower benefits (debt easier to repay).
- If lower than expected: lender benefits.

**Fisher equation:** (1 + nominal) = (1 + real)(1 + inflation).

For low rates: nominal ≈ real + inflation (close enough for AP).

**Why real rates matter.** Investors care about purchasing power, not just nominal dollars.`,
    },
    {
      code: '4.3',
      title: 'Bonds and money markets',
      content:
`**Bonds.** IOUs from issuer to bondholder.
- **Face value**: amount repaid at maturity.
- **Coupon rate**: annual interest paid.
- **Maturity**: when face value is repaid.

**Bond prices and interest rates move inversely.**
- Interest rates rise → existing bonds (with lower coupons) worth less.
- Interest rates fall → existing bonds worth more.

**Yield to maturity.** Annual return if held to maturity.

**Types of bonds:**
- **Treasury** (US gov): safest.
- **Municipal** (state/local): tax-advantaged.
- **Corporate**: riskier; higher yield.
- **Junk** (high-yield): high risk.

**Yield curve.** Plot of yields vs maturity dates.
- **Normal**: upward sloping (long-term > short-term). Healthy.
- **Inverted**: short > long. Often signals recession.
- **Flat**: similar; transitional.

**Money market.** Market for short-term (< 1 year) debt. T-bills, commercial paper.`,
    },
    {
      code: '4.4',
      title: 'Banks and the money supply',
      content:
`**Fractional reserve banking.** Banks hold only fraction of deposits as reserves; lend out the rest.

**Reserve requirement** (rr). % of deposits banks must hold (set by Fed).

**Money multiplier** = 1 / rr.

**Example.** rr = 10%. Initial $1000 deposit:
- Bank A: keeps $100, lends $900.
- Person who borrows spends it; recipient deposits $900 in Bank B.
- Bank B: keeps $90, lends $810.
- Process continues.
- Total money created = $1000 / 0.10 = $10,000.

**T-account.** Banks\' simplified balance sheet:
| Assets | Liabilities |
|---|---|
| Reserves, Loans, Securities | Deposits |

**Bank panic/run.** Many depositors withdraw at once. Bank can\'t pay all (not enough reserves). Caused 1930s Depression cascades.

**FDIC** (since 1933) insures deposits up to $250k → reduces bank runs.

**How Fed creates money:**
- Buy bonds: pays with newly created money → bank reserves rise → more lending → money multiplier.
- Sell bonds: opposite.

**Money supply changes affect:**
- Interest rates (more money → lower rates).
- Investment, consumption.
- Inflation (eventually, if too much money).`,
    },
    {
      code: '4.5',
      title: 'Federal Reserve and monetary policy',
      content:
`**Federal Reserve System.** Central bank of the US. Created 1913.

**Dual mandate:**
1. Price stability (~2% inflation target).
2. Maximum employment.

**Structure:**
- Board of Governors (7 members, 14-year terms).
- 12 regional Fed banks.
- Federal Open Market Committee (FOMC) makes interest rate decisions.

**Tools:**

**(1) Open market operations** (primary tool).
- FOMC sets target for federal funds rate.
- Buys/sells Treasuries to push fed funds rate to target.
- Buy = expansionary (lower rates). Sell = contractionary.

**(2) Discount rate.** Rate Fed charges banks for short-term loans. Above fed funds rate.

**(3) Reserve requirements.** Rarely changed.

**(4) Interest on reserves (IOR).** Pays banks interest on reserves held at Fed. Major post-2008.

**(5) Quantitative easing (QE).** Large-scale asset purchases (beyond just Treasuries — MBS, etc.). Used in financial crisis and COVID.

**(6) Forward guidance.** Public statements about future policy direction.

**Recent history:**
- **2008-2015**: rates at zero; QE.
- **2015-2019**: gradual rate hikes.
- **2020**: COVID → back to zero, massive QE.
- **2022-2023**: aggressive rate hikes to fight inflation (5%+ from 0%).
- **2024**: pause, then begin cuts.

**Independence.** Fed independent from political pressure. President nominates Chair; Senate confirms. But chair makes decisions without political interference.`,
    },
  ],
  keyConcepts: [
    'Liquidity, risk-return tradeoff, diversification.',
    'Real interest rate = nominal - inflation.',
    'Bond prices inverse to interest rates.',
    'Inverted yield curve often predicts recession.',
    'Fractional reserve banking; money multiplier = 1/rr.',
    'Fed dual mandate: price stability + maximum employment.',
    'Open market operations: primary Fed tool.',
    'QE: large-scale asset purchases.',
    'Fed independence from political pressure.',
  ],
  formulas: [
    {
      name: 'Real interest rate',
      equation: 'Real r = Nominal r - Inflation',
      meaning: 'Purchasing power growth.',
      example: '5% nominal, 3% inflation → 2% real.',
    },
    {
      name: 'Money multiplier',
      equation: 'm = 1 / reserve requirement',
      meaning: 'Initial reserves × m = total money creation potential.',
      example: 'rr = 10%, m = 10. $1000 deposit → up to $10,000 in money supply.',
    },
    {
      name: 'Rule of 72',
      equation: 'Years to double = 72 / interest rate',
      meaning: 'Quick mental math for compound growth.',
      example: '6% rate → doubles in 12 years. 3% → 24 years.',
    },
  ],
  practice: [
    {
      q: 'Reserve requirement is 20%. Initial deposit $5000. Max money supply increase?',
      a: 'Multiplier = 1/0.20 = 5. Max ΔMS = 5 × $5000 = $25,000.',
    },
    {
      q: 'If Fed buys Treasury bonds, what happens to money supply, interest rates, and AD?',
      a: 'Fed buys → pays for them with reserves → MS rises → interest rates fall → C, I rise → AD shifts right. (Expansionary.)',
    },
  ],
  pitfalls: [
    '"Banks lend out customer deposits 100%" — fractional only. Hold reserves.',
    '"Interest rates and bond prices move together" — opposite. Inverse relationship.',
    '"Fed prints money directly" — buys bonds, credits bank reserves (not literal printing).',
  ],
};
