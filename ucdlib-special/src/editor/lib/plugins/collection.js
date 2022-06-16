import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { SelectControl } from '@wordpress/components';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-special-collection';

const Edit = () => {

  // get metadata
  const isCollection = SelectUtils.editedPostAttribute('type') === 'collection';
  const meta = SelectUtils.editedPostAttribute('meta');
  const collectionType = meta.collectionType || 'manuscript';
  const watchedVars = [
    collectionType
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );

  const collectionTypeOptions = [
    {value: 'manuscript', label: 'Manuscript'},
    {value: 'university-archive', label: 'University Archive'}
  ];

  return html`
    <${Fragment}>
      ${isCollection && html`
        <${PluginDocumentSettingPanel}
          className=${name}
          icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-file-invoice"></ucdlib-icon>`}
          title="This Collection">
            <${SelectControl} 
              options=${collectionTypeOptions}
              label="Collection Type"
              value=${collectionType}
              onChange=${collectionType => editPost({meta: {collectionType}})}
            /> 
        </${PluginDocumentSettingPanel}>
      `}
    </${Fragment}>
  `
}

const settings = {render: Edit};
export default { name, settings };