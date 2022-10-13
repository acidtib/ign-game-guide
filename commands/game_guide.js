require('dotenv').config();
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('game-guide')
    .setDescription('Search IGN Wiki Guides and Step-by-Step Walkthroughs')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('Name of the game to search')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('objective')
        .setDescription('Stuck on a mission?')),
  async execute(interaction) {
    const gameValue = interaction.options.getString('game');
    const objectiveValue = interaction.options.getString('objective');

    const searchTerm = [gameValue, objectiveValue].filter(Boolean).join(' ');

    if (process.env.NODE_ENV == 'development') {
      console.dir(searchTerm, { depth: null });
      console.log('////////////////////////////');
    }



  },
};