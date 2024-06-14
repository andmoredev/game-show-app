"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import {
  type ChatEvent,
  clearCurrentClient,
  EventTypes,
  sendMessage,
  subscribeToTopic,
  userJoined,
} from "../utils/momento-web";
import { Configurations, CredentialProvider, TopicClient, type TopicItem, type TopicSubscribe } from "@gomomento/sdk-web";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const topicClient = new TopicClient({
  configuration: Configurations.Browser.v1(),
  credentialProvider: CredentialProvider.fromString({
    apiKey: 'eyJlbmRwb2ludCI6ImNlbGwtdXMtZWFzdC0xLTEucHJvZC5hLm1vbWVudG9ocS5jb20iLCJhcGlfa2V5IjoiZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKemRXSWlPaUpoYm1SeVpYb3ViVzl5Wlc1dkxtMUFaMjFoYVd3dVkyOXRJaXdpZG1WeUlqb3hMQ0p3SWpvaVJXaDNTMGRvU1ZsRFFVVmhSV2R2VVZveVJuUmFXRTV2WWpOamRHRkhPWHBrUjJ4MVdubEpRU0lzSW1WNGNDSTZNVGN4T0RVeE56WXpOSDAuQkZua2oydEFwa0tKb0oxRFBiSWtGSHZzTlYydFhRbnJHT1ZKdGQtdy1OOCJ9',
  }),
});

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const resp = topicClient.subscribe(
      'gameshow-hosting',
      'testGameId', {
      onItem: (item) => {
        console.log('onItem', 'We did it!!!', item);
      },
      onError: (error) => {
        console.log('I ERRORED!!!!', error);
      },
    })
    .then(async () => {
      console.log("successfully subscribed");
    })
    .catch((e) => console.error("error subscribing to topic", e));
    }, []);

  function enableBuzzer() {
    topicClient.publish('gameshow-hosting', 'testGameId', JSON.stringify({
      type: 'buzz',
      playerId: 'player1',
    }));
  }

  return (
    <main>
      <button onClick={enableBuzzer}>Enable Buzzer</button>

      <div style={
        {
          backgroundColor: "red"
        }
      }>Bruuuuuuuce</div>
    </main>
  );
}
