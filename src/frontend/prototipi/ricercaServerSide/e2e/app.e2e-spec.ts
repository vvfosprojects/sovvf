import { RicercaServerSidePage } from './app.po';

describe('ricerca-server-side App', () => {
  let page: RicercaServerSidePage;

  beforeEach(() => {
    page = new RicercaServerSidePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
