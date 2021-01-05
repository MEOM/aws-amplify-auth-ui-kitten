import React, {useEffect, useRef, useState} from 'react';
import { RequireNewPassword as AmplifyRequireNewPassword } from 'aws-amplify-react-native'
import {KeyboardAvoidingView, Platform } from 'react-native';
import {Input, Layout, Button, Text} from '@ui-kitten/components';
import {AuthStyles} from "./styles";
import {ErrorMessage} from "./components/ErrorMessage";
import {PasswordInput} from "./components/PasswordInput";

const MyRequireNewPassword = ({error, goBack, setNewPassword}: RequireNewPasswordProps) => {
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()
  const passwordRef = useRef<Input>(null)

  useEffect(() => {setErrorMessage(error)}, [error])

  const submit = () => {
    setNewPassword(password)
  }

  return (
    <KeyboardAvoidingView style={{flex:1, justifyContent: 'center', alignItems: 'center'}} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <Layout style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>

        <Text category={"h1"} style={AuthStyles.header}>Set a new password</Text>

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

interface RequireNewPasswordProps {
  error?: string
  goBack: () => void
  setNewPassword: (password: string) => void
}

export default class RequireNewPassword extends AmplifyRequireNewPassword {
  showComponent(theme: any) {
      return (<MyRequireNewPassword
        goBack={() => this.changeState('signIn')}
        error={this.state.error}
        setNewPassword={password => this.setState({password}, this.submit)}
      />)
  }
}
