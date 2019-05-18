import React from 'react';
import { render } from 'react-testing-library';
import { makeRetroData } from '../../test-helpers/dataFactories';
import mockElement from '../../test-helpers/mockElement';

import RetroFormatPicker from './RetroFormatPicker';

jest.mock('./mood/MoodRetro', () => mockElement('mock-mood-retro'));
jest.mock('./unknown/UnknownRetro', () => mockElement('mock-unknown-retro'));

describe('Retro', () => {
  it('forwards properties to the specified retro format', () => {
    const retroData = makeRetroData({ format: 'mood' });
    const retroState = { foo: 'bar' };

    const { container } = render((
      <RetroFormatPicker
        retroData={retroData}
        retroState={retroState}
      />
    ));

    expect(container).toContainQuerySelector('mock-mood-retro');
    expect(container.querySelector('mock-mood-retro')).toHaveMockProps({
      retroData,
      retroState,
    });
  });

  it('displays UnknownRetro for unknown formats', () => {
    const retroData = makeRetroData({ format: 'nope' });
    const { container } = render((
      <RetroFormatPicker
        retroData={retroData}
        retroState={{}}
      />
    ));

    expect(container).toContainQuerySelector('mock-unknown-retro');
    expect(container).not.toContainQuerySelector('mock-mood-retro');
  });
});
