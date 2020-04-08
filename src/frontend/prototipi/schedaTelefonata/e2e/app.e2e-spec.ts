import { SovvfPage } from './app.po';

describe('sovvf App', () => {
  let page: SovvfPage;

  beforeEach(() => {
    page = new SovvfPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
