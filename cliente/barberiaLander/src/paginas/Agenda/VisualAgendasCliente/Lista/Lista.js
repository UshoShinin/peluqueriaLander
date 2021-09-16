import Item from './Item';
import classes from './Lista.module.css';
const Lista = (props) => {
    const content = props.items.map((item)=>{
        return(
            <Item key={item.nombreCliente} item={item} select={props.select} aceptar={props.aceptar} rechazar={props.rechazar}>
                {/* {item.nombreCliente} */}
            </Item>
        )
    })
  return(<ul className={classes.lista}>{content}</ul>)
}
export default Lista;