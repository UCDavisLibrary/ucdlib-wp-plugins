import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import { ToolbarColorPicker } from "@ucd-lib/brand-theme-editor/lib/block-components";
import exhibitPicker from "../../block-components/exhibit-picker";
import exhibitHighlight from "../../templates/exhibit-highlight";
import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';

export default ( props ) => {
  const blockProps = useBlockProps();
  const { attributes, setAttributes } = props;
  const [ exhibit, setExhibit ] = useState({});

  useEffect(() => {
    if ( !attributes.exhibitId ) {
      setExhibit({});
      return;
    }
    const path = `ucdlib-special/exhibit-page/${attributes.exhibitId}`;
    apiFetch( {path} ).then( 
      (r) => {
        setExhibit(r);
      }, 
      (error) => {
        console.error(error);
      }
    )
  }, [attributes.exhibitId])

  const onColorChange = (value) => {
    setAttributes( {brandColor: value ? value.slug : "" } );
  }

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarColorPicker} 
        onChange=${onColorChange}
        value=${attributes.brandColor}
        ucdBlock="hero-banner"
      />
    </${BlockControls}>
    <${InspectorControls}>
      <${PanelBody} title="Display">
        <${exhibitPicker} 
          value=${attributes.exhibitId}
          onChange=${v => setAttributes({exhibitId: v})}
        />
      </${PanelBody}>
    </${InspectorControls}>
    ${attributes.exhibitId == 0 ? html`
      <${exhibitPicker} 
        value=${attributes.exhibitId}
        label='Choose an Exhibit'
        onChange=${v => setAttributes({exhibitId: v})}
      />
    ` : html`
      <div>
        <${exhibitHighlight} exhibit=${exhibit} brandColor=${attributes.brandColor}/>
      </div>
    `}


  </div>
  `
}