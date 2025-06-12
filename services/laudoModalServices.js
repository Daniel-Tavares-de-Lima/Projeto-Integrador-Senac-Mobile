// import AsyncStorage from '@react-native-async-storage/async-storage';

// const GEMINI_API_KEY = "AIzaSyBwX_CAXvq9_sF-RlZEn_2k7lEpGN8BAkY";

// export const generateEvidenceReport = async (evidence, caseInfo) => {
//   try {
//     const token = await AsyncStorage.getItem('accessToken');
//     if (!token) {
//       throw new Error('Usuário não autenticado.');
//     }

//     const parseContent = (content) => {
//       try {
//         return JSON.parse(content || '{}');
//       } catch {
//         return {};
//       }
//     };

//     const contentData = parseContent(evidence.content);

//     const prompt = `
//       Você é um perito forense especializado. Gere um laudo pericial detalhado em português com base nas informações fornecidas. Estruture o laudo com as seções: **Introdução**, **Descrição da Evidência**, **Metodologia**, **Análise**, **Conclusões** e **Assinatura**. Use linguagem técnica e profissional.

//       **Informações da Evidência**:
//       - ID: ${evidence.id}
//       - Nome: ${contentData.nome || 'Não informado'}
//       - Tipo: ${evidence.type || 'Não informado'}
//       - Data de Coleta: ${new Date(evidence.dateCollection).toLocaleDateString('pt-BR')}
//       - Tipo de Exame: ${contentData.tipoExames || 'Não informado'}
//       - Caso ID: ${evidence.caseId || 'Não informado'}
//       - Localização: ${contentData.latitude && contentData.longitude
//         ? `Latitude ${contentData.latitude}, Longitude ${contentData.longitude}`
//         : 'Não informada'}
//       - Imagem: ${evidence.imageURL ? 'Imagem disponível' : 'Sem imagem'}

//       **Informações do Caso**:
//       - Título: ${caseInfo.title || 'Não informado'}
//       - Descrição: ${caseInfo.description || 'Não informado'}

//       Formate o laudo em Markdown com quebras de linha para legibilidade.
//     `;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: prompt }],
//             },
//           ],
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error?.message || 'Erro ao chamar a API do Gemini');
//     }

//     const result = await response.json();
//     const generatedText = result.candidates[0].content.parts[0].text;

//     await saveEvidenceReport(token, evidence.id, generatedText);

//     return { report: generatedText };
//   } catch (error) {
//     console.error('Erro ao gerar laudo:', error);
//     throw error;
//   }
// };

// export const saveEvidenceReport = async (token, evidenceId, reportContent) => {
//   try {
//     const response = await fetch('https://pi3p.onrender.com/reports', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         evidenceId,
//         content: reportContent,
//         title: `Laudo de Evidência ${evidenceId}`,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Erro ao salvar laudo');
//     }
//   } catch (error) {
//     console.error('Erro ao salvar laudo:', error);
//     throw error;
//   }
// };

import AsyncStorage from "@react-native-async-storage/async-storage";

// Configurações da API Groq
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 segundo (Groq é mais rápido)

// Validação de UUID (mantido igual)
function isValidUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

// Parse do conteúdo (mantido igual)
function parseContent(content) {
  try {
    return JSON.parse(content || "{}");
  } catch (error) {
    console.warn("Erro ao fazer parse do conteúdo:", error);
    return {
      nome: "Não informado",
      tipoExames: "Não informado",
      descriptionVisual: "Não informado"
    };
  }
}

// Geração do relatório com Groq
export async function generateEvidenceReport(evidence, caseInfo, retryCount = 0) {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) throw new Error("Usuário não autenticado.");

    if (!evidence?.caseId || !isValidUUID(evidence.caseId)) {
      throw new Error("caseId inválido para a evidência.");
    }

    const contentData = parseContent(evidence.content);

    const prompt = `
      Você é um perito forense especializado. Gere um laudo pericial detalhado em português para a evidência fornecida, semelhante a um relatório de caso. Estruture o laudo em Markdown com as seções: **Introdução**, **Descrição da Evidência**, **Metodologia**, **Análise**, **Conclusões** e **Assinatura**. Use linguagem técnica, objetiva e profissional.

      **Informações da Evidência**:
      - ID: ${evidence.id || "Não informado"}
      - Nome: ${contentData.nome || "Não informado"}
      - Tipo: ${evidence.type || "Não informado"}
      - Data de Coleta: ${
        evidence.dateCollection
          ? new Date(evidence.dateCollection).toLocaleDateString("pt-BR")
          : "Não informado"
      }
      - Tipo de Exame: ${contentData.tipoExames || "Não informado"}
      - Caso ID: ${evidence.caseId || "Não informado"}
      - Localização: ${
        contentData.latitude && contentData.longitude
          ? `Latitude ${contentData.latitude}, Longitude ${contentData.longitude}`
          : "Não informada"
      }
      - Descrição Visual: ${contentData.descriptionVisual || "Não informado"}

      **Informações do Caso**:
      - Título: ${caseInfo.title || "Não informado"}
      - Descrição: ${caseInfo.description || "Não informado"}
    `;

    console.log('Enviando prompt para a API Groq...');

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.3, // Mais determinístico
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (retryCount < MAX_RETRIES) {
        console.warn(`Erro detectado. Tentando novamente (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return generateEvidenceReport(evidence, caseInfo, retryCount + 1);
      }
      
      throw new Error(errorData.error?.message || "Erro ao chamar a API Groq");
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content;
    
    if (!generatedText) {
      throw new Error("Resposta da API Groq em formato inesperado");
    }

        console.warn('RESPONSE', generatedText)

    await saveEvidenceReport(token, evidence.caseId, generatedText);
    return { report: generatedText };

  } catch (error) {
    console.error(`Erro ao gerar laudo:`, error);
    throw error;
  }
}

// Função saveEvidenceReport permanece igual
async function saveEvidenceReport(token, caseId, reportContent) {
  try {
    if (!caseId || !isValidUUID(caseId)) {
      throw new Error("caseId inválido para o relatório.");
    }

    console.warn('CASEID', caseId)

    const response = await fetch("https://pi3p.onrender.com/reports", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseId,
        title: `Relatório do Caso ${caseId}`,
        content: reportContent,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro ao salvar laudo");
    
    return data;
  } catch (error) {
    console.error("Erro ao salvar laudo:", error);
    throw error;
  }
}