import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/content';
const settings = {
  api_version: 2,
	title: "Person Content Widget",
	description: "Widget that displays counts of site content for a person.",
	icon: UCDIcons.renderPublic('fa-file-pen'),
	category: 'ucdlib-directory-person',
	keywords: [  ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };