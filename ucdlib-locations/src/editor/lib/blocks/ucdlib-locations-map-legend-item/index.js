import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-legend-item';
const settings = {
  api_version: 2,
	title: "Legend Item",
  parent: [ 'ucdlib-locations/map-legend' ],
	description: "Add a static legend item",
	icon: UCDIcons.renderPublic('fa-star'),
	category: 'ucdlib-locations',
	keywords: [ 'icon' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    label: {
      type: 'string',
      default: ''
    },
    icon: {
      type: 'string',
      default: 'ucd-public:fa-star'
    },
  },
  edit: Edit
};

export default { name, settings };