import { BaseCommand } from './base-command.js';
import { app } from './app.js';
import { _ } from '@/lib/locale.js';
import { Setting } from '@/lib/models/setting.js';
import { BaseItem } from '@/lib/models/base-item.js';
import { vorpalUtils } from './vorpal-utils.js';
import { Synchronizer } from '@/lib/synchronizer.js';
const locker = require('proper-lockfile');
const fs = require('fs-extra');

class Command extends BaseCommand {
    constructor() {
        super();
        this.syncTarget_ = null;
        this.releaseLockFn_ = null;
    }

    usage() {
        return 'sync';
    }

    static async lockFile(filePath) {
        try {
            const release = await locker.lock(filePath);
            return release;
        } catch (error) {
            throw error;
        }
    }

    static async isLocked(filePath) {
        try {
            const isLocked = locker.checkSync(filePath);
            return isLocked;
        } catch (error) {
            throw error;
        }
    }

    description() {
        return _('Synchronizes with remote storage.');
    }

    options() {
        return [
            [
                '--target <target>',
                _(
                    'Sync to provided target (defaults to sync.target config value)'
                )
            ],
            ['--random-failures', _('For debugging purposes. Do not use.')]
        ];
    }

    async action(args) {
        this.releaseLockFn_ = null;
        const lockFilePath = Setting.value('tempDir') + '/synclock';
        if (!(await fs.pathExists(lockFilePath)))
            await fs.writeFile(lockFilePath, 'synclock');

        if (await Command.isLocked(lockFilePath))
            throw new Error(_('Synchronisation is already in progress.'));
        this.releaseLockFn_ = await Command.lockFile(lockFilePath);

        try {
            this.syncTarget_ = Setting.value('sync.target');
            if (args.options.target) this.syncTarget_ = args.options.target;
            let sync = await app().synchronizer(this.syncTarget_);

            let options = {
                onProgress: report => {
                    let lines = Synchronizer.reportToLines(report);
                    if (lines.length) vorpalUtils.redraw(lines.join(' '));
                },
                onMessage: msg => {
                    vorpalUtils.redrawDone();
                    this.log(msg);
                },
                randomFailures: args.options['random-failures'] === true
            };

            this.log(_('Synchronization target: %s', this.syncTarget_));

            if (!sync) throw new Error(_('Cannot initialize synchronizer.'));

            this.log(_('Starting synchronization...'));

            await sync.start(options);
            vorpalUtils.redrawDone();

            await app().refreshCurrentFolder();
        } catch {
            this.releaseLockFn_();
            this.releaseLockFn_ = null;
            throw error;
        }

        this.releaseLockFn_();
        this.releaseLockFn_ = null;
    }

    async cancel() {
        const target = this.syncTarget_
            ? this.syncTarget_
            : Setting.value('sync.target');

        vorpalUtils.redrawDone();
        this.log(_('Cancelling...'));
        let sync = await app().synchronizer(target);
        sync.cancel();

        this.syncTarget_ = null;
    }
}

module.exports = Command;
