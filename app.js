var app = {};

jQuery(function($) {

  app.lastError = null;
  window.onerror = function(err, url, line) {
    app.lastError = {
      message:  err,
      sourceUrl: url,
      line: line
    };
  };


  var dom = {
    textarea: $('textarea'),
    response: $('.response'),
    table: $('.table')
  };
  
  app.dom = dom;
  
  dom.textarea.keyup(function() {
  
    var t = dom.textarea;
    
    app.text = t.val();
    
    // MISSING BRACETS
    var missingBracketPattern = /\}\s+\{/g;
    if (app.text.substr(0,1) != '[' && missingBracketPattern.test(app.text)) {
      app.text = app.text.replace(missingBracketPattern, "}, {");
      app.text = "[" + app.text + "]";
    }
    
    dom.response.text(app.text);
    
    try {
      var obj = $.parseJSON(app.text);
    } catch(e) {
      var obj = false;
      app.lastError = e;
    }
    //var obj = $.parseJSON(app.text) || false;
    
    // console.log(['obj', obj]);
    console.log(app.lastError);
    
    if (obj) {
      dom.table.html( createTable(obj) );
    }
    else if (app.lastError) {
      var errorHtml = app.lastError.message;
      
      if (app.lastError.sourceUrl || app.lastError.url) errorHtml += ' - ' + (app.lastError.sourceUrl || app.lastError.url);
      if (app.lastError.line) errorHtml += ': ' + app.lastError.line;
      
      dom.table.html( '<tr><th>' + errorHtml + '</th></tr>' );
    }
  
  
  });
  
  var createTableRow = function(obj) {
    var html = '<tr>';
    
    for (i = 0; i < data.fields.length; i++) {
      html += '<td>' + jandi.serialize(obj[ data.fields[i] ]) + '</td>';
    }
    
    html += '</tr>'
    
    return html;
  };
  
  var createTableHeaderRow = function(obj) {
    var html = '<tr>';
    
    for (i = 0; i < data.fields.length; i++) {
      html += '<th>' + jandi.serialize( data.fields[i] ) + '</th>';
    }
    
    html += '</tr>'
    
    return html;
  };


  var data = {};
  
  
  var createTable = function(obj) {
    if (obj) {
    
      var html = '';
      data.fields = [];
    
      // ARRAY
      if ($.type(obj) == 'array') {
      
      
        var firstRecord = true;
        for (record in obj) {
        
          if (firstRecord) {
          
            // GET FIELDS
            for (field in obj[record]) {
              data.fields.push(field);
            }
            
            // header
            html += createTableHeaderRow(obj[record]);
          
          }
          
          html += createTableRow(obj[record]);
          
          firstRecord = false;        
        }
      
      }
      // OBJ
      else {
        
        console.log('SINGLE OBJECT');
        
        html += createTableHeaderRow(obj);
        html += createTableRow(obj);
        
      }
    
    }
    
    return html;  
  
  };




});