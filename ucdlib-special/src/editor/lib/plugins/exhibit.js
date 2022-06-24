import { Fragment } from "@wordpress/element";
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { useDispatch } from "@wordpress/data";
import { SelectControl, Modal } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";

const name = 'ucdlib-special-exhibit';

const Edit = () => {

  // bail if not exhibit
  const isExhibit = SelectUtils.editedPostAttribute('type') === 'exhibit';
  if ( !isExhibit )  return html`<${Fragment} />`;

  const [ modalIsOpen, setModalOpen ] = useState( false );
	const openModal = () => setModalOpen( true );
	const closeModal = () => setModalOpen( false );


  const parent = SelectUtils.editedPostAttribute('parent') || 0;
  console.log(parent);

  /** 
  const meta = SelectUtils.editedPostAttribute('meta');
  const exhibitType = meta.exhibitType || 'physical';
  const watchedVars = [
    exhibitType
  ];
  const { editPost } = useDispatch( 'core/editor', watchedVars );

  const exhibitTypeOptions = [
    {value: 'physical', label: 'Physical'},
    {value: 'online', label: 'Online Only'}
  ];
  */

  return html`

    <${PluginDocumentSettingPanel}
      className=${name}
      icon=${html`<ucdlib-icon style=${{marginLeft: '8px', width: '12px', minWidth: '12px'}} icon="ucd-public:fa-image"></ucdlib-icon>`}
      title="This Exhibit">
        <${Modal} title='Exhibit Metadata'>

        </${Modal}>
    </${PluginDocumentSettingPanel}>

  `
}

const settings = {render: Edit};
export default { name, settings };