declare var L: any;

module scout {
    //    "use strict";

    export declare class FormField {
        _renderProperties(): void;
        _remove(): any;
        _send: any;
        onModelAction(any): any;
        addContainer(any, string): any;
        addLabel(): void;
        addStatus(): void;
        addField(any): void;
        invalidateSize(): void;
    };

    export class HeatmapField extends scout.FormField {
        public heatmap: any;
        private _heatLayer: any;
        private viewParameter: any;
        private heatPointList: any;
        private $container: any;
        private session: any;

        /** This is a description of the foo function. */
        _render($parent) {
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

        _renderProperties() {
            super._renderProperties();
            this._renderViewParameter();
            this._renderHeatPointList();
        };

        _remove() {
            super._remove();

            this.heatmap.remove();
            this.heatmap = null;
            this._heatLayer = null;
        };

        _handleViewParameterChanged() {
            this._send('viewParameterChanged', {
                center: {
                    x: this.heatmap.getCenter().lat,
                    y: this.heatmap.getCenter().lng
                },
                zoomFactor: this.heatmap.getZoom()
            });
        };

        _handleClicked(event) {
            this._send('clicked', {
                point: {
                    x: event.latlng.lat,
                    y: event.latlng.lng
                }
            });
        };

        _renderViewParameter() {
            this.heatmap.setView([this.viewParameter.center.x, this.viewParameter.center.y], this.viewParameter.zoomFactor);
        };

        _renderHeatPointList() {
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

        _onHeatPointsAdded(points) {
            var i: number;
            if (this._heatLayer) {
                for (i = 0; i < points.length; i++) {
                    this._heatLayer.addLatLng(points[i]);
                }
            }
        };

        onModelAction(event) {
            if (event.type === 'heatPointsAdded') {
                this._onHeatPointsAdded(event.points);
            } else {
                super.onModelAction(event);
            }
        };

    }
}
