context('Sad path flow', () => {
  it('Register fail, then success', () => {
    cy.visit('localhost:3000/register')
    const email = 'a@a.com';
    const name = 'a';
    const password = 'a';

    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="name"]').focus().type(name);
    cy.get('input[name="password"]').focus().type(password);
    cy.get('input[name="confirm-password"]').focus().type('b');
    cy.get('button[type=submit]').click();

    cy.get('[role=dialog]').should('be.visible');
    cy.get('[role=dialog]').contains('button', 'OK').click();
    cy.get('input[name="confirm-password"]').focus().type('{backspace}').type(password);
    cy.get('button[type=submit]').click();
  });

  it('Create new listing that fails a few times, then success', () => {
    cy.visit('localhost:3000/dashboard')
    cy.get('header').contains('button', 'Create New Listing').click();
    cy.url().should('include', '/create');

    const title = 'New Listing'
    const country = 'Australia'
    const state = 'NSW'
    const city = 'Sydney'
    const suburb = 'Suburb'
    const street = '1 Street Lane'
    const postcode = '2000'
    const price = 200

    cy.get('button[type=submit]').click();
    cy.get('[role=dialog]').contains('button', 'OK').click();

    cy.get('#listing-title').focus().type(title);
    cy.get('button[type=submit]').click();
    cy.get('[role=dialog]').contains('button', 'OK').click();

    cy.get('div[aria-label="listing-country"] input').focus().type(country);
    cy.get('div[aria-label="listing-state"] input').focus().type(state);
    cy.get('div[aria-label="listing-city"] input').focus().type(city);
    cy.get('div[aria-label="listing-suburb"] input').focus().type(suburb);
    cy.get('div[aria-label="listing-street"] input').focus().type(street);
    cy.get('div[aria-label="listing-postcode"] input').focus().type(postcode);
    cy.get('button[type=submit]').click();
    cy.get('[role=dialog]').contains('button', 'OK').click();

    cy.get('div[aria-label="Listing form tabs"]').get('button[aria-controls="tabpanel-1"').click()
    cy.get('#listing-type').click();
    cy.contains('.MuiMenuItem-root', 'House').click();
    cy.get('#listing-type').should('have.text', 'House');
    cy.get('button[type=submit]').click();
    cy.get('[role=dialog]').contains('button', 'OK').click();

    cy.get('div[aria-label="Listing form tabs"]').get('button[aria-controls="tabpanel-0"').click()
    cy.get('#listing-price').focus().type('{backspace}').type(-1);
    cy.get('button[type=submit]').click();
    cy.get('[role=dialog]').contains('button', 'OK').click();
    cy.get('#listing-price').focus().type('{backspace}').type('{backspace}').type(price);
    cy.get('button[type=submit]').click();
  });

  // it('Login invalid credentials', () => {
  //   cy.visit('localhost:3000/dashboard')
  //   cy.get('header').get('button[aria-label="Open menu"]').click();
  //   cy.get('header').get('button[aria-label="Open menu"]').get('a[aria-label="Log Out"]').click();

  //   // cy.get('header').get('button[aria-label="Open menu"]').click();
  //   // cy.get('header').get('button[aria-label="Open menu"]').get('a[aria-label="Log In"]').click();

  //   const email = 'a@a.com';
  //   const password = 'b';

  //   cy.get('input[name="email"]').focus().type(email);
  //   cy.get('input[name="password"]').focus().type(password);
  //   cy.get('button[type=submit]').click();

  //   cy.get('[role=dialog]').should('be.visible'); // Adjust the selector and timeout as needed
  //   cy.get('[role=dialog]').contains('button', 'OK').click();
  // });
})
