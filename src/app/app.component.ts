import { Component, OnInit } from '@angular/core';
import { OffloadingApiService } from './services/offloading-api.service';
import { UppaalRequest} from './services/uppaal-request';
import { UppaalResponse } from './services/uppaal-response';
import { EdgeNode } from './services/edge-node';
import { Strategy } from './services/strategy';
import { ComputationIntensity } from './services/computationIntensity';
import { MobileDevice } from './services/mobile-device';
import { ListboxModule } from '../../node_modules/primeng/listbox';
import { MobileDeviceModel } from './mobile-device-model';
import { EdgeNodeModel } from './edge-node-model';
import {ButtonModule} from 'primeng/button';
import {SelectItem} from 'primeng/api';
import { empty } from '../../node_modules/rxjs';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import { TestObject } from 'protractor/built/driverProviders';
import {TableModule} from 'primeng/table';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import { Example } from './services/example';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'offloading-client';

  result: string;

  blockedPanel: boolean = false;

  mobileDevices: SelectItem[];
  selectedMobileDevices: MobileDevice[];

  edgeNodes: SelectItem[];
  selectedEdgeNodes: EdgeNode[];

  examples: SelectItem[];
  example: String[];

  mobileDevicesAss: SelectItem[];
  selectedMobileDevicesAss: string[];

  displayE = false;
  displayMD = false;

  edgeName: string;
  edgeId: number;

  mobileDeviceName: string;
  mobileDeviceId: number;

  numberUsers: number;
  numberEdges: number;

  uppaalRequestNew: UppaalRequest = {
                                      edgeNodeList: [],
                                      allAvailableDevices: [],
                                      strategy: null,
                                      computationIntensity: null,
                                      consideredTimeUnits: 0,
                                      requiredRuns: 0
                                    };
  
  uppaalRequestExample: UppaalRequest;

  uppaalResponse: UppaalResponse;

  edgeNodesResult: EdgeNode[];

  selectedSimulationMethod: string;
  selectedComputationMethod: string;

  consideredTimeUnits = 10;
  requiredRuns = 100;

  constructor(public dialog: DialogModule,
              public input: InputTextModule,
              public button: ButtonModule,
              public service: OffloadingApiService,
              public table: TableModule,
              public radio: RadioButtonModule,
              public serviceConf: ConfirmationService,
              public listbox: ListboxModule,
              public tooltip: TooltipModule,
              public matDivider: MatDividerModule) {}

  ngOnInit(): void {
    // this.startSimulation();
    console.log(this.mobileDevices);
    this.result = 'Results:';

    this.edgeNodes = [
      {label: 'edgeNode1', value: { id: 0, name: 'edgeNode1', mobileDeviceList: [], message: 0}},
      {label: 'edgeNode2', value: { id: 1, name: 'edgeNode2', mobileDeviceList: [], message: 0}},
    ];
    this.mobileDevices = [
      {label: 'MobileDevice1', value: { id: 0, name: 'mobileDevice1'}},
      {label: 'MobileDevice2', value: { id: 1, name: 'mobileDevice2'}},
      {label: 'MobileDevice3', value: { id: 2, name: 'mobileDevice3'}},
      {label: 'MobileDevice4', value: { id: 3, name: 'mobileDevice4'}},
      {label: 'MobileDevice5', value: { id: 4, name: 'mobileDevice5'}},
    ];
    this.mobileDevicesAss = [];

    this.examples = [
      /*
      {label: 'EUA - Melbourne Data small', value: 'MELBOURNE_METROPOLIAN_SMALL'},
      {label: 'EUA - Melbourne Data medium', value: 'MELBOURNE_METROPOLIAN_MEDIUM'},*/
      {label: 'EUA - Melbourne Data large', value: 'MELBOURNE_METROPOLIAN_LARGE'},
      {label: 'Synthetic Data Small', value: 'SYNTHETIC_EXAMPLE_SMALL'},
      {label: 'Synthetic Motivation Example', value: 'SYNTHETIC_EXAMPLE_MOTIVATING'},
    ];

    this.selectedSimulationMethod = Strategy[Strategy.STATIC];
    this.selectedComputationMethod = ComputationIntensity[ComputationIntensity.LOW];
  }

  clear() {
    let x = 0;
    this.edgeNodes.forEach( (ele) => {
      (this.edgeNodes[x].value as EdgeNode).mobileDeviceList = [];
      x++;
    });


    this.mobileDevicesAss = [];
  }

  startSimulation() {

    console.log(this.mobileDevices);

    this.uppaalRequestNew = {edgeNodeList: [],
      allAvailableDevices:[],
      strategy: Strategy[this.selectedSimulationMethod],
      computationIntensity: ComputationIntensity[this.selectedComputationMethod],
      consideredTimeUnits: this.consideredTimeUnits,
      requiredRuns: this.requiredRuns};
    this.edgeNodes.forEach( (ele) => {
      this.uppaalRequestNew.edgeNodeList = [...this.uppaalRequestNew.edgeNodeList, ele.value];

    });
    this.mobileDevices.forEach( (ele) => {
      this.uppaalRequestNew.allAvailableDevices = [...this.uppaalRequestNew.allAvailableDevices, ele.value];
    });
    this.uppaalRequestNew.strategy = Strategy[this.selectedSimulationMethod];

    console.log(this.uppaalRequestNew);
    this.blockedPanel = true;
    this.service.simulate(this.uppaalRequestNew).subscribe((data: {}) => {
      console.log(data);
      if((data as UppaalResponse).error)
      {
        this.result = 'Error: ';
        (data as UppaalResponse).uppaalErrors.forEach( (ele) => {
          this.result += ele + '\n';
        });

        this.blockedPanel = false;
      }
      else
      {
        this.result = 'Result: ';
        this.edgeNodesResult = [];
        (data as UppaalResponse).edgeNodes.forEach( (ele) => {
          this.result += ele.name + ' : ' + ele.message + '\n';
          this.edgeNodesResult = [...this.edgeNodesResult, ele];
        });

        
        this.blockedPanel = false;
      }
    });
  }
  handleClickMD() {
    this.mobileDeviceName = '';
    this.mobileDeviceId = this.findNextMobileId();
    this.displayMD = true;
  }

  findMobileDevices() {
    console.log(this.selectedEdgeNodes);
    let a: EdgeNode = this.selectedEdgeNodes[0];

    this.mobileDevicesAss = [];
    a.mobileDeviceList.forEach( (ele) => {
      this.mobileDevicesAss = [...this.mobileDevicesAss, {label: ele.name, value: ele}];
    });
  }

  setExample() {
    console.log(this.example);
  }

  addNewEdgeDevice() {
    console.log(this.edgeId);
    console.log(this.edgeName);
    this.edgeNodes = [...this.edgeNodes,
      {label: this.edgeName, value: {id: this.edgeId, name: this.edgeName, mobileDeviceList: [], message: 0}}];
    this.displayE = false;
  }

  findNextEdgeId() {
    let max = 0;
    this.edgeNodes.forEach( (ele) => {
        if (max < (ele.value as EdgeNode).id) {
          max = (ele.value as EdgeNode).id;
        }
    });

    return max + 1;
  }

  findNextMobileId() {

    let max = 0;
    this.mobileDevices.forEach( (ele) => {
        if (max < (ele.value as MobileDevice).id) {
          max = (ele.value as MobileDevice).id;
        }

    });

    return max + 1;
  }

  addNewMobileDevice() {
    console.log(this.mobileDeviceId);
    console.log(this.mobileDeviceName);
    this.mobileDevices = [...this.mobileDevices,
      {label: this.mobileDeviceName, value: {id: this.mobileDeviceId, name: this.mobileDeviceName}}];
    this.displayMD = false;
  }

  handleAddEdgeNode() {
    this.edgeName = '';
    this.edgeId = this.findNextEdgeId();
    this.displayE = true;
  }

  handleLoadExample() {
    this.edgeNodes = [];
    this.mobileDevices = [];

    /*
    if(this.example[0] === Example[Example.MELBOURNE_METROPOLIAN_SMALL])
    {
      this.numberUsers = 50;
      this.numberEdges = 5;
      this.example[0] = Example[Example.MELBOURNE_METROPOLIAN];
    }
    else if(this.example[0] === Example[Example.MELBOURNE_METROPOLIAN_MEDIUM]){
      this.numberEdges = 10;
      this.numberUsers = 100;
      this.example[0] = Example[Example.MELBOURNE_METROPOLIAN];
    }
    else */ if(this.example[0] === Example[Example.MELBOURNE_METROPOLIAN_LARGE]){
      this.numberEdges = 15;
      this.numberUsers = 100;
      this.example[0] = Example[Example.MELBOURNE_METROPOLIAN];
    }
    else {
      this.numberEdges = 0;
      this.numberUsers = 0;
    }
    this.service.loadExample(this.example, this.numberEdges, this.numberUsers).subscribe((data: {}) => {
      console.log(data);
      if(data as UppaalRequest)
      {
        this.result = 'Result: ';
        (data as UppaalRequest).edgeNodeList.forEach( (ele) => {

          this.edgeNodes = [...this.edgeNodes, { label: ele.name, 
            value: {id: ele.id, name: ele.name, mobileDeviceList: ele.mobileDeviceList, message: ele.message}}];
        });
        (data as UppaalRequest).allAvailableDevices.forEach( (ele) => {

          this.mobileDevices = [...this.mobileDevices, { label: ele.name, 
            value: {id: ele.id, name: ele.name}}];
        });
      }
    });
    this.mobileDevicesAss = [];

  }

  handleAddSelectedMobileDevice() {
    if(this.selectedEdgeNodes === undefined || this.selectedEdgeNodes.length === 0)
    {
      this.serviceConf.confirm({
        message: 'Please select a edge node!',
        accept: () => {
            //Actual logic to perform a confirmation
        }
    });

    }
    else if(this.selectedMobileDevices === undefined || this.selectedMobileDevices.length === 0)
    {
      this.serviceConf.confirm({
        message: 'Please select a mobile device!',
        accept: () => {
            //Actual logic to perform a confirmation
        }
    });
    }
    else {
      console.log(this.selectedMobileDevices);
      this.selectedMobileDevices.forEach( (element) => {
        let con = true;
        if (this.mobileDevicesAss === undefined || this.mobileDevicesAss.length == 0) {
          con = true;
        }
        this.mobileDevicesAss.forEach( (ele) => {
          if (ele.value === element) {
            con = false;
          }
        });
        let obj: MobileDevice = element;
        if (con) {
          this.mobileDevicesAss = [...this.mobileDevicesAss, {label: obj.name, value: obj}];
          this.selectedEdgeNodes[0].mobileDeviceList = [...this.selectedEdgeNodes[0].mobileDeviceList, obj];

        } else {
          this.serviceConf.confirm({
            message: 'Device already added!',
            accept: () => {
                //Actual logic to perform a confirmation
            }
        });
        }
      });
    }

  }
}
/*
const mobileDevice0: MobileDevice = {
  id: 0,
  name: 'mobileDevice0'
};

const mobileDevice1: MobileDevice = {
  id: 1,
  name: 'mobileDevice1'
};

const mobileDevice2: MobileDevice = {
  id: 2,
  name: 'mobileDevice2'
};

const edge0: EdgeNode = {
    id: 0,
    name: 'edge0',
    message: 20,
    mobileDeviceList: [
      mobileDevice0,
      mobileDevice1
    ]
};

const edge1: EdgeNode = {
  id: 1,
  name: 'edge1',
  message: 20,
  mobileDeviceList: [
    mobileDevice1,
    mobileDevice2
  ]
};

const uppaalRequest: UppaalRequest = {
  edgeNodeList: [
    edge0,
    edge1
  ],
  strategy: ''
};
*/
