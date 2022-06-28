import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { undo } from '@wordpress/icons';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  // test original value, will be set in first API call
  editPost({meta: {biographyOriginal: 'Non-profit corporation founded in 1972 to develop alternative energy and to contribute to a lifestyle independent of organized society. Originating in Saugus, California, and later moving to Mariposa County, the collective focused on solar and wind power generation. Earthmind\'s central figure, Michael Hackleman, supported the group by putting up wind machines and by publishing books and articles on alternative energy.'}});

  const onRevertClicked = (e) => {
    editPost({meta: {biography: meta.biographyOriginal}});
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