(function($){
    $.fn.htmlFromServer = function (settings) {
        var settings = $.extend(settings||{});
        var that = this;
        var onBeforeSend = function(){
            if ( typeof settings.loader == 'object' )
                settings.loader.start($(that));
        };

        var onComplete = function() {
            if ( typeof settings.loader == 'object' )
                settings.loader.stop($(that));

            if ($.isFunction(settings.callback))
                settings.callback();
        };

        var onSuccess = function(data){
            $(that).html(data);
        };

        var onError = function(xhr, status, error){
            alert(status);
        };

        if ( $(that).data('source') == undefined ) {
            alert('РџРѕР¶Р°Р»СѓР№СЃС‚Р° РґРѕР±Р°РІСЊС‚Рµ Рє Р°С‚СЂРёР±СѓС‚ data-source Рє СЌР»РµРјРµРЅС‚Сѓ, РІ РєРѕС‚РѕСЂС‹Р№ Р·Р°РіСЂСѓР¶Р°РµС‚Рµ РёРЅС„РѕСЂРјР°С†РёСЋ!');
            return this;
        }

        var source = settings.source || $(that).data('source');

        $.ajax({
            url: source,
            beforeSend: onBeforeSend,
            type: 'GET',
            dataType: 'html',
            data: {'data' : $(that).data('data')},
            success: onSuccess,
            complete: onComplete,
            error: onError,
            async: false
        });
        return this;
    }
})(jQuery);
