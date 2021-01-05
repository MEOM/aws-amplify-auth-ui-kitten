import React, {useEffect, useRef, useState} from 'react';
import { ForgotPassword as AmplifyForgotPassword } from 'aws-amplify-react-native'
import {KeyboardAvoidingView, Platform } from 'react-native';
import {Input, Layout, Button, Text} from '@ui-kitten/components';
import {AuthStyles} from "./styles";
import {UsernameInput, UsernameType} from "./components/UsernameInput";
import {ErrorMessage} from "./components/ErrorMessage";
import {PasswordInput} from "./components/PasswordInput";

const MyForgotPassword = ({resetPassword, usernameType, goBack, error}: ForgotPasswordProps) => {
  const [userName, setUserName] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {setErrorMessage(error)}, [error])

  const reset = () => resetPassword(userName)

  return (
    <KeyboardAvoidingView style={{flex:1, justifyContent: 'center', alignItems: 'center'}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <Layout style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>

        <Text category={"h1"} style={AuthStyles.header}>Reset your password</Text>

        <UsernameInput
          type={usernameType}
          defaultValue={userName}
          size="large"
          autoCompleteType="username"
          textContentType="username"
          autoCapitalize="none"
          returnKeyType="send"
          onChangeText={nextValue => {
            setErrorMessage(undefined)
            setUserName(nextValue)
          }}
          onSubmitEditing={reset}
          style={AuthStyles.input}
        />

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <Button size="large" appearance="outline" style={AuthStyles.button} onPress={reset}>Send</Button>

        <Button appearance="ghost" style={AuthStyles.button} onPress={goBack}>Back to Sign In</Button>
      </Layout>
    </KeyboardAvoidingView>
  )
}

const MyNewPassword = ({error, goBack, setNewPassword}: NewPasswordProps) => {
  const [confirmCode, setConfirmCode] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()
  const passwordRef = useRef<Input>(null)

  useEffect(() => {setErrorMessage(error)}, [error])

  const submit = () => {
    setNewPassword(confirmCode, password)
  }

  return (
    <KeyboardAvoidingView style={{flex:1, justifyContent: 'center', alignItems: 'center'}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <Layout style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>

        <Text category={"h1"} style={AuthStyles.header}>Set a new password</Text>

        <Input
          label="Verification code"
          placeholder="Enter the verification code"
          size="large"
          textContentType="oneTimeCode"
          importantForAutofill="yes"
          autoCapitalize="none"
          returnKeyType="next"
          keyboardType="number-pad"
          onChangeText={nextValue => {
            setErrorMessage(undefined)
            setConfirmCode(nextValue)
          }}
          onSubmitEditing={() => passwordRef.current?.focus()}
          style={AuthStyles.input}
        />

        <PasswordInput
          ref={passwordRef}
          label="New password"
          placeholder="Enter your new password"
          size="large"
          textContentType="newPassword"
          autoCapitalize="none"
          returnKeyType="next"
          onChangeText={nextValue => {
            setErrorMessage(undefined)
            setPassword(nextValue)
          }}
          onSubmitEditing={submit}
          style={AuthStyles.input}
        />

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <Button size="large" appearance="outline" style={AuthStyles.button} onPress={submit}>Submit</Button>

        <Button appearance="ghost" style={AuthStyles.button} onPress={goBack}>Back to Sign In</Button>
      </Layout>
    </KeyboardAvoidingView>
  )
}

interface ForgotPasswordProps {
  usernameType: UsernameType
  goBack: () => void
  resetPassword: (username: string) => void
  error?: string
}

interface NewPasswordProps {
  error?: string
  goBack: () => void
  setNewPassword: (code: string, password: string) => void
}

export default class ForgotPassword extends AmplifyForgotPassword {
  showComponent(theme: any) {
    const { usernameAttributes = "username"} = this.props;

    if (!this.state.delivery) {
      return (<MyForgotPassword
        usernameType={usernameAttributes}
        goBack={() => this.changeState('signIn')}
        error={this.state.error}
        resetPassword={username => {
          this.setState({username, phone_number: username, email: username, error: null}, this.send)
        }}
      />)
    } else {
      return (<MyNewPassword
        goBack={() => this.changeState('signIn')}
        error={this.state.error}
        setNewPassword={(code, password) => {
          this.setState({code, password}, this.submit)
        }}
      />)
    }
  }
}
