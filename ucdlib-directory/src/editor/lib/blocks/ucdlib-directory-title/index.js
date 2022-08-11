import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/title';
const settings = {
  api_version: 2,
	title: "Your Title and Department",
  parent: [],
	description: "Change your position title and department within the library.",
	icon: UCDIcons.renderPublic('fa-address-card'),
	category: 'ucdlib-directory-person',
	keywords: [ "position", "title", "department", 'unit' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };