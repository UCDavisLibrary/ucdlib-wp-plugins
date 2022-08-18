import { html, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { ToolbarSelectMenu, ToolbarColorPicker } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { useBlockProps, RichText, BlockControls } from '@wordpress/block-editor';
import classnames from 'classnames';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const classes = classnames({
    "digital-sign-text": true,
    [`digital-sign-text--${attributes.size}`]: attributes.size,
    [`${attributes.brandColor}`]: attributes.brandColor
  });

  const placeholder = attributes.placeholder || 'Write sign text...';

  const sizeOptions = [
    {
      title: 'Extra Small',
      slug: 'xs'
    },
    {
      title: 'Small',
      slug: 'sm'
    },
    {
      title: 'Medium',
      slug: ''
    },
    {
      title: 'Large',
      slug: 'lg'
    },
    {
      title: 'Extra Large',
      slug: 'xl'
    },
  ];

  return html`
  <div ...${ blockProps }>
    <${BlockControls} group="block">
      <${ToolbarSelectMenu} 
        label='Font Size'
        icon=${UCDIcons.renderPublic('fa-text-height')}
        options=${sizeOptions}
        value=${attributes.size}
        onChange=${v => setAttributes({size: v.slug})}
      /> 
      <${ToolbarColorPicker} 
        onChange=${(value) => {setAttributes( {brandColor: value ? value.slug : "" } )}}
        value=${attributes.brandColor}
        ucdBlock="all"
      />
    </${BlockControls}>
    <div className=${classes}>
      <${RichText} 
        tagName='span'
        value=${attributes.text}
        onChange=${(text) => setAttributes({text})}
        placeholder=${placeholder}
      />
    </div>
  </div>
  `
}