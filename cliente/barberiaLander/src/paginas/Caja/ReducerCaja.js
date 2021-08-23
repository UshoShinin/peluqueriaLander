import {
  calcularPrecio,
  getElementById,
} from "../../FuncionesAuxiliares/FuncionesAuxiliares";
import { formatDate } from "../../FuncionesAuxiliares/FuncionesAuxiliares";
const today = new Date();
export const initialState = {
  idCaja: new Date(),
  cajaAbierta: false,
  desc: "AbrirCaja",
  montoInicial: { value: "", isValid: null },
  jornal: { value: "", show: false },
  comboAgenda: { value: null, active: false },
  sinAgendar: { value: false },
  soloHoy: { value: false },
  montoAgenda: { value: "", isValid: null },
  propinaAgenda: { value: "", isValid: null },
  montoProductos: { value: "", isValid: null },
  montoTotalProd: { value: "", isValid: null },
  productos: [],
  servicios: {
    corte: { id: 1, active: false },
    barba: { id: 4, active: false },
    maquina: { id: 5, active: false },
    claritos: { id: 6, active: false },
    decoloracion: { id: 7, active: false },
    brushing: { id: 8, active: false },
  },
  productosSAg: [],
  productosAgregados: [],
  productosSEl: [],
  agendas: [
    {
      id: 1,
      title: "Manueh Torres 13/08/2021",
      fecha: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 2
      ),
      empleado: "6536251235",
      servicios: [8, 1, 5],
    },
    {
      id: 2,
      title: "Pablo Martinez 11/08/2021",
      fecha: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      empleado: "653623547",
      servicios: [7, 1, 4],
    },
  ],
  agendasHoy: [
    {
      id: 2,
      title: "Pablo Martinez 11/08/2021",
      fecha: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      empleado: "653623547",
      servicios: [7, 1, 4],
    },
  ],
  efectivo: { value: false },
  debito: { value: false },
  cuponera: { value: false },
  montoEfectivo: { value: "", isValid: null },
  montoDebito: { value: "", isValid: null },
  ticketDebito: { value: "", isValid: null },
  montoCuponera: { value: "", isValid: null },
  codCuponera: { value: "", isValid: null },
  cantidadMedios: { value: 0 },
  montoTotal: { value: "", isValid: null },
  showSalida: { value: false },
  montoSalida: { value: "", isValid: null },
  descripcionSalida: { value: "", isValid: null },
  comboSalida: { value: 1, active: false },
  Empleados: [
    { id: 1, title: "Antonio" },
    { id: 2, title: "Pablito" },
    { id: 3, title: "Juan carlos" },
  ],
};

const orden = (a, b) => {
  if (a.id > b.id) {
    return 1;
  } else if (a.id < b.id) {
    return -1;
  }
  return 0;
};

const validarMonto = (value) => {
  return (
    (value !== "" ? value.trim().length > 0 : null) && parseInt(value) >= 0
  );
};

const miFiltro = (lista, objetivo) => {
  let nuevaLista = [];
  let encontrado = null;
  lista.forEach((element) => {
    if (element.id !== objetivo.id) nuevaLista.push({ ...element });
    else encontrado = element.stock;
  });
  if (encontrado !== null) return { lista: [...nuevaLista], stock: encontrado }; //Es nueva lista
  return null; //No hay cambios
};

