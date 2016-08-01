define(['knockout', 'bootstrap-typeahead'], function (ko, bst) {
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
});