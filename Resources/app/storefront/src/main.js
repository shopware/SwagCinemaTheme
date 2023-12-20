const PluginManager = window.PluginManager;

PluginManager.register('BackButton', () => import('./plugin/product-detail/back-button'), '[data-back-button]');
PluginManager.register('CustomSelect', () => import('./plugin/listing/cinema-custom-select.plugin'), '[data-custom-select]')
PluginManager.override('Listing', () => import('./plugin/listing/cinema-listing.plugin'), '[data-listing]');
PluginManager.override('FilterRatingSelect', () => import('./plugin/listing/cinema-filter-rating-select.plugin'), '[data-filter-rating-select]');

if (PluginManager.getPluginList().SwagCustomizedProductsStepByStepWizard) {
    PluginManager.override('SwagCustomizedProductsStepByStepWizard', () => import('./plugin/customized-product/customized-product-step.plugin'), '*[data-swag-customized-product-step-by-step="true"]');
}

if (PluginManager.getPluginList().SwagCustomizedProductPriceDisplay) {
    PluginManager.override('SwagCustomizedProductPriceDisplay', () => import('./plugin/customized-product/customized-products-price-display.plugin'), '[data-swag-customized-product-price-display="true"]',);
}
