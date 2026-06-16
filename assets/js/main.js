/**
 * CARDÁPIO DIGITAL — Sabor & Cia
 * Sistema de filtros, carrinho, checkout e gerenciamento de pedidos
 */

// =====================================================
// INICIALIZAÇÃO
// =====================================================
document.addEventListener('DOMContentLoaded', initMenu);

/**
 * Inicializa o sistema de menu e event listeners
 */
function initMenu() {
  setupFilterButtons();
  setupAddToCartButtons();
  setupOrderSummary();
  loadCartFromStorage();
  updateOrderSummary();
  logPerformance('Menu initialized');
}

// =====================================================
// FILTROS DE CATEGORIA
// =====================================================

/**
 * Configura os event listeners para os botões de filtro
 */
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach((button) => {
    button.addEventListener('click', handleFilterClick);
    button.addEventListener('keydown', handleFilterKeydown);
  });
}

/**
 * Manipula clique em botão de filtro
 * @param {Event} event - O evento de clique
 */
function handleFilterClick(event) {
  const selectedButton = event.currentTarget;
  const selectedCategory = selectedButton.getAttribute('data-category');
  
  // Remove estado ativo de todos os botões
  document
    .querySelectorAll('.filter-btn')
    .forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
  
  // Ativa o botão clicado
  selectedButton.classList.add('active');
  selectedButton.setAttribute('aria-pressed', 'true');
  
  // Filtra os cards
  filterCards(selectedCategory);
  
  // Analytics
  logFilter(selectedCategory);
}

/**
 * Manipula navegação via teclado (Enter/Space)
 * @param {KeyboardEvent} event - O evento de teclado
 */
function handleFilterKeydown(event) {
  // Enter ou Space ativa o botão
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

/**
 * Filtra os cards do cardápio por categoria
 * @param {string} category - A categoria selecionada
 */
function filterCards(category) {
  const allCards = document.querySelectorAll('.menu-card');
  const emptyMessage = document.querySelector('.menu-empty-message');
  let visibleCount = 0;
  
  allCards.forEach((card) => {
    const cardCategory = card.getAttribute('data-category');
    
    // Mostra ou esconde o card baseado na categoria
    if (category === 'all' || cardCategory === category) {
      showCard(card);
      visibleCount++;
    } else {
      hideCard(card);
    }
  });
  
  // Mostra/esconde mensagem de estado vazio
  if (visibleCount === 0) {
    emptyMessage.removeAttribute('hidden');
    emptyMessage.setAttribute('aria-live', 'polite');
    emptyMessage.setAttribute('role', 'status');
  } else {
    emptyMessage.setAttribute('hidden', '');
  }
}

/**
 * Anima a exibição de um card
 * @param {HTMLElement} card - O elemento do card
 */
function showCard(card) {
  card.classList.remove('hidden', 'fade-out');
  // Força reflow para ativar animação
  void card.offsetWidth;
}

/**
 * Anima o ocultamento de um card
 * @param {HTMLElement} card - O elemento do card
 */
function hideCard(card) {
  card.classList.add('hidden');
}

// =====================================================
// CARRINHO E ADICIONAR ITENS
// =====================================================

/**
 * Armazena itens adicionados ao pedido
 * @type {Array<Object>}
 */
let cart = [];

/**
 * Flag para aplicar taxa de serviço
 * @type {boolean}
 */
let applyServiceTax = false;

/**
 * Configura os event listeners para os botões "Adicionar"
 */
function setupAddToCartButtons() {
  const addButtons = document.querySelectorAll('.menu-card-btn');
  
  addButtons.forEach((button) => {
    button.addEventListener('click', handleAddToCart);
  });
}

/**
 * Manipula o clique no botão "Adicionar"
 * @param {Event} event - O evento de clique
 */
function handleAddToCart(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const button = event.currentTarget;
  const card = button.closest('.menu-card');
  
  // Extrai dados do card
  const itemName = card.querySelector('.menu-card-name').textContent;
  const priceText = card.querySelector('.menu-card-price').textContent;
  const price = extractPrice(priceText);
  
  // Verifica se o item já está no carrinho
  const existingItem = cart.find(item => item.name === itemName);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    const item = {
      id: Math.random().toString(36).substring(7),
      name: itemName,
      price: price,
      quantity: 1,
      timestamp: Date.now(),
    };
    cart.push(item);
  }
  
  // Salva no localStorage
  localStorage.setItem('sabor-cia-cart', JSON.stringify(cart));
  
  // Atualiza UI
  updateOrderSummary();
  animateAddButton(button);
  showNotification(`${itemName} adicionado ao pedido!`, 'success');
  logAddToCart(itemName, price);
}

