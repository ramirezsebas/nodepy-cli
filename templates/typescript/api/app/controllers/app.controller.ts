import { Request, Response, NextFunction } from 'express';
import AppService, { Item } from '../services/app.service';

class AppController {

    findAll (req: Request, res: Response, next: NextFunction): void {
        const items = AppService.findAll();
        res.json({ok: true, content: items});
    }

    create (req: Request, res: Response, next: NextFunction): void {
        const newItem: Item = req.body;
        const items: Item[] = AppService.create(newItem);
        res.json({ok: true, content: items});
    }
}

export default new AppController();