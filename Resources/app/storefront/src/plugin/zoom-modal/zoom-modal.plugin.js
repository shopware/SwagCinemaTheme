import deepmerge from 'deepmerge';
import DeviceDetection from 'src/helper/device-detection.helper';
import DomAccess from 'src/helper/dom-access.helper';
import ZoomModalPlugin from 'src/plugin/zoom-modal/zoom-modal.plugin';

/**
 * Zoom Modal Plugin
 */
export default class CinemaZoomModalPlugin extends ZoomModalPlugin {

    static options = deepmerge(ZoomModalPlugin.options, {
        /**
         * selector for the cinema grid gallery
         */
        cinemaGallerySelector: '.ci-gallery-desktop',

        /**
         * slide image id to show in zoom modal
         */
        activeDataAttribute: 'data-active',
    });

    /**
     *
     * @returns {*}
     * @private
     */
    _getGalleryEl() {
        return DomAccess.querySelector(document, this.options.cinemaGallerySelector, false);
    }

    _registerEvents() {
        let elCiGallery = this._getGalleryEl();

        if (elCiGallery) {
            let self = this;
            let elImage = elCiGallery.querySelectorAll(".gallery-item-container");
            const eventType = (DeviceDetection.isTouchDevice()) ? 'touchend' : 'click';

            elImage.forEach((item, idx) => item.addEventListener(eventType, this._handleZoomModal.bind(this, idx + 1)));
        } else {
            super._registerEvents();
        }
    }

    /**
     *
     * @param imageIdx
     * @private
     */
    _handleZoomModal(imageIdx) {
        this._getGalleryEl().setAttribute(this.options.activeDataAttribute, imageIdx);
        this._openModal();
    }

    /**
     *
     * @returns {*|number}
     * @private
     */
    _getParentSliderIndex() {
        if (this._getGalleryEl()) {
            return this._getGalleryEl().getAttribute(this.options.activeDataAttribute);
        } else {
            return super._getParentSliderIndex();
        }
    }
}
