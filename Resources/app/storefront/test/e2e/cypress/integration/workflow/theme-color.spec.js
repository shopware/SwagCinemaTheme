import AccountPageObject from "../../support/pages/account.page-object";

let product = {};
let colorScheme = {};
const accountPage = new AccountPageObject();

describe('ThemeColor: workflow change primary color and buy color', {tags: ['@workflow']}, () => {
    beforeEach(() => {
        return cy.setToInitialState()
            .then(() => {
                return cy.createProductFixture();
            })
            .then(() => {
                return cy.fixture('product');
            })
            .then((result) => {
                product = result;
                return cy.createCustomerFixtureStorefront();
            })
            .then(() => {
                cy.loginViaApi()
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/theme/manager/index`);
                cy.fixture('color-scheme.json').then((colorSchemeFixture) => {
                    colorScheme = colorSchemeFixture;
                    changeColorScheme(colorSchemeFixture);
                })
            })
            .then(() => {
                cy.visit('/');
            })
            .then(() => {
                cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
                cy.get('.offcanvas-cookie > .btn').scrollIntoView().should('be.visible').click();
            });
    });

    after(() => {
        return cy.setToInitialState()
            .then(() => {
                cy.clearCookies();
            })
            .then(() => {
                cy.loginViaApi()
            })
            .then(() => {
                cy.openInitialPage(`${Cypress.env('admin')}#/sw/theme/manager/index`);

                cy.intercept({
                    path: `${Cypress.env('apiPath')}/_action/theme/*`,
                    method: 'patch'
                }).as('saveData');

                cy.get('.sw-theme-list-item .sw-theme-list-item__title')
                    .contains('Cinema Theme')
                    .click();

                cy.get('.smart-bar__actions .sw-button-process.sw-button--primary').click();
                cy.get('.sw-modal .sw-button--primary').click();

                cy.wait('@saveData').then((xhr) => {
                    expect(xhr.response).to.have.property('statusCode', 200);
                });
            })
            .then(() => {
                cy.visit('/');
            });
    });

    function hexToRGB(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = `0x${hex[1]}${hex[1]}`;
            g = `0x${hex[2]}${hex[2]}`;
            b = `0x${hex[3]}${hex[3]}`;
        } else {
            r = `0x${hex[1]}${hex[2]}`;
            g = `0x${hex[3]}${hex[4]}`;
            b = `0x${hex[5]}${hex[6]}`;
        }
        return `rgb(${+r}, ${+g}, ${+b})`;
    }

    function changeColorScheme(colorScheme) {
        cy.intercept({
            path: `${Cypress.env('apiPath')}/_action/theme/*`,
            method: 'patch'
        }).as('saveData');

        cy.get('.sw-theme-list-item')
            .last()
            .get('.sw-theme-list-item__title')
            .contains('Cinema Theme')
            .click();

        cy.get('.sw-colorpicker .sw-colorpicker__input').first().clear().typeAndCheck(colorScheme.primary);

        cy.get('.sw-card__title').contains('E-Commerce')
            .parent('.sw-theme-manager-detail__area')
            .find('.sw-colorpicker__input')
            .first().clear().typeAndCheck(colorScheme.buyButton);

        cy.get('.sw-card__title').contains('E-Commerce')
            .parent('.sw-theme-manager-detail__area')
            .find('.sw-colorpicker__input').eq(1).clear().typeAndCheck(colorScheme.price);

        cy.get('[label="Secondary colour"]')
            .parent('.sw-theme-manager-detail__content--section_field')
            .find('.sw-colorpicker__input').clear().typeAndCheck(colorScheme.secondary);

        cy.get('.smart-bar__actions .sw-button-process.sw-button--primary').click();
        cy.get('.sw-modal .sw-button--primary').click();

        cy.wait('@saveData').then((xhr) => {
            expect(xhr.response).to.have.property('statusCode', 200);
        });
    }

    it('@workflow @themeColor: check change primary color ', () => {
        cy.intercept({
            path: '/widgets/checkout/info',
            method: 'get'
        }).as('cartInfo');

        cy.get('.header-main').should('have.css', 'background-color', hexToRGB(colorScheme.secondary));
        cy.get('.footer-main').should('have.css', 'background-color', hexToRGB(colorScheme.secondary));

        cy.get('.account-menu-btn').click();
        cy.get('.account-menu-dropdown').should('be.visible');

        cy.get('.account-menu-login-button').click();
        accountPage.login();
        cy.get('.account-content').should('be.visible');

        cy.get('.header-logo-main-link').first().click();
        cy.get('.cms-listing-col').should('be.visible');
        cy.get('.product-price').should('have.css', 'color', hexToRGB(colorScheme.price));
        cy.get('.product-name').click();
        cy.get('.product-detail').should('be.visible');
        cy.get('.btn-buy').should('have.css', 'background-color', hexToRGB(colorScheme.buyButton));
        cy.get('.product-detail-price').should('have.css', 'color', hexToRGB(colorScheme.price));
        cy.get('.product-detail-manufacturer a').should('not.be.visible');

        cy.get('.product-detail-buy .btn-buy').click();
        cy.wait('@cartInfo').then((xhr) => {
            expect(xhr.response).to.have.property('statusCode', 200)
        });
        cy.get('.cart-offcanvas').should('be.visible');
        cy.get('.offcanvas-cart-actions .btn-primary').should('have.css', 'background-color', hexToRGB(colorScheme.primary));

        cy.get('.offcanvas-cart-actions .btn-link').click();

        cy.get('.checkout-aside-action .begin-checkout-btn').click();

        // I comment this block because the Finish checkout page has not been implemented
        // cy.get('.revocation-notice > a').should('have.css', 'color', hexToRGB(colorScheme.textColor));
        // cy.get('#confirmFormSubmit').should('have.css', 'background-color', hexToRGB(colorScheme.primary));
        // cy.get('.checkout-confirm-tos-checkbox').should('not.be.visible')
        //     .check({force: true})
        //     .should('be.checked');
        //
        // cy.get('#confirmFormSubmit').scrollIntoView();
        // cy.get('#confirmFormSubmit').click();

        // cy.get('.finish-back-to-shop-button a').should('have.css', 'background-color', hexToRGB(colorScheme.primary));
        // cy.get('.finish-back-to-shop-button a').should('have.css', 'border-color', hexToRGB(colorScheme.textColor));
    });
});
