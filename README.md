# Slack Approval Bot

A Slack bot that approves workflows. Users can request approvals from others, and approvers can approve or reject requests directly in Slack.

check the [Demo Video](https://drive.google.com/file/d/1quIpGTLLEvVFGsHvJcb9_FzzIWXLTf8D/view?usp=share_link)


## Features
- **Request Approvals**: Users can request approvals via the `/approval-test` slash command.
- **Approve/Reject Requests**: Approvers can approve or reject requests with buttons.
- **Notifications**: Requesters are notified when their requests are approved or rejected.

## Setup Instructions

### 1. Create a Slack App
1. Visit [Slack API](https://api.slack.com/apps) and click **Create New App**.
2. Follow the [Slack API Docs](https://api.slack.com/docs) to complete the App.

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/slack-approval-bot.git
cd slack-approval-bot
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Up Environment Variables
Create a `.env` file in the root directory with the following:
```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
PORT=3000
```

### 5. Run the Bot Locally
1. Start the bot:
   ```bash
   node app.js
   ```
2. Use `ngrok` to expose your local server or cloud server:
   ```bash
   ngrok http 3000
   ```
3. Update your Slack app’s **Request URL** for the slash command and interactivity to the ngrok URL (e.g., `https://your-ngrok-id.ngrok.io/slack/events`).

## Usage
1. **Trigger the Command**: In any Slack channel, type `/approval-test`. A modal will appear.
2. **Select Approver and Enter Request**: Choose an approver from the dropdown, enter your request in the text area, and click **Submit**.
3. **Approver Receives Request**: The approver gets a direct message with the request and "Approve" or "Reject" buttons.
4. **Requester Notification**: The requester receives a direct message with the approver’s decision.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
