var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name: 'Node application as Windows Service',
  description: 'Node application as Windows Service',
  script: 'D:\\descargas\\Downloads\\cursos-2023\\ingMilton\\angular-rest-server\\rest-server-junta-agua\\index.js'
});

// Detener el servicio
svc.on('stop', function () {
  console.log('Servicio detenido');
});

svc.stop();
