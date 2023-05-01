import { UCDIcons  } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/map-floor-layer';
const settings = {
  api_version: 2,
	title: "Space Layer",
  parent: [ 'ucdlib-locations/map-floor' ],
	description: "Building map floor space layer",
	icon: UCDIcons.renderPublic('fa-layer-group'),
	category: 'ucdlib-locations',
	keywords: [ 'space' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    imageId: {
      type: 'number',
      default: 0
    },
    spaceSlug: {
      type: 'string',
      default: ''
    }
  },
  edit: Edit
};

export default { name, settings };