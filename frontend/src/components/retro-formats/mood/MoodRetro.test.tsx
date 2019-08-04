import React from 'react';
import { render } from '@testing-library/react';
import { makeRetroData } from 'refacto-entities';

import MoodRetro from './MoodRetro';

const emptyRetroData = makeRetroData({ format: 'mood' });

const nop = (): void => {};

describe('MoodRetro', () => {
  it('renders without error', () => {
    render((
      <MoodRetro
        retroData={emptyRetroData}
        retroState={{}}
        archive={false}
        onComplete={nop}
        dispatch={nop}
      />
    ));
  });
});
