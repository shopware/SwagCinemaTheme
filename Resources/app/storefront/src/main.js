import BackButtonPlugin from './plugin/product-detail/back-button';
import CinemaListingPlugin from './plugin/listing/cinema-listing.plugin';

const PluginManager = window.PluginManager;

PluginManager.register('BackButton', BackButtonPlugin, '[data-back-button]');
PluginManager.override('Listing', CinemaListingPlugin, '[data-listing]');
