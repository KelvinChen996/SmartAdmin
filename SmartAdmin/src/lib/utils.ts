/// <reference path="../../typings/tsd.d.ts" />


declare var swal;


interface String {
    format: (...d: any[]) => string;
}

String.prototype.format = function (...d: any[]): string {

    var args = (arguments.length === 1 && $.isArray(arguments[0])) ? arguments[0] : arguments;
    var formattedString = this;
    for (var i = 0; i < args.length; i++) {
        var pattern = new RegExp("\\{" + i + "\\}", "gm");
        formattedString = formattedString.replace(pattern, args[i]);
    }
    return formattedString;
}


_.mixin({
    guid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});



module utils {

    export function is_null_or_empty(val: any): boolean {
        return val === null || val === undefined
            || !val || (0 === val.length);
    }


    export function exec(spin: JQuery, call: (_d: Q.Deferred<any>) => any): Q.Promise<any> {

        var d = Q.defer<any>();

        spin.removeClass('hidden');

        d.promise.finally(() => {
            spin.addClass('hidden');
        });

        call(d);

        return d.promise;
    }


    export function resolve_rst(rst: any) {

        if ($.isArray(rst.results)) {
            var r: Array<any> = rst.results;

            if (r.length > 0) {

                return r[0];

            }
        }
    }


    export function guid(): string {
        return (_ as any).guid();
    }


    export function scrollToObj(target, offset, time) {
        $('html, body').animate({ scrollTop: $(target).offset().top - offset }, time);
    }


    export function loadfile(file: string): Q.Promise<any> {

        var d = Q.defer();

        require([file], f => {
            d.resolve(f);
        }, err => {
            d.reject(err);
        });

        return d.promise;

    }
    

    export var Path = {

        join: function(...args:any[]){

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
                if (!part || part === ".") continue;
                // Interpret ".." to pop the last segment
                if (part === "..") newParts.pop();
                // Push new path segments.
                else newParts.push(part);
            }
            // Preserve the initial slash if there was one.
            if (parts[0] === "") newParts.unshift("");
            // Turn back into a single string path.
            return newParts.join("/") || (newParts.length ? "/" : ".");

        }

            


//// A simple function to get the dirname of a path
//// Trailing slashes are ignored. Leading slash is preserved.
//function dirname(path) {
//    return join(path, "..");
//}


    }



    export function can_looseChanges(): Q.Promise<boolean> {

        var d = Q.defer<boolean>();

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
            //animation: false,
        }, function (confirmed) {

            if (confirmed) {
                d.resolve(true);
            } else {
                d.reject(false);
            }
        });


        return d.promise;
    }



    export function spin(el: JQuery) {
        ($(el) as any).waitMe({
            effect: 'rotation'
        });
    }

    export function unspin(el: JQuery) {
        ($(el) as any).waitMe('hide');
    }
    
}