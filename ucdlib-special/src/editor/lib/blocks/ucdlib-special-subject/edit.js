import { html, SelectUtils, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onSubjectChange = (sub, index) => {
    meta.subject[index] = sub;
    editPost({meta: {subject: meta.subject}})
  }

  const onUndoClicked = (e) => {
    const newSubject = [...meta.subject];
    meta.fetchedData.subject.forEach((value, index) => {
      newSubject[index] = value;
    });
    editPost({meta: {subject: newSubject}});
  }

  let isModified = false;
  meta.subject.forEach((value, index) => {
    if (value !== meta.fetchedData.subject[index]) {
      isModified = true;
    }
  });

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${UCDIcons.render('undo')}
        onClick=${onUndoClicked}
        label="Restore Subject to Default"
        disabled=${!isModified}
      />
    </${BlockControls}>

    <div>
      <h4>Subject ${isModified ? html`<span className="strawberry">*</span>` : ''}</h4>
      ${meta.subject.map((sub, index) => {
        return <RichText
          tagName="p"
          className=""
          value={sub}
          onChange={(sub) => onSubjectChange(sub, index)}
        />
      })}      

    </div>
  </div>
  `
}