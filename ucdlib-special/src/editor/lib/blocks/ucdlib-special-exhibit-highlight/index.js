import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/exhibit-highlight';
const settings = {
  api_version: 2,
	title: "Exhibit Highlight",
	description: "Display a preview of a single existing exhibit",
	icon: UCDIcons.renderPublic('fa-immage'),
	category: 'ucdlib-special',
	keywords: [ 'feature', 'image', 'picture'],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    brandColor: {
      type: "string",
      default: ""
    },
  },
  edit: Edit
};

export default { name, settings };