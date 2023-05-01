import { UCDIcons, Save  } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-floor';
const settings = {
  api_version: 2,
	title: "Floor",
  parent: [ 'ucdlib-locations/map-floors' ],
	description: "Building map floor",
	icon: UCDIcons.renderPublic('fa-window-maximize'),
	category: 'ucdlib-locations',
	keywords: [ 'level' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    title: {
      type: 'string',
      default: ''
    },
    subTitle: {
      type: 'string',
      default: ''
    },
    navText: {
      type: 'string',
      default: ''
    },
    topLayerId: {
      type: 'number',
      default: 0
    }
  },
  edit: Edit,
  save: Save
};

export default { name, settings };