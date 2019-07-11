const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth');

module.exports = app => {

    const myConnection = dbConnection();

    app.get('/bancos', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select b.idBanco, b.nombreBanco, b.telefonoBanco, b.emailBanco from bancos b';
        myConnection.query(consulta, (err, rows) => {
            res.render('bancosVistas', {
                bancos: rows,
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                errorMessage: req.flash('errorMessage'),
                exitoMessage: req.flash('exitoMessage')
            });
        })

    });

    app.get('/bancos/agregar', authMiddleware.isLogged, (req, res) => {
        res.render('./partials/bancosAdd', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    app.post('/bancos', authMiddleware.isLogged, (req, res) => {
        const { nombre, telefono, email } = req.body;
        let consulta = 'INSERT INTO bancos set?';
        myConnection.query(consulta, {
            nombreBanco: nombre,
            telefonoBanco: telefono,
            emailBanco: email
        }, (err, resul) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    req.flash('errorMessage', 'ERROR! El Banco ' + nombre + ' ya fue cargado anteriormente.');

                };
                console.log(err);
                res.redirect('/banco');
            };
            if (resul) {
                req.flash('exitoMessage', `${nombre} agregado correctamente.`);
                res.redirect('/bancos');
            }

        })
    });

    app.get('/bancos/edit/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT b.idBanco, b.nombreBanco, b.telefonoBanco, b.emailBanco from bancos b where b.idBanco =' + req.params.id;
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('./partials/bancosEdit', {
                bancos: rows[0],
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            })
        })

    });

    app.post('/bancos/edit/:id', authMiddleware.isLogged, (req, res) => {
        const { nombre, telefono, email } = req.body;
        let consulta = 'UPDATE bancos set ? where idBanco=' + req.params.id;
        myConnection.query(consulta, {
            nombreBanco: nombre,
            telefonoBanco: telefono,
            emailBanco: email

        }, (err, resul) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    req.flash('errorMessage', 'ERROR! El nombre ' + nombre + ' pertenece a otro banco.');

                };
                console.log(err);
                res.redirect('/banco');
            }
            if (resul) {
                req.flash('exitoMessage', `${nombre} modificado correctamente.`);
                res.redirect('/bancos');
            }

        })
    });

    app.get('/bancos/delete/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'delete from bancos where idBanco =' + req.params.id;
        myConnection.query(consulta, (err, resul) => {
            if (err) {
                console.log(err.sqlMessage);
            }
            if (resul) {
                req.flash('exitoMessage', `${nombre} borrado correctamente.`);
                res.redirect('/bancos');
            }

        })
    })

}