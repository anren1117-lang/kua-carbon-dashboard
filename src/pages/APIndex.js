import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection } from '../components/ModuleShell.js';
import { PasswordGate } from '../components/PasswordGate.js';
import { AP_CONTENT_ROUTES } from './Teacher.js';

// One row per shipped AP. Sorted into broad categories so the index is
// scannable; categories follow how teachers usually group APs in a
// course catalog (sciences first, math/CS, social studies, English,
// arts, languages). Each entry is canonical only — aliases are still
// handled by AP_CONTENT_ROUTES for the Teacher card chain.
const AP_CATALOG = [
  {
    group: 'Sciences',
    courses: [
      { id: 'AP Environmental Science', short: 'APES', units: 9, blurb: 'Earth systems, populations, energy, pollution, climate.' },
      { id: 'AP Biology', short: 'AP Bio', units: 8, blurb: 'Cells, genetics, evolution, ecology, regulation.' },
      { id: 'AP Chemistry', short: 'AP Chem', units: 9, blurb: 'Atomic structure, bonding, kinetics, thermodynamics, equilibrium.' },
      { id: 'AP Physics 1', short: 'AP Phys 1', units: 8, blurb: 'Kinematics, forces, energy, momentum, rotation, waves, electricity.' },
      { id: 'AP Physics 2', short: 'AP Phys 2', units: 7, blurb: 'Fluids, thermo, E&M, circuits, optics, quantum/nuclear.' },
      { id: 'AP Physics C: Mechanics', short: 'AP Phys C Mech', units: 7, blurb: 'Calc-based mechanics: kinematics, Newton, energy, momentum, rotation, SHM, gravitation.' },
      { id: 'AP Physics C: Electricity and Magnetism', short: 'AP Phys C E&M', units: 5, blurb: 'Calc-based: Gauss, capacitors, circuits, Ampère, Faraday, Maxwell.' },
    ],
  },
  {
    group: 'Math & Computing',
    courses: [
      { id: 'AP Precalculus', short: 'AP Precalc', units: 4, blurb: 'Polynomial, rational, exp/log, trig, polar, vectors, matrices.' },
      { id: 'AP Calculus AB', short: 'AP Calc AB', units: 8, blurb: 'Limits, derivatives, integrals, fundamental theorem.' },
      { id: 'AP Calculus BC', short: 'AP Calc BC', units: 10, blurb: 'AB plus series, parametric/polar, advanced integration.' },
      { id: 'AP Statistics', short: 'AP Stats', units: 9, blurb: 'Data, probability, sampling, inference.' },
      { id: 'AP Computer Science Principles', short: 'AP CSP', units: 5, blurb: 'Data, algorithms, internet, impact of computing.' },
      { id: 'AP Computer Science A', short: 'AP CSA', units: 10, blurb: 'Java programming: types, control flow, classes, arrays, inheritance, recursion.' },
    ],
  },
  {
    group: 'Social Studies',
    courses: [
      { id: 'AP US Government and Politics', short: 'AP Gov', units: 5, blurb: 'Constitution, branches, civil liberties, political behavior, policy.' },
      { id: 'AP Comparative Government and Politics', short: 'AP Comp Gov', units: 5, blurb: 'UK, Mexico, Nigeria, Russia, China, Iran.' },
      { id: 'AP United States History', short: 'APUSH', units: 9, blurb: '1491 through present — nine periods.' },
      { id: 'AP World History', short: 'AP World', units: 9, blurb: '1200 CE through present — Modern.' },
      { id: 'AP European History', short: 'AP Euro', units: 9, blurb: 'Renaissance through contemporary Europe.' },
      { id: 'AP Human Geography', short: 'AP HuG', units: 7, blurb: 'Population, culture, agriculture, cities, development.' },
      { id: 'AP Psychology', short: 'AP Psych', units: 9, blurb: 'Biological bases, cognition, development, social, disorders.' },
      { id: 'AP Macroeconomics', short: 'AP Macro', units: 6, blurb: 'GDP, inflation, fiscal/monetary policy, growth.' },
      { id: 'AP Microeconomics', short: 'AP Micro', units: 6, blurb: 'Supply/demand, production, market structures, externalities.' },
      { id: 'AP African American Studies', short: 'AP AfAm', units: 4, blurb: 'Origins of African diaspora, freedom struggles, Jim Crow, civil rights, contemporary.' },
    ],
  },
  {
    group: 'English & Arts',
    courses: [
      { id: 'AP English Language and Composition', short: 'AP Lang', units: 9, blurb: 'Rhetoric, argument, style, synthesis.' },
      { id: 'AP English Literature and Composition', short: 'AP Lit', units: 9, blurb: 'Short fiction, poetry, longer fiction & drama — scaffolded.' },
      { id: 'AP Art History', short: 'AP Art', units: 10, blurb: 'Global art from prehistory to contemporary.' },
      { id: 'AP Music Theory', short: 'AP Music', units: 8, blurb: 'Pitch, rhythm, harmony, voice leading, form.' },
    ],
  },
  {
    group: 'World Languages',
    courses: [
      { id: 'AP Spanish Language and Culture', short: 'AP Spanish', units: 6, blurb: 'Six thematic units in Spanish — identities, life, beauty, science, challenges, family.' },
      { id: 'AP French Language and Culture', short: 'AP French', units: 6, blurb: 'Six themes en français — défis, science, vie, soi, communauté, esthétique.' },
      { id: 'AP Latin', short: 'AP Latin', units: 8, blurb: 'Vergil\'s Aeneid + Caesar\'s De Bello Gallico, grammar, scansion.' },
      { id: 'AP Italian Language and Culture', short: 'AP Italian', units: 6, blurb: 'Sei temi in italiano — famiglia, vita, identità, estetica, scienza, sfide.' },
      { id: 'AP German Language and Culture', short: 'AP German', units: 6, blurb: 'Sechs Themen auf Deutsch — Familie, Identität, Ästhetik, Wissenschaft, globale Herausforderungen, Leben.' },
    ],
  },
  {
    group: 'Capstone',
    courses: [
      { id: 'AP Seminar', short: 'AP Seminar', units: 5, blurb: 'Inquiry, research, multiple perspectives, synthesis, collaboration (QUEST).' },
      { id: 'AP Research', short: 'AP Research', units: 5, blurb: 'Year-long independent research project, 4-5K word paper + defense.' },
    ],
  },
];

