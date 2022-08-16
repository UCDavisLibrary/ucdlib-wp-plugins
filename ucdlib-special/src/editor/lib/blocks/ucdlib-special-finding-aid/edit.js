import { html, SelectUtils, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import { Button, Modal, TextControl, ToolbarButton } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";
import { useState } from '@wordpress/element';

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const startingModalData = {
    linkTitle: '',
    linkURL: ''
  };
  const [ modalIsOpen, setModalOpen ] = useState( false );
  const [ modalMode, setModalMode ] = useState( 'Add' );
  const [ modalData, setModalData ] = useState( startingModalData );

  // modal validation
  const modalCanSave = (() => {
    if ( 
      !modalData || 
      !modalData.linkURL
      ) {
        return false
      }
    return true;
  })();

  // useEffect(() => {

  // }, [modalIsOpen])

  const onUrlChange = (url) => {
    setModalData({
      linkTitle: modalData.linkTitle,
      linkURL: url
    });
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const onModalSave = () => {
    debugger;
    setModalOpen(false);
    const findingAid = JSON.parse(JSON.stringify(meta.findingAid));
    findingAid.linkTitle = modalData.linkTitle;
    findingAid.linkURL = modalData.linkURL;
    editPost({meta: {findingAid}});
  }

  const onUndoClicked = (e) => {
    const findingAid = JSON.parse(JSON.stringify(meta.fetchedData.findingAid));
    editPost({meta: {findingAid}});
    setModalData({
      linkTitle: findingAid.linkTitle,
      linkURL: findingAid.linkURL
    });
  } 

  let isModified = false;
  if (meta.fetchedData) {
    if (meta.fetchedData.findingAid.linkTitle || meta.fetchedData.findingAid.linkURL) {
      isModified = !Object.keys(meta.findingAid)
        .every(key => meta.fetchedData.findingAid.hasOwnProperty(key) && meta.fetchedData.findingAid[key] === meta.findingAid[key]);
    } else if (meta.findingAid.linkTitle || meta.findingAid.linkURL) {
      // isModified = !Object.values(meta.findingAid)
      //   .every(value => value === '' || !value);
      isModified = true;
    }
  }

  const onFindingAidClicked = (e) => {
    debugger;
    // update modalData with this links data
    setModalData({
      linkTitle: meta.findingAid.linkTitle,
      linkURL: meta.findingAid.linkURL
    });

    setModalMode('Edit');
    setModalOpen(true);
  }  

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${UCDIcons.render('undo')}
        onClick=${onUndoClicked}
        label="Restore Finding Aid to Default"
        disabled=${!isModified}
      />
    </${BlockControls}>

    <div onClick=${e => onFindingAidClicked(e)} className="clickable">
      <h4>Finding Aid ${isModified ? html`<span className="strawberry">*</span>` : ''}</h4>      
      <a href=${meta.findingAid.linkURL} style=${{ display: 'inline-block', pointerEvents: 'none' }}>${meta.findingAid.linkTitle}</a>
    </div>
    
    ${modalIsOpen && html`
      <${Modal} title=${modalMode + " Finding Aid Link"} onRequestClose=${closeModal}>
        <div>
          <${TextControl} 
            label="Url"
            value=${modalData.linkURL}
            onChange=${onUrlChange}
            type="url"
          />
          <${Button} 
            onClick=${onModalSave}
            variant='primary' 
            disabled=${!modalCanSave}>${modalMode == 'Add' ? 'Add Finding Aid Link' : 'Save Changes'}</${Button}>
        </div>
      </${Modal}>
    `}
  </div>
  `
}