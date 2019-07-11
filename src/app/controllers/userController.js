

module.exports = {
    getSignUp: (req, res, next) => {
        return res.render('users/signup');
    },

    postSignUp: (req, res, next) => {
        //var salt = bcrypt.genSaltSync(10);
        //var password = bcrypt.hashSync(req.body.password, salt);
        var user = {
            userName: req.body.email,
            name: req.body.name,
            sexo: req.body.sexo,
            userPassword: req.body.password,
            userRol: req.body.rol
        };

        const dbConnection = require('../../config/dbConnection');

        const myConnection = dbConnection();
        let consulta = 'INSERT INTO user SET ?';
        myConnection.query(consulta, user, (err, resul) => {
            if (err) throw err;

            myConnection.end();
        });
        req.flash('info', 'Se ha registrado correctamente.');
        return res.redirect('/home');

    },

    getSignIn: (req, res, next) => {
        return res.render('users/signin', { message: req.flash('info'), authmessage: req.flash('authmessage') });
    },

    logout: (req, res, next) => {
        req.logout();
        res.redirect('/auth/signin')
    },

    getUserPanel: (req, res, next) => {
        res.render('users/panel', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        })
    }
}