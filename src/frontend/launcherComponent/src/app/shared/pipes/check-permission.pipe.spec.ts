import { CheckPermissionPipe } from './check-permission.pipe';

describe('CheckPermissionPipe', () => {
  it('create an instance', () => {
    const pipe = new CheckPermissionPipe();
    expect(pipe).toBeTruthy();
  });
});
