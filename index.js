const Alexa = require('ask-sdk-core');

const STREAM_URL = 'https://cristalinacundinamarca.com/api/audio/';
const STREAM_TOKEN = 'cristalina-live';

function playStream(handlerInput) {
  return handlerInput.responseBuilder
    .speak('Abriendo Cristalina Estéreo.')
    .addAudioPlayerPlayDirective(
      'REPLACE_ALL',
      STREAM_URL,
      STREAM_TOKEN,
      0,
      null
    )
    .withShouldEndSession(true)
    .getResponse();
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    return playStream(handlerInput);
  }
};

const ReproducirIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'ReproducirIntent';
  },
  handle(handlerInput) {
    return playStream(handlerInput);
  }
};

const ResumeIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.ResumeIntent';
  },
  handle(handlerInput) {
    return playStream(handlerInput);
  }
};

const StopOrPauseIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.StopIntent' ||
       request.intent.name === 'AMAZON.CancelIntent' ||
       request.intent.name === 'AMAZON.PauseIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Dime "pon la radio" y empiezo a transmitir Cristalina Estéreo en vivo.')
      .reprompt('¿Quieres que ponga la radio?')
      .getResponse();
  }
};

const AudioPlayerEventHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope).startsWith('AudioPlayer.');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error: ${error.message}`);
    return handlerInput.responseBuilder
      .speak('Hubo un problema tratando de poner la radio.')
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ReproducirIntentHandler,
    ResumeIntentHandler,
    StopOrPauseIntentHandler,
    HelpIntentHandler,
    AudioPlayerEventHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
