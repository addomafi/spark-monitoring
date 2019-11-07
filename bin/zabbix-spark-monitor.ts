#!/bin/node
import { SparkMonitoring } from '../index';
import { Application, SparkStatistics, JobStatistics, Options } from '../lib/domain';
import * as _ from 'lodash';
import * as ZabbixSender from 'node-zabbix-sender';
import * as commander from 'commander';
import { Promise } from "bluebird";

/**
 * Define some options
 */
commander
    .option('-z, --zabbix-host <host>', 'Zabbix Host')
    .option('--zabbix-port <port>', 'Zabbix Port', parseInt)
    .option('--zabbix-timeout <timeout>', 'Zabbix Timeout', parseInt)
    .option('-y, --yarn-host <host>', 'YARN Host')
    .option('--yarn-port <port>', 'YARN Resource Manager Port', parseInt)
    .option('--yarn-proxy-port <port>', 'YARN Web Proxy Port', parseInt)
    .option('--yarn-timeout <timeout>', 'YARN Timeout', parseInt)

/**
 * A sender to integrate with Zabbix
 */
let Sender = new ZabbixSender({ 
    "host": commander.zabbixHost, 
    "port": commander.zabbixPort,
    "timeout": commander.zabbixTimeout
});

/**
 * An instance of Spark Monitoring for metrics accountability
 */
var sparkMon = new SparkMonitoring({
    "host": commander.yarnHost,
    "portResourceMgr": commander.yarnPort,
    "portYarnWebProxy": commander.yarnProxyPort,
    "timeout": commander.yarnTimeout
});

/** Retrieve alll running Spark Applications */
var runningApps: Promise<Application[]> = sparkMon.getRunningApps();
/** Then get Statistics from each Spark Application */
runningApps.then((data: Application[]) => {
    Promise.map(data, function (item: Application) {
        return sparkMon.getApplicationStats(item);
    }, {
        concurrency: 3
    }).then(function (stats: SparkStatistics[]) {
        // For each Spark Application statistics
        _.each(stats, function (item: SparkStatistics) {
            // Sending to Zabbix some metrics related to telemetry
            _.each(item.jobStats, function (jobStats: JobStatistics) {
                Sender.addItem(item.name, `${jobStats.name}_min`, jobStats.min);
                Sender.addItem(item.name, `${jobStats.name}_max`, jobStats.max);
                Sender.addItem(item.name, `${jobStats.name}_mean`, jobStats.mean);
                Sender.addItem(item.name, `${jobStats.name}_window`, jobStats.window);
            });
            // Sending other metrics related to resource consumption
            _.forOwn(_.pick(item, ['elapsedTime', 'allocatedMB', 'allocatedVCores', 'runningContainers', 'memorySeconds', 'vcoreSeconds', 'pendingRecords', 'totalDelay', 'runningJobs']), function (value, key: string) {
                Sender.addItem(item.name, key, item[key]);
            });
        });
        // Flush metrics to Zabbix
        Sender.send(function (err: any, res: any) {
            if (err) {
                throw err;
            }
            console.dir(res);
        });
    }).catch((err: any) => {
        console.log(err);
    });
}).catch((err: any) => {
    console.log(err);
})
