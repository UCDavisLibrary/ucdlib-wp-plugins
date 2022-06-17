import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/contact';
const settings = {
  api_version: 2,
	title: "Contact List",
  parent: [],
	description: "Display phone numbers, email addresses, and websites in a stylized list.",
	icon: UCDIcons.renderPublic('fa-at'),
	category: 'ucdlib-directory',
	keywords: [ 'email', 'phone', 'website', 'social', 'media' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    allowAppointment: {
      type: 'boolean',
      default: true
    },
    allowAdditionalText: {
      type: 'boolean',
      default: false
    },
    placeholder: {
      type: 'string',
      default: ''
    }
  },
  edit: Edit
};

export default { name, settings };