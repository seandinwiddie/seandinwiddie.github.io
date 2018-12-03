/* ------------------------------------------------------------------------
 * Verso: verso.core.js
 * Essential functions for verso theme
 * ------------------------------------------------------------------------
 * Copyright 2017 Oxygenna LTD
 * ------------------------------------------------------------------------ */

 /* global Waypoint Pace */

jQuery(document).ready(function($) {
    /********************
     IOS Classes
    /*******************/
    // Assign the 'oxy-agent' class when not assigned by PHP - for the html Version
    if ($('body').not('.verso-agent-iphone') &&
        (/iPhone/i).test(navigator.userAgent || navigator.vendor || window.opera)
    ) {
        $('body').addClass('verso-agent-iphone');
    }
    if ($('body').not('.verso-agent-ipad') && (/iPad/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        $('body').addClass('verso-agent-ipad');
    }
    // Check for touch device
    if ($('body').not('.verso-agent-touch') && ('ontouchstart' in window || navigator.msMaxTouchPoints)) {
        $('body').addClass('verso-agent-touch');
    }

    /********************
     IE Classes
    /*******************/
    // Check for IE (version 6-11)
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
        $('body').addClass('verso-agent-explorer');
    }
    // Check for Edge
    if (window.navigator.userAgent.indexOf('Edge') > -1) {
        $('body').addClass('verso-agent-edge');
    }

    /********************
     Object Fit Fix For IE in Card Images
    /*******************/
    $('body.verso-agent-explorer, body.verso-agent-edge').find('.card-horizontal .card-img').each(function() {
        var image = $(this);
        var imageSrc = image.attr('src');

        image.parent('.card-img-container').css('background-image', 'url(' + imageSrc + ')');
        image.parent('.carousel-item').css('background-image', 'url(' + imageSrc + ')');
    });

    /********************
     Expanding Icon Animation (see social networks)
    /*******************/
    $('.verso-icon-set-expandable a').on('click', function(e) {
        if(!$(this).hasClass('verso-icon-set-item-action')) {
            e.preventDefault();
            e.stopPropagation();
        }
        $(this).parent('.verso-icon-set-expandable').toggleClass('open');
    });

    /********************
     On scroll animations
    /*******************/

    function onScrollInit(items) {
        items.each(function() {
            var osElement = $(this),
                osAnimationClass = osElement.attr('data-os-animation'),
                osAnimationDelay = osElement.attr('data-os-animation-delay');

            osElement.css({
                '-webkit-animation-delay': osAnimationDelay,
                '-moz-animation-delay': osAnimationDelay,
                'animation-delay': osAnimationDelay
            });

            new Waypoint({
                element: osElement[0],
                handler: function() {
                    $(this.element).addClass('animated').addClass(osAnimationClass);
                },
                offset: '90%'
            });
        });
    }

    /********************
     Carousel Height fix
    /*******************/
    $('.carousel').each(function() {
        var carousel = $(this);
        var height = carousel.data('height');

        carousel.css('min-height', height);
    });

    /********************
     Pace Loading Screen
    /*******************/
    window.paceOptions = {
        startOnPageLoad: true,
        restartOnRequestAfter: false
    };

    Pace.on('done', function() {
        setTimeout(function() {
            // When loader has finished start the scroll animations.
            onScrollInit($('.verso-os-animation'));
        }, 500);
    });
});

/* ------------------------------------------------------------------------
 * Verso: verso.map.js
 * Initialises google maps
 * ------------------------------------------------------------------------
 * Copyright 2017 Oxygenna LTD
 * ------------------------------------------------------------------------ */

/* global google */

/* eslint camelcase: 0 */  // --> OFF

/* change the variables below to modify your map position / style & markers */
var map = window['map'] || {
    map_type: 'ROADMAP',
    auto_zoom: 'manual',
    // set to 'manual' to set the zoom manually. Leave empty for auto zoom
    map_zoom: 7,
    // set the zoom if auto_zoom is set to
    map_scrollable: 'on',
    // makes the map draggable
    map_style: '',
    // if set to blackwhite it takes a black/white saturation
    addresses: ['London', 'Paris'],
    // addresses separated by comma. Addresses are picked up first
    latlngs: ['51.511084, -0.133202', '51.506623, -0.111916'],
    // Lat/Lng separated by comma. if no addresses are set these coordinates will get used
    labels: ['London', 'Paris'],
    // labels that will be added to the markeres respectively. Keep the same number as markers
    auto_center: 'auto',
    // center the map 'auto' or 'custom'
    center_latlng: '',
    // centers the map to this point, unless it is set to auto
    show_markers: 'on',
    // shows/Hides the markers
    markerURL: 'assets/images/marker.png'
    // the marker URL
};

