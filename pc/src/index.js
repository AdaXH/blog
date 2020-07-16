import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import './index.css';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
// app.use({});

// 3. Model
const models = [
  'dynamic',
  'user',
  'dialog',
  'article',
  // 'message',
  'search',
  // 'pagenation',
  'image',
  'blogConfig',
];
models.forEach((item) => app.model(require(`./models/${item}`).default));

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
