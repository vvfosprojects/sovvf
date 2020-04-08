import { RigafiltriPage } from './app.po';

describe('rigafiltri App', () => {
  let page: RigafiltriPage;

  beforeEach(() => {
    page = new RigafiltriPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
