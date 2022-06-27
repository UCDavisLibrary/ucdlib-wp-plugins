import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      
    </${BlockControls}>

    <div>
      <h4>Biography</h4>
      <${RichText}
          tagName="p"
          className=""
          value=${meta.biography}
          onChange="${biography => {editPost({meta: {biography}})}}"
        />
    </div>
  </div>
  `
}