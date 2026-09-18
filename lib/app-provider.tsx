import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { clearConferenceState, getConferenceState, getMetadata, hasInstalledSampleData, markSampleDataAsInstalled, resetConfiguration, saveConferenceState, saveMetadata } from "@/lib/app-storage";
import { mergeStudents } from "@/lib/importer";
import { SAMPLE_STUDENTS } from "@/lib/sample-students";
import { clearStudents, loadStudents, saveStudents } from "@/lib/student-storage";
import type { AppMetadata, ConferenceState, ImportPackage, ImportResult, Student } from "@/shared/student";

interface AppContextValue {
  loading: boolean;
  students: Student[];
  metadata: AppMetadata | null;
  conference: ConferenceState | null;
  refresh: () => Promise<void>;
  importPackage: (data: ImportPackage) => Promise<ImportResult>;
  resetApp: () => Promise<void>;
  saveConference: (state: ConferenceState) => Promise<void>;
  clearConference: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [metadata, setMetadata] = useState<AppMetadata | null>(null);
  const [conference, setConference] = useState<ConferenceState | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [savedMetadata, savedStudents, hasSampleData, savedConference] = await Promise.all([getMetadata(), loadStudents(), hasInstalledSampleData(), getConferenceState()]);
      if (savedStudents.length === 0 && !hasSampleData) {
        await Promise.all([saveStudents(SAMPLE_STUDENTS), markSampleDataAsInstalled()]);
        setMetadata(savedMetadata);
        setStudents(SAMPLE_STUDENTS);
        setConference(savedConference);
        return;
      }
      setMetadata(savedMetadata);
      setStudents(savedStudents);
      setConference(savedConference);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const importPackage = useCallback(
    async (data: ImportPackage) => {
      const { students: merged, result } = mergeStudents(students, data.alunos);
      const updatedMetadata: AppMetadata = {
        ...(metadata ?? (await getMetadata())),
        imagemInstitucionalBase64: data.imagemInstitucionalBase64 ?? metadata?.imagemInstitucionalBase64,
        logos: data.logos ?? metadata?.logos,
        bancoCriadoEm: data.criadoEm ?? data.exportadoEm,
        bancoOrigem: data.origem,
      };
      await Promise.all([saveStudents(merged), saveMetadata(updatedMetadata)]);
      setStudents(merged);
      setMetadata(updatedMetadata);
      return result;
    },
    [metadata, students],
  );

  const resetApp = useCallback(async () => {
    await Promise.all([clearStudents(), resetConfiguration()]);
    await refresh();
  }, [refresh]);

  const saveConference = useCallback(async (state: ConferenceState) => {
    await saveConferenceState(state);
    setConference(state);
  }, []);

  const clearConference = useCallback(async () => {
    await clearConferenceState();
    setConference(null);
  }, []);

  const value = useMemo(
    () => ({ loading, students, metadata, conference, refresh, importPackage, resetApp, saveConference, clearConference }),
    [clearConference, conference, importPackage, loading, metadata, refresh, resetApp, saveConference, students],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useAppData deve ser usado dentro de AppProvider.");
  }
  return value;
}
