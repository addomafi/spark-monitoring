import { JSONStorage } from 'node-localstorage';
import { MetricCheckpoint } from './domain';

/**
 * A local storage to keep temporary data to support some metrics accountability
 */
export class AnalisysStorage {
  private localStorage: JSONStorage;
  /**
   * Instantiated a new storage
   * @param tempDir Temparary directory
   */
  constructor(tempDir: string) {
    this.localStorage = new JSONStorage(tempDir || './temporary');
  }
  /**
   * Store a metric checkpoint
   * @param key Unique key that identifies the last metric checkpoint
   * @param value An object that represents the last metric checkpoint
   */
  public store(key: string, value: MetricCheckpoint) {
    this.localStorage.setItem(key, value);
  }
  /**
   * Retriaves a metric checkpoint
   * @param key Unique key that identifies the last metric checkpoint
   */
  public get(key: string): MetricCheckpoint {
    return this.localStorage.getItem(key);
  }
}
