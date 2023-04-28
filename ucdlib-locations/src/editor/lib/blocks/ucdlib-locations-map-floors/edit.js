import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks} from '@wordpress/block-editor';
import { BaseControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const floorBlock = 'ucdlib-locations/map-floor';
  const ALLOWED_BLOCKS = [ floorBlock ];
  const blockProps = useBlockProps();
  const defaultTemplate = [
    [floorBlock]
  ];
  const innerBlocksProps ={
    allowedBlocks: ALLOWED_BLOCKS,
    template: defaultTemplate,
    templateLock: false
  };
  const containerStyle = {
    padding: '1rem',
    margin: '1rem',
    border: '1px solid #ffbf00'
  }

  return html`
    <div ...${ blockProps }>
      <div style=${containerStyle}>
        <h3>Floor Maps</h3>
        <p>Use this section to add/remove floors to the building.</p>
        <p>TODO: image upload for base image</p>
        <div style=${{marginTop: '1rem'}}>
          <h4>Floors</h4>
          <${InnerBlocks} ...${innerBlocksProps} />
        </div>
      </div>
    </div>

  `;
}