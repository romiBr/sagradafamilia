const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth')

module.exports = app => {
    const myConnection = dbConnection();

    app.get('/modalidades', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT m.idModalidad, m.nombreModalidad, m.activa from modalidad_pago m';
        myConnection.query(consulta, (err, rows) => {
            res.render('modalidadesVistas', {
                modalidades: rows,
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        })
    });

    app.get('/modalidades/agregar', authMiddleware.isLogged, (req, res) => {
        res.render('./partials/modalidadesAdd', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    });

    app.post('/modalidades', authMiddleware.isLogged, (req, res) => {
        const { nombre } = req.body;
        let consulta = 'INSERT INTO modalidad_pago set?';
        myConnection.query(consulta, {
            nombreModalidad: nombre
        }, (err, resul) => {
            res.redirect('/modalidades');
        })
    });

    app.get('/modalidades/edit/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT m.idModalidad, m.nombreModalidad, m.activa from modalidad_pago m where m.idModalidad =' + req.params.id;
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('./partials/modalidadesEdit', {
                modalidades: rows[0],
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            })
        })

    });

    app.post('/modalidades/edit/:id', authMiddleware.isLogged, (req, res) => {
        const { nombre, modactiva } = req.body;
        let consulta = 'UPDATE modalidad_pago set ? where idModalidad=' + req.params.id;
        myConnection.query(consulta, {
            nombreModalidad: nombre,
            activa: modactiva

        }, (err, resul) => {
            if (err) {
                console.log(err);
            }
            if (resul) {
                res.redirect('/modalidades');
            }

        })
    })

}