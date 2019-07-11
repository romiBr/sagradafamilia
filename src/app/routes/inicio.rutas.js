const dbConnection = require('../../config/dbConnection');
const controllers = require('../controllers');
const authMiddleware = require('../../config/middleware/auth')

module.exports = app => {

    app.get('/home', authMiddleware.isLogged, controllers.homeController.index);

    /*app.get('/prueba/:id', (req, res) => {
        //http://localhost:3000/1?name=romina&doctor=4
        console.log(req.params);
        console.log(req.query);
    })*/

}