function canonicalJSON(o: any): string {
  if (o && typeof o === 'object' && !Array.isArray(o)) {
    const keys = Object.keys(o).slice();
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    keys.sort(); // just need consistency
    const content = keys
      .map((key) => `${JSON.stringify(key)}:${canonicalJSON(o[key])}`)
      .join(',');
    return `{${content}}`;
  }
  return JSON.stringify(o);
}

function makeKey(id: any): string {
  return canonicalJSON(id);
}

interface ServiceInfo<T> {
  count: number;
  service: T;
}

interface Subscription<T> {
  service: T;
  unsubscribe(): Promise<void>;
}

export default class SubscriptionTracker<K, S> {
  private readonly services = new Map<string, ServiceInfo<S>>();

  public constructor(
    private readonly generator: (id: K) => S,
    private readonly destructor: (service: S, id: K) => void,
  ) {}

  public subscribe(id: K): Subscription<S> {
    const key = makeKey(id);
    let serviceInfo = this.services.get(key);
    if (!serviceInfo) {
      serviceInfo = {
        count: 0,
        service: this.generator(id),
      };
      this.services.set(key, serviceInfo);
    }

    serviceInfo.count += 1;
    return {
      service: serviceInfo.service,
      unsubscribe: (): Promise<void> => this.unsubscribe(id),
    };
  }

  public async unsubscribe(id: K): Promise<void> {
    await Promise.resolve(); // wait in case we immediately resubscribe

    const key = makeKey(id);
    const serviceInfo = this.services.get(key);
    if (!serviceInfo || serviceInfo.count <= 0) {
      throw new Error(`Service ${id} is not active`);
    }

    serviceInfo.count -= 1;
    if (serviceInfo.count > 0) {
      return;
    }

    this.services.delete(key);
    this.destructor(serviceInfo.service, id);
  }

  public find(id: K): S | null {
    const key = makeKey(id);
    const o = this.services.get(key);
    return o?.service ?? null;
  }
}
