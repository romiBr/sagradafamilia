module.exports = {

    preload: (req, res, next) => {
        res.render('preload', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    },
    index: (req, res, next) => {
        res.render('inicioVistas', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    }
}