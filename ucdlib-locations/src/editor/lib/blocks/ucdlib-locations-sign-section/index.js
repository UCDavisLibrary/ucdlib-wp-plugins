import { UCDIcons, Save } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/sign-section';
const settings = {
  api_version: 2,
	title: "Digital Sign Section",
  parent: ['ucdlib-locations/sign-sections'],
	description: "A section of a digital sign",
	icon: UCDIcons.renderPublic('fa-puzzle-piece'),
	category: 'ucdlib-locations-signs',
	keywords: [  ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    backgroundColor: {
      type: 'string',
      default: ''
    },
    textColor: {
      type: 'string',
      default: ''
    },
    justifyContent: {
      type: 'string',
      default: ''
    },
    alignItems: {
      type: 'string',
      default: ''
    },
    flexGrow: {
      type: 'string',
      default: ''
    }
  },
  edit: Edit,
  save: Save
};

export default { name, settings };