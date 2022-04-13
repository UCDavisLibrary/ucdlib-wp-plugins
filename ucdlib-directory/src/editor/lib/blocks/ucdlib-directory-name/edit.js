import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Modal, TextControl } from '@wordpress/components';
import { getQueryArg } from "@wordpress/url";
import { useState } from '@wordpress/element';
import { useDispatch } from "@wordpress/data";


export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  // metadata 
  const user = SelectUtils.currentUser();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;
  const hasMeta = meta.name_first && meta.name_last;
  const [ nameFirst, setNameFirst ] = useState( "" );
  const [ nameLast, setNameLast ] = useState( "" );
  const isOwnProfile = getQueryArg(window.location, 'is_own_profile') === undefined ? false : true;

  // modal
  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );

  // hide native title block. there is probably a better way to do this?
  document.querySelector('.wp-block-post-title').style.display = 'none'

  // open modal on click
  const onClick = () => {
    if ( !nameFirst && !nameLast) {

      // name data is saved in post meta
      if ( meta.name_first && meta.name_last ) {
        setNameFirst(meta.name_first);
        setNameLast(meta.name_last);
      
        // get name from wp user data.
        // this is the first time the user is setting up their profile
      } else if ( isOwnProfile && user && user.name ) {
        let n = user.name.split(' ');
        if ( n.length >= 2 ) {
          setNameFirst(n.slice(0, -1).join(" "));
          setNameLast(n.slice(-1)[0]);
        }
      }
    }
    openModal();
  }

  const saveData = () => {
    const newMeta = {name_first: nameFirst, name_last: nameLast};
    if ( !meta.wp_user_id && isOwnProfile && user.id ) newMeta.wp_user_id = user.id;
    editPost({
      meta: newMeta,
      title: `${nameFirst} ${nameLast}`
    });
    closeModal();
  }

  return html`
  <div ...${ blockProps }>
    <div onClick=${onClick}>
      ${hasMeta ? html`
        <h1>${meta.name_first} ${meta.name_last}</h1>
      ` : html`
        <h1 style=${{opacity: .8}}>Enter your name...</h1>
      `}
    </div>
    ${isOpen && html`
      <${Modal} title="Your Name" onRequestClose=${ closeModal }>
        <${TextControl} label="First name" value=${nameFirst} onChange=${(v) => setNameFirst(v)}/>
        <${TextControl} label="Last name" value=${nameLast} onChange=${(v) => setNameLast(v)}/>
        <${Button} variant="primary" disabled=${!nameFirst || !nameLast} onClick=${saveData}>
          Save
        </${Button}>
      </${Modal}>
    `}
  </div>
  `
}