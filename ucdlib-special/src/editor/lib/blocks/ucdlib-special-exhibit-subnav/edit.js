import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';

export default ( ) => {
  const blockProps = useBlockProps();

  return html`
  <div ...${ blockProps }>
    <div className='alert'>A subnav will be rendered if an exhibit is hierarchical</div>
  </div>
  `
}