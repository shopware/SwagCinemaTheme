import AccountPageObject from '../../../support/pages/account.page-object';

const page = new AccountPageObject();

describe('Account: Address', { tags: ['@workflow', '@address'] }, () => {
    beforeEach(() => {
        return cy.setToInitialState()
            .then(() => {
                return cy.createCustomerFixtureStorefront()
            })
            .then(() => {
                cy.visit('/account/login');
            })
    });

    it('@workflow @address: update address', () => {
        cy.get(page.elements.loginCard).should('be.visible');

        cy.get('#loginMail').typeAndCheckStorefront('test@example.com');
        cy.get('#loginPassword').typeAndCheckStorefront('shopware');
        cy.get(`${page.elements.loginSubmit} [type="submit"]`).click();

        cy.get('.account-content .account-aside-item[title="Addresses"]')
            .should('be.visible')
            .click();

        cy.get('.account-welcome h1').should((element) => {
            expect(element).to.contain('Addresses');
        });

        cy.get('a[href="/account/address/create"]').click();
        cy.get('.account-address-form').should('be.visible');

        cy.get('#addresspersonalSalutation').select('Mr.');
        cy.get('#addresspersonalFirstName').typeAndCheckStorefront('P.  ');
        cy.get('#addresspersonalLastName').typeAndCheckStorefront('Sherman');
        cy.get('#addressAddressStreet').typeAndCheckStorefront('42 Wallaby Way');
        cy.get('#addressAddressZipcode').typeAndCheckStorefront('2000');
        cy.get('#addressAddressCity').typeAndCheckStorefront('Sydney');
        cy.get('#addressAddressCountry').select('Australia');
        cy.get('.address-form-submit').scrollIntoView();

        cy.get('.address-form-submit').click();
        cy.get('.alert-success .alert-content').contains('Address has been saved.');

        cy.get('#accountActionsDropdown').click();
        cy.get('.dropdown-menu > :nth-child(1) > .btn').contains('Edit').click();
        cy.get('#addresscompany').typeAndCheckStorefront('Company ABD');
        cy.get('#addressdepartment').typeAndCheckStorefront('Department ABF');
        cy.get('#addressAddressCountry').select('Germany');
        cy.get('.address-form-submit').scrollIntoView();

        cy.get('.address-form-submit').click();
        cy.get('.alert-success .alert-content').contains('Address has been saved.');
    });
});
