import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  // get metadata
  const meta = SelectUtils.editedPostAttribute('meta');
  const hideBio = meta.hide_bio ? true : false;
  const bio = meta.bio ? meta.bio : '';
  const { editPost } = useDispatch( 'core/editor', [ hideBio, bio ] );

  return html`
  <div ...${ blockProps }>
    ${!hideBio && html`
    <div className="u-space-mt">
      <${RichText} 
        tagName='p'
        value=${bio}
        onChange=${(bio) => editPost({meta: {bio}})}
        placeholder='Write a little about yourself...'
      />
    </div>
    `}
  </div>
  `
}