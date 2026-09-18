# Especificação para nova tarefa — Site Gerencial Escolar

> **Instrução para a nova tarefa:** crie uma **aplicação web responsiva**, com aparência e fluxos equivalentes ao projeto Gerencial Escolar descrito abaixo. O produto deve funcionar como um site acessível pelo navegador, priorizando celulares Android em orientação vertical, mas também sendo confortável em computador. Não crie um APK, não dependa de contas de usuário e não exija internet para pesquisa, dados, imagens ou fontes depois do carregamento inicial. Use apenas fontes nativas do sistema e armazenamento local do navegador. O único recurso que pode abrir algo externo é o botão de WhatsApp, acionado deliberadamente pelo usuário.

## 1. Estrutura do produto

Construa duas interfaces locais dentro do mesmo projeto web:

| Interface | Rota sugerida | Finalidade |
|---|---|---|
| **Versão de usuário** | `/` | Consulta de estudantes por inspetores, professores e equipe pedagógica. |
| **Versão administrativa** | `/administrativo` | Edição, importação, fotos, logos, ativação, exportação de atualização e manual. |

Toda informação deverá ser guardada localmente no navegador, usando IndexedDB ou LocalStorage conforme o volume. Não implementar login por conta, servidor, banco de dados remoto, Google Drive integrado, tipografias remotas, analytics, notificações ou carregamentos automáticos de URL externa. A seleção de arquivo deve usar o seletor local do dispositivo, permitindo escolher arquivos que estejam no Google Drive por meio do próprio seletor do navegador/sistema, sem conexão automática do site ao Drive.

## 2. Identidade visual e rodapé

Usarei dois anexos na nova tarefa: um ícone quadrado e uma foto genérica de aluno. Use o ícone no cabeçalho e como favicon; use a foto genérica em todos os alunos da base fictícia. A interface deve usar uma paleta escolar azul/verde, cartões claros, contraste adequado e elementos grandes para toque.

Em todas as telas, exibir ao final uma frase pequena, centralizada e discreta:

> Este programa é uma gentileza do agente comunitário de saúde Maico. Contato 11 978831938 — versão *número da versão* com dados de *data da criação do último banco de dados*

Na primeira abertura da base de demonstração, mostrar **“com dados de teste”**. Depois de reinicialização sem banco real, mostrar **“sem banco importado”**. Depois de importar uma atualização, exibir a data de criação armazenada no pacote.

## 3. Acesso, senha e ativação

A versão de usuário começa bloqueada. A senha inicial é **NGP1** e vale até o menor prazo entre dez dias após a primeira instalação e **20/09/2026**. A senha é digitada em quatro etapas: cada etapa apresenta quatro botões, cada um com três caracteres distintos; apenas um contém o próximo caractere correto. Não revelar erro, tamanho da senha ou progresso.

Ao escolher um botão incorreto, a sessão fica silenciosamente bloqueada até fechar e reabrir a aplicação. Apenas uma tentativa é permitida por abertura. Abrir e fechar sem erro não conta como falha. Três falhas reais em aberturas diferentes são acumuladas. Na quarta abertura após essas três falhas, cancelar a senha atual e iniciar ativação:

1. Exibir campo para CPF de 11 números e validar dígitos verificadores.
2. Com CPF válido, gerar um código de oito caracteres ligado ao CPF, à data atual e a um identificador local persistente da instalação/navegador.
3. Exibir esse código e manter os botões de senha aguardando a nova senha emitida pelo administrativo.
4. No administrativo, CPF e código permitem escolher **um** prazo de validade: 2, 4, 6, 8, 10 ou 12 meses.
5. O administrativo gera a nova senha de quatro caracteres; ela fica válida até a data calculada.

A senha usa letras maiúsculas e números de 1 a 9, sem caracteres repetidos e sem pares consecutivos de letras ou números. Em **Dados e acesso**, permitir gerar nova senha quantas vezes forem necessárias, avisando que a nova senha deve ser aprendida/anotada; a última gerada passa a valer no próximo acesso.

