const dbConnection = require('../../config/dbConnection');
const authMiddleware = require('../../config/middleware/auth');

module.exports = app => {

    const myConnection = dbConnection();

    app.get('/reportes', authMiddleware.isLogged, (req, res) => {
        res.render('reportesVistas', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    })

    app.get('/reportes/obrashab', authMiddleware.isLogged, (req, res) => {
        let consulta = "select os.idObraS, os.nombreObraS from obrassociales os where os.inhabilitada = 0";
        myConnection.query(consulta, (err, obrassociales) => {
            res.json(obrassociales);

        })
    });

    app.get('/reportes/obrasinhab', authMiddleware.isLogged, (req, res) => {
        let consulta = "select os.idObraS, os.nombreObraS from obrassociales os where os.inhabilitada = 1";
        myConnection.query(consulta, (err, obrassociales) => {
            res.json(obrassociales);

        })
    });

    app.get('/reportes/turnosdia', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select RIGHT((start),8) as hora, p.apellidoPaciente, p.nombrePaciente, p.dniPaciente, d.apellidoDoctor, d.nombreDoctor, mp.nombreModalidad, os.nombreObraS from turnos t inner join pacientes p inner join doctores d inner join modalidad_pago mp inner join obrassociales os where start BETWEEN CURRENT_DATE and CURRENT_DATE+1 and t.idPaciente = p.id and t.idDoctor = d.idDoctor and mp.idModalidad=t.idModalidad and t.idObraS = os.idObraS order by d.apellidoDoctor asc, hora asc';
        myConnection.query(consulta, (err, reportes) => {
            res.json(reportes);
        })
    });

    app.get('/reportes/turnosdiasiguiente', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select RIGHT((start),8) as hora, p.apellidoPaciente, p.nombrePaciente, p.dniPaciente, d.apellidoDoctor, d.nombreDoctor, mp.nombreModalidad, os.nombreObraS from turnos t inner join pacientes p inner join doctores d inner join modalidad_pago mp inner join obrassociales os where start BETWEEN CURRENT_DATE+1 and CURRENT_DATE+2 and t.idPaciente = p.id and t.idDoctor = d.idDoctor and mp.idModalidad=t.idModalidad and t.idObraS = os.idObraS order by d.apellidoDoctor asc, hora asc';
        myConnection.query(consulta, (err, reportes) => {
            res.json(reportes);
        })
    });

    app.get('/reportes/doctores', authMiddleware.isLogged, (req, res) => {
        let consulta = 'SELECT d.idDoctor, d.apellidoDoctor, d.nombreDoctor FROM doctores d';
        myConnection.query(consulta, (err, doctores) => {
            res.json(doctores);
        })
    });

    app.get('/reportes/doctores/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select RIGHT((start),8) as hora, p.apellidoPaciente, p.nombrePaciente, p.dniPaciente, mp.nombreModalidad, os.nombreObraS from turnos t inner join pacientes p inner join doctores d inner join modalidad_pago mp inner join obrassociales os where start BETWEEN CURRENT_DATE and CURRENT_DATE+1 and t.idPaciente = p.id and t.idDoctor = d.idDoctor and mp.idModalidad=t.idModalidad and t.idObraS = os.idObraS and d.idDoctor =' + req.params.id + ' order by hora asc';
        myConnection.query(consulta, (err, reportes) => {
            res.json(reportes);
        })
    });

    app.get('/reportes/doctores/siguiente/:id', authMiddleware.isLogged, (req, res) => {
        let consulta = 'select RIGHT((start),8) as hora, p.apellidoPaciente, p.nombrePaciente, p.dniPaciente, mp.nombreModalidad, os.nombreObraS from turnos t inner join pacientes p inner join doctores d inner join modalidad_pago mp inner join obrassociales os where start BETWEEN CURRENT_DATE+1 and CURRENT_DATE+2 and t.idPaciente = p.id and t.idDoctor = d.idDoctor and mp.idModalidad=t.idModalidad and t.idObraS = os.idObraS and d.idDoctor =' + req.params.id + ' order by hora asc';
        myConnection.query(consulta, (err, reportes) => {
            res.json(reportes);
        })
    })

}