import AsyncStorage from '@react-native-async-storage/async-storage';


export async function fetchEvidences() {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const response = await fetch('https://pi3p.onrender.com/evidences', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar evidências');
    }

    console.log('Evidências recebidas:', JSON.stringify(data, null, 2));

    return data.map((item) => ({
      id: item.id,
      type: item.type,
      dateCollection: item.dateCollection,
      caseId: item.caseId,
      status: item.status,
      collectedById: item.collectedById,
      imageURL: item.imageEvidence ? item.imageEvidence.imageURL : null,
      content: item.textEvidence ? item.textEvidence.content : null,
    }));
  } catch (error) {
    throw new Error(error.message || 'Erro na requisição');
  }
}


export async function createEvidence(
  type,
  dateCollection,
  caseId,
  imageURL,
  latitude,
  longitude,
  nome,
  tipoExames
) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // Montar o conteúdo com geolocalização, nome e tipo de exames
    const content =
      type === 'TEXT' && (latitude || longitude || nome || tipoExames)
        ? JSON.stringify({
            latitude: latitude || null,
            longitude: longitude || null,
            nome: nome || null,
            tipoExames: tipoExames || null,
          })
        : undefined;

    const response = await fetch('https://pi3p.onrender.com/evidences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        dateCollection,
        caseId,
        imageURL: type === 'IMAGE' ? imageURL : undefined,
        content,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar evidência');
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro na requisição');
  }
}

export async function updateEvidence(
  id,
  type,
  dateCollection,
  caseId,
  imageURL,
  latitude,
  longitude,
  nome,
  tipoExames
) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const content =
      type === 'TEXT' && (latitude || longitude || nome || tipoExames)
        ? JSON.stringify({
            latitude: latitude || null,
            longitude: longitude || null,
            nome: nome || null,
            tipoExames: tipoExames || null,
          })
        : undefined;

    const body = {
      type,
      dateCollection,
      caseId,
      imageURL: type === 'IMAGE' ? imageURL : undefined,
      content,
    };

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
      throw new Error(data.message || 'Erro ao atualizar evidência');
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro na requisição');
  }
}

export async function deleteEvidence(id) {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const response = await fetch(`https://pi3p.onrender.com/evidences/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao desativar evidência');
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro na requisição');
  }
}

// export async function fetchEvidences() {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       throw new Error('Usuário não autenticado. Faça login novamente.');
//     }

//     const response = await fetch('https://pi3p.onrender.com/evidences', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.message || 'Erro ao buscar evidências');
//     }

//     return data.map((item) => ({
//       id: item.id,
//       type: item.type,
//       dateCollection: item.dateCollection,
//       caseId: item.caseId,
//       status: item.status,
//       collectedById: item.collectedById,
//       imageURL: item.imageEvidence ? item.imageEvidence.imageURL : null,
//       content: item.textEvidence ? item.textEvidence.content : null,
//     }));
//   } catch (error) {
//     throw new Error(error.message || 'Erro na requisição');
//   }
// }

export async function fetchCases() {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }
    const response = await fetch('https://pi3p.onrender.com/cases', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar casos');
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'Erro na requisição');
  }
}