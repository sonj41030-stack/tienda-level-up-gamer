document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('input-search');
    const orderSelect = document.getElementById('select-order');
    const productGrid = document.querySelector('.product-grid');

    if (!searchInput || !orderSelect || !productGrid) return;

    const initialProducts = Array.from(productGrid.querySelectorAll('.product-card'));

    function getProductPrice(card) {
        const button = card.querySelector('.btn-add-cart');
        if (button && button.dataset.precio) {
            return parseFloat(button.dataset.precio);
        }
        const priceText = card.querySelector('.price')?.textContent || '0';
        return parseFloat(priceText.replace(/[^0-9]/g, ''));
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const orderValue = orderSelect.value;

        let visibleProducts = initialProducts.filter(card => {
            const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
            const matchesSearch = title.includes(searchTerm);
            
            card.style.display = matchesSearch ? '' : 'none';
            return matchesSearch;
        });

        if (orderValue === 'price-asc') {
            visibleProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        } else if (orderValue === 'price-desc') {
            visibleProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        }

        visibleProducts.forEach(card => productGrid.appendChild(card));
    }

    searchInput.addEventListener('input', applyFilters);
    orderSelect.addEventListener('change', applyFilters);
});