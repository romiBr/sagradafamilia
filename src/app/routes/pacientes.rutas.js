const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth');

module.exports = app => {
    const myConnection = dbConnection();

    app.get('/pacientes', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT p.id, p.nombrePaciente, p.apellidoPaciente, p.dniPaciente, p.telefonoPaciente, p.emailPaciente, os.idObraS, os.nombreObraS from pacientes p inner join obrassociales os inner join paciente_obrasocial pos on p.id = pos.idPaciente and os.idObraS = pos.idObraSocial ORDER BY p.apellidoPaciente ASC, p.nombrePaciente ASC';
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('pacientesVistas', {
                pacientes: rows,
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                errorMessage: req.flash('errorMessage'),
                exitoMessage: req.flash('exitoMessage')

            });

        });

    });

    app.get('/pacientes/obrassociales', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT os.idObraS, os.nombreObraS from obrassociales os';
        myConnection.query(consulta, (err, obrassociales) => {
            if (err) {
                console.log(err);
            }
            res.json(obrassociales);

        });

    });

    app.post('/pacientes', authMiddleware.isLogged, (req, res) => {
        const { apellido, nombre, dni, fNac, direccion, telefono, email, obrasSociales, nroAfil } = req.body;

        let consulta = 'INSERT INTO pacientes set?';
        myConnection.query(consulta, {
            apellidoPaciente: apellido,
            nombrePaciente: nombre,
            dniPaciente: dni,
            fNacPaciente: fNac,
            domicilioPaciente: direccion,
            telefonoPaciente: telefono,
            emailPaciente: email,
            numeroAfiliado: nroAfil
        }, (err, resul) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    req.flash('errorMessage', `ERROR! el DNI ${dni} ya fue cargado anteriormente.`);

                };
                res.redirect('/pacientes');

            };
            if (resul) {
                id = resul.insertId;
                consulta = 'INSERT INTO paciente_obrasocial (idPaciente, idObraSocial) VALUES (' + id + ',?)';
                obrasSociales.forEach(obrasocial => {
                    myConnection.query(consulta, obrasocial, (err, resul) => {
                        if (err) {
                            console.log(err);
                            res.redirect('/pacientes');
                        }

                    });
                });
                req.flash('exitoMessage', `Paciente ${apellido} ${nombre} agregado correctamente.`);
                res.redirect('/pacientes');
            }

        })
    });

    app.get('/pacientes/delete/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'delete from pacientes where id =' + req.params.id;
        myConnection.query(consulta, (err, resul) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/pacientes');
        })
    });

    app.get('/pacientes/edit/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT p.id, p.nombrePaciente, p.apellidoPaciente, p.dniPaciente, p.fNacPaciente, p.domicilioPaciente, p.telefonoPaciente, p.emailPaciente, p.numeroAfiliado, os.idObraS, os.nombreObraS from pacientes p inner join obrassociales os inner join paciente_obrasocial pos on p.id = pos.idPaciente and os.idObraS = pos.idObraSocial where p.id =' + req.params.id;
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            };
            res.render('./partials/pacientesEdit', {
                pacientes: rows,
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            })
        })

    });

    app.get('/pacientes/edit', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT os.idObraS, os.nombreObraS from obrassociales os';
        myConnection.query(consulta, (err, obrasSociales) => {
            if (err) {
                console.log(err);
            }
            res.json(obrasSociales);

        });

    });

    app.post('/pacientes/edit/:id', authMiddleware.isLogged, (req, res) => {
        const { apellido, nombre, dni, fNac, direccion, telefono, email, obrasSociales, nroAfil } = req.body;
        let consulta = 'UPDATE pacientes set ? where id=' + req.params.id;
        myConnection.query(consulta, {
            apellidoPaciente: apellido,
            nombrePaciente: nombre,
            dniPaciente: dni,
            fNacPaciente: fNac,
            domicilioPaciente: direccion,
            telefonoPaciente: telefono,
            emailPaciente: email,
            numeroAfiliado: nroAfil
        }, (err, resul) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    req.flash('errorMessage', `ERROR! No se puede modificar ${apellido} ${nombre}, el DNI ${dni} pertenece a otro paciente.`);

                };
                res.redirect('/pacientes');

            }
            if (resul) {
                consulta = 'DELETE FROM paciente_obrasocial where paciente_obrasocial.idPaciente = ' + req.params.id;
                myConnection.query(consulta, (err, resul) => {
                    if (err) {
                        console.log(err);
                        res.redirect('/pacientes');
                    }
                    if (resul) {
                        consulta = 'INSERT INTO paciente_obrasocial (idPaciente, idObraSocial) VALUES(' + req.params.id + ',?)';
                        obrasSociales.forEach(obrasocial => {
                            myConnection.query(consulta, obrasocial, (err, resul) => {
                                if (err) {
                                    console.log(err);
                                    res.redirect('/pacientes');
                                }
                            })
                        });
                        req.flash('exitoMessage', `${apellido} ${nombre} modificado correctamente.`);
                        res.redirect('/pacientes');
                    }
                })
            }

        })
    })

    app.get('/pacientes/agregar', authMiddleware.isLogged, (req, res) => {
        res.render('./partials/pacientesAdd', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    })

    //modificar con turnos
    app.get('/pacientes/select/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from pacientes inner join obrassociales on pacientes.idObraSocial = obrassociales.idObraS where id =' + req.params.id;
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('/turnos/agregar', {
                paciente: rows[0],
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            })
        })
    })


}