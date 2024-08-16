// If you want to register the transports only after initializing the agent, you can do this anywhere else in your app, and just leave out the agent config and initialization

import {View, Button} from 'react-native';
import { BleInboundTransport } from '@credo-ts/transport-ble';
import { agentDependencies } from '@credo-ts/react-native';
import React from 'react';
import {
  Agent,
  ConsoleLogger,
  LogLevel,
  MediationRecipientModule,
  MediatorPickupStrategy,
} from '@credo-ts/core';
import {
  Central,
  DEFAULT_DIDCOMM_SERVICE_UUID,
  DEFAULT_DIDCOMM_MESSAGE_CHARACTERISTIC_UUID,
  DEFAULT_DIDCOMM_INDICATE_CHARACTERISTIC_UUID
} from '@animo-id/react-native-ble-didcomm';
import { ariesAskar } from '@hyperledger/aries-askar-react-native';
import { AskarModule } from '@credo-ts/askar';

const App = () => {

  const createAgent = async () => {
    const agent = new Agent({
      dependencies: agentDependencies,
      config: {
        label: 'AgentInitiateExchange',
        walletConfig: {
          id: 'walletForAgentInitiateExchange',
          key: 'wallet-key',
        },
        logger: new ConsoleLogger(LogLevel.debug),
      },
      modules: {
        askar: new AskarModule({
          ariesAskar,
        }),

        mediationRecipient: new MediationRecipientModule({
          mediatorPickupStrategy: MediatorPickupStrategy.PickUpV2,
          mediatorInvitationUrl:
            'https://mediator.dev.animo.id/invite?oob=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMS4xL2ludml0YXRpb24iLCJAaWQiOiIyMDc1MDM4YS05ZGU3LTRiODItYWUxYi1jNzBmNDg4MjYzYTciLCJsYWJlbCI6IkFuaW1vIE1lZGlhdG9yIiwiYWNjZXB0IjpbImRpZGNvbW0vYWlwMSIsImRpZGNvbW0vYWlwMjtlbnY9cmZjMTkiXSwiaGFuZHNoYWtlX3Byb3RvY29scyI6WyJodHRwczovL2RpZGNvbW0ub3JnL2RpZGV4Y2hhbmdlLzEuMCIsImh0dHBzOi8vZGlkY29tbS5vcmcvY29ubmVjdGlvbnMvMS4wIl0sInNlcnZpY2VzIjpbeyJpZCI6IiNpbmxpbmUtMCIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHBzOi8vbWVkaWF0b3IuZGV2LmFuaW1vLmlkIiwidHlwZSI6ImRpZC1jb21tdW5pY2F0aW9uIiwicmVjaXBpZW50S2V5cyI6WyJkaWQ6a2V5Ono2TWtvSG9RTUphdU5VUE5OV1pQcEw3RGs1SzNtQ0NDMlBpNDJGY3FwR25iampMcSJdLCJyb3V0aW5nS2V5cyI6W119LHsiaWQiOiIjaW5saW5lLTEiLCJzZXJ2aWNlRW5kcG9pbnQiOiJ3c3M6Ly9tZWRpYXRvci5kZXYuYW5pbW8uaWQiLCJ0eXBlIjoiZGlkLWNvbW11bmljYXRpb24iLCJyZWNpcGllbnRLZXlzIjpbImRpZDprZXk6ejZNa29Ib1FNSmF1TlVQTk5XWlBwTDdEazVLM21DQ0MyUGk0MkZjcXBHbmJqakxxIl0sInJvdXRpbmdLZXlzIjpbXX1dfQ',
        }),
      },
    })

    // Instantiate the BLE controller you want
    const central = new Central()

    // It is important that you start the BLE controllers before you use/register them on your agent
    await central.start()

    /* IMPORTANT: Setting up the service, messaging and indication UUIDs. 
    The values passed must be the same in the central and peripheral, 
    as this is how both devices will be able to recognize each other. 
    There are default values for these that can be imported, 
    but if you want to maintain control over the sessions and/or prevent collisions 
    (due to multiple other devices broadcasting using these same values), 
    you might want to generate your own serviceUUID and share it across both mobile agents 
    (using a scannable QR code or something similar that allows easy sharing with little overhead)
    
    This can be done anywhere after starting the controller (step above), 
    even after registering the controller as a transport on the agent (step below) */

    const uuid = '56847593-40ea-4a92-bd8c-e1514dca1c61'
    await central.setService({
      serviceUUID: uuid || DEFAULT_DIDCOMM_SERVICE_UUID,
      messagingUUID: DEFAULT_DIDCOMM_MESSAGE_CHARACTERISTIC_UUID,
      indicationUUID: DEFAULT_DIDCOMM_INDICATE_CHARACTERISTIC_UUID,
    })

    // Registering the controller as a transport on the agent
    const bleInboundTransport = new BleInboundTransport(central)
    agent.registerInboundTransport(bleInboundTransport)

    await agent.initialize();
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Start Initiate State Agent" onPress={createAgent} />
      {/* <Text>Start Agent</Text> */}
    </View>
  );

};

export default App;