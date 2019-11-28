import { MobileDevice } from './mobile-device';

export interface EdgeNode {

  id: number;
  name: string;
  mobileDeviceList: Array<MobileDevice>;
  message: number;

}
