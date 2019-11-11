import * as _ from 'lodash';
import * as moment from 'moment';
import { Logger } from '../lib/logger';
import { Application, Job, JobStatistics, Options, SparkStatistics, StreamingBatch } from './domain';
import { AnalisysStorage } from './local-storage';
import { SparkApi } from './spark-api';

/**
 * This class do all the required maths to extract metrics from an Spark Application
 */
export class SparkMonitoring {
  private logger: Logger;
  private sparkApi: SparkApi;
  private analisysStorage: AnalisysStorage;

  constructor(options: Options) {
    this.analisysStorage = new AnalisysStorage(options.tempDir);
    this.logger = new Logger(options);
    this.sparkApi = new SparkApi(options);
  }

  /**
   * Retrieve a list of Spark Applications that is running
   * @returns A list of Spark Applications
   */
  public async getRunningApps(): Promise<Application[]> {
    return this.sparkApi.listApplications('RUNNING');
  }

  /**
   * Extract some metrics from a given Spark Applications
   * @param application An object that represents a Spark Application
   * @returns Statistics from a Spark Application
   */
  public async getApplicationStats(application: Application): Promise<SparkStatistics> {
    const self = this;
    let sparkStats: SparkStatistics;
    this.logger.info(`Starting accoutability of metrics for ${application.name} application.`);
    // Retrieve checkpoint for analysis
    let metricCheckpoint = self.analisysStorage.get(application.id);
    // If not initialized
    if (!metricCheckpoint) {
      this.logger.debug(`No checkpoint was found for Application ID ${application.id}.`);
      metricCheckpoint = {
        lastBatchId: 0,
        lastJobId: 0,
      };
    }

    try {
      const stats: StreamingBatch[] = await self.sparkApi.listStreamingBatches(application.id)

      // Take into account total records in backlog
      const queued = _.filter(stats, (o: StreamingBatch) => o.status && o.status !== 'COMPLETED');

      // Set the last processed batch
      const firstBatch = _.head(
        _.filter(
          stats,
          (o: StreamingBatch) =>
            o.status === 'COMPLETED' && (!metricCheckpoint.lastBatchId || o.batchId > metricCheckpoint.lastBatchId),
        ),
      );
      if (firstBatch) {
        metricCheckpoint.lastBatchId = firstBatch.batchId;
      }
      self.analisysStorage.store(application.id, metricCheckpoint);

      sparkStats = _.extend(application, {
        pendingRecords: _.sumBy(queued, 'inputSize'),
        processedRecords: _.sumBy(
          _.filter(stats, (o: StreamingBatch) => o.status && o.status === 'COMPLETED'),
          'inputSize',
        ),
        streaming: true,
        totalDelay: _.sumBy(queued, 'batchDuration'),
      });
    } catch (err) {
      this.logger.debug("No streaming batch was found!");
      // Skip from streaming data
      sparkStats = _.extend(application, {
        streaming: false,
      });
    }

    try {
      // Retrieve Jobs from an application
      const jobs: Job[] = await self.sparkApi.listJobs(application.id);
  
      const processedJobs = _.filter(
        jobs,
        (o: Job) =>
          (o.status === 'COMPLETED' || o.status === 'SUCCEEDED') &&
          (!metricCheckpoint.lastJobId || o.jobId > metricCheckpoint.lastJobId),
      );
      let jobsByName = _.groupBy(processedJobs, 'name');
      const jobsStats: JobStatistics[] = [];
      _.forOwn(jobsByName, (filteredJobs: Job[], key: string) => {
        jobsStats.push({
          max: _.maxBy(filteredJobs, 'jobDuration').jobDuration,
          mean: _.meanBy(filteredJobs, 'jobDuration'),
          min: _.minBy(filteredJobs, 'jobDuration').jobDuration,
          name: key,
          window: moment(_.first(filteredJobs).completionTime).diff(moment(_.last(filteredJobs).submissionTime)),
        });
      });
  
      // Take into account running jobs
      const running = _.filter(jobs, (o: Job) => o.status === 'RUNNING');
      sparkStats.runningJobs = running.length;
      sparkStats.jobStats = jobsStats;
      if (!sparkStats.jobStats.length) {
        jobsByName = _.groupBy(running, 'name');
        _.forOwn(jobsByName, (filteredJobs: Job[], key: string) => {
          jobsStats.push({
            max: _.maxBy(filteredJobs, 'jobDuration').jobDuration,
            mean: _.meanBy(filteredJobs, 'jobDuration'),
            min: _.minBy(filteredJobs, 'jobDuration').jobDuration,
            name: key,
            window: moment().diff(moment(_.last(filteredJobs).submissionTime)),
          });
        });
        if (jobsStats.length) {
          sparkStats.jobStats = jobsStats;
        } else {
          sparkStats.jobStats = metricCheckpoint.lastJobStats;
        }
      }
  
      // Set the last processed batch
      const firstJob = _.head(processedJobs);
      if (firstJob) {
        metricCheckpoint.lastJobId = firstJob.jobId;
      }
      metricCheckpoint.lastJobStats = sparkStats.jobStats;
      self.analisysStorage.store(application.id, metricCheckpoint);      
    } catch (err) {
      this.logger.debug("No one job was found!");
    }
    return sparkStats;
  }
}
