import WebSocketExpress from 'websocket-express';
import type { RetroAuthService } from '../services/RetroAuthService';
import type { UserAuthService } from '../services/UserAuthService';
import type { RetroService } from '../services/RetroService';

const JSON_BODY = WebSocketExpress.default.json({ limit: 4 * 1024 });

export class ApiAuthRouter extends WebSocketExpress.Router {
  public constructor(
    userAuthService: UserAuthService,
    retroAuthService: RetroAuthService,
    retroService: RetroService,
  ) {
    super();

    const userAuthMiddleware = WebSocketExpress.requireBearerAuth(
      'user',
      (token): WebSocketExpress.JWTPayload | null =>
        userAuthService.readAndVerifyToken(token),
    );

    this.get('/tokens/:retroId/user', userAuthMiddleware, async (req, res) => {
      const userId = WebSocketExpress.getAuthData(res).sub!;
      const { retroId } = req.params;

      if (
        !retroId ||
        !(await retroService.isRetroOwnedByUser(retroId, userId))
      ) {
        res.status(403).json({ error: 'not retro owner' });
        return;
      }

      const retroToken = await retroAuthService.grantOwnerToken(retroId);
      if (!retroToken) {
        res.status(500).json({ error: 'retro not found' });
        return;
      }

      res.status(200).json({ retroToken });
    });

    this.post('/tokens/:retroId', JSON_BODY, async (req, res) => {
      const { retroId } = req.params;
      const { password } = req.body;

      const retroToken = await retroAuthService.grantForPassword(
        retroId,
        password,
      );
      if (!retroToken) {
        res.status(400).json({ error: 'incorrect password' });
        return;
      }

      res.status(200).json({ retroToken });
    });
  }
}
