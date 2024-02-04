// Secret variables for Zulip
var zulipBotEmail = "NeBo@demo.zulipchat.com";
var zulipBotApiKey = "ZZZzzzZZ-your-seceret-ZZzzz";
var zulipDomain = "Demo.zulipchat.com";
var streamName = "Netty AI";
var lastMessageId = -1;

// Configuration for OpenAI API
const apiKey = 'ZZZzzzZZ-your-seceret-ZZzzz'; // OpenAI API key
const apiUrl = 'https://api.openai.com/v1/chat/completions'; // OpenAI API URL

// 'maxTokens' sets the maximum number of tokens (words or pieces of words) that the AI response can contain. 
// Setting it to 800 allows the AI to generate longer responses, up to 800 tokens in length.
const maxTokens = 800;

// 'temperature' controls the randomness of the AI's responses. A value of 0.9 encourages more creative and varied responses. 
// Lower values make the AI's responses more deterministic and predictable, while higher values make them more diverse.
const temperature = 0.9;

// Optional
function subscribeToStream() {
  var apiUrl = "https://" + zulipDomain + "/api/v1/users/me/subscriptions";
  var options = {
    method: "POST",
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(zulipBotEmail + ":" + zulipBotApiKey)
    },
    payload: {
      subscriptions: JSON.stringify([{ name: streamName }])
    }
  };
  UrlFetchApp.fetch(apiUrl, options);
}

function pollZulipStream() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var lastMessageId = parseInt(scriptProperties.getProperty("lastMessageId")) || 0;

  var apiUrl = "https://" + zulipDomain + "/api/v1/messages";
  apiUrl += "?anchor=newest&num_before=5&num_after=0";
  apiUrl += "&narrow=" + encodeURIComponent(JSON.stringify([{ operator: "stream", operand: streamName }]));

  var options = {
    method: "GET",
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(zulipBotEmail + ":" + zulipBotApiKey)
    }
  };

  var response = UrlFetchApp.fetch(apiUrl, options);
  var messages = JSON.parse(response.getContentText()).messages;

// This code block processes messages from a Zulip stream in reverse order, starting with the most recent.
// It skips any messages sent by the bot itself or messages that contain the word "trivia" to avoid processing unnecessary content.
// For each relevant message, it checks if the message ID is greater than the last processed message ID to avoid reprocessing messages.
// If the message is new, it updates the 'lastMessageId' with the current message's ID to keep track of the last processed message.
// It then constructs a question using the message content, calls the OpenAI API (via the 'callChatGptApi' function) to generate an answer,
// and formats the answer by prefixing it with the sender's name in bold.
// Finally, it sends the generated answer back to the same Zulip stream and topic from which the original message came.
  for (var i = messages.length - 1; i >= 0; i--) {
    var message = messages[i];
    if (message.sender_email === zulipBotEmail || message.content.includes("trivia")) {
      continue;
    }

    if (message.id > lastMessageId) {
      lastMessageId = message.id;
      scriptProperties.setProperty("lastMessageId", lastMessageId.toString());

      var senderName = message.sender_full_name;
      var question = "Question:" + message.content;
      var answer = callChatGptApi(question);
      answer = "**" + senderName + "** " + answer;
      var topic = message.subject;
      sendZulipMessage(answer, streamName, topic);
    }
  }
}

function processZulipMessages() {
  subscribeToStream();
  pollZulipStream();
}

function callChatGptApi(question) {
  var prompt = question;
  var model = 'gpt-3.5-turbo';
  var payload = {
    model: model,
    messages: [
      { role: 'system', content: 'Your name is Netty and you are a Zulip chat assistant.' },
      { role: 'user', content: prompt }
    ],
    temperature: temperature,
    max_tokens: maxTokens,
  };

  var options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload),
  };

  var response = UrlFetchApp.fetch(apiUrl, options);
  var jsonResponse = JSON.parse(response.getContentText());
  var answer = jsonResponse.choices[0].message.content.trim();

  return answer;
}

function sendZulipMessage(answer, streamName, topic) {
  var apiUrl = 'https://' + zulipDomain + '/api/v1/messages';

  var options = {
    method: 'post',
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(zulipBotEmail + ':' + zulipBotApiKey),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    payload: {
      type: 'stream',
      to: streamName,
      topic: topic,
      content: answer,
    },
  };

  UrlFetchApp.fetch(apiUrl, options);
}

