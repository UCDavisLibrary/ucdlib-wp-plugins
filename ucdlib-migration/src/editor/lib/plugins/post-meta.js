import { createElement, useState } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch, useSelect } from "@wordpress/data";
import { 
  SelectControl, 
  PanelRow, 
  BaseControl, 
  Button, 
  ButtonGroup,
  ToggleControl,
  TextControl,
  Snackbar,
  Modal } from '@wordpress/components';
import htm from 'htm';

const html = htm.bind( createElement );
const name = 'ucdlib-migration-meta';

const Edit = () => {

  // get metadata
  const editPost = useDispatch( 'core/editor' ).editPost;
  const pageMeta = useSelect( (select) => {
    const meta = select('core/editor').getEditedPostAttribute('meta');
    return meta ? meta : {};
  }, []);

  // set up content status select
  const statusOptions = [
    {value: '', label: '--Status Not Set--'},
    {value: 'stub', label: 'Stub'},
    {value: 'content-build', label: 'Content Build'},
    {value: 'go-live-ready', label: 'Go Live Ready'}
  ];

  const MySnackbarNotice = () => html`
    <${Snackbar}>Post published successfully.</${Snackbar}>`
  ;

  // set up old site redirect inputs
  const [ redirectModalIsOpen, setRedirectModalOpen ] = useState( false );
  const [ redirectModalMode, setRedirectModalMode ] = useState( 'add' );
	const openRedirectModal = (mode) => {
    setRedirectModalMode( mode)
    setRedirectModalOpen( true )
  };
	const closeRedirectModal = () => {
    setRedirectModalOpen( false );
  };
  const [ isRegex, setRegex ] = useState( false );
  const [ newPath, setNewPath ] = useState( '' );
  const addRedirect = () => {
    if ( newPath ) {
      const migration_redirects = pageMeta.migration_redirects;
      migration_redirects.push({path: newPath, regex: isRegex});
      editPost({meta: {migration_redirects}})

      wp.data.dispatch("core/notices").createNotice("success",
      "Redirect added", 
      {
        type: "snackbar",
        isDismissible: true
      });

      setRegex(false);
      setNewPath("");
    } 

    closeRedirectModal();
  }
  const editRedirect = ( i, field, value ) => {
    console.log(i, field, value);
    if ( i > pageMeta.migration_redirects.length - 1 ) return;
    
    // nasty little workaround for making wp realize the array has changed
    // probably related to this: https://github.com/WordPress/gutenberg/issues/25668
    const migration_redirects = JSON.parse(JSON.stringify(pageMeta.migration_redirects));
    migration_redirects[i][field] = value;
    editPost({meta: {migration_redirects}});
  }

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
        <${BaseControl.VisualLabel}>Redirects from Old Site</${BaseControl.VisualLabel}>
      </${PanelRow}>
      <div style=${{marginBottom: '5px'}}>Number of redirects: ${pageMeta.migration_redirects.length}</div>
      <${ButtonGroup}>
        <${Button} variant="secondary" onClick=${ () => openRedirectModal('add') }>
          Add
        </${Button}>
        ${pageMeta.migration_redirects.length ? html`
          <${Button} variant="secondary" onClick=${ () => openRedirectModal('edit') }>
            View/Edit
          </${Button}>
        ` : html``}
      </${ButtonGroup}>
      ${redirectModalIsOpen && html`
        <${Modal} title="${redirectModalMode == 'add' ? 'Add a Redirect' : 'Edit Redirects'}" onRequestClose=${closeRedirectModal}>
          ${redirectModalMode == 'add' && html`
            <div>
              <${ToggleControl} 
                label="Regex"
                checked=${ isRegex }
                onChange=${() => setRegex(( state ) => ! state)} />
              <${TextControl} 
                label="Path"
                value=${newPath}
                onChange=${(v) => setNewPath(v)}
              />
              <${ButtonGroup}>
                <${Button} variant="primary" onClick=${ addRedirect }>Save</${Button}>
                <${Button} variant="secondary" onClick=${ closeRedirectModal }>Cancel</${Button}>
              </${ButtonGroup}>
            </div>
          `}
          ${redirectModalMode == 'edit' && html`
            <div>
              <div style=${{display: 'table'}}>
                <div style=${{display: 'table-row'}}>
                    <div style=${{display: 'table-cell', fontWeight: 600, paddingBottom: '6px'}}>Regex</div>
                    <div style=${{display: 'table-cell', fontWeight: 600, paddingBottom: '6px'}}>Path</div>
                </div>
                ${pageMeta.migration_redirects.map((r, i) => html`
                  <div key=${i} style=${{display: 'table-row'}}>
                    <div style=${{display: 'table-cell'}}>
                      <${ToggleControl} 

                        checked=${ r.regex }
                        onChange=${(v) => editRedirect(i, 'regex', v)} />
                    </div>
                    <div style=${{display: 'table-cell'}}>
                      <${TextControl} 

                        value=${r.path}
                        onChange=${(v) => editRedirect(i, 'path', v)}
                      />
                    </div>
                    <div style=${{display: 'table-cell', paddingLeft: '15px'}}>
                    <${Button} variant="link" isDestructive onClick=${ () => console.log(i) }>X</${Button}>
                    </div>
                  </div>
                `)}
              </div>
              <${Button} variant="secondary" onClick=${ closeRedirectModal }>
                Close
              </${Button}>
            </div>
          `}
        </${Modal}>
      `}
    </${PluginDocumentSettingPanel}>
  `
}

const settings = {render: Edit};
export default { name, settings };