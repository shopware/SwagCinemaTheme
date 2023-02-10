describe('Error: 404 page visual testing', {tags: ['@visual']}, () => {
    before(() => {
        cy.visit('/')
            .then(() => {
                cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
                cy.get('.offcanvas-cookie > .btn').scrollIntoView().should('be.visible').click();
            })
    })

    it('@404: should navigate to 404 page with full layout', () => {
        // Check 404 default site
        // We want to visit 404 page, so we need to accept that status code
        cy.visit('/non-existent/', {
            failOnStatusCode: false
        });
        cy.get('.container-404 p')
            .contains('We are sorry, it seems we can\'t find the page you\'re looking for. It may no longer exist or may have been moved.');

        cy.get('.content-bg img')
            .should('have.attr', 'src')
            .and('match', /404/);
        cy.get('.btn').contains('Back to shop');

        // Check Header and Footer
        cy.get('.header-main').should('be.visible');
        cy.get('.footer-main').should('be.visible');

        cy.takeSnapshot('[Shop] 404 page', '.container-404');
    });
});
