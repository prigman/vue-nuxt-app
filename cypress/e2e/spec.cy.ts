describe('template spec', () => {
  beforeEach(() => {
		cy.clearCookies();
    cy.visit('http://localhost:3000');
  });
	it('authorization error with wrong information', () => {
		cy.wait(5000);
		cy.get('button[data-type="login"]').should('exist').click();
		cy.get('div[data-type="modal"]').should('exist').should('be.visible');
		cy.get('input[name="email"]').type('prigman48@gmail.com');
		cy.get('input[name="password"]').type('password123');
		cy.get('input[type="button"]').click();
		cy.get('span[data-type="login-error"]').should('exist').should('be.visible').should('contain', 'Login error');
	});
	it('authorization success', () => {
		cy.wait(5000);
		cy.get('button[data-type="login"]').should('exist').click();
		cy.get('div[data-type="modal"]').should('exist').should('be.visible');
		cy.get('input[name="email"]').type('prigman48@gmail.com');
		cy.get('input[name="password"]').type('Z-xww4!!O3K93Qa.Do_');
		cy.get('input[type="button"]').click();
		cy.get('span[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');
	});
	it('session was saved after page reload', () => {
		cy.wait(5000);
    cy.get('button[data-type="login"]').should('exist').click();
		cy.get('div[data-type="modal"]').should('exist').should('be.visible');
		cy.get('input[name="email"]').type('prigman48@gmail.com');
		cy.get('input[name="password"]').type('Z-xww4!!O3K93Qa.Do_');
		cy.get('input[type="button"]').click();
		cy.get('span[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');
		cy.reload();
		cy.get('span[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');
  });
})