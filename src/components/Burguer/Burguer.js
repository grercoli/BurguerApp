import React from 'react';
import classes from './Burguer.module.css';
import BurguerIngredient from './BurguerIngredient/BurguerIngredient';

const burguer = (props) => {
    //lo que pretendo es transformar el objeto ingredients en un arreglo para poder recorrerlo
    //Con Object.keys(props.ingredients) tendria un object (like-array): [0: salad, 1: cheese, 2: meat]
    //con el map vamos elemento por elemento y igKey vendria a ser salad, cheese, meat ...
    let transformedIngredients = Object.keys(props.ingredients).map(igKey => {
        //I want to transform this string value for example salad into an array with as many elements as we have ingredients for a given ingredient, so if we have 2 cheese ingredients then i want to transform that cheese string into an array which simple contains 2 elements
        //Por ejemplo si tengo: let ingredients = {salad: 0, cheese: 2, meat: 1, bacon: 0}, lo que me va a devolver [...Array(props.ingredients[igKey])] es un arreglo con cuatro elementos que a su vez son arreglos: [Array(0), Array(2), Array(1), Array(0)]
        return [...Array(props.ingredients[igKey])].map((_, index) => {
            //"_" because i dont care about the element but yes about the index
            //igKey is something like "salad" and index is 1,2,3...
            return <BurguerIngredient key={igKey + index} type={igKey} />
        }); //you can create an array with Array(), for example an Array(3) will give an array with 3 empty spaces, but here the lenght should be the amount of the given ingredient
        //NOTA PARA RESUMIR: todo este codigo complicado es una manera de transformar un objeto con parejas de key -> value en un array de <BurguerIngredient />
    }).reduce((prevArr, currEl) => {
        return prevArr.concat(currEl);
    }, []); //reduce() allow us to transform an array into something else, a function that receives 2 arguments the previous value and the current one. It also accepts an initial value, in this case an empty array [], va a recorrer todos los elementos y va a ir agregando al initial value
    //Para saber si tenemos ingredientes o no podemos usar el reduce. Al principio que no tenemos ingredientes el resultado de transformedIngredients sin el reduce se veria asi: (4)[Array(0), Array(0), Array(0), Array(0),]. Al usar el reduce se veria asi: []. Si tuviera 2 cheese se veria como un array con 2 objetos: (2)[{...}, {...}]
    
    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burguer}>
            <BurguerIngredient type={"bread-top"}/>
            {transformedIngredients}
            <BurguerIngredient type={"bread-bottom"}/>
        </div>
    );
};

export default burguer;