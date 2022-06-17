import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  // get metadata
  const meta = SelectUtils.editedPostAttribute('meta');
  const isLocation = SelectUtils.editedPostAttribute('type') == 'location';
  let address = attributes.text;
  if ( isLocation ) {
    address = meta.display_address ? meta.display_address : '';
  }
  
  const { editPost } = useDispatch( 'core/editor', [ address ] );

  const setAddress = (v) => {
    if ( isLocation ) {
      editPost({meta: {display_address: v}});
    } else {
      setAttributes({text: v});
    }
  }

  return html`
  <div ...${ blockProps }>
    <div className="location-address">
      <ucdlib-icon icon="ucd-public:fa-location-dot"></ucdlib-icon>
      <div className="heading--h5">
        <${RichText} 
          tagName='span'
          value=${address}
          allowedFormats=${[]}
          onChange=${setAddress}
          placeholder='Enter an address...'
        />
      </div>
    </div>
  </div>
  `
}