import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks} from '@wordpress/block-editor';

export default ( props ) => {
  const spaceBlock = 'ucdlib-locations/map-space-legend';
  const ALLOWED_BLOCKS = [ spaceBlock ];
  const blockProps = useBlockProps();
  const defaultTemplate = [
    [spaceBlock]
  ];
  const innerBlocksProps ={
    allowedBlocks: ALLOWED_BLOCKS,
    renderAppender: false,
    orientation: 'horizontal',
    template: defaultTemplate,
    templateLock: 'all'
  };
  const containerStyle = {
    marginBottom: '4rem'
  }

  return html`
    <div ...${ blockProps }>
      <div style=${containerStyle}>
        <h2>Interactive Building Map</h2>
        <${InnerBlocks} ...${innerBlocksProps} />
      </div>
    </div>
  `;
}