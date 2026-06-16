# 🍽️ Cardápio Digital — Sabor & Cia

Um **cardápio digital interativo** moderno e responsivo desenvolvido para restaurante com sistema completo de gerenciamento de pedidos, filtros por categoria e checkout integrado.

---

## 📋 Características Principais

### ✅ Funcionalidades Implementadas

#### 1. **Sistema de Filtros por Categoria**
- 6 categorias disponíveis: Lanches, Pratos, Bebidas, Vegano, Sobremesas e Tudo
- Filtros com feedback visual (ativo/inativo)
- Animações suaves na transição de categorias
- Remoção dinâmica de itens não correspondentes

#### 2. **Cardápio Digital Completo**
- 8 pratos/bebidas com:
  - Imagens em alta qualidade
  - Nomes descritivos
  - Descrições detalhadas
  - Preços formatados (R$ XX,XX)
  - Badges de categoria
  - Badge especial para itens veganos (🌱)
  
#### 3. **Sistema de Carrinho**
- Adição rápida de itens ao pedido
- Consolidação automática de quantidades (não duplica itens)
- Persistência em **localStorage** (carrinho mantém dados após reload)
- Aumento/diminuição de quantidade com botões
- Remoção individual de itens

#### 4. **Resumo do Pedido em Tempo Real**
- Renderização dinâmica de itens adicionados
- Cálculo automático de subtotal
- **Taxa de Serviço (10%)** com checkbox toggle
- Total final com ou sem taxa
- Estado vazio elegante quando carrinho está vazio

#### 5. **Gerenciamento de Conta**
- **🔔 Chamar Garçom**: Modal que avisa quando garçom é chamado (auto-fecha após 5s)
- **💳 Fechar Conta**: Modal com:
  - Resumo itemizado de todos os pedidos
  - Subtotal individual de cada item
  - Taxa de serviço aplicada (se ativada)
  - **Total final** em destaque
  - Confirmação de pagamento

#### 6. **Sistema de Notificações**
- Toast notifications elegantes
- Feedback de ações do usuário
- Sucesso (verde), erro (vermelho), info (azul)
- Auto-desaparecimento após 3 segundos

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos customizados + animações |
| **JavaScript ES6+** | Lógica de negócio e interações |
| **Tailwind CSS v3** | Framework CSS utilitário (CDN) |

### Bibliotecas & APIs
- **Google Fonts**: Playfair Display (títulos) + Inter (corpo)
- **localStorage**: Persistência de carrinho
- **Vanilla DOM API**: Manipulação de elementos

### Design & UX
- **Responsivo**: Mobile-first com breakpoints (640px, 1024px)
- **Dark Theme**: Paleta de cores sofisticada
- **Animações**: Transições suaves (slideIn, fadeIn, bounce)
- **Acessibilidade**: ARIA labels, semantic HTML, keyboard navigation

---

## 🎨 Paleta de Cores

```
Brand Background:  #0F1117 (Preto azulado)
Surface/Cards:     #1A1D27 (Cinza escuro)
Accent:            #E8A020 (Âmbar quente)
Verde Vegano:      #4ADE80 (Verde claro)
Texto Principal:   #E8E9F0 (Branco quase)
Texto Secundário:  #7C7F96 (Cinza)
Border:            #2A2D3A (Cinza borda)
```

---

## 📁 Estrutura do Projeto

```
Trabalho Final/
├── index.html                    # Arquivo HTML principal
├── README.md                     # Este arquivo
└── assets/
    ├── css/
    │   └── styles.css           # Estilos customizados (~800 linhas)
    ├── js/
    │   └── main.js              # Lógica JavaScript (~700 linhas)
    └── images/
        ├── logo.png             # Logo do restaurante
        ├── hamburguer.jpg       # X-Burger Artesanal
        ├── frango-grelhado-ao-pesto.jpg  # Frango Grelhado
        ├── suco-de-laranja-natural.jpg   # Suco de Laranja
        ├── buddha-bowl.jpg      # Buddha Bowl (Vegano)
        ├── petit_gateau.png     # Petit Gateau
        ├── Wrap-de-legumes.jpg  # Wrap de Legumes (Vegano)
        ├── LATAS-NO-GELO.png    # Refrigerante Lata
        └── hot-dog.png          # Hot Dog Gourmet
```

---

## 🚀 Como Usar

### 1. Abrir a Página
Simplesmente abra `index.html` em qualquer navegador moderno:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 2. Navegar pelo Cardápio
- Clique nos botões de categoria para filtrar itens
- Clique em "+ Adicionar" para adicionar um item ao pedido

### 3. Gerenciar o Carrinho
- Use os botões **−** e **+** para ajustar quantidades
- Clique em **✕** para remover um item
- Ative o checkbox para aplicar 10% de taxa de serviço

### 4. Finalizar Pedido
- **🔔 Chamar Garçom**: Avisa o atendente que você precisa
- **💳 Fechar Conta**: Visualiza o resumo e confirma pagamento

---

## 📊 Dados do Cardápio

