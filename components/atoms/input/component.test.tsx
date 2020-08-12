import React from 'react';

import renderer from 'react-test-renderer';
import { Input, InputLabel } from './TextInput';
test('Renders input', () => {
    const tree = renderer.create(<Input/>).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders label', () => {
    const tree = renderer.create(<InputLabel>hello I'm a test!</InputLabel>).toJSON();
    expect(tree).toMatchSnapshot()
})