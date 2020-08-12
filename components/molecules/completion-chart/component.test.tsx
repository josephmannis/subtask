import React from 'react';

import renderer from 'react-test-renderer';
import CompletionChart from './CompletionChart';
// import { shallow } from 'enzyme';

test('Renders zero percent correctly', () => {
    const tree = renderer.create(<CompletionChart percentCompleted={0}/>).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders negative numbers correctly', () => {
    const tree = renderer.create(<CompletionChart percentCompleted={-1} />).toJSON();
    expect(tree).toMatchSnapshot()
})
1
test('Renders numbers greater than 1 correctly', () => {
    const tree = renderer.create(<CompletionChart percentCompleted={2} />).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders 1 correctly', () => {
    const tree = renderer.create(<CompletionChart percentCompleted={1} />).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders numbers between zero and 1 correctly', () => {
    const tree = renderer.create(<CompletionChart percentCompleted={.5} />).toJSON();
    expect(tree).toMatchSnapshot()
})

test('Renders zero correctly', () => {
    const tree = renderer.create(<CompletionChart percentCompleted={0} />).toJSON();
    expect(tree).toMatchSnapshot()
})

// test('Renders changing numbers correctly', () => {
//     const tree = shallow(<CompletionChart percentCompleted={0}/>)
//     expect(tree).toMatchSnapshot()
//     tree.setProps({percentCompleted: .25})
//     expect(tree).toMatchSnapshot()
// })