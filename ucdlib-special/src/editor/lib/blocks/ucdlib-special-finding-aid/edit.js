import { html, SelectUtils, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onFindingAidChange = (findingAid) => {
    const isLink = findingAid.split('href="').length > 1;
    const newFindingAid = Object.assign({}, meta.findingAid);
    if (isLink) {
      const linkURL = findingAid.split('href="')[1].split('">')[0];
      const linkTitle = findingAid.split('>')[findingAid.split('>').length - 2].split('</a')[0];
      if (meta.findingAid.linkURL !== linkURL || meta.findingAid.linkTitle !== linkTitle) {
        newFindingAid.linkURL = linkURL;
        newFindingAid.linkTitle = linkTitle;
      }
    } else {
      newFindingAid.linkTitle = findingAid;
    }
    editPost({meta: {findingAid: newFindingAid}});
  }

  const onUndoClicked = (e) => {
    editPost({meta: {findingAid: Object.assign({}, meta.fetchedData.findingAid)}});
  } 

  let isModified = false;
  if (meta.fetchedData) {
    if (meta.fetchedData.findingAid.linkTitle || meta.fetchedData.findingAid.linkURL) {
      isModified = !Object.keys(meta.findingAid)
        .every(key => meta.fetchedData.findingAid.hasOwnProperty(key) && meta.fetchedData.findingAid[key] === meta.findingAid[key]);
    } else if (meta.findingAid.linkTitle || meta.findingAid.linkURL) {
      // isModified = !Object.values(meta.findingAid)
      //   .every(value => value === '' || !value);
      isModified = true;
    }
  }

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${UCDIcons.render('undo')}
        onClick=${onUndoClicked}
        label="Restore Finding Aid to Default"
        disabled=${!isModified}
      />
    </${BlockControls}>

    <div>
      <h4>Finding Aid ${isModified ? html`<span className="strawberry">*</span>` : ''}</h4>
      <${RichText}
          tagName="a"
          className=""
          href=${meta.findingAid.linkURL}
          title=${meta.findingAid.linkTitle}
          value=${meta.findingAid.linkTitle || meta.findingAid.linkURL}
          onChange=${(findingAid) => onFindingAidChange(findingAid)}
        />
    </div>
  </div>
  `
}