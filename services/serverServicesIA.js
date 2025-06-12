

import axios from "axios";

const GEMINI_API_KEY = "AIzaSyBwX_CAXvq9_sF-RlZEn_2k7lEpGN8BAkY";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;



// Função para pausar a execução
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateReport = async (
  caseData,
  victims,
  peritos,
  retries = 3,
  delay = 5000
) => {
  try {
    // Montar prompt
    let promptText = `Gere um laudo pericial preliminar conciso e bem estruturado em formato Markdown para o seguinte caso. Inclua todas as informações fornecidas de forma clara e organizada, com seções para cada item. Estruture o laudo com um título, introdução, análise, conclusão e sugestões de investigação. Retorne apenas o texto em Markdown, sem qualquer outro formato (como JSON ou código).

**ID do Caso**: ${caseData.id}
**Título**: ${caseData.title || "Não especificado"}
**Tipo de Caso**: ${caseData.classification || "Não especificado"}
**Tipo de Evidência**: ${caseData.classification || "Não especificado"} (ex.: Ante Mortem, Post Mortem)
**Data do Fato**: ${caseData.date_fact || caseData.dateFact || "Não informada"}
**Descrição**: ${caseData.description || "Sem descrição"}
**Perito Responsável**: ${
      peritos.find((p) => p.id === caseData.managerId)?.name || "Não informado"
    }
**Assistente/Solicitante**: ${
      caseData.solicitant || caseData.solicitante || "Não informado"
    }
**Status**: ${caseData.statusCase || "Não informado"}

`;

    if (victims.length > 0) {
      promptText += `**Vítimas**:\n`;
      victims.forEach((v) => {
        promptText += `- Nome: ${v.name || "Desconhecido"}, ID: ${
          v.id
        }, Gênero: ${v.gender || "Não informado"}\n`;
      });
      promptText += `\n`;
    }

    const content = JSON.parse(caseData.content || "{}");
    if (content.requestedExams?.length > 0) {
      promptText += `**Exames Solicitados**:\n`;
      content.requestedExams.forEach((exam) => {
        promptText += `- ${exam.exam} (Solicitado em: ${new Date(
          exam.date
        ).toLocaleDateString("pt-BR")})\n`;
      });
      promptText += `\n`;
    }

    if (caseData.fileName) {
      promptText += `**Anexos**:\n- ${caseData.fileName}\n\n`;
    }

    promptText += `Estruture o laudo em Markdown com as seguintes seções:
- **Título**: Um título claro e objetivo (ex.: "Laudo Pericial - Caso [ID]").
- **Introdução**: Apresente o caso e o objetivo do laudo.
- **Análise**: Analise os dados fornecidos (tipo de caso, evidências, vítimas, exames, etc.).
- **Conclusão**: Resuma os achados.
- **Sugestões de Investigação**: Sugira próximas etapas ou exames adicionais.

Retorne apenas o texto em Markdown, sem delimitadores de código (como \`\`\`) ou qualquer outro formato.`;

    console.log("Enviando prompt para Gemini:", promptText);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(GEMINI_API_URL, {
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        });

        console.log("Resposta bruta da API:", JSON.stringify(response.data, null, 2));

        if (
          response.data.candidates &&
          response.data.candidates.length > 0 &&
          response.data.candidates[0].content &&
          response.data.candidates[0].content.parts &&
          response.data.candidates[0].content.parts.length > 0
        ) {
          const result = response.data.candidates[0].content.parts[0].text;
          return {
            title: `Laudo Pericial - Caso ${caseData.id}`,
            content: result.trim(),
          };
        } else {
          throw new Error("Resposta da Gemini não contém o conteúdo esperado.");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status === 429 &&
          attempt < retries
        ) {
          console.warn(
            `Erro 429 na tentativa ${attempt}. Aguardando ${delay}ms antes de tentar novamente.`
          );
          await sleep(delay);
          delay *= 2; // Backoff exponencial
          continue;
        }
        throw error;
      }
    }

    throw new Error("Número máximo de tentativas atingido para erro 429.");
  } catch (error) {
    console.error("Erro ao gerar laudo:", error.message);
    if (error.response && error.response.status === 429) {
      throw new Error(
        "Limite de requisições excedido. Tente novamente mais tarde."
      );
    }
    if (error.response && error.response.status === 401) {
      throw new Error(
        "Chave de API inválida. Verifique a chave no Google Cloud Console."
      );
    }
    throw new Error(error.message || "Erro ao gerar laudo.");
  }
};