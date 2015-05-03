L.DNC = L.DNC || {};
L.DNC.Forms = L.Class.extend({
  includes: L.Mixin.Events,

  initialize: function ( options ) {
      L.setOptions( this, options );
      // this.children = [];
      // this.domElement = this._buildDomElement();
  },

  /*
  **
  ** RENDER FORM TEMPLATE
  **
  */
  render: function ( operation ) {

      var html =  '<div class="form-inner"><div class="form">'+
                  '<button type="button" class="btn close form-close"><i class="fa fa-times"></i></button>'+
                  '<div class="form-information"><h3 class="form-title">'+operation.title+'</h3>'+
                  '<p class="form-description">'+operation.options.description+'</p></div>'+
                  '<form class="form-inputs">';

      for ( var i = 0; i < operation.options.parameters.length; i++ ) {
          var parameter = operation.options.parameters[i];
          
          var input = '<div class="parameter"><label class="parameter-name">' + parameter.name + '</label>';
          
          if ( parameter.type == 'select') {
              input += this._inputTypeSelect( parameter );
          } else {
              input += this._inputTypeDefault( parameter );
          }

          if (parameter.description) input += '<p class="parameter-description">' + parameter.description + '</p>';
          html += input + '</div>';
      }

      // submit button 
      html += '<button type="button" class="btn form-submit">Execute<i class="fa fa-thumbs-o-up push-left"></i></button>';
      html += '</div></div>';

      var div = document.createElement('div');
      div.className = 'form-outer';
      div.id = 'DNC-FORM';
      div.innerHTML = html;
      document.body.appendChild(div);

      this._formHandlers();
  },

  closeForm: function ( event ) {
      var child = document.getElementById('DNC-FORM');
      child.parentElement.removeChild(child);
  },

  validateForm: function ( form ) {
      // validation stuff here
  },

  _formHandlers: function() {
      var closers = document.getElementsByClassName('form-close');
      for ( var x = 0; x < closers.length; x++ ) {
          closers[x].addEventListener('click', this.closeForm.bind(this));
      }
  },

  _inputTypeDefault: function ( p ) {
      var field = '<input name="' + p.name + '" type="' + p.type + '">';
      return field;
  },

  _inputTypeSelect: function( p ) {
      var select = '<select name="' + p.name + '">';
      for ( var o = 0; o < p.options.length; o++ ) {
          select += '<option value="' + p.options[o] + '"';
          if ( p.options[o] == p.selected ) select += ' selected';
          select += '>' + p.options[o] + '</option>';
      }
      return select + '</select>';
  }
});