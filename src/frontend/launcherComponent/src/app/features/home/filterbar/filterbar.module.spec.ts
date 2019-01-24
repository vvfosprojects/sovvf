import { FilterbarModule } from './filterbar.module';

describe('FilterbarModule', () => {
  let filterbarModule: FilterbarModule;

  beforeEach(() => {
    filterbarModule = new FilterbarModule();
  });

  it('should create an instance', () => {
    expect(filterbarModule).toBeTruthy();
  });
});