## 4. Menu principal de usuário

Depois do acesso válido, mostrar três botões grandes:

| Botão | Função |
|---|---|
| **Buscar aluno** | Pesquisa e perfil detalhado. |
| **Conferir grupo** | Filtros e lista para chamada/conferência em passeios ou tarefas pedagógicas. |
| **Dados e acesso** | Importação, senha e reinicialização. |

Todas as telas internas devem ter botão visível de voltar no topo. O navegador deve preservar a navegação entre telas, permitindo voltar dos resultados aos filtros e dos perfis à busca.

## 5. Busca de alunos

A tela **Buscar aluno** deve ter logos institucionais no topo, campo de busca, X à direita para apagar o texto, resultados automáticos, paginação de no máximo dez alunos e botão **Regras** no canto inferior direito, imediatamente acima do rodapé institucional. O botão abre uma janela com todas as regras de busca e um botão centralizado de fechar no topo.

A pesquisa não necessita de botão de confirmação: deve começar automaticamente quando a entrada for suficiente. Normalizar a comparação removendo acentos, diferenças de caixa e espaços extras, mas manter o texto importado exatamente como foi escrito para exibição.

| Entrada | Campo e regra |
|---|---|
| Nome comum | Exigir ao menos 3 caracteres e permitir aproximação por escrita, incluindo letras faltando/a mais e palavras parecidas. |
| `mãe`, `mae` ou `resp` | Pesquisar responsável. Exigir texto suficiente após o prefixo. |
| `sala` | Pesquisar sala. |
| `prof` | Pesquisar professora. |
| `aux` | Pesquisar auxiliar. |
| `turno` | Pesquisar turno. |
| `ano` ou `serie` | Pesquisar ano/série. |
| `nota` | Pesquisar palavras nos campos C e D, preservando/emulando emojis. |
| `aniversário` ou `aniversario` | Mostrar todos os alunos cujo dia e mês de nascimento coincidam com o dia e mês atuais. |
| 4 ou mais números | Pesquisar trecho de telefone E ou registro acadêmico L; os algarismos devem aparecer na ordem digitada. |
| Data `DD/MM/AAAA` ou `DD/MM/AA` | Pesquisar data de nascimento. |

## 6. Perfil do aluno

O perfil exibe foto, nome completo, responsável, telefone, data de nascimento com idade, ano/série, sala, turno, professora e auxiliar. O ícone pequeno de conversa em fundo verde abre WhatsApp à direita, na mesma linha do telefone, sem texto.

O campo C, quando preenchido, aparece acima da foto em uma faixa amarela **sem título**. O campo D, quando preenchido, aparece abaixo da foto em uma faixa de cor neutra **sem título**. Não criar rótulos como “atenção” ou “saída”.

Para caber em telas menores, ano/série fica alinhado à esquerda e sala à direita na mesma linha; turno fica à esquerda e `Professora / Auxiliar` à direita na mesma linha. Se um aviso C começar com emoji, esse emoji também deve ser exibido antes do nome na lista de conferência.

## 7. Conferir grupo

Na tela de filtros, permitir escolher múltiplas opções de sala, ano/série, turno e professora. Opções múltiplas no mesmo critério funcionam com **OU**; critérios diferentes funcionam com **E**. Há um botão de lixeira: ele limpa filtros, grupo salvo e cores da conferência.

Ao confirmar, abrir a lista filtrada. Cada toque em um aluno muda seu estado: neutro → verde → amarelo → neutro. Estados, filtros e grupo devem permanecer salvos localmente mesmo se o usuário navegar para outra tela ou fechar/reabrir o site, até uma limpeza explícita.

Na lista filtrada, exibir dois botões visuais: lixeira, que descarta o grupo atual e retorna aos filtros; e seta circular, que mantém o grupo e apenas neutraliza todas as cores. Permitir voltar aos filtros para revisar e alterar critérios.

