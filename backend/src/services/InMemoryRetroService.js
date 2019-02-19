function sleep(millis) {
  // Simulate data access delays to ensure non-flakey e2e tests, etc.
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export default class InMemoryRetroService {
  constructor(initialData = []) {
    this.data = initialData;
  }

  async getRetros() {
    await sleep(300);
    return this.data;
  }

  async getRetro(slug) {
    await sleep(300);
    return this.data.find((retro) => (retro.slug === slug)) || null;
  }
}
