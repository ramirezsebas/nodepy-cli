class AppMiddleware {
    logger(req, res, next) {
        console.log(`Atendiendo un ${req.method} request...`);
        next();
    }
}

export default new AppMiddleware();