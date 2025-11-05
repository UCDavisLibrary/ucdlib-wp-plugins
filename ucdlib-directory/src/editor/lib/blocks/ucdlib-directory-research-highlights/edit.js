import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

export default () => {
  const blockProps = useBlockProps();
  const { editPost } = useDispatch('core/editor');

  const rawMeta = SelectUtils.editedPostAttribute('meta') || {};

  const expertId = rawMeta.aggie_experts_id || '';
  const hideResearchHighlights = !!rawMeta.hide_research_highlights;
  
  const [query, setQuery] = useState(expertId);

  const saveExpertId = async () => {
    const q = (query || '').trim();
    await editPost({ meta: { ...rawMeta, aggie_experts_id: q } });
  };

  const clearExpertId = async () => {
    setQuery('');
    await editPost({ meta: { ...rawMeta, aggie_experts_id: '' } });
  };


  return html`
    <${Fragment}>
      <${InspectorControls}>
        <${PanelBody} title="Research Highlights" initialOpen=${true}>
          <${TextControl}
            value=${query}
            label="Expert Record ID"
            onChange=${setQuery}
            placeholder="Enter Expert ID..."
          />

          <div style=${{ display: 'flex', gap: '8px', marginTop: '.5em', marginBottom: '.5em' }}>
            <${Button} variant="primary" onClick=${saveExpertId}>Save Expert ID<//>
            <${Button} variant="secondary" onClick=${clearExpertId}>Clear<//>
          </div>

          ${ expertId && html`<p>Saved Expert ID (meta): <strong>${expertId}</strong></p>` }
        <//>
      <//>

      <div style=${{ marginTop: '1.5rem' }}>
        ${ !hideResearchHighlights && html`
          <h2 className="heading--auxiliary">Research Highlights</h2>
          <div>
            <div ...${blockProps}>
              <div className='alert'>
                ${ expertId
                  ? html`Aggie Experts Research Highlights for <strong>${expertId}</strong>`
                  : html`Please enter an Expert ID to load Research Highlights.` }
              </div>
            </div>
          </div>
        `}
      </div>
    <//>
  `;
};
