import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { ContactListEdit, ContactListDisplay } from "@ucd-lib/brand-theme-editor/lib/block-components";
import { ToggleControl, PanelBody } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useDispatch } from "@wordpress/data";
import { createRef } from "@wordpress/element";

// indentical to the contat-list theme block except it writes to metadata instead of block attributes
export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  const modalRef = createRef();

  const meta = SelectUtils.editedPostAttribute('meta');
  const hide = meta.hide_contact ? true : false;
  const phones = meta.contactPhone ? meta.contactPhone : [];
  const emails = meta.contactEmail ? meta.contactEmail : [];
  const appointment = meta.contactAppointmentUrl ? meta.contactAppointmentUrl : '';
  const websites = meta.contactWebsite ? meta.contactWebsite : [];
  const { editPost } = useDispatch( 
    'core/editor', 
    [ hide, JSON.stringify(phones), JSON.stringify(emails), appointment, JSON.stringify(websites) ] 
  );

  const modalOpen = () => {
    if ( modalRef.current ) modalRef.current.openModal();
  }

  const onEdit = (d) => {
    const meta = {
      contactPhone: d.phones,
      contactEmail: d.emails,
      contactWebsite: d.websites
    };
    if ( attributes.allowAppointment ) {
      meta.contactAppointmentUrl = d.appointment;
    }

    editPost({meta});
  }

  return html`
  <div ...${ blockProps }>
  ${!hide && html`
    <div>
      <${ContactListDisplay} 
        placeholderText=${attributes.placeholder || "Click to enter contact info..."}
        phones=${phones}
        emails=${emails}
        websites=${websites}
        appointment=${appointment}
        onClick=${modalOpen}
      />
      <${ContactListEdit} 
        ref=${modalRef}
        modalTitle='Edit Contact Information'
        onClose=${onEdit}
        phones=${phones}
        emails=${emails}
        websites=${websites}
        appointment=${appointment}
        allowAppointment=${attributes.allowAppointment}
        allowAdditionalText=${attributes.allowAdditionalText}
      />
      <${InspectorControls}>
        <${PanelBody} title="Query Filters">
          <${ToggleControl} 
            label="Show Additional Text Field"
            checked=${attributes.allowAdditionalText}
            onChange=${() => setAttributes({allowAdditionalText: !attributes.allowAdditionalText})}
          /> 
        </${PanelBody}>
      </${InspectorControls}> 
    </div>
  `}

  </div>
  `
}