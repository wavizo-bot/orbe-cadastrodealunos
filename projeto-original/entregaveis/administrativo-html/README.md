# Gerencial Escolar — Administrativo

Esta versão administrativa funciona localmente no Windows. Extraia toda a pasta do pacote e abra `index.html` no Edge ou Chrome. Mantenha a pasta `vendor` junto do HTML: ela contém as bibliotecas locais de ZIP, planilhas e cifragem. Não é necessário instalar Node.js, Electron ou acessar a internet.

## Banco de dados

A primeira linha da tabela informa as letras A–L; os alunos começam na segunda linha. A posição física das colunas pode mudar, desde que a letra seja mantida.

| Letra | Campo |
|---|---|
| A | Nome completo |
| B | Responsável |
| C | Aviso de atenção, exibido em amarelo acima da foto |
| D | Informação de saída ou retirada, exibida abaixo da foto |
| E | Telefone do responsável |
| F | Nascimento |
| G | Ano/série |
| H | Sala |
| I | Turno |
| J | Professora |
| K | Auxiliar |
| L | Registro acadêmico ou identificador único |

São aceitos dados colados diretamente de Google Planilhas, CSV, TSV, TXT, XLS, XLSX e JSON. As fotos devem estar num ZIP e receber o mesmo nome do registro L, como `NA00001.jpg`.

## Logos e atualização

Use `institucional.jpeg` para um logo central; `institucional1.jpeg` para o lado esquerdo; e `institucional2.jpeg` para o lado direito. O central remove os dois menores; os menores preservam o logo do lado oposto.

**GERAR ATUALIZAÇÃO CDA** cria o arquivo comprimido e cifrado que deve ser transferido manualmente ao Android. Ele contém dados, fotos, logos e a data/hora do computador que criou a base. O aplicativo Android importa o CDA pelo menu **Dados e acesso**.

## Senha e ativação

Depois de três falhas em aberturas diferentes do Android, o usuário informa CPF e vê um código de oito caracteres. Informe ambos no administrativo, selecione a validade de 2, 4, 6, 8, 10 ou 12 meses e escolha **GERAR SENHA**. A senha exibida é a nova senha do usuário.

O botão **?** da própria ferramenta contém este manual em formato de consulta rápida.
