import { UCDIcons, Save  } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-floors';
const settings = {
  api_version: 2,
	title: "Floors",
  parent: [ 'ucdlib-locations/map-building' ],
	description: "Building map floors",
	icon: UCDIcons.renderPublic('fa-window-restore'),
	category: 'ucdlib-locations',
	keywords: [ 'level' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit,
  save: Save
};

export default { name, settings };