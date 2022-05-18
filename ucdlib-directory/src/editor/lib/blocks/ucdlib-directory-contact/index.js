import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/contact';
const settings = {
  api_version: 2,
	title: "Your Contact Information",
  parent: [],
	description: "Change your contact information.",
	icon: UCDIcons.renderPublic('fa-envelope'),
	category: 'ucdlib-directory-person',
	keywords: [ 'email', 'phone', 'website', 'social', 'media' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };