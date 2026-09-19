import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import ActionButton from '../components/ActionButton';
import { useAppData } from '../hooks/useAppData';

export default function ConferenceFilters() {
  const navigate = useNavigate();
  const { students } = useAppData();
  
  const [selectedSala, setSelectedSala] = useState('');
  const [selectedTurno, setSelectedTurno] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const salas = [...new Set(students.map(s => s.sala).filter(Boolean))] as string[];
  const turnos = [...new Set(students.map(s => s.turno).filter(Boolean))] as string[];
  const professores = [...new Set(students.map(s => (s.professora || s.professor)).filter(Boolean))] as string[];

  const handleConfirm = () => {
    const filters = { sala: selectedSala, turno: selectedTurno, professor: selectedProfessor, searchTerm };
    sessionStorage.setItem('conferenceFilters', JSON.stringify(filters));
    navigate('/conference-list');
  };

  const hasActiveFilters = selectedSala || selectedTurno || selectedProfessor || searchTerm;

  return (
    <ScreenContainer title="Conferir Grupo" showBack>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por nome</label>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Digite parte do nome..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sala</label>
            <select value={selectedSala} onChange={(e) => setSelectedSala(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
              <option value="">Todas as salas</option>
              {salas.map(sala => <option key={sala} value={sala}>{sala}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Turno</label>
            <select value={selectedTurno} onChange={(e) => setSelectedTurno(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
              <option value="">Todos os turnos</option>
              {turnos.map(turno => <option key={turno} value={turno}>{turno}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Professor</label>
            <select value={selectedProfessor} onChange={(e) => setSelectedProfessor(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
              <option value="">Todos os professores</option>
              {professores.map(prof => <option key={prof} value={prof}>{prof}</option>)}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Filtros ativos:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSala && <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">Sala: {selectedSala}</span>}
              {selectedTurno && <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">Turno: {selectedTurno}</span>}
              {selectedProfessor && <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">Prof: {selectedProfessor}</span>}
              {searchTerm && <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">Busca: "{searchTerm}"</span>}
            </div>
          </div>
        )}

        <ActionButton onClick={handleConfirm} disabled={!hasActiveFilters}>Confirmar Filtros</ActionButton>
      </div>
    </ScreenContainer>
  );
}
