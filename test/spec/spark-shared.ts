import { jobData } from './spark-api-job-data';
import { streamingData } from './spark-api-streaming-data';
import { sparkApps, sparkRunningApps } from './spark-api-application-data';

export const sparkShared = (nock: any): void => {
    // Mock YARN Resource Manager
    nock('http://localhost:8088')
        .get('/ws/v1/cluster/apps')
        .reply(200, sparkApps)
        .get('/ws/v1/cluster/apps?states=RUNNING')
        .reply(200, sparkRunningApps);

    // Mock YARN web proxy
    nock('http://localhost:20888')
        .get('/proxy/application_1569147216125_1386/api/v1/applications/application_1569147216125_1386/streaming/batches')
        .reply(200, streamingData)
        .get('/proxy/NO_RECORDS/api/v1/applications/NO_RECORDS/streaming/batches')
        .reply(200, [])
        .get('/proxy/application_1569147216125_1386/api/v1/applications/application_1569147216125_1386/jobs')
        .reply(200, jobData)
        .get('/proxy/NO_RECORDS/api/v1/applications/NO_RECORDS/jobs')
        .reply(200, []);
}