import React from 'react';
import { render } from '@testing-library/react';
import mockElement from 'react-mock-element';
import { userTokenTracker, retroListTracker } from '../../api/api';
import { queries, css } from '../../test-helpers/queries';

import RetroListPage from './RetroListPage';

jest.mock('../../api/api');
jest.mock('../common/Header', () => mockElement('mock-header'));
jest.mock('./RetroList', () => mockElement('mock-retro-list'));

describe('RetroListPage', () => {
  beforeEach(() => {
    userTokenTracker.set('foobar');
    retroListTracker.set('foobar', {
      retros: [{ id: 'u1', slug: 'a', name: 'R1' }],
    });
  });

  it('loads data when displayed', () => {
    const dom = render(<RetroListPage />, { queries });

    const retroList = dom.getBy(css('mock-retro-list'));
    expect(retroList.mockProps.retros.length).toEqual(1);
  });
});
