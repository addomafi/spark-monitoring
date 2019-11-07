import { SparkApi } from '../../lib/spark-api';
import * as nock from 'nock';
import { Application, StreamingBatch, Job } from '../../lib/domain';
import { expect, assert } from 'chai';
import * as _ from 'lodash';
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { sparkShared } from './spark-shared';

describe('SparkApi', () => {

    let sparkApi: SparkApi;
    const properties: any = {
        "applications": ['id', 'name', 'elapsedTime', 'allocatedMB', 'allocatedVCores', 'runningContainers', 'memorySeconds', 'vcoreSeconds'],
        "streamingBatches": ['batchId', 'status', 'batchDuration', 'inputSize'],
        "jobs": ['jobId', 'name', 'jobDuration', 'submissionTime', 'completionTime', 'status', 'numTasks', 'numFailedTasks']
    }

    before(() => {
        chai.should();
        chai.use(chaiAsPromised);

        sparkApi = new SparkApi({});
        // Init shared config
        sparkShared(nock);
    });

    describe('Working with Spark API', () => {
        describe('when request for Spark Apps', () => {
            it('should get all Apps', (done) => {
                sparkApi.listApplications()
                    .then((data: Application[]) => {
                        expect(typeof data).to.equal('object');
                        assert.lengthOf(data, 1);
                        _.each(data, (item, index) => {
                            expect(item, `item ${index}`).to.have.keys(properties.applications);
                        });
                        done();
                    }).catch(done);
            });
            it('should get running Apps', (done) => {
                sparkApi.listApplications('RUNNING')
                    .then((data: Application[]) => {
                        expect(typeof data).to.equal('object');
                        assert.lengthOf(data, 3);
                        _.each(data, (item, index) => {
                            expect(item, `item ${index}`).to.have.keys(properties.applications);
                        });
                        done();
                    }).catch(done);
            });
            it('should get an error for invalid parameter on get Apps', async () => {
                await sparkApi.listApplications('INVALID').should.eventually.rejected;
            });
            it('should get an error for unavailable service on get Apps', async () => {
                await sparkApi.listApplications('SUBMITTED').should.eventually.rejected;
            });
            it('should get records for Streaming Batches', (done) => {
                sparkApi.listStreamingBatches('application_1569147216125_1386')
                    .then((data: StreamingBatch[]) => {
                        expect(typeof data).to.equal('object');
                        assert.lengthOf(data, 5);
                        _.each(data, (item: StreamingBatch, index: number) => {
                            var newProps: any = properties.streamingBatches;
                            if (item.status === 'COMPLETED') {
                                newProps = _.concat(newProps, 'processingTime');
                            }
                            expect(item, `item ${index}`).to.have.keys(newProps);
                        });
                        done();
                    }).catch(done);
            });
            it('should get an empty list for Streaming Batches', (done) => {
                sparkApi.listStreamingBatches('NO_RECORDS')
                    .then((data: StreamingBatch[]) => {
                        expect(typeof data).to.equal('object');
                        assert.lengthOf(data, 0);
                        done();
                    }).catch(done);
            });
            it('should be rejected for a invalid application id on list of Streaming Batches', async () => {
                await sparkApi.listStreamingBatches('INVALID').should.eventually.rejected;
            });
            it('should get records for Jobs', (done) => {
                sparkApi.listJobs('application_1569147216125_1386')
                    .then((data: Job[]) => {
                        expect(typeof data).to.equal('object');
                        assert.lengthOf(data, 6);
                        _.each(data, (item: Job, index: number) => {
                            expect(item, `item ${index}`).to.have.keys(properties.jobs);
                        });
                        done();
                    }).catch(done);
            });
            it('should get an empty list for Jobs', (done) => {
                sparkApi.listJobs('NO_RECORDS')
                    .then((data: Job[]) => {
                        expect(typeof data).to.equal('object');
                        assert.lengthOf(data, 0);
                        done();
                    }).catch(done);
            });
            it('should be rejected for a invalid application id on list of Jobs', async () => {
                await sparkApi.listJobs('INVALID').should.eventually.rejected;
            });
        });
    });
});