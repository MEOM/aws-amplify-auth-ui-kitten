import React, {useState} from 'react'
import {Icon, Input, InputProps} from "@ui-kitten/components";
import {TouchableWithoutFeedback} from "react-native";

export const PasswordInput = React.forwardRef<Input, PasswordInputProps>((props, ref) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props: any) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );

  return (
    <Input
      ref={ref}
      accessoryRight={renderIcon}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  )
})

export interface PasswordInputProps extends InputProps {}