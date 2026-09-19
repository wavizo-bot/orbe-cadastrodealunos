import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '../components/ScreenContainer';
import { CardButton } from '../components/Button';
import { AppFooter } from '../components/AppFooter';

export function Menu() {
  const navigate = useNavigate();

  const menuOptions = [
    {
      label: 'Buscar aluno',
      subtitle: 'Pesquisa rápida e informações do perfil',
      icon: (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#0D5E77" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
      route: '/search',
    },
    {
      label: 'Conferir grupo',
      subtitle: 'Filtros, chamada e estados de presença',
      icon: (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#0D5E77" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
      route: '/conference-filters',
    },
    {
      label: 'Configurações',
      subtitle: 'Importação, número administrativo e dados locais',
      icon: (
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#0D5E77" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
      route: '/settings',
    },
  ];

  return (
    <ScreenContainer containerClassName="bg-[#F5F7FA]">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center gap-1.5 pt-5 pb-7">
          <div className="h-16 w-16 rounded-2xl bg-[#0E7490] flex items-center justify-center mb-1.5">
            <span className="text-white text-xl font-black tracking-wide">GE</span>
          </div>
          <h1 className="text-[#163047] text-2xl font-black">Gerencial Escolar</h1>
          <p className="text-[#617386] text-sm">Escolha uma atividade</p>
        </div>

        {/* Menu Options */}
        <div className="flex flex-col gap-3">
          {menuOptions.map((option) => (
            <CardButton
              key={option.label}
              icon={option.icon}
              label={option.label}
              subtitle={option.subtitle}
              to={option.route}
            />
          ))}
        </div>

        <div className="flex-1" />

        <AppFooter />
      </div>
    </ScreenContainer>
  );
}

export default Menu;
