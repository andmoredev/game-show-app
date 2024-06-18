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
    apiKey: 'testApiKey',
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
