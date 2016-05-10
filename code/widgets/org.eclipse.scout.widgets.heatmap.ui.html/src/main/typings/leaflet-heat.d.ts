
declare namespace L {
    export function heatLayer(latlngs: number[][], options?: HeatLayerOptions): HeatLayer;


    export interface HeatLayer {
        initialize(latlngs: number[][], options: HeatLayerOptions);
        setLatLngs(latlngs: number[][]);
        addLatLng(latlng: number[]): HeatLayer;
        setOptions(options): HeatLayer;
        redraw(): HeatLayer;
        onAdd(map: Map): void;
        onRemove(map: Map): void;
        addTo(map: Map): HeatLayer;
    }

    export interface HeatLayerOptions {
        minOpacity?: number;
        maxZoom?: number;
        radius?: number;
        blur?: number;
        max?: number
    }

}

declare module "leaflet-heat" {
    export = L;
}

