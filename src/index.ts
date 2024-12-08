import 'dotenv/config';
import * as config from './config.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { Sern, makeDependencies } from '@sern/handler';
import { Publisher } from '@sern/publisher';
import { db } from './db/index.js';
import { kv } from './db/kv.js';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

/**
 * Where all of your dependencies are composed.
 * '@sern/client' is usually your Discord Client.
 * Use this function to access all of your dependencies.
 * This is used for external event modules as well
 */
await makeDependencies(({ add }) => {
  add('@sern/client', client);
  add('publisher', (deps) => new Publisher(deps['@sern/modules'], deps['@sern/emitter'], deps['@sern/logger']!));
  add('drizzle', db);
  add('cache', kv);
});

//View docs for all options
Sern.init(config);

await client.login();
