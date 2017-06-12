import { GestionePermessiPage } from './app.po';

describe('gestione-permessi App', () => {
  let page: GestionePermessiPage;

  beforeEach(() => {
    page = new GestionePermessiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
