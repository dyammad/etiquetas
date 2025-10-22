# 🏷️ Sistema de Etiquetas Inteligentes 60x40mm

Sistema web completo para impressão de etiquetas de produtos alimentícios com controle de validade, histórico e atalhos personalizados.

## 📋 Características

### ✨ Funcionalidades Principais

- **Gestão de Produtos**
  - Cadastro de produtos com validade padrão
  - Validade automática baseada no produto
  - Suporte a dias e meses de validade

- **Impressão de Etiquetas**
  - Formato 60x40mm otimizado
  - Impressão individual ou em lote (fila)
  - Preview em tempo real (desktop)
  - Suporte a impressoras USB, Bluetooth e rede

- **Campos Personalizáveis**
  - Produto
  - Data de fabricação
  - Data de validade
  - Peso (opcional)
  - Lote (opcional)
  - Observações (opcional)
  - Códigos de barras/QR Code (opcional)

- **Atalhos de Impressão**
  - Salvar configurações frequentes
  - Salvar filas completas de produtos
  - Impressão rápida com um clique
  - Datas atualizadas automaticamente

- **Histórico Completo**
  - Registro de todas as impressões
  - Exportação para CSV
  - Limite de 500 registros

- **Design Responsivo**
  - Mobile-first (< 480px)
  - Menu hambúrguer para mobile
  - Cards empilhados verticalmente
  - Tablet (640px - 1024px)
  - Desktop (1024px+)
  - Preview visível apenas em desktop

- **Progressive Web App (PWA)**
  - Instalável no celular/desktop
  - Funciona offline
  - Ícone na tela inicial
  - Experiência nativa
  - Cache inteligente

## 🚀 Como Usar

### Instalação

#### Uso Web
1. Clone ou baixe o projeto
2. Abra `equiqueras/index.html` no navegador
3. Pronto! Não precisa de servidor ou instalação

#### Instalação como PWA (Recomendado)
1. Acesse o site pelo navegador (Chrome/Edge/Safari)
2. Clique no botão "📱 Instalar App" que aparece no canto inferior direito
3. Ou use o menu do navegador: "Instalar aplicativo" / "Adicionar à tela inicial"
4. O app será instalado e funcionará offline

**Vantagens do PWA:**
- ✅ Acesso rápido pela tela inicial
- ✅ Funciona sem internet
- ✅ Experiência de app nativo
- ✅ Não ocupa espaço na loja de apps

### Uso Básico

#### 1. Adicionar Produto
```
1. Digite o nome do produto em "Novo produto"
2. Clique em "Adicionar"
3. Configure a validade padrão (opcional)
```

#### 2. Imprimir Etiqueta Individual
```
1. Selecione o produto
2. Defina fabricação (padrão: hoje)
3. Validade é calculada automaticamente
4. Adicione peso, lote ou observações (opcional)
5. Defina quantidade
6. Clique em "Imprimir"
```

#### 3. Imprimir Fila de Etiquetas
```
1. Configure o primeiro produto
2. Clique em "Adicionar à fila"
3. Configure outros produtos e adicione à fila
4. Clique em "Imprimir fila"
```

#### 4. Criar Atalho
```
1. Configure produto(s) e adicione à fila
2. Clique em "Salvar como atalho"
3. Dê um nome descritivo
4. Use o atalho para impressão rápida futura
```

### Atalhos de Teclado

- `Ctrl + P` - Abre janela de impressão
- `Esc` - Cancela impressão

## 🖨️ Configuração de Impressão

### Configurações Recomendadas

- **Tamanho do papel**: A4 ou Letter
- **Orientação**: Retrato
- **Margens**: Nenhuma ou Mínimas (0mm)
- **Escala**: 100% (sem ajuste)
- **Cabeçalhos/Rodapés**: Desabilitados
- **Cor de fundo**: Habilitada

### Impressoras Compatíveis

✅ **Impressoras térmicas de etiquetas**
- Zebra, TSC, Brother QL, Argox
- Configurar papel 60x40mm no driver

✅ **Impressoras jato de tinta/laser**
- Usar papel A4 com etiquetas adesivas
- Ajustar layout conforme necessário

✅ **Impressoras Bluetooth**
- Parear no Windows antes de usar
- Instalar driver específico se necessário

## 📱 Responsividade

### Mobile (< 768px)
- **Menu hambúrguer** - Controles em painel deslizante
- Layout de coluna única
- Botões full-width empilhados verticalmente
- Cards de atalhos e histórico otimizados
- Preview oculto (economia de espaço)
- Etiquetas redimensionadas automaticamente
- Touch-friendly com scroll suave

### Mobile Pequeno (< 480px)
- Escala adicional para etiquetas (65%)
- Chips de validade distribuídos uniformemente
- Histórico compacto (180px altura)
- Padding reduzido para maximizar espaço

