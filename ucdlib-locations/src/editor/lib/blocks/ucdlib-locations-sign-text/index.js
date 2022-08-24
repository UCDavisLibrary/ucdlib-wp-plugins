import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/sign-text';
const settings = {
  api_version: 2,
	title: "Digital Sign Text",
	description: "Text input sized for a digital sign",
	icon: UCDIcons.renderPublic('fa-font'),
	category: 'ucdlib-locations-signs',
	keywords: [ 'digital', 'sign' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    text: {
      type: 'string',
      default: ''
    },
    size: {
      type: 'string',
      default: ''
    },
    brandColor: {
      type: 'string',
      default: ''
    },
    margin: {
      type: 'string',
      default: ''
    },
    padding: {
      type: 'string',
      default: ''
    },
    lineHeight: {
      type: 'string',
      default: ''
    },
    placeholder: {
      type: 'string',
      default: ''
    }
  },
  edit: Edit
};

export default { name, settings };