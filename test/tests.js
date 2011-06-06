$(document).ready(function() {
    
    var jsDef = Loader.load("load/available.js"),
        cssDef = Loader.load("load/available.css"),
        crossJsDef = Loader.load("http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"),
        crossCssDef = Loader.load("http://code.jquery.com/qunit/git/qunit.css"),
        falseDef = Loader.load("thingy.txt");
    
    test("Does the loader return a Deferred Object", function() {
        notEqual(typeof jsDef, "undefined", "Object found");
        ok($.isFunction(jsDef.isResolved), "Deferred Object found");
    });
    
    test("Check if we can load a css and js file", function() {
        expect(2);
        stop();

        $.when(
            jsDef,
            cssDef
        ).then(
            function() {
                notEqual(typeof $.fn.foo, "undefined", "Is JavaScript available");
                equal($("#css-available-test").css("display"), "inline", "Is CSS available");
                start();
            },
            function() {
                notEqual(typeof $.fn.foo, "undefined", "Is JavaScript available");
                equal($("#css-available-test").css("display"), "inline", "Is CSS available");
                start();
            }
        );
    });
    
    test("Check if the state of the Deferred Object can be changed outside of the Loader", function() {
        ok(!$.isFunction(jsDef.resolve), "Deferred cannot be resolved");
        ok(!$.isFunction(jsDef.reject), "Deferred cannot be rejected");
    });
    
    test("Check if Deferred can handle cross domain files", function() {
        expect(2);
        stop();
        
        crossJsDef.done(function() {
            ok(crossJsDef.isResolved(), "JS Deferred got resolved");
        });
        
        crossCssDef.done(function() {
            ok(crossCssDef.isResolved(), "CSS Deferred got resolved");
        });
        
        setTimeout(function() {
            start();
        }, 1500);
    });
    
    test("Check if Deferred can handle false input filetype", function() {
        expect(2);
        stop(500);
        falseDef.fail(function(msg) {
            ok(falseDef.isRejected(), "Deferred got rejected");
            ok(msg.length > 0, "Error message is provided");
            start();
        });
    });
    
    test("Check if error timeout is aborting the loading", function() {
        expect(4);
        stop();
        Loader.waitingTime = 0;
        
        var def1 = Loader.load("http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.0/themes/base/jquery-ui.css");
        var def2 = Loader.load("http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js");
        def1.fail(function(msg) {
            ok(def1.isRejected(), "Deferred got rejected");
            ok(msg.length > 0, "Error message is provided");
        });
        def2.fail(function(msg) {
            ok(def2.isRejected(), "Deferred got rejected");
            ok(msg.length > 0, "Error message is provided");
        });
        
        setTimeout(function() {
            start();
        }, 500);
    });

});