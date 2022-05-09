import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Modal, TextControl } from '@wordpress/components';
import { getQueryArg } from "@wordpress/url";
import { useState } from '@wordpress/element';
import { useDispatch } from "@wordpress/data";


export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  // metadata from post
  const meta = SelectUtils.meta();
  const hasMeta = meta.positions && meta.positions.length > 0;
  const editPost = useDispatch( 'core/editor' ).editPost;


  const [ positions, setPositions ] = useState( [{title: '', department: 0}] );
  const [ forceUpdate, doForceUpdate ] = useState( false );
  const setTitle = (v, i) => {
    positions[i].title = v;
    setPositions(positions);
    doForceUpdate(!forceUpdate)
  }

  // modal
  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );

  // open modal on click
  const onClick = () => {
    if ( positions.length ) {
      openModal();
      return;
    }
    if ( hasMeta ) {
      setPositions(meta.positions);
    } 
    openModal();
  }

  const saveData = () => {
    /** 
    const newMeta = {name_first: nameFirst, name_last: nameLast};
    if ( !meta.wp_user_id && isOwnProfile && user.id ) newMeta.wp_user_id = user.id;
    editPost({
      meta: newMeta,
      title: `${nameFirst} ${nameLast}`
    });
    */
    closeModal();
  }

  return html`
  <div ...${ blockProps }>
    <div onClick=${onClick}>
      ${hasMeta ? html`
        <div>
          positions
        </div>
      ` : html`
        <div>
          <h2 style=${{opacity: .8}}>Enter your title...</h2>
          <h3 style=${{opacity: .8}}>Enter your department...</h3>
        </div>
      `}
    </div>
    ${isOpen && html`
      <${Modal} title="Your Title and Department" onRequestClose=${ closeModal }>
        <div>${positions[0].title}</div>
        ${positions.map((p, i) => html`
          <div key=${p.title + p.department}>
          ${console.log(p)}
            <${TextControl} label="Title" value=${p.title} onChange=${(v) => setTitle(v, i)}/>
            <div>${p.title}</div>
          </div>
          
        `)}
        <${Button} variant="primary" disabled=${false} onClick=${saveData}>
          Save
        </${Button}>
      </${Modal}>
    `}
  </div>
  `
}