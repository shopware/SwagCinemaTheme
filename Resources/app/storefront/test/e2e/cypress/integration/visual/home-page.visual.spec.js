describe('Home page visual', {tags: ['@visual']}, () => {
    it('should be able to open up the home page', () => {
        cy.visit('/');

        cy.get('.header-logo-main-link').should('be.visible');
        cy.takeSnapshot('[Home] Landing');
    });
});
