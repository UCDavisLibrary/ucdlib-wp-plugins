import { html, SelectUtils } from "@ucd-lib/brand-theme-editor/lib/utils";
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, Modal, Button, __experimentalText as Text } from '@wordpress/components';
import { useDispatch } from "@wordpress/data";
import { useState } from '@wordpress/element';

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
  const { editPost } = useDispatch( 'core/editor', [ hide, JSON.stringify(phones), JSON.stringify(emails) ] );

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

  return html`
  <div ...${ blockProps }>
    ${!hide && html`
    <div>
      <ul className="list--pipe u-space-mb" onClick=${openModal}>
        <li className="icon icon--phone">530-234-2233</li>
      </ul>
      ${isOpen && html`
        <${Modal} title="Edit your contact info" onRequestClose=${ closeModal }>
          <div>
            ${phoneSection}
            <hr />
            ${emailSection}
          </div>
        </${Modal}>
      `}
    </div>
    `}
  </div>
  `
}