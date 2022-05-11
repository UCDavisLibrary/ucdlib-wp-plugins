import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  // get metadata
  const meta = SelectUtils.editedPostAttribute('meta');
  const hidePronouns = meta.hide_pronouns ? meta.hide_pronouns : false;
  const pronouns = meta.pronouns ? meta.pronouns : '';
  const { editPost } = useDispatch( 'core/editor', [ hidePronouns, pronouns ] );

  return html`
  <div ...${ blockProps }>
    ${!hidePronouns && html`
    <div className="person__pronoun">
      <${RichText} 
        tagName='span'
        value=${pronouns}
        allowedFormats=${[]}
        onChange=${(pronouns) => editPost({meta: {pronouns}})}
        placeholder='Enter your preferred pronouns...'
      />
    </div>
    `}
  </div>
  `
}