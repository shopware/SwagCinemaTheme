describe('Maintenance visual testing page', {tags: ['@visual']}, () => {
    before(() => {
        cy.login()
            .then(() => {
                return cy.searchViaAdminApi({
                    endpoint: 'sales-channel',
                    data: {
                        field: 'name',
                        value: 'Storefront'
                    }
                });
            })
            .then((salesChannel) => {
                // Enable maintenance mode
                cy.updateViaAdminApi('sales-channel', salesChannel.id, {
                    data: { maintenance: true }
                });
            })
    });

    after(() => {
        cy.login()
            .then(() => {
                return cy.searchViaAdminApi({
                    endpoint: 'sales-channel',
                    data: {
                        field: 'name',
                        value: 'Storefront'
                    }
                });
            })
            .then((salesChannel) => {
                // disable maintenance mode
                cy.updateViaAdminApi('sales-channel', salesChannel.id, {
                    data: { maintenance: false }
                });
            })
    })

    it('@maintenance: maintenance page', () => {
        cy.visit('/', {failOnStatusCode: false});

        cy.get('.container-maintenance h1').contains('Maintenance mode');
        cy.get('.container-maintenance__bg img')
            .first()
            .should('have.attr', 'src')
            .and('match', /maintenance/);

        cy.takeSnapshot('[Shop] Maintenance page', '.container-maintenance');
    });
});
