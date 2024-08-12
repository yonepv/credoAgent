import {View, Button} from 'react-native';
import React from 'react';
import {
  Agent,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediationRecipientModule,
  MediatorPickupStrategy,
  WsOutboundTransport,
} from '@credo-ts/core';
import {agentDependencies} from '@credo-ts/react-native';
import {ariesAskar} from '@hyperledger/aries-askar-react-native';
import {AskarModule} from '@credo-ts/askar';

const App = () => {
  const startAgent = async () => {
    const agent = new Agent({
      dependencies: agentDependencies,
      config: {
        label: 'VerifierAgentTest1',
        walletConfig: {
          id: 'walletForTest1',
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
    });

    agent.registerOutboundTransport(new HttpOutboundTransport());
    agent.registerOutboundTransport(new WsOutboundTransport());

    await agent.initialize();
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Start Agent" onPress={startAgent} />
      {/* <Text>Start Agent</Text> */}
    </View>
  );
};

export default App;
