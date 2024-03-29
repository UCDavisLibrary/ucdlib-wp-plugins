import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InnerBlocks} from '@wordpress/block-editor';
import { TextControl, BaseControl } from "@wordpress/components";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const toggleItem = 'ucdlib-locations/map-space-legend-item';
  const ALLOWED_BLOCKS = [ toggleItem ];
  const blockProps = useBlockProps();
  const defaultTemplate = [
    [toggleItem]
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
        <h3>Spaces</h3>
        <p>Use this section to register the toggleable spaces that may appear on a floor map.</p>
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