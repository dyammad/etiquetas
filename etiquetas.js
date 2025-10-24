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
  const printerTypeSelect = $('#printerType');
  const connectBtBtn = $('#connectBtBtn');
  const btStatus = $('#btStatus');
  const btHelp = $('#btHelp');

  // Bluetooth printer state
  let bluetoothDevice = null;
  let bluetoothCharacteristic = null;
  const PRINTER_MAC = 'CA:06:26:71:4B:5D'; // MAC address da impressora KP-IM606

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

  const settings = load(STORAGE_KEYS.settings, { brand: 'Empresa', dateFormat: 'pt-BR', labelSize: { wMm: 60, hMm: 40 }, printerType: 'browser' });
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
    let className = 'label';
    if(paperSize === '58mm') className = 'label size-58mm';
    else if(paperSize === '55mm') className = 'label size-55mm';
    el.className = className;
    const notesHtml = item.notes ? `<div class="line-row"><div class="line-title">Obs:</div><div class="line-fill"><span style="font-size:10px">${item.notes}</span></div></div>` : '';
    el.innerHTML = `
      <div class="label-box">
        <div class="label-brand">HARO</div>
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
    let gridClassName = 'labels-grid';
    if(paperSize === '58mm') gridClassName = 'labels-grid size-58mm';
    else if(paperSize === '55mm') gridClassName = 'labels-grid size-55mm';
    labelsGrid.className = gridClassName;
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

  // Bluetooth connection for KP-IM606
  async function connectBluetooth(){
    try {
      if(!navigator.bluetooth){
        alert('Bluetooth não suportado neste navegador. Use Chrome/Edge.');
        return;
      }
      
      updateBtStatus('Procurando impressora...');
      
      // Try multiple filter options for better compatibility
      let filters = [
        { address: PRINTER_MAC }, // Try MAC address first
        { namePrefix: 'KP' },
        { namePrefix: 'IM' },
        { namePrefix: 'BlueTooth' },
        { name: 'KP-IM606' },
        { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }
      ];
      
      // Try with filters first
      try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
          filters: filters,
          optionalServices: [
            '000018f0-0000-1000-8000-00805f9b34fb',
            '0000180a-0000-1000-8000-00805f9b34fb',
            '49535343-fe7d-4ae5-8fa9-9fafd205e455'
          ]
        });
      } catch(e) {
        // Fallback: show all devices
        console.log('Trying acceptAllDevices fallback...');
        updateBtStatus('Mostrando todos os dispositivos...');
        bluetoothDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            '000018f0-0000-1000-8000-00805f9b34fb',
            '0000180a-0000-1000-8000-00805f9b34fb',
            '49535343-fe7d-4ae5-8fa9-9fafd205e455'
          ]
        });
      }
      
      updateBtStatus('Conectando...');
      const server = await bluetoothDevice.gatt.connect();
      
      // Try different service UUIDs
      let service = null;
      let characteristic = null;
      
      const serviceUUIDs = [
        '000018f0-0000-1000-8000-00805f9b34fb', // Primary
        '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Alternative
        '0000180a-0000-1000-8000-00805f9b34fb'  // Device Info
      ];
      
      const characteristicUUIDs = [
        '00002af1-0000-1000-8000-00805f9b34fb', // Primary
        '49535343-8841-43f4-a8d4-ecbe34729bb3', // Alternative write
        '49535343-1e4d-4bd9-ba61-23c647249616'  // Alternative
      ];
      
      for(const svcUUID of serviceUUIDs) {
        try {
          service = await server.getPrimaryService(svcUUID);
          console.log('Found service:', svcUUID);
          
          for(const charUUID of characteristicUUIDs) {
            try {
              characteristic = await service.getCharacteristic(charUUID);
              console.log('Found characteristic:', charUUID);
              break;
            } catch(e) {
              console.log('Characteristic not found:', charUUID);
            }
          }
          
          if(characteristic) break;
        } catch(e) {
          console.log('Service not found:', svcUUID);
        }
      }
      
      if(!characteristic) {
        throw new Error('Não foi possível encontrar característica de escrita. Impressora incompatível?');
      }
      
      bluetoothCharacteristic = characteristic;
      
      // Show device info
      const deviceInfo = [
        'Nome: ' + bluetoothDevice.name,
        bluetoothDevice.id ? 'ID: ' + bluetoothDevice.id : null
      ].filter(Boolean).join(' | ');
      
      updateBtStatus('✅ Conectado: ' + deviceInfo);
      console.log('✅ Bluetooth conectado!');
      console.log('  Nome:', bluetoothDevice.name);
      console.log('  ID:', bluetoothDevice.id);
      console.log('  GATT:', bluetoothDevice.gatt.connected ? 'Conectado' : 'Desconectado');
      
      bluetoothDevice.addEventListener('gattserverdisconnected', ()=>{
        updateBtStatus('❌ Desconectado');
        bluetoothCharacteristic = null;
      });
      
    } catch(err){
      console.error('❌ Erro Bluetooth:', err);
      let errorMsg = err.message;
      
      // Friendly error messages
      if(err.message.includes('User cancelled')){
        errorMsg = 'Conexão cancelada pelo usuário';
      } else if(err.message.includes('not found')){
        errorMsg = 'Impressora não encontrada. Verifique se está ligada e próxima.';
      } else if(err.message.includes('GATT')){
        errorMsg = 'Falha na conexão GATT. Tente desligar e ligar a impressora.';
      }
      
      updateBtStatus('❌ Erro: ' + errorMsg);
    }
  }
  
  function updateBtStatus(msg){
    if(btStatus){
      btStatus.textContent = msg;
      btStatus.style.display = 'block';
    }
  }
  
  // ESC/POS commands for thermal printer
  function escPos(){
    return {
      init: [0x1B, 0x40], // Initialize
      alignCenter: [0x1B, 0x61, 0x01],
      alignLeft: [0x1B, 0x61, 0x00],
      bold: [0x1B, 0x45, 0x01],
      boldOff: [0x1B, 0x45, 0x00],
      small: [0x1B, 0x21, 0x01],
      normal: [0x1B, 0x21, 0x00],
      cut: [0x1D, 0x56, 0x00],
      feed: [0x0A],
      feedLines: (n) => Array(n).fill(0x0A)
    };
  }
  
  function textToBytes(text){
    return new TextEncoder().encode(text);
  }
  
  function combineBytes(...arrays){
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for(const arr of arrays){
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }
  
  async function printViaBluetooth(items){
    if(!bluetoothCharacteristic){
      alert('Conecte a impressora Bluetooth primeiro!');
      return;
    }
    
    try {
      updateBtStatus('Imprimindo...');
      const cmd = escPos();
      
      for(const item of items){
        // Initialize
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.init));
        
        // Header - HARO
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.alignCenter));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.bold));
        await bluetoothCharacteristic.writeValue(textToBytes('HARO'));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.feed));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.boldOff));
        await bluetoothCharacteristic.writeValue(textToBytes('--------------------------------'));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.feed));
        
        // Content
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.alignLeft));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.normal));
        
        // Product
        await bluetoothCharacteristic.writeValue(textToBytes('Produto: ' + (item.product || '-')));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.feed));
        
        // Manufacturing date
        const mfgDate = item.mfgISO ? item.mfgISO.split('-').reverse().join('/') : '--/--/--';
        await bluetoothCharacteristic.writeValue(textToBytes('Fabricacao: ' + mfgDate));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.feed));
        
        // Expiry date
        const expDate = item.expISO ? item.expISO.split('-').reverse().join('/') : '--/--/--';
        await bluetoothCharacteristic.writeValue(textToBytes('Validade: ' + expDate));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.feed));
        
        // Notes
        if(item.notes){
          await bluetoothCharacteristic.writeValue(textToBytes('Obs: ' + item.notes));
          await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.feed));
        }
        
        // Footer
        await bluetoothCharacteristic.writeValue(textToBytes('--------------------------------'));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.feed));
        await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.feedLines(3)));
        
        // Add to history
        const mfg = item.mfgISO ? parseISO(item.mfgISO) : null;
        const exp = item.expISO ? parseISO(item.expISO) : null;
        addHistory({
          ts: Date.now(),
          tsHuman: new Date().toLocaleString(settings.dateFormat||'pt-BR'),
          product: item.product,
          mfgIso: item.mfgISO,
          expIso: item.expISO,
          mfgHuman: mfg ? fmtDateHuman(mfg) : '',
          expHuman: exp ? fmtDateHuman(exp) : '',
          notes: item.notes || ''
        });
      }
      
      // Cut paper
      await bluetoothCharacteristic.writeValue(new Uint8Array(cmd.cut));
      
      updateBtStatus('✅ Impresso com sucesso!');
      setTimeout(() => updateBtStatus('✅ Conectado: ' + bluetoothDevice.name), 3000);
      
    } catch(err){
      console.error('Print error:', err);
      updateBtStatus('❌ Erro ao imprimir: ' + err.message);
    }
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

  async function handlePrint(){
    updatePreview();
    const qty = Math.max(1, parseInt(qtyInput?.value || '1', 10));
    const snap = snapshotCurrent();
    const items = Array.from({length: qty}, ()=> ({...snap}));
    console.log('Printing items:', items);
    
    const printerType = printerTypeSelect?.value || 'browser';
    
    if(printerType === 'kp-im606'){
      // Print via Bluetooth
      await printViaBluetooth(items);
    } else {
      // Print via browser
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
  }

  async function handlePrintQueue(){
    if(queue.length===0){ addCurrentToQueue(); }
    console.log('Printing queue:', queue);
    
    const printerType = printerTypeSelect?.value || 'browser';
    
    if(printerType === 'kp-im606'){
      // Print via Bluetooth
      await printViaBluetooth(queue);
    } else {
      // Print via browser
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
    
    // Bluetooth controls
    if(printerTypeSelect){
      printerTypeSelect.addEventListener('change', ()=>{
        const isBluetooth = printerTypeSelect.value === 'kp-im606';
        if(connectBtBtn) connectBtBtn.style.display = isBluetooth ? 'inline-block' : 'none';
        if(btHelp) btHelp.style.display = isBluetooth ? 'block' : 'none';
        if(isBluetooth && paperSizeSelect) paperSizeSelect.value = '58mm';
      });
    }
    
    if(connectBtBtn){
      connectBtBtn.addEventListener('click', connectBluetooth);
    }
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
