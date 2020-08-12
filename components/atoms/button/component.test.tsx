import React from 'react';
import renderer from 'react-test-renderer';
import FloatingActionButton from './FloatingActionButton';

test('Renders', () => {
    const tree = renderer.create(<FloatingActionButton onPress={() => console.log('hi')}/>).toJSON();
    expect(tree).toMatchSnapshot()
})
