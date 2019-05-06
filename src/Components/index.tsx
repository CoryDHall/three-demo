import React, { useState } from 'react';
export * from './hooks';

interface InputProps {
  type: 'number' | 'text'
}
type _PInputProps = Partial<InputProps>
const DEFAULT_INPUT_PROPS: InputProps = {
  type: 'number'
}
type _Transformer = (v: string) => any
const VALUE_TRANSFORMERS: {
  [key: string]: _Transformer
} = {
  number: (v: string) => Number(v),
  text: (v: string) => v
}
export function useInputComponent<T>(initialValue: T, props?: _PInputProps): [T, React.ReactElement] {
  const [value, setValue] = useState(initialValue)
  const innerProps = Object.assign({ value: value.toString(), setValue }, DEFAULT_INPUT_PROPS, props)

  return [value, <TransformInput {...innerProps} />];
}

function _valueTransform({ type = 'number' }: _PInputProps): _Transformer {
  return VALUE_TRANSFORMERS[type]
}
interface TransformInputProps {
  type: 'number' | 'text'
  setValue(arg0: any): void
}
export const TransformInput: React.FC<TransformInputProps> = ({ setValue, ...props }) => {
  return (
    <input {
      ...{
        ...props,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          return setValue(_valueTransform(props)(e.target.value.toString()));
        }
      }
    } />
  );
}
