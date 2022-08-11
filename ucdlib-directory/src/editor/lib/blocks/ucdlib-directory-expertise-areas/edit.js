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
  const taxSlug = 'expertise-areas';
  const tagIds = SelectUtils.editedPostAttribute(taxSlug);
  const tags = SelectUtils.terms(taxSlug, {per_page: 100, include: tagIds}, [tagIds.join()]);
  const meta = SelectUtils.editedPostAttribute('meta');
  const hideTags = meta.hide_expertise_areas ? meta.hide_expertise_areas : false;


  return html`
  <div ...${ blockProps }>
    ${!hideTags && html`
      <div>
        <div onClick=${openModal}>
          <h2 className="heading--auxiliary">Areas of Expertise</h2>
          <div>
            ${tags.map((tag, i) => html`
              <span key=${tag.name}>${i > 0 && html`<span>, </span>`}<span>${tag.name}</span></span>
            `)}
          </div>
        </div>
        ${isOpen && html`
        <${Modal} title="Editing Your Areas of Expertise" onRequestClose=${ closeModal }>
          <div>To add or edit your areas of Expertise, use the "Areas of Expertise" area in the "Person" right-hand sidebar</div>
        </${Modal}>
      `}
      </div>
    `}
  </div>
  `
}