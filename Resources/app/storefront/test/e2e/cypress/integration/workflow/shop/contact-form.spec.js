const selector = {
    footerLinkContact: '.footer-contact-form a[data-toggle="modal"]',
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

describe('Contact: Basic', { tags: ['@workflow'] }, () => {
    beforeEach(() => {
        cy.setToInitialState()
            .then(() => {
                return cy.createProductFixture();
            })
            .then(() => {
                cy.loginViaApi();
                cy.createCmsFixture();
            });
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
            cy.get(selector.formContactDataProtectionCheckbox).check({force: true});
        });
    }

    it('@shop: submit contact form', () => {
        cy.intercept({
            url: '/form/contact',
            method: 'POST'
        }).as('contactFormPostRequest');

        cy.visit('/');

        cy.get('.footer-contact-form a').click();
        cy.get('.modal').should('be.visible');
        cy.get('.modal .card-title').contains('Contact');

        fillOutContactForm(selector.formContactModal);

        cy.get(selector.formContactModal).within(() => {
            cy.get(selector.formContactButtonSubmit).scrollIntoView().click();
        });

        cy.wait('@contactFormPostRequest').its('response.statusCode').should('equal', 200)

        cy.get('.modal').within(() => {
            cy.get('.confirm-message').contains('We have received your contact request and will process it as soon as possible.')
        });
    });
});
