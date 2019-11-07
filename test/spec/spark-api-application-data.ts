export const sparkRunningApps: any = {
    "apps": {
        "app": [
            {
                "id": "application_1569147216125_1386",
                "user": "hadoop",
                "name": "51-minimum-gain",
                "queue": "default",
                "state": "RUNNING",
                "finalStatus": "UNDEFINED",
                "progress": 10,
                "trackingUI": "ApplicationMaster",
                "trackingUrl": "http://ip-10-186-62-248.sa-east-1.compute.internal:20888/proxy/application_1569147216125_1386/",
                "diagnostics": "",
                "clusterId": 1569147216125,
                "applicationType": "SPARK",
                "applicationTags": "",
                "priority": 0,
                "startedTime": 1571417044449,
                "finishedTime": 0,
                "elapsedTime": 1050926592,
                "amContainerLogs": "http://ip-10-186-47-35.sa-east-1.compute.internal:8042/node/containerlogs/application_1569147216125_1386/hadoop",
                "amHostHttpAddress": "ip-10-186-47-35.sa-east-1.compute.internal:8042",
                "amRPCAddress": "10.186.47.35:0",
                "allocatedMB": 5632,
                "allocatedVCores": 4,
                "runningContainers": 4,
                "memorySeconds": 5918796398,
                "vcoreSeconds": 4203689,
                "queueUsagePercentage": 1.2061403,
                "clusterUsagePercentage": 1.2061403,
                "preemptedResourceMB": 0,
                "preemptedResourceVCores": 0,
                "numNonAMContainerPreempted": 0,
                "numAMContainerPreempted": 0,
                "preemptedMemorySeconds": 0,
                "preemptedVcoreSeconds": 0,
                "resourceRequests": [
                    {
                        "capability": {
                            "memory": 1408,
                            "memorySize": 1408,
                            "virtualCores": 1
                        },
                        "emrLabel": "MASTER,CORE",
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 0
                        },
                        "relaxLocality": true,
                        "resourceName": "*"
                    },
                    {
                        "capability": {
                            "memory": 1408,
                            "memorySize": 1408,
                            "virtualCores": 1
                        },
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 1
                        },
                        "relaxLocality": true,
                        "resourceName": "*"
                    }
                ],
                "logAggregationStatus": "NOT_START",
                "unmanagedApplication": false,
                "amNodeLabelExpression": "",
                "resourceInfo": {
                    "resourceUsagesByPartition": [
                        {
                            "partitionName": "",
                            "used": {
                                "memory": 5632,
                                "vCores": 4
                            },
                            "reserved": {
                                "memory": 0,
                                "vCores": 0
                            },
                            "pending": {
                                "memory": 0,
                                "vCores": 0
                            },
                            "amUsed": {
                                "memory": 1408,
                                "vCores": 1
                            },
                            "amLimit": {
                                "memory": 0,
                                "vCores": 0
                            }
                        }
                    ]
                }
            },
            {
                "id": "application_1569147216125_1439",
                "user": "livy",
                "name": "55-order-itens",
                "queue": "default",
                "state": "RUNNING",
                "finalStatus": "UNDEFINED",
                "progress": 10,
                "trackingUI": "ApplicationMaster",
                "trackingUrl": "http://ip-10-186-62-248.sa-east-1.compute.internal:20888/proxy/application_1569147216125_1439/",
                "diagnostics": "",
                "clusterId": 1569147216125,
                "applicationType": "SPARK",
                "applicationTags": "livy-batch-1362-cmmcqcsw",
                "priority": 0,
                "startedTime": 1572407514163,
                "finishedTime": 0,
                "elapsedTime": 60456878,
                "amContainerLogs": "http://ip-10-186-1-224.sa-east-1.compute.internal:8042/node/containerlogs/container_1569147216125_1439_01_000002/livy",
                "amHostHttpAddress": "ip-10-186-1-224.sa-east-1.compute.internal:8042",
                "amRPCAddress": "10.186.1.224:0",
                "allocatedMB": 5632,
                "allocatedVCores": 4,
                "runningContainers": 4,
                "memorySeconds": 334504502,
                "vcoreSeconds": 237572,
                "queueUsagePercentage": 1.2061403,
                "clusterUsagePercentage": 1.2061403,
                "preemptedResourceMB": 0,
                "preemptedResourceVCores": 0,
                "numNonAMContainerPreempted": 0,
                "numAMContainerPreempted": 0,
                "preemptedMemorySeconds": 0,
                "preemptedVcoreSeconds": 0,
                "resourceRequests": [
                    {
                        "capability": {
                            "memory": 1408,
                            "memorySize": 1408,
                            "virtualCores": 1
                        },
                        "emrLabel": "MASTER,CORE",
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 0
                        },
                        "relaxLocality": true,
                        "resourceName": "*"
                    },
                    {
                        "capability": {
                            "memory": 1408,
                            "memorySize": 1408,
                            "virtualCores": 1
                        },
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 1
                        },
                        "relaxLocality": true,
                        "resourceName": "ip-10-186-5-182.sa-east-1.compute.internal"
                    },
                    {
                        "capability": {
                            "memory": 1408,
                            "memorySize": 1408,
                            "virtualCores": 1
                        },
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 1
                        },
                        "relaxLocality": true,
                        "resourceName": "/default-rack"
                    },
                    {
                        "capability": {
                            "memory": 1408,
                            "memorySize": 1408,
                            "virtualCores": 1
                        },
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 1
                        },
                        "relaxLocality": true,
                        "resourceName": "*"
                    }
                ],
                "logAggregationStatus": "NOT_START",
                "unmanagedApplication": false,
                "amNodeLabelExpression": "",
                "resourceInfo": {
                    "resourceUsagesByPartition": [
                        {
                            "partitionName": "",
                            "used": {
                                "memory": 5632,
                                "vCores": 4
                            },
                            "reserved": {
                                "memory": 0,
                                "vCores": 0
                            },
                            "pending": {
                                "memory": 0,
                                "vCores": 0
                            },
                            "amUsed": {
                                "memory": 1408,
                                "vCores": 1
                            },
                            "amLimit": {
                                "memory": 0,
                                "vCores": 0
                            }
                        }
                    ]
                }
            },
            {
                "id": "application_1569147216125_1362",
                "user": "livy",
                "name": "03_11-first-order",
                "queue": "default",
                "state": "RUNNING",
                "finalStatus": "UNDEFINED",
                "progress": 10,
                "trackingUI": "ApplicationMaster",
                "trackingUrl": "http://sa-east-1.compute.internal:20888/proxy/application_1569147216125_1362/",
                "diagnostics": "",
                "clusterId": 1569147216125,
                "applicationType": "SPARK",
                "applicationTags": "livy-batch-1286-opfryptm",
                "priority": 0,
                "startedTime": 1572354865457,
                "finishedTime": 0,
                "elapsedTime": 113105585,
                "amContainerLogs": "http://sa-east-1.compute.internal:8042/node/containerlogs/container_1569147216125_1362_01_000003/livy",
                "amHostHttpAddress": "sa-east-1.compute.internal:8042",
                "amRPCAddress": "10.186.49.243:0",
                "allocatedMB": 7296,
                "allocatedVCores": 3,
                "runningContainers": 3,
                "memorySeconds": 803330283,
                "vcoreSeconds": 330315,
                "queueUsagePercentage": 1.5625,
                "clusterUsagePercentage": 1.5625,
                "preemptedResourceMB": 0,
                "preemptedResourceVCores": 0,
                "numNonAMContainerPreempted": 0,
                "numAMContainerPreempted": 0,
                "preemptedMemorySeconds": 0,
                "preemptedVcoreSeconds": 0,
                "resourceRequests": [
                    {
                        "capability": {
                            "memory": 2432,
                            "memorySize": 2432,
                            "virtualCores": 1
                        },
                        "emrLabel": "MASTER,CORE",
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 0
                        },
                        "relaxLocality": true,
                        "resourceName": "*"
                    },
                    {
                        "capability": {
                            "memory": 2432,
                            "memorySize": 2432,
                            "virtualCores": 1
                        },
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 1
                        },
                        "relaxLocality": true,
                        "resourceName": "*"
                    }
                ],
                "logAggregationStatus": "NOT_START",
                "unmanagedApplication": false,
                "amNodeLabelExpression": "",
                "resourceInfo": {
                    "resourceUsagesByPartition": [
                        {
                            "partitionName": "",
                            "used": {
                                "memory": 7296,
                                "vCores": 3
                            },
                            "reserved": {
                                "memory": 0,
                                "vCores": 0
                            },
                            "pending": {
                                "memory": 0,
                                "vCores": 0
                            },
                            "amUsed": {
                                "memory": 2432,
                                "vCores": 1
                            },
                            "amLimit": {
                                "memory": 0,
                                "vCores": 0
                            }
                        }
                    ]
                }
            }
        ]
    }
}

