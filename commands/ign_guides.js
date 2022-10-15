const axios = require('axios');
require('dotenv').config();
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ign-guides')
    .setDescription('Search IGN Guides and Step-by-Step Walkthroughs')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('Name of the game to search')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('keyword')
        .setDescription('Stuck on a mission or objective?')),
  async execute(interaction) {
    const gameValue = interaction.options.getString('game');
    const objectiveValue = interaction.options.getString('keyword');

    const searchTerm = [gameValue, objectiveValue].filter(Boolean).join(' ');

    if (process.env.NODE_ENV == 'development') {
      console.log('///search-term');
      console.dir(searchTerm, { depth: null });
    }

    wikiSearch(searchTerm)
      .then(function(response) {

        if (process.env.NODE_ENV == 'development') {
          console.log('///response');
          console.dir(response.data, { depth: null });
        }

        const searchResult = response.data.data[0];

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Open Guide')
              .setStyle(ButtonStyle.Link)
              .setURL(searchResult.url),
          );

        const embed = new EmbedBuilder()
          .setColor(0x0f6fec)
          .setTitle(searchResult.title)
          .setURL(searchResult.url)
          .setDescription(searchResult.url);

        return interaction.reply({ content: `Result for: \`${[gameValue, objectiveValue].filter(Boolean).join(', ')}\``, ephemeral: true, embeds: [embed], components: [row] });
      }).catch(function(error) {
        if (process.env.NODE_ENV == 'development') {
          console.log('///error');
          console.dir(error, { depth: null });
        }
        return interaction.reply({ content: 'We had an issue finding your search :(', ephemeral: true });
      });

  },
};

function wikiSearch(query) {
  return axios.get(`${process.env.API_HOST}/api/v1/search/wiki`, { params: { q: query } });
}