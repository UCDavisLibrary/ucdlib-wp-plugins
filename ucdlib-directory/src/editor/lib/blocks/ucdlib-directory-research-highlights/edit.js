import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { PanelBody, TextControl, Button, Spinner, Notice } from '@wordpress/components';
import { Fragment } from "@wordpress/element";
import { Modal } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default ( props ) => {
  const blockProps = useBlockProps();

  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);


const fetchHighlights = useCallback( async () => {
    setLoading(true);
    setError('');
    try {
        const path = `/ucdlib-directory/research-highlights/${encodeURIComponent(query)}`;
        const r = await apiFetch({ path });
        console.log('rh', r);
        setResults(r || []);
    } catch (error) {
      setResults([]);
      setError('Error fetching research highlights' + (error.message ? ': ' + error.message : '.'));
      setLoading(false);
      console.warn(error);
    } finally {
        setLoading(false);
    }
}, [query] );

// get metadata
//   const taxSlug = 'research-highlights';
  const meta = SelectUtils.editedPostAttribute('meta');
  const res = Array.isArray(results) ? results : [];
  const hideTags = meta.hide_research_highlights ? meta.hide_research_highlights : false;
    return html`
    <${Fragment}>
            <${PluginDocumentSettingPanel}
                name="ucdlib-directory-research-highlights"
                className="ucdlib-directory-research-highlights"
                icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '18px', minWidth: '18px'}} icon="ucd-public:fa-flask"></ucdlib-icon>`}
                title="Research Highlights">
                <${PanelBody} initialOpen=${ true }>
                    <${TextControl}
                        value=${ query }
                        label="Alma Record ID"
                        onChange=${ ( value ) => setQuery( value ) }
                        placeholder="Search Expert ID..."
                    />
             
                    <${Button}
                        variant="primary"
                        onClick=${ fetchHighlights }
                        style=${{ marginBottom: '.5em', marginTop: '.5em' }}
                        >Search Expert ID
                    <//>
                </${PanelBody}>
                    ${ error && html`<${Notice} status="error" isDismissible=${ false }>${ error }<//>` }
                    ${ !loading && results.length === 0 && query !== '' && html`<p>No Research Highlights found.</p>` }
                <//>
        </${Fragment}>
    <div ...${ blockProps }>
        ${!hideTags && html`
            <div>
            <div onClick=${openModal}>
                <h2 className="heading--auxiliary">Research Highlights</h2>
                <div>
                   <p>Research Highlights content is managed outside of this block. Click to learn more.</p>
             ${res.length ? html`
                  <ul style=${{margin:'6px 0 0', paddingLeft:'18px'}}>
                    ${res.map((r, i) => html`
                      <li key=${r?.id || r?.['@id'] || i}>${r?.title || r?.label || '(untitled)'}</li>
                    `)}
                  </ul>
                ` : null}
                </div>
            </div>
            ${isOpen && html`
            <${Modal} title="Editing Your Research Highlights" onRequestClose=${ closeModal }>
                <div>To add or edit your Research Highlights, use the "Research Highlights" area in the "Person" right-hand sidebar</div>
            </${Modal}>
          `}
          </div>
        `}
    </div>
    `
}