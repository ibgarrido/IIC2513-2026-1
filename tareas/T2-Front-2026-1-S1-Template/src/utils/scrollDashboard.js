export function scrollDashboardToTop(behavior = "smooth") {
  document.querySelector(".dashboard-body")?.scrollTo({ top: 0, behavior });
}
