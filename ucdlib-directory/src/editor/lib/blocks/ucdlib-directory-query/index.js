import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/query';
const settings = {
  api_version: 2,
	title: "Person Query",
	description: "Displays library people based on your query parameters",
	icon: UCDIcons.renderPublic('fa-users-line'),
	category: 'ucdlib-directory',
	keywords: [ 'people', 'person', 'department' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    hideDepartments: {
      type: 'string',
      default: ''
    },
    library: {
      type: 'array',
      default: []
    },
    department: {
      type: 'array',
      default: []
    },
    directoryTag: {
      type: 'array',
      default: []
    },
    q: {
      type: 'array',
      default: []
    },
    orderby: {
      type: 'string',
      default: 'department'
    },
    columns: {
      type: 'string',
      default: 'one'
    },
    showExpertise: {
      type: 'boolean',
      default: false
    }
  },
  edit: Edit
};

export default { name, settings };
