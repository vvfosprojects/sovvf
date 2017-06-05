import { SquadraInServizioPage } from './app.po';

describe('squadra-in-servizio App', () => {
  let page: SquadraInServizioPage;

  beforeEach(() => {
    page = new SquadraInServizioPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
