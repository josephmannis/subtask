import React from 'react';

import renderer from 'react-test-renderer';
import Tag from './Tag';
test('Renders', () => {
    const tree = renderer.create(<Tag text={'Test tags!'}/>).toJSON();
    expect(tree).toMatchSnapshot()
})