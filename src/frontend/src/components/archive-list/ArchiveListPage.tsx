import React from 'react';
import Header from '../common/Header';
import Loader from '../common/Loader';
import ApiDownload from '../common/ApiDownload';
import withRetroTokenForSlug from '../hocs/withRetroTokenForSlug';
import useRetroReducer from '../../hooks/data/useRetroReducer';
import useArchiveList from '../../hooks/data/useArchiveList';
import ArchiveList from './ArchiveList';
import './ArchiveListPage.less';

interface PropsT {
  slug: string;
  retroId: string | null;
  retroToken: string | null;
  retroTokenError?: string | null;
}

const ArchiveListPage = ({
  slug,
  retroId,
  retroToken,
  retroTokenError,
}: PropsT): React.ReactElement => {
  const [retro] = useRetroReducer(retroId, retroToken);
  const [archives, archivesError] = useArchiveList(retroId, retroToken);

  const retroName = retro?.name ?? slug;

  return (
    <article className="page-archive-list">
      <Header
        documentTitle={`Archives - ${retroName} - Refacto`}
        title={`${retroName} Archives`}
        backLink={{ label: 'Back to Retro', action: `/retros/${slug}` }}
      />
      <Loader<typeof ArchiveList>
        error={retroTokenError || archivesError}
        Component={ArchiveList}
        componentProps={archives ? {
          slug,
          archives,
        } : null}
      />
      <div className="extra-links">
        <ApiDownload
          url={`retros/${retroId}/export/json`}
          token={retroToken}
          filename={`${slug}-export.json`}
        >
          Export as JSON
        </ApiDownload>
      </div>
    </article>
  );
};

ArchiveListPage.defaultProps = {
  retroTokenError: null,
};

export default React.memo(withRetroTokenForSlug(ArchiveListPage));
