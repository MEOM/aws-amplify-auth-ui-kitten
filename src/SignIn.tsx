import React, {useEffect, useRef, useState} from 'react';
import { SignIn as AmplifySignIn } from 'aws-amplify-react-native'
import { KeyboardAvoidingView, Platform } from 'react-native';
import {Input, Layout, Button, Text} from '@ui-kitten/components';
import {AuthStyles} from "./styles";
import { UsernameInput, UsernameType } from './components/UsernameInput';
import {ErrorMessage} from "./components/ErrorMessage";
import {PasswordInput} from "./components/PasswordInput";

const MySigIn = ({forgotPassword, signIn, signUp, usernameType, error}: SignInProps) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()
  const passwordRef = useRef<Input>(null)

  useEffect(() => {
    setErrorMessage(error)
  }, [error])

  const login = () => {
    signIn(userName, password)
  }

  return (
    <KeyboardAvoidingView style={{flex:1, justifyContent: 'center', alignItems: 'center'}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <Layout style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>

        <Text category={"h1"} style={AuthStyles.header}>Sign in</Text>

        <UsernameInput
          type={usernameType}
          defaultValue={userName}
          size="large"
          autoCompleteType="username"
          textContentType="username"
          importantForAutofill="yes"
          autoCapitalize="none"
          returnKeyType="next"
          onChangeText={nextValue => {
            setErrorMessage(undefined)
            setUserName(nextValue)
          }}
          onSubmitEditing={() => passwordRef.current?.focus()}
          style={AuthStyles.input}
        />

        <PasswordInput
          ref={passwordRef}
          label="Password"
          placeholder="Enter your password"
          size="large"
          autoCompleteType="password"
          textContentType="password"
          importantForAutofill="yes"
          autoCapitalize="none"
          returnKeyType="done"
          onChangeText={nextValue => {
            setErrorMessage(undefined)
            setPassword(nextValue)
          }}
          onSubmitEditing={login}
          style={AuthStyles.input}
        />

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <Layout style={{flexDirection: "row"}}>
          <Button size="large" appearance="outline" style={AuthStyles.button} onPress={signUp}>Sign Up</Button>
          <Button size="large" style={AuthStyles.button} onPress={login}>Log In</Button>
        </Layout>

        <Button appearance="ghost" style={AuthStyles.button} onPress={forgotPassword}>Forgot password?</Button>
      </Layout>
    </KeyboardAvoidingView>
  )
}

interface SignInProps {
  signUp: () => void
  forgotPassword: () => void
  signIn: (username: string, password: string) => void
  usernameType: UsernameType
  error?: string
}

export default class SignIn extends AmplifySignIn {
  showComponent(theme: any) {
    const { usernameAttributes = "username"} = this.props;

    return (<MySigIn
      signUp={() => this.changeState("signUp")}
      forgotPassword={() => this.changeState("forgotPassword")}
      signIn={(username: string, password: string) => {
        this.setState({password, username, phone_number: username, email: username, error: null}, this.signIn)
      }}
      usernameType={usernameAttributes}
      error={this.state.error}
    />)
  }
}
