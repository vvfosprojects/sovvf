import { BoxesInfoPage } from './app.po';

describe('boxes-info App', () => {
  let page: BoxesInfoPage;

  beforeEach(() => {
    page = new BoxesInfoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
