import Datastore from '@seald-io/nedb';

export class NedbDatabaseFactory {
  private static datastores: Map<string, Datastore> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static create(datastoreFilePath: string): Datastore {
    if (this.datastores.has(datastoreFilePath)) {
      return this.datastores.get(datastoreFilePath) as Datastore;
    } else {
      const datastore = new Datastore({
        filename: datastoreFilePath,
        autoload: true,
      });
      this.datastores.set(datastoreFilePath, datastore);
      return datastore;
    }
  }
}
