/**
 * NodeJS Callback Example
 * Uma função de callback tem como responsabilidade invocar uma função recebida por
 * parâmetro. Essa função fica responsável do que fazer com o resultado de uma operação,
 * como salvar no banco de dados, escrever em um arquivo ou imprimir um log na tela.
 * 
 * @author Davi Souto
 * @since 25/07/2022
 */

const axios = require("axios"); // Lib de requisisões
const fs = require('fs'); // Lib de leitura/escrita de arquivos

/**
 * Usaremos a api pública de buscar cep para buscar um cep e receberemos uma função
 * de callback que será responsável por fazer algo com esse dado
 */
const getCep = async (cep, callback_fn) => {
  // Buscar cep via Axios (Lib de request)
  // Doc: https://viacep.com.br/
  const response = await axios({
    method: "get",
    url: "https://viacep.com.br/ws/" + cep + "/json/"
  });


  const data = response.data;

  /**
   * Verificação básica se é recebido o parâmetro callback_fn e se é uma função
   */
  if (callback_fn && typeof callback_fn == "function") {
    /** 
     * Aqui executamos a função de callback passando como parâmetro o endereço retornado
     * pela API ViaCep
     * 
     * Note que a o parâmetro callback_fn é uma função recebida por parâmetro, por isso
     * chamamos de "callback", mas o nome do parâmetro pode ser o que você quiser
     */
    callback_fn(data);
  }
}

/**
 * Vamos a alguns exemplos:
 * Nesse primeiro caso, chamamos a função sem passar o parâmetro de callback, ela ira vuscar
 * o cep porém nada mais acontecerá
 */
getCep("02266001");

/**
 * Nesse segundo caso estamos passando uma função anônima como callback, ele ira imprimir
 * na tela usando console log o resultado da busca por CEP
 * 
 * Note que a nossa função anônima recebe um parâmetro data, que pode ser qualquer outro nome,
 * mas é importante receber porque lá na nossa função getCep quando invocamos o callback passamos
 * o resultado da API como exemplo
 */
getCep("02266001", (data) => {
  console.log("Endereço do CEP " + data.cep + ":");
  console.log(data);
})

/**
 * Nesse terceiro caso, iremos criar uma função para escrever em um arquivo o resultado da API
 * e passar essa função como parâmetro para nossa função getCep
 * 
 * Primeiro vamos criar uma função que recebe um json e salva em um arquivo chamado response.json
 */
const saveResponse = (json) => {
  // A variavel global do NodeJS "__dirname" informa o diretório em que o node está sendo executado
  const root_dir = __dirname;

  // Aqui informaremos o diretório que será salvo e o nome do arquivo, exemplo: /meu/diretorio/response.json
  const save_file = root_dir + "/response.json";
  
  /**
   * Salvar o arquivo usando o fs.writeFile
   * O primeiro parâmetro espera o path (local) do arquivo, que é nosso save_file
   * O segundo parâmetro espera uma string, por isso chamamos a função JSON.stringify que
   * transforma nosso Objeto JSON em uma string
   * O terceiro parâmetro também é um callback e é obrigatório! Ele espera uma função que receba
   * dois parâmetros: O primeiro é o erro (obrigatório), o segundo o resultado (opcional)
   * Vamos passar no terceiro parâmetro uma função anônima que verifica se houve um erro,
   * se houver, imprimir na tela o erro, se não, informar que o arquivo foi salvo com sucesso
   */
  fs.writeFile(save_file, JSON.stringify(json), (err) => {
    if (err) {
      console.log("Erro ao salvar o arquivo:", err);
    } else {
      console.log("Arquivo salvo com sucesso em:", save_file);
    }
  });
}

/**
 * Tendo nossa função de salvar o arquivo recebendo um objeto JSON como parâmetro, agora
 * podemos chamar nossa função getCep passando o CEP e a função criada como callback
 */
getCep("02266001", saveResponse);

/**
 * Detalhes finais:
 * Por ser um callback, essa função é executada dentro de outra função, e pode ocorrer
 * de ser executada antes/depois do esperado de acordo com a regra de negócio implementada.
 * 
 * Lembrando que a função getCep é assíncrona (async), logo se não usarmos um await o Node
 * vai continuar executando as próximas linhas sem esperar finalizar a chamada.
 * No meu caso, o arquivo foi salvo antes de imprimir na tela o endereço do CEP, mas isso
 * pode variar de acordo com o processamento da máquina.
 * 
 * Caso queira que isso não aconteça, precisariamos utilizar um await na função getCep()
 * e na função de callback (que obrigatoriamente deveria ser async) para que isso não ocorra.
 */


/**
 * Alguns exercícios a se fazer:
 *  - Utilizar a função getCep passando um callback para adicionar o número do endereço no resultado e imprimir na tela
 *  - Utilizar a função getCep passando um callback para salvar no banco de dados o endereço retornado
 *  - Criar uma função getCepXml que busque o CEP no ViaCep e chame um callback passando o CEP em XML,
 *    depois utilizar um callback para imprimir o XML na tela, salvar em um arquivo .xml ou salvar no banco de dados
 */