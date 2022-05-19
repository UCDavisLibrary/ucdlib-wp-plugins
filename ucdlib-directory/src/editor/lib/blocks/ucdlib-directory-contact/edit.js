import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, Modal, SelectControl, Button, __experimentalText as Text } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";
import { useState, Fragment } from '@wordpress/element';

export default ( props ) => {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();

  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );

  // get metadata
  const meta = SelectUtils.editedPostAttribute('meta');
  const hide = meta.hide_contact ? true : false;
  const phones = meta.contactPhone ? meta.contactPhone : [];
  const emails = meta.contactEmail ? meta.contactEmail : [];
  const appointment = meta.contactAppointmentUrl ? meta.contactAppointmentUrl : '';
  const websites = meta.contactWebsite ? meta.contactWebsite : [];
  const websiteTypes = [
    {value: '', label: 'Select a Type', disabled: true, icon: "ucd-public:fa-network-wired"},
    {value: 'google-scholar', label: 'Google Scholar', icon: "ucd-public:fa-network-wired"},
    {value: 'linkedin', label: 'LinkedIn', icon: 'ucd-public:fa-linkedin'},
    {value: 'orcid', label: 'ORCID', icon: 'ucd-public:fa-orcid'},
    {value: 'twitter', label: 'Twitter', icon: 'ucd-public:fa-twitter'},
    {value: 'other', label: 'Other', icon: "ucd-public:fa-network-wired"}
  ];
  const hasContactInfo = phones.length || emails.length || appointment || websites.length;
  const { editPost } = useDispatch( 
    'core/editor', 
    [ hide, JSON.stringify(phones), JSON.stringify(emails), appointment, JSON.stringify(websites) ] 
    );

  // phone setters
  const setPhone = (v, i, field) => {
    const before = phones.slice(0, i);
    const after = phones.slice(i+1);
    const phone = {...phones[i]};
    if ( field == 'value' ) {
      v = v.replace(/\D/g,'');
      phone.value = v;
    } else {
      phone.label = v;
    }
    editPost({meta: {contactPhone: [...before, phone, ...after] }});
  };
  const addNewPhone = () => {
    editPost({meta: {contactPhone: [...phones, {value: '', label: ''}]}});
  };
  const removePhone = (i) => {
    const before = phones.slice(0, i);
    const after = phones.slice(i+1);
    editPost({meta: {contactPhone: [...before, ...after] }});
  };
  const getPhoneLabel = (phone) => {
    if ( phone.label ) return phone.label;
    if ( phone.value.length == 10 ) {
      return `${phone.value.slice(0,3)}-${phone.value.slice(3,6)}-${phone.value.slice(6)}`
    }
    if ( phone.value.length == 7 ){
      return `${phone.value.slice(0,3)}-${phone.value.slice(3)}`
    }
    return phone.value;
  }

  // email setters
  const setEmail = (v, i, field) => {
    const before = emails.slice(0, i);
    const after = emails.slice(i+1);
    const email = {...emails[i]};
    email[field] = v;

    editPost({meta: {contactEmail: [...before, email, ...after] }});
  };
  const addNewEmail = () => {
    editPost({meta: {contactEmail: [...emails, {value: '', label: ''}]}});
  };
  const removeEmail = (i) => {
    const before = emails.slice(0, i);
    const after = emails.slice(i+1);
    editPost({meta: {contactEmail: [...before, ...after] }});
  };

  // website setters
  const setWebsite = (v, i, field) => {
    const before = websites.slice(0, i);
    const after = websites.slice(i+1);
    const website = {...websites[i]};
    website[field] = v;

    editPost({meta: {contactWebsite: [...before, website, ...after] }});
  };
  const addNewWebsite = () => {
    editPost({meta: {contactWebsite: [...websites, {value: '', label: '', type: ''}]}});
  };
  const removeWebsite = (i) => {
    const before = websites.slice(0, i);
    const after = websites.slice(i+1);
    editPost({meta: {contactWebsite: [...before, ...after] }});
  };

  const getLinkIcon = (t) => {
    if ( t === 'phone' ) return 'ucd-public:fa-phone';
    if ( t === 'email' ) return 'ucd-public:fa-envelope';
    if ( t === 'appointment' ) return 'ucd-public:fa-calendar-check';
    return (websiteTypes.find( ({ value }) => value === t )).icon;
  }

  const modalSectionHeader = (title, onClick, buttonText="Add") => {
    return html`
      <div style=${{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'}}>
        <h2>${title}</h2>
        <${Button} variant="primary" onClick=${onClick}>${buttonText}</${Button}>
      </div>
    `;
  }

  const phoneSection = (() => html`
    <div>
    ${modalSectionHeader("Phone", addNewPhone)}
      ${phones.length > 0 ? html`
        <div style=${{display: 'table'}}>
          <div style=${{display: 'table-header-group'}}>
            <div style=${{display: 'table-row', fontWeight: '700'}}>
              <div style=${{display: 'table-cell', paddingBottom: '10px'}}>Number</div>
              <div style=${{display: 'table-cell'}}>Link Label (optional)</div>
              <div style=${{display: 'table-cell'}}></div>
            </div>
          </div>
          <div style=${{display: 'table-row-group'}}>
            ${phones.map((phone, i) => html`
              <div style=${{display: 'table-row'}} key=${i}>
                <div style=${{display: 'table-cell', paddingRight: '15px'}}>
                  <${TextControl} 
                    type="tel"
                    value=${phone.value}
                    onChange=${v => setPhone(v, i, 'value')}
                  />
                </div>
                <div style=${{display: 'table-cell', paddingRight: '15px'}}>
                  <${TextControl} 
                    value=${phone.label}
                    onChange=${v => setPhone(v, i, 'label')}
                  />
                </div>
                <div style=${{display: 'table-cell'}}>
                  <${Button} isDestructive=${true} onClick=${() => removePhone(i)} variant='link'>delete</${Button}>
                </div>                
              </div>
            `)}
          </div>
        </div>
      ` : html`
      <div>
        <${Text} isBlock=${true} variant="muted">You don't have any phone numbers listed</${Text}>;
      </div>
      `}
    </div>
  `)();

  const emailSection = (() => html`
  <div>
  ${modalSectionHeader("Email", addNewEmail)}
    ${emails.length > 0 ? html`
      <div style=${{display: 'table'}}>
        <div style=${{display: 'table-header-group'}}>
          <div style=${{display: 'table-row', fontWeight: '700'}}>
            <div style=${{display: 'table-cell', paddingBottom: '10px'}}>Address</div>
            <div style=${{display: 'table-cell'}}>Link Label (optional)</div>
            <div style=${{display: 'table-cell'}}></div>
          </div>
        </div>
        <div style=${{display: 'table-row-group'}}>
          ${emails.map((email, i) => html`
            <div style=${{display: 'table-row'}} key=${i}>
              <div style=${{display: 'table-cell', paddingRight: '15px'}}>
                <${TextControl} 
                  type="email"
                  value=${email.value}
                  onChange=${v => setEmail(v, i, 'value')}
                />
              </div>
              <div style=${{display: 'table-cell', paddingRight: '15px'}}>
                <${TextControl} 
                  value=${email.label}
                  onChange=${v => setEmail(v, i, 'label')}
                />
              </div>
              <div style=${{display: 'table-cell'}}>
                <${Button} isDestructive=${true} onClick=${() => removeEmail(i)} variant='link'>delete</${Button}>
              </div>                
            </div>
          `)}
        </div>
      </div>
    ` : html`
    <div>
      <${Text} isBlock=${true} variant="muted">You don't have any email addresses listed</${Text}>;
    </div>
    `}
  </div>
  `)();

  const websiteSection = (() => html`
  <div>
  ${modalSectionHeader("Websites", addNewWebsite)}
    ${websites.length > 0 ? html`
      <div style=${{display: 'table'}}>
        <div style=${{display: 'table-header-group'}}>
          <div style=${{display: 'table-row', fontWeight: '700'}}>
            <div style=${{display: 'table-cell'}}>Type</div>
            <div style=${{display: 'table-cell', paddingBottom: '10px'}}>URL</div>
            <div style=${{display: 'table-cell'}}>Link Label (optional)</div>
            <div style=${{display: 'table-cell'}}></div>
          </div>
        </div>
        <div style=${{display: 'table-row-group'}}>
          ${websites.map((website, i) => html`
            <div style=${{display: 'table-row'}} key=${i}>
              <div style=${{display: 'table-cell', paddingRight: '15px', verticalAlign: 'middle'}}>
                <${SelectControl} 
                  options=${websiteTypes}
                  value=${website.type}
                  onChange=${v => setWebsite(v, i, 'type')}
                />
              </div>
              <div style=${{display: 'table-cell', paddingRight: '15px'}}>
                <${TextControl} 
                  value=${website.value}
                  onChange=${v => setWebsite(v, i, 'value')}
                />
              </div>
              <div style=${{display: 'table-cell', paddingRight: '15px'}}>
                <${TextControl} 
                  value=${website.label}
                  onChange=${v => setWebsite(v, i, 'label')}
                />
              </div>
              <div style=${{display: 'table-cell'}}>
                <${Button} isDestructive=${true} onClick=${() => removeWebsite(i)} variant='link'>delete</${Button}>
              </div>                
            </div>
          `)}
        </div>
      </div>
    ` : html`
    <div>
      <${Text} isBlock=${true} variant="muted">You don't have any websites listed</${Text}>
    </div>
    `}
  </div>
  `)();

  return html`
  <div ...${ blockProps }>
    ${!hide && html`
    <div>
        ${hasContactInfo ? html`
          <ul className="list--pipe u-space-mb" onClick=${openModal}>
          ${emails.map(email => html`
              <${Fragment} key=${email.value}>
              ${email.value.length > 0 && html`
                <li><a className="icon-ucdlib">
                  <ucdlib-icon icon=${ getLinkIcon('email')}></ucdlib-icon><div>${email.label ? email.label : email.value}</div>
                </a></li>
                `}
              </${Fragment}>
            `)}
            ${phones.map(phone => html`
              <${Fragment} key=${phone.value}>
              ${phone.value.length > 0 && html`
                <li><a className="icon-ucdlib">
                  <ucdlib-icon icon=${ getLinkIcon('phone')}></ucdlib-icon><div>${getPhoneLabel(phone)}</div>
                </a></li>
                `}
              </${Fragment}>
            `)}
            ${appointment.length > 0 && html`
                <li><a className="icon-ucdlib">
                  <ucdlib-icon icon=${ getLinkIcon('appointment')}></ucdlib-icon><div>Book an Appointment</div>
                </a></li>
              `}
            ${websites.map(website => html`
              <${Fragment} key=${website.value}>
              ${website.value.length > 0 && html`
                <li><a className="icon-ucdlib">
                  <ucdlib-icon icon=${ getLinkIcon(website.type)}></ucdlib-icon><div>${website.label ? website.label : website.value}</div>
                </a></li>
                `}
              </${Fragment}>
            `)}
          </ul>
        ` : html`
          <ul className="list--pipe u-space-mb" onClick=${openModal}>
            <li className="icon icon--phone">Enter Your Contact Info</li>
          </ul>
        `}
        
      
      ${isOpen && html`
        <${Modal} title="Edit your contact info" onRequestClose=${ closeModal }>
          <div>
            ${phoneSection}
            <hr />
            ${emailSection}
            <hr />
            <div>
              <h2>Appointments</h2>
              <${TextControl} 
                value=${appointment}
                label="Appointment URL"
                onChange=${contactAppointmentUrl => editPost({meta: {contactAppointmentUrl}})}
              />
            </div>
            <hr />
            ${websiteSection}
          </div>
        </${Modal}>
      `}
    </div>
    `}
  </div>
  `
}