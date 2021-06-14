import { Item } from "../interfaces/item";

class AppService {
    private data: Item[];

    constructor() {
        this.data = [];
    }

    findAll(): Item[] {
        return [...this.data];
    }

    create(newItem: Item): Item[] {
        this.data.push(newItem);
        return [...this.data];
    }
}

export default new AppService();