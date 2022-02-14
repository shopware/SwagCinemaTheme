import deepmerge from 'deepmerge';
import ListingPlugin from 'src/plugin/listing/listing.plugin';

export default class CinemaListingPlugin extends ListingPlugin {

    /**
     * override scroll offset
     *
     * @type {*}
     */
    static options = deepmerge(ListingPlugin.options, {
        scrollOffset: 180
    });

    /**
     * Template for an active filter label and check label rating to load icon star
     *
     * @param {Object} label
     * @returns {string}
     */
    getLabelTemplate(label) {
        if(label.id == 'rating') {
            return `
            <span class="${this.options.activeFilterLabelClass}">
                <div class="filter-active-icon" title="${label.currentRatingPercent}%">
                     <span style="width:${label.currentRatingPercent}%">
                         <span>${label.label}</span>
                     </span>
                </div>
                <button class="${this.options.activeFilterLabelRemoveClass}"
                        data-id="${label.id}">
                    &times;
                </button>
            </span>
            `;
        } else {
            return `
        <span class="${this.options.activeFilterLabelClass}">
            ${this.getLabelPreviewTemplate(label)}
            ${label.label}
            <button class="${this.options.activeFilterLabelRemoveClass}"
                    data-id="${label.id}">
                &times;
            </button>
        </span>
        `;
        }
    }
}
