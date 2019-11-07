/*jshint esversion: 8*/

import { get, RequestPromise } from 'request-promise';
import * as _ from 'lodash';
import { Options, Application, StreamingBatch, Job } from './domain';
import * as moment from 'moment';
import assert = require('assert');

const APP_STATE: string[] = ["NEW", "NEW_SAVING", "SUBMITTED", "ACCEPTED", "RUNNING", "FINISHED", "FAILED", "KILLED"];

/**
 * This class handle all required methods to extract metrics from an YARN Resource Manager
 */
export class SparkApi {
    private host: string;
    private portResourceMgr: number;
    private portYarnWebProxy: number;
    private timeout: number;

    constructor(options: Options) {
        this.host = options.host || 'localhost';
        this.portResourceMgr = options.portResourceMgr || 8088;
        this.portYarnWebProxy = options.portYarnWebProxy || 20888;
        this.timeout = options.timeout || 5000;
    }
    /**
     * List all Spark appplications from a given YARN Resource Manager 
     * @param state [optional] Filter only application that is on a given state, accepted value is ["NEW", "NEW_SAVING", "SUBMITTED", "ACCEPTED", "RUNNING", "FINISHED", "FAILED", "KILLED"]
     * @return A list of application from YARN Resource Manager
     */
    async listApplications(state?: string): Promise<Application[]> {
        var url = `http://${this.host}:${this.portResourceMgr}/ws/v1/cluster/apps`;
        if (state) {
            assert.notEqual(APP_STATE.indexOf(state), -1, 'State passed as parameter is not valid!');
            url += `?states=${state}`;
        }
        let data: { apps: { app: any; }; } = await get({
            url: url,
            json: true
        });
        try {
            var apps: Application[] = [];
            _.forEach(data.apps.app, function (item) {
                apps.push(_.pick(item, ['id', 'name', 'elapsedTime', 'allocatedMB', 'allocatedVCores', 'runningContainers', 'memorySeconds', 'vcoreSeconds']));
            });

            return apps;
        } catch (err) {
            return [];
        }
    }
    /**
     * List all Spark Streaming batches for a given application id 
     * @param applicationId Spark Application ID
     * @returns A list of streaming batches from a given application ID
     */
    async listStreamingBatches(applicationId: string): Promise<StreamingBatch[]> {
        let data: any = await get({
            url: `http://${this.host}:${this.portYarnWebProxy}/proxy/${applicationId}/api/v1/applications/${applicationId}/streaming/batches`,
            json: true
        })
        try {
            var batches: StreamingBatch[] = [];
            _.forEach(data, function (item) {
                batches.push(_.pick(item, ['batchId', 'status', 'batchDuration', 'inputSize', 'processingTime']));
            });
            return batches;
        } catch(err) {
            return [];
        };
    }
    /**
     * List all jobs for a given application ID
     * @param applicationId Spark Application ID
     * @returns A list of Jobs from a given application ID
     */
    async listJobs(applicationId: string): Promise<Job[]> {
        var data: any = await get({
            url: `http://${this.host}:${this.portYarnWebProxy}/proxy/${applicationId}/api/v1/applications/${applicationId}/jobs`,
            json: true
        });
        try {
            var jobs: Job[] = [];
            _.forEach(data, function (item) {
                var tempJob = _.pick(item, ['jobId', 'name', 'submissionTime', 'completionTime', 'status', 'numTasks', 'numFailedTasks', 'jobDuration']);
                const regex = /(\S+)\.scala\:/gm;
                var rgxComponent = regex.exec(tempJob.name);
                if (rgxComponent && rgxComponent.length) {
                    tempJob.name = rgxComponent[1];
                }
                tempJob.completionTime = _.replace(tempJob.completionTime, "GMT", "Z");
                tempJob.submissionTime = _.replace(tempJob.submissionTime, "GMT", "Z");
                if (tempJob.completionTime) {
                    tempJob.jobDuration = moment(tempJob.completionTime).diff(moment(tempJob.submissionTime));
                } else {
                    tempJob.jobDuration = moment().diff(moment(tempJob.submissionTime));
                }
                jobs.push(tempJob);
            });
            return jobs;
        } catch(err) {
            return [];
        };
    }
}