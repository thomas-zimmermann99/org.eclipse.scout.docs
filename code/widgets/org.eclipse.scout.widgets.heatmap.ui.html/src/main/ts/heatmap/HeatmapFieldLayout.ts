
module scout {

    export declare class AbstractLayout { };

    export class HeatmapFieldLayout extends scout.AbstractLayout {

        constructor(private field: HeatmapField) {
            super();
        }

        layout($container) {
            var htmlContainer = (< any > scout).HtmlComponent.get($container);

            // Because of a bug (?) in Leaflet.js, the canvas size must not get smaller than
            // 1x1 pixels, otherwise an exception is thrown: "Failed to execute 'getImageData'
            // on 'CanvasRenderingContext2D': The source width is 0."
            var size = htmlContainer.getSize();
            if (size.width === 0 || size.height === 0) {
                size.width = Math.max(size.width, 1);
                size.height = Math.max(size.height, 1);
                (<any>scout).graphics.setSize($container, size);
            }

            this.field.heatmap.invalidateSize();
        }

    }
}
