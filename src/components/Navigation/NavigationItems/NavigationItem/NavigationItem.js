import React from 'react';
import classes from './NavigationItem.module.css';
import { NavLink } from 'react-router-dom';

//como era antes
/* <NavLink 
    to={props.link}
    className={props.active ? classes.active : null}>{props.children} no se usa mas el className ya NavLink va a determinar automaticamente si esta activo o no
</NavLink> */

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <NavLink to={props.link} exact={props.exact} activeClassName={classes.active}>
            {props.children}
        </NavLink>
    </li>
);

export default navigationItem;