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
  professor?: string; // Alias para compatibilidade
  auxiliar?: string;
  fotoBase64?: string;
  fotoTeste?: boolean;
  condicaoEspecifica?: string;
  retiradaAutorizada?: string;
  atualizadoEm?: string;
  responsavel?: string; // Alias para nomeResponsavel
  parentesco?: string;
  telefone?: string; // Alias para telefoneResponsavel
  anotacao1?: string;
  anotacao2?: string;
  matricula?: string;
  // Novo campo para ID único de 3 caracteres para WhatsApp
  codigoUnico?: string;
  shortId?: string; // Alias para codigoUnico
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
  numeroAdministrativo?: string; // Novo campo para número do WhatsApp
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
  adminPhone?: string; // Campo adicional para número administrativo
}

export interface ConferenceFilter {
  salas: string[];
  anosSeries: string[];
  turnos: string[];
  professoras: string[];
}
