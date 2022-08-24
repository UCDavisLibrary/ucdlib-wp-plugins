import { html, SelectUtils, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onUndoClicked = (e) => {
    editPost({meta: {description: meta.fetchedData.description}});
  } 

  // since this renders for title changes as well (collection.js does not), we'll handle the title indicator if different than fetchedData
  const currentTitle = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' ) || '';
  const fetchedTitle = meta.fetchedData.title || '';
  const renderedTitle = document.querySelector('.wp-block-post-title');
  if (currentTitle.trim().replaceAll('*', '') !== fetchedTitle.trim().replaceAll('*', '')) {
    // add asterisk to title to indicate
    if (renderedTitle) {
      renderedTitle.classList.add('title-modified');
    }
  } else {
    // remove asterisk
    if (renderedTitle) {
      renderedTitle.classList.remove('title-modified');
    }
  }


  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${UCDIcons.render('undo')}
        onClick=${onUndoClicked}
        label="Restore Description to Default"
        disabled=${!meta.fetchedData || meta.description === meta.fetchedData.description}
      />
    </${BlockControls}>
    <div>
      <h3>
        Collection Number: 
        <${RichText}
          tagName="span"
          className=""
          style=${{ paddingLeft: '.5rem', paddingRight: '.5rem' }}
          value=${meta.callNumber}
          onChange="${callNumber => {editPost({meta: {callNumber}})}}"
        />
        ${meta.fetchedData && meta.description !== meta.fetchedData.description ? html`<span className="strawberry">*</span>` : ''}
      </h3>
      
      <${RichText}
          tagName="p"
          className=""
          value=${meta.description}
          onChange="${description => {editPost({meta: {description}})}}"
        />
    </div>
  </div>
  `
}