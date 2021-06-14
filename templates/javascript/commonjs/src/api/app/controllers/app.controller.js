const AppService = require('../services/app.service.js');

class AppController {

    findAll (req, res, next){
        const items = AppService.findAll();
        res.json({ok: true, content: items});
    }

    create (req, res, next){
        const newItem = req.body;
        const items = AppService.create(newItem);
        res.json({ok: true, content: items});
    }
}

module.exports = new AppController();