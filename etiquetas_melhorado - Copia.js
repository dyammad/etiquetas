// VERSÃO MELHORADA COM CHUNKING E RETRY
// Adicione estas funções auxiliares ao código

// Função para escrever dados em chunks (evita problema de MTU)
async function writeValueInChunks(characteristic, data, chunkSize = 20) {
  const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.slice(i, Math.min(i + chunkSize, uint8Array.length));
    await characteristic.writeValue(chunk);
    
    // Pequeno delay entre chunks para evitar sobrecarga
    if (i + chunkSize < uint8Array.length) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

// Função para escrever com retry automático
async function writeWithRetry(characteristic, data, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Se os dados forem grandes, usar chunking
      if (data.length > 20) {
        await writeValueInChunks(characteristic, data);
      } else {
        await characteristic.writeValue(data);
      }
      return; // Sucesso
    } catch (err) {
      console.warn(`Write attempt ${attempt}/${maxRetries} failed:`, err);
      if (attempt === maxRetries) throw err;
      
      // Delay progressivo entre tentativas
      await new Promise(resolve => setTimeout(resolve, 100 * attempt));
    }
  }
}

// Função para adicionar timeout a operações
function withTimeout(promise, timeoutMs = 10000, operationName = 'Operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${operationName} timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

// VERSÃO MELHORADA DA FUNÇÃO connectBluetooth
async function connectBluetooth(){
  try {
    if(!navigator.bluetooth){
      const browserName = detectBrowser();
      let message = '❌ Web Bluetooth não suportado neste navegador/plataforma.\n\n';
      message += '✅ SOLUÇÕES:\n';
      message += '1. Use o navegador Chrome (recomendado)\n';
      message += '2. Use o navegador Edge\n';
      message += '3. Ou use o modo "Navegador (padrão)" e imprima via PDF\n\n';
      message += 'Navegador atual: ' + browserName;
      alert(message);
      updateBtStatus('❌ Web Bluetooth não suportado. Use Chrome ou Edge.');
      return;
    }
    
    updateBtStatus('Procurando impressora...');
    
    // CORREÇÃO: Adicionar UUID padrão de impressoras térmicas 58mm
    let filters = [
      { address: PRINTER_MAC },
      { namePrefix: 'KP' },
      { namePrefix: 'IM' },
      { namePrefix: 'BlueTooth' },
      { name: 'KP-IM606' },
      { services: ['0000ff00-0000-1000-8000-00805f9b34fb'] }, // ADICIONADO: UUID padrão
      { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }
    ];
    
    // Try with filters first
    try {
      bluetoothDevice = await withTimeout(
        navigator.bluetooth.requestDevice({
          filters: filters,
          optionalServices: [
            '0000ff00-0000-1000-8000-00805f9b34fb', // ADICIONADO
            '000018f0-0000-1000-8000-00805f9b34fb',
            '0000180a-0000-1000-8000-00805f9b34fb',
            '49535343-fe7d-4ae5-8fa9-9fafd205e455'
          ]
        }),
        30000, // 30 segundos timeout
        'Device selection'
      );
    } catch(e) {
      console.log('Trying acceptAllDevices fallback...');
      updateBtStatus('Mostrando todos os dispositivos...');
      bluetoothDevice = await withTimeout(
        navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [
            '0000ff00-0000-1000-8000-00805f9b34fb', // ADICIONADO
            '000018f0-0000-1000-8000-00805f9b34fb',
            '0000180a-0000-1000-8000-00805f9b34fb',
            '49535343-fe7d-4ae5-8fa9-9fafd205e455'
          ]
        }),
        30000,
        'Device selection'
      );
    }
    
    updateBtStatus('Conectando...');
    const server = await withTimeout(
      bluetoothDevice.gatt.connect(),
      10000,
      'GATT connection'
    );
    
    // Try different service UUIDs
    let service = null;
    let characteristic = null;
    
    // CORREÇÃO: Adicionar UUID padrão como primeira opção
    const serviceUUIDs = [
      '0000ff00-0000-1000-8000-00805f9b34fb', // ADICIONADO PRIMEIRO
      '000018f0-0000-1000-8000-00805f9b34fb',
      '49535343-fe7d-4ae5-8fa9-9fafd205e455',
      '0000180a-0000-1000-8000-00805f9b34fb'
    ];
    
    // CORREÇÃO: Adicionar UUIDs padrão de características
    const characteristicUUIDs = [
      '0000ff02-0000-1000-8000-00805f9b34fb', // ADICIONADO PRIMEIRO: Write
      '0000ff01-0000-1000-8000-00805f9b34fb', // ADICIONADO: Notify
      '00002af1-0000-1000-8000-00805f9b34fb',
      '49535343-8841-43f4-a8d4-ecbe34729bb3',
      '49535343-1e4d-4bd9-ba61-23c647249616'
    ];
    
    for(const svcUUID of serviceUUIDs) {
      try {
        service = await server.getPrimaryService(svcUUID);
        console.log('✅ Found service:', svcUUID);
        updateBtStatus('Serviço encontrado: ' + svcUUID.substring(0, 8) + '...');
        
        for(const charUUID of characteristicUUIDs) {
          try {
            characteristic = await service.getCharacteristic(charUUID);
            console.log('✅ Found characteristic:', charUUID);
            updateBtStatus('Característica encontrada: ' + charUUID.substring(0, 8) + '...');
            break;
          } catch(e) {
            console.log('❌ Characteristic not found:', charUUID);
          }
        }
        
        if(characteristic) break;
      } catch(e) {
        console.log('❌ Service not found:', svcUUID);
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
    } else if(err.message.includes('timeout')){
      errorMsg = 'Tempo esgotado. Verifique se a impressora está próxima e ligada.';
    }
    
    updateBtStatus('❌ Erro: ' + errorMsg);
  }
}

