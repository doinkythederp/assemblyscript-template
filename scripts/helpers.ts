import { spawn } from 'node:child_process';
import { URL } from 'node:url';
import * as path from 'node:path';
import { cwd } from 'node:process';
import { createSpinner, Spinner as Nanospinner } from 'nanospinner';
import { createColors } from 'picocolors';
import spinners from 'cli-spinners';
import { stripVTControlCharacters } from 'node:util';
export const colors = createColors();

/** Create a child process and show a spinner in the terminal until it is done */
export function createCommandRunner(silent: boolean) {
    return function $(
        command: string,
        ...args: readonly string[]
    ): Promise<string> {
        const process = spawn(command, args);

        let logs = '';
        process.stdout.once('data', (chunk) => (logs += chunk));
        process.stderr.once('data', (chunk) => (logs += chunk));

        return new Promise((resolve, reject) => {
            const rejectWithLogs = (err: Error & { logs: string }) => {
                err.logs = logs;
                reject(err);
            };
            process.once('error', rejectWithLogs);
            process.once('close', (code) => {
                if (code !== 0) {
                    return rejectWithLogs(
                        new Error(
                            `Process exited with code ${code}`
                        ) as Error & {
                            logs: string;
                        }
                    );
                }
                resolve(logs);
            });
        });
    };
}
export const binPath = new URL('../node_modules/.bin/', import.meta.url);

export class ProcessSpinner {
    public readonly nanospinner: Nanospinner;
    public readonly text: string;

    public constructor(command: string, args: string[]) {
        const cmdString = colors.green(`./${path.relative(cwd(), command)}`);
        const argString = args
            .map((arg) => ` '${arg.replaceAll("'", "'")}'`)
            .join('');
        this.text = `${cmdString}${argString}`;

        this.nanospinner = createSpinner(this.text, {
            frames: spinners.arc.frames.map((frame) =>
                ' '.repeat(4).concat(frame)
            ),
            interval: spinners.arc.interval,
        });

        this.start = this.nanospinner.start.bind(this.nanospinner);
    }

    public start: Nanospinner['start'];

    public success() {
        this.nanospinner.success({
            mark: `${' '.repeat(4)}${colors.green('✔')}`,
        });
    }
    public error() {
        this.nanospinner.error({
            mark: `${' '.repeat(4)}${colors.red(colors.bold('✖'))}`,
            text: colors.red(colors.bold(stripVTControlCharacters(this.text))),
        });
    }
}
