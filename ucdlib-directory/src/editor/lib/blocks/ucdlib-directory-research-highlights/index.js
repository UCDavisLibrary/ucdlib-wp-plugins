import { UCDIcons } from "@ucd-lib/brand-theme-editor/lib/utils";
import Edit from './edit';

const name = 'ucdlib-directory/research-highlights';
const settings = {
  api_version: 2,
  title: "Research Highlights",
  description: "Highlight your research works",
  icon: UCDIcons.renderPublic('fa-flask'),
  category: 'ucdlib-directory',
  keywords: [ 'research', 'highlights', 'works' ],
  supports: {
    "html": false,
    "customClassName": false
  },
  attributes: {
    expertId: {
      "type": "string",
      "default": ""
    },
    hideResearchHighlights: {
      "type": "boolean",
      "default": false
    }
  },
  edit: Edit
};

export default { name, settings };