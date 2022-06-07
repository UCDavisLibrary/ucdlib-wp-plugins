import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";
import { TextControl, PanelBody, ToggleControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  // get metadata
  const meta = SelectUtils.editedPostAttribute('meta');
  const hide = meta.hide_hours_block ? true : false;
  const watchedVars = [
    hide
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );

  const currentPage = SelectUtils.editedPostAttribute('id');
  const locationId = attributes.locationId ? attributes.locationId : currentPage;

  const eleProps = (() => {
    const props = {
      'api-host': window.location.origin,
      location: locationId,
      'widget-title': attributes.widgetTitle,
      'child-filter': attributes.childFilter
    }
    if ( attributes.hideTitle ) props['hide-title'] = 'true';
    if ( attributes.showChildren ) props['show-children'] = 'true';
    if ( attributes.onlyShowChildren ) props['only-show-children'] = 'true';
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
    ${!hide && html`
      <div className="${attributes.flush ? '' : 'o-box panel'}">
        <ucdlib-hours-today ...${eleProps}></ucdlib-hours-today>
      </div>
    `}
    <${InspectorControls}>
      <${PanelBody} title="Widget Settings">
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