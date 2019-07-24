import React from 'react';
import classes from './Button.module.css';

//lo que le pase a className tiene que ser un string, de esta forma: className={[classes.Button, classes[props.btnType]]} es un array de strings. Se va a elegir la clase dependiendo del tipo de boton que sea.
//join lo que hace es al tener un arreglo te separa cada elemento con un espacio y te lo convierte en una lista de strings.
const button = (props) => (
    <button 
        className={[classes.Button, classes[props.btnType]].join(' ')}
        onClick={props.clicked}>{props.children}</button>
); 

export default button;