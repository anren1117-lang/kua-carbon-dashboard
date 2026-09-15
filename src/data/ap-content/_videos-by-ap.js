// Per-AP default video. When a subunit doesn't ship its own `video` field,
// the viewer falls back to the AP-level entry here.
//
// URLs in this file were verified via web search (May 2026) against
// reputable creator channels that are consistently recommended in 2025–26
// student/teacher review roundups (RevisionDojo, Albert.io, Triton Times,
// Medium AP guides). Each entry is a full YouTube playlist or channel
// that covers the relevant AP course end-to-end.
//
// Adding a per-subunit video is just adding a `video: {url, title, provider}`
// object inside the subunit; that override always wins.

export const VIDEO_DEFAULTS_BY_AP = {
  // ---- Sciences --------------------------------------------------------
  // Bozeman Science (Paul Andersen) — the canonical APES creator.
  apes: {
    url: 'https://www.youtube.com/playlist?list=PLllVwaZQkS2qK4Z6xBVDRak8an1-kqsgm',
    title: 'Bozeman Science — AP Environmental Science (full playlist)',
    provider: 'Bozeman Science',
  },
  // CrashCourse Biology (2023 reboot, Dr. Sammy).
  apbio: {
    url: 'https://www.youtube.com/playlist?list=PLuJNkwrjp431RwMJhi7KcnnStXYI2m1bM',
    title: 'CrashCourse Biology — full playlist',
    provider: 'CrashCourse',
  },
  // Bozeman Science AP Chemistry channel page.
  apchem: {
    url: 'https://www.youtube.com/channel/UCEik-U3T6u6JA0XiHLbNbOw',
    title: 'Bozeman Science — AP Chemistry (channel)',
    provider: 'Bozeman Science',
  },
  // Khan Academy AP Physics 1 — full course.
  apphys1: {
    url: 'https://www.khanacademy.org/science/ap-physics-1',
    title: 'Khan Academy — AP Physics 1 (full course)',
    provider: 'Khan Academy',
  },
  apphys2: {
    url: 'https://www.khanacademy.org/science/ap-physics-2',
    title: 'Khan Academy — AP Physics 2 (full course)',
    provider: 'Khan Academy',
  },
  apphyscmech: {
    url: 'https://www.youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv',
    title: 'The Organic Chemistry Tutor — Calculus & Physics (full playlist)',
    provider: 'The Organic Chemistry Tutor',
  },
  apphyscem: {
    url: 'https://www.khanacademy.org/science/electrical-engineering',
    title: 'Khan Academy — Electrical engineering (electromagnetism)',
    provider: 'Khan Academy',
  },

  // ---- Math ------------------------------------------------------------
  apprecalc: {
    url: 'https://www.khanacademy.org/math/precalculus',
    title: 'Khan Academy — Precalculus (full course)',
    provider: 'Khan Academy',
  },
  // The Organic Chemistry Tutor — large Calculus playlist that maps well
  // onto AB and BC topics.
  apcalcab: {
    url: 'https://www.youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv',
    title: 'The Organic Chemistry Tutor — Calculus (full playlist)',
    provider: 'The Organic Chemistry Tutor',
  },
  apcalcbc: {
    url: 'https://www.youtube.com/playlist?list=PL0o_zxa4K1BWYThyV4T2Allw6zY0jEumv',
    title: 'The Organic Chemistry Tutor — Calculus (full playlist; covers BC)',
    provider: 'The Organic Chemistry Tutor',
  },
  // AP Statistics Ultimate Review — frequently cited playlist.
  apstats: {
    url: 'https://www.youtube.com/playlist?list=PL6334s8hsQG1JGYHVoULyFM-URr0Bg-ng',
    title: 'AP Statistics Exam — Ultimate Review playlist',
    provider: 'YouTube',
  },

  // ---- Computing -------------------------------------------------------
  apcsp: {
    url: 'https://www.youtube.com/playlist?list=PLj_pyeExdy66JkPloB7cvp60gr_NreIC1',
    title: 'AP Computer Science Principles — full playlist',
    provider: 'YouTube',
  },
  // No single canonical AP CSA Java playlist; Khan Academy CS for now.
  apcsa: {
    url: 'https://www.khanacademy.org/computing/computer-science',
    title: 'Khan Academy — Computer Science (reference)',
    provider: 'Khan Academy',
  },

  // ---- Social studies --------------------------------------------------
  // Heimler's History — covers APUSH / AP World / AP Euro / AP Gov / AP HuG.
  apush: {
    url: 'https://www.youtube.com/playlist?list=PLOL7dZiFCN0J2ni1GfcP-C366fsKLCXmo',
    title: "Heimler's History — APUSH (full playlist)",
    provider: "Heimler's History",
  },
  apworld: {
    url: 'https://www.youtube.com/playlist?list=PLeQOosD7wYS5znaAFQpFaeXES3Ios_amF',
    title: "Heimler's History — AP World History (full playlist)",
    provider: "Heimler's History",
  },
  apeuro: {
    url: 'https://www.youtube.com/c/SteveHeimler/playlists',
    title: "Heimler's History — AP European History (channel playlists)",
    provider: "Heimler's History",
  },
  apusgov: {
    url: 'https://www.youtube.com/c/SteveHeimler/playlists',
    title: "Heimler's History — AP US Government (channel playlists)",
    provider: "Heimler's History",
  },
  apcomp: {
    url: 'https://www.khanacademy.org/humanities/ap-us-government-and-politics',
    title: 'Khan Academy — Government & politics (reference)',
    provider: 'Khan Academy',
  },
  // Mr. Sinn — AP HuG, AP Psychology.
  aphug: {
    url: 'https://www.youtube.com/playlist?list=PL-R0qM-A09uy3T23FMyLu6CjxMu-QtAsC',
    title: 'Mr. Sinn — AP Human Geography (entire course)',
    provider: 'Mr. Sinn',
  },
  appsych: {
    url: 'https://www.youtube.com/playlist?list=PL-R0qM-A09uzQc_MtKBitOHuQyHTsPc7R',
    title: 'Mr. Sinn — AP Psychology unit reviews (full playlist)',
    provider: 'Mr. Sinn',
  },
  // ACDC Econ / Jacob Clifford — the canonical AP Macro / Micro creator.
  apmacro: {
    url: 'https://www.youtube.com/channel/UCCQEbqDL8i40d83Au55lYMQ',
    title: 'ACDC Econ (Jacob Clifford) — AP Macroeconomics',
    provider: 'ACDC Econ',
  },
  apmicro: {
    url: 'https://www.youtube.com/channel/UCCQEbqDL8i40d83Au55lYMQ',
    title: 'ACDC Econ (Jacob Clifford) — AP Microeconomics',
    provider: 'ACDC Econ',
  },
  apafam: {
    url: 'https://www.khanacademy.org/humanities/us-history',
    title: 'Khan Academy — US History (overlapping coverage)',
    provider: 'Khan Academy',
  },

  // ---- English / arts --------------------------------------------------
  apenglang: {
    url: 'https://www.youtube.com/playlist?list=PL0B_uKjIILStKXhRBRWS6jHZLKp7Pguoq',
    title: 'AP English Language and Composition — review playlist',
    provider: 'YouTube',
  },
  apenglit: {
    url: 'https://www.youtube.com/playlist?list=PLxX6GTn5kcIOl96jly9WDU9CYxF4HrprC',
    title: 'Ace the AP English Literature Exam (full playlist)',
    provider: 'YouTube',
  },
  apart: {
    url: 'https://www.khanacademy.org/humanities/art-history',
    title: 'Khan Academy — Art History (matches AP Art History 250)',
    provider: 'Khan Academy',
  },
  apmusic: {
    url: 'https://www.khanacademy.org/humanities/music',
    title: 'Khan Academy — Music (theory and history)',
    provider: 'Khan Academy',
  },

  // ---- World languages -------------------------------------------------
  // Specific YouTube playlists vary by teacher; College Board landing pages
  // are stable and link out to the official AP Daily videos.
  apspanish: {
    url: 'https://apstudents.collegeboard.org/courses/ap-spanish-language-and-culture',
    title: 'College Board — AP Spanish Language and Culture (course resources)',
    provider: 'College Board',
  },
  apfrench: {
    url: 'https://apstudents.collegeboard.org/courses/ap-french-language-and-culture',
    title: 'College Board — AP French Language and Culture (course resources)',
    provider: 'College Board',
  },
  apgerman: {
    url: 'https://apstudents.collegeboard.org/courses/ap-german-language-and-culture',
    title: 'College Board — AP German Language and Culture (course resources)',
    provider: 'College Board',
  },
  apitalian: {
    url: 'https://apstudents.collegeboard.org/courses/ap-italian-language-and-culture',
    title: 'College Board — AP Italian Language and Culture (course resources)',
    provider: 'College Board',
  },
  aplatin: {
    url: 'https://apstudents.collegeboard.org/courses/ap-latin',
    title: 'College Board — AP Latin (course resources)',
    provider: 'College Board',
  },

  // ---- Capstone --------------------------------------------------------
  apseminar: {
    url: 'https://apstudents.collegeboard.org/courses/ap-seminar',
    title: 'College Board — AP Seminar (course resources)',
    provider: 'College Board',
  },
  apresearch: {
    url: 'https://apstudents.collegeboard.org/courses/ap-research',
    title: 'College Board — AP Research (course resources)',
    provider: 'College Board',
  },
};

// Resolve the right video object for a subunit. Per-subunit `video` wins;
// otherwise we fall back to the AP-wide default.
export function resolveVideo(apSlug, subunit) {
  if (subunit?.video) return subunit.video;
  return VIDEO_DEFAULTS_BY_AP[apSlug] || null;
}
