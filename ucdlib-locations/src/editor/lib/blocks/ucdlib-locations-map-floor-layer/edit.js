import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps} from '@wordpress/block-editor';
import { BaseControl, TextControl, SelectControl } from "@wordpress/components";
import { ImagePicker } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { useSelect } from "@wordpress/data";

export default ( props ) => {
  const { attributes, setAttributes, clientId } = props;
  const blockProps = useBlockProps();

  const spaceSlugs = useSelect( ( select ) => {
    let parents = select( 'core/block-editor' ).getBlockParents(clientId);
    let buildingBlock;
    for (const parentId of parents) {
      const parent = select( 'core/block-editor' ).getBlocksByClientId( parentId )[0];
      if ( parent.name == 'ucdlib-locations/map-building' ) {
        buildingBlock = parent;
        break;
      }
    }
    if ( !buildingBlock ) return; 

    let legend = buildingBlock.innerBlocks.filter( block => block.name == 'ucdlib-locations/map-space-legend' );
    if ( legend.length == 0 ) return;
    legend = legend[0];
    const spaceSlugs = [];
    legend.innerBlocks.forEach( block => {
      if ( block.attributes && block.attributes.slug ) {
        spaceSlugs.push( {value: block.attributes.slug, label: block.attributes.label || block.attributes.slug} )
      };
    });
    return spaceSlugs;
  }, [] ) || [];

  const image = SelectUtils.image(attributes.imageId)

  const onSelectImage = (image) => {
    setAttributes({imageId: image.id});
  }
  const onRemoveImage = () => {
    setAttributes({imageId: 0});
  }

  const spacesExist = spaceSlugs.length > 0;

  const containerStyle = {
    padding: '.5rem',
    display: 'flex',
    alignItems: 'center',
    marginBotton: '1rem',
    borderBottom: '1px solid #dbeaf7'
  }
  const imagePickerStyles = {
    marginLeft: '1rem'
  }
  if ( attributes.imageId != 0 ) {
    imagePickerStyles.flexGrow = 1;
  }

  return html`
    <div ...${ blockProps }>
      ${!spacesExist && html`
        <div>You must register a space before you can upload a space layer. </div>
      `}
      ${spacesExist && html`
        <div style=${containerStyle}>
          <div style=${{marginTop: '8px'}}>
            <${SelectControl}
              options=${ [{value:'', label: 'Select a Space'}, ...spaceSlugs] }
              value=${ attributes.spaceSlug }

              style=${{maxWidth: '300px'}}
              onChange=${ spaceSlug => {setAttributes({spaceSlug})} }
            />
          </div>
          <div style=${imagePickerStyles}>
            <${ImagePicker} 
              imageId=${attributes.imageId}
              image=${image}
              onSelect=${onSelectImage}
              onRemove=${onRemoveImage}
              defaultImageId=${0}
              notPanel=${true}
              horizontal=${true}
              renderImageName=${true}
            />
          </div>
        </div>
      `}
    </div>

  `;
}