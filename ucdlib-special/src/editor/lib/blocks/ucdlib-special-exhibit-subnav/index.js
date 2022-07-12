import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/exhibit-subnav';
const settings = {
  api_version: 2,
	title: "Exhibit Subnav",
	description: "Displays a subnav for a hierarchical exhibit",
	icon: UCDIcons.renderPublic('fa-folder-tree'),
	category: 'ucdlib-special',
	keywords: [ 'menu', 'child'],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };