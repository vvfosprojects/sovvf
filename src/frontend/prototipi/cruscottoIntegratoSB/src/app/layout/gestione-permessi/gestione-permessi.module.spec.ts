import { GestionePermessiModule } from './gestione-permessi.module';

describe('GestionePermessiModule', () => {
    let gestionePermessiModule: GestionePermessiModule;

    beforeEach(() => {
        gestionePermessiModule = new GestionePermessiModule();
    });

    it('should create an instance', () => {
        expect(gestionePermessiModule).toBeTruthy();
    });
});
