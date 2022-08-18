import { html, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { PanelBody, TextControl } from '@wordpress/components';
import { ToolbarSelectMenu, ToolbarColorPicker } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { useBlockProps, RichText, BlockControls, InspectorControls } from '@wordpress/block-editor';
import classnames from 'classnames';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const classes = classnames({
    "digital-sign-text": true,
    [`digital-sign-text--${attributes.size}`]: attributes.size,
    [`${attributes.brandColor}`]: attributes.brandColor
  });

  const style = {
    padding: attributes.padding || '',
    margin: attributes.margin || '',
    lineHeight: attributes.lineHeight || ''
  }

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
    <${InspectorControls}>
      <${PanelBody} title="Spacing">
        <${TextControl} 
          label='Margin'
          value=${attributes.margin}
          onChange=${margin => setAttributes({margin})}
        />
        <${TextControl} 
          label='Padding'
          value=${attributes.padding}
          onChange=${padding => setAttributes({padding})}
        />
        <${TextControl} 
          label='Line Height'
          value=${attributes.lineHeight}
          onChange=${lineHeight => setAttributes({lineHeight})}
        />
      </${PanelBody}>
    </${InspectorControls}> 
    <div className=${classes} style=${style}>
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