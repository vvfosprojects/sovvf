import { ComponiPartenza2Page } from './app.po';

describe('componi-partenza2 App', function() {
  let page: ComponiPartenza2Page;

  beforeEach(() => {
    page = new ComponiPartenza2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
