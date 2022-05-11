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
  const libraryIds = SelectUtils.editedPostAttribute('library');
  const libraries = SelectUtils.terms('library');
  const meta = SelectUtils.editedPostAttribute('meta');
  const hideLibraries = meta.hide_libraries ? meta.hide_libraries : false;

  const selectedLibraries = libraryIds.map(sid => libraries.find(({id}) => id == sid)).filter(l => l != undefined);


  return html`
  <div ...${ blockProps }>
    ${!hideLibraries && html`
      <div>
        <div onClick=${openModal}>
          ${selectedLibraries.length > 0 ? html`
            <span className="icon icon--location">
              ${selectedLibraries.map((lib, i) => html`
                <span key=${lib.id}>${i > 0 && html`<span>, </span>`}${lib.name}</span>
              `)}
            </span>
          ` : html`
            <span className="icon icon--location">Your Library Location...</span>
          `}
        </div>
        ${isOpen && html`
        <${Modal} title="Editing Your Library Location" onRequestClose=${ closeModal }>
          <div>To add or edit your library location, use the "Library Filters" area in the "Person" right-hand sidebar</div>
        </${Modal}>
      `}
      </div>
    `}
  </div>
  `
}