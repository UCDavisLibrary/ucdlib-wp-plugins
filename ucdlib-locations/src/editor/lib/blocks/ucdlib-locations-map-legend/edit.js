import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks} from '@wordpress/block-editor';
import { TextControl, BaseControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const legendItem = 'ucdlib-locations/map-legend-item';
  const ALLOWED_BLOCKS = [ legendItem ];
  const blockProps = useBlockProps();
  const defaultTemplate = [
    [legendItem]
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
        <h3>Customize the Static Legend</h3>
        <p>Use this section to add/remove items from the building map legend.</p>
        <${TextControl}
          label="Legend Title"
          value=${attributes.title}
          onChange=${(title) => setAttributes({title})}
        />
        <div style=${{marginTop: '1rem'}}>
          <label>
            <${BaseControl}>
              <${BaseControl.VisualLabel} style=${{fontWeight: '700'}}>Legend Items</${BaseControl.VisualLabel}>
            </${BaseControl}>
          </label>
          <${InnerBlocks} ...${innerBlocksProps} />
        </div>
      </div>
    </div>

  `;
}