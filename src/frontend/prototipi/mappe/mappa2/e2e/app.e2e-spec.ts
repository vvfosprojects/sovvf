import { MappaPage } from './app.po';

describe('mappa App', () => {
  let page: MappaPage;

  beforeEach(() => {
    page = new MappaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
