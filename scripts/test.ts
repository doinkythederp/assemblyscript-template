import { argv, env } from 'node:process';
import { fileURLToPath } from 'node:url';
import { binPath, colors, createCommandRunner } from './helpers.js';
import { program as buildProgram, build, BuildOptions } from './build.js';
import { spawn } from 'node:child_process';
import { Command } from 'commander';
const { green, red, bold, cyan } = colors;

export interface TestOptions extends BuildOptions {
    build: boolean;
}

export async function test(options: TestOptions) {
    const log = options.silent ? () => {} : console.log;
    const $ = createCommandRunner(options.silent);

    const testRunner = new URL('jest', binPath);
    const testRunnerPath = fileURLToPath(testRunner);

    await build(options);
    log(green(bold('Running')), 'Jest unit tests');
    const runner = spawn(testRunnerPath, {
        stdio: options.silent ? 'pipe' : 'inherit',
        env: {
            ...env,
            NODE_OPTIONS: '--experimental-vm-modules',
        },
    });

    const errorAndExit = (err?: Error): never => {
        log(red(bold('Failed')), 'to run unit tests');
        log(cyan(bold('⟶')), ' Check above for error logs and more info');
        if (err) log(err);
        process.exit(1);
    };
    runner.on('close', (code) => {
        if (code !== 0) {
            errorAndExit();
        }

        log(green(bold('Finished')), 'running unit tests');
    });
    runner.on('error', errorAndExit);
}

export const program = new Command()
    .name('test')
    .description('Compile the current package and execute unit tests')
    .option(
        '-B, --no-build',
        'Skip the build step and only run unit tests. In most cases this is not neccesary.'
    )
    .option('-s, --silent', 'No output is printed');

if (argv[1] === fileURLToPath(import.meta.url)) test(program.parse().opts());
