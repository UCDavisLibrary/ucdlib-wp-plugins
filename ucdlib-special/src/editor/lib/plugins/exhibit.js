import { Fragment } from "@wordpress/element";
import { PluginPostStatusInfo } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { 
  SelectControl, 
  TextControl,
  __experimentalText as Text,
  ToggleControl,
  Modal, 
  Button } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-special-exhibit';

const Edit = () => {

  // bail if not exhibit
  const isExhibit = SelectUtils.editedPostAttribute('type') === 'exhibit';
  if ( !isExhibit )  return html`<${Fragment} />`;

  const {editEntityRecord} = useDispatch( 'core' );

  const [ modalIsOpen, setModalOpen ] = useState( false );
	const openModal = () => {
    if ( !topExhibit ) {
      setExhibitTitle(postTitle);
    }
    setModalOpen( true )
  };
	const closeModal = () => setModalOpen( false );
  
  const saveMetadata = () => {
    if ( topExhibit ) {
      const data = {
        title: exhibitTitle,
        meta: {
          isOnline: exhibitIsOnline
        }
      }
      editEntityRecord('postType', 'exhibit', topExhibit, data);
    } else {

    }
    closeModal();
  }

  // set default metadata to current page
  const postTitle = SelectUtils.editedPostAttribute('title');
  const meta = SelectUtils.editedPostAttribute('meta');
  const watchedVars = [
    meta.isOnline
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );
  const [ exhibitTitle, setExhibitTitle ] = useState( postTitle );
  const [ exhibitIsOnline, setExhibitIsOnline ] = useState( meta.isOnline );


  // retrieve metadata from parent if applicable
  const parent = SelectUtils.editedPostAttribute('parent') || 0;
  const [ parentError, setParentError ] = useState( false );
  const [ topExhibit, setTopExhibit ] = useState( 0 );
  useEffect(() => {
    if ( !parent ) {
      setParentError(false);
      setTopExhibit(0);
      return;
    }
    const path = `ucdlib-special/exhibit-page/${parent}`;
    apiFetch( {path} ).then( 
      ( r ) => {
        setParentError(false);
        setTopExhibit(r.exhibitId);
        setExhibitTitle(r.exhibitTitle);
        setExhibitIsOnline(r.exhibitIsOnline);
      }, 
      (error) => {
        setParentError(true);
      })

  }, [parent]);

  return html`

    <${PluginPostStatusInfo}
      className=${name}
      icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-image"></ucdlib-icon>`}
      title="This Exhibit">
        <div>
          <${Button} onClick=${openModal} variant="primary">Edit Exhibit Metadata</${Button}>
          ${modalIsOpen && html`
            <${Modal} title='Exhibit Metadata' onRequestClose=${closeModal}>
              ${parentError ? html`
                <div><p>There was an error when retrieving exhibit metadata. Please try again later.</p></div>
              ` : html`
                <div>
                  <${TextControl} 
                    label='Exhibit Title'
                    value=${exhibitTitle}
                    onChange=${(v) => setExhibitTitle(v)}
                  />
                  <${ToggleControl} 
                    label='Is Online Exhibit'
                    checked=${exhibitIsOnline}
                    onChange=${() => {setExhibitIsOnline(!exhibitIsOnline)}}
                  />
                  <div style=${{margin: '10px 0'}}>
                    <${Button} onClick=${saveMetadata} variant="primary">${topExhibit ? 'Queue Changes' : 'Save'}</${Button}>
                    <${Button} onClick=${closeModal} variant="secondary">Close</${Button}>
                  </div>
                  ${topExhibit != 0 && html`
                    <${Text} isBlock variant='muted'>After queueing a change, you must still 'Update' this page to save.</${Text}>
                  `}
                </div>
              `}
            </${Modal}>
          `}

        </div>
    </${PluginPostStatusInfo}>

  `
}

const settings = {render: Edit};
export default { name, settings };