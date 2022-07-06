import { Command } from 'commander';
import { argv, cwd } from 'node:process';
import { fileURLToPath } from 'node:url';
import {
    binPath,
    colors,
    createCommandRunner,
    ProcessSpinner,
} from './helpers.js';
const { green, red, bold } = colors;

export interface BuildOptions {
    release: boolean;
    silent: boolean;
}

export async function build({ release, silent }: BuildOptions) {
    const log = silent ? () => {} : console.log;
    const $ = createCommandRunner(silent);

    const startTime = Date.now();
    const target = release ? 'release' : 'debug';

    log(green(bold('Compiling')), 'the current package', `(target: ${target})`);

    const compiler = new URL('asc', binPath);
    const compilerPath = fileURLToPath(compiler);
    const args = ['--target', target];

    const spinner = new ProcessSpinner(compilerPath, args);
    if (!silent) spinner.start();

    try {
        await $(compilerPath, '--target', target);
    } catch (err) {
        if (!silent) spinner.error();

        console.error(
            red(bold('Failed')),
            'to build package after',
            `${(Date.now() - startTime) / 1000}s`
        );
        // console.error(err);
        process.exit(1);
    }

    if (!silent) spinner.success();
    log(
        green(bold('Finished')),
        'building package in',
        `${(Date.now() - startTime) / 1000}s`
    );
}

export const program = new Command()
    .name('build')
    .description('Compile the current package')
    .option('-r, --release', 'Build optimized artifacts for release')
    .option('-s, --silent', 'No output is printed');

if (argv[1] === fileURLToPath(import.meta.url)) {
    build(program.parse().opts());
}
