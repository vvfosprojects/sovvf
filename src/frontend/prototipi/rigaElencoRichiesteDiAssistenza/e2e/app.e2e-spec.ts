import { RigaElencoRichiesteDiAssistenzaPage } from './app.po';

describe('riga-elenco-richieste-di-assistenza App', () => {
  let page: RigaElencoRichiesteDiAssistenzaPage;

  beforeEach(() => {
    page = new RigaElencoRichiesteDiAssistenzaPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
