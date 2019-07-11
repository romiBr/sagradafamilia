module.exports = {

    isLogged: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('http://localhost:3000/auth/signin');
        }
    }
}