class FactoryService {
  constructor() {
    if (FactoryService.instance === null) FactoryService.instance = this;
    return FactoryService.instance;
  }

  static create(serviceType) {
    switch (serviceType) {
      default:
        break;
    }
  }
}

module.exports = FactoryService;
