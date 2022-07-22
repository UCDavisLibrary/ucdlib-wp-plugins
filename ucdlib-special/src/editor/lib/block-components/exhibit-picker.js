import { html } from "@ucd-lib/brand-theme-editor/lib/utils";
import apiFetch from '@wordpress/api-fetch';
import { ComboboxControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { decodeEntities } from "@wordpress/html-entities";

function exhibitPicker({
  value,
  onChange,
  label
}){
  value = isNaN(parseInt(value)) ? 0 : parseInt(value);
  label = label || 'Exhibit';
  const [ options, setOptions ] = useState([]);
  const [ filteredOptions, setFilteredOptions ] = useState( options );

  useEffect(() => {
    const path = `ucdlib-special/exhibit`;
    apiFetch( {path} ).then( 
      (r) => {
        const o = r.map(e => {return {value: e.id, label: decodeEntities(e.title)}});
        setOptions(o);
        setFilteredOptions(o);
      }, 
      (error) => {
        console.error(error);
      }
    )
  }, [])

  
  const _onChange = (v) => {
    v = v || 0;
    v = parseInt(v);
    if ( onChange ) onChange(v);
  }


  return html`
    <${ComboboxControl} 
      label=${label}
      value=${value}
      options=${filteredOptions}
      onChange=${_onChange}
      onFilterValueChange=${ ( inputValue ) =>
				setFilteredOptions(
					options.filter( ( option ) =>
						option.label
							.toLowerCase()
							.startsWith( inputValue.toLowerCase() )
					)
				)
			}
    />
  `;
}

export default exhibitPicker;