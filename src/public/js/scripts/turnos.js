$(document).ready(() => {

    $('#especialidadselect').change(() => {
        $('#turnoHorario').hide();
        let select = $('#doctoresselect');
        select.empty();
        select.append(`
                    <option selected>Seleccione médico...</option> 
                `)
        var especialidadSeleccionada = $('select[id=especialidadselect]').val();
        $('#cal_turnos_man').fullCalendar('destroy');
        $('#cal_turnos_tar').fullCalendar('destroy');
        if (especialidadSeleccionada != 'Seleccione especialidad...') {
            $.ajax({
                url: '/turnos/doctores/' + especialidadSeleccionada,
                success: (doctores) => {
                    let select = $('#doctoresselect');
                    doctores.forEach(doctor => {
                        select.append(`                                
                        <option value=${doctor.idDoctor}>${doctor.apellidoDoctor + ' ' + doctor.nombreDoctor}</option>
                        `)
                    })
                }
            })
        }

    });

    $('#doctoresselect').change(() => {

        var doctorSeleccionado = $('select[id=doctoresselect]').val();
        $('#cal_turnos_man').fullCalendar('destroy');
        $('#cal_turnos_tar').fullCalendar('destroy');
        if (doctorSeleccionado != 0) {
            $.ajax({
                url: '/turnos/eventos/' + doctorSeleccionado,

                success: (eventos) => {
                    var i = 0;
                    var grupoEventos = [];
                    eventos.forEach(evento => {
                        grupoEventos[i] =

                            {
                                'title': evento.apellidoPaciente + " " + evento.nombrePaciente,
                                'start': evento.start,
                                'descripcion': evento.comentario
                            }

                        i++;
                    });

                    $('#cal_turnos_man').fullCalendar({
                        header: {
                            left: 'today,prev,next',
                            center: 'title',
                            right: 'agendaDay,month,agendaWeek,listaPorDosDias'
                        },

                        views: {
                            listaPorDosDias: {
                                type: 'listWeek',
                                duration: { days: 2 }
                            }
                        },

                        minTime: "08:00:00",
                        maxTime: "12:00:00",
                        defaultTimedEventDuration: '00:15:00',
                        forceEventDuration: true,
                        allDaySlot: false,
                        selectable: true,
                        eventLimit: true,


                        dayClick: function(fecha, jsEvent, view) {
                            var hoy = moment(new Date());
                            var fechaSel = moment(fecha);
                            if (view.name != 'month') {

                                if (moment(fechaSel).isBefore(hoy)) {
                                    alert('No se puede sacar turno. Fecha/Hora anterior.');
                                } else {
                                    var unaSemana = moment().add(7, 'days');
                                    if (moment(fechaSel).isBefore(unaSemana)) {
                                        var dia = fecha.format("DD/MM/YYYY");
                                        var hora = fecha.format("HH:mm");
                                        $('#fechaTurno').html(dia);
                                        $('#fechaTurnoInput').val(fecha.format("YYYY-MM-DD") + " " + fecha.format("HH:mm:ss"));
                                        $('#horaTurno').html(hora + " hs.");
                                        var dr = $('#doctoresselect option:selected').text();
                                        $('#doctorTurno').html(dr);
                                        $('#especialidadTurno').html($('#especialidadSelect').text());


                                        $('#turnoModal').modal('toggle');
                                        limpiarFormulario();
                                        //window.location.href = "/turnos/agregar/"+doctorSeleccionado;
                                        /*$('#btnAgregar').prop("disabled",false);
                                        $('#btnModificar').prop("disabled", true);
                                        $('#btnEliminar').prop("disabled", true);
                                        //limpiarFormulario();
                                        $('#txtFecha').val((fecha).format("DD-MM-YYYY"));
                                        $("#modalEventos").modal();*/
                                    } else {
                                        alert('No se pueden dar turnos con más de una semana de anticipación.')
                                    }
                                }
                            }


                        },

                        eventClick: (event, jsEvent, view) => {
                            var hoy = moment(new Date());
                            var fechaSel = event.start;
                            if (view.name != 'month') {
                                if (moment(fechaSel).isBefore(hoy)) {
                                    alert('No se puede cambiar turno. Fecha/Hora anterior.');
                                } else {
                                    $('#turnoModalCambios').modal();
                                }
                            }


                        },

                        editable: true,
                        eventDurationEditable: false,

                        timezone: 'local',

                        height: 470,

                        events: grupoEventos,


                        firstDay: moment(new Date()).weekday() + 1,

                        weekends: false,
                        defaultView: 'agendaWeek',
                        slotDuration: '00:15:00',
                        slotLabelInterval: '00:15:00',
                        slotLabelFormat: 'HH:mm',
                        navLinks: true,

                        eventOverlap: false,

                    });



                    $('#cal_turnos_tar').fullCalendar({
                        header: {
                            left: 'today,prev,next',
                            center: 'title',
                            right: 'agendaDay,month,agendaWeek,listaPorDosDias'
                        },

                        views: {
                            listaPorDosDias: {
                                type: 'listWeek',
                                duration: { days: 2 }
                            }
                        },

                        minTime: "16:00:00",
                        maxTime: "20:00:00",
                        defaultTimedEventDuration: '00:15:00',
                        forceEventDuration: true,
                        allDaySlot: false,
                        selectable: true,
                        eventLimit: true,


                        dayClick: function(fecha, jsEvent, view) {
                            var hoy = moment(new Date());
                            var fechaSel = moment(fecha);
                            if (view.name != 'month') {

                                if (moment(fechaSel).isBefore(hoy)) {
                                    alert('No se puede sacar turno. Fecha/Hora anterior.');
                                } else {
                                    var unaSemana = moment().add(7, 'days');
                                    if (moment(fechaSel).isBefore(unaSemana)) {
                                        var dia = fecha.format("DD/MM/YYYY");
                                        var hora = fecha.format("HH:mm");
                                        //window.location.href = "/turnos/agregar/"+doctorSeleccionado;
                                        $('#btnAgregar').prop("disabled", false);
                                        $('#btnModificar').prop("disabled", true);
                                        $('#btnEliminar').prop("disabled", true);
                                        //limpiarFormulario();
                                        $('#txtFecha').val((fecha).format("DD-MM-YYYY"));
                                        $("#modalEventos").modal();
                                    } else {
                                        alert('No se pueden dar turnos con más de una semana de anticipación.')
                                    }
                                }
                            }
                            /*if(view.name != 'month'){
                                 var dia = fecha.format("DD/MM/YYYY");
                                 var hora = fecha.format("HH:mm");
                                 window.location.href = "/turnos/agregar/"+doctorSeleccionado;
                                 $('#btnAgregar').prop("disabled",false);
                                 $('#btnModificar').prop("disabled", true);
                                 $('#btnEliminar').prop("disabled", true);
                                 //limpiarFormulario();
                                 $('#txtFecha').val((fecha).format("DD-MM-YYYY"));
                                 $("#modalEventos").modal();
                            }*/

                        },


                        editable: true,
                        eventDurationEditable: false,

                        timezone: 'local', //para que muestre la hora local y no el de la BD

                        events: eventos,

                        height: 470,
                        weekends: false,
                        defaultView: 'agendaWeek',
                        slotDuration: '00:15:00', //duración de cada turno
                        slotLabelInterval: '00:15:00', //tamaño de cada fila del calendario
                        slotLabelFormat: 'HH:mm', //formato de la hora
                        navLinks: true,

                        firstDay: moment(new Date()).weekday() + 1,
                        eventOverlap: false, //para que los turnos no se solapen     

                    });

                }

            });
        }
    });

    $('#btnAgregar').click(() => {
        var nuevoTurno;
        var doctorSeleccionado = $('select[id=doctoresselect]').val();
        var grupoEventos = [];
        nuevoTurno = {
            start: $('#fechaTurnoInput').val(),
            comentario: $('#comentario').val(),
            idDoctor: $('#doctoresselect').val(),
            idPaciente: $('#idPacienteElegido').val(),

        };
        var id = $('#idPacienteElegido').val();

        $.ajax({
            type: 'post',
            url: '/turnos/agregar/turno',
            data: nuevoTurno,
            success: (resul) => {
                armarEvents(doctorSeleccionado, grupoEventos);
                setTimeout(() => {
                    $('#cal_turnos_man').fullCalendar('removeEvents');
                    $('#cal_turnos_man').fullCalendar('addEventSource', grupoEventos);
                    $('#cal_turnos_man').fullCalendar('rerenderEvents');
                    $('#turnoModal').modal('toggle');
                }, 50);

            },

        });


    });

    $('#botonModal1').click(() => {
        $('#tabla_pacientes').DataTable().clear();
        $('#tabla_pacientes').DataTable().destroy();
        $.ajax({
            url: '/turnos/pacientes',
            success: (pacientes) => {
                cargarPacientes(pacientes);

            }
        });

        $('#pacienteModal').modal('show');
    });

    $('#botonModal2').click(() => {

        $.ajax({
            url: '/pacientes/obrassociales',
            success: (obrassociales) => {
                $('#obrasSocialesGroup').select2({
                    placeholder: 'Seleccionar obras Sociales...',
                    theme: 'bootstrap4',
                    dropdownParent: $('#pacienteAgregarModal')
                });
                let select = $('#obrasSocialesGroup');
                obrassociales.forEach(obraSocial => {
                    select.append(`                                
                                    <option value=${obraSocial.idObraS}>${obraSocial.nombreObraS}</option>
                                `)
                })
            }
        });
        $('#pacienteAgregarModal').modal('show', () => {
            $('#apellido').trigger('focus');

        });
    });

    $('#btnAgregarPaciente').click(() => {
        var pacienteAgregar;
        pacienteAgregar = {
            apellido: $('#apellido').val(),
            nombre: $('#nombre').val(),
            dni: $('#dni').val(),
            fNac: $('#fNac').val(),
            direccion: $('#direccion').val(),
            telefono: $('#telefono').val(),
            email: $('#email').val(),
            nroAfil: $('#nroAfil').val(),
            obrasSociales: $('#obrasSocialesGroup').select2().val()

        };

        $.ajax({
            type: 'post',
            url: '/turnos/pacientes',
            data: pacienteAgregar,
            success: (resul) => {
                if (resul) {
                    $('#pacienteAgregarModal').modal('toggle');
                    $('#pacienteModal').modal('toggle');
                    limpiarFormularioPaciente();
                    $('#pacienteModal').modal('show');
                }

            }
        })
    })


});