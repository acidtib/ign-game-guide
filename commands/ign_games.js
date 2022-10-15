const axios = require('axios');
require('dotenv').config();
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ign-games')
    .setDescription('Search IGN Games')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('Name of the game to search')
        .setRequired(true)),
  async execute(interaction) {
    const searchTerm = interaction.options.getString('game');

    if (process.env.NODE_ENV == 'development') {
      console.log('///search-term');
      console.dir(searchTerm, { depth: null });
    }

    gameSearch(searchTerm)
      .then(function(response) {

        if (process.env.NODE_ENV == 'development') {
          console.log('///response');
          console.dir(response.data, { depth: null });
        }

        const searchResult = response.data.data[0];

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Open Game')
              .setStyle(ButtonStyle.Link)
              .setURL(searchResult.url),
          );

        const embed = new EmbedBuilder()
          .setColor(0x0f6fec)
          .setTitle(searchResult.title)
          .setURL(searchResult.url)
          .setDescription(searchResult.url);

        return interaction.reply({ content: `Result for: \`${searchTerm}\``, ephemeral: true, embeds: [embed], components: [row] });
      }).catch(function(error) {
        if (process.env.NODE_ENV == 'development') {
          console.log('///error');
          console.dir(error, { depth: null });
        }
        return interaction.reply({ content: 'We had an issue finding your search :(', ephemeral: true });
      });

  },
};

function gameSearch(query) {
  return axios.get(`${process.env.API_HOST}/api/v1/search/game`, { params: { q: query } });
}