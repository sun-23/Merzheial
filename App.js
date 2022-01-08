import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';

import { RootNavigator } from './navigation/RootNavigator';
import { AuthenticatedUserProvider } from './providers';

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <RecoilRoot>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </RecoilRoot>
    </AuthenticatedUserProvider>
  );
};

export default App;
