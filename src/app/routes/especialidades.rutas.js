const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth')

module.exports = app => {
    const myConnection = dbConnection();

    app.get('/especialidades', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT e.idEspecialidad, e.nombreEspecialidad from especialidades e';
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('especialidadesVistas', {
                especialidades: rows,
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });

        });

    });

    app.post('/especialidades', authMiddleware.isLogged, (req, res) => {
        const { nombre } = req.body;
        let consulta = 'INSERT INTO especialidades set?';
        myConnection.query(consulta, {
            nombreEspecialidad: nombre
        }, (err, resul) => {
            res.redirect('/especialidades');
        })
    })

    app.get('/especialidades/edit/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT e.idEspecialidad, e.nombreEspecialidad FROM especialidades e where idEspecialidad =' + req.params.id;
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('./partials/especialesEdit', {
                especialidades: rows[0],
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            })
        })

    });

    app.get('/especialidades/delete/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'delete from especialidades where idEspecialidad =' + req.params.id;
        myConnection.query(consulta, (err, resul) => {
            if (err) {
                console.log(err.sqlMessage);
            }
            res.redirect('/especialidades');
        })
    })

    app.post('/especialidades/edit/:id', authMiddleware.isLogged, (req, res) => {
        const { nombre } = req.body;
        let consulta = 'UPDATE especialidades set ? where idEspecialidad=' + req.params.id;
        myConnection.query(consulta, {
            nombreEspecialidad: nombre,

        }, (err, resul) => {
            res.redirect('/especialidades');
        })
    })

    app.get('/especialidades/agregar', authMiddleware.isLogged, (req, res) => {
        res.render('./partials/especialidadesAdd', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    })





}