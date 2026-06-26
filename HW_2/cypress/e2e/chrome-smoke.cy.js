describe('Chrome smoke test', () => {
  it('opens the app home page in Chrome', () => {
    const httpUsername = Cypress.env('HTTP_USERNAME') || 'guest';
    const httpPassword = Cypress.env('HTTP_PASSWORD') || 'welcome2qauto';

    cy.visit(`https://${httpUsername}:${httpPassword}@qauto.forstudy.space/`);
    cy.location('hostname').should('include', 'qauto.forstudy.space');
  });
});
