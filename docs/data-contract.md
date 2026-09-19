# Contrato de Dados e Segurança Local

## Estratégia de dados

A versão Android funciona sem internet. A lista de alunos é gravada em um arquivo local do aplicativo e as credenciais ficam no armazenamento seguro do aparelho. A versão administrativa do Windows exporta um arquivo JSON com extensão sugerida `.cedb`, que pode ser transferido ao telefone e selecionado no menu **BANCO DE DADOS**.

| Item | Regra adotada |
|---|---|
| Formato de exportação | JSON UTF-8, campo `formato` igual a `consulta-alunos-import` e `versao` igual a `1`. |
| Chave de atualização | Nome completo normalizado + data de nascimento no padrão `AAAA-MM-DD`. |
| Conflito de dados | O registro importado substitui completamente o registro local com a mesma chave. |
| Pesquisa | Comparação sem diferenciação por acentos e por letras maiúsculas/minúsculas. |
| Foto | Campo opcional `fotoBase64`; a ausência mantém o espaço visual reservado no perfil. |
| Imagem institucional | Campo opcional `imagemInstitucionalBase64`; a ausência mantém a faixa institucional vazia. |

## Estrutura de um aluno

```json
{
  "id": "a3d4f9e9-7f5e-4f09-88e7-5d61bd3fe4b7",
  "nomeCompleto": "Ana Beatriz da Silva",
  "nomeResponsavel": "Mariana da Silva",
  "telefoneResponsavel": "(11) 91234-5678",
  "dataNascimento": "2016-08-21",
  "anoSerie": "4º ano",
  "sala": "Sala 12",
  "turno": "Manhã",
  "fotoBase64": "data:image/jpeg;base64,...",
  "condicaoEspecifica": "Alergia alimentar — conferir orientações da escola.",
  "retiradaAutorizada": "José da Silva — tio materno",
  "atualizadoEm": "2026-08-22T12:00:00.000Z"
}
```

## Regras de acesso

A senha inicial é **NGP1**. A geração manual usa quatro caracteres sem repetição, escolhidos entre letras maiúsculas e números de 1 a 9. O algoritmo recusa pares consecutivos de letras ou números. A senha é preservada de forma criptografada no aparelho.

Durante os dois primeiros dias após a instalação, a tela de acesso apresenta um lembrete discreto a cada terceira abertura, solicitando que o responsável gere uma nova senha. A tentativa de senha é feita por quatro escolhas sucessivas; em cada uma, o caractere correto aparece dentro de apenas uma das quatro opções de três caracteres. Todas as doze letras e números da rodada são distintos. Ao escolher uma opção incorreta, a tela apenas apresenta novas opções e o acesso fica bloqueado até que o aplicativo seja encerrado e aberto novamente.

| Evento | Comportamento |
|---|---|
| Dia 1 de janeiro, abril, julho ou novembro | A tela de acesso mostra um código `ATV-AAAAMM-XXXXXX` acima das opções. |
| Código informado no Windows | A ferramenta administrativa calcula a senha de ativação correspondente. |
| Senha de ativação inserida no Android | O Android a aceita somente na data do código e a passa a guardar como senha ativa para os acessos posteriores. |
| Outra data | O aplicativo aceita somente a senha ativa já gravada no dispositivo. |

O cálculo da senha trimestral usa o mesmo algoritmo de compatibilidade na versão administrativa e no aplicativo Android. O código de ativação depende do identificador local de instalação e do período, portanto é específico daquele aparelho e daquela data de renovação.

## Operação offline e contato externo

Todos os dados, fotos, imagem institucional e a tipografia padrão do aplicativo estão no próprio aparelho ou no arquivo de atualização importado. O aplicativo não consulta a internet para pesquisar, carregar fonte, exibir imagens ou validar credenciais. O único ponto que pode abrir um recurso externo é o botão **WhatsApp**, exibido quando houver `telefoneResponsavel`; ele abre deliberadamente a conversa pelo aplicativo ou navegador disponível no aparelho.
