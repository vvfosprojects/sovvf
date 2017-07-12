import { Mappa1Page } from './app.po';

describe('mappa1 App', function() {
  let page: Mappa1Page;

  beforeEach(() => {
    page = new Mappa1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