/**
 * Extrai o valor numérico do preço formatado
 * @param {string} priceText - Texto do preço (ex: "R$ 32,90")
 * @returns {number} Preço como número
 */
function extractPrice(priceText) {
  return parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
}

/**
 * Anima o botão "Adicionar" com feedback visual
 * @param {HTMLElement} button - O botão clicado
 */
function animateAddButton(button) {
  const originalText = button.textContent;
  
  button.textContent = '✓ Adicionado';
  button.style.backgroundColor = '#4ADE80';
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.backgroundColor = '';
  }, 2000);
}

// =====================================================
// RESUMO DE PEDIDO E GERENCIAMENTO
// =====================================================

/**
 * Configura event listeners do resumo de pedido
 */
function setupOrderSummary() {
  const applyTaxCheckbox = document.getElementById('applyTaxCheckbox');
  const callWaiterBtn = document.getElementById('callWaiterBtn');
  const closeCheckBtn = document.getElementById('closeCheckBtn');
  
  if (applyTaxCheckbox) {
    applyTaxCheckbox.addEventListener('change', handleTaxToggle);
  }
  
  if (callWaiterBtn) {
    callWaiterBtn.addEventListener('click', handleCallWaiter);
  }
  
  if (closeCheckBtn) {
    closeCheckBtn.addEventListener('click', handleCloseCheck);
  }
}

/**
 * Manipula o toggle de taxa de serviço
 * @param {Event} event - O evento de change
 */
function handleTaxToggle(event) {
  applyServiceTax = event.target.checked;
  updateOrderSummary();
}

/**
 * Atualiza a visualização do resumo de pedido
 */
