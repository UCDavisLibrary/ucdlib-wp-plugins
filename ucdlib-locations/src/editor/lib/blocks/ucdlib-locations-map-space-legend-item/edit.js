import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { ToolbarColorPicker, ToolbarLinkPicker, IconPicker } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { TextControl } from "@wordpress/components";
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import { createRef } from '@wordpress/element';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  const iconPickerRef = createRef();

  const onIconChangeRequest = () => {
    
    if ( iconPickerRef.current ){
      iconPickerRef.current.openModal();
    }
  }

  const setIcon = ( icon ) => {
    icon = `${icon.iconSet}:${icon.icon}`;
    setAttributes({icon});
  }

  return html`
    <div ...${ blockProps} >
    <${BlockControls} group="block">
      <${ToolbarColorPicker} 
        onChange=${(value) => {setAttributes( {brandColor: value ? value.slug : "" } )}}
        value=${attributes.brandColor}
        ucdBlock="panel-with-icon"
      />
    </${BlockControls}>
      <div style=${{display:'flex', alignItems: 'center'}}>
        <ucdlib-icon 
          class=${attributes.brandColor} 
          style=${{cursor: 'pointer'}}
          onClick=${onIconChangeRequest}
          icon=${attributes.icon}>
        </ucdlib-icon>
        <div style=${{margin: '0 1rem'}}>
          <${TextControl} 
            value=${attributes.slug}
            onChange=${(slug) => setAttributes({slug})}
            placeholder="A unique id, e.g. 'silent-zone'"
          />
        </div>

        <${TextControl} 
          value=${attributes.label}
          onChange=${(label) => setAttributes({label})}
          placeholder="Label displayed to public"
        />
      </div>
      <${IconPicker} 
        ref=${iconPickerRef}
        onChange=${v => setIcon(v)}
        selectedIcon=${attributes.icon}
      ></${IconPicker}>
    </div>
  `
}