const controllers = require('../controllers');
const passport = require('passport');
const authMiddleware = require('../../config/middleware/auth')

module.exports = app => {

    app.get('/', controllers.homeController.preload);

    app.get('/home', controllers.homeController.index);

    app.get('/auth/signup', controllers.userController.getSignUp);

    app.post('/auth/signup', controllers.userController.postSignUp);

    app.get('/auth/signin', controllers.userController.getSignIn);

    app.post('/auth/signin', passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/auth/signin',
        failureFlash: true
    }));

    app.get('/auth/logout', authMiddleware.isLogged, controllers.userController.logout);

    app.get('/users/panel', authMiddleware.isLogged, controllers.userController.getUserPanel);
}