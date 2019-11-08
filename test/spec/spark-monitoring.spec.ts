import * as chai from 'chai';
import { assert, expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as _ from 'lodash';
import * as nock from 'nock';
import { Application, SparkStatistics } from '../../lib/domain';
import { SparkMonitoring } from '../../lib/spark-monitoring';
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
      let application: Application;
      it('should get all running Apps', done => {
        sparkMonitoring
          .getRunningApps()
          .then((data: Application[]) => {
            expect(typeof data).to.equal('object');
            application = data[0];
            assert.lengthOf(data, 3);
            done();
          })
          .catch(done);
      });
      it('should get Spark Statistics for Apps', done => {
        sparkMonitoring
          .getApplicationStats(application)
          .then((data: SparkStatistics) => {
            expect(typeof data).to.equal('object');
            expect(data).to.deep.equal({
              allocatedMB: 5632,
              allocatedVCores: 4,
              elapsedTime: 1050926592,
              id: 'application_1569147216125_1386',
              jobStats: [
                {
                  max: 25,
                  mean: 17.6,
                  min: 11,
                  name: 'DataCollection',
                  window: 156,
                },
              ],
              memorySeconds: 5918796398,
              name: '51-minimum-gain',
              pendingRecords: 2561,
              processedRecords: 951,
              runningContainers: 4,
              runningJobs: 1,
              streaming: true,
              totalDelay: 30000,
              vcoreSeconds: 4203689,
            });
            done();
          })
          .catch(done);
      });
    });
  });
});