jQuery(document).ready(function($) {

    /********************
     Google Maps
    /*******************/
    $('.google-map').each(function() {
        var mapDiv = $(this);
        var mapData = window[mapDiv.attr('id')];

        $(window).resize(function() {
            googleMap(mapDiv, mapData);
        });
        googleMap(mapDiv, mapData);
    });

    // Google Map
    function googleMap(element, data) {
        if(undefined === window.google) {
            $.getScript('https://maps.googleapis.com/maps/api/js?v=3.29', function() {
                createMap(element, data);
            });
        } else {
            createMap(element, data);
        }
    }

    function createMap(element, data) {
        // create map
        var map = createGoogleMap(element, data);

        data.bounds = new google.maps.LatLngBounds();

        setupMarkers(map, element, data);

        var boundsListener;

        if(data.auto_zoom === 'manual') {
            boundsListener = google.maps.event.addListener(map, 'bounds_changed', function() {
                this.setZoom(parseInt(data.map_zoom));
                google.maps.event.removeListener(boundsListener);
            });
        } else {
            if(undefined !== boundsListener) {
                google.maps.event.removeListener(boundsListener);
            }
        }
    }

    function createGoogleMap(element, data) {
        var options = {
            zoom: parseInt(data.map_zoom, 10),
            scrollwheel: false,
            draggable: data.map_scrollable === 'on',
            mapTypeId: google.maps.MapTypeId[data.map_type]
        };

        if(data.map_style === 'blackwhite') {
            options.styles = [{
                'stylers': [{
                    'saturation': -100
                }]
            }];
        }

        if(data.map_style === 'retro') {
            options.styles = [{
                'featureType': 'administrative',
                'elementType': 'labels.text.fill',
                'stylers': [{'color': '#575e66'}]}, {'featureType': 'landscape', 'elementType': 'all', 'stylers': [{'color': '#f8f2e6'}]}, {'featureType': 'poi', 'elementType': 'all', 'stylers': [{'visibility': 'off'}]}, {'featureType': 'road', 'elementType': 'all', 'stylers': [{'saturation': -100}, {'lightness': 45}, {'visibility': 'simplified'}]}, {'featureType': 'road.highway', 'elementType': 'all', 'stylers': [{'visibility': 'simplified'}]}, {'featureType': 'road.highway', 'elementType': 'labels', 'stylers': [{'visibility': 'off'}]}, {'featureType': 'road.arterial', 'elementType': 'labels.icon', 'stylers': [{'visibility': 'off'}]}, {'featureType': 'transit', 'elementType': 'all', 'stylers': [{'visibility': 'off'}]}, {'featureType': 'water', 'elementType': 'all', 'stylers': [{'color': '#c9bfac'}, {'visibility': 'on'}, {'saturation': '0'}, {'lightness': '50'}]}];
        }
        return new google.maps.Map(element[0], options);
    }

    function setupMarkers(map, mapDiv, mapData) {
        mapData.markers = [];
        if(mapData.addresses) {
            geocodeMarkerList(map, mapData);
        } else if(mapData.latlngs) {
            latLngMarkerList(map, mapData);
        }
    }

    function geocodeMarkerList(map, mapData) {
        // lookup addresses
        var markerAddressCount = 0;

        $.each(mapData.addresses, function(index, address) {
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if(status === google.maps.GeocoderStatus.OK) {
                    if(undefined !== results[0]) {
                        var location = results[0].geometry.location;

                        mapData.markers[index] = {
                            position: new google.maps.LatLng(location.lat(), location.lng())
                        };
                        mapData.bounds.extend(mapData.markers[index].position);
                    }
                    // increment count so we can keep track of all markers loaded
                    markerAddressCount++;
                    // if all markers are loaded then fit map
                    if(markerAddressCount === mapData.addresses.length) {
                        createMarkers(map, mapData);
                    }
                }
            });
        });
    }

    function latLngMarkerList(map, mapData) {
        for(var index = 0; index < mapData.latlngs.length; index++) {
            var coordinates = mapData.latlngs[index].split(',');

            mapData.markers[index] = {
                position: new google.maps.LatLng(coordinates[0], coordinates[1])
            };
            mapData.bounds.extend(mapData.markers[index].position);
        }
        createMarkers(map, mapData);
    }

    function createMarkers(map, mapData) {

        $.each(mapData.markers, function(index, marker) {
            var markerData = {
                position: marker.position,
                icon: mapData.markerURL,
                visible: mapData.show_markers === 'on',
                map: map
            };
            var mapMarker = new google.maps.Marker(markerData);

            mapMarker.setMap(map);
            // add label popup to marker
            if (mapData.labels[index] !== undefined) {
                var infoWindow = new google.maps.InfoWindow({
                    content: mapData.labels[index]
                });

                google.maps.event.addListener(mapMarker, 'click', function() {
                    infoWindow.open(map, this);
                });
            }
        });
        centerMap(map, mapData);
    }

    function centerMap(map, mapData) {
        // centre map
        if(mapData.auto_center === 'auto') {
            if(mapData.auto_zoom === 'manual') {
                map.setCenter(mapData.bounds.getCenter());
            } else {
                map.fitBounds(mapData.bounds);
            }
        } else {
            if (mapData.center_latlng !== '') {
                var center_lat_lng = mapData.center_latlng.split(',');
                var center_map = new google.maps.LatLng(center_lat_lng[0], center_lat_lng[1]);

                map.setCenter(center_map);
            } else {
                map.fitBounds(mapData.bounds);
            }
        }
    }
});

