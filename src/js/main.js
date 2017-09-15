(function($, doc) {
    'use strict';

    var app = (function(){

        function createDomElement(element) {
            return document.createElement(element);
        }

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

            createImageCar: function createImageCar(){
                
                var $image = createDomElement('img');
                $image.setAttribute('src', $('[data-js="image"]').get().value);
                $image.setAttribute('class', 'img-car');

                return $image;

            },

            buttonRemove: function buttonRemove(){

                var $button = createDomElement('button');
                $button.setAttribute('class', 'btn-remove');
                $button.textContent = "Excluir";
                

                // console.log($button);
                $button.addEventListener('click', function(e){
                    e.preventDefault();
                    console.log('cliquei');
                },false);

                // $($button).on('click', function(e){
                //     e.eventPreventDefault();
                //     console.log('opa');
                // });

                return $button;
                
            },

            createNewCar: function createNewCar(){

                var $fragment = document.createDocumentFragment();
                var $tr = createDomElement('tr');
                var $tdImage = createDomElement('td');
                var $tdBrand = createDomElement('td');
                var $tdYear = createDomElement('td');
                var $tdPlate = createDomElement('td');
                var $tdColor = createDomElement('td');
                var $tdButton = createDomElement('td');
                $tdImage.appendChild(app.createImageCar());
                $tdButton.appendChild(app.buttonRemove());

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
                    $tdColor,
                    $tdButton
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


