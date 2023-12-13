// please run with happy-path-database.json set as database

context('Happy path flow', () => {
  it('Successfully registers', () => {
    cy.visit('localhost:3000/register')
    const email = 'a@a.com';
    const name = 'a';
    const password = 'a';

    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="name"]').focus().type(name);
    cy.get('input[name="password"]').focus().type(password);
    cy.get('input[name="confirm-password"]').focus().type(password);
    cy.get('button[type=submit]').click();

    // Check that it is successful
    cy.url().should('include', '/dashboard');
  });

  it('Successfully creates new listing', () => {
    cy.visit('localhost:3000/dashboard')
    cy.get('header').contains('button', 'Create New Listing').click();
    cy.url().should('include', '/create');

    const title = 'New Listing'
    const description = 'A new listing has appeared!'
    const country = 'Australia'
    const state = 'NSW'
    const city = 'Sydney'
    const suburb = 'Suburb'
    const street = '1 Street Lane'
    const postcode = '2000'
    const price = 200
    const noBathrooms = 2
    const noBedrooms = 2

    cy.get('#listing-title').focus().type(title);
    cy.get('#listing-description').focus().type(description);
    cy.get('div[aria-label="listing-country"] input').focus().type(country);
    cy.get('div[aria-label="listing-state"] input').focus().type(state);
    cy.get('div[aria-label="listing-city"] input').focus().type(city);
    cy.get('div[aria-label="listing-suburb"] input').focus().type(suburb);
    cy.get('div[aria-label="listing-street"] input').focus().type(street);
    cy.get('div[aria-label="listing-postcode"] input').focus().type(postcode);
    cy.get('#listing-price').focus().type('{backspace}').type(price);

    cy.get('div[aria-label="Listing form tabs"]').get('button[aria-controls="tabpanel-1"').click();
    cy.get('#listing-no-bathrooms').focus().type('{backspace}').type(noBathrooms);
    cy.get('#listing-no-bedrooms').focus().type('{backspace}').type(noBedrooms);
    cy.get('div[aria-label="Bed 1"] input').focus().type(2);
    cy.get('div[aria-label="Bed 2"] input').focus().type(1);

    cy.get('#listing-type').click();
    cy.contains('.MuiMenuItem-root', 'House').click();
    cy.get('#listing-type').should('have.text', 'House');

    cy.contains('label', 'Wi-Fi').find('input[type="checkbox"]').check();
    cy.contains('label', 'Wi-Fi').find('input[type="checkbox"]').should('be.checked');
    cy.contains('label', 'Wi-Fi').find('input[type="checkbox"]').uncheck();
    cy.contains('label', 'Wi-Fi').find('input[type="checkbox"]').should('not.be.checked');

    cy.contains('label', 'Kitchen').find('input[type="checkbox"]').check();
    cy.contains('label', 'Kitchen').find('input[type="checkbox"]').should('be.checked');

    cy.contains('label', 'Cutlery/Crockery').find('input[type="checkbox"]').check();
    cy.contains('label', 'Cutlery/Crockery').find('input[type="checkbox"]').should('be.checked');

    cy.get('div[aria-label="Listing form tabs"]').get('button[aria-controls="tabpanel-2"').click();

    cy.get('button[type=submit]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Successfully edits listing by adding thumbnail and title', () => {
    cy.visit('localhost:3000/dashboard')
    cy.get('button[aria-label="Edit listing New Listing"]').click();
    cy.url().should('include', '/edit');
    cy.get('#listing-title').should('have.value', 'New Listing');
    cy.get('#listing-title').focus().type(' Title');

    cy.get('div[aria-label="Listing form tabs"]').get('button[aria-controls="tabpanel-2"').click();
    const filePath = 'how-to-design-a-house.jpg';
    cy.get('#listing-thumbnail').parent().click();

    // Upload image
    cy.fixture(filePath).then((fileContent) => {
      cy.get('#listing-thumbnail').then((input) => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');
        const testFile = new File([blob], filePath, { type: 'image/jpeg' });

        // Use the FileList constructor to create a FileList containing the test file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        input[0].files = dataTransfer.files;

        // Trigger the change event to simulate the file upload
        cy.get('#listing-thumbnail').trigger('change', { force: true });
      });
    });

    cy.get('button[type=submit]').click();
  });

  it('Successfully publishes listing', () => {
    cy.visit('localhost:3000/dashboard')
    cy.get('button[aria-label="Publish listing New Listing Title"]').click();
    cy.url().should('include', '/publish');

    cy.contains('button', 'Add Date').click();

    const startDate = new Date()
    cy.get('input[aria-label="Start date 0"]').type(startDate.toISOString().slice(0, 10));

    const endDate = new Date()
    endDate.setDate(startDate.getDate() + 5)
    cy.get('input[aria-label="End date 0"]').type(endDate.toISOString().slice(0, 10));

    cy.contains('button', 'Publish').click();
    cy.url().should('include', '/dashboard');
  });

  it('Successfully unpublishes listing', () => {
    cy.visit('localhost:3000/dashboard')
    cy.get('button[aria-label="Publish listing New Listing Title"]').click();
    cy.url().should('include', '/publish');

    cy.contains('button', 'Unpublish').click();
    cy.url().should('include', '/dashboard');
  });

  it('Successfully books listing', () => {
    cy.visit('localhost:3000')
    cy.get('button[aria-label="Listing to Book details"]').click();
    cy.contains('button', 'Request to Book').click();

    const startDate = new Date()
    cy.get('#booking-start-date').type(startDate.toISOString().slice(0, 10));

    const endDate = new Date()
    endDate.setDate(startDate.getDate() + 1)
    cy.get('#booking-end-date').type(endDate.toISOString().slice(0, 10));

    cy.contains('button', 'Request to Book').click();
    cy.get('[role=dialog]').should('be.visible');
    cy.get('[role=dialog]').contains('button', 'Yes').click();
  });

  it('Successfully logs out after registering', () => {
    cy.visit('localhost:3000/dashboard')
    cy.get('header').get('button[aria-label="Open menu"]').click();
    cy.get('header').get('button[aria-label="Open menu"]').get('a[aria-label="Log Out"]').click();

    cy.url().should('include', '/login');
  });

  it('Successfully logs in after entering the correct credentials', () => {
    const email = 'a@a.com';
    const password = 'a';

    cy.get('input[name="email"]').focus().type(email);
    cy.get('input[name="password"]').focus().type(password);
    cy.get('button[type=submit]').click();

    // Check that it is successful
    cy.url().should('include', '/dashboard');
  });
});
