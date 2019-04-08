import crypto from 'crypto';

export default class UniqueIdProvider {
  constructor() {
    this.shared = crypto.randomBytes(8).toString('hex');
    this.unique = 0;
  }

  get() {
    const id = this.unique;
    this.unique += 1;
    return `${this.shared}-${id}`;
  }
}
