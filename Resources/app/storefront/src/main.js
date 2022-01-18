import BackButtonPlugin from './plugin/product-detail/back-button';
import CinemaListingPlugin from './plugin/listing/cinema-listing.plugin';
import CustomizedProductsStepByStepWizard from "./plugin/customized-product/customized-product-step.plugin";
import CinemaCustomizedProductPriceDisplay from "./plugin/customized-product/customized-products-price-display.plugin";
import CinemaZoomModalPlugin from './plugin/zoom-modal/zoom-modal.plugin';

const PluginManager = window.PluginManager;

PluginManager.register('BackButton', BackButtonPlugin, '[data-back-button]');
PluginManager.override('Listing', CinemaListingPlugin, '[data-listing]');
PluginManager.override('ZoomModal', CinemaZoomModalPlugin, '[data-zoom-modal]');

if (PluginManager.getPluginList().SwagCustomizedProductsStepByStepWizard) {
    PluginManager.override('SwagCustomizedProductsStepByStepWizard', CustomizedProductsStepByStepWizard, '*[data-swag-customized-product-step-by-step="true"]');
}

if (PluginManager.getPluginList().SwagCustomizedProductPriceDisplay) {
    PluginManager.override('SwagCustomizedProductPriceDisplay', CinemaCustomizedProductPriceDisplay, '[data-swag-customized-product-price-display="true"]',);
}
