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

  const imgAspectRatio = attributes.featured ? '1x1' : '4x3';
  const imgSrc = SelectUtils.previewImage(location, imgAspectRatio);

  const locationSelect = () => html`
    <${SelectControl} 
      options=${locationOptions}
      value=${attributes.locationId}
      label="Location"
      onChange=${locationId => setAttributes({locationId: parseInt(locationId)})}
    />
  `
  const teaserText = () => {
    const meta = location.meta;
    const moreText = `More${meta.label_short ? " " + meta.label_short: ''} Info`;
    return html`
    <div>
      <div className="u-space-mb--small">
        <h3 className="vm-teaser__title"><a>${location.title.rendered}</a></h3>
        ${(meta.display_address ? true : false) && html`
          <div>
            <span className="icon icon--location">${meta.display_address}</span>
          </div>
        `}
        ${(meta.has_alert && html`
          <div>
            <span className="icon-ucdlib">
              <ucdlib-icon icon='ucd-public:fa-circle-exclamation'></ucdlib-icon>
              <span>${meta.alert_text}</span>
            </span>
          </div>
        `)}
      </div>
      ${meta.has_operating_hours && html`
        <ucdlib-hours-today-simple class="u-space-mb--small" api-host=${window.location.origin} location=${location.id}></ucdlib-hours-today-simple>
      `}
      <div>
        <a className="icon icon--circle-arrow-right">${moreText}</a>
      </div>
    </div>
  `};

  const teaserImage = () => html`
    <a style=${{display: 'block', backgroundImage: `url(${imgSrc})`}} className="aspect--${imgAspectRatio} u-background-image"></a>
  `


  return html`
  <div ...${ blockProps }>
    ${attributes.locationId ? html`
      <div className="teaser--location">
        ${attributes.featured ? html`
          <div className='vm-teaser teaser--location--featured'>
            <div className="vm-teaser__figure category">
              ${teaserImage()}
            </div>
            <div className="vm-teaser__body">
              ${location && teaserText()}
            </div>
          </div>
        ` : html`
          <div>
            <div className="l-2col l-2col--33-67 l-maintain-grid">
              <div className="l-first">
                ${teaserImage()}
              </div>
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