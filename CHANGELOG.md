# 📝 Changelog - Etiquetas Inteligentes

## [2.0.0] - 2025-10-22

### ✨ Adicionado

#### 📱 Mobile-First
- **Menu hambúrguer** para navegação mobile (< 768px)
  - Painel deslizante com animação suave
  - Ícone animado (hambúrguer → X)
  - Fecha ao clicar fora
  - Header fixo no topo
  
- **Layout responsivo otimizado**
  - Botões full-width em mobile (< 480px)
  - Cards empilhados verticalmente
  - Grid adaptativo por breakpoint
  - Touch targets adequados (44x44px mínimo)

- **Preview otimizado para mobile**
  - Escala automática: 80% (tablet), 65% (mobile)
  - Scroll horizontal suave
  - Oculto em telas < 1024px para economizar espaço

#### 🔧 Progressive Web App (PWA)
- **Manifest.json** completo
  - Nome, descrição, ícones
  - Tema e cores personalizadas
  - Orientação portrait
  - Standalone display mode

- **Service Worker** (sw.js)
  - Cache de recursos estáticos
  - Funcionamento offline
  - Estratégia cache-first
  - Limpeza de cache antigo
  - Suporte a background sync (preparado)

- **Instalação**
  - Botão flutuante "📱 Instalar App"
  - Prompt automático de instalação
  - Suporte Android, iOS, Desktop
  - Ícone na tela inicial

- **Ícones PWA**
  - icon.svg (vetorial)
  - icon-192.png (192x192)
  - icon-512.png (512x512)
  - Gerador HTML para criar PNGs

#### 📚 Documentação
- **MOBILE-PWA.md** - Guia completo mobile e PWA
- **TEST-CHECKLIST.md** - Checklist de testes
- **CHANGELOG.md** - Este arquivo
- **.gitignore** - Configuração Git
- **README.md atualizado** - Novas funcionalidades

### 🔄 Modificado

#### CSS (etiquetas.css)
- Adicionado header mobile com estilos
- Adicionado animações do hambúrguer
- Media query mobile (< 767px) com painel deslizante
- Media query mobile pequeno (< 480px) otimizada
- Media query desktop (768px+) esconde header mobile
- Regras de impressão incluem elementos mobile
- Transições suaves em todos os elementos

#### HTML (index.html)
- Adicionado header mobile com hambúrguer
- Meta tags PWA (theme-color, apple-web-app)
- Links para manifest e ícones
- Script de registro do Service Worker
- Script de prompt de instalação PWA
- ID no painel de controles para JS

#### JavaScript (etiquetas.js)
- Event listener para hambúrguer
- Toggle de classe 'open' no painel
- Close ao clicar fora (mobile)
- Detecção de largura da tela

### 🐛 Corrigido
- Preview não responsivo em mobile
- Botões pequenos demais para touch
- Cards não empilhavam corretamente
- Scroll horizontal indesejado
- Header mobile aparecia em desktop

### 🎨 Melhorado
- Performance geral
- Acessibilidade (aria-labels)
- Touch targets (mínimo 44x44px)
- Contraste de cores
- Animações suaves
- Feedback visual

### 📦 Arquivos Novos
```
+ manifest.json          # Configuração PWA
+ sw.js                  # Service Worker
+ icon.svg              # Ícone vetorial
+ generate-icons.html   # Gerador de ícones
+ MOBILE-PWA.md         # Guia mobile/PWA
+ TEST-CHECKLIST.md     # Checklist de testes
+ CHANGELOG.md          # Este arquivo
+ .gitignore           # Git ignore
```

### 📦 Arquivos Modificados
```
~ index.html            # Header mobile + PWA
~ etiquetas.css         # Responsividade + mobile
~ etiquetas.js          # Menu hambúrguer
~ README.md            # Documentação atualizada
```

### 🔧 Tecnologias Adicionadas
- Service Worker API
- Web App Manifest
- Cache API
- beforeinstallprompt event
- Media queries avançadas

### 📊 Estatísticas
- **Breakpoints**: 4 (480px, 640px, 768px, 1024px)
- **Ícones PWA**: 3 (SVG + 2 PNG)
- **Cache offline**: 7 recursos
- **Documentação**: +400 linhas
- **Compatibilidade**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

---

## [1.0.0] - 2025-10-20

### ✨ Lançamento Inicial

#### Funcionalidades Core
- Impressão de etiquetas 60x40mm
- Gestão de produtos com validade
- Fila de impressão
- Atalhos personalizados
- Histórico de impressões
- Exportação CSV
- Preview em tempo real
- LocalStorage para persistência

#### Design
- Layout desktop responsivo
- Tema escuro
- Grid de 2 colunas
- Preview lado a lado

#### Tecnologias
- HTML5 + CSS3 + Vanilla JS
- JsBarcode para códigos de barras
- QRCode.js para QR codes
- LocalStorage API
- Print API

---

## 🔮 Roadmap Futuro

### v2.1.0 (Planejado)
- [ ] Notificações push
- [ ] Sincronização em nuvem
- [ ] Temas personalizáveis
- [ ] Mais tamanhos de etiqueta
- [ ] Templates customizáveis

### v2.2.0 (Planejado)
- [ ] Multi-idioma (EN, ES)
- [ ] Backup automático
- [ ] Importação de produtos CSV
- [ ] API para integração
- [ ] Modo escuro/claro toggle

### v3.0.0 (Futuro)
- [ ] Backend opcional
- [ ] Contas de usuário
- [ ] Colaboração em equipe
- [ ] Analytics de impressão
- [ ] App nativo (Electron/Capacitor)

---

**Mantenedor**: Equipe Etiquetas  
**Licença**: Open Source  
**Repositório**: [GitHub](#)
