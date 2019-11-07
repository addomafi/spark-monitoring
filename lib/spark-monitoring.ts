import { Options, Application, StreamingBatch, Job, SparkStatistics, JobStatistics } from './domain';
import { AnalisysStorage } from './local-storage';
import { SparkApi } from './spark-api';
import * as moment from 'moment';
import * as _ from 'lodash';

/**
 * This class do all the required maths to extract metrics from an Spark Application
 */
export class SparkMonitoring {

    private sparkApi: SparkApi;
    private analisysStorage: AnalisysStorage;

    constructor(options: Options) {
        this.sparkApi = new SparkApi(options);
        this.analisysStorage = new AnalisysStorage(options.tempDir);
    }

    /**
     * Retrieve a list of Spark Applications that is running
     * @returns A list of Spark Applications
     */
    async getRunningApps(): Promise<Application[]> {
        return this.sparkApi.listApplications('RUNNING');
    }

    /**
     * Extract some metrics from a given Spark Applications
     * @param application An object that represents a Spark Application
     * @returns Statistics from a Spark Application
     */
    async getApplicationStats(application: Application): Promise<SparkStatistics> {
        var self = this;
        return new Promise(function (resolve: { (sparkStats: SparkStatistics): void; }, reject: { (error: any): void; }) {
            self.sparkApi.listStreamingBatches(application.id).then(function (stats: StreamingBatch[]) {
                if (!stats.length) {
                    return _.extend(application, {
                        "streaming": false
                    });
                } else {
                    var analisysControl = self.analisysStorage.get(application.id);
                    // If not initialized
                    if (!analisysControl) {
                        analisysControl = {
                            "lastBatchId": 0,
                            "lastJobId": 0
                        };
                    }

                    // Take into account total records in backlog
                    var queued = _.filter(stats, function (o: StreamingBatch) { return o.status && o.status != "COMPLETED"; });
                    var backlog = {
                        "streaming": true,
                        "pendingRecords": _.sumBy(queued, 'inputSize'),
                        "processedRecords": _.sumBy(_.filter(stats, function (o: StreamingBatch) { return o.status && o.status === "COMPLETED"; }), 'inputSize'),
                        "totalDelay": _.sumBy(queued, 'batchDuration')
                    };

                    // Set the last processed batch
                    var firstBatch = _.head(_.filter(stats, function (o: StreamingBatch) { return o.status === "COMPLETED" && (!analisysControl.lastBatchId || o.batchId > analisysControl.lastBatchId); }));
                    if (firstBatch) {
                        analisysControl.lastBatchId = firstBatch.batchId;
                    }
                    self.analisysStorage.store(application.id, analisysControl);

                    return _.extend(application, backlog);
                }
            }).then(function (sparkStats: SparkStatistics) {
                self.sparkApi.listJobs(application.id).then(function (jobs: Job[]) {
                    var analisysControl = self.analisysStorage.get(application.id);
                    // If not initialized
                    if (!analisysControl) {
                        analisysControl = {
                            "lastJobId": 0
                        };
                    }

                    var processedJobs = _.filter(jobs, function (o: Job) { return (o.status === "COMPLETED" || o.status === "SUCCEEDED") && (!analisysControl.lastJobId || o.jobId > analisysControl.lastJobId); });
                    var jobsByName = _.groupBy(processedJobs, 'name');
                    var jobsStats: JobStatistics[] = [];
                    _.forOwn(jobsByName, function (jobs: Job[], key: string) {
                        jobsStats.push({
                            "name": key,
                            "mean": _.meanBy(jobs, 'jobDuration'),
                            "max": _.maxBy(jobs, 'jobDuration').jobDuration,
                            "min": _.minBy(jobs, 'jobDuration').jobDuration,
                            "window": moment(_.first(jobs).completionTime).diff(moment(_.last(jobs).submissionTime)),
                        });
                    });

                    // Take into account running jobs
                    var running = _.filter(jobs, function (o: Job) { return o.status === "RUNNING"; });
                    sparkStats.runningJobs = running.length;
                    sparkStats.jobStats = jobsStats;
                    if (!sparkStats.jobStats.length) {
                        jobsByName = _.groupBy(running, 'name');
                        _.forOwn(jobsByName, function (jobs: Job[], key: string) {
                            jobsStats.push({
                                "name": key,
                                "mean": _.meanBy(jobs, 'jobDuration'),
                                "max": _.maxBy(jobs, 'jobDuration').jobDuration,
                                "min": _.minBy(jobs, 'jobDuration').jobDuration,
                                "window": moment().diff(moment(_.last(jobs).submissionTime)),
                            });
                        });
                        if (jobsStats.length) {
                            sparkStats.jobStats = jobsStats;
                        } else {
                            sparkStats.jobStats = analisysControl.lastJobStats;
                        }
                    }

                    // Set the last processed batch
                    var firstJob = _.head(processedJobs);
                    if (firstJob) {
                        analisysControl.lastJobId = firstJob.jobId;
                    }
                    analisysControl.lastJobStats = sparkStats.jobStats;
                    self.analisysStorage.store(application.id, analisysControl);

                    resolve(sparkStats);
                })
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}