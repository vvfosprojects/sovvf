import { RichiesteAssistenzaModule } from './richieste-assistenza.module';

describe('BlankPageModule', () => {
    let richiesteAssistenzaModule: RichiesteAssistenzaModule;

    beforeEach(() => {
        richiesteAssistenzaModule = new RichiesteAssistenzaModule();
    });

    it('should create an instance', () => {
        expect(richiesteAssistenzaModule).toBeTruthy();
    });
});
