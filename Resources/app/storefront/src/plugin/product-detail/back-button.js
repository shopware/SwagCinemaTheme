// SwagCinemaTheme Copyright (C) 2025 shopware AG

import Plugin from 'src/plugin-system/plugin.class';

export default class BackButton extends Plugin {

    init() {
        this._handleBackButton();
    }

    /**
     * Register events to handle hide navigation item
     * when viewport change
     * @private
     */
    _handleBackButton() {
        const backButton = this.el;
        const referrerElement = document.referrer;
        const shopUrl = window.location.origin;

        if(referrerElement && (referrerElement.includes(shopUrl))) {
            backButton.classList.add('d-block');
        }

        backButton.addEventListener('click', function(){ history.back() });
    }
}
