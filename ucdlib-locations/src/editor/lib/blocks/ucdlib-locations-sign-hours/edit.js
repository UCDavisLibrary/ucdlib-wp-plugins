import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const locationId = attributes.locationId;
  const locations = SelectUtils.posts({per_page: '-1', orderby: 'title', order: 'asc'}, 'location');
  const locationOptions = [
    { value: 0, label: 'Select a Location', isDisabled: true},
    ...locations.map(l => {return {label: l.title.raw, value: l.id}})
  ];

  const eleProps = (() => {
    const props = {
      'api-host': window.location.origin,
      location: locationId,
    }
    return props;
  })();


  return html`
  <div ...${ blockProps }>
    <div>
      <ucdlib-hours-today-sign ...${eleProps}></ucdlib-hours-today-sign>
    </div>
    <${InspectorControls}>
      <${PanelBody} title="Block Settings">
        <${SelectControl} 
          options=${locationOptions}
          value=${locationId}
          label="Location"
          help="Will display hours for selected location"
          onChange=${locationId => setAttributes({locationId: parseInt(locationId)})}
        />
        <${RangeControl} 
          label="Refresh Rate"
          help="In minutes..."
          min="1"
          max="60"
          value=${attributes.refreshRate}
          onChange=${(refreshRate) => setAttributes({refreshRate: parseInt(refreshRate)})}
        />
      </${PanelBody}>
    </${InspectorControls}>
  </div>
  `
}