import { html, SelectUtils, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onUndoClicked = (e) => {
    editPost({meta: {biography: meta.fetchedData.biography}});
  } 

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${UCDIcons.render('undo')}
        onClick=${onUndoClicked}
        label="Restore Biography to Default"
        disabled=${!meta.fetchedData || meta.biography === meta.fetchedData.biography}
      />
    </${BlockControls}>

    <div>
      <h4>Biography ${meta.fetchedData && meta.biography !== meta.fetchedData.biography ? html`<span className="strawberry">*</span>` : ''}</h4>
      <${RichText}
          tagName="p"
          className=""
          value=${meta.biography}
          onChange="${biography => { editPost({meta: {biography}})} }"
        />
    </div>
  </div>
  `
}