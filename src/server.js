/* eslint-disable no-param-reassign */
import PATH from 'path';
import HTTP from 'http';
import { parse as PARSE } from 'url';
import Thrower from '@gik/tools-thrower';
import Logger from '@gik/tools-logger';
import { $ } from '@gik/tools-streamer';

import defaults from './defaults';

const log = Logger({
    name: '@gik/tools-server',
});

/**
 * @module server
 * @description A minimal webserver using [RxJS Observables](https://github.com/reactivex/rxjs).
 *
 * @param {Object} [config] - The configuration for the server.
 * @param {boolean} [config.subscription=true] - Should the server should be started right away.
 * @param {string} [config.routes=CWD/routes.json] - The location for the routes file.
 * @param {string} [config.handlers=CWD/handlers] - The location for the handlers folder.
 * @param {string} [config.port=3333] - The port to use when starting the server.
 * The `PORT` environment variable can also be used to set this.
 * @param {string} [config.host=0.0.0.0] - The host to use when starting the server.
 * The `HOST` environment variable can also be used to set this.
 * @param {Function} [config.handler404] - The default handler for routes without handler.
 * @param {Function} [config.onNext] - When subscription mode is enabled this is called
 * whenever the server inits or a request was handled.
 * @param {Function} [config.onError] - When subscription mode is enabled this is called
 * whenever an error is thrown.
 *
 * @returns {Subscription|Observable} - if subscription mode was enabled
 * a subscription would be returned, otherwise an observable is returned.
 */
export default function Server(config = {}) {

    config = Object.assign(defaults, config);

    // Makes sure all relevant nodes are accessible.
    const access$ = $
        .from([
            { type: 'routes file', path: config.routes },
            { type: 'handlers dir', path: config.handlers },
        ])
        .concatMap(({ type, path }) => $
            .fromAccess(path)
            .map((access) => {
                if (!access) {
                    const message = ['Expecting a %s in "%s"', type, path];
                    Thrower(message, 'ServerAccessError');
                }
                return true;
            }),
        )
        .toArray();

    const routes$ = $
        .fromPromise(import(config.routes))
        .concatMap(routes => Object
            .keys(routes)
            .reduce((result, key) => result.concat({
                method: key.split(':')[0].toUpperCase(),
                url: key.split(':')[1],
                name: routes[key],
            }), []),
        )
        .mergeMap((route) => {
            route.path = PATH.join(config.handlers, `${route.name}.js`);
            return $
                .fromAccess(route.path)
                .map((access) => {
                    if (!access) {
                        const message = [
                            'The handler %s does not exist on "%s"',
                            route.name,
                            route.path,
                        ];
                        Thrower(message, 'ServerHandlerAccessError');
                    }
                    return route;
                });
        })
        .mergeMap(route => $
            .fromPromise(import(route.path))
            .map((imported) => {
                route.module = imported.default;
                log.debug('Route added.', route);
                return route;
            }),
        )
        .toArray();

    const server$ = $.of(HTTP.createServer()).share();

    const listen$ = server$.switchMap(server => $.create((observer) => {
        const port = process.env.PORT ? process.env.PORT : config.port;
        const host = process.env.HOST ? process.env.HOST : config.host;
        server.listen(port, host, () => {
            log.info('Listening on %s:%s', host, port);
            observer.next({ type: 'listen' });
            observer.complete();
        });
    }));

    const request$ = $
        .combineLatest(server$, routes$)
        // switch to an observable containing all the requests made to the server.
        .mergeMap(([server, routes]) => $.create(observer =>
            server.on('request', (request, response) => {
                const url = PARSE(request.url, true);
                request.url = url.pathname;
                request.query = url.query;
                // make sure we have all the data before triggering.
                let body = '';
                request.on('data', (chunk) => { body += chunk; });
                request.on('end', () => {
                    log.info('request: [%s] %s', request.method, request.url);
                    request.body = body;
                    const handler = routes
                        .filter(route => route.method === request.method)
                        .filter(route => route.url === request.url)
                        .reduce((acc, cur) => cur.module, null) || config.handler404;
                    observer.next({ server, handler, request, response });
                });
            }),
        ))
        // Call the corresponding handler (making sure an observable is being returned)
        .mergeMap(({ server, handler, request, response }) => {
            let handler$;
            try {
                handler$ = handler.call({ $, server }, request, response);
            } catch (err) {
                Thrower(err, 'ServerHandlerError');
            }
            if (!(handler$ instanceof $)) {
                Thrower([
                    'Handler "%s" should return an Observable, got "%s"',
                    handler.name,
                    handler && handler$.constructor,
                ], 'ServerHandlerReturnError');
            }
            return handler$.map(returned => ({
                ...returned,
                type: 'request',
                request,
                response,
                server,
            }));
        })
        .do(({ status, request }) => {
            log.info('response: %s [%s] %s', status, request.method, request.url);
        });

    const return$ = access$
        .switchMapTo($.merge(listen$, request$));

    if (!config.subscription) return return$;

    return return$.subscribe(
        config.onNext,
        config.onError,
    );
}
