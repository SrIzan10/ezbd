import { scheduledTask } from '@sern/handler';
import { birthdayTable } from '../db/schema';
import currentDate from '../util/currentDate';
import { eq } from 'drizzle-orm';

// TODO: optimize
export default scheduledTask({
  // on production, run every 2 hours
  // on development, run every minute
  trigger: process.env.NODE_ENV === 'production' ? '0 */2 * * *' : '* * * * *',
  async execute(ctx, sdt) {
    const client = sdt.deps['@sern/client'];
    const db = sdt.deps['drizzle'];
    const kv = sdt.deps['cache'];
    const getAllSent = await kv.getKeys(`sent`);
    for (const sent of getAllSent) {
      const get = (await kv.get(sent))?.toString();
      if (get !== currentDate()) {
        await kv.del(sent);
      }
    }

    const bdList = await db.select().from(birthdayTable).where(eq(birthdayTable.date, currentDate()));
    for (const bd of bdList) {
      const kvKey = `sent:${bd.authorId}:${bd.userId}`;
      if (await kv.hasItem(kvKey)) continue;

      const author = await client.users.fetch(bd.authorId);
      const user = await client.users.fetch(bd.userId);

      await kv.set(`sent:${bd.authorId}:${bd.userId}`, currentDate());
      await author.send(`Today is ${user.username}'s birthday! (<@${user.id}>)`);
    }
  },
});
