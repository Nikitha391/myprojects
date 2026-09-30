const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const sidebarToggle = document.getElementById('sidebarToggle');
const pageTitle = document.getElementById('pageTitle');
const breadcrumbTitle = document.getElementById('breadcrumbTitle');
const createReportButton = document.getElementById('createReportButton');
const reportTables = document.querySelectorAll('.report-table');
const navItems = document.querySelectorAll('.nav-item, .rail-button');
const detailPage = document.getElementById('clientRunDetailPage');
const overviewMainPanel = document.querySelector('.main-panel');
const viewResultsLinks = document.querySelectorAll('.view-results-link');
const detailBreadcrumbLinks = document.querySelectorAll('[data-detail-destination]');
const overviewSections = document.querySelectorAll('.overview-header, .metrics-grid, .dashboard-grid, .standard-reports, .activity-panel');
const standardReportsSection = document.querySelector('.standard-reports');
const standardReportTiles = document.querySelectorAll('.report-tile');

function syncPageTitle(selectedItem) {
  if (!selectedItem) return;

  const title = selectedItem.dataset.title || selectedItem.querySelector('strong')?.textContent?.trim() || 'All reports';
  if (pageTitle) pageTitle.textContent = title;
  if (breadcrumbTitle) breadcrumbTitle.textContent = title;
}

function syncReportTable(selectedItem) {
  const view = selectedItem?.dataset.view || 'all-reports';

  reportTables.forEach((table) => {
    const isAllReports = table.id === 'allReportsTable';
    const shouldShow = view === 'all-reports' ? isAllReports : !isAllReports;
    table.classList.toggle('hidden', !shouldShow);
  });

  if (createReportButton) {
    createReportButton.style.display = view === 'all-reports' ? 'inline-flex' : 'none';
  }
}

function openSidebar() {
  sidebar?.classList.add('open');
  if (window.innerWidth <= 980) {
    sidebarBackdrop?.classList.add('visible');
  }
}

function closeSidebar() {
  sidebar?.classList.remove('open');
  sidebarBackdrop?.classList.remove('visible');
}

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    const isOpen = sidebar?.classList.contains('open');
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener('click', closeSidebar);
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) {
    sidebar?.classList.add('open');
    sidebarBackdrop?.classList.remove('visible');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSidebar();
  }
});

function showOverviewPage() {
  if (overviewMainPanel) overviewMainPanel.classList.remove('hidden');
  if (detailPage) detailPage.classList.add('hidden');
  overviewSections.forEach((section) => section.classList.remove('hidden'));
  standardReportsSection?.classList.remove('client-runs-filtered');
}

function showClientRunDetailPage() {
  if (overviewMainPanel) overviewMainPanel.classList.add('hidden');
  if (detailPage) detailPage.classList.remove('hidden');
}

function selectNavigationView(view) {
  const navItem = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (!navItem) return;

  document.querySelectorAll('.nav-item').forEach((item) => item.classList.remove('active'));
  navItem.classList.add('active');
  syncPageTitle(navItem);
  syncReportTable(navItem);
}

function showClientRunsReportView() {
  if (overviewMainPanel) overviewMainPanel.classList.remove('hidden');
  if (detailPage) detailPage.classList.add('hidden');
  overviewSections.forEach((section) => section.classList.add('hidden'));
  standardReportsSection?.classList.remove('hidden');
  standardReportsSection?.classList.add('client-runs-filtered');
  standardReportTiles.forEach((tile) => tile.classList.toggle('hidden', !tile.classList.contains('client-runs-tile')));
  selectNavigationView('standard-reports');
}

navItems.forEach((item) => {
  item.addEventListener('click', (event) => {
    const isNavButton = item.classList.contains('rail-button');
    if (isNavButton) {
      document.querySelectorAll('.rail-button').forEach((button) => button.classList.remove('active'));
      item.classList.add('active');
    }

    if (item.classList.contains('nav-item')) {
      navItems.forEach((navItem) => {
        if (navItem.classList.contains('nav-item')) navItem.classList.remove('active');
      });
      item.classList.add('active');
      syncPageTitle(item);
      syncReportTable(item);
      showOverviewPage();
      standardReportTiles.forEach((tile) => tile.classList.remove('hidden'));
    }

    if (!item.classList.contains('nav-item')) {
      event.preventDefault();
    }
  });
});

viewResultsLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showClientRunDetailPage();
  });
});

detailBreadcrumbLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    if (link.dataset.detailDestination === 'client-runs') {
      showClientRunsReportView();
      return;
    }

    selectNavigationView('overview');
    showOverviewPage();
    standardReportTiles.forEach((tile) => tile.classList.remove('hidden'));
  });
});

const initialActiveNav = document.querySelector('.nav-item.active');
if (initialActiveNav) {
  syncPageTitle(initialActiveNav);
  syncReportTable(initialActiveNav);
  showOverviewPage();
}
