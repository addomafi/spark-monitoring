import { SparkMonitoring } from '../../lib/spark-monitoring';
import * as nock from 'nock';
import { Application, StreamingBatch, Job, SparkStatistics } from '../../lib/domain';
import { jobData } from './spark-api-job-data';
import { streamingData } from './spark-api-streaming-data';
import { sparkApps, sparkRunningApps } from './spark-api-application-data';
import { expect, assert } from 'chai';
import * as _ from 'lodash';
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { sparkShared } from './spark-shared';

describe('SparkMonitoring', () => {

    let sparkMonitoring: SparkMonitoring;

    before(() => {
        chai.should();
        chai.use(chaiAsPromised);

        sparkMonitoring = new SparkMonitoring({});
        // Init shared config
        sparkShared(nock);
    });

    describe('Working with Spark Monitoring', () => {
        describe('when request for running Spark Apps', () => {
            var application: Application;
            it('should get all running Apps', (done) => {
                sparkMonitoring.getRunningApps()
                    .then((data: Application[]) => {
                        expect(typeof data).to.equal('object');
                        application = data[0];
                        assert.lengthOf(data, 3);
                        done();
                    }).catch(done);
            });
            it('should get all running Apps', (done) => {
                sparkMonitoring.getApplicationStats(application)
                    .then((data: SparkStatistics) => {
                        expect(typeof data).to.equal('object');
                        expect(data).to.deep.equal({
                            "id": "application_1569147216125_1386",
                            "name": "51-minimum-gain",
                            "elapsedTime": 1050926592,
                            "allocatedMB": 5632,
                            "allocatedVCores": 4,
                            "runningContainers": 4,
                            "memorySeconds": 5918796398,
                            "vcoreSeconds": 4203689,
                            "streaming": true,
                            "pendingRecords": 2561,
                            "processedRecords": 951,
                            "totalDelay": 30000,
                            "runningJobs": 1,
                            "jobStats": [
                              {
                                "name": "DataCollection",
                                "mean": 17.6,
                                "max": 25,
                                "min": 11,
                                "window": 156
                              }
                            ]
                          });
                        done();
                    }).catch(done);
            });
        });
    });
});