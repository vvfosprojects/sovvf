import {FriendlyTimePipe} from './friendly-time.pipe';

describe('FriendlyTimePipe', () => {
    it('create an instance', () => {
        const pipe = new FriendlyTimePipe();
        expect(pipe).toBeTruthy();
    });
});
