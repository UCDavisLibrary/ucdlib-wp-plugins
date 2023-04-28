import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks} from '@wordpress/block-editor';
import { BaseControl, TextControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const layerBlock = 'ucdlib-locations/map-space-layer';
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
        <div style=${{marginTop: '1rem'}}>
          <label>
            <${BaseControl}>
              <${BaseControl.VisualLabel} style=${{fontWeight: '700'}}>Space Layers</${BaseControl.VisualLabel}>
            </${BaseControl}>
          </label>
        </div>
      </div>
    </div>

  `;
}