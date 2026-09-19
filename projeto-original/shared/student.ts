export interface Student {
  id: string;
  registroAcademico?: string;
  nomeCompleto: string;
  nomeResponsavel: string;
  telefoneResponsavel?: string;
  dataNascimento: string;
  anoSerie: string;
  sala: string;
  turno: string;
  professora?: string;
  auxiliar?: string;
  fotoBase64?: string;
  fotoTeste?: boolean;
  condicaoEspecifica?: string;
  retiradaAutorizada?: string;
  atualizadoEm?: string;
}

export interface InstitutionalLogos {
  central?: string;
  esquerda?: string;
  direita?: string;
}

export interface ImportPackage {
  formato: "consulta-alunos-import";
  versao: 1 | 2;
  exportadoEm: string;
  origem: string;
  criadoEm?: string;
  imagemInstitucionalBase64?: string;
  logos?: InstitutionalLogos;
  alunos: Student[];
}

export interface AppMetadata {
  instaladoEm: string;
  identificadorInstalacao: string;
  aberturasNaTelaDeAcesso: number;
  imagemInstitucionalBase64?: string;
  logos?: InstitutionalLogos;
  bancoCriadoEm?: string;
  bancoOrigem?: string;
  falhasDeSenha: number;
  exigeAtivacao: boolean;
  licencaExpiraEm?: string;
}

export interface ImportResult {
  adicionados: number;
  atualizados: number;
  total: number;
}

export type ConferenceStatus = "neutral" | "checked" | "pending";

export interface ConferenceState {
  filter: ConferenceFilter;
  statuses: Record<string, ConferenceStatus>;
  updatedAt: string;
}

export interface ConferenceFilter {
  salas: string[];
  anosSeries: string[];
  turnos: string[];
  professoras: string[];
}

export interface StructuredStudentRow {
  A: string;
  B: string;
  C?: string;
  D?: string;
  E?: string;
  F: string;
  G: string;
  H: string;
  I: string;
  J: string;
  K: string;
  L: string;
}
