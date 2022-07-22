import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default ( props ) => {
  const blockProps = useBlockProps();

  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );

  // get metadata
  const taxSlug = 'directory-tag';
  const tagIds = SelectUtils.editedPostAttribute(taxSlug);
  const query = {per_page: -1, orderby: 'count', order: 'desc', context: 'view'};
  const tags = SelectUtils.terms(taxSlug, query);
  const meta = SelectUtils.editedPostAttribute('meta');
  const hideTags = meta.hide_tags ? meta.hide_tags : false;
  const selectedTags = tagIds.map(sid => tags.find(({id}) => id == sid)).filter(l => l != undefined);


  return html`
  <div ...${ blockProps }>
    ${!hideTags && html`
      <div>
        <div onClick=${openModal}>
          <h2 className="heading--auxiliary">Directory Tags</h2>
          ${selectedTags.map(tag => html`
            <a key=${tag.name} className="tags__tag">${tag.name}</a>
          `)}
        </div>
        ${isOpen && html`
        <${Modal} title="Editing Your Directory Tags" onRequestClose=${ closeModal }>
          <div>To add or edit your directory tags, use the "Directory Tags" area in the "Person" right-hand sidebar</div>
        </${Modal}>
      `}
      </div>
    `}
  </div>
  `
}