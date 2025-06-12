

// import AsyncStorage from '@react-native-async-storage/async-storage';

// export async function fetchEvidences(token) {
//   try {
//     if (!token) throw new Error('Usuário não autenticado.');

//     const response = await fetch('https://pi3p.onrender.com/evidences', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || 'Erro ao buscar evidências');

//     return data.map((item) => ({
//       id: item.id,
//       type: item.type,
//       dateCollection: item.dateCollection,
//       caseId: item.caseId,
//       status: item.status,
//       collectedById: item.collectedById,
//       imageURL: item.imageURL || null,
//       content: item.content || '{}',
//     }));
//   } catch (error) {
//     throw new Error(error.message || 'Erro na requisição');
//   }
// }

// export async function createEvidence(
//   token,
//   type,
//   dateCollection,
//   caseId,
//   imageBase64, // Ignorado, mas mantido para compatibilidade
//   latitude,
//   longitude,
//   nome,
//   tipoExames
// ) {
//   try {
//     if (!token) throw new Error('Usuário não autenticado.');

//     const content = JSON.stringify({
//       latitude: latitude || null,
//       longitude: longitude || null,
//       nome: nome || null,
//       tipoExames: tipoExames || null,
//     });

//     const body = {
//       type: 'TEXT', // Sempre TEXT para evitar problemas com imagens
//       dateCollection,
//       caseId,
//       content,
//       imageURL: null, // Sem imagem
//     };

//     console.log('Corpo da requisição para createEvidence:', JSON.stringify(body, null, 2));

//     const response = await fetch('https://pi3p.onrender.com/evidences', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       console.error('Erro do backend:', data);
//       throw new Error(data.message || 'Erro ao criar evidência');
//     }

//     return {
//       id: data.id,
//       type: data.type,
//       dateCollection: data.dateCollection,
//       caseId: data.caseId,
//       status: data.status,
//       imageURL: data.imageURL || null,
//       content: data.content || '{}',
//     };
//   } catch (error) {
//     console.error('Erro em createEvidence:', error);
//     throw error;
//   }
// }

// export async function updateEvidence(
//   token,
//   id,
//   type,
//   dateCollection,
//   caseId,
//   imageBase64, // Ignorado
//   latitude,
//   longitude,
//   nome,
//   tipoExames
// ) {
//   try {
//     if (!token) throw new Error('Usuário não autenticado.');

//     const content = JSON.stringify({
//       latitude: latitude || null,
//       longitude: longitude || null,
//       nome: nome || null,
//       tipoExames: tipoExames || null,
//     });

//     const body = {
//       type: 'TEXT',
//       dateCollection,
//       caseId,
//       content,
//       imageURL: null,
//     };

//     console.log('Corpo da requisição para updateEvidence:', JSON.stringify(body, null, 2));

//     const response = await fetch(`https://pi3p.onrender.com/evidences/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       console.error('Erro do backend:', data);
//       throw new Error(data.message || 'Erro ao atualizar evidência');
//     }

//     return data;
//   } catch (error) {
//     console.error('Erro em updateEvidence:', error);
//     throw error;
//   }
// }

// export async function deleteEvidence(token, id) {
//   try {
//     if (!token) throw new Error('Usuário não autenticado.');

//     const response = await fetch(`https://pi3p.onrender.com/evidences/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || 'Erro ao desativar evidência');
//     return data;
//   } catch (error) {
//     throw new Error(error.message || 'Erro na requisição');
//   }
// }

// export async function fetchCases(token) {
//   try {
//     if (!token) throw new Error('Usuário não autenticado.');
//     const response = await fetch('https://pi3p.onrender.com/cases', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || 'Erro ao buscar casos');
//     return data;
//   } catch (error) {
//     throw new Error(error.message || 'Erro na requisição');
//   }
// }

import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para validar UUID
function isUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof str === 'string' && uuidRegex.test(str);
}

export async function fetchEvidences(token) {
  try {
    if (!token) throw new Error('Usuário não autenticado.');

    const response = await fetch('https://pi3p.onrender.com/evidences', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar evidências');

    return data.map((item) => ({
      id: item.id,
      type: item.type,
      dateCollection: item.dateCollection,
      caseId: item.caseId,
      status: item.status,
      collectedById: item.collectedById,
      imageURL: item.imageURL || null,
      content: item.content || '{}',
    }));
  } catch (error) {
    throw new Error(error.message || 'Erro na requisição');
  }
}

export async function createEvidence(
  token,
  type,
  dateCollection,
  caseId,
  imageBase64,
  latitude,
  longitude,
  nome,
  tipoExames,
  descriptionVisual
) {
  try {
    if (!token) throw new Error('Usuário não autenticado.');
    if (!isUUID(caseId)) throw new Error('caseId deve ser um UUID válido.');

    const content = JSON.stringify({
      latitude: latitude || null,
      longitude: longitude || null,
      nome: nome || null,
      tipoExames: tipoExames || null,
      descriptionVisual: descriptionVisual || null,
    });

    const body = {
      type: 'TEXT',
      dateCollection,
      caseId,
      content,
      imageURL: null,
    };

    console.log('Corpo da requisição para createEvidence:', JSON.stringify(body, null, 2));

    const response = await fetch('https://pi3p.onrender.com/evidences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Erro do backend:', data);
      throw new Error(data.message || 'Erro ao criar evidência');
    }

    return {
      id: data.id,
      type: data.type,
      dateCollection: data.dateCollection,
      caseId: data.caseId,
      status: data.status,
      imageURL: data.imageURL || null,
      content: data.content || '{}',
    };
  } catch (error) {
    console.error('Erro em createEvidence:', error);
    throw error;
  }
}

export async function updateEvidence(
  token,
  id,
  type,
  dateCollection,
  caseId,
  imageBase64,
  latitude,
  longitude,
  nome,
  tipoExames,
  descriptionVisual
) {
  try {
    if (!token) throw new Error('Usuário não autenticado.');
    if (!isUUID(caseId)) throw new Error('caseId deve ser um UUID válido.');

    const content = JSON.stringify({
      latitude: latitude || null,
      longitude: longitude || null,
      nome: nome || null,
      tipoExames: tipoExames || null,
      descriptionVisual: descriptionVisual || null,
    });

    const body = {
      type: 'TEXT',
      dateCollection,
      caseId,
      content,
      imageURL: null,
    };

    console.log('Corpo da requisição para updateEvidence:', JSON.stringify(body, null, 2));

    const response = await fetch(`https://pi3p.onrender.com/evidences/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Erro do backend:', data);
      throw new Error(data.message || 'Erro ao atualizar evidência');
    }

    return data;
  } catch (error) {
    console.error('Erro em updateEvidence:', error);
    throw error;
  }
}

export async function deleteEvidence(token, id) {
  try {
    if (!token) throw new Error('Usuário não autenticado.');

    const response = await fetch(`https://pi3p.onrender.com/evidences/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao desativar evidência');
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro na requisição');
  }
}

export async function fetchCases(token) {
  try {
    if (!token) throw new Error('Usuário não autenticado.');
    const response = await fetch('https://pi3p.onrender.com/cases', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao buscar casos');
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro na requisição');
  }
}
