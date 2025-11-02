import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps} from '@wordpress/block-editor';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { PanelBody, TextControl, Button, Notice, Modal } from '@wordpress/components';
import { Fragment, useState, useCallback, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default ( props ) => {
  const { attributes, setAttributes } = props; 

  const blockProps = useBlockProps();
  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [searchedId, setSearchedId] = useState('');

  const meta = SelectUtils.editedPostAttribute('meta');
  const hideResearchHighlights = meta.hide_research_highlights ? meta.hide_research_highlights : false;

  useEffect(() => {
    setAttributes({ hideResearchHighlights });
  }, [hideResearchHighlights, setAttributes]);



  useEffect(() => {
    if (query.trim() === '') {
      setAttributes({ expertId: '' });
      setSearchedId('');
      setError('');
    }
  }, [query, setAttributes]);

  const fetchHighlights = useCallback(async () => {
    const q = query.trim();

    if (!q) {
      setAttributes({ expertId: '' });
      setSearchedId('');
      setError('');
      return;
    }

    try {
      setError('');
      const path = `ucdlib-directory/research-highlights/${encodeURIComponent(query)}`;
      const data = await apiFetch({ path });
      if (Array.isArray(data) && data.length > 0) {
        setAttributes({ expertId: q });
        setSearchedId(q);
      } else {
        setAttributes({ expertId: '' });
        setSearchedId('');
        setError(`No results found for Expert ID: ${q}`);
      }
    } catch (err) {
        setAttributes({ expertId: '' });
        setSearchedId('');
        setError(`API request failed${err?.message ? `: ${err.message}` : ''}`);
    }
  }, [query, setAttributes]);

  const clearAll = useCallback(() => {
    setQuery('');
    setAttributes({ expertId: '' });
    setSearchedId('');
    setError('');
  }, [setAttributes]);

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
                        label="Expert Record ID"
                        onChange=${ ( value ) => setQuery( value ) }
                        placeholder="Search Expert ID..."
                    />
             
                    <${Button}
                        variant="primary"
                        onClick=${ fetchHighlights }
                        style=${{ marginBottom: '.5em', marginTop: '.5em' }}
                        >Search Expert ID
                    <//>
                    <${Button} variant="secondary" onClick=${clearAll} isDestructive=${false}>
                      Clear
                    <//>

                    ${ searchedId !== '' && html`<p>Showing results for Expert ID: <strong>${ searchedId }</strong></p>`}
                    ${ error && html`<p>No Research Highlights found.</p>` }
                <//>
        </${Fragment}>
  <div style=${{ marginTop: '1.5rem' }}>
  ${!hideResearchHighlights && html`
    <h2 className="heading--auxiliary">Research Highlights</h2>
    <div onClick=${openModal}>   
      <div ...${ blockProps }>
        <div className='alert'>
          ${searchedId? html`Aggie Experts Research Highlights for <strong>${searchedId}</strong>`:html`Please enter an Expert ID to load Research Highlights.`}
        </div>
      </div>
      ${isOpen && html`
        <${Modal} title="Editing Your Research Highlights" onRequestClose=${ closeModal }>
          <div>To add or edit your Research Highlights, please update your Expert Record in the Aggie Experts system.</div>
        </${Modal}>
      `}
    </div>
    `}
  </div>
    `
}