/* ------------------------------------------------------------------------
 * Verso: verso.nav.js
 * Navigation JS
 * ------------------------------------------------------------------------
 * Copyright 2017 Oxygenna LTD
 * ------------------------------------------------------------------------ */

/* global Waypoint */

jQuery(document).ready(function($) {
    /********************
     Navigation Drop Downs
    /*******************/
    if (!$('body').hasClass('verso-agent-touch') && $('.verso-nav').hasClass('verso-nav-hover')) {
        $('.verso-nav-menu ul li').on('mouseover', function() {
            $(this).find('.verso-nav-dropdown').removeClass('closed');
        }).on('mouseout', function() {
            $(this).find('.verso-nav-dropdown').addClass('closed');
        });
    } else {
        $('.verso-nav-menu ul li a:not(:only-child)').on('click', function(e) {
            $(this).siblings('.verso-nav-dropdown').toggleClass('closed');
            $('.verso-nav-dropdown').not($(this).siblings()).addClass('closed');
            e.stopPropagation();
            e.preventDefault();
        });
    }

    $('html').on('click', function() {
        $('.verso-nav-dropdown').addClass('closed');
    });

    function hideMenu(event) {
        $('.verso-nav-menu .verso-nav-list').slideToggle();
        $('.verso-nav-menu .verso-nav-widget').slideToggle();
        $('#nav-toggle').toggleClass('active');
        event.preventDefault();
    }

    $('#content').on('click', function(event) {
        if ($('#nav-toggle').hasClass('active')) {
            hideMenu(event);
        }
    });

    $('body').on('click', '#nav-toggle', function(event) {
        hideMenu(event);
    });

    /********************
     Sticky header
    /*******************/
    var $header = $('body').find('.verso-header:not(.verso-header-side) .verso-nav-sticky');

    if($header.length > 0) {
        new Waypoint.Sticky({
            element: $header[0],
            stuckClass: 'verso-nav-stuck'
        });

        new Waypoint({
            element: document.body,
            offset: -200,
            handler: function(direction) {
                if(direction === 'down') {
                    $header.addClass('verso-nav-scrolled');
                } else {
                    $header.removeClass('verso-nav-scrolled');
                }
            }
        });
    }

    /********************
     Back to top button
    /*******************/
    new Waypoint({
        element: document.body,
        offset: -200,
        handler: function(direction) {
            if(direction === 'down') {
                $('.verso-go-top').removeClass('hide');
            } else {
                $('.verso-go-top').addClass('hide');
            }
        }
    });
    $('body').on('click', '.verso-go-top', function(event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 300);
    });
});

/* ------------------------------------------------------------------------
 * Verso: verso.search.widgetjs
 * Search widget JS
 * ------------------------------------------------------------------------
 * Copyright 2017 Oxygenna LTD
 * ------------------------------------------------------------------------ */


jQuery(document).ready(function($) {
    var mainContainer = $('.verso-content-box'),
        openCtrl = $('.verso-search-widget-button-open'),
        closeCtrl = $('.verso-search-widget-button-close'),
        searchContainer = $('.verso-search-widget-container'),
        inputSearch = $('.verso-search-widget-input');

    function init() {
        initEvents();
    }

    function initEvents() {
        openCtrl.on('click', openSearch);
        closeCtrl.on('click', closeSearch);
        $(document).on('keyup', function(ev) {
            // escape key.
            if(ev.keyCode === 27) {
                console.log('close');
                closeSearch();
            }
        });
    }

    function openSearch(e) {
        mainContainer.addClass('verso-content-box-moved');
        searchContainer.addClass('verso-search-widget-container-open');
        setTimeout(function() {
            inputSearch.focus();
        }, 600);
        e.preventDefault();
    }

    function closeSearch() {
        mainContainer.removeClass('verso-content-box-moved');
        searchContainer.removeClass('verso-search-widget-container-open');
        inputSearch.blur();
        inputSearch.value = '';
    }

    init();

});
