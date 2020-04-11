import React from 'react';
import type { RetroArchiveSummary } from 'refacto-entities';
import ArchiveLink from './ArchiveLink';

function archiveCreatedComparator(
  a: RetroArchiveSummary,
  b: RetroArchiveSummary,
): number {
  // sort newer-to-older
  return b.created - a.created;
}

function sortArchives(
  archives: RetroArchiveSummary[],
): RetroArchiveSummary[] {
  const sorted = archives.slice();
  sorted.sort(archiveCreatedComparator);
  return sorted;
}

interface PropsT {
  slug: string;
  archives: RetroArchiveSummary[];
}

const ArchiveList = ({ slug, archives }: PropsT): React.ReactElement => {
  if (!archives.length) {
    return (<p>This retro has no archives.</p>);
  }

  return (
    <ul className="archives">
      { sortArchives(archives).map(({ id, created }) => (
        <li key={id}>
          <ArchiveLink retroSlug={slug} archiveId={id} created={created} />
        </li>
      )) }
    </ul>
  );
};

export default React.memo(ArchiveList);
