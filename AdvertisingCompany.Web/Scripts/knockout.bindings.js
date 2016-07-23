/* Биндинги
------------------------------------------------------------*/
ko.bindingHandlers.selectPicker = {
    // after: ['options'],
    init: function (element, valueAccessor, allBindingsAccessor) {
        var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
        if ($(element).is('select')) {
            if (ko.isObservable(valueAccessor())) {
                if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                    // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                    ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                } else {
                    // regular select and observable so call the default value binding
                    ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                }
            }

            $(element).addClass('selectpicker').selectpicker(selectPickerOptions);
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        if ($(element).is('select')) {
            var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
            if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null) {
                var options = selectPickerOptions.optionsArray,
                    initValue = selectPickerOptions.initValue,
                    initialized = selectPickerOptions.initialized,
                    optionsText = selectPickerOptions.optionsText,
                    optionsValue = selectPickerOptions.optionsValue,
                    optionsCaption = selectPickerOptions.optionsCaption,
                    isDisabled = selectPickerOptions.disabledCondition || false,
                    resetOnDisabled = selectPickerOptions.resetOnDisabled || false;
                if (ko.utils.unwrapObservable(options).length > 0) {
                    // call the default Knockout options binding
                    ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
                }
                if (isDisabled && resetOnDisabled) {
                    // the dropdown is disabled and we need to reset it to its first option
                    $(element).selectpicker('val', $(element).children('option:first').val());
                }

                var value = valueAccessor()();
                if (initValue !== undefined && initValue !== null && value) {
                    if (initialized !== undefined && initialized !== null) {
                        if (!initialized()) {
                            valueAccessor()(initValue());
                            initialized(true);
                        }
                    } else {
                        console.log('Set initialize property in selectPickerOptions.');
                    }
                }

                $(element).prop('disabled', isDisabled);
            }
            if (ko.isObservable(valueAccessor())) {
                if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                    // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                    ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                } else {
                    // call the default Knockout value binding
                    ko.bindingHandlers.value.update(element, valueAccessor);
                }
            }

            // valueAccessor()(2);

            $(element).selectpicker('refresh');
        }
    }
};

ko.bindingHandlers.tooltip = {
    init: function (element, valueAccessor) {
        var local = ko.utils.unwrapObservable(valueAccessor()),
            options = {};

        ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
        ko.utils.extend(options, local);

        $(element).tooltip(options);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).tooltip("destroy");
        });
    },
    options: {
        placement: "bottom",
        trigger: "hover"
    }
};

ko.bindingHandlers.datepicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || { format: 'DD/MM/YYYY HH:mm' };
        $(element).datetimepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "dp.change", function(event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(event.date);
            }
        });
    },
    update: function(element, valueAccessor) {
        var widget = $(element).data("DateTimePicker");
        //when the view model is updated, update the widget
        if (widget) {
            var date = ko.utils.unwrapObservable(valueAccessor());
            widget.date(moment(date));
        }
    }
};

