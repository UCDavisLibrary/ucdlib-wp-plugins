import * as React from 'react';
import { useController } from '@lit-labs/react/use-controller.js';
import { ApiController } from "./controller";
import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { TextControl, SelectControl, Button } from "@wordpress/components";
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useState } from '@wordpress/element';


const name = 'ucdlib-special-collection';

const runController = (recordId) => {
  // todo 
  let perma = null;
  console.log('pinging api');

  if(recordId !== ''){
    console.log("empty");
  }
  let url = "http://localhost:3000/wp-json/ucdlib-special/collection_pnx/";
  let requestUrl = url + recordId;//attributes.almaRecordId;
  let results = {};
  console.log("U:",React);


  perma =  useController(React, (host) => new ApiController(host, requestUrl));
  console.log("Control:", perma);
  return perma.task["_value"];


}

const Edit = () => {
  const [ almaRecord, setAlmaRecord ] = useState( '' );
  // get metadata
  const isCollection = SelectUtils.editedPostAttribute('type') === 'collection';
  const meta = SelectUtils.editedPostAttribute('meta');
  const collectionType = meta.collectionType || 'manuscript';
  const almaRecordId = meta.almaRecordId;



  const watchedVars = [
    collectionType
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );

  const collectionTypeOptions = [
    {value: 'manuscript', label: 'Manuscript'},
    {value: 'university-archive', label: 'University Archive'}
  ];

  const searchRecordId = () => {
    // todo
    console.log('pinging api');
    // editPost({meta: {almaRecordId: meta.almaRecordId}});
    setAlmaRecord(meta.almaRecordId);

    
    // update slug to use recordId
    // const slug = SelectUtils.editedPostAttribute('slug') || '';
    // const { editPost } = useDispatch( 'core/editor', [ slug ] );
    // editPost({slug: attributes.almaRecordId });
  }

  console.log("Attribute:", almaRecordId);
  const ctlResult = runController(almaRecord);
  console.log("Result:",ctlResult);

  return html`
    <${Fragment}>
      ${isCollection && html`
        <${PluginDocumentSettingPanel}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-file-invoice"></ucdlib-icon>`}
          title="This Collection">
            <${SelectControl} 
              options=${collectionTypeOptions}
              label="Collection Type"
              value=${collectionType}
              onChange=${collectionType => editPost({meta: {collectionType}})}
            /> 
            <${TextControl} 
              value=${almaRecordId}
              label="Alma Record ID"
              onChange=${almaRecordId => editPost({meta: {almaRecordId}})}
            />
            <${Button} 
              variant="primary"
              onClick=${searchRecordId}
              style=${{ marginBottom: '1.5em' }}
              >Search Record ID
            </${Button}>
        </${PluginDocumentSettingPanel}>
      `}
    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };