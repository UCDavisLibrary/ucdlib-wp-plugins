import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';

export default ( ) => {
  const blockProps = useBlockProps();

  return html`
  <div ...${ blockProps }>
    <h4>Subject</h4>
    <div className='alert'>Manuscript Subjects should be chosen in the right-hand Collection settings menu</div>
  </div>
  `
}