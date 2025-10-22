# 📱 Guia Mobile & PWA - Etiquetas Inteligentes

## ✨ Novidades da Versão 2.0

### 🍔 Menu Hambúrguer Mobile
- **Toque no ícone** (☰) no canto superior direito para abrir/fechar o menu
- Todos os controles ficam em um painel deslizante
- Toque fora do menu para fechá-lo
- Interface limpa e organizada em telas pequenas

### 📐 Layout Responsivo Otimizado
- **Mobile (< 768px)**: Menu hambúrguer + layout vertical
- **Mobile pequeno (< 480px)**: Botões full-width, cards empilhados
- **Tablet (640-1024px)**: Grid 2 colunas
- **Desktop (1024px+)**: Layout lado a lado com preview

### 📦 Cards Empilhados Verticalmente
- Todos os botões ocupam largura total no mobile
- Atalhos e histórico em lista vertical
- Chips de validade distribuídos uniformemente
- Scroll suave e touch-friendly

### 🔍 Preview Otimizado
- Etiquetas redimensionadas automaticamente (80% em tablets, 65% em mobile)
- Scroll horizontal suave para visualização
- Preview oculto em telas pequenas para economizar espaço

## 📲 Instalando como PWA

### Android (Chrome/Edge)
1. Abra o site no navegador
2. Toque no botão **"📱 Instalar App"** (canto inferior direito)
3. Ou toque no menu (⋮) → **"Instalar aplicativo"**
4. Confirme a instalação
5. O ícone aparecerá na tela inicial

### iOS (Safari)
1. Abra o site no Safari
2. Toque no botão **Compartilhar** (□↑)
3. Role e toque em **"Adicionar à Tela de Início"**
4. Edite o nome se desejar
5. Toque em **"Adicionar"**

### Desktop (Chrome/Edge)
1. Abra o site no navegador
2. Clique no ícone **⊕** na barra de endereço
3. Ou clique no botão **"📱 Instalar App"**
4. Confirme a instalação
5. O app abrirá em janela própria

## 🚀 Benefícios do PWA

### ✅ Funciona Offline
- Cache inteligente de todos os recursos
- Continue trabalhando sem internet
- Dados salvos localmente

### ✅ Experiência Nativa
- Abre em janela própria (sem barra do navegador)
- Ícone na tela inicial
- Splash screen ao abrir
- Notificações (futuro)

### ✅ Rápido e Leve
- Carregamento instantâneo após primeira visita
- Não ocupa espaço na loja de apps
- Atualizações automáticas

### ✅ Multi-plataforma
- Funciona em Android, iOS, Windows, Mac, Linux
- Mesma experiência em todos os dispositivos
- Sincronização via localStorage

## 🎯 Uso Mobile - Dicas

### Impressão no Celular
1. **Bluetooth**: Pareie a impressora antes
2. **Wi-Fi**: Configure impressora na rede
3. **Compartilhar**: Use "Compartilhar" → "Imprimir"
4. **PDF**: Salve como PDF se não tiver impressora

### Navegação Rápida
- **Menu hambúrguer**: Acesso rápido aos controles
- **Atalhos**: Crie atalhos para produtos frequentes
- **Fila**: Monte a fila antes de imprimir
- **Histórico**: Consulte impressões anteriores

### Otimização de Espaço
- Preview oculto em mobile (economiza espaço)
- Histórico compacto (180px de altura)
- Botões empilhados verticalmente
- Scroll suave para navegação

## 🔧 Gerando Ícones PWA

Se você clonou o projeto e precisa gerar os ícones:

1. Abra `generate-icons.html` no navegador
2. Clique em **"🚀 Gerar Ícones"**
3. Baixe os dois arquivos:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
4. Salve na pasta raiz do projeto

Os ícones já estão configurados no `manifest.json`.

## 📊 Compatibilidade PWA

| Recurso | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Instalação | ✅ | ✅ | ✅ | ✅ |
| Offline | ✅ | ✅ | ✅ | ✅ |
| Ícone tela inicial | ✅ | ✅ | ✅ | ✅ |
| Janela standalone | ✅ | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |

## 🐛 Solução de Problemas Mobile

### Menu hambúrguer não abre
- Recarregue a página (F5)
- Limpe o cache do navegador
- Verifique se está em tela < 768px

### PWA não instala
- Use HTTPS (ou localhost para testes)
- Verifique se `manifest.json` está acessível
- Confirme que `sw.js` está registrado (F12 → Console)

### Botão "Instalar App" não aparece
- Já pode estar instalado
- Navegador não suporta (use Chrome/Edge)
- Acesse via HTTPS

### Não funciona offline
- Visite o site online primeiro (para fazer cache)
- Aguarde Service Worker registrar
- Verifique F12 → Application → Service Workers

### Impressão no celular não funciona
- Configure impressora Bluetooth/Wi-Fi
- Use "Salvar como PDF" como alternativa
- Verifique drivers da impressora

## 📝 Changelog v2.0

### Adicionado
- ✨ Menu hambúrguer para mobile
- ✨ PWA completo (manifest + service worker)
- ✨ Instalação como app nativo
- ✨ Funcionamento offline
- ✨ Cards empilhados verticalmente no mobile
- ✨ Preview otimizado para telas pequenas
- ✨ Botão de instalação flutuante
- ✨ Ícones SVG e gerador de PNG

### Melhorado
- 📱 Responsividade mobile aprimorada
- 📱 Touch targets maiores
- 📱 Scroll suave e natural
- 📱 Layout mais limpo em telas pequenas
- 📱 Performance geral

## 🎨 Personalização Mobile

### Alterar cor do tema (barra de status)
Edite em `index.html`:
```html
<meta name="theme-color" content="#121827" />
```

### Alterar nome do app
Edite em `manifest.json`:
```json
{
  "name": "Seu Nome Aqui",
  "short_name": "Nome Curto"
}
```

### Alterar ícone
1. Substitua `icon.svg` pelo seu ícone
2. Gere novos PNGs com `generate-icons.html`
3. Substitua `icon-192.png` e `icon-512.png`

## 📞 Suporte

Para dúvidas sobre mobile/PWA:
1. Verifique este guia
2. Consulte F12 → Console para erros
3. Teste em diferentes navegadores
4. Verifique compatibilidade do dispositivo

---

**Versão**: 2.0.0  
**Mobile-first**: ✅  
**PWA**: ✅  
**Offline**: ✅
