import {Context} from 'koa';
import querystring from 'querystring';

import redirectionPage from './redirection-page';
import {Options} from './types';

export const SHOP_PARAM_MISSING = 'Expected a shop query parameter';

export default function createOAuthStart({
  scopes = [],
  apiKey,
  accessMode,
}: Options) {
  return function oAuthStart(ctx: Context) {
    const {query, host, path} = ctx;
    const {shop} = query;

    if (shop == null) {
      ctx.throw(400, 'Expected a shop query parameter');
      return;
    }

    /* eslint-disable camelcase */
    const redirectParams = {
      scope: scopes.join(' '),
      client_id: apiKey,
      redirect_uri: `https://${host}${path}/callback`,
    };
    /* eslint-enable camelcase */

    if (accessMode === 'online') {
      redirectParams['grant_options[]'] = 'per-user';
    }

    const formattedQueryString = querystring.stringify(redirectParams);
    const redirectTo = `https://${shop}/admin/oauth/authorize?${formattedQueryString}`;

    ctx.body = redirectionPage(redirectTo);
  };
}
