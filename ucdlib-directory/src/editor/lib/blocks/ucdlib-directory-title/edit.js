import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Modal, TextControl, SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from "@wordpress/data";

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  // component state
  const [ positionTitle, setPositionTitle ] = useState( "" );
  const [ positionDepartment, setPositionDepartment ] = useState( {id: 0, name: ""} );
  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );

  // metadata from post
  const meta = SelectUtils.meta();
  const { editPost } = useDispatch( 'core/editor', [ meta.position_title, meta.position_dept ] );
  useEffect(() => {
    if ( meta.position_title ) {
      setPositionTitle(meta.position_title);
    }
  }, [meta.position_title])

  const departments = useSelect((select) => {
    let depts = select('core').getEntityRecords('postType', 'department', {per_page: 100, orderby: 'title', order: 'asc'});
    depts = depts ? depts : [];
    return depts
  })

  useEffect(() => {
    const dept = departments.find(({id}) => id == meta.position_dept);
    
    if ( dept ) {
      setPositionDepartment({id: meta.position_dept, name: dept.title.rendered});
    }
  }, [departments, meta.position_dept])




  const saveData = () => {
    const position_dept = parseInt(positionDepartment.id);
    const meta = {
      position_title: positionTitle, 
      position_dept
    };
    editPost({meta});

    closeModal();
  }

  const canSave = (() => {
    return positionTitle && positionDepartment.id;
  })();

  const deptChoices = [{value: 0, label: 'Select a Department'}, ...departments.map(d => {return {value: d.id, label: d.title.rendered}})];

  return html`
  <div ...${ blockProps }>
    <div onClick=${openModal}>
      ${positionTitle ? html`
        <h2>${positionTitle}</h2>
      ` : html`
        <h2 style=${{opacity: .8}}>Enter your title...</h2>
      `}

      ${positionDepartment.id ? html`
        <h3>${positionDepartment.name}</h3>
      ` : html`
        <h3 style=${{opacity: .8}}>Enter your department...</h3>
      `}
      
      
    </div>
    ${isOpen && html`
      <${Modal} title="Your Title and Department" isDismissible=${false}>
        <${TextControl} label="Title" value=${positionTitle} onChange=${(v) => setPositionTitle(v)}/>
        <${SelectControl} 
          label="Department"
          value=${positionDepartment.id}
          options=${deptChoices}
          onChange=${id => setPositionDepartment({id, name: deptChoices.find(({value}) => value == id).label})}
        />
        <${Button} variant="primary" disabled=${!canSave} onClick=${saveData}>Save</${Button}>
      </${Modal}>
    `}
  </div>
  `
}