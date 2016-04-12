app.factory('getSelectedBooks', function() {
  var isbns = [];
  var hashs = [];

  return {
    setIsbns: function(values) {
      isbns = values;
    },
    setHashs: function(values) {
      hashs = values;
    },
    getIsbns: function() {
      return isbns;
    },
    getHashs: function() {
      return hashs;
    }
  }
});