ko.bindingHandlers.numeric = {
    init: function (element, valueAccessor) {
        $(element).on("keydown", function (event) {
            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: . ,
                (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });
    }
};

ko.bindingHandlers.typeahead = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element);
        // var allBindings = allBindingsAccessor();      
        var unwrappedValue = ko.utils.unwrapObservable(valueAccessor());
        var apiUrl = unwrappedValue.api;
        var elementData = unwrappedValue.data;
        var elementDataId = elementData[unwrappedValue.key];

        var items = {};
        var itemLabels = [];

        var search = _.debounce(function (query, process) {
            $.get(apiUrl, { query: query }, function (data) {

                items = {};
                itemLabels = [];

                // if (query.length > 2) {

                _.each(data, function (item, ix, list) {
                    if (_.contains(items, item.name)) {
                        item.name = item.name + ' #' + item.id;
                    }
                    itemLabels.push(item.name);
                    items[item.name] = {
                        id: item.id,
                        name: item.name,
                        cost: item.cost
                    };
                });

                var labelsCount = Object.keys(itemLabels).length;
                if (labelsCount === 0) {
                    $element.siblings('.msg-text').slideDown(250);
                    elementDataId("");
                    elementData.productCost(0);
                } else {
                    $element.siblings('.msg-text').slideUp(250);
                }

                process(itemLabels);
                // }

                if (query.length === 0) $element.siblings('.msg-text').slideUp(250);
            });
        }, 300);

        var options = {
            source: function (query, process) {
                search(query, process);
            },
            updater: function (item) {
                elementDataId(items[item].id);
                elementData.productCost(items[item].cost);

                return item;
            },
            matcher: function (item) {
                if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
                    elementDataId(items[item].id);
                    elementData.productCost(items[item].cost);

                    return item;
                }

                elementDataId("");
                return this.query;
            }
            //highlighter: function (item) {
            //    var discipline = items[item];
            //    var template = ''
            //        + "<div class='typeahead_wrapper'>"
            //        + "<div class='typeahead_labels'>"
            //        + "<div class='typeahead_primary'>" + discipline.DisciplineName + "</div>"
            //        + "<div class='typeahead_secondary'>" + discipline.ChairName + "</div>"
            //        + "</div>"
            //        + "</div>";
            //    return template;
            //}
        };

        $element
            .attr('autocomplete', 'off')
            .typeahead(options);
    }
};

/*  Datatable
 ------------------------------------------------------*/
function initDataTables(){
    /* Set the defaults for DataTables initialisation */
    $.extend( true, $.fn.dataTable.defaults, {
        "sDom": "<'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
        }
    } );


    /* Default class modification */
    $.extend( $.fn.dataTableExt.oStdClasses, {
        "sWrapper": "dataTables_wrapper form-inline"
    } );


    /* API method to get paging information */
    $.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
    {
        return {
            "iStart":         oSettings._iDisplayStart,
            "iEnd":           oSettings.fnDisplayEnd(),
            "iLength":        oSettings._iDisplayLength,
            "iTotal":         oSettings.fnRecordsTotal(),
            "iFilteredTotal": oSettings.fnRecordsDisplay(),
            "iPage":          oSettings._iDisplayLength === -1 ?
                0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
            "iTotalPages":    oSettings._iDisplayLength === -1 ?
                0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
        };
    };


    /* Bootstrap style pagination control */
    $.extend( $.fn.dataTableExt.oPagination, {
        "bootstrap": {
            "fnInit": function( oSettings, nPaging, fnDraw ) {
                var oLang = oSettings.oLanguage.oPaginate;
                var fnClickHandler = function ( e ) {
                    e.preventDefault();
                    if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                        fnDraw( oSettings );
                    }
                };

                $(nPaging).append(
                        '<ul class="pagination no-margin">'+
                        '<li class="prev disabled"><a href="#">'+oLang.sPrevious+'</a></li>'+
                        '<li class="next disabled"><a href="#">'+oLang.sNext+'</a></li>'+
                        '</ul>'
                );
                var els = $('a', nPaging);
                $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
                $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
            },

            "fnUpdate": function ( oSettings, fnDraw ) {
                var iListLength = 5;
                var oPaging = oSettings.oInstance.fnPagingInfo();
                var an = oSettings.aanFeatures.p;
                var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

                if ( oPaging.iTotalPages < iListLength) {
                    iStart = 1;
                    iEnd = oPaging.iTotalPages;
                }
                else if ( oPaging.iPage <= iHalf ) {
                    iStart = 1;
                    iEnd = iListLength;
                } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                    iStart = oPaging.iTotalPages - iListLength + 1;
                    iEnd = oPaging.iTotalPages;
                } else {
                    iStart = oPaging.iPage - iHalf + 1;
                    iEnd = iStart + iListLength - 1;
                }

                for ( i=0, ien=an.length ; i<ien ; i++ ) {
                    // Remove the middle elements
                    $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                    // Add the new list items and their event handlers
                    for ( j=iStart ; j<=iEnd ; j++ ) {
                        sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                        $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                            .insertBefore( $('li:last', an[i])[0] )
                            .bind('click', function (e) {
                                e.preventDefault();
                                oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                                fnDraw( oSettings );
                            } );
                    }

                    // Add / remove disabled classes from the static elements
                    if ( oPaging.iPage === 0 ) {
                        $('li:first', an[i]).addClass('disabled');
                    } else {
                        $('li:first', an[i]).removeClass('disabled');
                    }

                    if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                        $('li:last', an[i]).addClass('disabled');
                    } else {
                        $('li:last', an[i]).removeClass('disabled');
                    }
                }
            }
        }
    });

    //var unsortableColumns = [];
    //$('#datatable-table').find('thead th').each(function(){
    //    if ($(this).hasClass( 'no-sort')){
    //        unsortableColumns.push({"bSortable": false});
    //    } else {
    //        unsortableColumns.push(null);
    //    }
    //});

    /* Должно быть после инициализации таблицы */
    // $(".dataTables_length select").selectpicker({ width: '70px' });
}

