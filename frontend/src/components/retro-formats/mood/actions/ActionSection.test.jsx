import React from 'react';
import { shallow } from 'enzyme';
import { makeItem } from '../../../../test-helpers/dataFactories';

import { ActionSection } from './ActionSection';
import ActionItem from './ActionItem';
import ItemColumn from '../ItemColumn';

describe('ActionSection', () => {
  it('displays a given title', () => {
    const dom = shallow(<ActionSection title="my title" items={[]} />);

    expect(dom.find('h3')).toHaveText('my title');
  });

  it('displays a list of ActionItem items', () => {
    const items = [
      makeItem({ category: 'action', message: 'foo' }),
      makeItem({ category: 'action', message: 'bar' }),
    ];
    const dom = shallow(<ActionSection title="" items={items} />);

    expect(dom.find(ItemColumn)).toHaveProp({
      ItemType: ActionItem,
      items,
    });
  });

  it('filters out non-action items', () => {
    const items = [
      makeItem({ category: 'nope', message: 'foo' }),
      makeItem({ category: 'action', message: 'bar' }),
    ];
    const dom = shallow(<ActionSection title="" items={items} />);

    expect(dom.find(ItemColumn)).toHaveProp({
      items: [items[1]],
    });
  });

  it('filters by created date', () => {
    const items = [
      makeItem({ category: 'action', created: 15 }),
      makeItem({ category: 'action', created: 5 }),
      makeItem({ category: 'action', created: 25 }),
    ];

    const dom = shallow(<ActionSection title="" items={items} rangeFrom={10} rangeTo={20} />);

    expect(dom.find(ItemColumn)).toHaveProp({
      items: [items[0]],
    });
  });
});