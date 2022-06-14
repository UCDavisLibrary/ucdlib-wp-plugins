import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  const placeholder = attributes.placeholder ? attributes.placeholder : 'Write a description...';

  // get metadata
  const meta = SelectUtils.editedPostAttribute('meta');
  const description = meta.description ? meta.description : '';
  const { editPost } = useDispatch( 'core/editor', [ description ] );

  return html`
  <div ...${ blockProps }>
    <div className="u-space-mx u-space-my">
      <${RichText} 
        tagName='p'
        value=${description}
        onChange=${(description) => editPost({meta: {description}})}
        placeholder=${placeholder}
      />
    </div>
  </div>
  `
}