declare var L: any;

module scout {
    //    "use strict";


    declare class FormField { };

    export var HeatmapField = function() {
        (< any > HeatmapField).parent.call(this);
    };
    (<any>scout).inherits(HeatmapField, (<any>scout).FormField);

    /** This is a description of the foo function. */
    HeatmapField.prototype._render = function($parent) {
        this.addContainer($parent, 'heatmap-field');
        this.addLabel();
        this.addStatus();

        var heatmapId = (<any>scout).objectFactory.createUniqueId();
        var $field = this.$container
            .makeDiv('heatmap')
            .attr('id', heatmapId);
        this.addField($field);

        // Before (!) installing the layout, set the initial size to 1x1. The size of $field must not
        // get smaller than that, because Leaflet.js throws an error when the drawing canvas has size 0.
        // After the initial rendering, this condition is ensured by HeapmapFieldLayout.js.
        (<any>scout).graphics.setSize($field, new (<any>scout).Dimension(1, 1));
        var fieldHtmlComp = new (<any>scout).HtmlComponent($field, this.session);
        fieldHtmlComp.setLayout(new HeatmapFieldLayout(this));

        this.heatmap = L.map(heatmapId, {
            trackResize: false
        });
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.heatmap);

        this.heatmap.on('zoomend', this._handleViewParameterChanged.bind(this));
        this.heatmap.on('moveend', this._handleViewParameterChanged.bind(this));
        this.heatmap.on('click', this._handleClicked.bind(this));
        this.heatmap.on('contextmenu', this._handleClicked.bind(this));
    };

    HeatmapField.prototype._renderProperties = function() {
        (< any > HeatmapField).parent.prototype._renderProperties.call(this);
        this._renderViewParameter();
        this._renderHeatPointList();
    };

    HeatmapField.prototype._remove = function() {
        (< any > HeatmapField).parent.prototype._remove.call(this);

        this.heatmap.remove();
        this.heatmap = null;
        this._heatLayer = null;
    };

    HeatmapField.prototype._handleViewParameterChanged = function() {
        this._send('viewParameterChanged', {
            center: {
                x: this.heatmap.getCenter().lat,
                y: this.heatmap.getCenter().lng
            },
            zoomFactor: this.heatmap.getZoom()
        });
    };

    HeatmapField.prototype._handleClicked = function(event) {
        this._send('clicked', {
            point: {
                x: event.latlng.lat,
                y: event.latlng.lng
            }
        });
    };

    (< any > HeatmapField).prototype._renderViewParameter = function() {
        this.heatmap.setView([this.viewParameter.center.x, this.viewParameter.center.y], this.viewParameter.zoomFactor);
    };

    (< any > HeatmapField).prototype._renderHeatPointList = function() {
        if (this._heatLayer) {
            this.heatmap.removeLayer(this._heatLayer);
        }
        this._heatLayer = L.heatLayer(this.heatPointList,
            // TODO make this parameter list configurable from the model!
            // parameters to control the appearance of heat points
            // see leaflet.heat docu for full spec
            { radius: 20, blur: 30, max: 1.0 }
            );
        this._heatLayer.addTo(this.heatmap);
    };

    (< any > HeatmapField).prototype._onHeatPointsAdded = function(points) {
        var i: number;
        if (this._heatLayer) {
            for (i = 0; i < points.length; i++) {
                this._heatLayer.addLatLng(points[i]);
            }
        }
    };

    (< any > HeatmapField).prototype.onModelAction = function(event) {
        if (event.type === 'heatPointsAdded') {
            this._onHeatPointsAdded(event.points);
        } else {
            (< any > HeatmapField).parent.prototype.onModelAction.call(this, event);
        }
    };
}
