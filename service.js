var Service = require('node-windows').Service;
// Create a new service object
var svc = new Service({
  name:'Junta de Agua v2',
  description: 'Junta de Agua v2',
  script: 'C:\\rest-server-v2\\v4\\ja-rest-server-main\\index.js'
});
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  console.log("Encendido");
  svc.start();
});

svc.install();