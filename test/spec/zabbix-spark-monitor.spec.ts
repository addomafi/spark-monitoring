import * as chai from 'chai';
import { assert, expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as _ from 'lodash';
import * as nock from 'nock';
import * as ZabbixSender from 'node-zabbix-sender';
import * as sinon from 'sinon';
import { Application, SparkStatistics } from '../../lib/domain';
import { ZabbixMonitor } from '../../lib/zabbix-monitor';
import { sparkShared } from './spark-shared';

describe('ZabbixMonitor', () => {
    let zabbixMonitor: ZabbixMonitor;
    const mock = sinon.mock(ZabbixSender.prototype);

    before(() => {
        chai.should();
        chai.use(chaiAsPromised);
        mock.expects("addItem").atLeast(5);
        mock.expects("send").once();

        // Init shared config
        sparkShared(nock);

        this.zabbixMonitor = new ZabbixMonitor();
    });

    describe('Working with Spark Monitoring', () => {
        describe('when request for running Spark Apps', () => {
            it('should get all running Apps', (done) => {
                this.zabbixMonitor.run().then(() => {
                    mock.verify();
                    done();
                }).catch(done);
            });
        });
    });
});