// The future flags production actually mounts with.
//
// index.js renders <BrowserRouter future={{ v7_startTransition: true,
// v7_relativeSplatPath: true }}>, so the app already runs v7 routing
// semantics. Every test except App.test.js rendered a BARE <MemoryRouter>,
// which meant the harnesses exercised v6 semantics against an app running v7
// — 20 warnings per suite run, and a real gap: there are two splat routes
// (index.js:318 and :366), and v7_relativeSplatPath is precisely what governs
// how those resolve. A relative-splat regression could have passed here and
// broken in production.
//
// Exported as one constant rather than pasted into ~16 call sites: the flags
// live in index.js, and a literal copied sixteen times is the drift this
// codebase keeps having to clean up.
export const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };
