import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, ToggleControl, SelectControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const locations = SelectUtils.posts({per_page: '-1', orderby: 'title', order: 'asc'}, 'location');
  
  const locationOptions = locations
    .filter(l => l.meta.location_parent != 0)
    .map(l => {return {label: l.title.raw, value: l.id}});

  const eleProps = (() => {
    const props = {
      'api-host': window.location.origin,
      'surface-children': attributes.surfaceChildren.join(',')
    }
    return props;
  })();


  return html`
  <div ...${ blockProps }>
    <div>
      <style>
        .hours-inspector-controls select[multiple] {
          height: auto !important;
          padding: 8px;
        }
        .hours-inspector-controls select[multiple] + .components-input-control__suffix {
          display: none;
        }
      </style>
      <ucdlib-hours ...${eleProps}></ucdlib-hours>
    </div>
    <${InspectorControls}>
      <${PanelBody} title="Widget Settings">
        <div className='hours-inspector-controls'>
          <${SelectControl} 
            options=${locationOptions}
            multiple=${true}
            value=${attributes.surfaceChildren}
            label="Don't Collapse Services"
            help="Selected locations will not be in accordion section."
            onChange=${surfaceChildren => setAttributes({surfaceChildren})}
          />
        </div>
      </${PanelBody}>
    </${InspectorControls}>
  </div>
  `
}