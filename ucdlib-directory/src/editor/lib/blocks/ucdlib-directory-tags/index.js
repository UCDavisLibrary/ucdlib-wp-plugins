import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/tags';
const settings = {
  api_version: 2,
	title: "Directory Tags",
  parent: [],
	description: "Change your tags",
	icon: UCDIcons.renderPublic('fa-tags'),
	category: 'ucdlib-directory-person',
	keywords: [ 'tag', 'subject' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };