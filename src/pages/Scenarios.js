import React from 'react';
import { EducationalCard } from '../components/EducationalCard';

const styles = {
  title: { margin: 0, fontSize: 32, fontWeight: 700 },
  subtitle: { marginTop: 8, color: '#94a3b8', maxWidth: 760 },
  placeholder: { marginTop: 32, padding: 32, background: '#0f172a', border: '1px dashed #334155', borderRadius: 12, textAlign: 'center', color: '#94a3b8' },
};

function Scenarios() {
  return (
    <div>
      <h1 style={styles.title}>Reduction Scenarios & Forecasting</h1>
      <p style={styles.subtitle}>
        Counterfactual modeling (“what if heating oil drops 15%?”), trajectory forecasting toward a
        net-zero target year, weather-normalized analysis, and uncertainty ranking. Every scenario
        will expose its underlying calculation.
      </p>
      <div style={styles.placeholder}>
        Simulator UI lands in Phase 5. Backend will reuse the same emission factors and audit
        trail as the production dashboard.
      </div>

      <EducationalCard
        title={'What "what-if" modeling is, and why it has to be honest'}
        sections={[
          {
            heading: 'Counterfactual reasoning',
            body: 'A counterfactual asks "what would have happened instead?" When we credit the geothermal system for avoided fossil heat, we\'re comparing reality (electric heat pump) against a counterfactual world (oil boiler doing the same job). The avoided emissions are the difference. Every reduction scenario the dashboard models is built the same way.',
          },
          {
            heading: 'Why uncertainty matters more than the point estimate',
            body: [
              'Every input — gallons delivered, kWh consumed, EEIO factor — has some range of plausible values. A scenario whose ranking flips when those ranges are taken into account is not a safe basis for policy.',
              'The honest format is: "switching Building X from oil to a heat pump reduces emissions by 28 ± 6 tons/year, dominated by uncertainty in the COP under cold-climate operation." Every interval comes with the dominant source named.',
            ],
          },
          {
            heading: 'Forecasting and weather normalization',
            body: [
              'Heating-degree-days and cooling-degree-days quantify how hard a year was to heat or cool. A weather-normalized comparison answers "did we use less energy because we were efficient, or because the winter was mild?" — the answer is usually some of both.',
              'A net-zero trajectory model projects emissions forward under different assumptions about behavior, building stock, and grid mix. The point isn\'t to predict the future — it\'s to make explicit which assumptions matter most.',
            ],
            citation: 'STL decomposition for seasonal pattern separation; rolling z-score for anomaly detection.',
          },
        ]}
      />

    </div>
  );
}

export default Scenarios;
