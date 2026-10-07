"use client";

import style from "./InputField.module.css";
import { useId, useState } from 'react';
import { useParams } from 'next/navigation'; 

function InputField({
  label =  "",
  children,
  name = "",
  kind = "",
  value,
  onChange,
  placeholder,
  type = "number",
  info = "",
  hasSpinButtons = "false",

  selectValue = "",
  onSelectChange = () => {}, 
  selectOptions = [], 
  ...props 
  }) {

  const { locale } = useParams();
  const inputId = useId();
  const [infoOpen, setInfoOpen] = useState(false);

  const hasSelect = selectOptions.length > 0;

  const baseInputClass =
    kind === "money"
      ? `${style.inputField} ${locale === 'pt' ? style.inputFieldMoneyReal : style.inputFieldMoneyDolar}`
      : style.inputField;

  const inputClassName = hasSelect
    ? `${baseInputClass} ${style.inputWithTail}`
    : baseInputClass;
  
  return (
    <div>
      <div className={style.labelRow}>
        <label htmlFor={props.id || inputId}>{label}</label>
        
        {info && (
        <div className={style.tooltipWrapper}>
          <button type="button" className={style.infoIcon} aria-label={info}
            aria-expanded={infoOpen} aria-controls={`${inputId}-info`}
            onClick={() => setInfoOpen(open => !open)}
            onKeyDown={(event) => { if (event.key === 'Escape') setInfoOpen(false); }}>i</button>
          <div id={`${inputId}-info`} className={`${style.tooltip}${infoOpen ? ` ${style.tooltipOpen}` : ''}`}>
            {info}
          </div>
        </div>
        )}
      </div>

      <div className={style.inputFieldContainer}>
        <input
          {...props} 
          id={props.id || inputId}
          className={inputClassName}
          data-spin={hasSpinButtons}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          data-kind={kind}
          autoComplete="off"
        />

        {hasSelect && (
          <>
            <select
              name={name + "_select"}
              aria-label={label}
              className={style.selectInside} 
              value={selectValue}
              onChange={(e) => onSelectChange(e.target.value)}
            >
              {selectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        )}

        {children}
      </div>
    </div>
  );
}

export default InputField;
