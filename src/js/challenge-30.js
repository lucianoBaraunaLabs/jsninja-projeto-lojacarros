(function($, doc) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  var app = (function(){

    return {

      init: function init(){
        console.log('app init');
        this.companyInfo();
        this.initEvents()
      },

      initEvents: function initEvents(){
        $('[data-js=form-register]').on('submit', this.handleSubmit);
      },

      handleSubmit: function handleSubmit(event){
        event.preventDefault();
        console.log('submit');
        var $tableCar = $('[data-js="table-car"]').get();

        $tableCar.appendChild(app.createNewCar());
      },

      getValueInputs: function getValueInputs(){
				var teste = $('[data-js="form-register"] input[type="text"]'); // Dúvida fdaciuk: Aqui com a lib DOM.JS não funciona e para solucionar precisei passar a declaração completa.
        return Array.prototype.map.call(
					doc.querySelectorAll('[data-js="form-register"] input[type="text"]'), function(element, value) {
						console.log('aqui e o this', this);
              return element.value;

            // Validar depois se for o caso
            // if( !(element.value === '') )
            //   return element.value;
            // return alert('Por favor preecha os campos.'); Validando os campos
          }
        );

			},

			setValueInputs: function setContentRow(listElementValues){
				var listValuesInputsText = app.getValueInputs();

				for (var i = 0; i < listElementValues.length; i++) {
					listElementValues[i].textContent = listValuesInputsText[i];
				}

			},

			appendInfoCar: function appendInfoCar($parentElement, listElementsAppend) {
				for (var i = 0; i < listElementsAppend.length; i++) {
					$parentElement.appendChild(listElementsAppend[i]);
				}
			},

      createNewCar: function createNewCar(){

        function createDomElement(element) {
          return document.createElement(element);
        }

        var $fragment = document.createDocumentFragment();
        var $tr = createDomElement('tr');
        var $tdImage = createDomElement('td');
        var $image = createDomElement('img');
        var $tdBrand = createDomElement('td');
        var $tdYear = createDomElement('td');
        var $tdPlate = createDomElement('td');
        var $tdColor = createDomElement('td');

        $image.setAttribute('src', $('[data-js="image"]').get().value);
				$image.setAttribute('class', 'img-car');
				$tdImage.appendChild($image);

				app.setValueInputs([
						$tdBrand,
						$tdYear,
						$tdPlate,
						$tdColor
				]);

				app.appendInfoCar($tr, [
					$tdImage,
					$tdBrand,
					$tdYear,
					$tdPlate,
					$tdColor
				]);

        return $fragment.appendChild($tr);
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', '/company.json', 'true'); //true habilita forma assincrona
        ajax.send();
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
        console.log(this);
      },

      getCompanyInfo: function getCompanyInfo() {
        if(!app.isReady.call(this)){
          return;
        }

        var data = JSON.parse(this.responseText);
        var $companyName = $('[data-js="company-name"]').get();
        var $companyPhone = $('[data-js="company-phone"]').get();

        $companyName.textContent = data.name;
        $companyPhone.textContent = data.phone;

      },

      isReady: function isReady(){
        return this.readyState === 4 && this.status === 200;
      }

    };

  })()

  app.init();

})(window.DOM, document);


