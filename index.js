require('dotenv').config();
const { 
  Client, GatewayIntentBits, 
  ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Os teus IDs reais do servidor
const CARGOS = {
  vermelho:       '1511062379272601690',
  verde:          '1511347846505431040',
  azul:           '1511099654668943380',
  azulclaro:      '1511062656457642014',
  roxoclaro:      '1511346465618923661',
  verde_limao:    '1511346465618923661',
  verde_claro:    '1511346465618923661',
  alice_blue:     '1511349569215139910',
  purpua:         '1511349749322874900',
  fantasma_lilas: '1511349954776662197'
};

client.once('ready', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

// Envia o painel limpo com o ícone "ღ" em cada cor
client.on('messageCreate', async (msg) => {
  if (msg.content === '!painel') {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('selecionar_cor')
      .setPlaceholder('👉 Escolha a sua cor favorita aqui...')
      .addOptions(
        new StringSelectMenuOptionBuilder().setValue('vermelho').setLabel('ღ Vermelho'),
        new StringSelectMenuOptionBuilder().setValue('verde').setLabel('ღ Verde'),
        new StringSelectMenuOptionBuilder().setValue('azul').setLabel('ღ Azul'),
        new StringSelectMenuOptionBuilder().setValue('azulclaro').setLabel('ღ Azul Claro'),
        new StringSelectMenuOptionBuilder().setValue('roxoclaro').setLabel('ღ Roxo Claro'),
        new StringSelectMenuOptionBuilder().setValue('verde_limao').setLabel('ღ Verde Limão'),
        new StringSelectMenuOptionBuilder().setValue('verde_claro').setLabel('ღ Verde Claro'),
        new StringSelectMenuOptionBuilder().setValue('alice_blue').setLabel('ღ Alice Blue'),
        new StringSelectMenuOptionBuilder().setValue('purpua').setLabel('ღ Púrpura'),
        new StringSelectMenuOptionBuilder().setValue('fantasma_lilas').setLabel('ღ Fantasma Lilás')
      );

    const row = new ActionRowBuilder().addComponents(menu);

    // Envia estritamente o menu, sem conteúdo de texto duplicado por cima
    await msg.channel.send({ components: [row] });
  }
});

// Processa a escolha do utilizador no menu
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== 'selecionar_cor') return;

  const cor = interaction.values[0];
  const cargoId = CARGOS[cor];
  if (!cargoId) return;

  const member = interaction.member;

  try {
    await interaction.deferReply({ ephemeral: true });

    // Remove as cores antigas da lista que o membro já tenha
    for (const id of Object.values(CARGOS)) {
      if (member.roles.cache.has(id)) {
        await member.roles.remove(id).catch(() => {});
      }
    }

    // Adiciona o novo cargo
    await member.roles.add(cargoId);
    
    const nomeFormatado = cor.replace('_', ' ');
    await interaction.editReply({ content: `✅ Cargo **${nomeFormatado}** adicionado com sucesso!` });

  } catch (error) {
    console.log("Erro ao dar cargo: Verifica a hierarquia no Discord.");
    await interaction.editReply({ 
      content: `❌ Não consegui alterar o teu cargo. Garante que o cargo do bot (**Ghost**) está no topo da lista de cargos do servidor!`
    }).catch(() => {});
  }
});

client.login(process.env.TOKEN);