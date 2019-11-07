/*jshint esversion: 8*/

/** Some params to be defined */
export interface Options {
    host?: string;
    portResourceMgr?: number;
    portYarnWebProxy?: number;
    timeout?: number;
    tempDir?: string;
}

/** Represents an Analisys controller */
export interface MetricCheckpoint {
    lastBatchId?: number;
    lastJobId: number;
    lastJobStats?: JobStatistics[];
}

/** This represents an Spark Application */
export interface Application {
    id: string;
    name: string;
    elapsedTime: number;
    allocatedMB: number;
    allocatedVCores: number;
    runningContainers: number;
    memorySeconds: number;
    vcoreSeconds: number;
}

/** This represents Jobs Statistics */
export interface JobStatistics {
    mean: number;
    max: number;
    min: number;
    name: string;
    window: number; // Represents a time window in seconds
}

/** Represents some stats for a specific Spark Application */
export interface SparkStatistics extends Application {
    streaming: boolean;
    pendingRecords?: number;
    totalDelay?: number;
    runningJobs: number;
    jobStats: JobStatistics[];
    processedBatches?: StreamingBatch[];
    processedJobs: Job[];
}

/** Represents a micro-batch for an specific Spark Streaming App */
export interface StreamingBatch {
    batchId: number;
    status: string;
    batchDuration: number;
    inputSize: number;
    processingTime: number;
}

/** Represents an internal Job for a specific Spark App */
export interface Job {
    jobId: number;
    name: string;
    jobDuration: number;
    submissionTime: string;
    completionTime: string;
    status: string;
    numTasks: number;
    numFailedTasks: number;
}