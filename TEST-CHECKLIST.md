# ✅ Checklist de Testes - Etiquetas v2.0

## 📱 Testes Mobile

### Menu Hambúrguer
- [ ] Menu aparece em telas < 768px
- [ ] Ícone hambúrguer clicável
- [ ] Painel desliza da esquerda
- [ ] Animação suave do ícone (X)
- [ ] Fecha ao clicar fora
- [ ] Fecha ao clicar no hambúrguer novamente

### Layout Responsivo
- [ ] Botões full-width em mobile (< 480px)
- [ ] Cards empilhados verticalmente
- [ ] Chips de validade distribuídos uniformemente
- [ ] Scroll suave e touch-friendly
- [ ] Preview oculto em mobile
- [ ] Preview visível em desktop (1024px+)

### Funcionalidade Mobile
- [ ] Todos os campos funcionam no touch
- [ ] Select de produtos abre corretamente
- [ ] Date pickers funcionam
- [ ] Botões respondem ao toque
- [ ] Histórico scrollável
- [ ] Atalhos clicáveis

## 🔧 Testes PWA

### Instalação
- [ ] Botão "📱 Instalar App" aparece
- [ ] Instalação funciona no Chrome/Edge
- [ ] Instalação funciona no Safari (iOS)
- [ ] Ícone aparece na tela inicial
- [ ] App abre em janela standalone

### Service Worker
- [ ] Service Worker registra (F12 → Console)
- [ ] Cache funciona (Application → Cache Storage)
- [ ] Arquivos em cache: HTML, CSS, JS, manifest
- [ ] CDN libs em cache (JsBarcode, QRCode)

### Offline
- [ ] Abre offline após primeira visita
- [ ] Funcionalidades básicas funcionam offline
- [ ] LocalStorage persiste offline
- [ ] Impressão funciona offline

### Manifest
- [ ] manifest.json acessível
- [ ] Ícones carregam corretamente
- [ ] Theme color aplicado (barra de status)
- [ ] Nome do app correto
- [ ] Orientação portrait

## 🖨️ Testes de Impressão

### Desktop
- [ ] Prévia renderiza corretamente
- [ ] Impressão individual funciona
- [ ] Impressão de fila funciona
- [ ] Layout A4 correto
- [ ] Margens adequadas

### Mobile
- [ ] Dialog de impressão abre
- [ ] Opção "Salvar como PDF" disponível
- [ ] Compartilhar → Imprimir funciona
- [ ] Layout otimizado para impressão

## 🎨 Testes Visuais

### Cores e Tema
- [ ] Tema escuro aplicado
- [ ] Contraste adequado
- [ ] Botões primários em azul (#2563eb)
- [ ] Hover states funcionam
- [ ] Focus states visíveis

### Tipografia
- [ ] Fontes carregam corretamente
- [ ] Tamanhos legíveis em mobile
- [ ] Hierarquia visual clara
- [ ] Sem overflow de texto

### Animações
- [ ] Menu hambúrguer anima suavemente
- [ ] Painel desliza com transição
- [ ] Botões têm feedback visual
- [ ] Sem jank ou lag

## 🔍 Testes de Funcionalidade

### Produtos
- [ ] Lista de produtos carrega
- [ ] Seleção de produto funciona
- [ ] Validade automática calcula corretamente
- [ ] Produtos salvos no localStorage

### Datas
- [ ] Data de fabricação padrão = hoje
- [ ] Validade calcula automaticamente
- [ ] Chips de validade funcionam (5d, 7d, 15d, 30d, 3m)
- [ ] Checkbox "usar validade padrão" funciona

### Fila
- [ ] Adicionar à fila funciona
- [ ] Quantidade respeitada
- [ ] Limpar fila funciona
- [ ] Preview da fila renderiza
- [ ] Imprimir fila funciona

### Atalhos
- [ ] Salvar atalho funciona
- [ ] Nome do atalho editável
- [ ] Atalho salva fila completa
- [ ] Usar atalho restaura fila
- [ ] Datas atualizadas ao usar atalho
- [ ] Deletar atalho funciona

### Histórico
- [ ] Impressões registradas
- [ ] Histórico limitado a 500
- [ ] Exportar CSV funciona
- [ ] CSV formatado corretamente

## 🌐 Testes de Compatibilidade

### Navegadores Desktop
- [ ] Chrome (90+)
- [ ] Edge (90+)
- [ ] Firefox (88+)
- [ ] Safari (14+)

### Navegadores Mobile
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

### Dispositivos
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet Android
- [ ] iPad
- [ ] Desktop Windows
- [ ] Desktop Mac

## 🚀 Testes de Performance

### Carregamento
- [ ] Primeira carga < 2s
- [ ] Cargas subsequentes < 500ms (cache)
- [ ] Sem FOUC (Flash of Unstyled Content)
- [ ] Imagens/ícones otimizados

### Responsividade
- [ ] Sem lag ao redimensionar
- [ ] Breakpoints funcionam corretamente
- [ ] Sem scroll horizontal indesejado
- [ ] Touch targets adequados (min 44x44px)

### Memória
- [ ] Sem memory leaks
- [ ] LocalStorage não excede limites
- [ ] Service Worker não trava
- [ ] Console sem erros

## 🔒 Testes de Segurança

### Dados
- [ ] LocalStorage isolado por origem
- [ ] Sem dados sensíveis expostos
- [ ] Sem XSS vulnerabilities
- [ ] Inputs sanitizados

### PWA
- [ ] HTTPS obrigatório (ou localhost)
- [ ] Service Worker em escopo correto
- [ ] Manifest válido
- [ ] CSP headers (se aplicável)

## 📊 Resultados

**Data do teste**: ___________  
**Testador**: ___________  
**Dispositivo**: ___________  
**Navegador**: ___________  
**Versão**: 2.0.0

**Aprovado**: [ ] Sim [ ] Não  
**Observações**:
___________________________________________
___________________________________________
___________________________________________

## 🐛 Bugs Encontrados

1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

## 💡 Melhorias Sugeridas

1. ___________________________________________
2. ___________________________________________
3. ___________________________________________
