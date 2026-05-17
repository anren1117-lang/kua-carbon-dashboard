// Pure scenario-modeling math for /scenarios. Takes the canonical
// baseline (Scope 1 + 2 + sinks) plus a set of slider inputs and
// returns a modified emissions estimate with the math exposed
// per-step (so the UI can show "you cut X mt from Y").
//
// Conventions:
// - All emissions in mtCO2e/year
// - Heating fuel reduction = % shifted from fuel to grid-electric
//   heat pumps (COP 3.0, mild because NH winters)
// - Solar = installed kW × NH-typical 1300 kWh/kW/yr capacity
//   factor → offset against grid emissions
// - Tree planting = acres × Birdsey closed-canopy 2.1 mt/acre/yr
//
// All factor sources match what the rest of the dashboard uses
// (Methodology page documents each one).

// NH heat pump assumptions
const HEAT_PUMP_COP = 3.0;  // conservative cold-climate average
const BTU_PER_KWH   = 3412;

// Solar capacity factor (NH, fixed-tilt)
const NH_SOLAR_KWH_PER_KW_YR = 1300;

// Forest sequestration (Birdsey 1992, closed-canopy)
const FOREST_SEQ_MT_PER_ACRE = 2.1;

// Heating fuel total MMBtu — placeholder derived from the heating
// portion of Scope 1 assuming average factor 80 kg/MMBtu (oil-ish).
// When we hook up real fuel-delivery records this gets replaced
// with a direct gallons-burned figure.
function heatingMmbtuFromScope1(scope1Mt) {
  // ~80% of Scope 1 is heating fuel at KUA (rest is refrigerants + fleet)
  const heatingMt = scope1Mt * 0.8;
  // ~80 kg/MMBtu (mix of #2 oil at 73 + propane at 64)
  const heatingMmbtu = (heatingMt * 1000) / 80;
  return heatingMmbtu;
}

/**
 * Run the scenario model.
 * @param {object} input
 * @param {number} input.scope1Mt baseline scope 1 mtCO2e/yr
 * @param {number} input.scope2Mt baseline scope 2 mtCO2e/yr
 * @param {number} input.sinksMt  baseline annual sinks mtCO2e/yr
 * @param {number} input.electricityReductionPct 0..50 (% reduction in scope 2)
 * @param {number} input.heatingElectrifyPct    0..100 (% of heating fuel converted to heat pumps)
 * @param {number} input.solarKw                 0..1000 (kW of installed PV)
 * @param {number} input.treePlantingAcres       0..100 (additional acres planted)
 * @param {number} input.gridKgPerKwh            grid emissions factor (default ISO-NE 0.235)
 */
export function runScenario({
  scope1Mt,
  scope2Mt,
  sinksMt,
  electricityReductionPct = 0,
  heatingElectrifyPct     = 0,
  solarKw                 = 0,
  treePlantingAcres       = 0,
  gridKgPerKwh            = 0.235,
}) {
  const steps = [];

  // 1. Electricity reduction → directly cuts Scope 2
  const electricityCut = scope2Mt * (electricityReductionPct / 100);
  const scope2AfterReduction = scope2Mt - electricityCut;
  if (electricityCut > 0) {
    steps.push({
      label: `Cut electricity by ${electricityReductionPct.toFixed(0)}%`,
      deltaMt: -electricityCut,
      note: `${electricityReductionPct.toFixed(0)}% of ${scope2Mt.toFixed(0)} mt Scope 2 = ${electricityCut.toFixed(1)} mt avoided`,
    });
  }

  // 2. Heating electrification → shift heating fuel BTUs to heat-pump kWh
  const heatingMmbtu  = heatingMmbtuFromScope1(scope1Mt);
  const heatingMt     = scope1Mt * 0.8; // matches the helper above
  const switchedMmbtu = heatingMmbtu * (heatingElectrifyPct / 100);
  const switchedKwhInput  = (switchedMmbtu * 1_000_000) / BTU_PER_KWH;
  const switchedKwhOutput = switchedKwhInput / HEAT_PUMP_COP; // COP advantage
  const scope1Saved = heatingMt * (heatingElectrifyPct / 100);
  const scope2Added = (switchedKwhOutput * gridKgPerKwh) / 1000;
  const scope1AfterElectrification = scope1Mt - scope1Saved;
  const scope2AfterElectrification = scope2AfterReduction + scope2Added;
  if (heatingElectrifyPct > 0) {
    steps.push({
      label: `Electrify ${heatingElectrifyPct.toFixed(0)}% of heating fuel (heat pump COP ${HEAT_PUMP_COP})`,
      deltaMt: -(scope1Saved - scope2Added),
      note: `Scope 1 falls ${scope1Saved.toFixed(1)} mt; Scope 2 rises ${scope2Added.toFixed(1)} mt (${Math.round(switchedKwhOutput).toLocaleString()} kWh new electric load)`,
    });
  }

  // 3. Solar offset → installed kW × 1300 kWh/kW/yr × grid factor
  const solarKwh   = solarKw * NH_SOLAR_KWH_PER_KW_YR;
  const solarOffsetMt = (solarKwh * gridKgPerKwh) / 1000;
  const scope2AfterSolar = scope2AfterElectrification - solarOffsetMt;
  if (solarKw > 0) {
    steps.push({
      label: `Install ${solarKw} kW of solar PV`,
      deltaMt: -solarOffsetMt,
      note: `${solarKw} kW × ${NH_SOLAR_KWH_PER_KW_YR} kWh/kW/yr (NH typical) = ${Math.round(solarKwh).toLocaleString()} kWh offset → ${solarOffsetMt.toFixed(1)} mt`,
    });
  }

  // 4. Tree planting → increases sinks
  const newSequestration = treePlantingAcres * FOREST_SEQ_MT_PER_ACRE;
  const sinksAfter = sinksMt + newSequestration;
  if (treePlantingAcres > 0) {
    steps.push({
      label: `Plant ${treePlantingAcres} acres of forest`,
      deltaMt: -newSequestration,
      note: `${treePlantingAcres} acres × ${FOREST_SEQ_MT_PER_ACRE} mt/acre/yr (Birdsey 1992 closed-canopy) = ${newSequestration.toFixed(1)} mt`,
    });
  }

  const baselineGross = scope1Mt + scope2Mt;
  const baselineNet   = baselineGross - sinksMt;
  const modifiedGross = scope1AfterElectrification + scope2AfterSolar;
  const modifiedNet   = modifiedGross - sinksAfter;

  return {
    baseline: {
      scope1Mt: scope1Mt,
      scope2Mt: scope2Mt,
      sinksMt:  sinksMt,
      grossMt:  baselineGross,
      netMt:    baselineNet,
    },
    modified: {
      scope1Mt: scope1AfterElectrification,
      scope2Mt: scope2AfterSolar,
      sinksMt:  sinksAfter,
      grossMt:  modifiedGross,
      netMt:    modifiedNet,
    },
    deltaMt:    modifiedNet - baselineNet,    // negative = improvement
    deltaPct:   baselineNet === 0 ? 0 : ((modifiedNet - baselineNet) / baselineNet) * 100,
    steps,
  };
}
