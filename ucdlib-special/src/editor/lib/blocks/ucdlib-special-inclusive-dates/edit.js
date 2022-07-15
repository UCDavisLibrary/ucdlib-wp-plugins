import { html, SelectUtils, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onUndoClicked = (e) => {
    editPost({meta: {inclusiveDates: meta.fetchedData.inclusiveDates}});
  } 

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${UCDIcons.render('undo')}
        onClick=${onUndoClicked}
        label="Restore Inclusive Dates to Default"
        disabled=${!meta.fetchedData || meta.inclusiveDates === meta.fetchedData.inclusiveDates}
      />
    </${BlockControls}>

    <div>
      <h4>Inclusive Dates ${meta.fetchedData && meta.inclusiveDates !== meta.fetchedData.inclusiveDates ? html`<span className="strawberry">*</span>` : ''}</h4>
      <${RichText}
          tagName="p"
          className=""
          value=${meta.inclusiveDates}
          onChange="${inclusiveDates => {editPost({meta: {inclusiveDates}})}}"
        />
    </div>
  </div>
  `
}