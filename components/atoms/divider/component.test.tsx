import React from 'react';

import renderer from 'react-test-renderer';
import Divider from './Divider';
test('Renders', () => {
    const tree = renderer.create(<Divider/>).toJSON();
    expect(tree).toMatchSnapshot()
})