var dataTableDefaultOptions = {
    "sDom": "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
    "oClasses": {
        "sFilter": "pull-right",
        "sFilterInput": "form-control input-rounded ml-sm"
    },
    "language": {
        "processing": "Подождите...",
        "search": "Поиск:",
        "lengthMenu": "Показать _MENU_ записей",
        "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
        "infoEmpty": "Записи с 0 до 0 из 0 записей",
        "infoFiltered": "(отфильтровано из _MAX_ записей)",
        "infoPostFix": "",
        "loadingRecords": "Загрузка записей...",
        "zeroRecords": "Записи отсутствуют.",
        "emptyTable": "В таблице отсутствуют данные",
        "paginate": {
            "first": "Первая",
            "previous": "Предыдущая",
            "next": "Следующая",
            "last": "Последняя"
        },
        "aria": {
            "sortAscending": ": активировать для сортировки столбца по возрастанию",
            "sortDescending": ": активировать для сортировки столбца по убыванию"
        }
    },
    "pageLength": 1
    // "aoColumns": unsortableColumns
    // "scrollX": true
};

ko.bindingHandlers.dataTablesForEach = {
    page: 0,
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        valueAccessor().data.subscribe(function (changes) {
            var table = $(element).closest('table').DataTable();
            ko.bindingHandlers.dataTablesForEach.page = table.page();
            table.destroy();
        }, null, 'arrayChange');
        var nodes = Array.prototype.slice.call(element.childNodes, 0);
        ko.utils.arrayForEach(nodes, function (node) {
            if (node && node.nodeType !== 1) {
                node.parentNode.removeChild(node);
            }
        });

        return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var options = ko.unwrap(valueAccessor()),
            key = 'DataTablesForEach_Initialized';
        $.extend(options.dataTableOptions, dataTableDefaultOptions);
        initDataTables();
        ko.unwrap(options.data); // !!!!! Need to set dependency     
        ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
        (function () {
            console.log(options);
            var table = $(element).closest('table').DataTable(options.dataTableOptions);
            if (options.dataTableOptions.paging) {
                if (table.page.info().pages - ko.bindingHandlers.dataTablesForEach.page == 0)
                    table.page(--ko.bindingHandlers.dataTablesForEach.page).draw(false);
                else
                    table.page(ko.bindingHandlers.dataTablesForEach.page).draw(false);
            }
        })();
        if (!ko.utils.domData.get(element, key) && (options.data || options.length))
            ko.utils.domData.set(element, key, true);

        $(".dataTables_length select").selectpicker({ width: '70px' });

        return { controlsDescendantBindings: true };
    }
};

/* Remove node if object empty
 ----------------------------------------------------*/
ko.bindingHandlers.IsEmptyOnLoad = {
    init: function (element, valueAccessor) {
        var observable = valueAccessor(); // get observable
        var value = observable(); // get value of observable
        var isEmpty = !value; // do whatever check you want
        // and remove element from dom if empty
        if (isEmpty) {
            ko.virtualElements.emptyNode(element);
        }
    },
    update: function (element, valueAccessor) {
        // do nothing on update
    }
};
ko.virtualElements.allowedBindings.IsEmptyOnLoad = true;