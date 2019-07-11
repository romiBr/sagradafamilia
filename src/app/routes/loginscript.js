window.$ = window.jquery = require('jquery');
const electron = require('electron');
const ipc = electron.ipcRenderer


const inputbutton = document.getElementById('inputbutton')

inputbutton.addEventListener('click', function() {
    app.get('/', (req, res)=>{
        res.render('login');
    })
})
