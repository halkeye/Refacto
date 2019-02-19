import React from 'react';
import { shallow } from 'enzyme';
import Router from './Router';

describe('Router', () => {
  it('renders without crashing', () => {
    const dom = shallow(<Router />);
    expect(dom).toExist();
  });
});
