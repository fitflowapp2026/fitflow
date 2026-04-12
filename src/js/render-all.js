function renderAll() {
  if (_rendering) return;
  _rendering = true;
  applyResponsiveDefaults();
  /* autoComplete gestita da scheduleNextAutoComplete in init.js */
  renderHero();
  renderHeroGreeting();
  // opsBoard rimosso
  renderSelectedClient();
  renderAlerts();
  renderClientList();
  renderCalendarHead();
  renderCalendar();
  renderPackages();
  renderPackageOptions(el.clientPackage, el.clientPackage.value || state.packages[0]?.id || '');
  renderPackageOptions(el.renewPackage, el.renewPackage.value || state.packages[0]?.id || '');
  el.packagePreview.innerHTML = buildPackageSummary(getPackage(el.clientPackage.value));
  renderClientFormStickySummary();
  el.renewPreview.innerHTML = buildPackageSummary(getPackage(el.renewPackage.value));
  renderFixedSchedulePreview();
  if (el.reportModalBackdrop.classList.contains('open')) renderReport();
  _rendering = false;
}
