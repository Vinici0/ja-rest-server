var Service = require('node-windows').Service;
// Create a new service object
var svc = new Service({
  name:'Node application as Windows Service',
  description: 'Node application as Windows Service',
  script: 'D:\\descargas\\Downloads\\cursos-2023\\ingMilton\\angular-rest-server\\rest-server-junta-agua\\index.js'
});
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
svc.install();