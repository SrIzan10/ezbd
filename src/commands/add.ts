import { commandModule, CommandType } from '@sern/handler';
import { publishConfig } from '@sern/publisher';
import { ApplicationCommandOptionType } from 'discord.js';
import { birthdayTable } from '../db/schema';
import getDates from '../util/getDates';
import { and, eq } from 'drizzle-orm';

export default commandModule({
  type: CommandType.Slash,
  plugins: [
    publishConfig({
      contexts: [0, 1, 2],
      integrationTypes: ['Guild', 'User'],
    }),
  ],
  description: 'Add a user to your database',
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      description: 'The user you want to add',
      required: true,
    },
    {
      name: 'birthday',
      type: ApplicationCommandOptionType.String,
      description: 'Day and month',
      required: true,
      autocomplete: true,
      command: {
        onEvent: [],
        execute: async (ctx) => {
          const autocomplete = ctx.options.getFocused();
          const choices = getDates()
            .filter((d) => d.startsWith(autocomplete))
            .slice(0, 25);
          ctx.respond(choices.map((c) => ({ name: c, value: c })));
        },
      },
    },
  ],
  //alias : [],
  execute: async (ctx, args) => {
    try {
      const db = args.deps['drizzle'];
      const user = ctx.interaction.options.getUser('user', true);
      const birthday = ctx.interaction.options.getString('birthday', true);

      if (!getDates().includes(birthday)) {
        ctx.reply({ content: 'Invalid date. Please choose a correct one from the autocomplete!', ephemeral: true });
        return;
      }
      if (
        (
          await db
            .select()
            .from(birthdayTable)
            .where(and(eq(birthdayTable.authorId, ctx.userId), eq(birthdayTable.userId, user.id)))
        ).length > 0
      ) {
        return ctx.reply({ content: 'User already exists!', ephemeral: true });
      }

      await db.insert(birthdayTable).values({ authorId: ctx.userId, userId: user.id, date: birthday }).execute();
      ctx.reply({ content: `Added ${user.username} to the database. Date will be ${birthday}`, ephemeral: true });
    } catch (e) {
      console.error(e);
    }
  },
});
