L.DNC = L.DNC || {};
L.DNC.Forms = L.Class.extend({
    includes: L.Mixin.Events,

    options: {},

    /*
    **
    ** RENDER FORM TEMPLATE
    **
    */
    render: function ( title, options ) {

        this.title = title;
        this.paramArray = [];
        this.options = {}; // reset options for next form
        L.setOptions(this, options);

        var html = '<div class="form-inner"><div class="form">'+
                '<button type="button" class="btn close form-close"><i class="fa fa-times"></i></button>'+
                '<div class="form-information"><h3 class="form-title">' + this.title + '</h3>'+
                '<p class="form-description">' + this.options.description + '</p></div>'+
                '<form class="form-inputs">';

        if ( this.options.parameters ) {

            for ( var i = 0; i < this.options.parameters.length; i++ ) {
                var parameter = this.options.parameters[i];

                var input = '<div class="parameter"><label class="parameter-name">' + parameter.name + '</label>';

                // select
                if ( parameter.type == 'select') {
                    input += this._inputTypeSelect( parameter );
                // input
                } else {
                    input += this._inputTypeDefault( parameter );
                }

                if (parameter.description) input += '<p class="parameter-description">' + parameter.description + '</p>';
                html += input + '</div>';
            }

        }

        // submit button
        html += '<button type="button" class="btn form-submit" id="operation-submit">Execute<i class="fa fa-thumbs-o-up push-left"></i></button>';
        html += '</div></div>';

        var div = document.createElement('div');
        div.className = 'form-outer';
        div.id = 'DNC-FORM';
        div.innerHTML = html;
        document.body.appendChild(div);
        this.domElement = div;

        this._formHandlers(div);

        return this;
    },

    closeForm: function ( event ) {
        var child = document.getElementById('DNC-FORM');
        child.parentElement.removeChild(child);
    },

    submitForm: function() {
        // function that grabs all parameter information from the
        // current open form, and publishes 'form-submitted' so the
        // operations subscriber can execute the turf operation

        // reset paramArray for new parameters
        this.paramArray = [];

        // get form info
        var inputs = document.getElementsByClassName('param');
        for ( var p = 0; p < inputs.length; p++ ) {
            var paramValue = null;
            if (inputs[p].nodeName == 'SELECT') {
                paramValue = inputs[p].options[inputs[p].selectedIndex].value;
            } else {
                paramValue = inputs[p].value;
                if (inputs[p].type == 'number') paramValue = parseInt(paramValue);
            }
            this.paramArray.push(paramValue);
        }

        if ( this.validateForm() ) {
            this.fire( 'submit', { action: this.title, parameters: this.paramArray } );
            this.closeForm();
        }


    },

    validateForm: function () {
        // do some validation eventually
        return true;
    },

    _formHandlers: function() {
        var closers = document.getElementsByClassName('form-close');
        for ( var x = 0; x < closers.length; x++ ) {
          closers[x].addEventListener('click', this.closeForm.bind(this));
        }

        var submit = document.getElementById('operation-submit');
        submit.addEventListener('click', this.submitForm.bind(this));
    },

    _inputTypeDefault: function ( p ) {
        var field = '<input class="param" name="' + p.name + '" type="' + p.type + '" value="' + p.default + '">';
        return field;
    },

    _inputTypeSelect: function( p ) {
        var select = '<select class="param" type="select" name="' + p.name + '">';
        for ( var o = 0; o < p.options.length; o++ ) {
            select += '<option value="' + p.options[o] + '"';
            if ( p.options[o] == p.default ) select += ' selected';
            select += '>' + p.options[o] + '</option>';
        }
        return select + '</select>';
    }
});
