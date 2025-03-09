describe('template spec', () => {
	const taskName : string = "Testing task";
	const renamedTaskName : string = "Renamed test task";
  beforeEach(() => {
		cy.clearCookies(); 
    cy.visit('localhost:3000');
  });
	it('authorization error with wrong information', () => {
		cy.wait(1500);
		cy.get('[data-type="login"]').should('exist').click();
		cy.get('[data-type="modal"]').should('exist').should('be.visible');
		cy.wait(1500);
		cy.get('[data-type="email"]').type('prigman48@gmail.com');
		cy.get('[data-type="password"]').type('password123');
		cy.get('[data-type="login-button"]').click();
		cy.get('[data-type="login-error"]').should('exist').should('be.visible').should('contain', 'Login error');
	});
	it('authorization works correctly', () => {
		cy.wait(1500);
		cy.get('[data-type="login"]').should('exist').click();
		cy.get('[data-type="modal"]').should('exist').should('be.visible');
		cy.wait(1500);
		cy.get('[data-type="email"]').type('prigman48@gmail.com');
		cy.get('[data-type="password"]').type('Z-xww4!!O3K93Qa.Do_');
		cy.get('[data-type="login-button"]').click();
		cy.get('[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');
	});
	it('session was saved after page reload', () => {
		cy.wait(1500);
		cy.get('[data-type="login"]').should('exist').click();
		cy.get('[data-type="modal"]').should('exist').should('be.visible');
		cy.wait(1500);
		cy.get('[data-type="email"]').type('prigman48@gmail.com');
		cy.get('[data-type="password"]').type('Z-xww4!!O3K93Qa.Do_');
		cy.get('[data-type="login-button"]').click();
		cy.get('[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');
		cy.reload();
		cy.get('[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');
  });

	it('adds new task correctly', () => {
		cy.wait(1500);
		cy.get('[data-type="login"]').should('exist').click();
		cy.get('[data-type="modal"]').should('exist').should('be.visible');
		cy.wait(1500);
		cy.get('[data-type="email"]').type('prigman48@gmail.com');
		cy.get('[data-type="password"]').type('Z-xww4!!O3K93Qa.Do_');
		cy.get('[data-type="login-button"]').click();
		cy.get('[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');

		cy.get('[data-type="page"]').contains('3').click();
		cy.wait(1500);

		cy.get('[data-type="add-input-task"]').type(taskName);
		cy.get('[data-type="add-task"]').click();
		cy.wait(1500);
		cy.get('[data-type="task-name"]').should('exist').should('be.visible').should('contain', taskName);

		cy.get('[data-type="task-name"]').contains(taskName)
    .parent()
    .find('[data-type="task-edit"]')
    .click();

		cy.wait(1500);
		cy.get('[data-type="modal-edit"]').should('exist').should('be.visible');
		cy.get('[data-type="edit-task-remove"]').click();
		cy.wait(500);
		cy.get('[data-type="task-name"]').contains(taskName).should('not.exist');
  });

	it('renames new task correctly', () => {
		cy.wait(1500);
		cy.get('[data-type="login"]').should('exist').click();
		cy.get('[data-type="modal"]').should('exist').should('be.visible');
		cy.wait(1500);
		cy.get('[data-type="email"]').type('prigman48@gmail.com');
		cy.get('[data-type="password"]').type('Z-xww4!!O3K93Qa.Do_');
		cy.get('[data-type="login-button"]').click();
		cy.get('[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');

		cy.get('[data-type="page"]').contains('3').click();
		cy.wait(1500);

		cy.get('[data-type="add-input-task"]').type(taskName);
		cy.get('[data-type="add-task"]').click();
		cy.wait(1500);
		cy.get('[data-type="task-name"]').should('exist').should('be.visible').should('contain', taskName);
		
		cy.get('[data-type="task-name"]').contains(taskName)
    .parent()
    .find('[data-type="task-edit"]')
    .click();
		
		cy.wait(1500);
		cy.get('[data-type="modal-edit"]').should('exist').should('be.visible');
		cy.get('[data-type="edit-task-input"]').type(renamedTaskName);
		cy.get('[data-type="edit-task-rename"]').click();
		cy.wait(500);
		cy.get('[data-type="task-name"]').should('exist').should('be.visible').should('contain', renamedTaskName);

		cy.get('[data-type="task-name"]').contains(renamedTaskName)
    .parent()
    .find('[data-type="task-edit"]')
    .click();
		
		cy.wait(1500);
		cy.get('[data-type="modal-edit"]').should('exist').should('be.visible');
		cy.get('[data-type="edit-task-remove"]').click();
		cy.wait(500);
		cy.get('[data-type="task-name"]').contains(renamedTaskName).should('not.exist');
  });

	it('removes new task correctly', () => {
		cy.wait(1500);
		cy.get('[data-type="login"]').should('exist').click();
		cy.get('[data-type="modal"]').should('exist').should('be.visible');
		cy.wait(1500);
		cy.get('[data-type="email"]').type('prigman48@gmail.com');
		cy.get('[data-type="password"]').type('Z-xww4!!O3K93Qa.Do_');
		cy.get('[data-type="login-button"]').click();
		cy.get('[data-type="welcome-username"]').should('exist').should('be.visible').should('contain', "Welcome Danyil Puhach!");
		cy.getCookie('api_token').should('exist');

		cy.get('[data-type="page"]').contains('3').click();
		cy.wait(1500);

		cy.get('[data-type="add-input-task"]').type(taskName);
		cy.get('[data-type="add-task"]').click();
		cy.wait(1500);
		cy.get('[data-type="task-name"]').should('exist').should('be.visible').should('contain', taskName);
		
		cy.get('[data-type="task-name"]').contains(taskName)
    .parent()
    .find('[data-type="task-edit"]')
    .click();
		
		cy.wait(1500);
		cy.get('[data-type="modal-edit"]').should('exist').should('be.visible');
		cy.get('[data-type="edit-task-remove"]').click();
		cy.wait(500);
		cy.get('[data-type="task-name"]').contains(taskName).should('not.exist');
  });
})