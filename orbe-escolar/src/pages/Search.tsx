import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import { AppFooter } from '../components/AppFooter';
import ActionButton from '../components/ActionButton';
import { useAppData } from '../hooks/useAppData';
import { searchStudents, isSearchReady, paginateStudents, attentionEmoji } from '../lib/student-utils';
import type { Student } from '../types/student';

const PAGE_SIZE = 10;

export default function Search() {
  const navigate = useNavigate();
  const { students, metadata } = useAppData();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredStudents = useMemo(() => searchStudents(students, query), [query, students]);
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleStudents = useMemo(() => paginateStudents(filteredStudents, currentPage, PAGE_SIZE), [currentPage, filteredStudents]);
  const ready = isSearchReady(query);

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <ScreenContainer containerClassName="bg-[#F5F7FA]">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full bg-[#E5EEF6] flex items-center justify-center">
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#12365A" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-[#173449] text-lg font-black">Buscar aluno</h1>
          <div className="h-10 w-10" />
        </div>

        {/* Institutional Space */}
        <div className="min-h-24 bg-[#E7EDF3] rounded-xl flex items-center justify-center overflow-hidden mb-4">
          {metadata?.logos?.central || metadata?.imagemInstitucionalBase64 ? (
            <img src={metadata.logos?.central ?? metadata.imagemInstitucionalBase64} alt="Logo" className="w-full h-24 object-contain" />
          ) : (
            <span className="text-[#71869A] text-xs font-bold tracking-wider">ESPAÇO INSTITUCIONAL</span>
          )}
        </div>

        {/* Search Box */}
        <div className="flex flex-row items-center min-h-[52px] bg-white rounded-xl border border-[#CFDAE4] px-3.5 gap-2 mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#537087" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            placeholder="Pesquise nome, sala, responsável..."
            className="flex-1 py-2.5 text-[#16212C] text-sm outline-none placeholder:text-[#718091]"
          />
          {query && (
            <button onClick={() => updateQuery('')} className="w-10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#537087" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-row justify-between mb-2">
          <span className="text-[#536779] font-bold text-sm">{ready ? 'Resultados' : 'Digite para pesquisar'}</span>
          {ready && <span className="text-[#0D5E77] font-black text-sm">{filteredStudents.length}</span>}
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-auto flex flex-col gap-2">
          {ready && visibleStudents.length > 0 ? (
            visibleStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="min-h-[70px] bg-white rounded-xl border border-[#DEE7EF] p-3 flex flex-row items-center gap-2.5 active:opacity-78 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-[#E2F4F7] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D5E77" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                  <span className="text-[#1A2C3D] text-sm font-extrabold truncate">
                    {attentionEmoji(student) ? `${attentionEmoji(student)} ${student.nomeCompleto}` : student.nomeCompleto}
                  </span>
                  <span className="text-[#5B6D7D] text-xs">{student.anoSerie} · Sala {student.sala} · {student.turno}</span>
                </div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E8C99" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))
          ) : ready ? (
            <div className="mt-3 p-7 bg-white rounded-2xl flex flex-col items-center gap-2 border border-[#DEE7EF]">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#7890A4" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span className="text-[#314454] text-base font-black text-center">Nenhum aluno encontrado</span>
              <span className="text-[#637484] text-xs leading-relaxed text-center">Tente outra regra ou outro trecho.</span>
            </div>
          ) : null}
        </div>

        {/* Pagination */}
        {filteredStudents.length > PAGE_SIZE && ready && (
          <div className="flex flex-row gap-2 items-center mt-4">
            <ActionButton
              onClick={() => setPage((v) => Math.max(1, v - 1))}
              disabled={currentPage === 1}
              variant="secondary"
              className="flex-1 py-2"
            >
              ANTERIOR
            </ActionButton>
            <span className="text-[#526679] font-extrabold text-sm">{currentPage}/{totalPages}</span>
            <ActionButton
              onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
              disabled={currentPage === totalPages}
              variant="secondary"
              className="flex-1 py-2"
            >
              PRÓXIMA
            </ActionButton>
          </div>
        )}

        <AppFooter className="mt-3" />
      </div>
    </ScreenContainer>
  );
}
