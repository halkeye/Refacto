import React from 'react';
import classNames from 'classnames';
import forbidExtraProps from '../../../../helpers/forbidExtraProps';
import { propTypesShapeItem } from '../../../../helpers/dataStructurePropTypes';
import './ActionItem.less'; // eslint-disable-line import/no-unresolved - weird linter bug

export const ActionItem = ({
  item: {
    message,
    done = false,
  },
}) => (
  <div className={classNames('action-item', { done })}>
    {message}
  </div>
);

ActionItem.propTypes = {
  item: propTypesShapeItem.isRequired,
};

forbidExtraProps(ActionItem, { alsoAllow: ['focused'] });

export default React.memo(ActionItem);
