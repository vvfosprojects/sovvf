import { FormChiamataComponent } from './form-chiamata.component';

describe('BlankPageModule', () => {
    let blankPageModule: FormChiamataComponent;

    beforeEach(() => {
        blankPageModule = new FormChiamataComponent();
    });

    it('should create an instance', () => {
        expect(blankPageModule).toBeTruthy();
    });
});
