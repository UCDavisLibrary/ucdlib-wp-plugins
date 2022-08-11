import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-special/exhibit-past';
const settings = {
  api_version: 2,
	title: "Past Exhibits",
	description: "Displays a list of past exhibits by year with filters",
	icon: UCDIcons.renderPublic('fa-images'),
	category: 'ucdlib-special',
	keywords: [],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
  },
  edit: Edit
};

export default { name, settings };