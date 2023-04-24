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
        "bottomLayer": "/wp-content/2023/04/shields-ll-bottom",
        "topLayer": "/wp-content/2023/04/shields-ll-bottom",
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
All toggle sliders are disabled by default, and `enableSliders(slugs[])` is called by `ucdlib-map-building` on initial load or when a floor changes.
There is only one per `ucdlib-map-building` element

### ucdlib-map-legend
Displays the static map lengend. There is only one per `ucdlib-map-building` element

### ucdlib-map-floor
Displays the static bottom + top layers, and dynamic space layers. `ucdlib-building-map` element calls `showLayer('slug')` or `hideLayer('slug')` method.