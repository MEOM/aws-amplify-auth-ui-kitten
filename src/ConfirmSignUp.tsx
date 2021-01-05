import React, {useEffect, useRef, useState} from 'react';
import { ConfirmSignUp as AmplifyConfirmSignUp } from 'aws-amplify-react-native'
import {KeyboardAvoidingView, Platform } from 'react-native';
import {Input, Layout, Button, Text} from '@ui-kitten/components';
import {AuthStyles} from "./styles";
import {ErrorMessage} from "./components/ErrorMessage";
import {UsernameInput, UsernameType} from "./components/UsernameInput";

const MyConfirmSignUp = ({error, goBack, confirmSignUp, usernameType, isUserNameNeeded}: ConfirmSignUpProps) => {
  const [confirmCode, setConfirmCode] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()
  const confirmationCodeRef = useRef<Input>(null)

  useEffect(() => {setErrorMessage(error)}, [error])

  const submit = () => {
    confirmSignUp(confirmCode)
  }

  return (
    <KeyboardAvoidingView style={{flex:1, justifyContent: 'center', alignItems: 'center'}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <Layout style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>

        <Text category={"h1"} style={AuthStyles.header}>Confirm Sign Up</Text>

        {isUserNameNeeded && <UsernameInput
          type={usernameType}
          size="large"
          textContentType="username"
          autoCompleteType="username"
          importantForAutofill="yes"
          autoCapitalize="none"
          returnKeyType="next"
          onChangeText={nextValue => {
            setErrorMessage(undefined)
            setConfirmCode(nextValue)
          }}
          onSubmitEditing={() => confirmationCodeRef.current?.focus()}
          style={AuthStyles.input} />}

        <Input
          label="Confirmation code"
          placeholder="Enter your confirmation code"
          ref={confirmationCodeRef}
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

interface ConfirmSignUpProps {
  error?: string
  goBack: () => void
  confirmSignUp: (code: string) => void
  usernameType: UsernameType
  isUserNameNeeded: boolean
}

export default class ConfirmSignUp extends AmplifyConfirmSignUp {
  showComponent(theme: any) {
    const { usernameAttributes = "username"} = this.props;

    return (<MyConfirmSignUp
      goBack={() => this.changeState('signIn')}
      error={this.state.error}
      confirmSignUp={code => this.setState({code, error: null}, this.confirm)}
      usernameType={usernameAttributes}
      isUserNameNeeded={this.getUsernameFromInput() === null}
    />)
  }
}
