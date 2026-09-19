import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import ActionButton from '../components/ActionButton';
import { useAppData } from '../hooks/useAppData';

export default function Settings() {
  const navigate = useNavigate();
  const { importDatabase, resetAllData, conferenceState, updateConferenceState } = useAppData();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      // Criar input de arquivo invisível
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          const data = JSON.parse(text);
          await importDatabase(data);
          alert('Banco importado com sucesso!');
        } catch (err) {
          alert('Erro ao importar banco. Verifique o formato do arquivo.');
        } finally {
          setIsImporting(false);
        }
      };

      input.click();
    } catch (err) {
      setIsImporting(false);
      alert('Erro ao selecionar arquivo.');
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 4; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const confirmed = window.confirm(
      `Sua nova senha é: ${password}\n\nEsta senha será exigida na próxima abertura do app. Deseja gerar?`
    );
    
    if (confirmed) {
      // Salvar senha no localStorage (em produção, usar armazenamento mais seguro)
      localStorage.setItem('appPassword', password);
      alert('Senha gerada e salva com sucesso!');
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      '⚠️ ATENÇÃO: Esta ação apagará todos os dados locais.\n\nTem certeza que deseja continuar? Será necessário importar uma nova base de dados.'
    );
    
    if (confirmed) {
      resetAllData();
      alert('Dados reiniciados. Importe uma nova base para continuar.');
    }
  };

  const handlePhoneConfirm = () => {
    if (phoneInput.length >= 10) {
      updateConferenceState({ adminPhone: phoneInput });
      setShowPhoneModal(false);
      setPhoneInput('');
      alert('Número administrativo atualizado!');
    }
  };

  const currentPhone = conferenceState.adminPhone || 'Não definido';

  return (
    <ScreenContainer title="Configurações" showBack>
      <div className="space-y-6">
        {/* Importar Banco */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">IMPORTAR BANCO</h3>
          <p className="text-sm text-gray-600 mb-4">
            Abra a pesquisa de arquivos do telefone — inclusive Google Drive — e selecione o banco JSON ou atualização compatível. Duplicidades serão confirmadas antes da substituição.
          </p>
          <ActionButton onClick={handleImport} disabled={isImporting}>
            {isImporting ? 'Importando...' : 'IMPORTAR'}
          </ActionButton>
        </div>

        {/* Número Administrativo */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">NÚMERO ADMINISTRATIVO</h3>
          <p className="text-sm text-gray-600 mb-4">
            Número de telefone administrativo para onde são enviadas informações.
          </p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Atual: <strong>{currentPhone}</strong></span>
          </div>
          <ActionButton onClick={() => setShowPhoneModal(true)} variant="secondary">
            DEFINIR
          </ActionButton>
        </div>

        {/* Gerar Senha */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">GERAR SENHA</h3>
          <p className="text-sm text-gray-600 mb-4">
            Cria uma senha local nova de 4 caracteres. A última senha gerada será exigida quando o aplicativo for aberto novamente.
          </p>
          <ActionButton onClick={handleGeneratePassword} variant="secondary">
            GERAR NOVA SENHA
          </ActionButton>
        </div>

        {/* Reiniciar Dados */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">REINICIAR DADOS LOCAIS</h3>
          <p className="text-sm text-gray-600 mb-4">
            Apaga os alunos deste aparelho, a conferência e as configurações de acesso. Para continuar será necessário importar uma nova base.
          </p>
          <ActionButton onClick={handleReset} variant="danger">
            REINICIAR
          </ActionButton>
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          orbe-escolar v1.0.0
        </p>
      </div>

      {/* Modal de Telefone */}
      {showPhoneModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPhoneModal(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header do modal */}
            <div className="flex justify-between items-center p-4 border-b">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Voltar"
              >
                ⬅️
              </button>
              <h3 className="font-semibold text-gray-800">Definir Número</h3>
              <button
                onClick={handlePhoneConfirm}
                disabled={phoneInput.length < 10}
                className={`p-2 rounded-lg transition ${
                  phoneInput.length >= 10
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                ✅
              </button>
            </div>

            {/* Conteúdo do modal */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Digite o número administrativo (10-11 dígitos):
              </p>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={11}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                placeholder="11912345678"
                className="w-full px-4 py-3 text-center text-2xl font-mono border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                {phoneInput.length}/11 dígitos
              </p>
            </div>
          </div>
        </div>
      )}
    </ScreenContainer>
  );
}
