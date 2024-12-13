import { commandModule, CommandType } from '@sern/handler';
import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default commandModule({
  type: CommandType.Slash,
  plugins: [],
  description: 'Feedback always welcome!',
  options: [],
  execute: async (ctx) => {
    const modal = new ModalBuilder()
      .setCustomId('feedback-modal')
      .setTitle('ezbd Feedback');

    const messageInput = new TextInputBuilder()
      .setCustomId('message')
      .setLabel('anything to fix? add?')
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(messageInput);
    modal.addComponents(firstActionRow);

    await ctx.interaction.showModal(modal);
  },
});
