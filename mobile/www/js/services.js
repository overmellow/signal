angular.module('starter.services', [])
.factory("LSFactory", function($window) {
  return {
    setData: function(key, val, stringify) {
      if(stringify)
      {
        val = JSON.stringify(val);
      }     
      $window.localStorage && $window.localStorage.setItem(key, val);
      return this;
    },
    getData: function(key, stringify) {
      if(stringify)
      {
        return JSON.parse($window.localStorage && $window.localStorage.getItem(key))
      }
      return $window.localStorage && $window.localStorage.getItem(key);
    },
    removeData: function(key) {
      return $window.localStorage && $window.localStorage.removeItem(key);
    }
  };
});
