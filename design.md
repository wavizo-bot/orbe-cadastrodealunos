# Plano de Interface — Consulta de Alunos

## Objetivo de uso

O aplicativo atende inspetores de alunos, professores e equipe pedagógica durante a rotina escolar. A interface será projetada para uma tela Android em orientação vertical 9:16, priorizando leitura rápida, alvos de toque amplos e uso com uma mão. O fluxo inicia bloqueado por senha e conduz diretamente à busca do estudante, sem autenticação por conta ou dependência de internet.

## Diretrizes visuais

O app terá uma aparência institucional serena, inspirada em sinalização escolar: azul-marinho para navegação e títulos, azul-petróleo para ações primárias e superfícies claras para leitura. O espaço institucional superior será mantido como uma faixa reservada na tela de busca, podendo receber posteriormente logotipo, imagem da escola ou comunicação visual enviada pela versão administrativa.

| Elemento | Cor | Uso |
|---|---:|---|
| Azul institucional | `#12365A` | Cabeçalhos, botões principais e foco visual |
| Azul-petróleo | `#0E7490` | Ação ativa e detalhes de navegação |
| Fundo claro | `#F5F7FA` | Fundo das telas |
| Superfície | `#FFFFFF` | Campos, cartões e fichas |
| Aviso de condição | `#FFF0D6` | Faixa de deficiência ou condição específica |
| Informação de retirada | `#E6F2EA` | Faixa discreta de pessoa autorizada a retirar |
| Texto principal | `#16212C` | Nome e dados relevantes |
| Texto secundário | `#5B6775` | Rótulos, instruções e metadados |

## Lista de telas

| Tela | Conteúdo e função |
|---|---|
| Acesso por senha | Mostra o código de ativação nas datas previstas, campo de resposta formado por escolhas e doze botões com três caracteres. Não revela tentativa incorreta. |
| Busca de alunos | Exibe uma faixa superior reservada para imagem institucional, campo de pesquisa, acesso ao menu **BANCO DE DADOS**, resultados por nome e paginação quando houver mais de dez registros. |
| Perfil do aluno | Mostra condição específica somente quando houver registro, espaço para fotografia, nome completo, responsável, nascimento e idade, ano/série, sala, turno e informação de retirada autorizada somente quando existir. |
| Banco de dados | Reúne as ações protegidas **IMPORTAR**, **GERAR SENHA** e **REINICIAR**, com confirmação para ações destrutivas. |
| Importação | Permite selecionar o arquivo de atualização gerado no Windows, validar seu formato e substituir/mesclar os registros conforme a chave nome + data de nascimento. |
| Geração de senha | Exibe a nova senha aleatória uma única vez ao responsável pela administração do dispositivo, com regras de não repetição e não sequência. |

## Fluxos principais

O fluxo de acesso começa com a abertura do aplicativo. O usuário escolhe sucessivamente um caractere por vez a partir dos conjuntos apresentados; quatro escolhas corretas liberam a busca. Uma tentativa incorreta mantém a tela neutra e bloqueia novas tentativas até o encerramento e a reabertura do aplicativo.

Na tela de busca, o usuário digita parte do nome e recebe até dez resultados por página. Se a busca encontrar mais de dez estudantes, controles de anterior, próximo e páginas permitem avançar pela lista. Ao tocar em um resultado, o perfil detalhado é aberto. O botão físico de voltar retorna ao resultado anterior ou à busca.

Na tela **BANCO DE DADOS**, o usuário pode importar o arquivo produzido pela ferramenta de Windows, gerar uma senha de quatro caracteres e reiniciar os dados locais. A importação substitui o estudante que tenha a mesma combinação de nome normalizado e data de nascimento e preserva os demais registros já armazenados.

## Acessibilidade e comportamento

Os elementos interativos terão área mínima aproximada de 44 dp, contraste suficiente e rótulos legíveis. O conteúdo do perfil poderá rolar, mas as informações essenciais aparecem na porção inicial. Mensagens de erro de senha não serão exibidas, por requisito funcional; para ações administrativas e importações, o aplicativo fornecerá retorno claro de sucesso, cancelamento ou arquivo inválido.
