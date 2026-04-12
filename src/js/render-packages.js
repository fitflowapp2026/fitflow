
function renderPackages() {
  if (!state.packages.length) {
    el.packageList.innerHTML = '<div class="empty">Nessun pacchetto</div>';
    return;
  }
  el.packageList.innerHTML = state.packages.map(pkg => `
    <button class="package-card ${pkg.id === state.selectedPackageId ? 'active' : ''}" data-package-id="${pkg.id}" style="text-align:left;cursor:pointer;">
      <strong>${escapeHtml(pkg.name)}</strong>
      <div class="pill-row" style="margin-top:10px;">
        <span class="tag">${pkg.lessonsTotal} lez</span>
        <span class="tag">${pkg.weeks} sett</span>
        <span class="tag">${pkg.perWeek}/sett</span>
        <span class="tag">${pkg.duration} min</span>
        <span class="tag">${formatCurrency(pkg.totalPrice || 0)}</span>
      </div>
    </button>
  `).join('');
  el.packageList.querySelectorAll('[data-package-id]').forEach(button => {
    button.addEventListener('click', () => {
      const pkg = getPackage(button.getAttribute('data-package-id'));
      if (!pkg) return;
      state.selectedPackageId = pkg.id;
      el.packageId.value = pkg.id;
      el.packageName.value = pkg.name;
      el.packageLessons.value = pkg.lessonsTotal;
      el.packageWeeks.value = pkg.weeks;
      el.packagePerWeek.value = pkg.perWeek;
      el.packageDuration.value = pkg.duration;
      el.packagePrice.value = Number(pkg.totalPrice || 0);
      renderPackages();
    });
  });
}
