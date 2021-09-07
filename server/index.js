const path = require('path');
const express = require("express");
const router = express.Router();
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

//Importo la interfaz. Esto va a tener los metodos para llamar a la base
const interfaz = require("./interfaz");


// Have Node serve the files for our built React app
/* app.use(express.static(path.resolve(__dirname, '../cliente/barberiaLander/build'))); */


app.use("/datosFormularioAgenda", (req, res) => {
  let ret = interfaz.getDatosFormulario();
  ret.then((empleados) => {
    res.json({
      mensaje: empleados,
    });
  });
});

app.use("/aceptarAgenda", (req, res) => {
  let id = req.body.idAgenda;
  let horario = {
    ciEmpleado: req.body.ciEmpleado,
    horario: req.body.horario,
    fecha: req.body.fecha,
  };
  let ret = interfaz.aceptarAgenda(id, horario);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/listadoAgendas", (req, res) => {
  let ret = interfaz.getDatosListadoAgendas();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/listadoPreAgendas", (req, res) => {
  let ret = interfaz.getPreAgendas();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/agendaPorId", (req, res) => {
  //Traer también el nombre del empleado
  let id = req.query.idAgenda;
  let ret = interfaz.getAgendaPorId(id);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/crearAgenda", (req, res) => {
  const ret = interfaz.crearSolicitudAgenda(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.use("/datosFormularioCaja", (req, res) => {
  const ret = interfaz.datosFormularioCaja();
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/modificarAgenda", (req, res) => {
  const ret = interfaz.modificarAgenda(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.delete("/eliminarAgenda", (req, res) => {
  let idAgenda = req.body.idAgenda;
  let idHorario = req.body.idHorario;
  const ret = interfaz.cancelarAgenda(idAgenda, idHorario);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/entradaCaja", (req, res) => {
  console.log(req.body);
  const ret = interfaz.nuevaEntradaDinero(
    req.body.idCaja,
    req.body.montoTotal,
    req.body.pago,
    req.body.ciEmpleado,
    req.body.productosVendidos,
    req.body.servicios
  );
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/registroCliente", (req, res) => {
  const ret = interfaz.registrarCliente(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/login", (req, res) => {
  let ret = interfaz.login(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/abrirCaja", (req, res) => {
  let ret = interfaz.abrirCaja(req.body);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/modificarSaldoCuponera", (req, res) => {
  const ret = interfaz.modificarSaldoCuponera(req.body.cedula, req.body.monto);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

app.post("/crearCuponera", (req, res) => {
  const ret = interfaz.crearCuponera(req.body.cedula, req.body.monto);
  ret.then((resultado) => {
    res.json({
      mensaje: resultado,
    });
  });
});

// All other GET requests not handled before will return our React app
/* app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../cliente/barberiaLander/build', 'index.html'));
}); */


//No escribir nada por debajo de esto
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
