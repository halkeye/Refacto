import { useCallback, memo } from 'react';
import { useLocation } from 'wouter';
import { Header } from '../common/Header';
import { slugTracker } from '../../api/api';
import { RetroForm, CreationT } from './RetroForm';
import './RetroImportPage.less';

export const RetroImportPage = memo(() => {
  const [, setLocation] = useLocation();
  const handleCreate = useCallback(
    ({ id, slug }: CreationT) => {
      slugTracker.set(slug, id);
      setLocation(`/retros/${slug}`);
    },
    [setLocation],
  );

  return (
    <article className="page-retro-import">
      <Header
        documentTitle="Import Retro - Refacto"
        title="Import Retro"
        backLink={{ label: 'Create', action: '/create' }}
        links={[{ label: 'My Retros', action: '/retros' }]}
      />
      <RetroForm onCreate={handleCreate} showImport />
    </article>
  );
});
