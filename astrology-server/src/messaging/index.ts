
import { PubSub } from "@google-cloud/pubsub"

const pubSubClient = new PubSub()

export const userTopic = pubSubClient.topic('projects/gifted-pulsar-279818/topics/project-1-demo-topic')

//call topic, or use funtion to get topics and search through them for the one we want, then set it to topic name
//see lightlyburinging demos