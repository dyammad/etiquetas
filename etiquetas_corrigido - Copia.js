// CORREÇÃO PARA CONEXÃO BLUETOOTH KP-IM606
// Este arquivo contém apenas as funções modificadas

// Bluetooth connection for KP-IM606
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
    
    // CORREÇÃO: Adicionar o UUID padrão de impressoras térmicas 58mm
    // Service UUID padrão para impressoras térmicas BLE: 0000ff00-0000-1000-8000-00805f9b34fb
    let filters = [
      { address: PRINTER_MAC }, // Try MAC address first
      { namePrefix: 'KP' },
      { namePrefix: 'IM' },
      { namePrefix: 'BlueTooth' },
      { name: 'KP-IM606' },
      { services: ['0000ff00-0000-1000-8000-00805f9b34fb'] }, // ADICIONADO: UUID padrão
      { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }
    ];
    
    // Try with filters first
    try {
      bluetoothDevice = await navigator.bluetooth.requestDevice({
        filters: filters,
        optionalServices: [
          '0000ff00-0000-1000-8000-00805f9b34fb', // ADICIONADO: UUID padrão de impressoras térmicas
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
          '0000ff00-0000-1000-8000-00805f9b34fb', // ADICIONADO: UUID padrão
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
    
    // CORREÇÃO: Adicionar UUID padrão como primeira opção
    const serviceUUIDs = [
      '0000ff00-0000-1000-8000-00805f9b34fb', // ADICIONADO PRIMEIRO: UUID padrão de impressoras térmicas 58mm
      '000018f0-0000-1000-8000-00805f9b34fb', // Original
      '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Alternative
      '0000180a-0000-1000-8000-00805f9b34fb'  // Device Info
    ];
    
    // CORREÇÃO: Adicionar UUIDs de características padrão
    const characteristicUUIDs = [
      '0000ff02-0000-1000-8000-00805f9b34fb', // ADICIONADO PRIMEIRO: Write characteristic padrão
      '0000ff01-0000-1000-8000-00805f9b34fb', // ADICIONADO: Notify characteristic padrão
      '00002af1-0000-1000-8000-00805f9b34fb', // Original
      '49535343-8841-43f4-a8d4-ecbe34729bb3', // Alternative write
      '49535343-1e4d-4bd9-ba61-23c647249616'  // Alternative
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
    }
    
    updateBtStatus('❌ Erro: ' + errorMsg);
  }
}

