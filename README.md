# Chaining tool

Fast way to create chain of responsibility

##Install
```
npm install chaining-tool
```

##Usage
```javascript
var Chain = require('chaining-tool');

var chain = new Chain();

chain.add(function(context, next){
    //Do somethong with context
    next(); //Next handler
});

chain.add(function(context, next){
    //Do somethong with context
    next(false); //Interrupt
});

var context = {"some" : "data"};

chain.start(context, 
    function(context) {
        //success
    }, 
    function(context) {
    //interrupted
    }
);
```
