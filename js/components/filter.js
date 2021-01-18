$(document).ready(function () {
    var filterElement = $('#filterNew');

    if (!filterElement.length) return false;

    var $window = $(window),
        $windowInnerWidth = $window.innerWidth(),
        $windowOuterWidth = $window.outerWidth();

    function setFilterAffix() {
        var filterContainer = $('#list-of-filters'),
            headerContainer = $('#header');

        if (filterContainer == null)
            return;


        if (filterContainer.length) {
            var headerOffsetHeight = ($windowOuterWidth >= 768 && $windowOuterWidth <= 992) ? headerContainer.outerHeight() : 0,
                filterOffsetTop = filterContainer.offset().top - headerOffsetHeight - 1;
            filterContainer.affix({offset: filterOffsetTop});
        }

        // close filter
        function closeFilterByBackDropClick(e) {
            if (e.target != this) return;
            $('[data-target="#filter"]').trigger('click');
        }

        if ($windowOuterWidth < 768) {
            filterElement.on('click', closeFilterByBackDropClick);
        } else {
            filterElement.on('click', closeFilterByBackDropClick);
        }

        var filterByCollectionElement = filterContainer.find('#filter-by-collection');
        var countCheckedElementsInCollectionFilter = filterByCollectionElement.find('[type="checkbox"]:checked').length;
        if ($windowOuterWidth >= 768 && $windowOuterWidth <= 992 && countCheckedElementsInCollectionFilter == 0) {
            filterByCollectionElement.css({minWidth: 300});
        }
    }

    setTimeout(function () {
        setFilterAffix();
    }, 1);

    $(window).bind('resize', function () {
        $window = $(window);
        $windowInnerWidth = $window.innerWidth();
        $windowOuterWidth = $window.outerWidth();

        $('#list-of-filters .dropdown-menu').css({left: 'initial'});

        setFilterAffix();
    });

    $('#list-of-filters .dropdown').on('show.bs.dropdown', function () {
        var $this = $(this),
            filterPanel = $this.find('.dropdown-menu');

        filterPanel.addClass('invisible');

        setTimeout(function () {
            var filterPanelPositionLeft = filterPanel.offset().left,
                filterPanelOuterWidth = filterPanel.outerWidth(),
                offscreenPosition = Math.floor($windowInnerWidth - (filterPanelPositionLeft + filterPanelOuterWidth));

            if (offscreenPosition < -1) {
                filterPanel.css({left: offscreenPosition});
            }
            filterPanel.removeClass('invisible');
        }, 1);
    });

    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    if (iOS) {
        filterElement.find('.filter-sidebar').on('touchmove', function() {
            $(this).find('input.form-control:focus').blur();
        });
    }





    // For mobile Devices
    if (window.innerWidth < 768) {
        var inputElements = filterElement.find('input[data-name]'),
            applyFilterButton = $('.btn-apply-filters');

        inputElements.off();
        inputElements.on('change', function() {
            applyFilterButton.removeClass('hidden');
        });
        applyFilterButton.on('click', function(e) {
            var filterOptions = getFilterOptions();
            applyFilters(filterOptions);
        });
    }

    /** TEST CODE: START **/
    else {
        var inputElements = filterElement.find('input[data-name]'),
            applyFilterButton = $('.btn-apply-filters');

        //inputElements.off();
        inputElements.on('change', function() {
            applyFilterButton.removeClass('hidden');
        });
        applyFilterButton.on('click', function(e) {
            var filterOptions = getFilterOptions();
            applyFilters(filterOptions);
        });
    }
    /** TEST CODE: END **/

    function getFilterOptions() {
        var filterOptions = {};

        inputElements.each(function(e) {
            var $this = $(this),
                elementData = $this.data(),
                elementFilterName = elementData.name,
                elementFilterValue;

            if ($this.attr('type') == 'checkbox') {
                elementFilterValue = $this.prop('checked') ? elementData.value : '';
            } else {
                elementFilterValue = $this.val();
            }

            if (filterOptions.hasOwnProperty(elementFilterName)) {
                filterOptions[elementFilterName] +=
                    (filterOptions[elementFilterName] != '' && elementFilterValue) ? ',' + elementFilterValue : elementFilterValue;
            } else {
                filterOptions[elementFilterName] = elementFilterValue;
            }
        });

        $.each(filterOptions, function(propertyName, propertyValue) {
            if (!propertyValue) delete filterOptions[propertyName];
        });

        return filterOptions;
    }

    function getFilterURI(filterOptions) {
        return decodeURIComponent($.param(filterOptions));
    }

    function applyFilters(filterOptions) {
        window.location.search = getFilterURI(filterOptions);
    }
});
