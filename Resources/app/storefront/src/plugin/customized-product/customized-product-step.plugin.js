import DomAccess from 'src/helper/dom-access.helper';
import deepmerge from 'deepmerge';

function wrapper() {
    try {
        const SwagCustomizedProductsStepByStepWizard = window.PluginManager.getPlugin('SwagCustomizedProductsStepByStepWizard').get('class');

        class CustomizedProductsStepByStepWizard extends SwagCustomizedProductsStepByStepWizard {

            static options = deepmerge(SwagCustomizedProductsStepByStepWizard.options, {
                pagerNumberSelector: '.swag-customized-products__pager-number',
                productTitleSelector: '.swag-customized-products__title',
                productDescriptionSelector: '.swag-customized-products__description',
            });

            /**
             * Returns the template string of the pager, including navigation buttons
             *
             * @returns {String}
             */
            renderPager() {
                /** Should the pager be visible */
                const showPager = () => {
                    return this.currentPage <= 1 || this.currentPage >= this.pagesCount;
                };

                /** Returns the pager display e.g. [n] / [n] */
                const pageDisplay = () => {
                    return `${this.currentPage - 1} / ${this.pagesCount - 2}`;
                };

                /** Returns the disable attribute for the prev button */
                const disableBtnPrev = () => {
                    return this.currentPage <= 1 ? ' disabled="disabled"' : '';
                };

                /** Returns the disable attribute for the next button */
                const disableBtnNext = () => {
                    const currentPage = this.pages[this.currentPage - 1];
                    if (!SwagCustomizedProductsStepByStepWizard.isPageValid(currentPage)) {
                        return ' disabled="disabled"';
                    }
                    return this.currentPage >= this.pagesCount ? ' disabled="disabled"' : '';
                };

                /** Returns the button text for the next button */
                const btnNextText = () => {
                    if ((this.currentPage - 1) >= (this.pagesCount - 2)) {
                        return this.translations.btnFinish;
                    }
                    return this.translations.btnNext;
                };

                return `
                    <div class="swag-customized-products-pager${showPager() ? ' d-none' : ''}">
                        <button class="swag-customized-products-pager__button btn-prev btn btn-sm btn-link" tabindex="0"
                                ${disableBtnPrev()}>
                                <span class="icon">
                                     <svg width="10" height="17" viewBox="0 0 10 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M16.71 5.29a.932.932 0 0 0-1.349 0L9 11.553 2.639 5.29a.932.932 0 0 0-1.35 0 .932.932 0 0 0 0 1.35l7.036 7.036c.193.192.482.289.675.289.193 0 .482-.097.675-.29L16.71 6.64c.385-.386.385-1.06 0-1.35Z" id="ic-chevron-left"/></defs><g id="Symbols" transform="translate(-4 -1)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><use fill="currentColor" transform="rotate(90 9 9.482)" xlink:href="#ic-chevron-left"/></g></svg>
                                </span>
                            ${this.translations.btnPrev}
                        </button>

                        <span class="swag-customized-products-pager__page-number">
                            ${pageDisplay()}
                        </span>

                        <button class="swag-customized-products-pager__button btn-next btn btn-sm btn-outline-primary" tabindex="0"
                                ${disableBtnNext()}>
                            ${btnNextText()}
                            <span class="icon">
                                 <svg width="10" height="17" viewBox="0 0 10 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M16.71 5.29a.932.932 0 0 0-1.349 0L9 11.553 2.639 5.29a.932.932 0 0 0-1.35 0 .932.932 0 0 0 0 1.35l7.036 7.036c.193.192.482.289.675.289.193 0 .482-.097.675-.29L16.71 6.64c.385-.386.385-1.06 0-1.35Z" id="ic-chevron-right"/></defs><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-4 -1)"><use fill="currentColor" transform="rotate(-90 9 9.482)" xlink:href="#ic-chevron-right"/></g></svg>
                            </span>
                        </button>
                    </div>
                `;
            }

            /**
             * Renders a navigation select field which allows to quickly jump between the steps.
             *
             * @returns {string}
             */
            renderNavigationSelection() {
                /**
                 * Renders a single option of the select box.
                 *
                 * @params {Object} entry
                 * @returns {string}
                 */
                const renderSelectOption = (entry) => {
                    return `
                <option value="${entry.pageNum}"${this.currentPage - 1 === entry.pageNum ? ' selected="selected"' : ''}>
                    ${entry.pageNum} - ${entry.name} ${entry.required ? `(${this.translations.required})` : ''}
                </option>`;
                };

                const renderCurrentlySelectedText = () => {
                    const entry = this.navigationEntries.find((navEntry) => {
                        return this.currentPage - 1 === navEntry.pageNum;
                    });

                    if (!entry) {
                        return '';
                    }

                    return `${entry.pageNum}. ${entry.name}`;
                };

                /* Defines if the navigation element should be displayed */
                const showNavigation = () => {
                    return this.currentPage <= 1 || this.currentPage >= this.pagesCount;
                };

                this.navigationEl.style.display = (showNavigation() ? 'none' : 'block');

                const renderDropdown = (entry) => {
                    if(this.currentPage - 1 !== entry.pageNum) {
                        return `
                            <li class="dropdown-item" value="${entry.pageNum}" tabindex="0" id="listbox-${entry.pageNum}">
                                ${entry.pageNum} - ${entry.name} ${entry.required ? `(${this.translations.required})` : ''}
                            </li>`;
                    }

                    return;
                };

                /* eslint-disable max-len */
                return `
                    <div class="form-group">
                        <div class="swag-customized-products-navigation">
                            <select class="custom-select swag-customized-products-navigation" onmousedown="event.preventDefault()" tabindex="-1" aria-expanded="false" data-bs-toggle="dropdown" data-boundary="viewport" data-offset="0,0" aria-haspopup="true">
                               ${this.navigationEntries.map(renderSelectOption).join("").trim()}
                            </select>
                            <div class="dropdown-menu" role="listbox" tabindex="0" id="listboxSelection" aria-labelledby="listboxlabelSelection">
                                <ul>
                                    ${this.navigationEntries.map(renderDropdown).join("").trim()}
                                </ul>
                            </div>
                            <span class="swag-customized-products-navigation__text">
                                ${renderCurrentlySelectedText()}
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                class="swag-customized-products-navigation__icon">
                                <defs>
                                    <path
                                        id="icons-small-arrow-small-down-a"
                                        d="M5.70710678,6.29289322 C5.31658249,5.90236893 4.68341751,5.90236893 4.29289322,6.29289322 C3.90236893,6.68341751 3.90236893,7.31658249 4.29289322,7.70710678 L7.29289322,10.7071068 C7.68341751,11.0976311 8.31658249,11.0976311 8.70710678,10.7071068 L11.7071068,7.70710678 C12.0976311,7.31658249 12.0976311,6.68341751 11.7071068,6.29289322 C11.3165825,5.90236893 10.6834175,5.90236893 10.2928932,6.29289322 L8,8.58578644 L5.70710678,6.29289322 Z"/>
                                </defs>
                                <use
                                    fill="#758CA3"
                                    fill-rule="evenodd"
                                    transform="matrix(-1 0 0 1 16 0)"
                                    xlink:href="#icons-small-arrow-small-down-a"/>
                            </svg>
                        </div>
                    </div>
                `;
                /* eslint-enable max-len */
            }

            transitionToPage(...args) {
                super.transitionToPage(...args);

                this.createDropdown();
            }

            /**
             * Validates the current field and checks if the field is valid
             * @event input
             * @params event
             */
            validateCurrentField() {
                super.validateCurrentField();

                this.createDropdown();
            }

            createDropdown() {
                const dropdownItems = DomAccess.querySelectorAll(this.navigationEl, '.dropdown-item');

                dropdownItems.forEach(item => {
                    item.removeEventListener('click', this.onClick.bind(this));
                    item.addEventListener('click', this.onClick.bind(this));
                });
            }

            onClick(e) {
                const customSelect = DomAccess.querySelector(this.navigationEl, '.custom-select');

                customSelect.value = e.target.getAttribute('value');
                customSelect.dispatchEvent(new Event('change', {bubbles: true}));
            }
        }

        return CustomizedProductsStepByStepWizard;
    } catch (e) { }
}

export default wrapper()
