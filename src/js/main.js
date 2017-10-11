(function($, doc) {
    'use strict';

    var app = (function(){

        console.log('cola imagem monza:', 'http://qcveiculos.com.br/wp-content/uploads/2016/08/Chevrolet-Monza.jpg');
        console.log('cola imagem fucas', 'https://http2.mlstatic.com/D_NQ_NP_639169-MLB25711011564_062017-Q.jpg');
        return {

            init: function init(){
                console.log('app init');
                app.companyInfo();
                app.initEvents()
            },
            
            initEvents: function initEvents(){
                app.getDataCar();
                $('[data-js=form-register]').on('submit', app.handleSubmit);
            },

            handleSubmit: function handleSubmit(event){
                event.preventDefault();
                console.log('submit');
                var $tableCar = $('[data-js="table-car"]').get();

                $tableCar.appendChild(app.createNewCar());
            },
            
            getValueInputs: function getValueInputs(){
                return Array.prototype.reduce.call(
                    $('[data-js="form-register"] input').getAll(), function (acumulated, element, index) {
                         acumulated[element.getAttribute('data-js')] = element.value
                        return acumulated;
                    },{}
                );

            },
            createTr: function setContentRow(objValues){
                
                var $tr = $.createElement('tr');
                $tr.setAttribute('id', 'placa' + app.putPlateCarID(objValues.plate))
                $tr.setAttribute('data-js-table-plateid', app.putPlateCarID(objValues.plate))
                
                var $tdImage = $.createElement('td');
                $tdImage.appendChild(app.createImageCar(objValues));
                $tdImage.setAttribute('data-js-table', 'image');
                $tr.appendChild($tdImage);
                
                var $tdBrand = $.createElement('td');
                $tdBrand.textContent = objValues.brandmodel;
                
                var $tdYear = $.createElement('td');
                $tdYear.textContent = objValues.year;
                
                var $tdPlate = $.createElement('td');
                $tdPlate.textContent = objValues.plate;
                
                var $tdColor = $.createElement('td');
                $tdColor.textContent = objValues.color;

                var arrayTds = [$tdBrand, $tdYear, $tdPlate, $tdColor];
                var valueData = Object.keys(objValues).slice(1);

                arrayTds.forEach(function(item, index){
                    item.setAttribute('data-js-table', valueData[index]);
                    $tr.appendChild(item);
                })

                var $tdButtonRemove = $.createElement('td');
                $tdButtonRemove.appendChild(app.createRemoveButton(objValues.plate));
                $tdButtonRemove.setAttribute('data-js-table', 'remove-td');
                $tr.appendChild($tdButtonRemove);

                return $tr;

            },

            putPlateCarID: function putPlateCarID(objValuePlate){
                return objValuePlate;
            },

            createImageCar: function createImageCar(objValues){
                var $image = $.createElement('img');
                $image.setAttribute('src', objValues.image);
                $image.setAttribute('class', 'img-car');
                return $image;

            },

            createRemoveButton: function buttonRemove(objValuePlate){
                var $button = $.createElement('button');
                $button.setAttribute('class', 'btn-remove');
                $button.setAttribute('data-js-idcar-remove', objValuePlate);
                $button.textContent = "excluir";

                $button.addEventListener('click', app.removeTr, false);
                return $button;
            },

            removeTr: function removeTr(e){
                    e.preventDefault();
                    var $buttonIdCar = this.getAttribute('data-js-idcar-remove');
                    var $trsTableCar = $('[data-js-table-plateid]').getAll();

                    function trGetAtributeId(item){
                        return item.getAttribute('data-js-table-plateid')
                    }

                    function isHasTrButtonRemove(item){
                        if(item === $buttonIdCar){
                            document.querySelector('#placa' + item).remove()
                            app.deleteCarData(item);
                        }
                         
                    }
                    Array.prototype.map.call($trsTableCar, trGetAtributeId).filter(isHasTrButtonRemove);
            },

            createNewCar: function createNewCar(){
                var $fragment = document.createDocumentFragment();
                var dataValues = app.getValueInputs();
                app.saveNewCar(dataValues);
                return $fragment.appendChild(app.createTr(dataValues));
            },

            getDataCar: function getDataCar(){
                console.log('Atualizando a tabela');
                var dataValues;
                var get = new XMLHttpRequest();
                get.open('GET', 'http://localhost:4000/car');
                get.send();
                get.addEventListener('readystatechange', function(){
                    if (!app.isReady.call(this) ){
                        return;
                    }
                    app.updateTable(JSON.parse(this.responseText));
                }, false);
            },

            updateTable: function updateTable(objValueInputs){
                var dataValues = objValueInputs;
                var $fragment = document.createDocumentFragment();
                var $tableCar = $('[data-js="table-car"]').get();

                for(var key in dataValues){
                    $fragment.appendChild(app.createTr(dataValues[key]));
                }

                $tableCar.appendChild($fragment);
                
            },

            deleteCarData: function deleteCarData(valuePlateTr){
                console.log('deletando carro agora');
                var delAjax = new XMLHttpRequest();
                delAjax.open('DELETE', 'http://localhost:4000/car');
                delAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                delAjax.send('&plate=' + valuePlateTr);
            },

            saveNewCar: function saveNewCar(dataValues){
                console.log('Salvando carro...');
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
                return true;
            },

            companyInfo: function companyInfo() {
                var ajax = new XMLHttpRequest();
                ajax.open('GET', '/company.json'); //true habilita forma assincrona
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
