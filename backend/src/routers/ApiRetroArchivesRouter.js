import { Router } from 'websocket-express';
import { authScope } from './authMiddleware';

export default class ApiRetroArchivesRouter extends Router {
  constructor(retroArchiveService) {
    super({ mergeParams: true });

    this.get('/', authScope('readArchives'), async (req, res) => {
      const { retroId } = req.params;

      const archives = await retroArchiveService.getRetroArchiveList(retroId);
      res.json({ archives });
    });

    this.post('/', authScope('write'), async (req, res) => {
      const { retroId } = req.params;

      const { format, items } = req.body;
      const id = await retroArchiveService.createArchive(retroId, {
        format,
        items,
      });

      res.status(200).json({ id });
    });

    this.get('/:archiveId', authScope('readArchives'), async (req, res) => {
      const { retroId, archiveId } = req.params;

      const archive = await retroArchiveService
        .getRetroArchive(retroId, archiveId);

      if (archive) {
        res.json(archive);
      } else {
        res.status(404).end();
      }
    });
  }
}