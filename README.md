# spark-monitoring

A tool to extract metrics from Spark Applications, it applies to Streaming and Jobs.

## Current Status

Stable.

## Installation

```sh
npm install spark-monitoring
```

## Features

* Extract metrics from Streaming Jobs;
* Extract metrics from Normal Jobs;
* Send these metrics to Zabbix.

## Send metrics to Zabbix

To get usage details, type this:

```sh
zabbix-spark-monitor --help
```

## To use the tool on your application

Import the required class as follow:
```javascript
import { SparkMonitoring } from '../../lib/spark-monitoring';
```

And use the method `getApplicationStats` to get statistics for an specific application.

The output follow this example: 
```json
{
  "allocatedMB": 5632,
  "allocatedVCores": 4,
  "elapsedTime": 1050926592,
  "id": "application_1569147216125_1386",
  "jobStats": [
    {
      "max": 25,
      "mean": 17.6,
      "min": 11,
      "name": "DataCollection",
      "window": 156
    }
  ],
  "memorySeconds": 5918796398,
  "name": "51-minimum-gain",
  "pendingRecords": 2561,
  "processedRecords": 951,
  "runningContainers": 4,
  "runningJobs": 1,
  "streaming": true,
  "totalDelay": 30000,
  "vcoreSeconds": 4203689
}
```