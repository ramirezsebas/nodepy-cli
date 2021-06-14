class AppService {
    constructor() {
        this.data = [];
    }

    findAll() {
        return [...this.data];
    }

    create(newItem) {
        this.data.push(newItem);
        return [...this.data];
    }
}

export default new AppService();