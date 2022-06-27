import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { TextControl, PanelBody, Button } from "@wordpress/components";
import { useBlockProps, BlockControls, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const runController = () => {
    // todo
    console.log('pinging api');
    
    // update slug to use recordId
    const slug = SelectUtils.editedPostAttribute('slug') || '';
    const { editPost } = useDispatch( 'core/editor', [ slug ] );
    editPost({slug: attributes.almaRecordId });
  }

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      
    </${BlockControls}>

    <${InspectorControls}>
      <${PanelBody} title="Widget Settings">
        <div className='collection-controls'>
          <${TextControl} 
            value=${attributes.almaRecordId}
            label="Alma Record ID:"
            onChange=${almaRecordId => setAttributes({almaRecordId})}
          />
          <${Button} 
            variant="primary"
            onClick=${runController}
            style=${{ marginBottom: '1.5em' }}
            >Search Record ID
          </${Button}>
          <${TextControl} 
            value=${attributes.callNumber}
            label="URL/Slug:"
            onChange=${callNumber => setAttributes({callNumber})}
          />
          <${TextControl} 
            value=${attributes.callNumber}
            label="Call Number:"
            onChange=${callNumber => setAttributes({callNumber})}
          />
          <${TextControl} 
            value=${attributes.featuredImage}
            label="Featured Image:"
            onChange=${featuredImage => setAttributes({featuredImage})}
          />
          <${TextControl} 
            value=${attributes.extent}
            label="Extent:"
            onChange=${extent => setAttributes({extent})}
          />
          <${TextControl} 
            value=${attributes.extentUnit}
            label="Extent Unit:"
            onChange=${extentUnit => setAttributes({extentUnit})}
          />
          <${TextControl} 
            value=${attributes.findingAid}
            label="Finding Aid:"
            onChange=${findingAid => setAttributes({findingAid})}
          />
          <${TextControl} 
            value=${attributes.history}
            label="History:"
            onChange=${history => setAttributes({history})}
          />
        </div>
      </${PanelBody}>
    </${InspectorControls}>

    <div>
        <${InnerBlocks} />
    </div>
  </div>
  `
}