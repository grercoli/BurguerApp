import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()}); //enzyme is now connected

describe('<NavigationItems />', () => {
    let wrapper;
    // will automaticatelly be executed before each of your tests
    // there is also afterEach for cleanup mostly
    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    });

    it('should render two <NavigationItem /> elements if not authenticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it('should render three <NavigationItem /> elements if authenticated', () => {
        //wrapper = shallow(<NavigationItems isAuthenticated />); this is one option to do it
        // Another option is to use setProps(). It receives an object and the key is the prop name 
        wrapper.setProps({isAuthenticated: true});
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    it('should render Logout if authenticated', () => {
        wrapper.setProps({isAuthenticated: true});
        //with contains i want to check for a specific node
        //ver como esta hecho en NavigationItems.js para entender mejor
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
    });
});