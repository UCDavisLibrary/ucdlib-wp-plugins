import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { HorizontalRule } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";
import { useRef, useEffect } from "@wordpress/element";
import "./ucd-wp-manuscript-button-link";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  const buttonLinkRef = useRef();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const letters = ['A', 'B',  'C',  'D',  'E',  'F',  'G',  'H',  'I',  'J',  'K',  'L',  'M',  'N',  'O',  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  useEffect(() => {
    let buttonLink = null;
    if ( buttonLinkRef.current ) {
      buttonLinkRef.current.addEventListener('text-change', onTextChange);
      buttonLink = buttonLinkRef.current;
    }
    return () => {
      if ( buttonLink ) {
        buttonLink.removeEventListener('text-change', onTextChange);
      }
    };
  });

  const onTextChange = (e) => {
    setAttributes({content: e.detail.value});
  }

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">

    </${BlockControls}>

    <div>
      <div style=${{ display: 'flex', alignItems: 'center' }}>
        <h5 style=${{ display: 'inline-block', padding: '1rem 0 0 1rem' }}>Browse by:</h5>
        <fieldset className="radio" style=${{ display: 'inline-block', borderTop: 'none', margin: '0', paddingBottom: '0' }}>
          <ul className="list--reset" style=${{ margin: '0', padding: '0 0 0 1.25rem', paddingLeft: '0', listStyle: 'none' }}>
            <li style=${{ listStyle: 'none', display: 'inline-block' }}>
              <input 
                style=${{ width: '0', height: 'auto', marginRight: '0.3em', boxSizing: 'border-box', padding: '0' }} 
                id="subject" 
                name="radio" 
                type="radio" 
                className="radio" 
                checked="${attributes.subjectChecked}" 
                onChange=${() => setAttributes({ subjectChecked: true })}
              />
              <label style=${{ position: 'relative', display: 'inline-block', paddingLeft: '1.75rem', color: '#4c4c4c', fontWeight: 'normal', fontSize: '1.2rem' }} for="subject">Subject</label>
            </li>
            <li style=${{ listStyle: 'none', display: 'inline-block' }}>
              <input 
                style=${{ width: '0', height: 'auto', marginRight: '0.3em', boxSizing: 'border-box', padding: '0' }} 
                id="az" 
                name="radio" 
                type="radio" 
                className="radio" 
                checked="${!attributes.subjectChecked}" 
                onChange=${() => setAttributes({ subjectChecked: false })}  
              />
              <label style=${{ position: 'relative', display: 'inline-block', paddingLeft: '1.75rem', color: '#4c4c4c', fontWeight: 'normal', fontSize: '1.2rem' }} for="az">A - Z</label>
            </li>
          </ul>
        </fieldset>
      </div>
      <${HorizontalRule} style=${{ borderTop: '4px dotted' }} className="secondary" />

      <div style=${{ display: attributes.subjectChecked ? 'block' : 'none' }}>   
        <div style=${{ maxWidth: '85%' }}>  
          <p>Subject areas represented within the collections correspond to the breadth, diversity, and focus of instruction offered at the University of California at Davis.</p>
        </div>
      </div>

      <div style=${{ display: attributes.subjectChecked ? 'none' : 'block' }}>      
        <div style=${{ maxWidth: '85%' }}>  
          ${letters.map((letter, index) => {
            return html`
              <ucd-wp-manuscript-button-link 
                ref=${buttonLinkRef}
                alt-style=${letter === 'A' ? 'alt' : 'alt3'}
                text=${letter}
                style=${{ padding: '0 .25rem', display: 'inline-block', height: '57px' }}>
                <div slot="text" contentEditable="true" style=${{width: '100%'}}></div>
              </ucd-wp-manuscript-button-link>
              `
          })}  
        </div>
        <${HorizontalRule} style=${{ borderTop: '4px dotted', marginTop: '3.6rem' }} className="secondary" />
      </div>

    </div>
  </div>
  `
}