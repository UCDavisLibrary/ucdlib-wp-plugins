import { html } from '@ucd-lib/brand-theme-editor/lib/utils';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';


export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  // innerblock settings
  const allowedBlocks = ['ucdlib-locations/teaser']
  const template = [['ucdlib-locations/teaser', {}]];

  return html`
  <div ...${ blockProps }>
    <${InnerBlocks} 
      allowedBlocks=${allowedBlocks}
      template=${template}
    />
  </div>
  `
}