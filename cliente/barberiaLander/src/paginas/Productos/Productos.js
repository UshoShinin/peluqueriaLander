import { useEffect, useReducer, useRef } from "react"
import classes from './Productos.module.css';
import Border from "../../components/UI/Border/Border"
import Marco from "../../components/UI/Marco/Marco"
import Input from '../../components/UI/Input/Input';
import useHttp from "../../hooks/useHttp"
import Lista from "./Lista/Lista"
import SimpleButton from '../../components/UI/SimpleButton/SimpleButton';
import {initialState ,reducer} from './reducer';
import LoaddingSpinner from "../../components/LoaddingSpinner/LoaddingSpinner";
import Checkbox from '../../components/UI/Checkbox/Checkbox';
import Note from '../../components/UI/Note/Note';
import inputs from "./inputs";
const Productos = (props) =>{
    const carga = useHttp();
    const crear = useHttp();
    const modificar = useHttp();
    const agregar = useHttp();
    const [state,dispatch]  = useReducer(reducer,initialState);
    const INPUTS = inputs(state,dispatch);
    const refPN = useRef();
    const refPP = useRef();
    const refPS = useRef();
    const refAM = useRef();
    const getRespuesta =(res) =>{
        dispatch({type:'CARGAR',payload:res.mensaje})
    }
    const getRespuestaResetC =(res) =>{
        const data={
            producto: null,
            Producto:{
                nombre:{value:'',isValid:null},
                price:{value:'',isValid:null},
                stock:{value:'',isValid:null},
                problema: -1,
                discontinuado:false,
                problemas: [
                    { id: 1, pro: "" },
                    { id: 2, pro: "" },
                    { id: 3, pro: "" },
                    { id: 4, pro: "" },
                ],
            },
            Agregar:{
                stock:{value:'',isValid:null},
                problema: '',
            },
        }
        dispatch({type:'CARGAR',payload:res.mensaje,datos:data})
    }

    const crearRespuesta = (res) =>{
        console.log(res);
        dispatch({type:'SHOW_MENSAJE',value:res.mensaje.mensaje});
        carga({url:'/listadoProductos'},getRespuestaResetC);
    }

    useEffect(()=>{
        carga({url:'/listadoProductos'},getRespuesta);
    },[])

    const Modificando = state.producto!==null;

    
    const submitProducto = ()=>{
        const Producto = state.Producto;
        if(!Producto.nombre.isValid) refPN.current.focus();
        else if(!Producto.price.isValid) refPP.current.focus()
        else if(!Producto.stock.isValid) refPS.current.focus();
        else{
            if(Modificando){
                const data ={
                    idProducto:state.producto.id,
                    nombre:Producto.nombre.value,
                    precio:Producto.price.value,
                    stock:Producto.stock.value,
                    descontinuado:Producto.discontinuado?1:0
                  }
                console.log(data);
                modificar(
                    {
                      url: "/modificarProducto",
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: data,
                    },
                    crearRespuesta
                );
            }else{
                crear(
                    {
                      url: "/crearProducto",
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: {
                          nombre:Producto.nombre.value,
                          precio:Producto.price.value,
                          stock:Producto.stock.value,
                          descontinuado:Producto.discontinuado?1:0
                        },
                    },
                    crearRespuesta
                );
            }
        }
    }
    const submitAgregar = () => {
        /* if(!state.Agregar.stock.isValid) refPS.current.focus();
        else{
            modificar(
                {
                  url: "/modificarProducto",
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: data,
                },
                crearRespuesta
            );
        } */
    }

    return <>
    <Marco use={true}>
        <Note 
        show={state.Mensaje.show} 
        onClose={()=>{
            dispatch({type:'HIDE_MENSAJE'});
            }}>{state.Mensaje.text}</Note>
    </Marco>
    {state.productos===null&&<Marco use={true} logo={true}><LoaddingSpinner/></Marco>}
    {state.productos!==null&&
        <Marco use={true} className = {classes.container}>
            <div>
                <Lista items={state.productos} selected={state.producto} className={classes.miLista} select={(item)=>{
                    console.log(item);
                    dispatch({type:'CLICK',value:item});
                    }}/>
            </div>
            <div className={classes.actions}>
                <Border >
                    <h1>{!Modificando?'Agregandos':'Modificando'}</h1>
                    <div>
                    <label>Nombre:</label>
                    <Input
                        ref={refPN}
                        isValid={state.Producto.nombre.isValid}
                        input={INPUTS[0]}
                    />
                    <label>Precio:</label>
                    <Input
                        ref={refPP}
                        isValid={state.Producto.price.isValid}
                        input={INPUTS[1]}
                    />
                    <label>Stock:</label>
                    <Input
                        ref={refPS}
                        isValid={state.Producto.stock.isValid}
                        input={INPUTS[2]}
                    />
                    <label>Discontinuado:</label>
                    <Checkbox
                        id={1}
                        checked={state.Producto.discontinuado}
                        onChange={() => {
                            dispatch({type:'CHECK'})
                        }}
                    />
                    </div>
                    {state.Producto.problema !==-1 && (
                        <p>{state.Producto.problemas[state.Producto.problema].pro}</p>
                    )}
                    <SimpleButton action={submitProducto}>{!Modificando?'Agregar':'Modificar'}</SimpleButton>
                </Border>
                <Border disabled={!Modificando}>
                    <h1 className={!Modificando?classes.disabled:''}>Añadir Stock</h1>
                    <div>
                        <label className={!Modificando?classes.disabled:''}>Nombre:</label>
                        <Input
                            ref={refAM}
                            isValid={state.Agregar.stock.isValid}
                            input={INPUTS[3]}
                        />
                    </div>
                    {state.Agregar.problema !=='' && (
                        <p>{state.Agregar.problema}</p>
                    )}
                    <SimpleButton action={submitAgregar} disabled={!Modificando}>Añadir</SimpleButton>
                </Border>
            </div>
            <div>
                <Lista selected={state.producto} items={state.productosDiscontinuados} className={classes.miLista} select={(item)=>{
                        dispatch({type:'CLICK',value:item});
                    }}/>
            </div>
        </Marco>}
    </>
}
export default Productos
