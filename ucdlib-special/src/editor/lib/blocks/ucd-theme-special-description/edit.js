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
      <h4>Description ${meta.fetchedData && meta.description !== meta.fetchedData.description ? html`<span className="strawberry">*</span>` : ''}</h4>
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