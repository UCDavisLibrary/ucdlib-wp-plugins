import { html, SelectUtils, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onUndoClicked = (e) => {
    editPost({meta: {extent: meta.fetchedData.extent}});
  } 

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${UCDIcons.render('undo')}
        onClick=${onUndoClicked}
        label="Restore Extent to Default"
        disabled=${!meta.fetchedData || meta.extent === meta.fetchedData.extent}
      />
    </${BlockControls}>

    <div>
      <h4>Extent ${meta.fetchedData && meta.extent !== meta.fetchedData.extent ? html`<span className="strawberry">*</span>` : ''}</h4>      
      <${RichText}
          tagName="p"
          className=""
          value=${meta.extent}
          onChange="${extent => {editPost({meta: {extent}})}}"
        />
    </div>
  </div>
  `
}