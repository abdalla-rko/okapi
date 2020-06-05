import Chance from 'chance';
const chance = new Chance();

describe('login', () => {
  const email = chance.email();
  const pass = 'ValidPassword123';

  beforeEach(() => {
    cy.visit('http://localhost:5000/auth');
  })
  it('has a little', () => {
    cy.contains('login');
  })

  it('blocks protecterd routes', () => {
    
  })
})