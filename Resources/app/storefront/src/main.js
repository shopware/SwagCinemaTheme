import BackButtonPlugin from './plugin/product-detail/back-button';

const PluginManager = window.PluginManager;

PluginManager.register('BackButton', BackButtonPlugin, '[data-back-button]');
