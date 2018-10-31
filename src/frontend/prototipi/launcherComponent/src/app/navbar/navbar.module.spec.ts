import { NavbarModule } from './navbar.module';

describe('NavbarModule', () => {
  let navbarModule: NavbarModule;

  beforeEach(() => {
    navbarModule = new NavbarModule();
  });

  it('should create an instance', () => {
    expect(navbarModule).toBeTruthy();
  });
});
