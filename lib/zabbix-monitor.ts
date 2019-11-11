import * as Bluebird from 'bluebird';
import * as commander from 'commander';
import * as _ from 'lodash';
import * as ZabbixSender from 'node-zabbix-sender';
import { SparkMonitoring } from '../index';
import { Application, JobStatistics, Options, SparkStatistics } from '../lib/domain';
import { Logger } from '../lib/logger';

interface Metric {
  host: string;
  key: string;
  value: number;
}

export class ZabbixMonitor {
  private logger: Logger;
  private options: Options;
  private zabbixSender: ZabbixSender;

  constructor() {
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
      .option('-d, --debug', 'Debug mode');

    commander.parse(process.argv);

    /**
     * A sender to integrate with Zabbix
     */
    this.zabbixSender = new ZabbixSender({
      host: commander.zabbixHost,
      port: commander.zabbixPort,
      timeout: commander.zabbixTimeout,
    });

    this.options = {
      host: commander.yarnHost,
      logLevel: commander.debug ? 'trace' : 'info',
      portResourceMgr: commander.yarnPort,
      portYarnWebProxy: commander.yarnProxyPort,
      timeout: commander.yarnTimeout,
    };

    this.logger = new Logger(this.options);
  }

  public async run() {
    /**
     * An instance of Spark Monitoring for metrics accountability
     */
    const sparkMon = new SparkMonitoring(this.options);
    try {
      /** Retrieve all running Spark Applications */
      const runningApps: Application[] = await sparkMon.getRunningApps();
      const stats: SparkStatistics[] = await Bluebird.map(
        runningApps,
        async (item: Application) => {
          return sparkMon.getApplicationStats(item);
        },
        {
          concurrency: 3,
        },
      );
      
      // For each Spark Application statistics
      _.each(stats, (item: SparkStatistics) => {
        // Sending to Zabbix some metrics related to telemetry
        _.each(item.jobStats, (jobStats: JobStatistics) => {
          this.addMetric({"host": item.name, "key": `${jobStats.name}_min`, "value": jobStats.min});
          this.addMetric({"host": item.name, "key": `${jobStats.name}_max`, "value": jobStats.max});
          this.addMetric({"host": item.name, "key": `${jobStats.name}_mean`, "value": jobStats.mean});
          this.addMetric({"host": item.name, "key": `${jobStats.name}_window`, "value": jobStats.window});
        });
        // Sending other metrics related to resource consumption
        _.forOwn(
          _.pick(item, [
            'elapsedTime',
            'allocatedMB',
            'allocatedVCores',
            'runningContainers',
            'memorySeconds',
            'vcoreSeconds',
            'pendingRecords',
            'processedRecords',
            'totalDelay',
            'runningJobs',
          ]),
          (value, key: string) => {
            this.addMetric({"host": item.name, "key": key, "value": item[key]});
          },
        );
      });
      // Flush metrics to Zabbix
      this.zabbixSender.send((err: any, res: any) => {
        if (err) {
          this.logger.warn({ "message": "Metrics wasn't flushed to Zabbix...", "err": err });
        } else {
          this.logger.info({ "message": "Metrics was flushed to Zabbix...", "response": res });
        }
      });
    } catch (err) {
      this.logger.error({ "message": "Error during accountability of metrics!", "err": err });
    }
  }

  private addMetric(metric: Metric) {
    this.zabbixSender.addItem(metric.host, metric.key, metric.value);
    this.logger.trace(_.extend({ "message": "Adding a metrics to Zabbix..." }, metric));
  }
}