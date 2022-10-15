const axios = require('axios');
require('dotenv').config();
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ign-articles')
    .setDescription('Search IGN Articles')
    .addStringOption(option =>
      option.setName('search')
        .setDescription('Keywords or search term.')
        .setRequired(true)),
  async execute(interaction) {
    const searchTerm = interaction.options.getString('search');

    if (process.env.NODE_ENV == 'development') {
      console.log('///search-term');
      console.dir(searchTerm, { depth: null });
    }

    articleSearch(searchTerm)
      .then(function(response) {

        if (process.env.NODE_ENV == 'development') {
          console.log('///response');
          console.dir(response.data, { depth: null });
        }

        const searchResult = response.data.data[0];

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Open Article')
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

function articleSearch(query) {
  return axios.get(`${process.env.API_HOST}/api/v1/search/article`, { params: { q: query } });
}