import { UCDIcons, Save } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-locations/sign-sections';
const settings = {
  api_version: 2,
	title: "Digital Sign Sections",
	description: "Primary layout block for digital signs",
	icon: UCDIcons.renderPublic('fa-layer-group'),
	category: 'ucdlib-locations-signs',
	keywords: [  ],
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