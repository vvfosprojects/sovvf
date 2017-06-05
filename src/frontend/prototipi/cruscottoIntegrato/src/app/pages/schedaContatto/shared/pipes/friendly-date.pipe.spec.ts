import { FriendlyDatePipe } from './friendly-date.pipe';

describe('FriendlyDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FriendlyDatePipe();
    expect(pipe).toBeTruthy();
  });
});
