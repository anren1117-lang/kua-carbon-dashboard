import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ModulePage, ModuleSection, MetricGrid, Pill } from '../components/ModuleShell.js';
import { PasswordGate } from '../components/PasswordGate.js';
import { knowledgeArticles } from '../data/learningContent.js';
import { reductionActions } from '../data/reductionActions.js';
import {
  lessonLibrary,
  DEPARTMENTS,
  FORMATS,
  DURATION_BUCKETS,
  bucketDuration,
  matchesQuery,
} from '../data/lessonLibrary.js';
import { apUnitMap, countByFit, totalCoveredUnits } from '../data/apUnitMap.js';
import {
  teachingResources,
  SUBJECTS,
  RESOURCE_FORMATS,
  resourceMatches,
  countByFormat as resCountByFormat,
  countBySubject as resCountBySubject,
} from '../data/teachingResources.js';

// Teacher Portal — searchable lesson library + class progress + KUA-
// specific discussion prompts. The library replaces the previous
// 4-module hard-coded list (Phase 366 → Phase 367). All lesson
// content lives in src/data/lessonLibrary.js so adding a new lesson
// is a data edit, not a UI change.

export default function Teacher() {
  return (
    <PasswordGate
      title="Teacher Portal — Lesson Library"
      subtitle="Searchable, filterable library of lesson plans, problem sets, projects, and discussion prompts keyed to verified KUA courses."
      envKey="TEACHER_PASSWORD"
      storageKey="kua_teacher_unlocked"
      defaultPassword="kua-teach"
      accent="#22c55e"
    >
      <TeacherContent />
    </PasswordGate>
  );
}