export const sparkApps: any = {
    "apps": {
        "app": [
            {
                "id": "application_1569147216125_1075",
                "user": "hadoop",
                "name": "51-minimum-gain",
                "queue": "default",
                "state": "FINISHED",
                "finalStatus": "UNDEFINED",
                "progress": 10,
                "trackingUI": "ApplicationMaster",
                "trackingUrl": "http://ip-10-186-62-248.sa-east-1.compute.internal:20888/proxy/application_1569147216125_1075/",
                "diagnostics": "",
                "clusterId": 1569147216125,
                "applicationType": "SPARK",
                "applicationTags": "",
                "priority": 0,
                "startedTime": 1571417044449,
                "finishedTime": 0,
                "elapsedTime": 1050926592,
                "amContainerLogs": "http://ip-10-186-47-35.sa-east-1.compute.internal:8042/node/containerlogs/container_1569147216125_1075_01_000001/hadoop",
                "amHostHttpAddress": "ip-10-186-47-35.sa-east-1.compute.internal:8042",
                "amRPCAddress": "10.186.47.35:0",
                "allocatedMB": 5632,
                "allocatedVCores": 4,
                "runningContainers": 4,
                "memorySeconds": 5918796398,
                "vcoreSeconds": 4203689,
                "queueUsagePercentage": 1.2061403,
                "clusterUsagePercentage": 1.2061403,
                "preemptedResourceMB": 0,
                "preemptedResourceVCores": 0,
                "numNonAMContainerPreempted": 0,
                "numAMContainerPreempted": 0,
                "preemptedMemorySeconds": 0,
                "preemptedVcoreSeconds": 0,
                "resourceRequests": [
                    {
                        "capability": {
                            "memory": 1408,
                            "memorySize": 1408,
                            "virtualCores": 1
                        },
                        "emrLabel": "MASTER,CORE",
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 0
                        },
                        "relaxLocality": true,
                        "resourceName": "*"
                    },
                    {
                        "capability": {
                            "memory": 1408,
                            "memorySize": 1408,
                            "virtualCores": 1
                        },
                        "nodeLabelExpression": "",
                        "numContainers": 0,
                        "priority": {
                            "priority": 1
                        },
                        "relaxLocality": true,
                        "resourceName": "*"
                    }
                ],
                "logAggregationStatus": "NOT_START",
                "unmanagedApplication": false,
                "amNodeLabelExpression": "",
                "resourceInfo": {
                    "resourceUsagesByPartition": [
                        {
                            "partitionName": "",
                            "used": {
                                "memory": 5632,
                                "vCores": 4
                            },
                            "reserved": {
                                "memory": 0,
                                "vCores": 0
                            },
                            "pending": {
                                "memory": 0,
                                "vCores": 0
                            },
                            "amUsed": {
                                "memory": 1408,
                                "vCores": 1
                            },
                            "amLimit": {
                                "memory": 0,
                                "vCores": 0
                            }
                        }
                    ]
                }
            }
        ]
    }
};