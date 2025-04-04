const { App } = require('@slack/bolt');
require('dotenv').config();

// Initializing the app
const app = new App({
  
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Requester Code
// approval-test command
app.command('/approval-test', async ({ command, ack, context }) => {
  await ack();

  try {
    // Opening of popup
    await app.client.views.open({
      token: context.botToken,
      trigger_id: command.trigger_id,
      view: {
        type: 'modal',
        // trigger the app.view event
        callback_id: 'approval_modal',
        title: {
          type: 'plain_text',
          text: 'Request Approval'
        },
        blocks: [
          {
            type: 'input',
            block_id: 'approver_block',
            element: {
              type: 'users_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select an approver'
              },
              action_id: 'approver_select'
            },
            label: {
              type: 'plain_text',
              text: 'Approver'
            }
          },
          {
            type: 'input',
            block_id: 'request_block',
            element: {
              type: 'plain_text_input',
              multiline: true,
              action_id: 'request_text'
            },
            label: {
              type: 'plain_text',
              text: 'Approval Request'
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
  } catch (error) {
    console.error('Error opening modal:', error);
  }
});

// Handle popup submit
app.view('approval_modal', async ({ ack, body, view, context }) => {
  await ack();

  const requester = body.user.id;
  const values = view.state.values;
  const approver = values.approver_block.approver_select.selected_user;
  const requestText = values.request_block.request_text.value;

  try {
    // Send the request
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: approver,
      text: `Approval request from <@${requester}>`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Approval Request from <@${requester}>*\n${requestText}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Approve'
              },
              style: 'primary',
              value: requester,
              action_id: 'approve_button'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Reject'
              },
              style: 'danger',
              value: requester,
              action_id: 'reject_button'
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error sending approval request:', error);
  }
});


// Approver Code
// Handle approve button 
app.action('approve_button', async ({ ack, body, context }) => {
  await ack();

  const approver = body.user.id;
  const requester = body.actions[0].value;
  const channel = body.channel.id;
  const ts = body.message.ts;

  try {
    // Update the message
    await app.client.chat.update({
      token: context.botToken,
      channel: channel,
      ts: ts,
      text: `Approval request from <@${requester}> - Approved by <@${approver}>`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Approval Request*\n${body.message.blocks[0].text.text}\n*Status:* Approved by <@${approver}>`
          }
        }
      ]
    });

    // Notify the requester
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: requester,
      text: `Your approval request has been approved by <@${approver}>`
    });
  } catch (error) {
    console.error('Error handling approval:', error);
  }
});

// Handle Reject button
app.action('reject_button', async ({ ack, body, context }) => {
  await ack();

  const approver = body.user.id;
  const requester = body.actions[0].value;
  const channel = body.channel.id;
  const ts = body.message.ts;

  try {
    // Update the message
    await app.client.chat.update({
      token: context.botToken,
      channel: channel,
      ts: ts,
      text: `Approval request from <@${requester}> - Rejected by <@${approver}>`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Approval Request*\n${body.message.blocks[0].text.text}\n*Status:* Rejected by <@${approver}>`
          }
        }
      ]
    });

    // Notify the requester
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: requester,
      text: `Your approval request has been rejected by <@${approver}>`
    });
  } catch (error) {
    console.error('Error handling rejection:', error);
  }
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Approval Bot is running on port', process.env.PORT || 3000);
})();