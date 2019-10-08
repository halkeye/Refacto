import React from 'react';
import PropTypes from 'prop-types';
import WrappedButton from '../../../../common/WrappedButton';
import useBoundCallback from '../../../../../hooks/useBoundCallback';
import forbidExtraProps from '../../../../../helpers/forbidExtraProps';

interface PropsT {
  onAddExtraTime?: (time: number) => void;
}

const TimeUp = ({ onAddExtraTime }: PropsT): React.ReactElement => {
  const extraMinutes = 2;

  const extraTime = extraMinutes * 60 * 1000 + 999;
  const handleAddExtraTime = useBoundCallback(onAddExtraTime, extraTime);
  const extraTimeLabel = `+${extraMinutes} more minutes`;

  return (
    <React.Fragment>
      <p className="timeup">Time&rsquo;s up!</p>
      <WrappedButton onClick={handleAddExtraTime} hideIfDisabled>
        { extraTimeLabel }
      </WrappedButton>
    </React.Fragment>
  );
};

TimeUp.propTypes = {
  onAddExtraTime: PropTypes.func,
};

TimeUp.defaultProps = {
  onAddExtraTime: undefined,
};

forbidExtraProps(TimeUp);

export default React.memo(TimeUp);