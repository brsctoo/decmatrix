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

  // Valores padrão para o select (caso não sejam passados)
  selectValue = "",
  onSelectChange = () => {}, // Função vazia como padrão
  selectOptions = [], // Se não passar nada, é uma lista vazia
  },
) {

  const { locale } = useParams();

  // Verifica se existem opções para decidir se mostra o select ou não
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
        
        {/* Exibe o ícone de informação se a prop info for fornecida */}
        {info && (
        <div className={style.tooltipWrapper}>
          <span className={style.infoIcon}>i</span>
          <div className={style.tooltip}>
            {info}
          </div>
        </div>
        )}

      </div>

      {/* 
        Input é onde você digita o valor 
        - label é o texto que aparece acima do input
        - name é o nome do input
        - type é o tipo do input (número, texto, etc)
        - value é o valor atual do input
        - placeholder é o texto que aparece quando o input está vazio
        - onChange é a função que é chamada quando o valor do input muda -> "e" é o evento, e.target.value é o novo valor do input
      */}
      
      <div className={style.inputFieldContainer}>
        <input
        className={inputClassName}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        data-kind={kind}
        info={info}
        autoComplete="off"
        />

        {/* O Select Dinâmico */}
        {/* Renderiza o select e uma divisória APENAS se houver opções */}
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