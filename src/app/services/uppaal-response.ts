import { EdgeNode } from './edge-node';

export interface UppaalResponse {

  error: boolean;
  uppaalErrors: Array<string>;
  edgeNodes: Array<EdgeNode>;
  query: string;
}
