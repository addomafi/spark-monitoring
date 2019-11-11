#!/usr/bin/env node

import { ZabbixMonitor } from '../lib/zabbix-monitor';

// Start process
Promise.resolve((new ZabbixMonitor()).run());