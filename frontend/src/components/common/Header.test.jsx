import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { render, fireEvent } from 'react-testing-library';

import Header from './Header';

HelmetProvider.canUseDOM = false;

function extractHelmetTitle(context) {
  return context.helmet.title.toString().match(/>(.*)</)[1];
}

describe('Header', () => {
  it('sets the document and page title', () => {
    const helmetContext = {};
    const routerContext = {};

    const { container } = render((
      <HelmetProvider context={helmetContext}>
        <StaticRouter location="" context={routerContext}>
          <Header
            documentTitle="doc-title"
            title="page-title"
          />
        </StaticRouter>
      </HelmetProvider>
    ));

    expect(extractHelmetTitle(helmetContext)).toEqual('doc-title');
    expect(container.querySelector('h1')).toHaveTextContent('page-title');
  });

  it('displays a back link if specified', () => {
    const helmetContext = {};
    const routerContext = {};

    const { container } = render((
      <HelmetProvider context={helmetContext}>
        <StaticRouter location="" context={routerContext}>
          <Header
            documentTitle="doc-title"
            title="page-title"
            backLink={{ label: 'back-label', url: 'back-url' }}
          />
        </StaticRouter>
      </HelmetProvider>
    ));

    const backLink = container.querySelector('.back');
    expect(backLink).toHaveTextContent('back-label');

    fireEvent.click(backLink);
    expect(routerContext.url).toEqual('back-url');
  });

  it('displays a menu of links if specified', () => {
    const helmetContext = {};
    const routerContext = {};

    const { container } = render((
      <HelmetProvider context={helmetContext}>
        <StaticRouter location="" context={routerContext}>
          <Header
            documentTitle="doc-title"
            title="page-title"
            links={[
              { label: 'label-1', url: 'url-1' },
              { label: 'label-2', url: 'url-2' },
            ]}
          />
        </StaticRouter>
      </HelmetProvider>
    ));

    const links = container.querySelectorAll('.menu > *');
    expect(links.length).toEqual(2);
    expect(links[0]).toHaveTextContent('label-1');
    expect(links[1]).toHaveTextContent('label-2');

    fireEvent.click(links[0]);
    expect(routerContext.url).toEqual('url-1');
  });
});
