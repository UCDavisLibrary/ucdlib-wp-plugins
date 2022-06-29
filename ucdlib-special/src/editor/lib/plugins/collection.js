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

const runController = (recordId, meta, editPost) => { 
  if(recordId === ''){
    return
  }
  let perma = null;

  console.log('pinging api');
  let url = "http://localhost:3000/wp-json/ucdlib-special/collection_pnx/";
  let requestUrl = url + recordId;
  perma = new ApiController(requestUrl);
  perma["task"].then(function(result) {
    editPost(
      {meta:
        {
          creator: result.author ? result.author[0] : null, 
          callNumber: result.callNumber,
          creator: result.corp ? result.corp[0] : null,
          inclusiveDates: result.date ? result.date[0] : null,
          description: result.description.join(' '),
          extent: result.extent ? result.extent[0] : null,
          links: result.links,
          subject: result.tags,
          title: result.title ? result.title[0] : null,
        }

      }
    );
    console.log("RE:",meta);


    // if(result.author) { 
    //   editPost({meta: {creator: result.author[0]}});
    // }
    // if(result.callNumber) { 
    //   editPost({meta: {callNumber: result.callNumber}});
    // }
    // if(result.corp) { 
    //   editPost({meta: {creator: result.corp[0]}});
    // }
    // if(result.date) { 
    //   editPost({meta: {inclusiveDates: result.date[0]}});
    // }
    // if(result.description) { 
    //   editPost({meta: {description: result.description.join(' ')}});
    // }
    // if(result.extent) { 
    //   editPost({meta: {extent: result.extent[0]}});
    // }
    // if(result.links) { 
    //   editPost({meta: {links: result.links}});
    // }
    // if(result.tags) { 
    //   editPost({meta: {subject: result.tags}});
    // }
    // if(result.title) { 
    //   editPost({meta: {title: result.title[0]}});
    // }
    // console.log(meta.creator)
  });

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
  debugger;
  const searchRecordId = () => {
    // todo
    console.log('pinging api');
    runController(meta.almaRecordId, meta, editPost);


  }


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