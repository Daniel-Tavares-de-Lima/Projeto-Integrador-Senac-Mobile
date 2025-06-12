


// import AsyncStorage from '@react-native-async-storage/async-storage';

// export async function fetchEvidences(token) {
//   try {
//     if (!token) {
//       throw new Error('Usuário não autenticado.');
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
//       type: item.contentType,
//       dateCollection: item.dateCollection,
//       caseId: item.caseId,
//       status: item.status,
//       collectedById: item.collectedById,
//       imageURL: item.imageContent?.imageURL || null,
//       content: item.textContent || '{}',
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
//   imageBase64,
//   latitude,
//   longitude,
//   nome,
//   tipoExames
// ) {
//   try {
//     if (!token) {
//       throw new Error('Usuário não autenticado.');
//     }

//     const content = JSON.stringify({
//       latitude: latitude || null,
//       longitude: longitude || null,
//       nome: nome || null,
//       tipoExames: tipoExames || null,
//     });

//     const body = {
//       contentType: type,
//       dateCollection,
//       caseId,
//       textContent: content,
//     };

//     if (type === 'image' && imageBase64) {
//       body.imageContent = { base64: imageBase64 };
//     }

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
//       throw new Error(data.message || 'Erro ao criar evidência');
//     }

//     return {
//       id: data.id,
//       type: data.contentType,
//       dateCollection: data.dateCollection,
//       caseId: data.caseId,
//       status: data.status,
//       imageURL: data.imageContent?.imageURL || null,
//       content: data.textContent || '{}',
//     };
//   } catch (error) {
//     throw new Error(error.message || 'Erro na requisição');
//   }
// }

// export async function updateEvidence(
//   token,
//   id,
//   type,
//   dateCollection,
//   caseId,
//   imageBase64,
//   latitude,
//   longitude,
//   nome,
//   tipoExames
// ) {
//   try {
//     if (!token) {
//       throw new Error('Usuário não autenticado.');
//     }

//     const content = JSON.stringify({
//       latitude: latitude || null,
//       longitude: longitude || null,
//       nome: nome || null,
//       tipoExames: tipoExames || null,
//     });

//     const body = {
//       contentType: type,
//       dateCollection,
//       caseId,
//       textContent: content,
//     };

//     if (type === 'image' && imageBase64) {
//       body.imageContent = { base64: imageBase64 };
//     }

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
//       throw new Error(data.message || 'Erro ao atualizar evidência');
//     }

//     return data;
//   } catch (error) {
//     throw new Error(error.message || 'Erro na requisição');
//   }
// }

// export async function deleteEvidence(token, id) {
//   try {
//     if (!token) {
//       throw new Error('Usuário não autenticado.');
//     }

//     const response = await fetch(`https://pi3p.onrender.com/evidences/${id}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.message || 'Erro ao desativar evidência');
//     }
//     return data;
//   } catch (error) {
//     throw new Error(error.message || 'Erro na requisição');
//   }
// }

// export async function fetchCases(token) {
//   try {
//     if (!token) {
//       throw new Error('Usuário não autenticado.');
//     }
//     const response = await fetch('https://pi3p.onrender.com/cases', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.message || 'Erro ao buscar casos');
//     }
//     return data;
//   } catch (error) {
//     throw new Error(error.message || 'Erro na requisição');
//   }
// }

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchEvidences(token) {
  try {
    if (!token) {
      throw new Error('Usuário não autenticado.');
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

    return data.map((item) => ({
      id: item.id,
      type: item.type, // Alterado de contentType para type
      dateCollection: item.dateCollection,
      caseId: item.caseId,
      status: item.status,
      collectedById: item.collectedById,
      imageURL: item.imageEvidence?.imageURL || null,
      content: item.textEvidence || '{}',
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
  tipoExames
) {
  try {
    if (!token) {
      throw new Error('Usuário não autenticado.');
    }

    const content = JSON.stringify({
      latitude: latitude || null,
      longitude: longitude || null,
      nome: nome || null,
      tipoExames: tipoExames || null,
    });

    const body = {
      type: type.toUpperCase(), // Garante que type seja TEXT ou IMAGE
      dateCollection,
      caseId,
      content,
    };

    if (type.toUpperCase() === 'IMAGE' && imageBase64) {
      body.imageEvidence = { base64: imageBase64 }; // Ajustado para imageEvidence
    }

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
      throw new Error(data.message || 'Erro ao criar evidência');
    }

    return {
      id: data.id,
      type: data.type,
      dateCollection: data.dateCollection,
      caseId: data.caseId,
      status: data.status,
      imageURL: data.imageEvidence?.imageURL || null,
      content: data.content || '{}',
    };
  } catch (error) {
    console.error('Erro em createEvidence:', error);
    throw new Error(error.message || 'Erro na requisição');
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
  tipoExames
) {
  try {
    if (!token) {
      throw new Error('Usuário não autenticado.');
    }

    const content = JSON.stringify({
      latitude: latitude || null,
      longitude: longitude || null,
      nome: nome || null,
      tipoExames: tipoExames || null,
    });

    const body = {
      type: type.toUpperCase(), // Garante que type seja TEXT ou IMAGE
      dateCollection,
      caseId,
      content,
    };

    if (type.toUpperCase() === 'IMAGE' && imageBase64) {
      body.imageEvidence = { base64: imageBase64 }; // Ajustado para imageEvidence
    }

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
      throw new Error(data.message || 'Erro ao atualizar evidência');
    }

    return data;
  } catch (error) {
    console.error('Erro em updateEvidence:', error);
    throw new Error(error.message || 'Erro na requisição');
  }
}

export async function deleteEvidence(token, id) {
  try {
    if (!token) {
      throw new Error('Usuário não autenticado.');
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

export async function fetchCases(token) {
  try {
    if (!token) {
      throw new Error('Usuário não autenticado.');
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