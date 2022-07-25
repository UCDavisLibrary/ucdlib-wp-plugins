import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/exhibit-highlight';
const settings = {
  api_version: 2,
	title: "Exhibit Highlight",
	description: "Display a preview of a single existing exhibit",
	icon: UCDIcons.renderPublic('fa-image'),
	category: 'ucdlib-special',
	keywords: [ 'feature', 'image', 'picture'],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    exhibitId: {
      type: 'number',
      default: 0
    },
    brandColor: {
      type: "string",
      default: "primary"
    },
  },
  edit: Edit
};

export default { name, settings };