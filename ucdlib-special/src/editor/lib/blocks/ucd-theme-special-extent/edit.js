import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { undo } from '@wordpress/icons';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onRevertClicked = (e) => {
    editPost({meta: {extent: meta.originalData.extent}});
  } 

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${html`${undo}`} 
        onClick=${onRevertClicked}
        label="Revert"
      />
    </${BlockControls}>

    <div>
      <h4>Extent</h4>
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