/*
 * http://sverres.net/nctoten
 *
 * sverre.stikbakke 08.12.2014
 *
 */
var ots = (function () {

    'use strict';

    var attribution = new ol.Attribution({
            'html': '<a href="http://kartverket.no">Kartverket</a>'
        }),

        kmlFiles = {
            'kd_3_3': 'kml/OTS_Karidalen_3_3_SS_2015.kml',
            'kd_3_0': 'kml/OTS_Karidalen_3_0_SS_2015.kml',
            'kd_2_5': 'kml/OTS_Karidalen_2_5_SS_2015.kml',
            'kd_2_0': 'kml/OTS_Karidalen_2_0_SS_2015.kml',
            'kd_1_5': 'kml/OTS_Karidalen_1_5_SS_2015.kml',
            'kd_start': 'kml/OTS_Karidalen_start_SS_2015.kml',
            'kd_finish': 'kml/OTS_Karidalen_maal_SS_2015.kml',
            'kd_shootingLane': 'kml/OTS_Karidalen_standplass_SS_2015.kml'
        },

        // http://www.statkart.no/Kart/Gratis-kartdata/Cache-tjenester/
        extent = [
            -2000000,
            3500000,
            3545984,
            9045984
        ],

        projection = 'EPSG:32632',

        center = [596950, 6731775],
        zoom = 16,

        matrixSet = 'EPSG:32632',
        matrixN = 18,
        matrixIds = [],

        // http://wms.geonorge.no/kr/koordsys_res.txt
        resolutions = [
            21664,
            10832,
            5416,
            2708,
            1354,
            677,
            338.5,
            169.25,
            84.625,
            42.3125,
            21.15625,
            10.578125,
            5.2890625,
            2.64453125,
            1.322265625,
            0.6611328125,
            0.33056640625,
            0.165283203125
        ],

        i,
        xfile,
        kmlLayers = {};

    // Generate id's for WMTS tile sets
    for (i = 0; i < matrixN; i = i + 1) {
        matrixIds[i] = matrixSet + ":" + i;
    }

    // Generate layers of KML files
    for (xfile in kmlFiles) {
        if (kmlFiles.hasOwnProperty(xfile)) {
            kmlLayers[xfile] = new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: kmlFiles[xfile],
                    format: new ol.format.KML(),
                    //projection: 'EPSG:32632'
                }),
                visible: false
            });
        }
    }

    // http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?
    // version=1.0.0&service=wmts&request=getcapabilities

    var topo2 = new ol.layer.Tile({
            extent: extent,
            source: new ol.source.WMTS({
                attributions: [attribution],
                url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
                layer: 'topo2',
                matrixSet: matrixSet,
                format: 'image/png',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(extent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                })
            }),
            visible: false
        }),

        grunnkart = new ol.layer.Tile({
            extent: extent,
            source: new ol.source.WMTS({
                attributions: [attribution],
                url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
                layer: 'norges_grunnkart',
                matrixSet: matrixSet,
                format: 'image/png',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(extent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                })
            }),
            visible: true
        }),

        map = new ol.Map({
            layers: [
                grunnkart,
                topo2,
                kmlLayers.kd_3_3,
                kmlLayers.kd_3_0,
                kmlLayers.kd_2_5,
                kmlLayers.kd_2_0,
                kmlLayers.kd_1_5,
                kmlLayers.kd_start,
                kmlLayers.kd_finish,
                kmlLayers.kd_shootingLane
            ],
            target: 'map',
            view: new ol.View({
                center: center,
                zoom: zoom
            })
        }),

        toggleLayer = function (layer) {
            if (layer.getVisible()) {
                layer.setVisible(false);
            } else {
                layer.setVisible(true);
            }
        };

    return {
        toggleGrunnkart: function () {
            toggleLayer(grunnkart);
        },
        toggleTopo2: function () {
            toggleLayer(topo2);
        },
        toggle3_3km: function () {
            toggleLayer(kmlLayers.kd_3_3);
        },
        toggle3_0km: function () {
            toggleLayer(kmlLayers.kd_3_0);
        },
        toggle2_5km: function () {
            toggleLayer(kmlLayers.kd_2_5);
        },
        toggle2_0km: function () {
            toggleLayer(kmlLayers.kd_2_0);
        },
        toggle1_5km: function () {
            toggleLayer(kmlLayers.kd_1_5);
        },
        toggleStart: function () {
            toggleLayer(kmlLayers.kd_start);
        },
        toggleFinish: function () {
            toggleLayer(kmlLayers.kd_finish);
        },
        toggleShootingLane: function () {
            toggleLayer(kmlLayers.kd_shootingLane);
        }
    };
}());
