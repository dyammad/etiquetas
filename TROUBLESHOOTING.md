# 🔧 Solução de Problemas - Impressora Bluetooth

## ❌ **Opera não acha a impressora**

### Problema Comum
O **Opera** tem suporte limitado ao Web Bluetooth e pode não detectar alguns dispositivos.

### ✅ Soluções:

#### 1. **Use Chrome ou Edge (RECOMENDADO)**
- Chrome tem melhor suporte Bluetooth
- Edge também funciona perfeitamente
- Opera pode ter bugs com Web Bluetooth

#### 2. **Tente o modo "Mostrar Todos"**
Se a impressora não aparecer na lista:
1. Clique em "🔗 Conectar Bluetooth"
2. Na janela que abrir, procure a impressora
3. Se não aparecer, **cancele**
4. O sistema tentará novamente mostrando **todos os dispositivos**
5. Procure por nomes como:
   - `KP-xxxx`
   - `IM-xxxx`
   - `BlueTooth Printer`
   - `Printer`
   - Qualquer nome parecido

#### 3. **Verifique a Impressora**
- ✅ Está **ligada**?
- ✅ LED azul está **piscando**? (modo pareamento)
- ✅ Está **próxima** do celular/PC? (máx 10m)
- ✅ Tem **bateria**?
- ✅ Não está conectada em **outro dispositivo**?

#### 4. **Reinicie a Impressora**
1. Desligue a impressora (botão Power 3s)
2. Aguarde 5 segundos
3. Ligue novamente
4. Aguarde LED azul piscar
5. Tente conectar novamente

#### 5. **Limpe Pareamentos Antigos**
No seu celular/PC:
1. Vá em **Configurações** → **Bluetooth**
2. Encontre a impressora na lista
3. Toque em "Esquecer" ou "Remover"
4. Volte ao sistema e tente conectar

---

## 🔍 **Outros Problemas Comuns**

### Impressora aparece mas não conecta

**Causa**: Pode estar conectada em outro dispositivo

**Solução**:
1. Desconecte de outros celulares/PCs
2. Desligue e ligue a impressora
3. Tente novamente

---

### Conecta mas não imprime

**Causa**: UUID de serviço incompatível

**Solução**:
1. Abra o **Console** (F12)
2. Procure por mensagens de erro
3. Veja se encontrou "Found service" e "Found characteristic"
4. Se não encontrou, a impressora pode ser incompatível

**Alternativa**:
- Use o app oficial da impressora
- Ou imprima via navegador (modo padrão)

---

### Impressão sai em branco

**Causa**: Papel térmico errado ou vencido

**Solução**:
1. Use **papel térmico** (não comum)
2. Verifique validade do papel
3. Teste com papel novo
4. Limpe o cabeçote térmico

---

### Desconecta durante impressão

**Causa**: Distância ou interferência

**Solução**:
1. Aproxime a impressora
2. Evite obstáculos (paredes, metal)
3. Carregue a bateria
4. Evite usar WiFi 2.4GHz próximo

---

### Texto cortado ou incompleto

**Causa**: Papel mal encaixado

**Solução**:
1. Abra a tampa
2. Recoloque o papel corretamente
3. Deixe ponta saindo
4. Feche bem a tampa

---

## 🌐 **Compatibilidade de Navegadores**

### ✅ Funcionam Bem:
- **Chrome** (Desktop e Android) - **MELHOR**
- **Edge** (Desktop) - **RECOMENDADO**

### ⚠️ Funcionam com Limitações:
- **Opera** (Desktop e Android) - Pode não detectar
- **Brave** - Precisa habilitar Web Bluetooth

### ❌ Não Funcionam:
- **Firefox** - Sem suporte Web Bluetooth
- **Safari** (Mac/iOS) - Sem suporte Web Bluetooth
- **Chrome iOS** - Usa engine do Safari

---

## 📱 **Recomendações por Plataforma**

### Android
1. **Use Chrome** (não Opera)
2. Bluetooth ativado
3. Localização ativada (necessário para Bluetooth)
4. Permissões concedidas

### Windows
1. **Use Chrome ou Edge**
2. Bluetooth ativado
3. Driver Bluetooth atualizado
4. Windows 10+ (melhor suporte)

### Mac
1. **Use Chrome**
2. Bluetooth ativado
3. macOS 10.15+ (Catalina ou superior)

### iOS (iPhone/iPad)
❌ **Não funciona** - Use app nativo da impressora

---

## 🔬 **Diagnóstico Avançado**

### Verificar Suporte Bluetooth
Abra o Console (F12) e digite:
```javascript
navigator.bluetooth ? 'Suportado' : 'Não suportado'
```

### Ver Dispositivos Disponíveis
```javascript
navigator.bluetooth.requestDevice({ acceptAllDevices: true })
```

### Ver Serviços da Impressora
Após conectar, no Console:
```javascript
// Veja os logs que aparecem automaticamente
// Procure por "Found service" e "Found characteristic"
```

---

## 📞 **Ainda Não Funciona?**

### Tente Estas Alternativas:

#### 1. **Use o Modo Navegador**
1. Selecione "Navegador (padrão)"
2. Imprima normalmente
3. Use "Salvar como PDF"
4. Envie PDF para impressora via app oficial

#### 2. **Use App Nativo**
1. Baixe app oficial da KP-IM606
2. Conecte via app
3. Imprima diretamente

#### 3. **Use Computador**
1. Abra no Chrome Desktop
2. Conecte via Bluetooth
3. Imprima normalmente

---

## 🎯 **Checklist Rápido**

Antes de tentar conectar:

- [ ] Impressora ligada (LED azul piscando)
- [ ] Bateria carregada
- [ ] Papel térmico instalado
- [ ] Bluetooth ativado no celular/PC
- [ ] Usando Chrome ou Edge
- [ ] Impressora próxima (< 5m)
- [ ] Não conectada em outro dispositivo
- [ ] Localização ativada (Android)

---

## 💡 **Dica Final**

**Se Opera não funciona:**
1. Instale o **Chrome**
2. Abra o site no Chrome
3. Conecte normalmente
4. Funciona 100%! ✅

**Chrome é o navegador com melhor suporte Web Bluetooth!**

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0
