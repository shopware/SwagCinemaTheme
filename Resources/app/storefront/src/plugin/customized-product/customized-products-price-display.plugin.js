import DomAccess from 'src/helper/dom-access.helper';
import HttpClient from 'src/service/http-client.service';
import ElementLoadingIndicatorUtil from 'src/utility/loading-indicator/element-loading-indicator.util';
import Debouncer from 'src/helper/debouncer.helper';

function wrapper() {
    try {
        const SwagCustomizedProductPriceDisplay = window.PluginManager.getPlugin('SwagCustomizedProductPriceDisplay').get('class');

        class CinemaCustomizedProductPriceDisplay extends SwagCustomizedProductPriceDisplay {
            init() {
                this.client = new HttpClient();
                this.priceDisplayHolder = DomAccess.querySelector(document, '.swag-customized-product__price-display-holder');
                this.buyForm = DomAccess.querySelector(document, '#productDetailPageBuyProductForm');
                this.buyButton = DomAccess.querySelector(this.buyForm, SwagCustomizedProductPriceDisplay.options.buyButtonSelector);

                this.onFormChange();

                this.buyForm.addEventListener(
                    'change',
                    Debouncer.debounce(
                        this.onFormChange.bind(this),
                        SwagCustomizedProductPriceDisplay.options.debounceTimeout
                    )
                );
            }

            /**
             * Event listener which will be triggered when the user enters any data into the form.
             *
             * @event change
             * @returns {void}
             */
            onFormChange() {
                const data = new FormData(this.buyForm);
                data.set('_csrf_token', this.options.csrfToken);

                ElementLoadingIndicatorUtil.create(this.priceDisplayHolder);

                this.client.post(this.options.url, data, this.onTemplateReceived.bind(this));
            }
        }
        return CinemaCustomizedProductPriceDisplay;
    } catch (e) { }
}

export default wrapper()
