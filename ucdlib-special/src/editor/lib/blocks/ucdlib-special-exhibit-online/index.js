import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/exhibit-online';
const settings = {
  api_version: 2,
	title: "Online Exhibits",
	description: "Displays a list of online exhibits with filters",
	icon: UCDIcons.renderPublic('fa-html5'),
	category: 'ucdlib-special',
	keywords: [],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };