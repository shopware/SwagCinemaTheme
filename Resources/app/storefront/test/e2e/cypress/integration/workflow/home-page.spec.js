describe('Home page', {tags: ['@workflow']},() => {
    it('should be able to open up the home page', () => {
        cy.visit('/');

        cy.get('.header-logo-main-link').should('be.visible');
    });
});
