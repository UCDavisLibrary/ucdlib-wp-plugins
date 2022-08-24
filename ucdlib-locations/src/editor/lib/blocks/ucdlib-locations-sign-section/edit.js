import classnames from 'classnames';

import { html, UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import { ToolbarSelectMenu } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { BaseControl, ColorPicker, PanelBody, TextControl, ToolbarButton } from '@wordpress/components';
import { useBlockProps,
  BlockControls,
  InspectorControls,
  useInnerBlocksProps, 
  __experimentalBlockAlignmentMatrixControl as BlockAlignmentMatrixControl
} from '@wordpress/block-editor';
import { Fragment } from "@wordpress/element";

export default ( props ) => {
  const { attributes, setAttributes } = props;

  const classes = classnames({
    "digital-sign-section": true,
    "digital-sign-text": attributes.textSize ? true : false,
    [`digital-sign-text--${attributes.textSize}`]: attributes.textSize ? true : false
  });

  const style = {
    backgroundColor: attributes.backgroundColor || '',
    color: attributes.textColor || '',
    justifyContent: attributes.justifyContent || '',
    alignItems: attributes.alignItems || '',
    flexGrow: attributes.flexGrow || '',
    padding: attributes.padding || '',
    margin: attributes.margin || '',
    lineHeight: attributes.lineHeight || ''
  }

  const textSizeOptions = [
    {
      title: 'Not Set',
      slug: ''
    },
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
      slug: 'md'
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

  const blockProps = useBlockProps( {
    className: classes,
    style
  } );

  const convertAlignment = ({justifyContent, alignItems, blockValue}) => {
    const blockToFlex = {
      top: 'flex-start',
      bottom: 'flex-end',
      center: 'center',
      left: 'flex-start',
      right: 'flex-end'
    };
    const flexToBlock = {
      'flex-start' : {justifyContent: 'top', alignItems: 'left'},
      'flex-end' : {justifyContent: 'bottom', alignItems: 'right'},
      'center' : {justifyContent: 'center', alignItems: 'center'},
    };
    if ( blockValue ) {
      //const blockValues = blockValue.split(/(?=[A-Z])/).map(s => s.toLowerCase());
      const blockValues = blockValue.split(' ');
      const out = {justifyContent: '', alignItems: ''};
      if ( blockValues.length == 2) {
        out.justifyContent = blockToFlex[blockValues[0]];
        out.alignItems = blockToFlex[blockValues[1]];
      } else if (blockValues.length){
        out.justifyContent = blockToFlex[blockValues[0]];
        out.alignItems = blockToFlex[blockValues[0]];
      }
      return out;
    } else {
      justifyContent = justifyContent || 'flex-start';
      alignItems = alignItems || 'flex-start';
      return `${flexToBlock[justifyContent].justifyContent} ${flexToBlock[alignItems].alignItems}`;
    }
  }

  const currentAlignment = convertAlignment({
    justifyContent: attributes.justifyContent,
    alignItems: attributes.alignItems
  });

  const template = [['ucdlib-locations/sign-text']];
  const innerBlocksProps = useInnerBlocksProps( blockProps, {
    templateLock: false,
    template: template
  } );

  return html`
    <${Fragment}>
      <${BlockControls} group="block">
        <${BlockAlignmentMatrixControl} 
          label='Change content alignment'
          onChange=${blockValue => {setAttributes( convertAlignment({blockValue}) );}}
          value=${currentAlignment}
        />
        <${ToolbarButton} 
          label='Stretch to max available height'
          icon=${UCDIcons.renderPublic('fa-up-down')}
          onClick=${() => setAttributes({flexGrow: attributes.flexGrow ? '' : '1'})}
          isPressed=${attributes.flexGrow ? true : false}
        />
        <${ToolbarSelectMenu} 
          label='Default Font Size'
          icon=${UCDIcons.renderPublic('fa-text-height')}
          options=${textSizeOptions}
          value=${attributes.textSize}
          onChange=${v => setAttributes({textSize: v.slug})}
        /> 
      </${BlockControls}>
      <${InspectorControls}>
        <${PanelBody} title="Colors">
          <${BaseControl} label='Background Color' >
            <${ColorPicker} 
              color=${attributes.backgroundColor}
              onChange=${backgroundColor => setAttributes({backgroundColor})}
              defaultValue="#fff"
            />
          </${BaseControl}>
          <${BaseControl} label='Text Color' help='Default text color for the section. Can still be overridden by section blocks.'>
            <${ColorPicker} 
              color=${attributes.textColor}
              onChange=${textColor => setAttributes({textColor})}
              defaultValue="#000"
            />
          </${BaseControl}>
        </${PanelBody}>
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
            label='Default Line Height'
            value=${attributes.lineHeight}
            onChange=${lineHeight => setAttributes({lineHeight})}
          />
        </${PanelBody}>
      </${InspectorControls}> 
      <div ...${ innerBlocksProps } >
      </div>
    </${Fragment}>
  `;
}
