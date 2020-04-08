import { SchedaContattoModule } from './scheda-contatto.module';

describe('SchedaContattoModule', () => {
    let schedaContattoModule: SchedaContattoModule;

    beforeEach(() => {
        schedaContattoModule = new SchedaContattoModule();
    });

    it('should create an instance', () => {
        expect(schedaContattoModule).toBeTruthy();
    });
});
