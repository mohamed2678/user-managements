describe('UserTable', () => {
  it('should display users', () => {
    cy.visit('/');
    cy.get('td').contains('John Doe');
  });

  it('should filter users by role', () => {
    cy.visit('/');
    cy.get('select').select('Admin');
    cy.get('td').contains('John Doe');
  });
});