import React from 'react';
import classNames from 'classnames';
import type { RetroItem } from 'refacto-entities';
import VoteCount from './VoteCount';
import WrappedButton from '../../../common/WrappedButton';

interface PropsT {
  item: RetroItem;
  onSelect?: () => void;
  onVote?: () => void;
  onEdit?: () => void;
}

const MoodItemPlain = ({
  item,
  onSelect,
  onVote,
  onEdit,
}: PropsT): React.ReactElement => (
  <div className={classNames('mood-item', { done: item.doneTime > 0 })}>
    <WrappedButton className="message" onClick={onSelect}>
      { item.message }
    </WrappedButton>
    <VoteCount votes={item.votes} onVote={onVote} />
    <WrappedButton
      title="Edit"
      className="edit"
      onClick={onEdit}
      hideIfDisabled
    />
  </div>
);

MoodItemPlain.defaultProps = {
  onSelect: undefined,
  onVote: undefined,
  onEdit: undefined,
};

export default React.memo(MoodItemPlain);
