import { Fragment, useState, useEffect } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch, useSelect } from "@wordpress/data";
import { 
  ToggleControl,
  TextControl,
  SelectControl, 
  PanelRow, 
  BaseControl, 
  Button, 
  Modal } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs, getPath } from '@wordpress/url';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-locations-hours';

const Edit = () => {

  // get metadata
  const isLocation = SelectUtils.editedPostAttribute('type') === 'location';
  const meta = SelectUtils.editedPostAttribute('meta');
  const hasOperatingHours = meta.has_operating_hours ? true : false;
  const libcalId = meta.libcal_id ? meta.libcal_id : '';
  const watchedVars = [
    hasOperatingHours
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );



  return html`
    <${Fragment}>
      ${isLocation && html`
        <${PluginDocumentSettingPanel}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '15px', minWidth: '15px'}} icon="ucd-public:fa-clock"></ucdlib-icon>`}
          title="Hours and Occupancy">
          <${ToggleControl} 
            label="Display Operating Hours"
            checked=${hasOperatingHours}
            onChange=${() => editPost({meta: { has_operating_hours: !hasOperatingHours}})}
          />
          ${hasOperatingHours && html`
            <${TextControl} 
              label="Libcal ID"
              value=${libcalId}
              onChange=${libcal_id => editPost({meta: {libcal_id}})}
              help="Can be found here: https://ucdavis.libcal.com/admin/hours"
            />
          `}
        </${PluginDocumentSettingPanel}>
      `}
    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };