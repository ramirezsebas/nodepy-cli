class FactoryService {
  constructor() {
    if (FactoryService.instance === null) FactoryService.instance = this;
    return FactoryService.instance;
  }

  create(tipo) {
    switch (tipo) {
      default:
        break;
    }
  }
}

const factoryService = new FactoryService();

Object.freeze(factoryService);

export default factoryService;
