import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, ToggleControl, SelectControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const locations = SelectUtils.posts({per_page: '-1', orderby: 'title', order: 'asc'}, 'location');
  const locationOptions = [
    { value: 0, label: 'Choose a location', disabled: true },
    ...locations.map(l => {return {label: l.title.raw, value: l.id}})
  ];
  const location = locations.find( ({ id }) => id == attributes.locationId );
  console.log(location);

  const locationSelect = () => html`
    <${SelectControl} 
      options=${locationOptions}
      value=${attributes.locationId}
      label="Location"
      onChange=${locationId => setAttributes({locationId: parseInt(locationId)})}
    />
  `
  const teaserText = () => html`
    <div>
      <h3 className="vm-teaser__title"><a>${location.title.rendered}</a></h3>
    </div>
  `;


  return html`
  <div ...${ blockProps }>
    ${attributes.locationId ? html`
      <div className="teaser--location">
        ${attributes.featured ? html`
        ` : html`
          <div>
            <div className="l-2col l-2col--33-67">
              <div className="l-first"></div>
              <div className="l-second">${location && teaserText()}</div>
            </div>
          </div>
        `}

      </div>
    ` : html`
      <div className="o-box">${locationSelect()}</div>
    `}
    <${InspectorControls}>
      <${PanelBody} title="Teaser Settings">
        ${locationSelect()}
        <${ToggleControl} 
          label='Featured'
          checked=${attributes.featured}
          onChange=${() => setAttributes({featured: !attributes.featured})}
        />

      </${PanelBody}>
    </${InspectorControls}>
  </div>
  `
}