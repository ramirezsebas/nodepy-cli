"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_service_1 = __importDefault(require("../services/app.service"));
class AppController {
    findAll(req, res, next) {
        const items = app_service_1.default.findAll();
        res.json({ ok: true, content: items });
    }
    create(req, res, next) {
        const newItem = req.body;
        const items = app_service_1.default.create(newItem);
        res.json({ ok: true, content: items });
    }
}
exports.default = new AppController();
