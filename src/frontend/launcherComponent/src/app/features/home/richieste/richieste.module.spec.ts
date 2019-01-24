import { RichiesteModule } from './richieste.module';

describe('RichiesteModule', () => {
  let richiesteModule: RichiesteModule;

  beforeEach(() => {
    richiesteModule = new RichiesteModule();
  });

  it('should create an instance', () => {
    expect(richiesteModule).toBeTruthy();
  });
});
