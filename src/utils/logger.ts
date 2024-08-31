import * as bunyan from 'bunyan';
import * as fs from 'fs';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export default bunyan.createLogger({
  name: 'fluentpal-api',
  streams: [
    {
      type: 'rotating-file',
      path: 'logs/infor.log',
      period: '1d',
      level: 'info',
      count: 3,
    },
    {
      type: 'rotating-file',
      path: 'logs/error.log',
      period: '1d',
      level: 'error',
      count: 7,
    },
    {
      type: 'rotating-file',
      path: 'logs/trace.log',
      period: '1d',
      level: 'trace',
      count: 3,
    },
  ],
});
