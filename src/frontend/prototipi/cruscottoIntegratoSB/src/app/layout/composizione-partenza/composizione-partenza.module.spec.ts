import { ComposizionePartenzaModule } from './composizione-partenza.module';

describe('BlankPageModule', () => {
    let composizionePartenzaModule: ComposizionePartenzaModule;

    beforeEach(() => {
        composizionePartenzaModule = new ComposizionePartenzaModule();
    });

    it('should create an instance', () => {
        expect(composizionePartenzaModule).toBeTruthy();
    });
});