export const cajaReducer = (state, action) => {
  let valido = null;
  let origen;
  let destino;
  let resultadoOrigen;
  let resultadoDestino;
  let total = 0;
  let mAgenda;
  let mPropina;
  let mProducto = 0;
  let anterior;
  let siguiente = null;
  let cantidad;
  let myState = null;
  let myStateMedios;
  let nuevoEstado;
  let listaBase;
  let posicion;
  let resto;
  let mEfectivo = null;
  let mDebito = null;
  let mCuponera = null;
  switch (action.type) {
    case "ABRIR_CAJA":
      return { ...state, cajaAbierta: true };
    case "CERRAR_CAJA":
      return {
        ...initialState,
        productos: [...state.productos],
        agendas: [...state.agendas],
        agendasHoy: [...state.agendasHoy],
      };
    case "CARGA_DE_DATOS":
      const date = new Date();
      formatDate(action.payload.agendas[0].fecha);
      let newList = action.payload.agendas.filter(
        (agenda) =>
          formatDate(agenda.fecha).getDate() === date.getDate() &&
          formatDate(agenda.fecha).getMonth() === date.getMonth()
      );
      myState = {
        ...state,
        agendas: [...action.payload.agendas],
        agendasHoy: [...newList],
        Empleados: [...action.payload.empleados],
        productos: [...action.payload.productos],
      };
      return { ...myState };
    case "USER_INPUT_MONTO_I":
      return {
        ...state,
        montoInicial: {
          value: action.value,
          isValid: state.montoInicial.isValid,
        },
      };
    case "FOCUS_INPUT_MONTO_I":
      return {
        ...state,
        montoInicial: {
          value: state.montoInicial.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_I":
      valido = validarMonto(state.montoInicial.value);
      return {
        ...state,
        montoInicial: {
          value: state.montoInicial.value,
          isValid: valido,
        },
      };
    case "SHOW_JORNAL":
      return {
        ...state,
        jornal: { value: action.value, show: true },
      };
    case "HIDE_JORNAL":
      return {
        ...state,
        jornal: { value: state.jornal.value, show: false },
      };
    case "CLICK_S_A":
      nuevoEstado = !state.sinAgendar.value;
      if (nuevoEstado) {
        listaBase = [...state.Empleados];
        posicion = listaBase[0].id;
      } else {
        listaBase = [...state.agendas];
        posicion = null;
      }
      console.log(posicion);
      return {
        ...state,
        sinAgendar: { value: nuevoEstado },
        soloHoy: { value: false },
        comboAgenda: { value: posicion, active: false },
        propinaAgenda: { value: "", isValid: null },
      };
    case "CLICK_S_H":
      nuevoEstado = !state.soloHoy.value;
      posicion = state.comboAgenda.value;
      resto = { ...state.servicios };
      mAgenda = parseInt(state.montoAgenda.value,10);
      mPropina = parseInt(state.propinaAgenda.value,10);
      total=parseInt(state.montoTotal.value,10);
      if (nuevoEstado) {
        listaBase = [...state.agendasHoy];
      } else {
        listaBase = [...state.agendas];
      }
      if (listaBase.length > 0) {
        if (getElementById(listaBase, posicion) === null) {
          posicion = null;
          resto={...initialState.servicios};
          mAgenda='';
          mPropina = '';
          total=state.montoTotalProd.value;
        }
      } else {
        posicion = null;
        resto={...initialState.servicios};
        mAgenda='';
        mPropina = '';
        total=state.montoTotalProd.value;
      }
      return {
        ...state,
        soloHoy: { value: nuevoEstado },
        servicios: { ...resto },
        comboAgenda: { value: posicion, active: false },
        montoAgenda:{value:String(mAgenda),isValid:validarMonto(String(mAgenda))},
        propinaAgenda : {value:String(mPropina),isValid:validarMonto(String(mPropina))},
        montoTotal:{value:String(total),isValid:String(total)}
      };
    case "CLICK_COMBO_AGENDA":
      return {
        ...state,
        comboAgenda: {
          value: state.comboAgenda.value,
          active: !state.comboAgenda.active,
        },
      };
    case "CHANGE_COMBO_AGENDA":
      let baseServicios = {
        corte: { active: false, id: 1 },
        barba: { active: false, id: 4 },
        maquina: { active: false, id: 5 },
        claritos: { active: false, id: 6 },
        decoloracion: { active: false, id: 7 },
        brushing: { active: false, id: 8 },
      };
      getElementById(state.agendas, action.value).servicios.forEach((s) => {
        switch (s) {
          case 1:
            baseServicios.corte.active = true;
            break;
          case 4:
            baseServicios.barba.active = true;
            break;
          case 5:
            baseServicios.maquina.active = true;
            break;
          case 6:
            baseServicios.claritos.active = true;
            break;
          case 7:
            baseServicios.decoloracion.active = true;
            break;
          case 8:
            baseServicios.brushing.active = true;
            break;
        }
      });
      mAgenda = calcularPrecio(baseServicios);
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      mProducto =
        state.montoTotalProd.value.length > 0
          ? parseInt(state.montoTotalProd.value, 10)
          : 0;
      total = mProducto + mAgenda + mPropina;
      return {
        ...state,
        comboAgenda: { value: action.value, active: false },
        servicios: { ...baseServicios },
        montoAgenda: { value: String(mAgenda), isValid: true },
        montoTotal: {
          value: String(total),
          isValid: validarMonto(String(total)),
        },
      };
    case "CLICK_COMBO_SALIDA":
      return {
        ...state,
        comboSalida: {
          value: state.comboSalida.value,
          active: !state.comboSalida.active,
        },
      };
    case "CHANGE_COMBO_SALIDA":
      return {
        ...state,
        comboSalida: { value: action.value, active: false },
      };
    case "USER_INPUT_MONTO_A":
      mAgenda = action.value.length > 0 ? parseInt(action.value, 10) : 0;
      mProducto =
        state.montoTotalProd.value.length > 0
          ? parseInt(state.montoTotalProd.value, 10)
          : 0;
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      total = String(mAgenda + mProducto + mPropina);
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        montoAgenda: {
          value: action.value,
          isValid: state.montoAgenda.isValid,
        },
        montoTotal: {
          value: total,
          isValid: validarMonto(total),
        },
      };
    case "FOCUS_INPUT_MONTO_A":
      return {
        ...state,
        montoAgenda: {
          value: state.montoAgenda.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_A":
      valido = validarMonto(state.montoAgenda.value);
      return {
        ...state,
        montoAgenda: {
          value: state.montoAgenda.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_PROPINA_A":
      mPropina = action.value.length > 0 ? parseInt(action.value, 10) : 0;
      mProducto =
        state.montoTotalProd.value.length > 0
          ? parseInt(state.montoTotalProd.value, 10)
          : 0;
      mAgenda =
        state.montoAgenda.value.length > 0
          ? parseInt(state.montoAgenda.value, 10)
          : 0;
      total = String(mPropina + mProducto + mAgenda);
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        propinaAgenda: {
          value: action.value,
          isValid: state.propinaAgenda.isValid,
        },
        montoTotal: {
          value: total,
          isValid: validarMonto(total),
        },
      };
    case "FOCUS_INPUT_PROPINA_A":
      return {
        ...state,
        propinaAgenda: {
          value: state.propinaAgenda.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_PROPINA_A":
      valido = validarMonto(state.propinaAgenda.value);
      return {
        ...state,
        propinaAgenda: {
          value: state.propinaAgenda.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_MONTO_PRODUCTO":
      return {
        ...state,
        montoProductos: {
          value: action.value,
          isValid: state.montoProductos.isValid,
        },
      };
    case "FOCUS_INPUT_MONTO_PRODUCTO":
      return {
        ...state,
        montoProductos: {
          value: state.montoProductos.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_PRODUCTO":
      valido = validarMonto(state.montoProductos.value);
      return {
        ...state,
        montoProductos: {
          value: state.montoProductos.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_MONTO_TOTAL_PRODUCTO":
      mProducto = action.value.length > 0 ? parseInt(action.value, 10) : 0;
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      mAgenda =
        state.montoAgenda.value.length > 0
          ? parseInt(state.montoAgenda.value, 10)
          : 0;
      total = String(mProducto + mPropina + mAgenda);
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        montoTotalProd: {
          value: action.value,
          isValid: state.montoTotalProd.isValid,
        },
        montoTotal: {
          value: total,
          isValid: validarMonto(total),
        },
      };
    case "FOCUS_INPUT_MONTO_TOTAL_PRODUCTO":
      return {
        ...state,
        montoTotalProd: {
          value: state.montoTotalProd.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_TOTAL_PRODUCTO":
      valido = validarMonto(state.montoTotalProd.value);
      return {
        ...state,
        montoTotalProd: {
          value: state.montoTotalProd.value,
          isValid: valido,
        },
      };
    case "CLICK_LISTA_P": //P = Productos
    case "CLICK_LISTA_A": //A = Agregados
      let auxList = [];
      let baseList;
      if (action.type === "CLICK_LISTA_P") {
        baseList = [...state.productosSAg];
      } else {
        baseList = [...state.productosSEl];
      }

      if (getElementById(baseList, action.value.id) === null) {
        auxList = [...baseList, action.value];
      } else {
        auxList = baseList.filter((prod) => prod.id !== action.value.id);
      }
      auxList.sort(orden);
      if (action.type === "CLICK_LISTA_P") {
        return {
          ...state,
          productosSAg: [...auxList],
        };
      } else
        return {
          ...state,
          productosSEl: [...auxList],
        };
    case "AGREGAR":
      origen = [...state.productos];
      destino = [...state.productosAgregados];
      state.productosSAg.forEach((p) => {
        resultadoOrigen = miFiltro(origen, p);
        resultadoDestino = miFiltro(destino, p);
        cantidad =
          parseInt(action.value, 10) > resultadoOrigen.stock
            ? resultadoOrigen.stock
            : parseInt(action.value, 10);

        if (resultadoDestino !== null) {
          destino = [
            ...resultadoDestino.lista,
            { ...p, stock: resultadoDestino.stock + cantidad },
          ];
        } else {
          destino.push({ ...p, stock: cantidad });
        }
        resto = resultadoOrigen.stock - cantidad;
        origen = [...resultadoOrigen.lista, { ...p, stock: resto }];
      });
      origen.sort(orden);
      destino.sort(orden);
      destino.forEach((p) => {
        mProducto += p.price * p.stock;
      });
      //Calculo de totales
      mAgenda =
        state.montoAgenda.value.length > 0
          ? parseInt(state.montoAgenda.value, 10)
          : 0;
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      total = String(mAgenda + mProducto + mPropina);
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        productosAgregados: [...destino],
        montoProductos: { value: "", isValid: null },
        productosSAg: [],
        montoTotalProd: { value: String(mProducto), isValid: true },
        montoTotal: { value: total, isValid: validarMonto(total) },
        productos: [...origen],
      };
    case "QUITAR":
      destino = [...state.productosAgregados];
      origen = [...state.productos];
      state.productosSEl.forEach((p) => {
        resultadoOrigen = miFiltro(origen, p);
        resultadoDestino = miFiltro(destino, p);
        cantidad =
          parseInt(action.value, 10) > resultadoDestino.stock
            ? resultadoDestino.stock
            : parseInt(action.value, 10);
        if (resultadoDestino.stock > cantidad) {
          destino = [
            ...resultadoDestino.lista,
            { ...p, stock: resultadoDestino.stock - cantidad },
          ];
        } else {
          destino = [...resultadoDestino.lista];
        }
        resto = resultadoOrigen.stock + cantidad;
        origen = [...resultadoOrigen.lista, { ...p, stock: resto }];
      });
      origen.sort(orden);
      destino.sort(orden);
      destino.forEach((p) => {
        mProducto += p.price * p.stock;
      });
      mAgenda =
        state.montoAgenda.value.length > 0
          ? parseInt(state.montoAgenda.value, 10)
          : 0;
      mPropina =
        state.propinaAgenda.value.length > 0
          ? parseInt(state.propinaAgenda.value, 10)
          : 0;
      total = String(mAgenda + mProducto + mPropina);
      return {
        ...state,
        productos: [...origen],
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        productosAgregados: [...destino],
        montoProductos: { value: "", isValid: null },
        productosSEl: [],
        montoTotalProd: { value: mProducto, isValid: true },
        montoTotal: { value: total, isValid: validarMonto(total) },
      };
    case "CLICK_EFECTIVO":
    case "CLICK_DEBITO":
    case "CLICK_CUPONERA":
      switch (action.type) {
        case "CLICK_EFECTIVO":
          siguiente = !state.efectivo.value;
          myState = { ...state, efectivo: { value: siguiente } };
          break;
        case "CLICK_DEBITO":
          siguiente = !state.debito.value;
          myState = { ...state, debito: { value: siguiente } };
          break;
        case "CLICK_CUPONERA":
          siguiente = !state.cuponera.value;
          myState = { ...state, cuponera: { value: siguiente } };
          break;
      }
      if (siguiente) cantidad = state.cantidadMedios.value + 1;
      else cantidad = state.cantidadMedios.value - 1;
      if (siguiente && state.cantidadMedios.value === 1) {
        total = state.montoTotal.value;
        valido = state.montoTotal.isValid;
        if (state.efectivo.value) anterior = "EFECTIVO";
        else if (state.debito.value) anterior = "DEBITO";
        else if (state.cuponera.value) anterior = "CUPONERA";
      } else if (cantidad === 1) {
        myState = {
          ...myState,
          montoEfectivo: { value: "", isValid: null },
          montoDebito: { value: "", isValid: null },
          montoCuponera: { value: "", isValid: null },
        };
      }
      myState = { ...myState, cantidadMedios: { value: cantidad } };
      switch (anterior) {
        case "EFECTIVO":
          myState = {
            ...myState,
            montoEfectivo: { value: total, isValid: valido },
          };
          break;
        case "DEBITO":
          myState = {
            ...myState,
            montoDebito: { value: total, isValid: valido },
          };
          break;
        case "CUPONERA":
          myState = {
            ...myState,
            montoCuponera: { value: total, isValid: valido },
          };
          break;
      }
      return { ...myState };
    case "USER_INPUT_EFECTIVO":
      mEfectivo = action.value === "" ? 0 : action.value;
      if (state.cantidadMedios.value === 2) {
        mDebito = "";
        mCuponera = "";
        if (state.debito.value) {
          mDebito = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mEfectivo, 10)
          );
        } else {
          mCuponera = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mEfectivo, 10)
          );
        }
      }
      break;
    case "FOCUS_INPUT_EFECTIVO":
      return {
        ...state,
        montoEfectivo: {
          value: state.montoEfectivo.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_EFECTIVO":
      valido = validarMonto(state.montoEfectivo.value);
      return {
        ...state,
        montoEfectivo: {
          value: state.montoEfectivo.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_DEBITO":
      mDebito = action.value === "" ? 0 : action.value;
      if (state.cantidadMedios.value === 2) {
        mEfectivo = "";
        mCuponera = "";
        if (state.efectivo.value) {
          mEfectivo = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mDebito, 10)
          );
        } else {
          mCuponera = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mDebito, 10)
          );
        }
      }
      break;
    case "FOCUS_INPUT_DEBITO":
      return {
        ...state,
        montoDebito: {
          value: state.montoDebito.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_DEBITO":
      valido = validarMonto(state.montoDebito.value);
      return {
        ...state,
        montoDebito: {
          value: state.montoDebito.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_CUPONERA":
      mCuponera = action.value === "" ? 0 : action.value;
      if (state.cantidadMedios.value === 2) {
        mEfectivo = "";
        mDebito = "";
        if (state.efectivo.value) {
          mEfectivo = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mCuponera, 10)
          );
        } else {
          mDebito = String(
            parseInt(state.montoTotal.value, 10) - parseInt(mCuponera, 10)
          );
        }
      }
      break;
    case "FOCUS_INPUT_CUPONERA":
      return {
        ...state,
        montoCuponera: {
          value: state.montoCuponera.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_CUPONERA":
      valido = validarMonto(state.montoCuponera.value);
      return {
        ...state,
        montoCuponera: {
          value: state.montoCuponera.value,
          isValid: valido,
        },
      };
    case "USER_INPUT_TOTAL":
      return {
        ...state,
        cantidadMedios: { value: 0 },
        efectivo: { value: false },
        debito: { value: false },
        cuponera: { value: false },
        montoTotal: {
          value: action.value,
          isValid: state.montoTotal.isValid,
        },
      };
    case "FOCUS_INPUT_TOTAL":
      return {
        ...state,
        montoTotal: {
          value: state.montoTotal.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_TOTAL":
      valido = validarMonto(state.montoTotal.value);
      return {
        ...state,
        montoTotal: {
          value: state.montoTotal.value,
          isValid: valido,
        },
      };
    case "SHOW_SALIDA":
      return { ...state, showSalida: { value: true } };
    case "HIDE_SALIDA":
      return { ...state, showSalida: { value: false } };
    case "USER_INPUT_MONTO_S":
      return {
        ...state,
        montoSalida: {
          value: action.value,
          isValid: state.montoSalida.isValid,
        },
      };
    case "FOCUS_INPUT_MONTO_S":
      return {
        ...state,
        montoSalida: {
          value: state.montoSalida.value,
          isValid: null,
        },
      };
    case "BLUR_INPUT_MONTO_S":
      valido = validarMonto(state.montoSalida.value);
      return {
        ...state,
        montoSalida: {
          value: state.montoSalida.value,
          isValid: valido,
        },
      };
    case "USER_DESCRIPCION_SALIDA":
      return {
        ...state,
        descripcionSalida: {
          value: action.value,
          isValid: state.descripcionSalida.isValid,
        },
      };
    //Posiblemente tenga que sacarlos
    case "FOCUS_DESCRIPCION_SALIDA":
      return {
        ...state,
        descripcionSalida: {
          value: state.descripcionSalida.value,
          isValid: null,
        },
      };
    case "BLUR_DESCRIPCION_SALIDA":
      valido = validarMonto(state.descripcionSalida.value);
      return {
        ...state,
        descripcionSalida: {
          value: state.descripcionSalida.value,
          isValid: valido,
        },
      };
    case "USER_COD_CUPONERA":
      return {
        ...state,
        codCuponera: {
          value: action.value,
          isValid: state.codCuponera.isValid,
        },
      };
    case "FOCUS_COD_CUPONERA":
      return {
        ...state,
        codCuponera: {
          value: state.codCuponera.value,
          isValid: null,
        },
      };
    case "BLUR_COD_CUPONERA":
      valido = validarMonto(state.codCuponera.value);
      return {
        ...state,
        codCuponera: {
          value: state.codCuponera.value,
          isValid: valido,
        },
      };
    case "USER_TICK_DEBITO":
      return {
        ...state,
        ticketDebito: {
          value: action.value,
          isValid: state.ticketDebito.isValid,
        },
      };
    case "FOCUS_TICK_DEBITO":
      return {
        ...state,
        ticketDebito: {
          value: state.ticketDebito.value,
          isValid: null,
        },
      };
    case "BLUR_TICK_DEBITO":
      valido = validarMonto(state.ticketDebito.value);
      return {
        ...state,
        ticketDebito: {
          value: state.ticketDebito.value,
          isValid: valido,
        },
      };
    case "CLICK_CORTE":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          corte: {
            active: !state.servicios.corte.active,
            id: state.servicios.corte.id,
          },
        },
      };
      break;
    case "CLICK_BARBA":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          barba: {
            active: !state.servicios.barba.active,
            id: state.servicios.barba.id,
          },
        },
      };
      break;
    case "CLICK_MAQUINA":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          maquina: {
            active: !state.servicios.maquina.active,
            id: state.servicios.maquina.id,
          },
        },
      };
      break;
    case "CLICK_BRUSHING":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          brushing: {
            active: !state.servicios.brushing.active,
            id: state.servicios.brushing.id,
          },
        },
      };
      break;
    case "CLICK_DECOLORACION":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          decoloracion: {
            active: !state.servicios.decoloracion.active,
            id: state.servicios.decoloracion.id,
          },
        },
      };
      break;
    case "CLICK_CLARITOS":
      myState = {
        ...state,
        servicios: {
          ...state.servicios,
          claritos: {
            active: !state.servicios.claritos.active,
            id: state.servicios.claritos.id,
          },
        },
      };
      break;
  }
  if (myState !== null) {
    mAgenda = calcularPrecio(myState.servicios);
    mProducto =
      state.montoTotalProd.value.length > 0
        ? parseInt(state.montoTotalProd.value, 10)
        : 0;
    mPropina =
      state.propinaAgenda.value.length > 0
        ? parseInt(state.propinaAgenda.value, 10)
        : 0;
    total = String(mProducto + mAgenda + mPropina);
    myState = {
      ...myState,
      cantidadMedios: { value: 0 },
      efectivo: { value: false },
      debito: { value: false },
      cuponera: { value: false },
      montoAgenda: { value: mAgenda, isValid: true },
      montoTotal: {
        value: total,
        isValid: validarMonto(total),
      },
    };
    return { ...myState };
  }
  if (myStateMedios !== null) {
    mEfectivo = mEfectivo !== null ? mEfectivo : state.montoEfectivo.value;
    mDebito = mDebito !== null ? mDebito : state.montoDebito.value;
    mCuponera = mCuponera !== null ? mCuponera : state.montoCuponera.value;
    myStateMedios = {
      ...state,
      montoEfectivo: {
        value: mEfectivo,
        isValid: validarMonto(mEfectivo),
      },
      montoDebito: {
        value: mDebito,
        isValid: validarMonto(mDebito),
      },
      montoCuponera: {
        value: mCuponera,
        isValid: validarMonto(mCuponera),
      },
    };
    return { ...myStateMedios };
  }
};
