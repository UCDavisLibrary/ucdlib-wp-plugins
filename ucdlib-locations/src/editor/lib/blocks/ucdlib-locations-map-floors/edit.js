import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks} from '@wordpress/block-editor';
import { BaseControl } from "@wordpress/components";
import { ImagePicker } from "@ucd-lib/brand-theme-editor/lib/block-components";

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

  const bottomLayerImage = SelectUtils.image(attributes.bottomLayerId)

  const onSelectImage = (image) => {
    setAttributes({bottomLayerId: image.id});
  }
  const onRemoveImage = () => {
    setAttributes({bottomLayerId: 0});
  }

  const renderBaseLayer = () => {
    const bottomLayerContainerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
    return html`
      <h4>Building Base Image Layer</h4>
      <div style=${bottomLayerContainerStyle}>
        <div style=${{maxWidth: '250px', backgroundColor: '#ececec', padding: '1rem'}}>
          <${ImagePicker}
            imageId=${attributes.bottomLayerId}
            image=${bottomLayerImage}
            onSelect=${onSelectImage}
            onRemove=${onRemoveImage}
            defaultImageId=${0}
            notPanel=${true}
          />
        </div>
      </div>
    `;
  }

  return html`
    <div ...${ blockProps }>
      <div style=${containerStyle}>
        <h3>Floor Maps</h3>
        <p>Use this section to add/remove floors to the building.</p>

        <div style=${{marginTop: '1rem'}}>
          <h4>Floors</h4>
          <${InnerBlocks} ...${innerBlocksProps} />
        </div>
      </div>
    </div>

  `;
}
