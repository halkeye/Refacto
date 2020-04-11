import React, { useRef, useEffect } from 'react';
import type { RetroItem } from 'refacto-entities';
import VoteCount from './VoteCount';
import Timer from './timer/Timer';
import WrappedButton from '../../../common/WrappedButton';
import Attachment from '../../../attachments/Attachment';

interface PropsT {
  item: RetroItem;
  focusedItemTimeout: number;
  autoScroll: boolean;
  onAddExtraTime?: (time: number) => void;
  onCancel?: () => void;
  onContinue?: () => void;
}

const MoodItemFocused = ({
  item,
  focusedItemTimeout,
  autoScroll,
  onAddExtraTime,
  onCancel,
  onContinue,
}: PropsT): React.ReactElement => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll) {
      ref.current?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [ref, autoScroll]);

  return (
    <div className="mood-item focused">
      <div className="scroll-target" ref={ref} />
      <div className="message">{ item.message }</div>
      <VoteCount votes={item.votes} />
      <Attachment attachment={item.attachment} />
      <WrappedButton title="Back (left arrow)" className="cancel" onClick={onCancel} hideIfDisabled>
        back
      </WrappedButton>
      <WrappedButton title="Next (right arrow)" className="continue" onClick={onContinue} hideIfDisabled>
        Next
      </WrappedButton>
      <Timer targetTime={focusedItemTimeout} onAddExtraTime={onAddExtraTime} />
    </div>
  );
};

MoodItemFocused.defaultProps = {
  focusedItemTimeout: 0,
  onAddExtraTime: undefined,
  autoScroll: false,
  onCancel: undefined,
  onContinue: undefined,
};

export default React.memo(MoodItemFocused);
