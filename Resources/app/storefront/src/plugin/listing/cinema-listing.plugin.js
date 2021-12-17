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
}
