import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/exhibit-query';
const settings = {
  api_version: 2,
	title: "Exhibit Query",
	description: "Display a list of exhibits based on query parameters you define",
	icon: UCDIcons.renderPublic('fa-clipboard-question'),
	category: 'ucdlib-special',
	keywords: [],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    status: {
      type: 'string',
      default: ''
    },
    template: {
      type: 'string',
      default: 'highlight'
    },
    orderby: {
      type: 'string',
      default: 'date'
    }
  },
  edit: Edit
};

export default { name, settings };