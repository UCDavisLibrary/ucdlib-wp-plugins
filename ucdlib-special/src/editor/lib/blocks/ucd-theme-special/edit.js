import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { TextControl, PanelBody, Button } from "@wordpress/components";
import { useBlockProps, BlockControls, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";
import * as React from 'react';
import { useController } from '@lit-labs/react/use-controller.js';
import { ApiController } from "./controller";
import { useRef, useEffect } from "@wordpress/element";

const runController = (recordId) => {
  // todo 
  console.log('pinging api');
  if(recordId !== ''){
    console.log("empty");
  }
  let url = "http://localhost:3000/wp-json/ucdlib-special/collection_pnx/";
  let requestUrl = url + recordId;//attributes.almaRecordId;
  let results = {};
  let perma =  useController(React, (host) => new ApiController(host, requestUrl));
  return perma.task["_value"];


}

export default ( props ) => {

  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  console.log("Attribute:", attributes.almaRecordId);
  const ctlResult = runController(attributes.almaRecordId);
  console.log("Result:",ctlResult);



  const runButton = (almaRecordId) => {  
    console.log("Here");

    setAttributes({almaRecordId});
    //update slug to use recordId
    // const slug = SelectUtils.editedPostAttribute('slug') || '';
    // const { editPost } = useDispatch( 'core/editor', [ slug ] );
    // editPost({slug: attributes.almaRecordId });
  
  }



  return html`
  <div ...${ blockProps }>

    <${BlockControls} group="block">
      
    </${BlockControls}>

    <${InspectorControls}>
      <${PanelBody} title="Widget Settings">
        <div className='collection-controls'>
          <${TextControl} 
            value=${attributes.almaRecordId}
            label="Alma Record ID:"
            onChange=${almaRecordId => setAttributes({almaRecordId})}
          />
          <${Button} 
            variant="primary"
            onClick=${almaRecordId => {runButton(attributes.almaRecordId)}}
            style=${{ marginBottom: '1.5em' }}
            >Search Record ID
          </${Button}>
          <${TextControl} 
            value=${attributes.callNumber}
            label="URL/Slug:"
            onChange=${callNumber => setAttributes({callNumber})}
          />
          <${TextControl} 
            value=${attributes.callNumber}
            label="Call Number:"
            onChange=${callNumber => setAttributes({callNumber})}
          />
          <${TextControl} 
            value=${attributes.featuredImage}
            label="Featured Image:"
            onChange=${featuredImage => setAttributes({featuredImage})}
          />
          <${TextControl} 
            value=${attributes.extent}
            label="Extent:"
            onChange=${extent => setAttributes({extent})}
          />
          <${TextControl} 
            value=${attributes.extentUnit}
            label="Extent Unit:"
            onChange=${extentUnit => setAttributes({extentUnit})}
          />
          <${TextControl} 
            value=${attributes.findingAid}
            label="Finding Aid:"
            onChange=${findingAid => setAttributes({findingAid})}
          />
          <${TextControl} 
            value=${attributes.history}
            label="History:"
            onChange=${history => setAttributes({history})}
          />
        </div>
      </${PanelBody}>
    </${InspectorControls}>

    <div>
        <${InnerBlocks} />
    </div>
  </div>
  `
}