import { useState, useEffect, useCallback } from 'react';
import type { Student, AppMetadata, ConferenceState, ImportPackage, ImportResult } from '../types/student';
import * as db from '../lib/db';
import { generateUniqueCode } from '../lib/student-utils';

export interface ConferenceStateExtended extends ConferenceState {
  adminPhone?: string;
}

export function useAppData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [metadata, setMetadata] = useState<AppMetadata | null>(null);
  const [conferenceState, setConferenceState] = useState<Record<string, 'neutral' | 'green' | 'yellow'>>({});
  const [adminPhone, setAdminPhone] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Carrega dados iniciais
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedStudents, loadedMetadata, loadedConference] = await Promise.all([
          db.getAllStudents(),
          db.getMetadata(),
          db.getConference(),
        ]);

        // Garante que todos os alunos tenham codigoUnico
        const studentsWithCodes = loadedStudents.map(student => ({
          ...student,
          codigoUnico: student.codigoUnico || generateUniqueCode(),
          shortId: student.shortId || student.codigoUnico || generateUniqueCode(),
        }));

        setStudents(studentsWithCodes);
        setMetadata(loadedMetadata);
        
        // Carrega estado da conferência e telefone administrativo
        if (loadedConference) {
          setConferenceState((loadedConference as any).statuses || {});
          setAdminPhone((loadedConference as any).adminPhone || loadedMetadata?.numeroAdministrativo || '');
        } else if (loadedMetadata?.numeroAdministrativo) {
          setAdminPhone(loadedMetadata.numeroAdministrativo);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Salva lista completa de alunos
  const saveStudents = useCallback(async (newStudents: Student[]) => {
    await db.saveStudents(newStudents);
    setStudents(newStudents);
  }, []);

  // Importa pacote de dados
  const importDatabase = useCallback(async (data: ImportPackage | { alunos: Student[] }): Promise<ImportResult> => {
    const pkg = 'formato' in data ? data : { alunos: data.alunos };
    const existingIds = new Set(students.map(s => s.id));
    let adicionados = 0;
    let atualizados = 0;

    const updatedStudents = [...students];

    for (const aluno of pkg.alunos) {
      const studentWithCode = {
        ...aluno,
        codigoUnico: aluno.codigoUnico || generateUniqueCode(),
        shortId: aluno.shortId || aluno.codigoUnico || generateUniqueCode(),
      };

      const index = updatedStudents.findIndex(s => s.id === aluno.id);
      if (index >= 0) {
        updatedStudents[index] = studentWithCode;
        atualizados++;
      } else {
        updatedStudents.push(studentWithCode);
        adicionados++;
      }
    }

    await saveStudents(updatedStudents);

    // Atualiza metadata com informações do banco importado
    if (metadata && 'formato' in pkg) {
      const updatedMetadata = {
        ...metadata,
        bancoCriadoEm: pkg.criadoEm,
        bancoOrigem: pkg.origem,
        imagemInstitucionalBase64: pkg.imagemInstitucionalBase64,
        logos: pkg.logos,
      };
      await db.saveMetadata(updatedMetadata);
      setMetadata(updatedMetadata);
    }

    return {
      adicionados,
      atualizados,
      total: updatedStudents.length,
    };
  }, [students, metadata, saveStudents]);

  // Atualiza estado da conferência
  const updateConferenceState = useCallback(async (updates: { adminPhone?: string } | Record<string, 'neutral' | 'green' | 'yellow'>) => {
    const updatesAny = updates as any;
    const phone = updatesAny.adminPhone;
    
    // Remove adminPhone das atualizações de status
    const statusUpdates: Record<string, 'neutral' | 'green' | 'yellow'> = {};
    for (const key of Object.keys(updatesAny)) {
      if (key !== 'adminPhone') {
        statusUpdates[key] = updatesAny[key];
      }
    }
    
    let newConferenceState = conferenceState;
    if (Object.keys(statusUpdates).length > 0) {
      newConferenceState = { ...conferenceState, ...statusUpdates };
      setConferenceState(newConferenceState);
    }
    
    let newAdminPhone = adminPhone;
    if (phone) {
      newAdminPhone = phone;
      setAdminPhone(phone);
    }

    // Salva no banco
    const conferenceData: any = {
      filter: { salas: [], anosSeries: [], turnos: [], professoras: [] },
      statuses: newConferenceState,
      updatedAt: new Date().toISOString(),
      adminPhone: newAdminPhone,
    };
    await db.saveConference(conferenceData);
  }, [conferenceState, adminPhone]);

  // Reinicia app
  const resetAllData = useCallback(async () => {
    await db.clearAllData();
    setStudents([]);
    setConferenceState({});
    setAdminPhone('');
  }, []);

  return {
    students,
    metadata,
    conferenceState,
    adminPhone,
    loading,
    saveStudents,
    importDatabase,
    updateConferenceState,
    resetAllData,
  };
}
