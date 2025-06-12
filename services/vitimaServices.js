



import AsyncStorage from '@react-native-async-storage/async-storage';

export async function createVictim(nic, name, gender, birthDate, document, address, ethnicity, odontogram, anatomicalNotes, caseId) {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const response = await fetch('https://pi3p.onrender.com/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        sex: gender === 'Masculino' ? 'M' : 'F',
        birthDate: birthDate || null,
        document,
        address,
        ethnicity,
        anatomicalNotes,
        caseId,
        identified: 'YES',
        status: 'ATIVADO',
        odontogramEntries: odontogram ? [{ toothNumber: 1, note: odontogram }] : [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Falha ao criar vítima`);
    }

    const data = await response.json();
    console.log('Vítima criada:', data);
    return data;
  } catch (error) {
    console.error('Erro em createVictim:', error.message);
    throw error;
  }
}

export async function updateVictim(id, nic, name, gender, birthDate, document, address, ethnicity, odontogram, anatomicalNotes, caseId) {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const body = {};
    if (name) body.name = name;
    if (gender) body.sex = gender === 'Masculino' ? 'M' : 'F';
    if (birthDate !== undefined) body.birthDate = birthDate || null;
    if (document) body.document = document;
    if (address) body.address = address;
    if (ethnicity) body.ethnicity = ethnicity;
    if (anatomicalNotes) body.anatomicalNotes = anatomicalNotes;
    if (caseId) body.caseId = caseId;
    if (odontogram !== undefined) {
      body.odontogramEntries = odontogram ? [{ toothNumber: 1, note: odontogram }] : [];
    }

    const response = await fetch(`https://pi3p.onrender.com/patients/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Falha ao atualizar vítima`);
    }

    const data = await response.json();
    console.log('Vítima atualizada:', data);
    return data;
  } catch (error) {
    console.error('Erro em updateVictim:', error.message);
    throw error;
  }
}

export async function deleteVictim(id) {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const response = await fetch(`https://pi3p.onrender.com/patients/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Falha ao desativar vítima`);
    }

    const data = await response.json();
    console.log('Vítima excluída:', data);
    return data;
  } catch (error) {
    console.error('Erro em deleteVictim:', error.message);
    throw error;
  }
}

export async function fetchVictims() {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const response = await fetch('https://pi3p.onrender.com/patients', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Falha ao buscar vítimas`);
    }

    const data = await response.json();
    console.log('Vítimas recebidas:', data);
    return data;
  } catch (error) {
    console.error('Erro em fetchVictims:', error.message);
    throw error;
  }
}

export async function fetchCases() {
  try {
    const token = await AsyncStorage.getItem('accessToken');
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Falha ao buscar casos`);
    }

    const data = await response.json();
    console.log('Casos recebidos:', data);
    return data;
  } catch (error) {
    console.error('Erro em fetchCases:', error.message);
    throw error;
  }
}

export async function fetchEvidences() {
  try {
    const token = await AsyncStorage.getItem('accessToken');
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}: Falha ao buscar evidências`);
    }

    const data = await response.json();
    console.log('Evidências recebidas:', data);
    return data;
  } catch (error) {
    console.error('Erro em fetchEvidences:', error.message);
    throw error;
  }
}