import { MezzoInServizioPage } from './app.po';

describe('mezzo-in-servizio App', () => {
  let page: MezzoInServizioPage;

  beforeEach(() => {
    page = new MezzoInServizioPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
