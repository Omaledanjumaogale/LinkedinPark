import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { generateHandler, healthHandler } from './ai';
import { adminLoginHandler, adminSessionHandler } from './admin';
import { registerInstanceHandler } from './ecosystem';
import { oauthExchangeHandler } from './oauth';

const pingHandler = httpAction(async () =>
	new Response(
		JSON.stringify({ service: 'linkinpark', status: 'ok', time: new Date().toISOString() }),
		{
			status: 200,
			headers: {
				'content-type': 'application/json',
				'access-control-allow-origin': '*',
				'access-control-allow-methods': 'GET, POST, OPTIONS',
				'access-control-allow-headers': 'content-type, authorization'
			}
		}
	)
);

const http = httpRouter();

http.route({ path: '/api/ping', method: 'GET', handler: pingHandler });
http.route({ path: '/api/ai/health', method: 'GET', handler: healthHandler });
http.route({ path: '/api/ai/generate', method: 'POST', handler: generateHandler });
http.route({ path: '/api/ai/generate', method: 'OPTIONS', handler: generateHandler });
http.route({ path: '/api/admin/login', method: 'POST', handler: adminLoginHandler });
http.route({ path: '/api/admin/session', method: 'GET', handler: adminSessionHandler });
http.route({ path: '/api/admin/session', method: 'OPTIONS', handler: adminSessionHandler });
http.route({ path: '/api/ecosystem/register', method: 'POST', handler: registerInstanceHandler });
http.route({ path: '/api/ecosystem/register', method: 'OPTIONS', handler: registerInstanceHandler });
http.route({ path: '/api/oauth/exchange', method: 'POST', handler: oauthExchangeHandler });
http.route({ path: '/api/oauth/exchange', method: 'OPTIONS', handler: oauthExchangeHandler });

export default http;
