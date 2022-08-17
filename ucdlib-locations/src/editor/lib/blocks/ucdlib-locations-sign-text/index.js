import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/sign-text';
const settings = {
  api_version: 2,
	title: "Digital Sign Text",
	description: "Text input sized for a digital sign",
	icon: UCDIcons.renderPublic('fa-font'),
	category: 'ucdlib-locations-signs',
	keywords: [  ],
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
    placeholder: {
      type: 'string',
      default: ''
    }
  },
  edit: Edit
};

export default { name, settings };