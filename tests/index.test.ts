import { add } from '../build/debug.js';

function* range(from: number, to: number) {
    for (let i = from; i < to; i++) {
        yield i;
    }
}

describe('add', () => {
    it('should add two numbers', () => {
        for (const x of range(0, 10)) {
            for (const y of range(0, 10)) {
                expect(add(x, y)).toBe(x + y);
            }
        }
    });
});
