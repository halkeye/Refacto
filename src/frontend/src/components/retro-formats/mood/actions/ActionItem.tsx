import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RetroItem, UserProvidedRetroItemDetails } from 'refacto-entities';
import ItemEditor from '../ItemEditor';
import WrappedButton from '../../../common/WrappedButton';
import useBoundCallback from '../../../../hooks/useBoundCallback';
import forbidExtraProps from '../../../../helpers/forbidExtraProps';
import { propTypesShapeItem } from '../../../../api/dataStructurePropTypes';
import './ActionItem.less';

interface PropsT {
  item: RetroItem;
  onSetDone?: (id: string, done: boolean) => void;
  onEdit?: (id: string, diff: Partial<UserProvidedRetroItemDetails>) => void;
  onDelete?: (id: string) => void;
}

const ActionItem = ({
  item,
  onSetDone,
  onEdit,
  onDelete,
}: PropsT): React.ReactElement => {
  const done = item.doneTime > 0;

  const handleToggleDone = useBoundCallback(onSetDone, item.id, !done);
  const handleDelete = useBoundCallback(onDelete, item.id);

  const [editing, setEditing] = useState(false);
  const handleBeginEdit = useBoundCallback(setEditing, true);
  const handleCancelEdit = useBoundCallback(setEditing, false);
  const handleSaveEdit = useCallback((
    diff: Partial<UserProvidedRetroItemDetails>,
  ) => {
    setEditing(false);
    onEdit!(item.id, diff);
  }, [setEditing, onEdit, item.id]);

  if (editing) {
    /* eslint-disable jsx-a11y/no-autofocus */ // user triggered this
    return (
      <div className="action-item editing">
        <ItemEditor
          defaultItem={item}
          submitButtonLabel="Save"
          submitButtonTitle="Save changes"
          onSubmit={handleSaveEdit}
          onDelete={handleDelete}
          onCancel={handleCancelEdit}
          autoFocus
        />
      </div>
    );
    /* eslint-enable jsx-a11y/no-autofocus */
  }

  return (
    <div className={classNames('action-item', { done })}>
      <div className="message">{ item.message }</div>
      <WrappedButton
        role="checkbox"
        aria-checked={done}
        title={done ? 'Mark as not done' : 'Mark as done'}
        className="toggle-done"
        onClick={handleToggleDone}
      />
      <WrappedButton
        title="Edit"
        className="edit"
        disabled={!onEdit}
        hideIfDisabled
        onClick={handleBeginEdit}
      />
    </div>
  );
};

ActionItem.propTypes = {
  item: propTypesShapeItem.isRequired,
  onSetDone: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

ActionItem.defaultProps = {
  onSetDone: undefined,
  onEdit: undefined,
  onDelete: undefined,
};

forbidExtraProps(ActionItem, { alsoAllow: ['focused'] });

export default React.memo(ActionItem);