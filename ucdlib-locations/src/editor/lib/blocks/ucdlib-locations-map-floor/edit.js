import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks} from '@wordpress/block-editor';
import { BaseControl, TextControl, ToggleControl } from "@wordpress/components";
import { ImagePicker } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { useSelect } from "@wordpress/data";

export default ( props ) => {
  const { attributes, setAttributes, clientId } = props;
  const layerBlock = 'ucdlib-locations/map-floor-layer';
  const ALLOWED_BLOCKS = [ layerBlock ];
  const blockProps = useBlockProps();
  const defaultTemplate = [
    [layerBlock]
  ];
  const innerBlocksProps ={
    allowedBlocks: ALLOWED_BLOCKS,
    template: defaultTemplate,
    templateLock: false
  };
  const containerStyle = {
    padding: '1rem',
    margin: '1rem',
    backgroundColor: '#fff9e6'
    //border: '1px solid #ffbf00'
  }

  // top layer image setup
  const topLayerImage = SelectUtils.image(attributes.topLayerId)
  const onSelectImage = (image) => {
    setAttributes({topLayerId: image.id});
  }
  const onRemoveImage = () => {
    setAttributes({topLayerId: 0});
  }
  const topLayerImagePickerStyles = {
    marginLeft: '1rem'
  }
  if ( attributes.topLayerId != 0 ) {
    topLayerImagePickerStyles.flexGrow = 1;
  }

  const disableShowOnLoadToggle = useSelect( ( select ) => {
    if ( attributes.showOnLoad ) return false;
    let parent = select( 'core/block-editor' ).getBlockParentsByBlockName(clientId, 'ucdlib-locations/map-floors') || [];
    if ( parent.length == 0 ) {
      console.log('disableShowOnLoadToggle: no parent found');
      return true;
    }
    parent = select( 'core/block-editor' ).getBlocksByClientId( parent[0] )[0];
    for (const floor of parent.innerBlocks) {
      if ( floor.attributes && floor.attributes.showOnLoad ) {
        return true;
      }
    }
    return false;
  });

  return html`
    <div ...${ blockProps }>
      <div style=${containerStyle}>
        <${TextControl}
          label="Floor Title"
          value=${attributes.title}
          onChange=${(title) => setAttributes({title})}
        />
        <${TextControl}
          label="Floor Subtitle"
          value=${attributes.subTitle}
          onChange=${(subTitle) => setAttributes({subTitle})}
        />
        <${TextControl}
          label="Floor Nav Text"
          value=${attributes.navText}
          help=${'Only applicable if more than one floor exists. By default, will use first character of title.'}
          onChange=${(navText) => setAttributes({navText})}
        />
        <${ToggleControl}
            label="Floor is Selected/Visible on Page Load"
            checked=${attributes.showOnLoad}
            onChange=${() => setAttributes({showOnLoad: !attributes.showOnLoad})}
            disabled=${disableShowOnLoadToggle}
            help=${disableShowOnLoadToggle ? 'Only one floor can be selected/visible on page load.' : ''}
          />
        <div style=${{marginTop: '1rem'}}>
          <label>
            <${BaseControl}>
              <${BaseControl.VisualLabel} style=${{fontWeight: '700'}}>Top Layer</${BaseControl.VisualLabel}>
            </${BaseControl}>
          </label>
          <div style=${topLayerImagePickerStyles}>
            <${ImagePicker}
              imageId=${attributes.topLayerId}
              image=${topLayerImage}
              onSelect=${onSelectImage}
              onRemove=${onRemoveImage}
              defaultImageId=${0}
              notPanel=${true}
              horizontal=${true}
              renderImageName=${true}
            />
          </div>
        </div>
        <div style=${{marginTop: '1rem'}}>
          <label>
            <${BaseControl}>
              <${BaseControl.VisualLabel} style=${{fontWeight: '700'}}>Space Layers</${BaseControl.VisualLabel}>
            </${BaseControl}>
          </label>
          <${InnerBlocks} ...${innerBlocksProps} />
        </div>
      </div>
    </div>

  `;
}
