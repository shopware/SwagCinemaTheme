import FilterRatingSelectPlugin from 'src/plugin/listing/filter-rating-select.plugin'
import DomAccess from 'src/helper/dom-access.helper';

export default class CinemaFilterRatingSelectPlugin extends FilterRatingSelectPlugin {

    /**
     * add data currentRatingPercent to labels
     * @return {Array}
     * @public
     */
    getLabels() {
        const currentRating = DomAccess.querySelector(this.el, this.options.checkboxSelector + ':checked', false).value;

        let labels = [];

        if (currentRating) {
            let endSnippet = this.options.snippets.filterRatingActiveLabelEnd;
            if (parseInt(currentRating) === 1) {
                endSnippet = this.options.snippets.filterRatingActiveLabelEndSingular;
            }

            labels.push({
                label: `${this.options.snippets.filterRatingActiveLabelStart}
                        ${currentRating}/${this.options.maxPoints}
                        ${endSnippet}`,
                id: 'rating',
                currentRatingPercent: parseInt(currentRating/this.options.maxPoints*100)
            });
        } else {
            labels = [];
        }

        return labels;
    }
}
