import { CartografiaPage } from './app.po';

describe('cartografia App', () => {
  let page: CartografiaPage;

  beforeEach(() => {
    page = new CartografiaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
