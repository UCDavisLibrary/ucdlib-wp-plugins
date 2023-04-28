import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { IconPicker } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { TextControl } from "@wordpress/components";
import { useBlockProps } from '@wordpress/block-editor';
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
      <div style=${{display:'flex', alignItems: 'center'}}>
        <ucdlib-icon 
          style=${{cursor: 'pointer'}}
          onClick=${onIconChangeRequest}
          icon=${attributes.icon}>
        </ucdlib-icon>
        <div style=${{margin: '0 1rem'}}>
          <${TextControl} 
            value=${attributes.label}
            onChange=${(label) => setAttributes({label})}
            placeholder="Label displayed to public"
          />
        </div>
      </div>
      <${IconPicker} 
        ref=${iconPickerRef}
        onChange=${v => setIcon(v)}
        selectedIcon=${attributes.icon}
      ></${IconPicker}>
    </div>
  `
}