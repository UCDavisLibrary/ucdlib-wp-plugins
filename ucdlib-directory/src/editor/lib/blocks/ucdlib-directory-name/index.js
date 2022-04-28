import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/name';
const settings = {
  api_version: 2,
	title: "Your Name",
  parent: [],
	description: "Change your first and last name.",
	icon: UCDIcons.renderPublic('fa-signature'),
	category: 'ucdlib-directory-person',
	keywords: [ "name", "title" ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };