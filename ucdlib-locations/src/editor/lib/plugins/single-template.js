import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { 
  ToggleControl,
  TextareaControl,
  TextControl } from '@wordpress/components';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-locations-single-template';

const Edit = () => {

  // get metadata
  const isLocation = SelectUtils.editedPostAttribute('type') === 'location';
  const meta = SelectUtils.editedPostAttribute('meta');
  const hideHours = meta.hide_hours_block ? true : false;
  const hideAmenities = meta.hide_amenities_block ? true : false;
  const watchedVars = [
    hideHours,
    hideAmenities
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );


  return html`
    <${Fragment}>
      ${isLocation && html`
        <${PluginDocumentSettingPanel}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '15px', minWidth: '15px'}} icon="ucd-public:fa-eye"></ucdlib-icon>`}
          title="Template Blocks">
          <${ToggleControl} 
            label="Hide Hours Block"
            checked=${hideHours}
            onChange=${() => editPost({meta: { hide_hours_block: !hideHours}})}
          />
          <${ToggleControl} 
            label="Hide Amenities Block"
            checked=${hideAmenities}
            onChange=${() => editPost({meta: { hide_amenities_block: !hideAmenities}})}
          />
        </${PluginDocumentSettingPanel}>
      `}
    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };