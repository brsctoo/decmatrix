"use client";

import style from "./InputField.module.css";
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
        <label>{label}</label>
        
        {info && (
        <div className={style.tooltipWrapper}>
          <span className={style.infoIcon}>i</span>
          <div className={style.tooltip}>
            {info}
          </div>
        </div>
        )}
      </div>

      <div className={style.inputFieldContainer}>
        <input
          {...props} 
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