### Tablet (640px - 1024px)
- Grid de 2 colunas nos formulários
- Preview oculto
- Botões com tamanho flexível

### Desktop (1024px+)
- Layout lado a lado: controles + preview
- Preview em tempo real visível
- Grid otimizado de 2 colunas

## 🗂️ Estrutura do Projeto

```
equiqueras/
├── index.html          # Página principal
├── etiquetas.css       # Estilos e responsividade
├── etiquetas.js        # Lógica da aplicação
├── manifest.json       # Configuração PWA
├── sw.js              # Service Worker (cache offline)
├── icon.svg           # Ícone vetorial
├── icon-192.png       # Ícone 192x192 (gerar)
├── icon-512.png       # Ícone 512x512 (gerar)
├── generate-icons.html # Gerador de ícones PNG
└── README.md          # Este arquivo
```

## 💾 Armazenamento de Dados

Todos os dados são salvos localmente no navegador usando **localStorage**:

- **Produtos**: Lista de produtos e validades padrão
- **Atalhos**: Configurações salvas para impressão rápida
- **Histórico**: Últimas 500 impressões
- **Configurações**: Preferências do usuário

⚠️ **Importante**: Os dados são específicos do navegador. Limpar cache/dados do navegador apagará tudo.

## 🔧 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e responsividade
- **JavaScript (Vanilla)** - Lógica da aplicação
- **LocalStorage API** - Persistência de dados
- **Print API** - Impressão nativa do navegador
- **Service Worker API** - Cache offline e PWA
- **Web App Manifest** - Instalação como app
- **JsBarcode** - Geração de códigos de barras
- **QRCode.js** - Geração de QR Codes

## 🎨 Gerando Ícones PWA

Para gerar os ícones PNG necessários para o PWA:

1. Abra `generate-icons.html` no navegador
2. Clique em "🚀 Gerar Ícones"
3. Baixe `icon-192.png` e `icon-512.png`
4. Salve os arquivos na pasta raiz do projeto

Os ícones são gerados automaticamente a partir do SVG incluído.

## 📊 Funcionalidades Avançadas

### Validade Automática

O sistema calcula automaticamente a data de validade baseado em:
- Produto selecionado
- Validade padrão configurada (dias ou meses)
- Data de fabricação

### Atalhos Inteligentes

Atalhos salvam:
- Fila completa de produtos
- Quantidades individuais
- Observações específicas
- Configurações de código

Ao usar um atalho:
- Fabricação = hoje
- Validade recalculada automaticamente
- Mantém todas as outras configurações

### Histórico Exportável

Exportação CSV inclui:
- Timestamp
- Produto
- Fabricação
- Validade
- Peso
- Lote
- Observações
- Payload do código

## 🐛 Solução de Problemas

### Impressão em branco
1. Verifique se há etiquetas na fila
2. Abra F12 → Console para ver logs
3. Configure margens como "Nenhuma"
4. Habilite "Gráficos de fundo"

### Atalho não funciona
1. Abra F12 → Console
2. Verifique se há erros
3. Tente recriar o atalho
4. Limpe o cache do navegador

### Dados perdidos
- Dados são salvos no navegador
- Não limpe cache/cookies
- Faça backup exportando histórico
- Use sempre o mesmo navegador

## 📝 Exemplos de Uso

### Exemplo 1: Padaria
```
Produto: Pão Francês
Fabricação: Hoje
Validade: 3 dias
Quantidade: 50 etiquetas
```

### Exemplo 2: Restaurante Japonês
```
Fila:
- Shari (5 etiquetas) - Validade 5 dias
- Cream Cheese (3 etiquetas) - Validade 7 dias
- Kaní (2 etiquetas) - Validade 3 dias

Salvar como: "Kit Sushi Diário"
```

### Exemplo 3: Produção Artesanal
```
Produto: Geleia de Morango
Fabricação: Hoje
Validade: 3 meses
Lote: 2025-10-20-A
Obs: Sem conservantes
Código QR: GELEIA-MORANGO-001
```

## 🎨 Personalização

### Alterar tamanho da etiqueta

Edite em `etiquetas.css`:
```css
.label {
  width: 60mm;  /* Largura */
  height: 40mm; /* Altura */
}
```

### Alterar cores

Edite as variáveis de cor em `etiquetas.css`:
```css
background: #0b0f17;  /* Fundo escuro */
color: #e9eef5;       /* Texto claro */
```

### Adicionar logo

Edite `createLabelElement()` em `etiquetas.js` para incluir imagem.

## 📄 Licença

Este projeto é de código aberto. Sinta-se livre para usar, modificar e distribuir.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas!

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção "Solução de Problemas"
2. Abra F12 → Console para logs de debug
3. Verifique se está usando a versão mais recente

---

**Versão**: 2.0.0  
**Última atualização**: Outubro 2025  
**Compatibilidade**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+  
**PWA**: ✅ Instalável | ✅ Offline | ✅ Mobile-first
