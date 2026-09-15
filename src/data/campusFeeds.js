// Which BMS power-meter feeds count toward a campus electricity total:
// service-entrance mains and panel feeds, not the submeters beneath them.
// Shared by the Scope 2 insights panel and scripts/sumMonthlyFeeds.mjs, so the
// feed set behind the master-meter scale can't drift between the two.
export const CAMPUS_FEED_RE = /MainFeed$|PanelFeed$|MDPFeed$|MDP$|^PM_\d+_Feed$|^PM_\d+_LP$|^PM_\d+_MainFeed$/;

export function isCampusFeed(meterId) {
  return CAMPUS_FEED_RE.test(meterId);
}
