$(document).ready(function() {
    
    test("Check if we can load a css and js file", function() {
            expect(2);
            stop();
            
            $.when(
                Loader.load("load/available.js"),
                Loader.load("load/available.css")
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

});