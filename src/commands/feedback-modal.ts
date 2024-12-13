import { commandModule, CommandType } from '@sern/handler';
import { EmbedBuilder } from 'discord.js';

export default commandModule({
  type: CommandType.Modal,
  async execute(modal) {
    try {
      const value = modal.fields.getTextInputValue('message');
      const feedbackChannel = await modal.client.channels.fetch(process.env.FEEDBACK_CHANNEL_ID);
      const embed = new EmbedBuilder({
        description: value,
        color: 0x00ff00,
      });
      feedbackChannel!.isSendable() &&
        (await feedbackChannel.send({
          content: `Feedback from ${modal.user.username}`,
          embeds: [embed],
        }));
      modal.reply({ ephemeral: true, content: 'Sent! Thanks for the feedback!' });
    } catch (error) {
      console.error(error);
      modal.reply({ ephemeral: true, content: 'An error occurred while sending your feedback. Please try again later.' });
    }
  },
});
