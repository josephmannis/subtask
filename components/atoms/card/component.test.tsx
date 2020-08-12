import React from 'react';
import renderer from 'react-test-renderer';
import Card from './Card';

test('Renders', () => {
    const tree = renderer.create(<Card/>).toJSON();
    expect(tree).toMatchSnapshot()
})