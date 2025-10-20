(function(){
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const productSelect = $('#productSelect');
  const mfgDateInput = $('#mfgDate');
  const expDateInput = $('#expDate');
  const useAutoValidity = $('#useAutoValidity');
  const notesInput = $('#notes');
  const printBtn = $('#printBtn');
  const savePresetBtn = $('#savePresetBtn');
  const exportHistoryBtn = $('#exportHistoryBtn');
  const presetsList = $('#presetsList');
  const historyList = $('#historyList');
  const qtyInput = $('#qty');
  const addToQueueBtn = $('#addToQueueBtn');
  const clearQueueBtn = $('#clearQueueBtn');
  const printQueueBtn = $('#printQueueBtn');
  const labelsGrid = $('#labelsGrid');
  const sheet = $('#sheet');
  const paperSizeSelect = $('#paperSize');

  const lineProduct = $('#lineProduct');
  const mfgDD = $('#mfgDD');
  const mfgMM = $('#mfgMM');
  const mfgYY = $('#mfgYY');
  const expDD = $('#expDD');
  const expMM = $('#expMM');
  const expYY = $('#expYY');

  const STORAGE_KEYS = {
    products: 'labels_products_v1',
    presets: 'labels_presets_v1',
    settings: 'labels_settings_v1',
    history: 'labels_history_v1'
  };

  function load(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

  const defaultProducts = [
    { name: 'Shari (arroz de sushi temperado)', shelf: { unit: 'days', value: 1 } },
    { name: 'Cebolinha', shelf: { unit: 'days', value: 3 } },
    { name: 'Cream Cheese', shelf: { unit: 'days', value: 5 } },
    { name: 'Kaní', shelf: { unit: 'days', value: 7 } },
    { name: 'Alho Poró Crispy', shelf: { unit: 'days', value: 15 } },
    { name: 'Couve Crispy', shelf: { unit: 'days', value: 15 } }
  ];

  const settings = load(STORAGE_KEYS.settings, { brand: 'Empresa', dateFormat: 'pt-BR', labelSize: { wMm: 60, hMm: 40 } });
  const products = load(STORAGE_KEYS.products, defaultProducts);
  const presets = load(STORAGE_KEYS.presets, []);
  const history = load(STORAGE_KEYS.history, []);
  let queue = [];

  function fmtDateISO(d){
    const year = d.getFullYear();
    const m = (d.getMonth()+1).toString().padStart(2,'0');
    const day = d.getDate().toString().padStart(2,'0');
    return `${year}-${m}-${day}`;
  }
  function fmtDateHuman(d){
    return d.toLocaleDateString(settings.dateFormat || 'pt-BR');
  }
  function dd(d){ return d.getDate().toString().padStart(2,'0'); }
  function mm(d){ return (d.getMonth()+1).toString().padStart(2,'0'); }
  function yy(d){ return (d.getFullYear()%100).toString().padStart(2,'0'); }
  function parseISO(dateStr){
    const [y,m,d] = dateStr.split('-').map(Number);
    return new Date(y, (m-1), d);
  }
  function addDays(date, n){
    const d = new Date(date.getTime());
    d.setDate(d.getDate()+n);
    return d;
  }
  function addMonths(date, n){
    const d = new Date(date.getTime());
    d.setMonth(d.getMonth()+n);
    return d;
  }
  function getSelectedProduct(){
    const name = productSelect.value;
    return products.find(p => p.name === name) || null;
  }

  function renderProducts(){
    productSelect.innerHTML = '';
    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.name; opt.textContent = p.name;
      productSelect.appendChild(opt);
    });
  }

  function ensureToday(){
    const now = new Date();
    mfgDateInput.value = mfgDateInput.value || fmtDateISO(now);
  }

  function applyAutoValidity(){
    if(!useAutoValidity.checked) return;
    const p = getSelectedProduct();
    if(!p || !p.shelf) return;
    const mfg = parseISO(mfgDateInput.value);
    let exp = mfg;
    if(p.shelf.unit === 'days') exp = addDays(mfg, p.shelf.value);
    else if(p.shelf.unit === 'months') exp = addMonths(mfg, p.shelf.value);
    expDateInput.value = fmtDateISO(exp);
  }

  function calculateExpiry(productName){
    const p = products.find(prod => prod.name === productName);
    if(!p || !p.shelf) {
      console.log('No shelf life for product:', productName);
      return fmtDateISO(new Date());
    }
    const today = new Date();
    let exp = new Date(today);
    if(p.shelf.unit === 'days') exp = addDays(exp, p.shelf.value);
    else if(p.shelf.unit === 'months') exp = addMonths(exp, p.shelf.value);
    console.log('Calculated expiry for', productName, ':', fmtDateISO(exp));
    return fmtDateISO(exp);
  }

  function termToDate(term){
    const mfg = parseISO(mfgDateInput.value);
    if(term.endsWith('d')){ return addDays(mfg, parseInt(term)); }
    if(term.endsWith('m')){ return addMonths(mfg, parseInt(term)); }
    return mfg;
  }

  function updatePreview(){
    if(lineProduct) lineProduct.textContent = productSelect.value || '—';
    const mfg = mfgDateInput.value ? parseISO(mfgDateInput.value) : null;
    const exp = expDateInput.value ? parseISO(expDateInput.value) : null;
    if(mfg){ if(mfgDD) mfgDD.textContent = dd(mfg); if(mfgMM) mfgMM.textContent = mm(mfg); if(mfgYY) mfgYY.textContent = yy(mfg); }
    else { if(mfgDD) mfgDD.innerHTML='&nbsp;'; if(mfgMM) mfgMM.innerHTML='&nbsp;'; if(mfgYY) mfgYY.innerHTML='&nbsp;'; }
    if(exp){ if(expDD) expDD.textContent = dd(exp); if(expMM) expMM.textContent = mm(exp); if(expYY) expYY.textContent = yy(exp); }
    else { if(expDD) expDD.innerHTML='&nbsp;'; if(expMM) expMM.innerHTML='&nbsp;'; if(expYY) expYY.innerHTML='&nbsp;'; }
  }


  function snapshotCurrent(){
    const mfg = mfgDateInput.value ? parseISO(mfgDateInput.value) : null;
    const exp = expDateInput.value ? parseISO(expDateInput.value) : null;
    return {
      product: productSelect.value,
      mfgISO: mfg ? fmtDateISO(mfg) : '',
      expISO: exp ? fmtDateISO(exp) : '',
      notes: notesInput.value || ''
    };
  }

  function createLabelElement(item){
    const el = document.createElement('div');
    const paperSize = paperSizeSelect?.value || '60mm';
    el.className = paperSize === '55mm' ? 'label size-55mm' : 'label';
    const notesHtml = item.notes ? `<div class="line-row"><div class="line-title">Obs:</div><div class="line-fill"><span style="font-size:10px">${item.notes}</span></div></div>` : '';
    el.innerHTML = `
      <div class="label-box">
        <div class="line-row">
          <div class="line-title">Produto:</div>
          <div class="line-fill"><span>${item.product || '—'}</span></div>
        </div>
        <div class="line-row">
          <div class="line-title">Fabricação:</div>
          <div class="date-fill">
            <div class="date-seg">${item.mfgISO ? item.mfgISO.slice(8,10) : '&nbsp;'}</div>
            <div class="slash">/</div>
            <div class="date-seg">${item.mfgISO ? item.mfgISO.slice(5,7) : '&nbsp;'}</div>
            <div class="slash">/</div>
            <div class="date-seg">${item.mfgISO ? item.mfgISO.slice(2,4) : '&nbsp;'}</div>
          </div>
        </div>
        <div class="line-row">
          <div class="line-title">Validade:</div>
          <div class="date-fill">
            <div class="date-seg">${item.expISO ? item.expISO.slice(8,10) : '&nbsp;'}</div>
            <div class="slash">/</div>
            <div class="date-seg">${item.expISO ? item.expISO.slice(5,7) : '&nbsp;'}</div>
            <div class="slash">/</div>
            <div class="date-seg">${item.expISO ? item.expISO.slice(2,4) : '&nbsp;'}</div>
          </div>
        </div>
        ${notesHtml}
      </div>`;
    return el;
  }

  function renderQueueGrid(items){
    if(!labelsGrid) {
      console.error('labelsGrid element not found!');
      return;
    }
    console.log('Rendering', items.length, 'labels to grid');
    labelsGrid.innerHTML = '';
    const paperSize = paperSizeSelect?.value || '60mm';
    labelsGrid.className = paperSize === '55mm' ? 'labels-grid size-55mm' : 'labels-grid';
    items.forEach((it, index) => {
      console.log('Creating label', index, ':', it);
      const labelEl = createLabelElement(it);
      labelsGrid.appendChild(labelEl);
    });
    console.log('Grid rendered with', labelsGrid.children.length, 'labels');
  }

  function addCurrentToQueue(){
    const qty = Math.max(1, parseInt(qtyInput?.value || '1', 10));
    const snap = snapshotCurrent();
    for(let i=0;i<qty;i++) queue.push({...snap});
    renderQueueGrid(queue);
  }

  function clearQueue(){
    queue = [];
    renderQueueGrid(queue);
  }



  function savePreset(){
    const id = 'p_'+Date.now();
    // Always add current form to queue if queue is empty
    if(queue.length === 0){
      addCurrentToQueue();
    }
    const defaultName = `Fila com ${queue.length} etiquetas`;
    const label = prompt('Nome do atalho:', defaultName);
    if(!label) return;
    const preset = {
      id, label,
      savedQueue: [...queue],
      timestamp: Date.now()
    };
    presets.push(preset);
    save(STORAGE_KEYS.presets, presets);
    renderPresets();
    console.log('Preset saved:', preset);
  }

  function renderPresets(){
    presetsList.innerHTML = '';
    presets.forEach(p => {
      const div = document.createElement('div');
      div.className = 'preset';
      const btn = document.createElement('button');
      const queueCount = p.savedQueue ? p.savedQueue.length : (p.queue ? p.queue.length : 1);
      btn.textContent = `${p.label} (${queueCount} etiq.)`;
      btn.onclick = () => applyPresetAndPrint(p.id);
      const del = document.createElement('button');
      del.textContent = 'X';
      del.className = 'del';
      del.onclick = () => deletePreset(p.id);
      div.appendChild(btn);
      div.appendChild(del);
      presetsList.appendChild(div);
    });
  }

  function deletePreset(id){
    const idx = presets.findIndex(p=>p.id===id);
    if(idx>=0){ presets.splice(idx,1); save(STORAGE_KEYS.presets, presets); renderPresets(); }
  }

  function applyPresetAndPrint(id){
    const p = presets.find(x=>x.id===id);
    if(!p) return;
    console.log('Applying preset:', p);
    
    const savedQueue = p.savedQueue || p.queue;
    if(savedQueue && savedQueue.length > 0){
      // Clear current queue
      queue = [];
      // Restore saved queue with updated dates
      queue = savedQueue.map(item => ({
        ...item,
        mfgISO: fmtDateISO(new Date()),
        expISO: calculateExpiry(item.product)
      }));
      console.log('Restored queue:', queue);
      renderQueueGrid(queue);
      // Wait a bit then print
      setTimeout(() => handlePrintQueue(), 100);
    } else {
      // Legacy: single product
      productSelect.value = p.productName || '';
      const today = new Date();
      mfgDateInput.value = fmtDateISO(today);
      useAutoValidity.checked = true;
      applyAutoValidity();
      notesInput.value = p.notes || '';
      if(qtyInput) qtyInput.value = p.qty || '1';
      updatePreview();
      handlePrint();
    }
  }

  function addHistory(entry){
    history.unshift(entry);
    if(history.length>500) history.pop();
    save(STORAGE_KEYS.history, history);
    renderHistory();
  }

  function renderHistory(){
    historyList.innerHTML='';
    history.forEach(h => {
      const row = document.createElement('div');
      row.className = 'history-item';
      const left = document.createElement('div');
      left.textContent = `${h.tsHuman} • ${h.product} • FAB ${h.mfgHuman} • VAL ${h.expHuman}`;
      const right = document.createElement('div');
      right.textContent = h.lot ? `Lote ${h.lot}` : '';
      row.appendChild(left); row.appendChild(right);
      historyList.appendChild(row);
    });
  }

  function exportHistory(){
    const headers = ['timestamp','produto','fabricacao','validade','obs'];
    const lines = [headers.join(',')];
    history.forEach(h => {
      const row = [
        JSON.stringify(h.tsHuman),
        JSON.stringify(h.product),
        JSON.stringify(h.mfgIso),
        JSON.stringify(h.expIso),
        JSON.stringify(h.notes||'')
      ].join(',');
      lines.push(row);
    });
    const blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'historico_etiquetas.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint(){
    updatePreview();
    const qty = Math.max(1, parseInt(qtyInput?.value || '1', 10));
    const snap = snapshotCurrent();
    const items = Array.from({length: qty}, ()=> ({...snap}));
    console.log('Printing items:', items);
    renderQueueGrid(items);
    // history per label
    const mfg = snap.mfgISO ? parseISO(snap.mfgISO) : null;
    const exp = snap.expISO ? parseISO(snap.expISO) : null;
    for(let i=0;i<qty;i++){
      addHistory({
        ts: Date.now(),
        tsHuman: new Date().toLocaleString(settings.dateFormat||'pt-BR'),
        product: snap.product,
        mfgIso: snap.mfgISO,
        expIso: snap.expISO,
        mfgHuman: mfg ? fmtDateHuman(mfg) : '',
        expHuman: exp ? fmtDateHuman(exp) : '',
        notes: notesInput.value
      });
    }
    // Wait for DOM to render then print
    setTimeout(() => {
      console.log('Printing now...');
      window.print();
    }, 200);
  }

  function handlePrintQueue(){
    if(queue.length===0){ addCurrentToQueue(); }
    console.log('Printing queue:', queue);
    renderQueueGrid(queue);
    // minimal history aggregate
    const nowHuman = new Date().toLocaleString(settings.dateFormat||'pt-BR');
    queue.forEach(q => addHistory({
      ts: Date.now(), tsHuman: nowHuman,
      product: q.product,
      mfgIso: q.mfgISO, expIso: q.expISO,
      mfgHuman: q.mfgISO || '', expHuman: q.expISO || '',
      notes: ''
    }));
    // Wait for DOM to render then print
    setTimeout(() => {
      console.log('Printing queue now...');
      window.print();
    }, 200);
  }

  function bind(){
    productSelect.addEventListener('change', ()=>{ applyAutoValidity(); updatePreview(); });
    mfgDateInput.addEventListener('change', ()=>{ if(useAutoValidity.checked) applyAutoValidity(); updatePreview(); });
    expDateInput.addEventListener('change', ()=> updatePreview());
    useAutoValidity.addEventListener('change', ()=>{ applyAutoValidity(); updatePreview(); });
    notesInput.addEventListener('input', updatePreview);
    $$('.chip').forEach(c => c.addEventListener('click', ()=>{ const d=termToDate(c.dataset.term); expDateInput.value = fmtDateISO(d); updatePreview(); }));
    printBtn.addEventListener('click', handlePrint);
    printQueueBtn.addEventListener('click', handlePrintQueue);
    addToQueueBtn.addEventListener('click', addCurrentToQueue);
    clearQueueBtn.addEventListener('click', clearQueue);
    savePresetBtn.addEventListener('click', savePreset);
    exportHistoryBtn.addEventListener('click', exportHistory);
  }

  function init(){
    renderProducts();
    ensureToday();
    // Set default validity to 5 days
    const today = mfgDateInput.value ? parseISO(mfgDateInput.value) : new Date();
    const defaultExpiry = addDays(today, 5);
    expDateInput.value = fmtDateISO(defaultExpiry);
    applyAutoValidity();
    renderPresets();
    renderHistory();
    bind();
    updatePreview();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
