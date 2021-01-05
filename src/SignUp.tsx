import React, {createRef, useEffect, useRef, useState} from 'react';
import { SignUp as AmplifySignUp } from 'aws-amplify-react-native'
import { KeyboardAvoidingView, Platform } from 'react-native';
import {Input, Layout, Button, Text} from '@ui-kitten/components';
import {AuthStyles} from "./styles";
import {ErrorMessage} from "./components/ErrorMessage";
import {PasswordInput} from "./components/PasswordInput";

const MySignUp = ({fields, error, signUp, goBack, goConfirmCode}: SignUpProps) => {
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [phone_number, setPhoneNumber] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const inputRefs = useRef(Array.from(Array(fields.length).keys()).map(_ => createRef<Input>()))

  useEffect(() => {
    setErrorMessage(error)
  }, [error])

  useEffect(() => {
    setErrorMessage(undefined)
  }, [username, password, email, phone_number])

  const submit = () => {
    if (username && password && email && phone_number) {
      signUp({username, password, email, phone_number})
    } else {
      setErrorMessage("Fill all fields")
    }
  }

  const getInput = (field: SignUpField, index: number) => {
    const isLastInput = index === fields.length-1
    const ref = inputRefs.current[index]
    const nextRef = !isLastInput ? inputRefs.current[index + 1] : null

    const onSubmit = () => isLastInput ? submit() : nextRef?.current?.focus()

    switch (field) {
      case "username":
        return <Input
          key={field}
          ref={ref}
          label="Username"
          autoCapitalize="none"
          placeholder="Enter your username"
          textContentType="username"
          returnKeyType={isLastInput ? "done" : "next"}
          onChangeText={setUsername}
          onSubmitEditing={onSubmit}
          style={AuthStyles.input}
        />;
      case "email":
        return <Input
          key={field}
          ref={ref}
          label="Email address"
          placeholder="Enter your email address"
          textContentType="emailAddress"
          autoCompleteType="email"
          importantForAutofill="yes"
          autoCapitalize="none"
          returnKeyType={isLastInput ? "done" : "next"}
          onChangeText={setEmail}
          onSubmitEditing={onSubmit}
          style={AuthStyles.input}
        />;
      case "phone_number":
        return <Input
          key={field}
          ref={ref}
          label="Phone number"
          placeholder="Enter your phone number"
          textContentType="telephoneNumber"
          autoCompleteType="tel"
          keyboardType="phone-pad"
          importantForAutofill="yes"
          returnKeyType={isLastInput ? "done" : "next"}
          onChangeText={setPhoneNumber}
          onSubmitEditing={onSubmit}
          style={AuthStyles.input}
        />;
      case "password":
        return <PasswordInput
          key={field}
          ref={ref}
          label="Password"
          placeholder="Enter password"
          textContentType="newPassword"
          returnKeyType={isLastInput ? "done" : "next"}
          onChangeText={setPassword}
          onSubmitEditing={onSubmit}
          style={AuthStyles.input}
        />
    }
  }

  return (
    <KeyboardAvoidingView style={{flex:1, justifyContent: 'center', alignItems: 'center'}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <Layout style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>

        <Text category={"h1"} style={AuthStyles.header}>Sign Up</Text>

        {fields.map(getInput)}

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <Button size="large" appearance="outline" style={AuthStyles.button} onPress={submit}>Sign Up</Button>
        <Layout style={{flexDirection:"row"}}>
          <Button appearance="ghost" style={AuthStyles.button} onPress={goBack}>Back to Sign In</Button>
          <Button appearance="ghost" style={AuthStyles.button} onPress={goConfirmCode}>Confirm a Code</Button>
        </Layout>
      </Layout>
    </KeyboardAvoidingView>
  )
}

type SignUpField = "username" | "email" | "phone_number" | "password"

interface SignUpProps {
  fields: [SignUpField]
  error?: string
  signUp: (userInfo: {username: string, email: string, phone_number: string, password: string}) => void
  goBack: () => void
  goConfirmCode: () => void
}

export default class SignUp extends AmplifySignUp {
  showComponent(theme: any) {
    this.signUpFields = this.defaultSignUpFields;

    return (<MySignUp
      error={this.state.error}
      fields={this.signUpFields.map((field: any) => field.key)}
      signUp={userInfo => this.setState({...userInfo, error: null}, this.signUp)}
      goBack={() => this.changeState("signIn")}
      goConfirmCode={() => this.changeState("confirmSignUp")}
    />)
  }
}
