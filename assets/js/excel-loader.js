
    let _excelJsLoaded = false;
    function ensureExcelJS() {
      if (_excelJsLoaded || window.ExcelJS) { _excelJsLoaded = true; return Promise.resolve(); }
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js';
        s.onload = () => { _excelJsLoaded = true; resolve(); };
        s.onerror = () => reject(new Error('ExcelJS load failed'));
        document.head.appendChild(s);
      });
    }
  