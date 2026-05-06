import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

export default () => {
  const blockProps = useBlockProps();
  const { editPost } = useDispatch('core/editor');

  const rawMeta = SelectUtils.editedPostAttribute('meta') || {};

  const expertId = rawMeta.aggie_experts_id || '';
  const hideResearchHighlights = !!rawMeta.hide_research_highlights;
  
  const saveExpertId = async (query) => {
    const q = (query || '').trim();
    await editPost({ meta: { aggie_experts_id: q } });
  };

  const clearExpertId = async () => {
    await editPost({ meta: { aggie_experts_id: '' } });
  };


  return html`
    <${Fragment}>
      <${InspectorControls}>
        <${PanelBody} title="Research Highlights" initialOpen=${true}>
          <${TextControl}
            value=${rawMeta.aggie_experts_id || ''}
            label="Aggie Expert ID"
            onChange=${(value) => saveExpertId(value)}
            placeholder="Enter Expert ID..."
          />

          <div style=${{ display: 'flex', gap: '8px', marginTop: '.5em', marginBottom: '.5em' }}>
            <${Button} variant="secondary" onClick=${clearExpertId}>Clear</${Button}>
          </div>

        </${PanelBody}>
      </${InspectorControls}>

      <div style=${{ marginTop: '1.5rem' }}>
        ${ !hideResearchHighlights && html`
          <div>
            <h2 className="heading--auxiliary">Research Highlights</h2>
            <div>
              <div ...${blockProps}>
                <div className='alert'>
                  ${ expertId
                    ? html`<div>Research highlights for Aggie Expert ID <strong>${expertId}</strong> will display here</div>`
                    : html`<div>Please enter an Expert ID to load Research Highlights.</div>` }
                </div>
              </div>
            </div>
          </div>
        `}
      </div>
    </${Fragment}>
  `;
};
