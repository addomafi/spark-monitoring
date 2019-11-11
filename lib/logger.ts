'use strict';

import * as Bunyan from 'bunyan';
import * as _ from 'lodash';
import { Options } from './domain';

export class Logger extends Bunyan {
    constructor(options: Options) {
        const params = _.extend({
            logLevel: "info",
            logName: "spark-monitoring",
        }, options);
        super({ name: params.logName, level: Bunyan.levelFromName[params.logLevel] });
    }
}