// VERSÃO MELHORADA DA FUNÇÃO printViaBluetooth
async function printViaBluetooth(items){
  // MELHORIA: Verificar se está realmente conectado
  if(!bluetoothCharacteristic || !bluetoothDevice?.gatt?.connected){
    alert('Conecte a impressora Bluetooth primeiro!');
    return;
  }
  
  try {
    updateBtStatus('Imprimindo...');
    const cmd = escPos();
    
    for(const item of items){
      // Initialize
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.init));
      
      // Header - HARO
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.alignCenter));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.bold));
      await writeWithRetry(bluetoothCharacteristic, textToBytes('HARO'));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.feed));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.boldOff));
      await writeWithRetry(bluetoothCharacteristic, textToBytes('--------------------------------'));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.feed));
      
      // Content
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.alignLeft));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.normal));
      
      // Product (pode ser longo, usar writeWithRetry que tem chunking)
      await writeWithRetry(bluetoothCharacteristic, textToBytes('Produto: ' + (item.product || '-')));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.feed));
      
      // Manufacturing date
      const mfgDate = item.mfgISO ? item.mfgISO.split('-').reverse().join('/') : '--/--/--';
      await writeWithRetry(bluetoothCharacteristic, textToBytes('Fabricacao: ' + mfgDate));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.feed));
      
      // Expiry date
      const expDate = item.expISO ? item.expISO.split('-').reverse().join('/') : '--/--/--';
      await writeWithRetry(bluetoothCharacteristic, textToBytes('Validade: ' + expDate));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.feed));
      
      // Notes (pode ser longo)
      if(item.notes){
        await writeWithRetry(bluetoothCharacteristic, textToBytes('Obs: ' + item.notes));
        await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.feed));
      }
      
      // Footer
      await writeWithRetry(bluetoothCharacteristic, textToBytes('--------------------------------'));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.feed));
      await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.feedLines(3)));
      
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
    await writeWithRetry(bluetoothCharacteristic, new Uint8Array(cmd.cut));
    
    updateBtStatus('✅ Impresso com sucesso!');
    setTimeout(() => updateBtStatus('✅ Conectado: ' + bluetoothDevice.name), 3000);
    
  } catch(err){
    console.error('Print error:', err);
    updateBtStatus('❌ Erro ao imprimir: ' + err.message);
    
    // Se perdeu conexão, limpar estado
    if(err.message.includes('GATT') || err.message.includes('disconnected')){
      bluetoothCharacteristic = null;
      updateBtStatus('❌ Conexão perdida. Reconecte a impressora.');
    }
  }
}

// FUNÇÃO ADICIONAL: Desconectar manualmente
async function disconnectBluetooth() {
  try {
    if (bluetoothDevice?.gatt?.connected) {
      await bluetoothDevice.gatt.disconnect();
      console.log('Desconectado manualmente');
    }
  } catch(err) {
    console.error('Erro ao desconectar:', err);
  } finally {
    bluetoothDevice = null;
    bluetoothCharacteristic = null;
    updateBtStatus('Desconectado');
  }
}

