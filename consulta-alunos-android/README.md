# Gerencial Escolar

## Finalidade

**Gerencial Escolar** é um aplicativo Android de consulta e conferência escolar para inspetores, professores e equipe pedagógica. Após a importação, todos os dados operam localmente no aparelho. A única ação que pode abrir um recurso externo é o ícone verde de conversa, que inicia voluntariamente o WhatsApp no telefone do responsável.

| Área do menu | Função |
|---|---|
| **Buscar aluno** | Pesquisa tolerante e paginada, perfil completo e contato por WhatsApp. |
| **Conferir grupo** | Filtros por sala, ano/série, turno e professora; os estados neutro, verde e amarelo permanecem gravados até limpeza explícita. |
| **Dados e acesso** | Importação manual, geração de senha e reinicialização protegida por `CONFIRMO`. |

## Base de demonstração

A primeira abertura da versão de teste cria **300 alunos fictícios**, distribuídos em 12 turmas de 25 alunos, seis matutinas e seis vespertinas. Há seis professoras, uma auxiliar por professora, salas A–F, estudantes de 6 a 10 anos completos, 15 avisos `🩺 Austimo` e 60 recados `🚐 Aguardar van`. A foto genérica fornecida é aplicada a essa base.

Após a importação de um banco real, os registros com o mesmo nome e a mesma data de nascimento podem ser atualizados. Ao reiniciar o aplicativo, a demonstração não é criada novamente no mesmo aparelho.

## Busca e perfil

A busca começa automaticamente quando há informação suficiente. Nomes exigem três caracteres; telefone e registro acadêmico exigem quatro números, sempre preservando a ordem. A busca ignora maiúsculas, acentos e espaços extras, aceita aproximações de escrita e reconhece os comandos `mãe`, `mae`, `resp`, `sala`, `prof`, `aux`, `turno`, `ano`, `serie`, `nota` e `aniversário`/`aniversario`.

> O comando **aniversário** lista alunos cujo dia e mês de nascimento coincidem com o dia atual, sem considerar o ano.

No perfil, a faixa amarela acima da foto exibe o aviso C somente quando houver conteúdo. A faixa neutra abaixo da foto mostra o recado D de saída ou retirada. Ano/série e sala ficam na mesma linha; turno e professora/auxiliar também. O botão pequeno de conversa verde ocupa a própria linha do telefone.

## Acesso e ativação

A senha inicial é **NGP1**, válida até o menor prazo entre dez dias após a instalação e 20/09/2026. Cada abertura permite uma tentativa de senha formada por quatro escolhas sucessivas. Ao escolher uma opção incorreta, a tela fica silenciosa e aguarda o fechamento do aplicativo; abrir o app sem errar não conta como falha.

Após três falhas reais em aberturas diferentes, a quarta abertura inicia a ativação. O usuário informa CPF válido, recebe um código de oito caracteres vinculado à data e ao identificador do aparelho e o entrega à versão administrativa. Lá, o responsável escolhe 2, 4, 6, 8, 10 ou 12 meses e gera a nova senha. Essa senha passa a valer até a data calculada.

## Atualização de dados e CDA

O arquivo final levado ao Android é **`.cda`**. Ele é criado pela ferramenta administrativa: reúne os dados, fotos, logos e a data/hora do computador que criou o banco, compacta o conteúdo e o cifra. O Android verifica o formato, alerta sobre duplicidades e grava a data como a data do último banco exibida no rodapé.

| Arquivo de trabalho | Uso |
|---|---|
| `dados.json`, CSV, TSV, TXT, XLS ou XLSX | Banco de trabalho no administrativo. A linha 1 identifica as colunas A–L; os alunos começam na linha 2. |
| `pacote.zip` | Fotos JPG/JPEG com o nome do registro acadêmico L, por exemplo `NA00001.jpg`. |
| `institucional.jpeg` | Logo centralizado único. |
| `institucional1.jpeg` | Logo menor à esquerda. |
| `institucional2.jpeg` | Logo menor à direita. |
| `atualizacao_aaaa-mm-dd.cda` | Pacote cifrado final, importado no Android. |

O logo central remove os dois logos menores. O logo esquerdo remove apenas o central e o esquerdo; preserva o direito. O logo direito segue a regra espelhada.

## Ferramenta administrativa

O pacote `entregaveis/gerencial-escolar-administrativo-html.zip` contém a versão administrativa pronta para Windows. Extraia todos os arquivos na mesma pasta e abra `index.html` no Edge ou Chrome. A ferramenta não exige Node.js, Electron nem internet; o botão **?** abre o manual completo com regras de tabela, pesquisa, fotos, logos, senhas, ativação, CDA e importação por colagem ou arquivo.

## Publicação Android

Abra a versão salva do projeto e use o botão **Publish** na interface para gerar o APK. O `versionCode` Android foi elevado para 2, de modo que o sistema aceita esta versão como atualização de uma versão anterior assinada com o mesmo pacote; a reinstalação manual após desinstalação continua sendo uma limitação do próprio Android.
