var kladrWithMap = {
    geocoordinates: {},
    init : function(options) {
        var $region = $('[name="region"]'),
		$district = $('[name="district"]'),
		$city = $('[name="city"]'),
		$street = $('[name="street"]'),
		$building = $('[name="building"]');
       
        var map = null,
            map_created = false;

        $.kladr.setDefault({
            parentInput: '.js-form-address',
            verify: true,
            labelFormat: function (obj, query) {
                var label = '';

                var name = obj.name.toLowerCase();
                query = query.name.toLowerCase();

                var start = name.indexOf(query);
                start = start > 0 ? start : 0;

                if (obj.typeShort) {
                    label += obj.typeShort + '. ';
                }

                if (query.length < obj.name.length) {
                    label += obj.name.substr(0, start);
                    label += '<strong>' + obj.name.substr(start, query.length) + '</strong>';
                    label += obj.name.substr(start + query.length, obj.name.length - query.length - start);
                } else {
                    label += '<strong>' + obj.name + '</strong>';
                }

                if (obj.parents) {
                    for (var k = obj.parents.length - 1; k > -1; k--) {
                        var parent = obj.parents[k];
                        if (parent.name) {
                            if (label) label += '<small>, </small>';
                            label += '<small>' + parent.name + ' ' + parent.typeShort + '.</small>';
                        }
                    }
                }

                return label;
            },
            change: function (obj) {
                if (obj) {
                    setLabel($(this), obj.type);
                }

                log(obj);
                addressUpdate();
                mapUpdate();
            },
            checkBefore: function () {
                var $input = $(this);

                if (!$.trim($input.val())) {
                    log(null);
                    addressUpdate();
                    mapUpdate();
                    return false;
                }
            }
        });

        $region.kladr({
            type: $.kladr.type.region,
            withParent: true
        });
        $district.kladr({
            type: $.kladr.type.district,
            withParent: true
        });
        $city.kladr({
            type: $.kladr.type.city,
            withParent: true
        });
        $street.kladr({
            type: $.kladr.type.street,
            parentType: $.kladr.type.city,
            parentInput: $city,
            withParent: true
        });
        $building.kladr({
            type: $.kladr.type.building,
            parentType: $.kladr.type.street,
            parentInput: $street,
            withParent: true
        });

        ymaps.ready(function () {
            if (map_created) return;
            map_created = true;

            map = new ymaps.Map('map', {
                center: [38.951409, 45.272365],
                zoom: 12,
                controls: []
            });

            map.controls.add('zoomControl', {
                position: {
                    right: 10,
                    top: 10
                }
            });

            // Значения по умолчанию [ Краснодарский край, город Краснодар ]          
            if (options && options.defaultValues) {
                var values = options.defaultValues;
                if (values.regionId && values.regionName) {
                    $region.kladr('controller').setValueByIdAndName(values.regionId, values.regionName);
                }

                if (values.districtId && values.districtName) {
                    $district.kladr('controller').setValueByIdAndName(values.districtId, values.districtName);
                }

                if (values.cityId && values.cityName) {
                    $city.kladr('controller').setValueByIdAndName(values.cityId, values.cityName);
                }

                // Необходим идентификатор родителя [cityId] для kladr api
                if (values.streetId && values.streetName && values.streetParentId && values.streetParentType) {
                    $street.kladr('controller').setValueByIdAndName(values.streetId, values.streetName, values.streetParentId, values.streetParentType);
                }

                // Необходим идентификатор родителя [streetId или cityId] для kladr api
                if (values.buildingId && values.buildingName && values.buildingParentId && values.buildingParentType) {
                    $building.kladr('controller').setValueByIdAndName(values.buildingId, values.buildingName, values.buildingParentId, values.buildingParentType);
                }
            }
        });

        function setLabel($input, text) {
            text = text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
            $input.parent().find('label').text(text);
        }

        function mapUpdate() {
            var zoom = 4;

            var address = $.kladr.getAddress('.js-form-address', function (objs) {
                var result = '';

                $.each(objs, function (i, obj) {
                    var name = '',
                        type = '';

                    if ($.type(obj) === 'object') {
                        name = obj.name;
                        type = ' ' + obj.type;

                        switch (obj.contentType) {
                            case $.kladr.type.region:
                                zoom = 4;
                                break;

                            case $.kladr.type.district:
                                zoom = 7;
                                break;

                            case $.kladr.type.city:
                                zoom = 10;
                                break;

                            case $.kladr.type.street:
                                zoom = 13;
                                break;

                            case $.kladr.type.building:
                                zoom = 16;
                                break;
                        }
                    }
                    else {
                        name = obj;
                    }

                    if (result) result += ', ';
                    result += type + name;
                });

                return result;
            });

            if (address && map_created) {
                var geocode = ymaps.geocode(address);
                geocode.then(function (res) {
                    map.geoObjects.each(function (geoObject) {
                        map.geoObjects.remove(geoObject);
                    });

                    var position = res.geoObjects.get(0).geometry.getCoordinates(),
                        placemark = new ymaps.Placemark(position, {}, {});

                    geocoordinates = position;
                    map.geoObjects.add(placemark);
                    map.setCenter(position, zoom);
                });
            }
        }

        function addressUpdate() {
            var address = $.kladr.getAddress('.js-form-address');

            $('#address').text(address);
        }

        function log(obj) {
            var $log, i;

            $('.js-log li').hide();

            for (i in obj) {
                $log = $('*[data-prop="' + i + '"]');

                if ($log.length) {
                    $log.find('.value').text(obj[i]);
                    $log.show();
                }
            }
        }
    }
};