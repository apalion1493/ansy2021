$(function () {
    $('body').on('click', '.backHrefArea a:not(.adminShow.adminShowList)', function(e) {

        e.preventDefault();

        var url = window.location.href;
        if(ansygalleryCatalogScrollTop)
            url = removeQueryStringParameter(url, 'scrollTop', ansygalleryCatalogScrollTop);

        url = updateQueryStringParameter(url, 'scrollTop', $(window).scrollTop());
        url = url.replace(window.location.hash, '') + window.location.hash;

        history.pushState({}, '', url);
        window.location.href = $(this).attr('href');
    });

    if($.isNumeric(ansygalleryCatalogScrollTop)){
        ansygalleryCatalogScrollTopAction(ansygalleryCatalogScrollTop);
        var url = removeQueryStringParameter(window.location.href, 'scrollTop', ansygalleryCatalogScrollTop);
        history.replaceState({}, '', url);
    }
});

var ansygalleryCatalogScrollTopAction = function (scrollTop) {
    $("html,body").animate({scrollTop: scrollTop}, 100);
};
