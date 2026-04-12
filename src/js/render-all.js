let _rendering = false;
function renderAll() {
  if (_rendering) return;
  _rendering = true;
  applyResponsiveDefaults();
  try { autoCompleteElapsedLessons(); } catch(e) { console.error(e); }
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
