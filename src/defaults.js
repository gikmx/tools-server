import PATH from 'path';

import handler404 from './handler-404';
import onNext from './on-next';
import onError from './on-error';

const CWD = process.cwd();

export default {
    subscription: true,
    routes: PATH.join(CWD, 'routes.json'),
    handlers: PATH.join(CWD, 'handlers'),
    port: 3333,
    host: '0.0.0.0',
    handler404,
    onNext,
    onError,
};
