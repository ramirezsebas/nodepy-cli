"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = new AppService();
