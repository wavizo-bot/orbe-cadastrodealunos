import { useParams, useNavigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import { useAppData } from '../hooks/useAppData';

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students } = useAppData();

  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <ScreenContainer title="Aluno não encontrado" showBack>
        <div className="text-center py-12 text-gray-500">
          <p>Aluno não encontrado.</p>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Detalhes do Aluno" showBack>
      <div className="space-y-4">
        {/* Card principal */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{student.nomeCompleto}</h2>
          {student.shortId && (
            <p className="text-sm font-mono text-gray-500 mb-4">ID: {student.shortId}</p>
          )}

          <div className="space-y-3 mt-6">
            {student.sala && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Sala</span>
                <span className="font-medium text-gray-900">{student.sala}</span>
              </div>
            )}

            {student.turno && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Turno</span>
                <span className="font-medium text-gray-900">{student.turno}</span>
              </div>
            )}

            {(student.professora || student.professor) && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Professor</span>
                <span className="font-medium text-gray-900">{student.professora || student.professor}</span>
              </div>
            )}

            {student.nomeResponsavel && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Responsável</span>
                <span className="font-medium text-gray-900">{student.nomeResponsavel}</span>
              </div>
            )}

            {student.telefoneResponsavel && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Telefone</span>
                <span className="font-medium text-gray-900">{student.telefoneResponsavel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Anotações */}
        {(student.anotacao1 || student.anotacao2) && (
          <div className="bg-yellow-50 rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Anotações</h3>

            {student.anotacao1 && (
              <div className="mb-3">
                <p className="text-sm text-gray-700">{student.anotacao1}</p>
              </div>
            )}

            {student.anotacao2 && (
              <div>
                <p className="text-sm text-gray-700">{student.anotacao2}</p>
              </div>
            )}
          </div>
        )}

        {/* Informações adicionais */}
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Informações Adicionais</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>ID Único:</strong> {student.id}</p>
            {student.matricula && (
              <p><strong>Matrícula:</strong> {student.matricula}</p>
            )}
            {student.codigoUnico && (
              <p><strong>Código WhatsApp:</strong> {student.codigoUnico}</p>
            )}
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