## 8. Dados e acesso

Esta tela concentra:

| Recurso | Regra |
|---|---|
| **Importar** | Abre o seletor de arquivo local. Aceita CDA e JSON compatível. Detecta duplicidades pela combinação nome completo normalizado + nascimento. Se houver duplicidades, informar a quantidade e pedir confirmação antes de substituir; se forem apenas inclusões, importar imediatamente e mostrar temporariamente a quantidade incluída. |
| **Gerar senha** | Cria senha aleatória conforme as regras; pode gerar outra quantas vezes quiser. |
| **Reiniciar** | Apaga dados locais de alunos; exige digitar exatamente `CONFIRMO`. |

## 9. Dados A–L

A versão administrativa deve importar tabela por colagem direta ou arquivo CSV, TSV, TXT, XLS, XLSX ou JSON. A primeira linha usa as letras A–L como mapa de campo; os alunos começam na segunda linha. A ordem visual das colunas pode variar, desde que a letra seja mantida.

| Letra | Informação |
|---|---|
| A | Nome completo |
| B | Nome do responsável |
| C | Aviso de atenção acima da foto |
| D | Informação de saída/retirada abaixo da foto |
| E | Telefone do responsável |
| F | Data de nascimento |
| G | Ano/série |
| H | Sala |
| I | Turno |
| J | Professora |
| K | Auxiliar |
| L | Registro acadêmico/identificador único |

## 10. Fotos, logos e CDA

`pacote.zip` contém fotos em JPG/JPEG. Cada foto recebe exatamente o nome do registro acadêmico L, por exemplo `11111.jpg` ou `NA11111.jpg`; a associação nunca depende do nome do aluno.

Os logos institucionais são nomeados assim:

| Nome | Regra |
|---|---|
| `institucional.jpeg` | Logo único e centralizado. Ao ser usado, remove os dois logos menores. |
| `institucional1.jpeg` | Logo menor à esquerda. Substitui central e esquerdo; preserva direito. |
| `institucional2.jpeg` | Logo menor à direita. Substitui central e direito; preserva esquerdo. |

O administrativo gera `atualizacao.cda`, pacote comprimido e cifrado que reúne dados, fotos, logos, versão do formato, integridade e data/hora do computador criador. O site de usuário aceita CDA, valida-o e grava a data como data do último banco. Como todo o fluxo é offline e cliente-side, documentar claramente que a cifra protege contra leitura e alteração casual, mas não substitui a segurança física de computadores e dispositivos.

## 11. Versão administrativa e manual

A versão administrativa deve ter cadastro individual, busca, revisão manual de foto, importação por colagem e arquivo, ZIP de fotos, logos nomeados, exportação CDA, área de CPF/código/prazo de ativação e um botão **?** que abre manual completo. O manual deve cobrir obrigatoriamente: criação da tabela A–L; importação por todos os formatos; fotos; logos; duplicidades; pesquisa da versão de usuário; conferência; senhas; falhas; CPF; ativação; CDA; data do banco; importação no usuário; reinicialização; limites de segurança; e funcionamento sem internet.

## 12. Base fictícia obrigatória

Criar 300 alunos fictícios para testes, todos explicitamente identificados como `TESTE`, todos com a foto genérica recebida. Distribuir em 12 turmas de 25 alunos, seis matutinas e seis vespertinas, salas A–F, anos/séries de 1 a 5, seis professoras e uma auxiliar fixa para cada professora. Todos precisam ter de 6 a 10 anos completos. Exatamente 15 alunos devem ter C igual a `🩺 Austimo`; exatamente 60 devem ter D igual a `🚐 Aguardar van`.

## 13. Critérios de entrega

Entregar o site funcional, responsivo e sem dependência de serviços externos. Validar pesquisa, conferência persistente, CPF, senha, CDA, importação de dados, fotos, logos, duplicidades e rodapé. Criar documentação de uso e manter todos os arquivos administrativos locais no próprio projeto.
