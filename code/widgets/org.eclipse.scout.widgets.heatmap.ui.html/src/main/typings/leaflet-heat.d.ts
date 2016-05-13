
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

//if we have multiple modules in one file:
//declare module "leaflet-heat" {
//    export = L;
//}

//We could define each module in its own .d.ts file with top-level export declarations, 
//but it's more convenient to write them as one larger .d.ts file.
//To do so, we use a construct similar to ambient namespaces, but we use the module keyword and
// the quoted name of the module which will be available to a later import