function updateOrderSummary() {
  const container = document.getElementById('orderItemsContainer');
  const subtotalEl = document.getElementById('subtotalAmount');
  const taxEl = document.getElementById('taxAmount');
  const totalEl = document.getElementById('totalAmount');
  
  if (!container) return;
  
  // Se carrinho vazio
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="order-empty-state text-center py-12">
        <p class="text-brand-muted text-lg mb-4">
          🛒 Seu carrinho está vazio
        </p>
        <p class="text-brand-muted text-sm">
          Selecione itens do cardápio acima para começar seu pedido
        </p>
      </div>
    `;
    
    subtotalEl.textContent = 'R$ 0,00';
    taxEl.textContent = 'R$ 0,00';
    totalEl.textContent = 'R$ 0,00';
    return;
  }
  
  // Renderiza itens do carrinho
  const itemsHTML = cart.map(item => `
    <div class="order-item" data-item-id="${item.id}">
      <div class="order-item-info">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      
      <div class="order-item-controls">
        <button class="qty-btn qty-btn-decrease" data-item-id="${item.id}" aria-label="Diminuir quantidade">−</button>
        <div class="qty-display">${item.quantity}</div>
        <button class="qty-btn qty-btn-increase" data-item-id="${item.id}" aria-label="Aumentar quantidade">+</button>
      </div>
      
      <button class="order-item-remove" data-item-id="${item.id}" aria-label="Remover item">✕</button>
    </div>
  `).join('');
  
  container.innerHTML = itemsHTML;
  
  // Adiciona event listeners aos botões
  container.querySelectorAll('.qty-btn-decrease').forEach(btn => {
    btn.addEventListener('click', () => decreaseQuantity(btn.getAttribute('data-item-id')));
  });
  
  container.querySelectorAll('.qty-btn-increase').forEach(btn => {
    btn.addEventListener('click', () => increaseQuantity(btn.getAttribute('data-item-id')));
  });
  
  container.querySelectorAll('.order-item-remove').forEach(btn => {
    btn.addEventListener('click', () => removeItem(btn.getAttribute('data-item-id')));
  });
  
  // Calcula totais
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = applyServiceTax ? subtotal * 0.1 : 0;
  const total = subtotal + tax;
  
  subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  taxEl.textContent = `R$ ${tax.toFixed(2)}`;
  totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

/**
 * Aumenta a quantidade de um item
 * @param {string} itemId - ID do item
 */
function increaseQuantity(itemId) {
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity++;
    localStorage.setItem('sabor-cia-cart', JSON.stringify(cart));
    updateOrderSummary();
  }
}

/**
 * Diminui a quantidade de um item
 * @param {string} itemId - ID do item
 */
function decreaseQuantity(itemId) {
  const item = cart.find(i => i.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity--;
    localStorage.setItem('sabor-cia-cart', JSON.stringify(cart));
    updateOrderSummary();
  }
}

/**
 * Remove um item do carrinho
 * @param {string} itemId - ID do item
 */
function removeItem(itemId) {
  const index = cart.findIndex(i => i.id === itemId);
  if (index !== -1) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('sabor-cia-cart', JSON.stringify(cart));
    updateOrderSummary();
    showNotification(`${removedItem.name} removido do pedido`, 'info');
  }
}

// =====================================================
// CHAMAR GARÇOM
// =====================================================

/**
 * Manipula o clique em "Chamar Garçom"
 */
function handleCallWaiter() {
  const modal = createWaiterModal();
  document.body.appendChild(modal);
  
  // Auto-fecha após 5 segundos
  setTimeout(() => {
    const existingModal = document.querySelector('.waiter-modal');
    if (existingModal) {
      existingModal.remove();
    }
  }, 5000);
  
  logWaiterCall();
}

/**
 * Cria o modal de chamar garçom
 * @returns {HTMLElement} Elemento do modal
 */
function createWaiterModal() {
  const modal = document.createElement('div');
  modal.className = 'waiter-modal';
  modal.innerHTML = `
    <div class="waiter-modal-content">
      <div class="waiter-modal-icon">🔔</div>
      <h3 class="waiter-modal-title">Garçom Chamado!</h3>
      <p class="waiter-modal-message">
        Um garçom irá atendê-lo em breve.
      </p>
      <div class="waiter-modal-actions">
        <button class="waiter-modal-btn waiter-modal-btn--secondary waiter-modal-close" onclick="this.closest('.waiter-modal').remove()">
          Fechar
        </button>
      </div>
    </div>
  `;
  
  // Fecha ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  return modal;
}

// =====================================================
// FECHAR CONTA
// =====================================================

/**
 * Manipula o clique em "Fechar Conta"
 */
function handleCloseCheck() {
  if (cart.length === 0) {
    showNotification('Adicione itens ao pedido para fechar a conta', 'error');
    return;
  }
  
  const modal = createCheckoutModal();
  document.body.appendChild(modal);
  
  logCheckout();
}

/**
 * Cria o modal de fechamento de conta
 * @returns {HTMLElement} Elemento do modal
 */
function createCheckoutModal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = applyServiceTax ? subtotal * 0.1 : 0;
  const total = subtotal + tax;
  
  const itemsHTML = cart.map(item => `
    <div class="checkout-item">
      <span>${item.quantity}x ${item.name}</span>
      <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');
  
  const modal = document.createElement('div');
  modal.className = 'checkout-modal';
  modal.innerHTML = `
    <div class="checkout-modal-content">
      <button class="checkout-modal-close" onclick="this.closest('.checkout-modal').remove()">✕</button>
      
      <div class="checkout-modal-header">
        <h3>💳 Resumo da Conta</h3>
      </div>
      
      <div class="checkout-modal-body">
        ${itemsHTML}
        
        <div class="checkout-summary">
          <div class="checkout-row">
            <span>Subtotal:</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
          </div>
          ${applyServiceTax ? `
            <div class="checkout-row">
              <span>Taxa de serviço (10%):</span>
              <span>R$ ${tax.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="checkout-row">
            <span>TOTAL:</span>
            <span>R$ ${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="checkout-actions">
          <button class="checkout-btn checkout-btn--confirm" onclick="completePayment()">
            ✓ Confirmar Pagamento
          </button>
          <button class="checkout-btn checkout-btn--cancel" onclick="this.closest('.checkout-modal').remove()">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Fecha ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  return modal;
}

/**
 * Completa o pagamento e limpa o carrinho
 */
function completePayment() {
  const modal = document.querySelector('.checkout-modal');
  
  // Remove modal
  if (modal) modal.remove();
  
  // Limpa carrinho
  cart = [];
  applyServiceTax = false;
  localStorage.removeItem('sabor-cia-cart');
  
  // Reset checkbox
  const checkbox = document.getElementById('applyTaxCheckbox');
  if (checkbox) checkbox.checked = false;
  
  // Atualiza UI
  updateOrderSummary();
  
  // Mostra confirmação
  showNotification('Pagamento confirmado! Obrigado pela visita! 🎉', 'success');
  
  logPaymentComplete();
}

/**
 * Exibe uma notificação toast ao usuário
 * @param {string} message - A mensagem a exibir
 * @param {string} type - O tipo: 'success', 'error', 'info'
 */
function showNotification(message, type = 'info') {
  // Cria o elemento da notificação
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  
  // Estilos inline para flexibilidade
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    background-color: ${type === 'success' ? '#4ADE80' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    border-radius: 0.5rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideInUp 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 90vw;
    word-break: break-word;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remove após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutDown 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// =====================================================
// ANIMAÇÕES CSS
// =====================================================

if (!document.querySelector('style[data-animations]')) {
  const style = document.createElement('style');
  style.setAttribute('data-animations', '');
  style.textContent = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(2rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideOutDown {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(2rem);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

// =====================================================
// UTILIDADES E ANALYTICS
// =====================================================

/**
 * Log de performance
 * @param {string} message - Mensagem de log
 */
function logPerformance(message) {
  console.log(`⚡ ${message}`);
}

/**
 * Log de ação de filtro
 * @param {string} category - Categoria selecionada
 */
function logFilter(category) {
  console.log(`🔍 Filtro aplicado: ${category}`);
  
  // Aqui você poderia enviar para um serviço de analytics
  // sendAnalytics('filter_applied', { category });
}

/**
 * Log de item adicionado
 * @param {string} itemName - Nome do item
 * @param {number} price - Preço do item
 */
function logAddToCart(itemName, price) {
  console.log(`🛒 Item adicionado: ${itemName} (R$ ${price.toFixed(2)})`);
}

/**
 * Log de chamar garçom
 */
function logWaiterCall() {
  console.log('📞 Garçom chamado em:', new Date().toLocaleTimeString('pt-BR'));
}

/**
 * Log de checkout
 */
function logCheckout() {
  console.log('💳 Solicitação de fechamento de conta');
}

/**
 * Log de pagamento completado
 */
function logPaymentComplete() {
  console.log('✅ Pagamento confirmado!');
}

/**
 * Carrega itens salvos do localStorage ao iniciar
 */
function loadCartFromStorage() {
  const savedCart = localStorage.getItem('sabor-cia-cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      console.log('🔄 Carrinho carregado do localStorage');
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  }
}

// =====================================================
// API GLOBAL PARA DEBUGGING
// =====================================================

window.MenuApp = {
  clearCart: () => {
    cart = [];
    localStorage.removeItem('sabor-cia-cart');
    updateOrderSummary();
    showNotification('Carrinho limpo', 'info');
  },
  getCartTotal: () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getCartSummary: () => ({
    items: cart.length,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    formattedTotal: `R$ ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`,
    details: cart,
  }),
  cart: () => cart,
  applyServiceTax: () => applyServiceTax,
};

console.log('💡 MenuApp disponível no console: window.MenuApp');
