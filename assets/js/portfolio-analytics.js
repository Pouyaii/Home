const STORAGE_KEY = "pouya-ai-launch-analytics-v1";
const endpoint = document.querySelector('meta[name="portfolio-analytics-endpoint"]')?.content?.trim() || "";

function emptySummary() {
    return { total: 0, byProject: {}, recent: [] };
}

function readSummary() {
    try {
        return { ...emptySummary(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch (error) {
        return emptySummary();
    }
}

function writeSummary(summary) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
    } catch (error) {
        // Analytics should never interfere with a project launch.
    }
}

function sendEvent(event) {
    if (!endpoint) return;
    const body = JSON.stringify(event);
    if (navigator.sendBeacon?.(endpoint, new Blob([body], { type: "application/json" }))) return;
    fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true
    }).catch(() => {});
}

function trackProjectLaunch(project, href = "") {
    if (!project) return;
    const event = {
        type: "project_launch",
        project,
        href,
        at: new Date().toISOString()
    };
    const summary = readSummary();
    summary.total += 1;
    summary.byProject[project] = (summary.byProject[project] || 0) + 1;
    summary.recent = [event, ...(summary.recent || [])].slice(0, 24);
    writeSummary(summary);
    sendEvent(event);
}

document.addEventListener("click", (event) => {
    const link = event.target.closest?.("[data-analytics-project]");
    if (!link) return;
    trackProjectLaunch(link.dataset.analyticsProject, link.href);
}, { capture: true });

window.portfolioAnalytics = {
    getSummary: readSummary,
    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            // Storage can be unavailable in private contexts.
        }
    },
    trackProjectLaunch
};
