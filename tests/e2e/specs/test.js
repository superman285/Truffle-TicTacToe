// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Tic-Tac-Toe");
  });
  it('It should be 3 buttons',()=>{
    cy.get('button').should('have.length',3);
  })
  it('Buttons contents correct',()=>{
    cy.get('.createGame').contains("CreateGame");
    cy.get('.joinGame').contains("JoinGame");
    cy.get('.gamecost').contains("GameCost");
  })
});
