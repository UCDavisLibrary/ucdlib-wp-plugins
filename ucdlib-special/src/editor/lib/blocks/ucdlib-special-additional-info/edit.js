import { html, SelectUtils, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";

export default ( props ) => {
  const blockProps = useBlockProps();
  const meta = SelectUtils.meta();
  const editPost = useDispatch( 'core/editor' ).editPost;

  const onAdditionalInfoChange = (link, index) => {
    const isLink = link.split('href="').length > 1;
    let metaLinks = JSON.parse(JSON.stringify(meta.links));
    // let additionalInfo = metaLinks.filter(l => l.linkType === 'referenceInfo')[index];
    let additionalInfo = metaLinks[index];
    if (!additionalInfo) {
      additionalInfo = { linkURL: '', displayLabel: '', linkType: 'referenceInfo' };
      metaLinks.push(additionalInfo);
    }

    if (isLink) {
      const linkURL = link.split('href="')[1].split('">')[0];
      const linkTitle = link.split('>')[link.split('>').length - 2].split('</a')[0];
      if (additionalInfo.linkURL !== linkURL || additionalInfo.displayLabel !== linkTitle) {
        additionalInfo.linkURL = linkURL;
        additionalInfo.displayLabel = linkTitle;
      }
    } else {
      additionalInfo.displayLabel = link;
    }
    editPost({meta: {links: metaLinks}});
  }

  const onNewAdditionalInfo = (link) => {
    const isLink = link.split('href="').length > 1;
    let metaLinks = JSON.parse(JSON.stringify(meta.links));
    const additionalInfo = { linkURL: '', displayLabel: '', linkType: 'referenceInfo' };

    if (isLink) {
      const linkURL = link.split('href="')[1].split('"')[0];
      const displayLabel = link.split('>')[link.split('>').length - 2].split('</a')[0];
      additionalInfo.linkURL = linkURL;
      additionalInfo.displayLabel = displayLabel;
    } else {
      additionalInfo.displayLabel = link;
    }

    metaLinks.push(additionalInfo);
    editPost({meta: {links: metaLinks}});
  }

  const onUndoClicked = (e) => {
    let metaLinks = JSON.parse(JSON.stringify(meta.links));
    const fetchedDataLinks = meta.fetchedData.links;

    metaLinks.forEach((ai, index) => {
      if (ai.linkType === 'referenceInfo') {
        metaLinks[index].displayLabel = fetchedDataLinks[index].displayLabel;
        metaLinks[index].linkURL = fetchedDataLinks[index].linkURL;
      }
    });

    editPost({meta: {links: metaLinks}});
  }

  let isModified = false;
  if (meta.fetchedData) {
    let fetchedRecord = meta.fetchedData.links.filter(l => l.linkType === 'referenceInfo');
    if (fetchedRecord) {
      fetchedRecord.forEach((value, index) => {
        if (!isModified) {
          const currentRecord = Object.values(meta.links).filter(l => l.linkType === 'referenceInfo')[index];
          isModified = !Object.keys(currentRecord)
            .every(key => fetchedRecord[index].hasOwnProperty(key) && fetchedRecord[index][key] === currentRecord[key]);
        }
      });
    }
  }

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarButton} 
        icon=${UCDIcons.render('undo')}
        onClick=${onUndoClicked}
        label="Restore Additional Collection Info to Default"
        disabled=${!isModified}
      />
    </${BlockControls}>

    <div>
      <h4>Additional Collection Info ${isModified ? html`<span className="strawberry">*</span>` : ''}</h4>
      ${meta.links.map((link, index) => {
        if (link.linkType === 'referenceInfo') {
          const value = `<a href="${link.linkURL}" data-rich-text-format-boundary="true">${link.displayLabel || link.linkURL}</a>`;
          return <RichText
            tagName="a"
            className=""
            href={link.linkURL}
            title={link.displayLabel}
            value={value}
            key={index}
            style={{ display: 'block' }}
            onChange={(link) => onAdditionalInfoChange(link, index)}
          />
        }
      })}
      ${meta.links.filter(l => l.linkType === 'referenceInfo').length === 0 ? html`
      <${RichText}
        tagName="a"
        className=""
        href=""
        title=""
        value=""
        onChange=${(link) => onNewAdditionalInfo(link)}
      />
      ` : ''}
    </div>
  </div>
  `
}