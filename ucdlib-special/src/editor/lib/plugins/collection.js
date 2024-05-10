import * as React from 'react';
import { useController } from '@lit-labs/react/use-controller.js';
import { ApiController } from "./controller";
import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { TextControl, SelectControl, Button, HorizontalRule } from "@wordpress/components";
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useState } from '@wordpress/element';

const name = 'ucdlib-special-collection';

const runController = (recordId, meta, editPost) => {
  if(recordId === ''){
    return
  }
  let perma = null;

  let url = "/wp-json/ucdlib-special/collection_pnx/";
  let requestUrl = url + recordId;

  perma = new ApiController(requestUrl);
  perma["task"].then(function(result) {
    // @id causes issues in php, replace with id
    let fetchedLinks = result.links.map((r) => { return { id: r['@id'], linkType: r.linkType, linkURL: r.linkURL, displayLabel: r.displayLabel }});
    let fetchedFindingAid = fetchedLinks.filter(r => r.linkURL.includes('oac.cdlib.org/findaid'));
    if (fetchedFindingAid && fetchedFindingAid[0]) fetchedFindingAid = fetchedFindingAid[0];
    fetchedFindingAid.linkTitle = 'Finding Aid on the Online Archive of California'; // 'Online Archive of California (OAC)';
    fetchedLinks = fetchedLinks.filter(l => l.linkType === 'referenceInfo');
    // compare current meta with previous meta.fetched data, don't override user updated data
    let creator;
    if (meta.fetchedData && meta.creator !== meta.fetchedData.creator) {
      creator = meta.creator;
    } else {
      creator = result.author ? result.author[0] : '';
      creator = result.corp ? result.corp[0] : '';
    }

    let callNumber;
    if (meta.fetchedData && meta.callNumber !== meta.fetchedData.callNumber) {
      callNumber = meta.callNumber;
    } else {
      callNumber = result.callNumber;
    }

    let inclusiveDates;
    if (meta.fetchedData && meta.inclusiveDates !== meta.fetchedData.inclusiveDates) {
      inclusiveDates = meta.inclusiveDates;
    } else {
      inclusiveDates = result.date ? result.date[0] : '';
    }

    let findingAid;
    let findingAidsMatch = false;

    // check if findingAid objects have same data
    if (meta.fetchedData && Object.keys(meta.findingAid).length === Object.keys(meta.fetchedData.findingAid).length) {
      findingAidsMatch = Object.keys(meta.findingAid)
        .every(key => meta.fetchedData.findingAid.hasOwnProperty(key) && meta.fetchedData.findingAid[key] === meta.findingAid[key]);
    }
    if (!findingAidsMatch) {
      findingAid = meta.findingAid;
    } else {
      findingAid = Object.assign({}, fetchedFindingAid);
    }

    let description;
    if (meta.fetchedData && meta.description !== meta.fetchedData.description) {
      description = meta.description;
    } else {
      description = result.description.join(' ');
    }

    let extent;
    if (meta.fetchedData && meta.extent !== meta.fetchedData.extent) {
      extent = meta.extent;
    } else {
      extent = result.extent ? result.extent[0] : '';
    }

    let links;
    if (meta.fetchedData && meta.links !== meta.fetchedData.links) {
      links = meta.links;
    } else {
      links = fetchedLinks;
    }

    let subject;
    if (meta.fetchedData && meta.subject.filter(s => !meta.fetchedData.subject.includes(s)).length > 0) {
      subject = meta.subject;
    } else {
      subject = [...result.tags];
    }

    let title = result.title ? result.title[0] : '';
    // let currentTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
    wp.data.dispatch( 'core/editor' ).editPost( { title } );

    const fetchedData = {
      creator: result.author ? result.author[0] : '',
      callNumber: result.callNumber,
      creator: result.corp ? result.corp[0] : '',
      inclusiveDates: result.date ? result.date[0] : '',
      findingAid: Object.assign({}, fetchedFindingAid),
      description: result.description.join(' '),
      extent: result.extent ? result.extent[0] : '',
      links: fetchedLinks,
      subject: [...result.tags],
      title: result.title ? result.title[0] : '',
    };

    editPost(
      {meta:
        {
          fetchedData,
          callNumber,
          creator,
          inclusiveDates,
          findingAid,
          description,
          extent,
          links,
          subject,
        }
      }
    );
  });

}

const Edit = () => {
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
    runController(meta.almaRecordId, meta, editPost);
  }

  const revertTitle = () => {
    wp.data.dispatch( 'core/editor' ).editPost( { title: meta.fetchedData.title } );
    const renderedTitle = document.querySelector('.wp-block-post-title');
    if (renderedTitle) {
        renderedTitle.classList.remove('title-modified');
    }
  }

  if ( !isCollection) return html`<${Fragment} />`

  let titleHasChanged = false;
  let currentTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );
  if (currentTitle !== meta.fetchedData.title) {
    titleHasChanged = true;
  }



  return html`
    <${Fragment}>
      ${isCollection && html`
        <${PluginDocumentSettingPanel}
          name=${name}
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
              style=${{ marginBottom: '.5em' }}
              >Search Record ID
            </${Button}>

            <${HorizontalRule} />

            <${Button}
              variant="primary"
              onClick=${revertTitle}
              className='is-destructive'
              style=${{ marginBottom: '1.5em', marginTop: '.5em' }}
              disabled=${!titleHasChanged}>Revert Title
            </${Button}>

        </${PluginDocumentSettingPanel}>
      `}
    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };
