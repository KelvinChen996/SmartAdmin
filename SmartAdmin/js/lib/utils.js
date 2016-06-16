/// <reference path="../../typings/tsd.d.ts" />
String.prototype.format = function () {
    var d = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        d[_i - 0] = arguments[_i];
    }
    var args = (arguments.length === 1 && $.isArray(arguments[0])) ? arguments[0] : arguments;
    var formattedString = this;
    for (var i = 0; i < args.length; i++) {
        var pattern = new RegExp("\\{" + i + "\\}", "gm");
        formattedString = formattedString.replace(pattern, args[i]);
    }
    return formattedString;
};
_.mixin({
    guid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});
var utils;
(function (utils) {
    function is_null_or_empty(val) {
        return val === null || val === undefined
            || !val || (0 === val.length);
    }
    utils.is_null_or_empty = is_null_or_empty;
    function exec(spin, call) {
        var d = Q.defer();
        spin.removeClass('hidden');
        d.promise.finally(function () {
            spin.addClass('hidden');
        });
        call(d);
        return d.promise;
    }
    utils.exec = exec;
    function resolve_rst(rst) {
        if ($.isArray(rst.results)) {
            var r = rst.results;
            if (r.length > 0) {
                return r[0];
            }
        }
    }
    utils.resolve_rst = resolve_rst;
    function guid() {
        return _.guid();
    }
    utils.guid = guid;
    function scrollToObj(target, offset, time) {
        $('html, body').animate({ scrollTop: $(target).offset().top - offset }, time);
    }
    utils.scrollToObj = scrollToObj;
    function loadfile(file) {
        var d = Q.defer();
        require([file], function (f) {
            d.resolve(f);
        }, function (err) {
            d.reject(err);
        });
        return d.promise;
    }
    utils.loadfile = loadfile;
    utils.Path = {
        join: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var parts = [];
            for (var i = 0, l = arguments.length; i < l; i++) {
                parts = parts.concat(arguments[i].split("/"));
            }
            // Interpret the path commands to get the new resolved path.
            var newParts = [];
            for (i = 0, l = parts.length; i < l; i++) {
                var part = parts[i];
                // Remove leading and trailing slashes
                // Also remove "." segments
                if (!part || part === ".")
                    continue;
                // Interpret ".." to pop the last segment
                if (part === "..")
                    newParts.pop();
                else
                    newParts.push(part);
            }
            // Preserve the initial slash if there was one.
            if (parts[0] === "")
                newParts.unshift("");
            // Turn back into a single string path.
            return newParts.join("/") || (newParts.length ? "/" : ".");
        }
    };
    function can_looseChanges() {
        var d = Q.defer();
        swal({
            title: "Voulez-vous reellement quitter cette page?",
            text: "Les modifications non sauvegardees seront perdues",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
            cancelButtonText: "Annuler",
            closeOnConfirm: true,
            closeOnCancel: true,
        }, function (confirmed) {
            if (confirmed) {
                d.resolve(true);
            }
            else {
                d.reject(false);
            }
        });
        return d.promise;
    }
    utils.can_looseChanges = can_looseChanges;
    function spin(el) {
        $(el).waitMe({
            effect: 'rotation'
        });
    }
    utils.spin = spin;
    function unspin(el) {
        $(el).waitMe('hide');
    }
    utils.unspin = unspin;
})(utils || (utils = {}));
//# sourceMappingURL=F:/StampDev/SmartAdmin/SmartAdmin/js/lib/utils.js.map