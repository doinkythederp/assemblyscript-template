// @ts-check
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tests/tsconfig.json',
            useESM: true,
        },
    },
    extensionsToTreatAsEsm: ['.ts'],
};
