$(function () {
    var hiddenQuery = $.param($('.hiddenFilters'));
    var scrolling = new infiniteScrolling();
    var pagingator = new infiniteScrollingPaginator(scrolling);

    pagingator.init();

    scrolling.setTriggerButton($('#showMore'))
        .setShowAllTrigger($('#showAll'))
        .setContainer( $('.subpages') )
        .setSource( $('.subpages').data('source') )
        .setQuery(window.location.search+'&'+hiddenQuery)
        .setCallback(function () {
            $('[data-src]').lazy();

            catalogItemClick();
        })
        .setTotalPages( $('.subpages').data('totalPages') );

    if ( scrolling.getTotalPages() > 1 ) {
        $('#showMore, #showAll').removeClass('hidden');
    }

    $('#showMore').click(function () {
        scrolling.setTriggerButton( $(this) )
            .next();
        return false;
    });

    if ( location.hash )
        pagingator.getCurrentHref().click();

    $('#showAll').click(function () {
        pagingator.getHrefByPageNr(pagingator.getLastPageBoxNr()).click();
    });

    $('.page, .dropdownPage ').mouseup(function () {
        ansygalleryCatalogScrollTop = false;
    });

    $('#showAll').mouseup(function () {
        ansygalleryCatalogScrollTop = $(window).scrollTop();
    });


});

var catalogItemClick = function () {
    //'[data-prod-id]'
    $('.subpage .product-card a').click(function (e) {
        e.preventDefault();

        var windowHashOld = window.location.hash.replace("#!", "");

        if (windowHashOld !== undefined) {
            window.location.hash = '#!page:' + windowHashOld.split(':')[1] + ':' + $(this).data('prod-id');
        }


        //console.log($(this).data('prod-id'));
        console.log($(this).data('prod-id'));
        e.stopImmediatePropagation();

        location.href = $(this).attr('href');
    });
}

var infiniteScrolling = function () {
    var container,
        query,
        source,
        totalPages,
        loader,
        perPage,
        total,
        callback,
        trigger,
        showAllTrigger,
        page = 1,
        initPage = 1;

    var setPage = function (value) {
        page = value;
        window.location.hash = '!page:'+value;
        return this;
    };

    var setPageWithCarpet = function (value, windowHash) {
        page = value;
        window.location.hash = '!page:'+value+windowHash;
        return this;
    };

    var getQuery = function () {
        return query.replace('?', '');
    };

    var getSource = function () {
        return source;
    };

    var getPages = function () {
        var pages = ((typeof query != "undefined") ? '&' : '')
            + 'page=' + page + '&initPage=' + initPage;
        if(initPage < page)
            initPage = page;
        return pages;
    };

    this.getInitPageNr = function () {
        return parseInt(initPage);
    };

    var makeNewSubpage = function (number, callback) {
        if ( number > totalPages ) {
            trigger.fadeOut();
            return false;
        }

        var windowHash = window.location.hash.replace("#!", "");
        windowHash = windowHash.split(':')[2];
        if (windowHash === undefined) {
            setPageWithCarpet(number, '');
        } else {
            setPageWithCarpet(number, ':'+windowHash);
        }

        console.log(windowHash);


        //setPage(number);
        console.log('after:'+window.location.hash);
        changeCaptionsOnTrigger();

        var subpage$ = $('<div>');

        subpage$.addClass('subpage catalog-list')
            .attr('data-source', getSource() + getQuery() + getPages());

        container.append(subpage$);



        $.ajax({
            url: subpage$.data('source'),
            type: 'GET',
            dataType: 'html',
            success: function(data){
                subpage$.html(data)
                    .find('[data-src]').lazy();

                if(callback)
                    callback();

                if($.isNumeric(ansygalleryCatalogScrollTop)){
                    ansygalleryCatalogScrollTopAction(ansygalleryCatalogScrollTop);
                }

                catalogItemClick();

                if (windowHash !== undefined) {
                    $('html, body').animate({
                        scrollTop: $("#id"+windowHash).offset().top
                    }, 1);

                    var windowHashNew = window.location.hash.replace("#!", "");

                    if (windowHashNew !== undefined) {
                        window.location.hash = '#!page:' + windowHashNew.split(':')[1];
                    }
                }


            }
        });
    };

    var changeCaptionsOnTrigger = function () {
        total = total - perPage;

        if ( total < perPage ) {
            perPage = total;
        }

        if ( total < 0 ) {
            total = 0;
        }

        if ( total === 0 ) {
            trigger.fadeOut().addClass('hidden');
            return false;
        }

        trigger.find('.items-per-page').text(perPage);
        trigger.find('.total-items').text(total);
    };

    this.setContainer = function (container$) {
        container = container$;
        perPage = container.data('items-per-page');
        total   = container.data('total-items');
        changeCaptionsOnTrigger();
        return this;
    };

    this.setCallback = function (value) {
        callback = value;
        return this;
    };

    this.setSource = function (value) {
        source = value + '?';
        return this;
    };

    this.setQuery = function (value) {
        query = value;
        return this;
    };

    this.setLoader = function (loaderObj) {
        loader = loaderObj;
        return this;
    };

    this.setTotalPages = function (value) {
        totalPages = value;
        return this;
    };

    this.getTotalPages = function () {
        return totalPages;
    };

    this.setTriggerButton = function ( trigger$ ) {
        trigger = trigger$;
        return this;
    };

    this.setShowAllTrigger = function (trigger$) {
        showAllTrigger = trigger$;
        return this;
    };

    this.getShowAllTrigger = function () {
        return showAllTrigger;
    };

    // method is redifined in infiniteScrollingPaginator
    // this.next = function () {
    //     makeNewSubpage(page+1);
    // };

    this.loadByHash = function (hash, callback) {
        hash = hash.replace("#!", "");
        hash.split(',').forEach(function (iter, p2, p3) {
            var item  = iter.split(':')[0];
            var value = iter.split(':')[1];

            // console.log(window.location.hash);


            if ( item === 'page' ) {
                var p = parseInt(value);
                total = total - ( (p-2) * perPage );
                if ( total < 0 ) {
                    total = 0;
                }
                makeNewSubpage(p, callback);
                if ( page === totalPages) {
                    trigger.fadeOut();
                }
            }
        });
    };
};

