(function(global, $) {

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
        var loaded = {};
        
        /**
         * Load a stylesheet or a script
         * 
         * @param {String} source
         * @return {Deferred} returns a Deferred object where one can add callbacks
         */
        function load(source) {
            if(typeof source != "string") {
                $.error("You tried to load something else: '"+(typeof source)+"'!");
            }
            
            // if it was loaded before, return the old deferred
            if(loaded[source]) {
                return loaded[source];
            }
            
            if(source.indexOf(".css") > -1) {
                loaded[source] = loadStyles(source);
            }
            else if(source.indexOf(".js") > -1) {
                loaded[source] = loadScript(source);
            }
            else {
                $.error("'" + source + "' is not a known filetype and can not be loaded!");
            }
            return loaded[source];
        }
        
        /**
         * loads a stylesheet into the head
         * @param {String} source
         * @return {Deferred}
         */
        function loadStyles(source) {
            var deferred = new $.Deferred();
                
            $("<link />", {
                rel: "stylesheet",
                type: "text/css",
                href: source
            }).appendTo("head");
            
            deferred.resolve();
            return deferred;
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
            load: load
        };
    })();

})(this, this.jQuery);
