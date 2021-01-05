import React from 'react'
import {Input, InputProps} from "@ui-kitten/components";

export const UsernameInput = (props: UsernameInputProps) => {
  switch (props.type) {
    case "email":
      return <Input
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        {...props} />
    case "phone_number":
      return <Input
        label="Phone number"
        placeholder="Enter you phone number"
        keyboardType="number-pad"
        {...props} />
    default:
      return <Input
        label="Username"
        placeholder="Enter your username"
        {...props} />
  }
}

export interface UsernameInputProps extends InputProps {
  type: UsernameType
}

export type UsernameType = "username" | "email" | "phone_number"
