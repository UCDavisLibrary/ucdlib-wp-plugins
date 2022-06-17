import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, ToggleControl, SelectControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const currentPage = SelectUtils.editedPostAttribute('id');
  const locationId = attributes.locationId ? attributes.locationId : currentPage;

  const locations = SelectUtils.posts({per_page: '-1', orderby: 'title', order: 'asc'}, 'location');
  const locationOptions = [
    { value: 0, label: 'This Location'},
    ...locations.map(l => {return {label: l.title.raw, value: l.id}}).filter(l => l.value != currentPage)
  ];

  const eleProps = (() => {
    const props = {
      'api-host': window.location.origin,
      location: locationId,
      'widget-title': attributes.widgetTitle,
      'child-filter': attributes.childFilter,
      'see-more-text': attributes.seeMoreText
    }
    if ( attributes.hideTitle ) props['hide-title'] = 'true';
    if ( attributes.showChildren ) props['show-children'] = 'true';
    if ( attributes.onlyShowChildren ) props['only-show-children'] = 'true';
    if ( attributes.hideSeeMore ) props['hide-see-more'] = 'true';
    return props;
  })();

  const setShowChildren = () => {
    const v = !attributes.showChildren
    let props = {
      showChildren: v
    }
    if ( !v ) {
      props['onlyShowChildren'] = false;
      props['childFilter'] = "";
    }
    setAttributes(props);
  }

  return html`
  <div ...${ blockProps }>
    <div className="${attributes.flush ? '' : 'o-box panel'}">
      <ucdlib-hours-today ...${eleProps}></ucdlib-hours-today>
    </div>
    <${InspectorControls}>
      <${PanelBody} title="Widget Settings">
        <${SelectControl} 
          options=${locationOptions}
          value=${currentPage == locationId ? 0 : locationId}
          label="Location"
          help="Will display hours for selected location"
          onChange=${locationId => setAttributes({locationId: parseInt(locationId)})}
        />
        <${ToggleControl} 
          label='Hide Title'
          checked=${attributes.hideTitle}
          onChange=${() => setAttributes({hideTitle: !attributes.hideTitle})}
        />
        ${!attributes.hideTitle && html`
          <${TextControl} 
            value=${attributes.widgetTitle}
            label="Title Text"
            onChange=${widgetTitle => setAttributes({widgetTitle})}
          />
        `}
        <${ToggleControl} 
          label="Show Children"
          checked=${attributes.showChildren}
          onChange=${setShowChildren}
          help="Show hours of any child locations"
        />
        ${attributes.showChildren && html`
          <div>
            <${ToggleControl} 
              label="Only Show Children"
              checked=${attributes.onlyShowChildren}
              onChange=${() => setAttributes({onlyShowChildren: !attributes.onlyShowChildren})}
              help="Will hide the hours of the parent location."
            />
            <${TextControl} 
              label="Only Show Selected Children"
              value=${attributes.childFilter}
              onChange=${childFilter => setAttributes({childFilter})}
              help="Enter a comma-separated list of location post ids"
            />
          </div>
        `}
        <${ToggleControl} 
          label="Hide 'See more' link"
          checked=${attributes.hideSeeMore}
          onChange=${() => setAttributes({hideSeeMore: !attributes.hideSeeMore})}
        />
        ${!attributes.hideSeeMore && html`
          <${TextControl} 
            label="'See More' link text"
            value=${attributes.seeMoreText}
            onChange=${seeMoreText => setAttributes({seeMoreText})}
          />
        `}
        <${ToggleControl} 
          label="Make Flush"
          checked=${attributes.flush}
          onChange=${() => setAttributes({flush: !attributes.flush})}
          help="Will remove all padding and margins from widget"
        />

      </${PanelBody}>
    </${InspectorControls}>
  </div>
  `
}