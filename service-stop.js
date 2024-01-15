var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Junta de Agua v2',
  description: 'Junta de Agua v2',
  script: 'C:\\rest-server-v2\\v4\\ja-rest-server-main\\index.js'
});

// Detener el servicio
svc.on('uninstall', function () {
  console.log('Servicio detenido');
});

svc.uninstall();