var infiniteLoader = function () {
    var target$;
    var loader$ = $('<div class="circle-container"><div class="dot"></div> <div class="dot"></div> <div class="dot"></div> </div>');

    this.setTarget = function(target) {
        target$ = target;
        return this;
    };

    this.start = function() {
        target$.addClass('hidden');
        target$.parent().append(loader$);
        return this;
    };

    this.stop = function(hideTarget) {
        target$.parent().find(loader$).remove();
        target$.removeClass('hidden');
        if(hideTarget)
            target$.addClass('hidden');
        return this;
    };
};

var getCurrentHashPage = function () {
    var page = window.location.hash.split('page:')[1];
    if(page)
        return parseInt(page);
    return 1;
};

var infiniteScrollingPaginator = function (scrolling) {
    var that = this;
    var paginatorWrapper$ = $('.paginator').not('.simple');
    var handlerClass = 'page';
    var handler$ = $('.' + handlerClass);
    var loaderHandler$ = $('#showMore');
    var loaderShowAllHandler$ = $('#showAll');
    // var loader = (new infiniteLoader()).setTarget(loaderHandler$);
    var loader = (new infiniteLoader()).setTarget(loaderShowAllHandler$);
    var disabledBlockClass = 'disabledBlock';
    var dropdownPageClass = 'dropdownPage';
    var pageBoxAttr = 'data-pageNr';
    var windowWidthRestriction = 600;

    var totalPages = $('#pagerTotalPages').val();

    this.init = function () {
        adjustHash();
        adjustPager( $('a[href="#!page:' + getCurrentHashPage() + '"]') );

        // handler$.click(function () {
        //     var requestPageNr = parseInt($(this).text().trim());
        //     if( scrolling.getInitPageNr() < requestPageNr ){
        //         loader.start();
        //         adjustPager($(this));
        //         scrolling.setLoader(loader)
        //             .loadByHash($(this).attr('href'));
        //     }
        //     if( scrolling.getInitPageNr() > requestPageNr )
        //         scrollToPage(requestPageNr);
        // });

        handler$.click(function (e) {
            e.preventDefault();
            var thatHere = this;
            var requestPageNr = parseInt($(this).text().trim());

            if( scrolling.getInitPageNr() < requestPageNr ){
                loader.start();
                setTimeout(function () {
                    for(var i=scrolling.getInitPageNr()+1; i<=requestPageNr; i++){
                        var callback = function () {
                            adjustPager($(thatHere));
                            // loader.stop( getCurrentPageBoxNr() == that.getLastPageBoxNr() );
                            if(i == requestPageNr+1)
                                if(!$.isNumeric(ansygalleryCatalogScrollTop))
                                    scrollToPage(requestPageNr);

                            if(requestPageNr == that.getLastPageBoxNr())
                                scrolling.getShowAllTrigger().fadeOut().addClass('hidden');
                        };
                        loader.stop( getCurrentPageBoxNr() == that.getLastPageBoxNr() );
                        scrolling.loadByHash('#!page:' + i, callback);
                    }
                }, 500);
            }
            if( scrolling.getInitPageNr() > requestPageNr )
                scrollToPage(requestPageNr);
        });

        paginatorWrapper$.show();

        $(document).on('click','.' + dropdownPageClass,function() {
            var requestPageBox = that.getPageBoxByPageNr( $(this).text() );
            requestPageBox.find('.' + handlerClass).click();
        });

        window.onresize = function() {
            adjustPager( getCurrentPageBox().find('.' + handlerClass) );
        };
    };

    var adjustHash = function(){
        if(getCurrentHashPage() <= 1   ||   getCurrentHashPage() > that.getLastPageBoxNr())
            history.pushState("", document.title, window.location.pathname + window.location.search);
    };

    var adjustPager = function (activeEl$) {
        handler$.parent().addClass('hidden');
        resetActive(activeEl$);
        adjustPrev();
        adjustNext();
        adjustFirstLastPageBox();
    };

    var resetActive = function (element$) {
        handler$.parent().removeClass('active');
        element$.parent().removeClass('hidden').addClass('active');
    };

    var adjustPrev = function () {
        // todo
        getCurrentPageBox().prev().removeClass('hidden');
        if(!isSmallWindow()){
            getCurrentPageBox().prev().prev().removeClass('hidden');
            getCurrentPageBox().prev().prev().prev().removeClass('hidden');
        }
    };

    var adjustNext = function () {
        // todo
        getCurrentPageBox().next().removeClass('hidden');
        if(!isSmallWindow()) {
            getCurrentPageBox().next().next().removeClass('hidden');
            getCurrentPageBox().next().next().next().removeClass('hidden');
        }
    };

    var isSmallWindow = function () {
        return parseInt($(window).width()) < windowWidthRestriction;
    };

    var adjustFirstLastPageBox = function () {
        // todo
        $('.' + disabledBlockClass).remove();
        if(getCurrentPageBoxNr() >= (isSmallWindow() ? 2 : 6))
            getFirstPageBox().removeClass('hidden').after(getDisabledBlockString('first'));
        if(totalPages - getCurrentPageBoxNr() >= (isSmallWindow() ? 1 : 5))
            getLastPageBox().removeClass('hidden').before(getDisabledBlockString('last'));
    };

    var getDisabledBlockString = function (type) {
        if(type !== 'first' && type !== 'last')
            console.log('Error! Type should be -first- or -last-.');

        var disabledBlockString = '<li class="' + disabledBlockClass + ' dropdown-' + type + '">'
            +'<span class="dropdown">\n' +
            '    <span class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\n' +
            '        <span class="caret"></span>\n' +
            '    </span>\n' +
            '    <ul class="dropdown-menu">\n';

        var firstPagesQnt = 0;
        var lastPagesQnt = 0;
        handler$.each(function (key, el) {
            if( $(el).parent().hasClass('hidden') ){
                if(type === 'first'   &&   parseInt($(el).text()) < getCurrentPageBoxNr()){
                    disabledBlockString += '<li><a class="' + dropdownPageClass + '">' + $(el).text() + '</a></li>';
                    firstPagesQnt++;
                }
                if(type === 'last'   &&   parseInt($(el).text()) > getCurrentPageBoxNr()){
                    disabledBlockString += '<li><a class="' + dropdownPageClass + '">' + $(el).text() + '</a></li>';
                    lastPagesQnt++;
                }
            }
        });

        disabledBlockString += '    </ul>\n' +
            '</span>'
            +'</li>';

        if(type==='first' && firstPagesQnt===0)
            return '';
        if(type==='last' && lastPagesQnt===0)
            return '';
        return disabledBlockString;
    };

    var getCurrentPageBox = function () {
        return handler$.parent('.active');
    };

    var getCurrentPageBoxNr = function () {
        return parseInt(getCurrentPageBox().attr(pageBoxAttr));
    };

    var getNextPageBox = function () {
        var nextPageBox = getCurrentPageBox().next('li').find('a');
        return nextPageBox.length ? nextPageBox : false;
    };

    var getPrevPageBox = function () {
        var prevPageBox = getCurrentPageBox().prev('li').find('a');
        return prevPageBox.length ? prevPageBox : false;
    };

    var getFirstPageBox = function () {
        return handler$.first().parent();
    };

    var getLastPageBox = function () {
        return handler$.last().parent();
    };

    this.getLastPageBoxNr = function () {
        return parseInt(getLastPageBox().attr(pageBoxAttr));
    };

    this.getPageBoxByPageNr = function (pageNr) {
        return handler$.parent("[" + pageBoxAttr + "='" + pageNr + "']");
    };

    scrolling.next = function () {
        if(getNextPageBox())
            getNextPageBox().click();
    };

    var scrollToPage = function(pageNr){
        $($('#list-of-products').find('.catalog-list')[pageNr-1])
            .autoScroll({'paddingTop': '70'});
    };

    this.getCurrentHref = function () {
        return this.getHrefByPageNr(getCurrentHashPage());
    };

    this.getHrefByPageNr = function (pageNr) {
        return this.getPageBoxByPageNr(pageNr).find('a' + '.' + handlerClass );
    }
};
