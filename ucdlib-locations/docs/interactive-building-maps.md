# Interactive Building Maps

## Public Elements

```html
<ucdlib-map-building>
  <ucdlib-map-space-legend>
    <script type="application/json">
      {
        "title": "Study Spaces",
        "spaces": [
            {
            "slug": "silent",
            "label": "Silent Zone",
            "color": "putah-creek",
            "icon": "ucd-public:fa-volume-mute",
            "offByDefault": true
            }
        ]
      }
    </script>
  </ucdlib-map-space-legend>
  <ucdlib-map-legend>
    <script type="application/json">
      {
        "title": "Map Legend",
        "items": [
            {
            "label": "Information",
            "icon": "ucd-public:fa-info-public"
            },
            {
            "label": "Accessible",
            "icon": "ucd-public:fa-wheel-chair"
            }
        ]
      }
    </script>
  </ucdlib-map-legend>
  <ucdlib-map-floor>
    <script type="application/json">
      {
        "title": "Lower Level",
        "subTitle": "Call Numbers: A,B,D - DD",
        "navText": "L",
        "topLayer": "/wp-content/2023/04/shields-ll-bottom",
        "bottomLayer": "/wp-content/2023/04/shields-ll-bottom",
        "layers": [
          {
            "slug": "silent",
            "src": "/wp-content/2023/04/shields-ll-silent"
          }
        ]
      }
    </script>
  </ucdlib-map-floor>
</ucdlib-map-building>
```

### ucdlib-building-map
Controller element with the following roles:
- Displays floor nav (if more than one floor). Detected from `<ucdlib-map-floor>` children.
- Displays selected floor, by communicating with `ucdlib-map-floor` elements.
- Ingests and displays `ucdlib-map-space-legend` element. Listens to its `toggle-space` events
- Ingests and displays the `ucdlib-map-legend` element.

### ucdlib-map-space-legend
Displays the menu/legend that allows user to toggle a map layer on/off. Emits the `toggle-space` event with the following detail: 
```json
{"slug": "silent", "on": true}
```
All toggle sliders are disabled by default, and `enableSwitches(slugs[])` is called by `ucdlib-map-building` on initial load or when a floor changes.
There is only one per `ucdlib-map-building` element

### ucdlib-map-legend
Displays the static map lengend. There is only one per `ucdlib-map-building` element

### ucdlib-map-floor
Displays the static bottom + top layers, and dynamic space layers. `ucdlib-building-map` element calls `showLayers(['slug1', 'slug2'])`, method, which displays active layers.

### mdc-switch
The `ucdlib-map-space-legend` requires a toggle switch that is not in the UCD brand. This component simply loads the [material design switch component](https://www.npmjs.com/package/@material/switch). Whenever you update the component version, you will have to run the `generate-css` script.

## Editor

This element introduces several new gutenberg blocks:
- `ucdlib-locations-map-building`  
  The parent block, and the only one queryable/insertable into a page. Has a locked template consisting of three blocks: *ucdlib-locations-map-floors*, *ucdlib-locations-map-legend*, and *ucdlib-locations-map-space-legend*
- `ucdlib-locations-map-floors`  
  Parent to *ucdlib-locations-map-floor* blocks.
- `ucdlib-locations-map-floor`  
  Can only be placed in *ucdlib-locations-map-floors* block. Allows user to upload floor map and set metadata.
- `ucdlib-locations-map-floor-layer`  
- Can only be placed in *ucdlib-locations-map-floor-layer* block. Allows user to upload floor zone layers.
- `ucdlib-locations-map-legend`  
  Parent to *ucdlib-locations-map-legend-item* blocks.
- `ucdlib-locations-map-legend-item`  
  Can only be placed in *ucdlib-locations-map-legend* block. Allows user to add a legend item (text and icon) corresponding to icon in floor maps.
- `ucdlib-locations-map-space-legend`  
  Parent to *ucdlib-locations-map-space-legend-item* blocks.
- `ucdlib-locations-map-space-legend-item`  
  Can only be placed in *ucdlib-locations-map-space-legend* block. Allows user to add a space (text, icon, and color). When uploading

Which are built from the following existing custom theme components:
- `IconPicker` - For selecting icons for legends
- `ToolbarColorPicker` - For selecting colors of space legend icons
- `ImagePicker` - For selecting image layers