function TeacherContent() {
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  // Class progress — live rollup from the chatbot quiz endpoint, with
  // a static fallback when no attempts have been logged yet.
  const [liveRollup, setLiveRollup] = useState(null);
  const [liveError, setLiveError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/quiz/attempts?rollup=class')
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then((j) => { if (!cancelled) setLiveRollup(j.classes || []); })
      .catch((err) => { if (!cancelled) setLiveError(err.message); });
    return () => { cancelled = true; };
  }, []);

  const articleById = useMemo(
    () => Object.fromEntries(knowledgeArticles.map((a) => [a.id, a])),
    [],
  );

  // Apply all filters. Each filter is independent; a lesson must
  // satisfy every active filter to appear.
  const filtered = useMemo(() => {
    return lessonLibrary.filter((l) => {
      if (deptFilter !== 'all' && l.department !== deptFilter) return false;
      if (formatFilter !== 'all' && l.format !== formatFilter) return false;
      if (durationFilter !== 'all') {
        const b = bucketDuration(l.durationMin);
        if (!b || b.id !== durationFilter) return false;
      }
      if (!matchesQuery(l, query)) return false;
      return true;
    });
  }, [query, deptFilter, formatFilter, durationFilter]);

  // Per-format counts for the format chips ("Lesson plan (4)").
  const formatCounts = useMemo(() => {
    const counts = { all: lessonLibrary.length };
    for (const f of FORMATS) counts[f] = 0;
    for (const l of lessonLibrary) counts[l.format] = (counts[l.format] || 0) + 1;
    return counts;
  }, []);

  // Per-department counts for the department <select>.
  const deptCounts = useMemo(() => {
    const counts = {};
    for (const d of DEPARTMENTS) counts[d] = 0;
    for (const l of lessonLibrary) counts[l.department] = (counts[l.department] || 0) + 1;
    return counts;
  }, []);

  const topActions = reductionActions.slice(0, 4);

  return (
    <ModulePage
      title="Teacher Portal — Lesson Library"
      subtitle="Browse, filter, and assign lesson plans keyed to verified KUA courses. Every lesson lists the dashboard pages it uses, what students will do, and the time it takes."
    >
      <div style={styles.guideCallout}>
        <strong style={{ color: '#22d3ee' }}>New to the dashboard?</strong>{' '}
        The full course-by-course guide is at{' '}
        <a href="https://github.com/anren1117-lang/kua-carbon-dashboard/blob/main/docs/classroom-mapping.md" target="_blank" rel="noopener noreferrer" style={styles.guideLink}>
          docs/classroom-mapping.md
        </a>{' '}
        — every KUA department mapped to dashboard pages with classroom hooks.
        This library is the in-app version of that mapping; use whichever you prefer.
      </div>

      <MetricGrid metrics={[
        { label: 'Lessons in library',  value: lessonLibrary.length,                accent: '#22d3ee' },
        { label: 'KUA courses tagged',  value: new Set(lessonLibrary.flatMap((l) => l.courses)).size, accent: '#fbbf24' },
        { label: 'AP unit-map courses', value: apUnitMap.length,                    accent: '#86efac' },
        { label: 'AP units mapped',     value: totalCoveredUnits(),                 accent: '#ef4444' },
      ]} />

      <ModuleSection
        title="Find a lesson"
        hint="Filter by department, format, and duration; search by title, course, or keyword."
      >
        <div style={styles.filterBar}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, course, or keyword…"
            style={styles.searchInput}
            aria-label="Search lessons"
          />

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={styles.select}
            aria-label="Filter by department"
          >
            <option value="all">All departments ({lessonLibrary.length})</option>
            {DEPARTMENTS.filter((d) => deptCounts[d] > 0).map((d) => (
              <option key={d} value={d}>{d} ({deptCounts[d]})</option>
            ))}
          </select>

          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            style={styles.select}
            aria-label="Filter by duration"
          >
            <option value="all">Any duration</option>
            {DURATION_BUCKETS.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.chipRow}>
          <button
            type="button"
            onClick={() => setFormatFilter('all')}
            style={chipStyle(formatFilter === 'all')}
          >
            All formats ({formatCounts.all})
          </button>
          {FORMATS.filter((f) => formatCounts[f] > 0).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormatFilter(f)}
              style={chipStyle(formatFilter === f)}
            >
              {f} ({formatCounts[f]})
            </button>
          ))}
        </div>

        <div style={styles.resultsMeta}>
          Showing <strong style={{ color: '#e5e7eb' }}>{filtered.length}</strong> of{' '}
          {lessonLibrary.length} lessons
          {(query || deptFilter !== 'all' || formatFilter !== 'all' || durationFilter !== 'all') && (
            <button
              type="button"
              onClick={() => { setQuery(''); setDeptFilter('all'); setFormatFilter('all'); setDurationFilter('all'); }}
              style={styles.clearFiltersBtn}
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            No lessons match those filters. Try{' '}
            <button
              type="button"
              onClick={() => { setQuery(''); setDeptFilter('all'); setFormatFilter('all'); setDurationFilter('all'); }}
              style={styles.emptyResetBtn}
            >
              clearing the filters
            </button>{' '}
            or{' '}
            <a
              href="https://github.com/anren1117-lang/kua-carbon-dashboard/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.emptyLink}
            >
              request a lesson
            </a>.
          </div>
        ) : (
          <div style={styles.lessonGrid}>
            {filtered.map((l) => {
              const isOpen = expanded === l.id;
              return (
                <div key={l.id} style={styles.lessonCard}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : l.id)}
                    aria-expanded={isOpen}
                    aria-controls={`lesson-${l.id}`}
                    style={styles.lessonHeadBtn}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={styles.lessonTitle}>{l.title}</div>
                      <div style={styles.lessonMeta}>
                        <Pill kind="info">{l.format}</Pill>
                        <Pill kind="ok">{l.durationMin} min</Pill>
                        <Pill kind="muted">Gr {l.gradeBand}</Pill>
                        <span style={styles.lessonDept}>{l.department}</span>
                      </div>
                    </div>
                    <span style={{ ...styles.arrow, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ▶
                    </span>
                  </button>

                  {isOpen && (
                    <div id={`lesson-${l.id}`} style={styles.lessonBody}>
                      <p style={styles.lessonSummary}>{l.summary}</p>

                      <div style={styles.lessonLabel}>Fits these KUA courses</div>
                      <div style={styles.courseRow}>
                        {l.courses.map((c) => (
                          <span key={c} style={styles.courseChip}>{c}</span>
                        ))}
                      </div>

                      <div style={styles.lessonLabel}>Dashboard pages used</div>
                      <div style={styles.pageRow}>
                        {l.dashboardPages.map((p) => (
                          <Link key={p} to={p} style={styles.pageLink}>
                            {p}
                          </Link>
                        ))}
                      </div>

                      <div style={styles.lessonLabel}>Learning goals</div>
                      <ul style={styles.lessonList}>
                        {l.learningGoals.map((g, i) => <li key={i}>{g}</li>)}
                      </ul>

                      <div style={styles.lessonLabel}>Student task</div>
                      <div style={styles.lessonActivity}>{l.studentTask}</div>

                      {l.teacherPrep && (
                        <>
                          <div style={styles.lessonLabel}>Teacher prep</div>
                          <div style={styles.prepNote}>{l.teacherPrep}</div>
                        </>
                      )}

                      {l.keyArticles && l.keyArticles.length > 0 && (
                        <>
                          <div style={styles.lessonLabel}>Reading</div>
                          <ul style={styles.lessonList}>
                            {l.keyArticles.map((id) => articleById[id] && (
                              <li key={id}>{articleById[id].title}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ModuleSection>

      <ApUnitMapSection lessonById={Object.fromEntries(lessonLibrary.map((l) => [l.id, l]))} />

      <TeachingResourcesSection />

      <ModuleSection
        title={liveRollup && liveRollup.length > 0 ? 'Class learning progress (live)' : 'Class learning progress'}
        hint={
          liveRollup && liveRollup.length > 0
            ? 'Live rollup of chatbot quiz attempts grouped by class assignment.'
            : liveError
              ? `Live rollup unavailable (${liveError}). Sample data shown below.`
              : 'No live attempts logged yet. Students taking quizzes in /chatbot will populate this. Sample data shown below.'
        }
      >
        {liveRollup && liveRollup.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Class</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Attempts</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Correct</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Accuracy</th>
                <th style={styles.th}>Topics covered</th>
              </tr>
            </thead>
            <tbody>
              {liveRollup.map((c) => {
                const pct = Math.round(c.accuracy * 100);
                return (
                  <tr key={c.classId}>
                    <td style={styles.td}>{c.classId}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.total}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.correct}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: pct >= 80 ? '#86efac' : pct >= 70 ? '#fbbf24' : '#fca5a5' }}>{pct}%</td>
                    <td style={{ ...styles.td, color: '#94a3b8' }}>{c.topics.join(', ')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Class</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Students</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Completed</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Avg score</th>
                <th style={styles.th}>Most recent topic</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_CLASS_ROWS.map((c) => (
                <tr key={c.class}>
                  <td style={styles.td}>{c.class}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.students}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{c.completed}/{c.students}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: c.avgScore >= 80 ? '#86efac' : c.avgScore >= 70 ? '#fbbf24' : '#fca5a5' }}>{c.avgScore}%</td>
                  <td style={{ ...styles.td, color: '#94a3b8' }}>{c.lastTopic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ModuleSection>

      <ModuleSection
        title="Discussion prompts from KUA's reduction queue"
        hint="Generated from the current reduction-action list. Drop into a slide deck or use as a 5-minute opener."
      >
        <div style={styles.promptGrid}>
          {topActions.map((a) => (
            <div key={a.id} style={styles.promptCard}>
              <div style={styles.promptLabel}>Prompt</div>
              <div style={styles.promptText}>
                "KUA's sustainability team is considering: <strong>{a.title.toLowerCase()}</strong>.
                It would save about <strong>{a.expectedReductionMtCO2e} mtCO₂e/year</strong>.
                Should we do it? Who pays? What could go wrong?"
              </div>
              <div style={styles.promptMeta}>{a.category} · {a.difficulty} difficulty · {a.urgency} urgency</div>
            </div>
          ))}
        </div>
      </ModuleSection>
    </ModulePage>
  );
}

// Per-CED-unit dashboard hooks for the highest-fit APs. Each AP
// course renders as a collapsible card; expanded view shows every
// CED unit with a fit pill + suggested 5-min hook + linked lessons.
function ApUnitMapSection({ lessonById }) {
  const [expandedCourse, setExpandedCourse] = useState(null);

  return (
    <ModuleSection
      title="AP unit-by-unit map"
      hint="For the highest-fit AP courses, every CED unit is tagged with a fit rating (direct / tangential / none) plus a 5-minute classroom hook where one exists. Units with fit='none' are honest gaps — skip those on the dashboard."
    >
      <div style={styles.apCourseGrid}>
        {apUnitMap.map((course) => {
          const isOpen = expandedCourse === course.courseId;
          const fitCounts = countByFit(course);
          return (
            <div key={course.courseId} style={styles.apCourseCard}>
              <button
                type="button"
                onClick={() => setExpandedCourse(isOpen ? null : course.courseId)}
                aria-expanded={isOpen}
                style={styles.apCourseHeadBtn}
              >
                <div style={{ flex: 1 }}>
                  <div style={styles.apCourseTitle}>{course.courseId}</div>
                  <div style={styles.apCourseMeta}>
                    <span style={apFitPillStyle('direct')}>{fitCounts.direct} direct</span>
                    <span style={apFitPillStyle('tangential')}>{fitCounts.tangential} tangential</span>
                    <span style={apFitPillStyle('none')}>{fitCounts.none} no fit</span>
                    <span style={styles.apCedYear}>CED {course.cedYear}</span>
                  </div>
                </div>
                <span style={{ ...styles.arrow, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  ▶
                </span>
              </button>

              {isOpen && (
                <div style={styles.apCourseBody}>
                  <div style={styles.apOverallFit}>{course.overallFit}</div>
                  <div style={styles.apUnitList}>
                    {course.units.map((u) => (
                      <div key={u.num} style={styles.apUnitRow}>
                        <div style={styles.apUnitHeader}>
                          <span style={styles.apUnitNum}>Unit {u.num}</span>
                          <span style={styles.apUnitName}>{u.name}</span>
                          <span style={apFitPillStyle(u.fit)}>{u.fit}</span>
                        </div>
                        {u.hook && <div style={styles.apUnitHook}>{u.hook}</div>}
                        {u.note && <div style={styles.apUnitNote}>⚠ {u.note}</div>}
                        {u.dashboardPages.length > 0 && (
                          <div style={styles.apUnitPages}>
                            {u.dashboardPages.map((p) => (
                              <Link key={p} to={p} style={styles.pageLink}>{p}</Link>
                            ))}
                          </div>
                        )}
                        {u.linkedLessonIds.length > 0 && (
                          <div style={styles.apUnitLessons}>
                            <span style={styles.apUnitLessonsLabel}>Full lessons:</span>
                            {u.linkedLessonIds.map((id) => {
                              const l = lessonById[id];
                              if (!l) return null;
                              return <span key={id} style={styles.apUnitLessonChip}>{l.title}</span>;
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ModuleSection>
  );
}

function apFitPillStyle(fit) {
  const colors = {
    direct:     { bg: 'rgba(34, 197, 94, 0.12)',   fg: '#22c55e', border: 'rgba(34, 197, 94, 0.4)' },
    tangential: { bg: 'rgba(251, 191, 36, 0.12)',  fg: '#fbbf24', border: 'rgba(251, 191, 36, 0.4)' },
    none:       { bg: 'rgba(100, 116, 139, 0.12)', fg: '#94a3b8', border: 'rgba(100, 116, 139, 0.4)' },
  };
  const c = colors[fit] || colors.none;
  return {
    padding: '2px 8px',
    background: c.bg,
    border: `1px solid ${c.border}`,
    borderRadius: 999,
    fontSize: 11,
    color: c.fg,
    fontWeight: 600,
    textTransform: 'lowercase',
  };
}

// General teaching resources — content with no required dashboard
// tie. Worked examples, practice problems, rubrics, writing templates
// for any KUA AP teacher's week-to-week needs. Filterable like the
// carbon-tied library above.
function TeachingResourcesSection() {
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return teachingResources.filter((r) => {
      if (subjectFilter !== 'all' && r.subject !== subjectFilter) return false;
      if (formatFilter !== 'all' && r.format !== formatFilter) return false;
      if (!resourceMatches(r, query)) return false;
      return true;
    });
  }, [query, subjectFilter, formatFilter]);

  const formatCounts = useMemo(() => resCountByFormat(), []);
  const subjectCounts = useMemo(() => resCountBySubject(), []);

  return (
    <ModuleSection
      title="General teaching resources"
      hint="Worked examples, quick references, writing templates, rubrics — CED-aligned content for KUA AP teachers. No dashboard tie required; use these for any week of the year."
    >
      <div style={{ ...styles.guideCallout, background: 'rgba(134, 239, 172, 0.06)', borderColor: 'rgba(134, 239, 172, 0.25)' }}>
        <strong style={{ color: '#86efac' }}>Not just carbon.</strong>{' '}
        These {teachingResources.length} resources cover {new Set(teachingResources.map((r) => r.course)).size} AP
        courses end-to-end — stoichiometry to scansion. Drop any one into class without prep.
      </div>

      <div style={styles.filterBar}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by topic, course, technique…"
          style={styles.searchInput}
          aria-label="Search teaching resources"
        />

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          style={styles.select}
          aria-label="Filter by subject"
        >
          <option value="all">All subjects ({teachingResources.length})</option>
          {SUBJECTS.filter((s) => subjectCounts[s] > 0).map((s) => (
            <option key={s} value={s}>{s} ({subjectCounts[s]})</option>
          ))}
        </select>
      </div>

      <div style={styles.chipRow}>
        <button
          type="button"
          onClick={() => setFormatFilter('all')}
          style={chipStyle(formatFilter === 'all')}
        >
          All formats ({formatCounts.all})
        </button>
        {RESOURCE_FORMATS.filter((f) => formatCounts[f] > 0).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormatFilter(f)}
            style={chipStyle(formatFilter === f)}
          >
            {f} ({formatCounts[f]})
          </button>
        ))}
      </div>

      <div style={styles.resultsMeta}>
        Showing <strong style={{ color: '#e5e7eb' }}>{filtered.length}</strong> of{' '}
        {teachingResources.length} resources
        {(query || subjectFilter !== 'all' || formatFilter !== 'all') && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSubjectFilter('all'); setFormatFilter('all'); }}
            style={styles.clearFiltersBtn}
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          No resources match those filters. Try{' '}
          <button
            type="button"
            onClick={() => { setQuery(''); setSubjectFilter('all'); setFormatFilter('all'); }}
            style={styles.emptyResetBtn}
          >
            clearing the filters
          </button>{' '}
          or{' '}
          <a
            href="https://github.com/anren1117-lang/kua-carbon-dashboard/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.emptyLink}
          >
            request a resource
          </a>.
        </div>
      ) : (
        <div style={styles.lessonGrid}>
          {filtered.map((r) => {
            const isOpen = expanded === r.id;
            return (
              <div key={r.id} style={styles.lessonCard}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  aria-expanded={isOpen}
                  style={styles.lessonHeadBtn}
                >
                  <div style={{ flex: 1 }}>
                    <div style={styles.lessonTitle}>{r.title}</div>
                    <div style={styles.lessonMeta}>
                      <Pill kind="info">{r.format}</Pill>
                      <Pill kind="ok">{r.durationMin} min</Pill>
                      <span style={styles.lessonDept}>{r.course} · {r.cedUnit}</span>
                    </div>
                    <div style={styles.resSummary}>{r.summary}</div>
                  </div>
                  <span style={{ ...styles.arrow, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    ▶
                  </span>
                </button>

                {isOpen && (
                  <div style={styles.lessonBody}>
                    <pre style={styles.resContent}>{r.content}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ModuleSection>
  );
}

const SAMPLE_CLASS_ROWS = [
  { class: 'APES — Period 3', students: 18, completed: 16, avgScore: 84, lastTopic: 'Scope 1/2/3' },
  { class: 'Biology — Period 5', students: 22, completed: 19, avgScore: 78, lastTopic: 'Food emissions' },
  { class: 'AP Chem — Period 7', students: 14, completed: 14, avgScore: 91, lastTopic: 'Grid mix math' },
  { class: 'Advisory — Mr. Smith', students: 12, completed: 8, avgScore: 65, lastTopic: 'Climate basics' },
];

function chipStyle(active) {
  return {
    padding: '6px 12px',
    background: active ? 'rgba(34, 211, 238, 0.15)' : '#0b1220',
    border: `1px solid ${active ? '#22d3ee' : '#1f2937'}`,
    borderRadius: 999,
    color: active ? '#22d3ee' : '#cbd5e1',
    fontSize: 12,
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
  };
}

const styles = {
  guideCallout: {
    padding: '12px 16px',
    background: 'rgba(34, 211, 238, 0.06)',
    border: '1px solid rgba(34, 211, 238, 0.25)',
    borderRadius: 8,
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 1.6,
    marginBottom: 18,
  },
  guideLink: { color: '#22d3ee', textDecoration: 'none', fontWeight: 600 },

  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: '1 1 240px',
    padding: '8px 12px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 6,
    color: '#e5e7eb',
    fontSize: 13,
    fontFamily: 'inherit',
  },
  select: {
    padding: '8px 10px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 6,
    color: '#cbd5e1',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },

  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },

  resultsMeta: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  clearFiltersBtn: {
    padding: '4px 10px',
    background: 'transparent',
    border: '1px solid #1f2937',
    borderRadius: 4,
    color: '#94a3b8',
    fontSize: 11,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  emptyState: {
    padding: '20px 16px',
    background: '#0b1220',
    border: '1px dashed #1f2937',
    borderRadius: 8,
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  emptyResetBtn: {
    padding: 0,
    background: 'transparent',
    border: 'none',
    color: '#22d3ee',
    fontSize: 13,
    cursor: 'pointer',
    textDecoration: 'underline',
    fontFamily: 'inherit',
  },
  emptyLink: { color: '#22d3ee', textDecoration: 'none', fontWeight: 600 },

  lessonGrid: { display: 'grid', gap: 10 },
  lessonCard: {
    padding: '14px 16px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
  },
  lessonHeadBtn: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    color: 'inherit',
  },
  lessonTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  lessonMeta: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  lessonDept: { fontSize: 12, color: '#94a3b8' },
  arrow: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
    transition: 'transform 200ms ease',
    display: 'inline-block',
  },

  lessonBody: { marginTop: 14, paddingTop: 12, borderTop: '1px solid #1f2937' },
  lessonSummary: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 12px' },
  lessonLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700, marginBottom: 6, marginTop: 12 },
  lessonList: { margin: 0, paddingLeft: 20, fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 },
  lessonActivity: { padding: 12, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 6, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, fontStyle: 'italic' },
  prepNote: { padding: '10px 12px', background: '#0f172a', border: '1px solid #1f2937', borderLeft: '3px solid #fbbf24', borderRadius: 6, fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 },

  courseRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  courseChip: {
    padding: '3px 9px',
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 4,
    fontSize: 11,
    color: '#cbd5e1',
  },

  pageRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  pageLink: {
    padding: '4px 10px',
    background: 'rgba(34, 211, 238, 0.08)',
    border: '1px solid rgba(34, 211, 238, 0.3)',
    borderRadius: 4,
    fontSize: 12,
    color: '#22d3ee',
    textDecoration: 'none',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontWeight: 600,
  },

  resSummary: { fontSize: 13, color: '#94a3b8', marginTop: 8, lineHeight: 1.5 },
  resContent: {
    margin: 0,
    padding: '14px 16px',
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 6,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 13,
    color: '#e5e7eb',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowX: 'auto',
  },

  // AP unit map — one card per AP course, expandable to a vertical
  // list of CED units with fit pill + hook + linked-lesson chips.
  apCourseGrid: { display: 'grid', gap: 10 },
  apCourseCard: {
    padding: '14px 16px',
    background: '#0b1220',
    border: '1px solid #1f2937',
    borderRadius: 8,
  },
  apCourseHeadBtn: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'left',
    color: 'inherit',
  },
  apCourseTitle: { fontSize: 15, color: '#e5e7eb', fontWeight: 700 },
  apCourseMeta: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  apCedYear: { fontSize: 11, color: '#64748b', marginLeft: 6 },
  apCourseBody: { marginTop: 14, paddingTop: 12, borderTop: '1px solid #1f2937' },
  apOverallFit: {
    padding: '8px 12px',
    background: '#0f172a',
    borderLeft: '3px solid #22d3ee',
    borderRadius: 4,
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 1.6,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  apUnitList: { display: 'grid', gap: 12 },
  apUnitRow: {
    padding: 12,
    background: '#0f172a',
    border: '1px solid #1f2937',
    borderRadius: 6,
  },
  apUnitHeader: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 },
  apUnitNum: { fontSize: 12, color: '#64748b', fontWeight: 700 },
  apUnitName: { fontSize: 13, color: '#e5e7eb', fontWeight: 600, flex: 1 },
  apUnitHook: { fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginTop: 4 },
  apUnitNote: { fontSize: 12, color: '#fbbf24', lineHeight: 1.5, marginTop: 6, fontStyle: 'italic' },
  apUnitPages: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  apUnitLessons: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' },
  apUnitLessonsLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 },
  apUnitLessonChip: {
    padding: '3px 9px',
    background: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: 4,
    fontSize: 11,
    color: '#86efac',
    fontWeight: 600,
  },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '10px 8px', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontSize: 11, borderBottom: '1px solid #1f2937', fontWeight: 700 },
  td: { padding: '10px 8px', color: '#cbd5e1', borderBottom: '1px solid #1f2937' },

  promptGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 },
  promptCard: { padding: '14px 16px', background: '#0b1220', border: '1px solid #1f2937', borderLeft: '4px solid #fbbf24', borderRadius: 8 },
  promptLabel: { fontSize: 11, color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  promptText: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 },
  promptMeta: { fontSize: 12, color: '#64748b', marginTop: 10, textTransform: 'capitalize' },
};
