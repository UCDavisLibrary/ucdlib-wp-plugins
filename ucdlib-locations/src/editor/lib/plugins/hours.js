import { Fragment, useState, useEffect } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch, useSelect } from "@wordpress/data";
import { 
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


  return html`
    <${Fragment}>
      ${isLocation && html`
        <${PluginDocumentSettingPanel}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '15px', minWidth: '15px'}} icon="ucd-public:fa-clock"></ucdlib-icon>`}
          title="Hours and Occupancy">
          <p> hello world</p>
        </${PluginDocumentSettingPanel}>
      `}
    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };