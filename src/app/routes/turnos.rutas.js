const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth');

module.exports = app => {
    const myConnection = dbConnection();

    app.get('/turnos', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from especialidades'
            //let consulta = 'SELECT * from doctores inner join especialidades on doctores.idEspecialidad = especialidades.idEspecialidad';
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('turnosVistas', {
                especialidades: rows,
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });

        });

    });

    app.get('/turnos/medico/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from user us inner join doctores d on us.idUser = d.idUser where us.idUser = ' + req.params.id;
        //let consulta = 'SELECT * from doctores inner join especialidades on doctores.idEspecialidad = especialidades.idEspecialidad';
        myConnection.query(consulta, (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.render('turnosMedicos', {
                doctor: rows[0],
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });

        });

    });

    app.get('/turnos/doctores/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select * from doctores inner join doctor_especialidad on doctores.idDoctor = doctor_especialidad.idDoctor where doctor_especialidad.idEspecialidad =' + req.params.id;
        myConnection.query(consulta, (err, doctores) => {
            if (err) {
                console.log(err);
            }
            res.json(doctores)
        })
    })

    app.get('/turnos/eventos/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from turnos inner join pacientes on pacientes.id = turnos.idPaciente where turnos.idDoctor =' + req.params.id;
        myConnection.query(consulta, (err, eventos) => {
            if (err) {
                console.log(err);
            };
            console.log(eventos);
            res.json(eventos);
        })
    })

    app.get('/turnos/eventos', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT * from turnos inner join pacientes on pacientes.id = turnos.idPaciente';
        myConnection.query(consulta, (err, eventos) => {
            if (err) {
                console.log(err);
            }
            res.json(eventos);
        })
    });


    app.get('/turnos/agregar/:id', authMiddleware.isLogged, (req, res) => {
        res.render('partials/turnosAdd', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    })

    app.get('/turnos/paciente/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT p.nombrePaciente, p.apellidoPaciente, os.nombreObraS from pacientes p inner join obrassociales os inner join paciente_obrasocial pos on p.id = pos.idPaciente and os.idObraS = pos.idObraSocial where p.id =' + req.params.id;
        myConnection.query(consulta, (err, paciente) => {
            res.json(paciente);
        })
    });

    app.post('/turnos/agregar/turno', authMiddleware.isLogged, (req, res) => {
        const { start, idDoctor, idPaciente, idObraSocial, valor, idModalidad, idBanco } = req.body;
        let consulta = 'INSERT INTO turnos set ?';
        myConnection.query(consulta, {
            start: start,
            idDoctor: idDoctor,
            idPaciente: idPaciente,
            idObraS: idObraSocial,
            valorConsulta: valor,
            idModalidad: idModalidad,
            idBanco: idBanco
        }, (err, resul) => {
            res.json(resul);
        })
    });

    app.get('/turnos/borrar/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'delete from turnos where idTurno =' + req.params.id;
        myConnection.query(consulta, (err, resul) => {
            res.json(resul);
        })
    })

    app.get('/turnos/pacientes', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT p.id, p.nombrePaciente, p.apellidoPaciente, p.dniPaciente, p.telefonoPaciente, p.emailPaciente, os.idObraS, os.nombreObraS from pacientes p inner join obrassociales os inner join paciente_obrasocial pos on p.id = pos.idPaciente and os.idObraS = pos.idObraSocial ORDER BY p.apellidoPaciente ASC, p.nombrePaciente ASC';
        myConnection.query(consulta, (err, pacientes) => {
            if (err) {
                console.log(err);
            }
            res.json(pacientes);

        });

    });

    app.post('/turnos/pacientes', authMiddleware.isLogged, (req, res) => {
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
                console.log(err);
            };
            if (resul) {
                id = resul.insertId;
                consulta = 'INSERT INTO paciente_obrasocial (idPaciente, idObraSocial) VALUES (' + id + ',?)';
                obrasSociales.forEach(obrasocial => {
                    myConnection.query(consulta, obrasocial, (err, resul) => {
                        if (err) {
                            console.log(err.sqlMessage);
                        }

                    });
                });
                res.json(resul);

            }

        })
    });

    app.get('/turnos/doctor/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = "SELECT d.honorarioDoctor, d.baja from doctores d where idDoctor =" + req.params.id;
        myConnection.query(consulta, (err, doctor) => {
            res.json(doctor);
        })
    });

    app.post('/turnos/obrasspd', authMiddleware.isLogged, (req, res) => {
        const { idPacienteS, idDoctor } = req.body;
        let consulta = "select os.idObraS, os.nombreObraS, os.inhabilitada from paciente_obrasocial po inner join doctor_obrasocial dos inner join obrassociales os on po.idObraSocial = dos.idObraSocial and po.idObraSocial = os.idObraS where dos.idDoctor =" + idDoctor + " and po.idPaciente =" + idPacienteS;
        myConnection.query(consulta, (req, obrass) => {
            res.json(obrass);
        })
    });

    app.get('/turnos/modalidades', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select m.idModalidad, m.nombreModalidad, m.activa from modalidad_pago m';
        myConnection.query(consulta, (err, modalidades) => {
            res.json(modalidades);
        })
    });

    app.get('/turnos/bancos', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select b.idBanco, b.nombreBanco from bancos b';
        myConnection.query(consulta, (err, bancos) => {
            res.json(bancos);
        })
    });

    app.get('/turnos/ensala/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'update turnos set atendido = 2 where turnos.idTurno =' + req.params.id;
        myConnection.query(consulta, (err, resp) => {
            res.json(resp);
        })
    });

    app.get('/turnos/ausente/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'update turnos set atendido = 3 where turnos.idTurno =' + req.params.id;
        myConnection.query(consulta, (err, resp) => {
            res.json(resp);
        })
    });

    app.get('/turnos/atendido/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'update turnos set atendido = 1 where turnos.idTurno =' + req.params.id;
        myConnection.query(consulta, (err, resp) => {
            res.json(resp);
        })
    });

    app.get('/turnos/obras/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select o.nombreObraS from obrassociales o where o.idObraS=' + req.params.id;
        myConnection.query(consulta, (err, obra) => {
            res.json(obra);
        })
    });

    app.get('/turnos/modalidad/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select mp.nombreModalidad from modalidad_pago mp where mp.idModalidad=' + req.params.id;
        myConnection.query(consulta, (err, modalidad) => {
            res.json(modalidad);
        })
    });

    app.get('/turnos/banco/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select b.nombreBanco from bancos b where b.idBanco=' + req.params.id;
        myConnection.query(consulta, (err, banco) => {
            res.json(banco);
        })
    })
}