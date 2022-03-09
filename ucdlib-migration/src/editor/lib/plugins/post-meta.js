import { createElement } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch, useSelect } from "@wordpress/data";
import { SelectControl } from '@wordpress/components';
import htm from 'htm';

const html = htm.bind( createElement );
const name = 'ucdlib-migration-meta';

const Edit = () => {

  const pageMeta = useSelect( (select) => {
    const meta = select('core/editor').getEditedPostAttribute('meta');
    return meta ? meta : {};
  }, []);
  const editPost = useDispatch( 'core/editor' ).editPost;

  const statusOptions = [
    {value: 'in-progress', label: 'In Progress'},
    {value: 'stub', label: 'Stub'},
    {value: 'mostly-done', label: 'Mostly Done'},
    {value: 'complete', label: 'Complete'}
  ];
  return html`
    <${PluginDocumentSettingPanel}
      className=${name}
      title="Migration">
      <${SelectControl} 
        label="Page Status"
        value=${pageMeta.migration_status}
        options=${statusOptions}
        onChange=${migration_status => {editPost({meta: {migration_status}})}}
      />
    </${PluginDocumentSettingPanel}>
  `
}

const settings = {render: Edit};
export default { name, settings };