import { SchedacontattoPage } from './app.po';

describe('schedacontatto App', () => {
  let page: SchedacontattoPage;

  beforeEach(() => {
    page = new SchedacontattoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
