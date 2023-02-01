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
  const emptyDepartment = {id: 0, name: ""};
  const [ positionDepartment, setPositionDepartment ] = useState( [emptyDepartment] );
  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );

  // metadata from post
  const meta = SelectUtils.meta();
  const { editPost } = useDispatch( 'core/editor', [ meta.position_title, meta.position_dept.length ] );
  useEffect(() => {
    if ( meta.position_title ) {
      setPositionTitle(meta.position_title);
    }
  }, [meta.position_title])

  const departments = useSelect((select) => {
    let depts = select('core').getEntityRecords('postType', 'department', {per_page: 100, orderby: 'title', order: 'asc', 'context': 'view'});
    depts = depts ? depts : [];
    return depts
  })

  useEffect(() => {
    const selectedDepts = meta.position_dept.map(deptId => {
      return departments.find(({id}) => id == deptId);
    }).filter(x => x !== undefined);
    
    
    if ( selectedDepts.length ) {
      const depts = selectedDepts.map(d => {return {id: d.id, name: d.title.rendered}});
      setPositionDepartment([...depts, emptyDepartment]);
    }
  }, [departments, meta.position_dept])


  const saveData = () => {
    const position_dept = positionDepartment.map(d => parseInt(d.id)).filter(d => d !== 0 && !isNaN(d) );
    const meta = {
      position_title: positionTitle, 
      position_dept
    };
    editPost({meta});

    closeModal();
  }

  const deptChoices = [{value: 0, label: 'Select a Department'}, ...departments.map(d => {return {value: d.id, label: d.title.rendered}})];

  const updateDepartment = (deptId, i) => {
    //console.log(departments);
    const depts = [...positionDepartment];
    depts[i] = {id: deptId, name: deptChoices.find(({value}) => value == deptId).label};
    setPositionDepartment(depts);
  }

  const canSave = (() => {
    return positionTitle && positionDepartment.length && positionDepartment[0].id;
  })();

  const removeDepartment = (i) => {
    const before = positionDepartment.slice(0, i);
    const after = positionDepartment.slice(i+1);
    setPositionDepartment([...before, ...after]);
  };

  return html`
  <div ...${ blockProps }>
    <div onClick=${openModal}>
      ${positionTitle ? html`
        <h2>${positionTitle}</h2>
      ` : html`
        <h2 style=${{opacity: .8}}>Enter your title...</h2>
      `}

      ${positionDepartment.length && positionDepartment[0].id ? html`
        <h3>${positionDepartment.filter(d => d.id).map(d => d.name).join(", ")}</h3>
      ` : html`
        <h3 style=${{opacity: .8}}>Enter your department...</h3>
      `}
      
      
    </div>
    ${isOpen && html`
      <${Modal} title="Your Title and Department" isDismissible=${false}>
        <${TextControl} label="Title" value=${positionTitle} onChange=${(v) => setPositionTitle(v)}/>
        ${positionDepartment.map((d, i) => html`
          <div key=${d.id} style=${{display: 'flex'}}>
            <${SelectControl} 
              label="${d.id == 0 ? 'Add additional department' : 'Department'}"
              value=${d.id}
              options=${deptChoices}
              onChange=${id => updateDepartment(id, i)}
            />
            ${d.id != 0 && html`
              <${Button} style=${{marginLeft: '5px', paddingTop: '10px'}}isDestructive=${true} onClick=${() => removeDepartment(i)} variant='link'>delete</${Button}>
            `}
          </div>
        `)}

        <${Button} variant="primary" disabled=${!canSave} onClick=${saveData}>Save</${Button}>
      </${Modal}>
    `}
  </div>
  `
}