(function($, doc) {
    'use strict';

    var app = (function(){

        console.log('cola imagem', 'http://bestcars.uol.com.br/bc/wp-content/uploads/2013/09/Opel-Monza-1978-01.jpg');
        console.log('cola imagem', 'http://qcveiculos.com.br/wp-content/uploads/2016/08/Chevrolet-Monza.jpg');
        return {

            init: function init(){
                console.log('app init');
                app.companyInfo();
                app.initEvents()
            },
            
            initEvents: function initEvents(){
                app.updateTable();
                
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
                

                return Array.prototype.reduce.call(
                    $('[data-js="form-register"] input').getAll(), function (acumulated, element, index) {
                         acumulated[element.getAttribute('data-js')] = element.value
                        return acumulated;
                    },{}
                );

            },
            
            setValueAndCreateTr: function setContentRow(listElementValues){
                var dataValues = app.getValueInputs();
                var $tr = $.createElement('tr');
                
                var $tdImage = $.createElement('td');
                $tdImage.appendChild(app.createImageCar());
                
                var $tdBrand = $.createElement('td');
                $tdBrand.textContent = dataValues.brandmodel;

                var $tdYear = $.createElement('td');
                $tdYear.textContent = dataValues.year;

                var $tdPlate = $.createElement('td');
                $tdPlate.textContent = dataValues.plate;

                var $tdColor = $.createElement('td');
                $tdColor.textContent = dataValues.color;
                
                var $tdButtonRemove = $.createElement('td');
                $tdButtonRemove.appendChild(app.createRemoveButton());

                var arrayTds = [$tdImage, $tdBrand, $tdYear, $tdPlate, $tdColor, $tdButtonRemove];

                arrayTds.forEach(function(item, index){
                    $tr.appendChild(item);
                })

                return $tr;

            },

            createImageCar: function createImageCar(){
                var $image = $.createElement('img');
                $image.setAttribute('src', app.getValueInputs().image);
                $image.setAttribute('class', 'img-car');
                return $image;

            },

            createRemoveButton: function buttonRemove(){
                var $button = $.createElement('button');
                $button.setAttribute('class', 'btn-remove');
                $button.textContent = "excluir";

                function removeTr(e){
                    e.preventDefault();
                    this.parentNode.parentNode.remove();
                }

                $button.addEventListener('click', removeTr, false);
                return $button;
            },

            createNewCar: function createNewCar(){
                var $fragment = document.createDocumentFragment();
                app.saveNewCar();
                return $fragment.appendChild(app.setValueAndCreateTr());
            },

            updateTable: function updateTable(){
                console.log('atualizando tabela');
            },

            saveNewCar: function saveNewCar(){
                console.log('Salvando carro...');
                var dataValues = app.getValueInputs(); 
                var post = new XMLHttpRequest();
                post.open('POST', 'http://localhost:4000/car');
                post.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                post.send(
                    'image=' + dataValues.image +
                    '&brandModel=' + dataValues.brandmodel +
                    '&year=' + dataValues.year +
                    '&plate=' + dataValues.plate +
                    '&color=' + dataValues.color
                );
                console.log('Carro salvo...');
            },

            companyInfo: function companyInfo() {
                var ajax = new XMLHttpRequest();
                ajax.open('GET', '/company.json', 'true'); //true habilita forma assincrona
                ajax.send();
                ajax.addEventListener('readystatechange', app.getCompanyInfo, false);

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
