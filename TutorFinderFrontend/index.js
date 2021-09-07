/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Wrapper from './AppWrapper';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Wrapper);
