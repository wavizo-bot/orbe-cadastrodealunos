import type { Student } from "@/shared/student";

const firstNames = ["Ana", "Bento", "Catarina", "Davi", "Elis", "Felipe", "Giovana", "Heitor", "Isadora", "João", "Lara", "Miguel", "Nina", "Otávio", "Paula", "Ravi", "Sofia", "Theo", "Valentina", "Yasmin", "Zeca", "Bianca", "Caio", "Diana", "Enzo"];
const surnames = ["Almeida", "Barros", "Cardoso", "Dias", "Esteves", "Freitas", "Gomes", "Henrique", "Lima", "Moraes", "Nogueira", "Oliveira", "Pereira", "Ramos", "Silva"];
const professoras = ["Ana Clara", "Beatriz", "Carolina", "Daniela", "Elisa", "Fernanda"];
const auxiliares = ["Aline", "Bruna", "Cláudia", "Débora", "Erika", "Flávia"];
const salas = ["A", "B", "C", "D", "E", "F"];
const gradeByClass = ["1º ano", "1º ano", "2º ano", "2º ano", "3º ano", "3º ano", "4º ano", "4º ano", "5º ano", "5º ano", "1º ano", "2º ano"];

function isoBirthDate(index: number, grade: string): string {
  const now = new Date();
  const gradeNumber = Number.parseInt(grade, 10);
  const targetAge = Math.min(10, 5 + gradeNumber);
  const month = (index % 12) + 1;
  const day = (index % 25) + 1;
  const birthdayHasPassed = month < now.getMonth() + 1 || (month === now.getMonth() + 1 && day <= now.getDate());
  const year = now.getFullYear() - targetAge - (birthdayHasPassed ? 0 : 1);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function testStudent(index: number): Student {
  const classIndex = Math.floor(index / 25);
  const position = index % 25;
  const grade = gradeByClass[classIndex];
  const teacherIndex = classIndex % professoras.length;
  const academicId = `NA${String(index + 1).padStart(5, "0")}`;
  const firstName = firstNames[(index + position) % firstNames.length];
  const secondName = firstNames[(index * 3 + 7) % firstNames.length];
  const surname = surnames[index % surnames.length];
  const surnameTwo = surnames[(index + 5) % surnames.length];
  const sampleCondition = index % 20 === 0 ? "🩺 Austimo" : undefined;
  const samplePickup = index % 5 === 0 ? "🚐 Aguardar van" : undefined;

  return {
    id: `teste-${academicId.toLowerCase()}`,
    registroAcademico: academicId,
    nomeCompleto: `${firstName} ${secondName} ${surname} ${surnameTwo} — TESTE`,
    nomeResponsavel: `Responsável Fictício ${String(index + 1).padStart(3, "0")}`,
    telefoneResponsavel: `1197${String(1000000 + index).slice(-7)}`,
    dataNascimento: isoBirthDate(index, grade),
    anoSerie: grade,
    sala: salas[classIndex % salas.length],
    turno: classIndex < 6 ? "Manhã" : "Tarde",
    professora: professoras[teacherIndex],
    auxiliar: auxiliares[teacherIndex],
    fotoTeste: true,
    condicaoEspecifica: sampleCondition,
    retiradaAutorizada: samplePickup,
    atualizadoEm: new Date().toISOString(),
  };
}

export const SAMPLE_STUDENTS: Student[] = Array.from({ length: 300 }, (_, index) => testStudent(index));
