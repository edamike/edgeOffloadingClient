import { EdgeNode } from './edge-node';
import { MobileDevice } from './mobile-device';
import { ComputationIntensity } from './computationIntensity';
import { Strategy } from './strategy';

export interface UppaalRequest {

  edgeNodeList: Array<EdgeNode>;
  allAvailableDevices: Array<MobileDevice>;
  strategy: Strategy;
  computationIntensity: ComputationIntensity;
  consideredTimeUnits: number;
  requiredRuns: number;
}
