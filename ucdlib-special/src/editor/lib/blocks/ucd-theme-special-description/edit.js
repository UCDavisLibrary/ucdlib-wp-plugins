import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { undo, redo } from '@wordpress/icons';
import { useDispatch } from "@wordpress/data";
import { ApiController } from "../../plugins/controller";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onUndoClicked = (e) => {
    // TODO revert to previously set description, if fetched clicked
    editPost({meta: {description: meta.originalData.description}});
  } 

  const onRedoClicked = (e) => {
    // TODO reapply description last fetched
  } 

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${html`${undo}`} 
        onClick=${onUndoClicked}
        label="Undo"
      />
      <${ToolbarButton} 
        icon=${html`${redo}`} 
        onClick=${onRedoClicked}
        label="Redo"
      />
    </${BlockControls}>

    <div>
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