describe('Home page visual', () => {
    it('should be able to open up the home page', () => {
        cy.visit('/');

        cy.get('.header-logo-main-link').should('be.visible');
        cy.takeSnapshot('[Home] Landing');

        cy.visit('/account');
        cy.takeSnapshot('[Account] login/register page', '.account-register');
    });
});
