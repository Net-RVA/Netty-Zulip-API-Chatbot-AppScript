
# Apps Script Guide: Create a ChatGPT AI Chatbot for Zulip

This repository contains the source code and instructions for setting up a ChatGPT-powered AI chatbot within the Zulip chat platform using Google Apps Script. This bot, designed to enhance team communication, can answer queries, provide information, and facilitate interactions in real-time.

## Features

- **Seamless Zulip Integration**: Configure your chatbot to work within any Zulip stream.
- **Intelligent Interactions**: Leverage ChatGPT's AI to generate context-aware responses.
- **Customizable Responses**: Adjust settings like response length and creativity to fit your team's needs.
- **Easy Deployment**: Set up your chatbot with minimal coding experience required.

## Getting Started

### Prerequisites

- A Zulip server or Zulip Cloud account
- Access to Google Apps Script
- An OpenAI API key

### Setup Instructions

1. **Clone the Repository**: Start by cloning this repository to your local machine or Google Drive.
   \`\`\`bash
   git clone https://github.com/yourusername/AppsScript-Zulip-ChatGPT-Bot.git
   \`\`\`

2. **Configure Zulip Credentials**: Edit the script to include your Zulip bot's email, API key, and domain.
   \`\`\`javascript
   var zulipBotEmail = "your-bot-email@zulipchat.com";
   var zulipBotApiKey = "your-zulip-api-key";
   var zulipDomain = "your-zulip-domain";
   \`\`\`

3. **Set Up OpenAI API Key**: Include your OpenAI API key for ChatGPT integration.
   \`\`\`javascript
   const apiKey = 'your-openai-api-key';
   \`\`\`

4. **Deploy the Script**: Follow the Apps Script deployment guide to deploy your script as a web app or bound script in Google Sheets or Docs.

5. **Test Your Bot**: Send a message in your Zulip stream and watch your new AI chatbot respond!

## Customization

- Adjust `maxTokens` and `temperature` in the script for different response lengths and variability.
- Modify the `streamName` variable to change which Zulip stream your bot listens to.

## Contributing

Contributions are welcome! Feel free to submit pull requests, suggest features, or report bugs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to OpenAI for the ChatGPT API.
- Hat tip to the Zulip community for their fantastic chat platform.
