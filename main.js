const electron = require('electron');
const app = electron.app;
const path = require('path');
const url = require('url');
const BrowserWindow = electron.BrowserWindow;
var mainWindow;
var server;


app.on('ready', function() {
    mainWindow = new BrowserWindow({ backgroundColor: '#ffffff', icon: __dirname + './img/icono.ico' });
    //mainWindow.loadURL('https://github.com');
    mainWindow.loadURL("http://127.0.0.1:3000/");
    mainWindow.maximize();
    //mainWindow.webContents.openDevTools()
    server = require('./src/index');
    //server.get('port').close();


});

app.on('closed', () => {
    //

})