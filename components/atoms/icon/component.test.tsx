import React from 'react';

import renderer from 'react-test-renderer';
import Icon from './Icon';
test('Renders search', () => {
    const tree = renderer.create(<Icon type='search' size='small'/>).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders check', () => {
    const tree = renderer.create(<Icon type='check' size='small' />).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders arrow', () => {
    const tree = renderer.create(<Icon type='arrow' size='small' />).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders plus', () => {
    const tree = renderer.create(<Icon type='plus' size='small' />).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders kebab', () => {
    const tree = renderer.create(<Icon type='kebab' size='small' />).toJSON();
    expect(tree).toMatchSnapshot()
})