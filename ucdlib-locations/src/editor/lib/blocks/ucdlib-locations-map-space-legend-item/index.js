import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-space-legend-item';
const settings = {
  api_version: 2,
	title: "Toggle",
  parent: [ 'ucdlib-locations/map-space-legend' ],
	description: "Register a space type, so that it can be toggled on/off in the legend",
	icon: UCDIcons.renderPublic('fa-toggle-on'),
	category: 'ucdlib-locations',
	keywords: [ 'study', 'zone' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    label: {
      type: 'string',
      default: ''
    },
    slug: {
      type: 'string',
      default: ''
    },
    icon: {
      type: 'string',
      default: 'ucd-public:fa-star'
    },
    brandColor: {
      type: "string",
      default: "admin-blue"
    }
  },
  edit: Edit
};

export default { name, settings };