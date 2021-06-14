import { Request, Response, NextFunction } from 'express';

class AppMiddleware {
    logger(req: Request, res: Response, next: NextFunction) {
        console.log(`Atendiendo un ${req.method} request...`);
        next();
    }
}

export default new AppMiddleware();