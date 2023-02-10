const selector = {
    footerLinkContact: '.footer-contact-form a[data-bs-toggle="modal"]',
    formContactModal: '.modal form[action="/form/contact"]',
    formContact: '.cms-page form[action="/form/contact"]',
    formContactSalutation: '#form-Salutation',
    formContactFirstName: '#form-firstName',
    formContactLastName: '#form-lastName',
    formContactMail: '#form-email',
    formContactPhone: '#form-phone',
    formContactSubject: '#form-subject',
    formContactComment: '#form-comment',
    formContactDataProtectionCheckbox: '.privacy-notice input[type="checkbox"]',
    formContactButtonSubmit: 'button[type="submit"]',
    modalButtonDismiss: 'button[data-dismiss="modal"]'
}

describe('Contact: Visual tests', {tags: ['@visual']}, () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => cy.createProductFixture())
            .then(() => cy.login())
            .then(() => cy.createCmsFixture())
            .then(() => cy.visit('/'))
    });

    function fillOutContactForm(el) {
        cy.get(el).within(() => {
            cy.get(selector.formContactSalutation).select('Not specified');
            cy.get(selector.formContactFirstName).type('Foo');
            cy.get(selector.formContactLastName).type('Bar');
            cy.get(selector.formContactMail).type('user@example.com');
            cy.get(selector.formContactPhone).type('+123456789');
            cy.get(selector.formContactSubject).type('Lorem ipsum');
            cy.get(selector.formContactComment).type('Dolor sit amet.');
        });
    }

    function assignContactFormToHomepage() {
        cy.intercept({
            url: `${Cypress.env('apiPath')}/category/*`,
            method: 'PATCH'
        }).as('saveCategory');

        cy.get('.sw-category-tree__inner .sw-tree-item__element').contains('Home').click();
        cy.get('.sw-category-detail__tab-cms').click();
        cy.get('.sw-card.sw-category-layout-card').scrollIntoView();
        cy.get('.sw-category-detail-layout__change-layout-action').click();
        cy.get('.sw-modal__dialog').should('be.visible');

        cy.get('.sw-cms-layout-modal__content-item--0 .sw-field--checkbox').click();
        cy.get('.sw-modal .sw-button--primary').click();
        cy.get('.sw-card.sw-category-layout-card .sw-category-layout-card__desc-headline').contains('Test Contact Form Page');

        // Save layout
        cy.get('.sw-category-detail__save-action').click();

        cy.wait('@saveCategory').its('response.statusCode').should('equal', 204);
        cy.wait(1000);
    }

    function createContactFormPage() {
        let salesChannel;

        return cy.searchViaAdminApi({
            endpoint: 'sales-channel',
            data: {
                field: 'name',
                type: 'equals',
                value: 'Storefront'
            }
        }).then((data) => {
            salesChannel = data.id;
            cy.createDefaultFixture('cms-page', {}, 'cms-contact-page')
        }).then(() => {
            cy.visit(`${Cypress.env('admin')}#/sw/category/index`);
            cy.get('.sw-skeleton').should('not.exist');
            cy.get('.sw-loader').should('not.exist');
            assignContactFormToHomepage();
        });
    }

    it.skip('@visual: assign contact form to homepage', () => {
        createContactFormPage();

        cy.visit('/');

        cy.intercept({
            url: '/form/contact',
            method: 'POST'
        }).as('contactFormPostRequest');

        cy.get('.cms-page .card-title').contains('Contact');

        fillOutContactForm(selector.formContact);

        cy.takeSnapshot('[Contact] Fill in information to contact form page', '.cms-page');

        cy.get(selector.formContact).within(() => {
            cy.get(selector.formContactButtonSubmit).scrollIntoView().click();
        });

        cy.wait('@contactFormPostRequest').its('response.statusCode').should('equal', 200);

        cy.get('.cms-page').within(() => {
            cy.get('.confirm-message').contains('We have received your contact request and will process it as soon as possible.')
        });
    });
});
