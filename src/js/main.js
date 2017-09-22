(function($, doc) {
    'use strict';

    var app = (function(){

        console.log('cola imagem', 'http://bestcars.uol.com.br/bc/wp-content/uploads/2013/09/Opel-Monza-1978-01.jpg');
        console.log('cola imagem', 'http://qcveiculos.com.br/wp-content/uploads/2016/08/Chevrolet-Monza.jpg');
        return {

            init: function init(){
            
                console.log('app init');
                this.companyInfo();
                this.initEvents()

            },
            
            initEvents: function initEvents(){
                $('[data-js=form-register]').on('submit', app.handleSubmit);
            },

            handleSubmit: function handleSubmit(event){
                
                event.preventDefault();
                console.log('submit');
                var $tableCar = $('[data-js="table-car"]').get();

                $tableCar.appendChild(app.createNewCar());
            },
            
            getValueInputs: function getValueInputs(){
                // return Array.prototype.map.call(
                //     $('[data-js="form-register"] input[type="text"]').getAll(), function(element, value) {
                //         return element.value;

                //     // Validar depois se for o caso
                //     // if( !(element.value === '') )
                //     //   return element.value;
                //     // return alert('Por favor preecha os campos.'); Validando os campos
                //     }
                // );
                return Array.prototype.map.call(
                    $('[data-js="form-register"] input').getAll(), function(element, index) {
                        console.log('element', element.getAttribute('data-js=brand-model'));
                        console.log('value', index);
                        console.log('valor do elemento', element.value);
                        console.log('obj', { 
                            imageCar: element.value, 
                            brandModelCar: element.value, 
                            yearCar: element.value, 
                            plateCar: element.value, 
                            colorCar: element.value, 
                        });
                        
                        return element;
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
                var $image = $.createElement('img');
                $image.setAttribute('src', $('[data-js="image"]').get().value);
                $image.setAttribute('class', 'img-car');
                return $image;

            },

            createRemoveButton: function buttonRemove(){
                var $button = $.createElement('button');
                $button.setAttribute('class', 'btn-remove');
                $button.textContent = "excluir";

                $button.addEventListener('click', app.removeTr, false);
                return $button;
            },

            removeTr: function removeTr(e){
                e.preventDefault();
                this.parentNode.parentNode.remove();
                
            },

            createNewCar: function createNewCar(){

                var $fragment = document.createDocumentFragment();
                var $tr = $.createElement('tr');
                var $tdImage = $.createElement('td');
                var $tdBrand = $.createElement('td');
                var $tdYear = $.createElement('td');
                var $tdPlate = $.createElement('td');
                var $tdColor = $.createElement('td');
                var $tdButton = $.createElement('td');
                $tdImage.appendChild(app.createImageCar());
                $tdButton.appendChild(app.createRemoveButton());

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

            postNewCar: function postNewCar(){

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