export default function APIndex() {
  return (
    <PasswordGate
      title="AP Content Library"
      subtitle="Direct links to read-to-learn content for every AP course in the dashboard."
      envKey="TEACHER_PASSWORD"
      storageKey="kua_teacher_unlocked"
      defaultPassword="kua-teach"
      accent="#22c55e"
    >
      <APIndexContent />
    </PasswordGate>
  );
}

function APIndexContent() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AP_CATALOG;
    return AP_CATALOG
      .map((g) => ({
        ...g,
        courses: g.courses.filter(
          (c) =>
            c.id.toLowerCase().includes(q) ||
            c.short.toLowerCase().includes(q) ||
            c.blurb.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.courses.length > 0);
  }, [query]);

  const totalCount = AP_CATALOG.reduce((s, g) => s + g.courses.length, 0);

  return (
    <ModulePage
      eyebrow="Teacher Portal"
      title="AP Content Library"
      lede={`Read-to-learn content for ${totalCount} AP courses. Each course includes unit-by-unit teaching, figures, and per-unit printable worksheets.`}
    >
      <ModuleSection>
        <div style={styles.toolbar}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Filter courses (try "calc", "history", "language")'
            style={styles.searchInput}
            aria-label="Filter AP courses"
          />
          <Link to="/teacher" style={styles.backLink}>← Full Teacher Portal</Link>
        </div>
      </ModuleSection>

      {filtered.map((group) => (
        <ModuleSection key={group.group} title={group.group}>
          <div style={styles.grid}>
            {group.courses.map((c) => {
              const route = AP_CONTENT_ROUTES[c.id];
              if (!route) return null;
              return (
                <Link key={c.id} to={route} style={styles.card}>
                  <div style={styles.cardHead}>
                    <span style={styles.cardShort}>{c.short}</span>
                    <span style={styles.cardUnits}>{c.units} units</span>
                  </div>
                  <div style={styles.cardTitle}>{c.id}</div>
                  <div style={styles.cardBlurb}>{c.blurb}</div>
                  <div style={styles.cardCta}>Read content →</div>
                </Link>
              );
            })}
          </div>
        </ModuleSection>
      ))}

      {filtered.length === 0 && (
        <ModuleSection>
          <div style={styles.empty}>No courses match "{query}". Try a shorter query.</div>
        </ModuleSection>
      )}
    </ModulePage>
  );
}

const styles = {
  toolbar: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: 240,
    padding: '10px 14px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 8,
    color: '#e5e7eb',
    fontSize: 14,
  },
  backLink: {
    color: '#94a3b8',
    fontSize: 13,
    textDecoration: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 12,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 14,
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 10,
    color: '#e5e7eb',
    textDecoration: 'none',
    transition: 'border-color 120ms ease, transform 120ms ease',
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  cardShort: {
    fontSize: 13,
    fontWeight: 700,
    color: '#22c55e',
    letterSpacing: 0.3,
  },
  cardUnits: {
    fontSize: 11,
    color: '#94a3b8',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e5e7eb',
    lineHeight: 1.3,
  },
  cardBlurb: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 1.4,
    marginTop: 2,
  },
  cardCta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#22c55e',
  },
  empty: {
    padding: 24,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 13,
  },
};
