import { MezziModule } from './mezzi.module';

describe('BlankPageModule', () => {
    let mezziModule: MezziModule;

    beforeEach(() => {
        mezziModule = new MezziModule();
    });

    it('should create an instance', () => {
        expect(mezziModule).toBeTruthy();
    });
});
