import { createElement, useState, useEffect } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch, useSelect } from "@wordpress/data";
import { 
  SelectControl, 
  PanelRow, 
  BaseControl, 
  Button, 
  Modal } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs, getPath } from '@wordpress/url';
import htm from 'htm';

const html = htm.bind( createElement );
const name = 'ucdlib-migration-meta';

const Edit = () => {

  // get metadata
  const editPost = useDispatch( 'core/editor' ).editPost;
  const {pageMeta, permalink} = useSelect( (select) => {
    let pageMeta = select('core/editor').getEditedPostAttribute('meta');
    pageMeta = pageMeta ? pageMeta : {};
    let permalink = select('core/editor').getPermalink();
    permalink = permalink ? permalink : '';
    return {pageMeta, permalink};
  }, []);

  // set up content status select
  const statusOptions = [
    {value: '', label: '--Status Not Set--'},
    {value: 'stub', label: 'Stub'},
    {value: 'content-build', label: 'Content Build'},
    {value: 'go-live-ready', label: 'Go Live Ready'}
  ];

  // get redirects from redirection plugin
  const [ redirectModalIsOpen, setRedirectModalOpen ] = useState( false );
  const [ redirectModalMode, setRedirectModalMode ] = useState( 'add' );
  const [ redirects, setRedirects ] = useState( [] );

  useEffect(() => {
    if ( permalink ){
      const permaPath = getPath(permalink).endsWith("/") ? getPath(permalink).slice(0, -1) : getPath(permalink);
      const path = addQueryArgs( '/redirection/v1/redirect', {
        filterBy: {
          target: permaPath,
          status: 'enabled',
          action: 'url'
        }, 
        per_page: 200,
        orderby: "last_count",
        direction: 'desc'
      });
      apiFetch( {path} ).then( 
        ( r ) => {
          setRedirects(r.items.filter(redirect => {
            return redirect.action_data.url == `/${permaPath}` || redirect.action_data.url == permalink;
          }));
        }, 
        (error) => {
          console.warn('Unable to retrieve redirect list.')
        })
    }
  }, [permalink])

	const openRedirectModal = () => {
    setRedirectModalOpen( true )
  };
	const closeRedirectModal = () => {
    setRedirectModalOpen( false );
  };

  return html`
    <${PluginDocumentSettingPanel}
      className=${name}
      title="Migration">
      <${PanelRow}>
        <${SelectControl} 
          label="Content Status"
          value=${pageMeta.migration_status}
          options=${statusOptions}
          onChange=${migration_status => {editPost({meta: {migration_status}})}}
        />
      </${PanelRow}>
      <${PanelRow}>
        <${BaseControl.VisualLabel}>Redirects to this page</${BaseControl.VisualLabel}>
      </${PanelRow}>
      <div style=${{marginBottom: '5px'}}>Number of redirects: ${redirects.length}</div>
      ${redirects.length ? html`
        <${Button} variant="secondary" onClick=${ () => openRedirectModal() }>
              View
        </${Button}>
      ` : html``}
      ${redirectModalIsOpen && html`
        <${Modal} title="Redirects to this page" isFullScreen onRequestClose=${closeRedirectModal}>
          <div>
            <div style=${{display: 'table', width: '100%'}}>
              <div style=${{display: 'table-row'}}>
                  <div style=${{display: 'table-cell', fontWeight: 600, paddingBottom: '6px', width: '60%'}}>URL</div>
                  <div style=${{display: 'table-cell', fontWeight: 600, paddingBottom: '6px', width: '15%'}}>Hits</div>
                  <div style=${{display: 'table-cell', fontWeight: 600, paddingBottom: '6px', width: '25%'}}>Last Access</div>
              </div>
              ${redirects.map((r, i) => html`
                <div key=${i} style=${{display: 'table-row'}}>
                  <div style=${{display: 'table-cell'}}>${r.url}</div>
                  <div style=${{display: 'table-cell'}}>${r.hits}</div>
                  <div style=${{display: 'table-cell'}}>${r.last_access}</div>
                </div>
              `)}
            </div>
            <div style=${{marginTop: '10px'}}>
              <${Button} variant="secondary" onClick=${ closeRedirectModal }>
                Close
              </${Button}>
            </div>
          </div>
        </${Modal}>
      `}
    </${PluginDocumentSettingPanel}>
  `
}

const settings = {render: Edit};
export default { name, settings };