| Item | Categoria | Preço | Vegano |
|------|-----------|-------|--------|
| X-Burger Artesanal | Lanches | R$ 32,90 | ❌ |
| Frango Grelhado | Pratos | R$ 38,00 | ❌ |
| Suco de Laranja | Bebidas | R$ 12,00 | ✅ |
| Buddha Bowl | Vegano | R$ 36,50 | ✅ |
| Petit Gateau | Sobremesas | R$ 28,00 | ❌ |
| Wrap de Legumes | Vegano | R$ 24,90 | ✅ |
| Refrigerante Lata | Bebidas | R$ 7,00 | ❌ |
| Hot Dog Gourmet | Lanches | R$ 22,00 | ❌ |

---

## 💾 Dados Persistidos

O projeto utiliza **localStorage** com a chave `sabor-cia-cart` para armazenar:
```javascript
[
  {
    id: "unique-id",
    name: "Nome do item",
    price: 32.90,
    quantity: 2,
    timestamp: 1718546400000
  }
]
```

**Benefício**: O carrinho é mantido mesmo após fechar e reabrir o navegador!

---

## 🎯 Funcionalidades Avançadas

### 1. Cálculo de Totais
```javascript
Subtotal = Σ(preço × quantidade)
Taxa (10%) = Subtotal × 0.10 (opcional)
Total = Subtotal + Taxa
```

### 2. Animações CSS
- **slideIn**: Cards aparecem com efeito de entrada (400ms)
- **slideInUp**: Modal de checkout sobe suavemente (300ms)
- **fadeIn**: Notificações aparecem com fade (300ms)
- **bounce**: Botões têm efeito de bounce ao hover

### 3. Event Delegation
- Usa delegação de eventos para máxima performance
- Event listeners aplicados uma única vez ao carregar

### 4. Responsividade
```
Mobile (< 640px):   1 coluna, padding reduzido
Tablet (640-1024px): 2 colunas
Desktop (> 1024px):  3 colunas
```

---

## 🔧 Tailwind CSS - Validação

✅ **Tailwind está 100% funcional** no projeto:
- Classes utilitárias aplicadas corretamente (max-w-6xl, px-4, sm:px-6, etc.)
- Cores customizadas via `tailwind.config` funcionando
- Breakpoints respondendo corretamente
- Backdrop blur, sticky positioning e z-index funcionando
- Flexbox e grid utilities aplicados com sucesso

---

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

---

## 🔐 Acessibilidade

- Semântica HTML5 correta (header, main, footer, etc.)
- ARIA labels em elementos interativos
- Keyboard navigation completa
- Contraste de cores acessível
- Imagens com alt text descritivos
- `aria-label` em categorias e funcionalidades

---

## 📝 Notas Técnicas

### JavaScript Vanilla (sem frameworks)
- Manipulação direta do DOM
- Event listeners estratégicos
- Funções puras onde possível
- Logging para debug
- Global API exposta: `window.MenuApp`

### CSS Customizado
- ~800 linhas de estilos específicos
- Animações keyframe customizadas
- Modal com backdrop blur
- Efeitos hover suaves
- Transitions em todos os elementos interativos

### Arquitetura
```
index.html (estrutura)
├── Tailwind CDN (utilitários)
├── styles.css (detalhes + animações)
└── main.js (lógica + interatividade)
```

---

## 🎓 Aprendizados Principais

### ✨ O que Funcionou Bem
1. **localStorage**: Excelente para persistência sem backend
2. **Event Delegation**: Eficiente para múltiplos elementos
3. **Tailwind + CSS Customizado**: Combinação perfeita de velocidade + flexibilidade
4. **Estrutura Modular**: Funções bem separadas por responsabilidade
5. **Animações CSS**: Melhor performance que JavaScript animations

### 🔑 Pontos de Melhoria (Futuro)
1. Adicionar backend (Node.js/Express) para servidor real
2. Banco de dados (MongoDB/PostgreSQL) para persistência
3. Autenticação de usuários
4. Sistema de pedidos com histórico
5. Admin dashboard para gerenciar cardápio
6. Push notifications para notificação de pedidos prontos
7. Integração com pagamento (Stripe/PagSeguro)
8. PWA (Progressive Web App) para offline-first

---

## 👨‍💻 Desenvolvimento

### Requisitos para Edição
- Editor de código (VS Code, Sublime, etc.)
- Navegador moderno (Chrome/Firefox recomendado)
- Nenhuma dependência a instalar!

### Modificar Itens do Cardápio
Edite a estrutura HTML dos cards em `index.html` linhas 195-550

### Modificar Estilos
Edite `assets/css/styles.css` para customizações de design

### Modificar Lógica
Edite `assets/js/main.js` para funcionalidades novas

---

## 📄 Licença

Este projeto foi desenvolvido como trabalho de conclusão para a disciplina **CAW (Construção de Aplicações Web)** e está disponível para uso educacional.

---

## 📞 Contato & Suporte

**Restaurante**: Sabor & Cia  
**Telefone**: (21) 9 9999-9999  
**Desenvolvedor**: Sistema Digital do Cardápio  

---

## 🙏 Agradecimentos

- Tailwind CSS pela excelente framework
- Google Fonts pelas tipografias
- Comunidade JavaScript pela inspiração
- Professores da CAW pelos ensinamentos

---

**Versão**: 1.0  
**Data**: Junho 2026  
**Status**: ✅ Completo e Funcional

