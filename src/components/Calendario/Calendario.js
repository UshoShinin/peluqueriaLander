import classes from "./Calendario.module.css";
import classesDia from "./Dias/Dias.module.css";
import Mes from "./Mes";
import Fotos from "./Fotos";
import { useState } from "react";
import { days } from "./ContenidoCalendario/ContenidoCalendario";
import {extraerFotos} from './FuncionesAuxiliares';
import {transformStringNumber} from './FuncionesAuxiliares';
const Calendario = (props) => {
  console.log(transformStringNumber('12:59'));
  const [currentEmployee, setCurrentEmployee] = useState(0);
  const { cantidadMeses, content } = days(props.empleados[currentEmployee].fechas);
  const [currentCalendar, setCurrentCalendar] = useState(0);
  const empleadosFotos = extraerFotos(props.empleados);

  const prevCalendar = () => {
    if (currentCalendar > 0) {
      setCurrentCalendar((state) => state - 1);
    }
  };
  const nextCalendar = () => {
    if (currentCalendar < cantidadMeses-1) {
      setCurrentCalendar((state) => state + 1);
    }
  };
  return (
    <div className={classes.container}>
      <Fotos fotos={empleadosFotos} changeEmployee = {setCurrentEmployee}/>
      <Mes
        month={new Date().getMonth()}
        prev={prevCalendar}
        next={nextCalendar}
        max={cantidadMeses}
      />
      <ol className={classes.calendario}>
        <li className={classes.day}>Lun</li>
        <li className={classes.day}>Mar</li>
        <li className={classes.day}>Mié</li>
        <li className={classes.day}>Jue</li>
        <li className={classes.day}>Vie</li>
        <li className={classes.day}>Sáb</li>
        <li className={`${classes.day} ${classesDia.invalid}`}>Dom</li>
      </ol>
      <div
        className={classes.contenidoCalendario}
        style={{
          marginLeft:
            currentCalendar >= 0 ? `-${currentCalendar * 19}em` : undefined,
        }}
      >
        {content}
      </div>
    </div>
  );
};
export default Calendario;
