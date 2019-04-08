import WebSocketExpress from 'websocket-express';
import ApiRouter from './routers/ApiRouter';
import StaticRouter from './routers/StaticRouter';
import Hasher from './hash/Hasher';
import TokenManager from './services/TokenManager';
import RetroService from './services/InMemoryRetroService';
import AuthService from './services/InMemoryAuthService';

const now = Date.now();

const retroService = new RetroService([
  {
    id: 'r1',
    slug: 'my-retro',
    name: 'My Retro',
    state: {
      focusedItemId: null,
      focusedItemTimeout: 0,
    },
    data: {
      format: 'mood',
      items: [
        {
          id: 'a1',
          category: 'happy',
          created: now - 199000,
          message: 'This is good.',
          votes: 0,
          done: false,
        },
        {
          id: 'b2',
          category: 'happy',
          created: now - 198000,
          message: 'This is also good, and popular.',
          votes: 5,
          done: false,
        },
        {
          id: 'c3',
          category: 'meh',
          created: now - 197000,
          message: 'This is alright and has been discussed.',
          votes: 0,
          done: true,
        },
        {
          id: 'd4',
          category: 'sad',
          created: now - 196000,
          message: 'This is not ok.',
          votes: 0,
          done: false,
        },
        {
          id: 'e5',
          category: 'action',
          created: now - 195000,
          message: 'This is an action which has not been done.',
          votes: 0,
          done: false,
        },
        {
          id: 'f6',
          category: 'action',
          created: now - 194000,
          message: 'This is an action which has been done.',
          votes: 0,
          done: true,
        },
        {
          id: 'g7',
          category: 'action',
          created: now - (86400000 * 7),
          message: 'This is an outstanding action from the last retro.',
          votes: 0,
          done: false,
        },
        {
          id: 'h8',
          category: 'action',
          created: now - (86400000 * 8),
          message: 'This is an outstanding action from the distant past.',
          votes: 0,
          done: false,
        },
      ],
    },
    archives: [
      {
        id: 'a1',
        created: now - (86400000 * 10),
        data: {
          format: 'mood',
          items: [
            {
              id: 'z9',
              category: 'happy',
              created: now - (86400000 * 10) - 198000,
              message: 'An archived happy item.',
              votes: 2,
              done: false,
            },
            {
              id: 'y8',
              category: 'sad',
              created: now - (86400000 * 10) - 199000,
              message: 'An archived, completed, sad item.',
              votes: 0,
              done: true,
            },
            {
              id: 'x7',
              category: 'action',
              created: now - (86400000 * 10) - 197000,
              message: 'An archived action.',
              votes: 0,
              done: true,
            },
          ],
        },
      },
      {
        id: 'b2',
        created: now - (86400000 * 12),
        data: {
          format: 'mood',
          items: [],
        },
      },
    ],
  },
  {
    id: 'r2',
    slug: 'my-second-retro',
    name: 'My Second Retro',
    state: {
      focusedItemId: null,
      focusedItemTimeout: 0,
    },
    data: {
      format: 'mood',
      items: [],
    },
    archives: [
      {
        id: 'a3',
        created: now - (86400000 * 10),
        data: {
          format: 'mood',
          items: [],
        },
      },
    ],
  },
  {
    id: 'r3',
    slug: 'unknown-retro',
    name: 'An Unknown Retro Format',
    state: {},
    data: {
      format: 'nope',
      items: [],
    },
    archives: [],
  },
]);

// environment configuration
const hasherRounds = 10;
const secretPepper = '';
const secretPrivateKeyPassphrase = '';

const hasher = new Hasher(secretPepper, hasherRounds);
const tokenManager = new TokenManager(secretPrivateKeyPassphrase);
const authService = new AuthService(hasher, tokenManager);
authService.setPassword('r1', 'password');
authService.setPassword('r2', 'pa55w0rd');
authService.setPassword('r3', '12345');

const app = new WebSocketExpress();

app.disable('x-powered-by');
app.enable('case sensitive routing');
app.use(WebSocketExpress.json({ limit: 5 * 1024 }));
app.use('/api', new ApiRouter(authService, retroService));
app.use(new StaticRouter());

export default app;
