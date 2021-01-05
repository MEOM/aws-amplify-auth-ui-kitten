import React, {useEffect, useRef, useState} from 'react';
import { ConfirmSignIn as AmplifyConfirmSignIn } from 'aws-amplify-react-native'
import {KeyboardAvoidingView, Platform } from 'react-native';
import {Input, Layout, Button, Text} from '@ui-kitten/components';
import {AuthStyles} from "./styles";
import {ErrorMessage} from "./components/ErrorMessage";

const MyConfirmSignIn = ({error, goBack, confirmSignIn}: ConfirmSignInProps) => {
  const [confirmCode, setConfirmCode] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()
  const confirmationCodeRef = useRef<Input>(null)

  useEffect(() => {setErrorMessage(error)}, [error])

  const submit = () => {
    confirmSignIn(confirmCode)
  }

  return (
    <KeyboardAvoidingView style={{flex:1, justifyContent: 'center', alignItems: 'center'}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <Layout style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>

        <Text category={"h1"} style={AuthStyles.header}>Confirm Sign In</Text>

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

interface ConfirmSignInProps {
  error?: string
  goBack: () => void
  confirmSignIn: (code: string) => void
}

export default class ConfirmSignIn extends AmplifyConfirmSignIn {
  showComponent(theme: any) {
    return (<MyConfirmSignIn
      goBack={() => this.changeState('signIn')}
      error={this.state.error}
      confirmSignIn={code => this.setState({code, error: null}, this.confirm)}
    />)
  }
}
