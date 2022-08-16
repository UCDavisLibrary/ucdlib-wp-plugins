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
    linkURL: '',
    index: -1 // store the index of the additionalInfo link to reference when updating meta
  };
  const [ modalIsOpen, setModalOpen ] = useState( false );
  const [ modalMode, setModalMode ] = useState( 'Add' );
  const [ modalData, setModalData ] = useState( startingModalData );

  // modal validation
  const modalCanSave = (() => {
    if ( 
      !modalData || 
      !modalData.linkTitle || 
      !modalData.linkURL
      ) {
        return false
      }
    return true;
  })();

  const onTitleChange = (title) => {
    setModalData({
      linkTitle: title,
      linkURL: modalData.linkURL,
      linkIndex: modalData.linkIndex
    });
  }

  const onUrlChange = (url) => {
    setModalData({
      linkTitle: modalData.linkTitle,
      linkURL: url,
      linkIndex: modalData.linkIndex
    });
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const onModalSave = () => {
    setModalOpen(false);
    const links = JSON.parse(JSON.stringify(meta.links));
    let additionalInfo = links[modalData.linkIndex];
    if (!additionalInfo) {
      additionalInfo = { linkType: 'referenceInfo', displayLabel: '', linkURL: '' };
      links.push(additionalInfo);  
    }
    additionalInfo.displayLabel = modalData.linkTitle;
    additionalInfo.linkURL = modalData.linkURL;
    editPost({meta: {links}});
  }

  const onAddLink = () => {
    let metaLinks = JSON.parse(JSON.stringify(meta.links));
    const additionalInfo = { linkURL: '', displayLabel: 'Add new link info', linkType: 'referenceInfo' };
    metaLinks.push(additionalInfo);
    editPost({meta: {links: metaLinks}});
  }

  const onUndoClicked = (e) => {
    let metaLinks = JSON.parse(JSON.stringify(meta.links));
    const fetchedDataLinks = meta.fetchedData.links;
    let spliceAt = -1;
    metaLinks.forEach((ai, index) => {
      if (ai.linkType === 'referenceInfo' && fetchedDataLinks[index]) {
        metaLinks[index].displayLabel = fetchedDataLinks[index].displayLabel;
        metaLinks[index].linkURL = fetchedDataLinks[index].linkURL;
      } else if (ai.linkType === 'referenceInfo' && (spliceAt === -1 || index < spliceAt)) {
        // link was added after fetched, should be removed
        spliceAt = index;
      }
    });
    metaLinks.splice(spliceAt);
    editPost({meta: {links: metaLinks}});
  }

  let isModified = false;
  if (meta.fetchedData) {
    let fetchedRecord = meta.fetchedData.links.filter(l => l.linkType === 'referenceInfo');
    if (fetchedRecord) {
      fetchedRecord.forEach((value, index) => {
        if (!isModified) {
          const currentRecord = Object.values(meta.links).filter(l => l.linkType === 'referenceInfo')[index];
          isModified = !Object.keys(currentRecord)
            .every(key => fetchedRecord[index].hasOwnProperty(key) && fetchedRecord[index][key] === currentRecord[key]);
        }
      });
    }
    // also check that no new links have been added
    if (fetchedRecord.length !== meta.links.filter(l => l.linkType === 'referenceInfo').length) {
      isModified = true;
    }
  }

  const onAdditionalInfoClicked = (e, link, index) => {
    // update modalData with this links data
    setModalData({
      linkTitle: link.displayLabel,
      linkURL: link.linkURL,
      linkIndex: index
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
        label="Restore Additional Collection Info to Default"
        disabled=${!isModified}
      />
      <${ToolbarButton} 
        icon=${UCDIcons.render('link')}
        onClick=${onAddLink}
        label="Add another link"
      />
    </${BlockControls}>

    <div>
      <h4>Additional Collection Info ${isModified ? html`<span className="strawberry">*</span>` : ''}</h4>
      
      ${meta.links.map((link, index) => {
        if (link.linkType === 'referenceInfo') {
          return <div 
            onClick={e => onAdditionalInfoClicked(e, link, index)} 
            key={index}
            style={{ cursor: 'pointer' }}>
              <a 
                href={link.linkURL} 
                style={{ display: 'block', pointerEvents: 'none' }}  
              >{link.displayLabel}</a>
            </div>
        }
      })}

      ${modalIsOpen && html`
        <${Modal} title=${modalMode + " Additional Info Link"} onRequestClose=${closeModal}>
          <div>
            <${TextControl} 
              label="Title"
              value=${modalData.linkTitle}
              onChange=${onTitleChange}
            />
            <${TextControl} 
              label="Url"
              value=${modalData.linkURL}
              onChange=${onUrlChange}
              type="url"
            />
            <${Button} 
              onClick=${onModalSave}
              variant='primary' 
              disabled=${!modalCanSave}>${modalMode == 'Add' ? 'Add Additional Info Link' : 'Save Changes'}</${Button}>
          </div>
        </${Modal}>
      `}
    </div>
  </div>
  `
}