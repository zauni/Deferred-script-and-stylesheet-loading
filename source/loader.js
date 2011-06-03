(function(global, $, undef) {

    /**
     * @class Loader
     * @example
     *      $.when(
     *          Loader.load("js/foo.js"),
     *          Loader.load("css/bar.css")
     *      ).then(function() {
     *          console.log("loaded both!");
     *      });
     *      
     *      or
     *      
     *      Loader.load("js/thing.js").then(function() {
     *          var t = new Thing();
     *      });
     */
    global.Loader = (function() {
        var loaded = {},
            waitingTime = 3000;
        
        /**
         * Load a stylesheet or a script
         * 
         * @param {String} source
         * @return {Deferred} returns a Deferred object where one can add callbacks
         */
        function load(source) {
            var prefix,
                splitted;
            
            if(typeof source != "string") {
                loaded[source] = new $.Deferred();
                loaded[source].reject("You tried to load something else: '"+(typeof source)+"'!");
            }
            
            // prefix detected
            if(source.indexOf("!") > -1 && (splitted = source.split("!"))) {
                prefix = splitted[0];
                source = splitted[1];
            }
            
            // if it was loaded before, return the old deferred
            if(loaded[source]) {
                return loaded[source];
            }
            
            // check which type we have to load
            if(prefix == "css" || source.indexOf(".css") > -1) {
                loaded[source] = loadStyle(source);
            }
            else if(prefix == "js" || source.indexOf(".js") > -1) {
                loaded[source] = loadScript(source);
            }
            else {
                loaded[source] = new $.Deferred();
                loaded[source].reject("'" + source + "' is not a known filetype and can not be loaded!");
            }
            return loaded[source];
        }
        
        /**
         * loads a stylesheet into the head
         * @param {String} source
         * @return {Deferred} returns a "Promise" and not the direct deferred, otherwise it could be manipulated
         */
        function loadStyle(source) {
            var deferred = new $.Deferred(),
                link = $("<link />", {
                    rel: "stylesheet",
                    type: "text/css",
                    href: source
                }),
                callback = function() {
                    deferred.resolve();
                    console.log("resolved!!", deferred.isResolved(), link);
                };
                
            link.appendTo("head");
            
            // onload handler for webkit and gecko - both are not supporting the "onload" event on link elements
            // 
            if($.browser.webkit || $.browser.mozilla) {
                (function poll(link) {
                    setTimeout(function() {
                        var sheet, rules, ready;
                        try {
                            // IE is using "styleSheet" and "rules" but this browser shouldn't
                            // come that far so these statements are just for added safety
                            sheet = link.sheet || link.styleSheet;
                            rules = sheet.cssRules || sheet.rules;
                            
                            ready = rules ? rules.length > 0 : rules !== undef;
                            
                            console.log(ready);
                            
                            if(ready) {
                                callback();
                            }
                            else {
                                poll(link);
                            }
                        }
                        catch(exc) {
                            console.log(exc);
                            // If it is a security error than the stylesheet was loaded from a different domain
                            if((exc.code == 1000) || (exc.message == "security" || exc.message == "denied")) {
                                callback();
                            }
                            // otherwise, continue to poll
                            else {
                                poll(link);
                            }
                        }
                    }, 30);
                })(link[0]);
            }
            else {
                link[0].onload = callback;
                link[0].onerror = function() {
                    deferred.reject("Could not load '"+source+"'.");
                };
            }
            
            // don't wait forever that a stylesheet is loaded
            setTimeout(function() {
                if(!deferred.isResolved()) {
                    deferred.reject("Could not load '"+source+"' in " + waitingTime/1000 + " seconds.");
                }
            }, waitingTime);
            
            return deferred.promise();
        }
        
        /**
         * loads a script async
         * @param {String} source
         * @return {Deferred}
         */
        function loadScript(source) {
            return $.getScript(source);
        }
        
        /**
         * Public interface
         */
        return {
            load: load,
            waitingTime: waitingTime
        };
    })();

})(this, this.jQuery);
