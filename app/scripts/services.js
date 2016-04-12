app.factory('books', function() {
  var isbns = [];
  var hashs = [];
  var books = [];

  return {
    setSelectedIsbns: function(values) {
      isbns = values;
    },
    setSelectedHashs: function(values) {
      hashs = values;
    },
    getSelectedIsbns: function() {
      return isbns;
    },
    getSelectedHashs: function() {
      return hashs;
    },
    setBooks: function(values){
      books = values;
    },
    getBooks: function(){
      return books;
    }
  }
});