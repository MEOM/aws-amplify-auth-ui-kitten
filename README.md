# AWS-Amplify-Auth-UI-Kitten

[UI Kitten](https://github.com/akveo/react-native-ui-kitten) implementation fro [AWS Amplify](https://github.com/aws-amplify/amplify-js) authentication UI.

[![NPM](https://nodei.co/npm/aws-amplify-auth-ui-kitten.png?compact=true)](https://nodei.co/npm/aws-amplify-auth-ui-kitten/)

## Prerequisites

- Install UI Kitten, see [documentation](https://akveo.github.io/react-native-ui-kitten/docs/guides/getting-started#getting-started)
- Install and configure AWS Amplify Authetication for react native, see [documentation](https://docs.amplify.aws/start/q/integration/react-native) 

## Install

`yarn add aws-amplify-auth-ui-kitten`

## How to use

```
import { SignIn, SignUp, ConfirmSignUp, ConfirmSignIn, ForgotPassword, RequireNewPassword } from 'aws-amplify-auth-ui-kitten';
import { Authenticator } from 'aws-amplify-react-native';

export default () => {
  const [authState, setAuthState] = useState<string>()

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        {authState === 'signedIn' ? (<App />) : (
          <Authenticator
            onStateChange={setAuthState}
            hideDefault={true}
          >
            <SignIn />
            <ConfirmSignIn />
            <ConfirmSignUp />
            <ForgotPassword />
            <RequireNewPassword />
            <SignUp />
          </Authenticator>
        )}
      </ApplicationProvider>
    </>
  )
}
```

## License
[MIT](LICENSE) license.

---
Made with ❤️ by [MEOM](https://www.meom.fi)