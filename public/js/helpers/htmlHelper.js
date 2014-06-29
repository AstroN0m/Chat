define('htmlHelper',[], function() {
  
  var encodeHtml = function(str) {
      function replaceTag(tag) {
        var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
        };

        return tagsToReplace[tag] || tag;
        };
      
    return str.replace(/[&<>]/g, replaceTag);
  };
  
  return {
      encodeHtml: encodeHtml
  };

});