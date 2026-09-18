import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import { useAppData } from '../hooks/useAppData';
import { Student } from '../types/student';

interface ConferenceFilters {
  sala: string;
  turno: string;
  professor: string;
  searchTerm: string;
}

type TagColor = 'neutral' | 'green' | 'yellow';

interface StudentWithColor extends Student {
  color: TagColor;
}

export default function ConferenceList() {
  const navigate = useNavigate();
  const { students, conferenceState, updateConferenceState, adminPhone } = useAppData();
  const [filteredStudents, setFilteredStudents] = useState<StudentWithColor[]>([]);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [includeGreen, setIncludeGreen] = useState(true);
  const [includeYellow, setIncludeYellow] = useState(true);

  useEffect(() => {
    const filtersStr = sessionStorage.getItem('conferenceFilters');
    if (!filtersStr) {
      navigate('/conference-filters');
      return;
    }

    const filters: ConferenceFilters = JSON.parse(filtersStr);

    // Aplicar filtros
    let result = students.filter(student => {
      if (filters.sala && student.sala !== filters.sala) return false;
      if (filters.turno && student.turno !== filters.turno) return false;
      if (filters.professor && (student.professora !== filters.professor && student.professor !== filters.professor)) return false;
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const nameMatch = student.nomeCompleto.toLowerCase().includes(searchLower);
        const responsavelMatch = student.nomeResponsavel?.toLowerCase().includes(searchLower);
        const anotacao1Match = student.anotacao1?.toLowerCase().includes(searchLower);
        const anotacao2Match = student.anotacao2?.toLowerCase().includes(searchLower);
        
        if (!nameMatch && !responsavelMatch && !anotacao1Match && !anotacao2Match) {
          return false;
        }
      }
      
      return true;
    });

    // Adicionar cor atual de cada aluno
    const studentsWithColor: StudentWithColor[] = result.map(student => ({
      ...student,
      color: conferenceState[student.id] || 'neutral',
    }));

    setFilteredStudents(studentsWithColor);
  }, [students, conferenceState, navigate]);

  const handleTagClick = (studentId: string) => {
    const currentColor = conferenceState[studentId] || 'neutral';
    let newColor: TagColor;
    
    if (currentColor === 'neutral') {
      newColor = 'green';
    } else if (currentColor === 'green') {
      newColor = 'yellow';
    } else {
      newColor = 'neutral';
    }
    
    updateConferenceState({ [studentId]: newColor });
  };

  const getTagBackgroundColor = (color: TagColor) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-400';
      default: return 'bg-gray-200';
    }
  };

  // Gerar código WhatsApp
  const generateWhatsappCode = () => {
    let code = '';
    
    // Alunos amarelos primeiro
    if (includeYellow) {
      const yellowStudents = filteredStudents.filter(s => s.color === 'yellow');
      if (yellowStudents.length > 0) {
        code += 'a';
        yellowStudents.forEach(s => {
          code += s.shortId || s.codigoUnico || s.id.substring(0, 3).toUpperCase();
        });
      }
    }
    
    // Alunos verdes depois
    if (includeGreen) {
      const greenStudents = filteredStudents.filter(s => s.color === 'green');
      if (greenStudents.length > 0) {
        code += 'v';
        greenStudents.forEach(s => {
          code += s.shortId || s.codigoUnico || s.id.substring(0, 3).toUpperCase();
        });
      }
    }
    
    return code;
  };

  const whatsappCode = generateWhatsappCode();
  const phone = adminPhone || '11912345678';
  const whatsappLink = `https://wa.me/55${phone}?text=${whatsappCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(whatsappCode);
      alert('Código copiado.');
    } catch (err) {
      alert('Erro ao copiar código.');
    }
  };

  const openWhatsapp = () => {
    window.open(whatsappLink, '_blank');
  };

  const greenCount = filteredStudents.filter(s => s.color === 'green').length;
  const yellowCount = filteredStudents.filter(s => s.color === 'yellow').length;

  return (
    <ScreenContainer title="Lista de Conferência" showBack>
      <div className="space-y-4">
        {/* Header com contagem e botão WhatsApp */}
        <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredStudents.length}</span> alunos
            {greenCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                🟩 {greenCount}
              </span>
            )}
            {yellowCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                🟨 {yellowCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowWhatsappModal(true)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            aria-label="WhatsApp"
          >
            📲
          </button>
        </div>

        {/* Lista de etiquetas */}
        <div className="grid grid-cols-1 gap-3">
          {filteredStudents.map(student => (
            <button
              key={student.id}
              onClick={() => handleTagClick(student.id)}
              className={`w-full p-4 rounded-xl shadow-sm transition-all duration-200 text-left ${getTagBackgroundColor(
                student.color
              )} ${student.color === 'neutral' ? 'hover:bg-gray-300' : 'hover:opacity-90'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{student.nomeCompleto}</h3>
                  {student.sala && (
                    <p className="text-sm text-gray-600 mt-1">Sala: {student.sala}</p>
                  )}
                  {student.nomeResponsavel && (
                    <p className="text-sm text-gray-600">Resp: {student.nomeResponsavel}</p>
                  )}
                </div>
                <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded">
                  {student.shortId || student.codigoUnico || student.id.substring(0, 3).toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Nenhum aluno encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Modal WhatsApp */}
      {showWhatsappModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowWhatsappModal(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header do modal */}
            <div className="flex justify-between items-center p-4 border-b">
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Voltar"
              >
                ⬅️
              </button>
              <h3 className="font-semibold text-gray-800">Enviar WhatsApp</h3>
              <div className="w-10"></div>
            </div>

            {/* Conteúdo do modal */}
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Selecione quais cores incluir no código:
              </p>

              {/* Botões de seleção de cores */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIncludeGreen(!includeGreen)}
                  className={`flex-1 py-3 rounded-xl font-medium transition ${
                    includeGreen
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  🟩 Verde ({greenCount})
                </button>
                <button
                  onClick={() => setIncludeYellow(!includeYellow)}
                  className={`flex-1 py-3 rounded-xl font-medium transition ${
                    includeYellow
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  🟨 Amarelo ({yellowCount})
                </button>
              </div>

              {/* Código gerado */}
              {whatsappCode && (
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Código gerado:</p>
                  <p className="font-mono text-sm break-all text-gray-800">{whatsappCode}</p>
                </div>
              )}

              {/* Botões de ação */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyToClipboard}
                  disabled={!whatsappCode}
                  className="py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition disabled:opacity-50"
                >
                  📝 Copiar
                </button>
                <button
                  onClick={openWhatsapp}
                  disabled={!whatsappCode}
                  className="py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50"
                >
                  📲 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ScreenContainer>
  );
}
