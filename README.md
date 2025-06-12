# Magical LLM Challenge By Taimur Hasan
This  explains how to use the project and outlines its features.

To run the base task, use the following command:

```bash
npm run dev
```

When this script is running, please dont move the mouse cursor or interact with the browser window. Playwright can be sensitive to interference. The script utilizes Claude 3.7 Sonnet Thinking for a action, which may require a short waiting period for the LLM to respond. This approach was chosen to create an "agent-like" behavior by avoiding hardcoded selectors.

The core of this project involves sending the entire HTML content of a webpage to an LLM to generate an action plan. This "agentic" methodology aims to address a common challenge in web scraping and automation website structure changes (e.g., updated IDs for input fields). By having the LLM analyze the live page, the script can theoretically adapt to such changes. This dynamic approach allows the system to, Fill in data based on the available fields, even if the provided data doesn't perfectly match the form.Handle forms where expected data fields are missing or new ones are present.
The goal is to create a robust and adaptable automation solution. And hopefully if the page changes it works. Note that the action plan the llm generated might be a bit off.

## API Workflow

The workflow can also be triggered via an API. To start the Express.js web server, run:

```bash
npm run start:api
```

Once the server is running, you can send a POST request to the `/workflow/medical-form` endpoint. This performs the same actions as `npm run dev`.

**Example API Call:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "medicalId": "91927885",
  "generate": false
}' http://localhost:3000/workflow/medical-form
```

## Data Generation Feature

The project includes a `generate` option. When set to `true`, the system will "hallucinate" (i.e., generate realistic-looking) patient information for any fields not provided in the request. This is based on a dynamic prompt and aims to fill in the form comprehensively.

**Example API Call with Data Generation:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "firstName": "Bob",
  "lastName": "Jones",
  "generate": true,
  "healthLevel": "Terrible"
}' http://localhost:3000/workflow/medical-form
```

**Example Generated Data Output:**
(Note: The output will be nearly identical each time as a dynamic seed for generation was not implemented.)
```json
{
  "firstName": "Bob",
  "lastName": "Jones",
  "dateOfBirth": "1990-01-01",
  "medicalId": "91927885",
  "gender": "Male",
  "bloodType": "B-",
  "allergies": [
    "Penicillin",
    "Sulfa drugs",
    "Latex",
    "Shellfish",
    "Peanuts",
    "Ibuprofen"
  ],
  "medications": [
    "Lisinopril 40mg daily",
    "Metformin 1000mg twice daily",
    "Atorvastatin 80mg daily",
    "Prednisone 10mg daily",
    "Albuterol inhaler as needed",
    "Gabapentin 300mg three times daily",
    "Oxycodone 10mg every 6 hours for pain",
    "Furosemide 40mg daily",
    "Levothyroxine 125mcg daily",
    "Insulin glargine 45 units at bedtime"
  ],
  "emergencyContact": "Sarah Jones (Wife)",
  "emergencyPhone": "555-123-4567"
}
```

## Scheduled Workflow Execution

To run the workflow on a schedule, the project uses a simple approach runs `main.ts` based on whatever is inputed in `config.ts`. So the default like `npm run dev`

To start the scheduler:
```bash
npm run start:scheduler
```

While more complex scheduling (e.g., API calls with specific parameters, or LLM-generated API calls) could be implemented, the current method prioritizes simplicity.

## Conclusion

This project successfully implements the core requirements. However, there are areas for improvement to enhance its "agentic" capabilities, The LLM selector identification process could be refined by adjusting model parameters (e.g., temperature) The current prompt for selector identification could be improved and A better model could be utilized

Retrospectively, an iterative agent loop—where selectors are found, verified, and then an action plan is executed—could offer more robust performance, as the current implementation occasionally fails on some demos. However, this approach would significantly increase API token consumption.

Overall, with additional research and experience, this type of project could be substantially improved.

Thank you for reviewing my work.  
-Taimur


# Magical LLM Challenge

## Overview

Welcome! We're excited to see you're interested in joining our team.

Today, you'll be working on a scoped down version of our autonomous automation platform.

Below you will find all the necessary information to complete the task. If you have any questions, please reach out to your contact at Magical.

Once you are complete, please put up the code in a **private** repository and add your contact at Magical as a collaborator (use their email to invite them).
> Please ensure you do not fork or open a pull request on this repository, put your solution in a private repository.


Time limit: this take-home is due 72hrs after you receive it.

### Task

Create a working agentic loop that will fill out an example healthcare workflow. Here is the SOP (standard operating procedure) for the workflow:

1. Navigate to https://magical-medical-form.netlify.app/
2. Fill out the form with:
   1. First Name: John
   2. Last Name: Doe
   3. Date of birth: 1990-01-01
   4. Medical ID: 91927885
3. Click 'Submit'

### Bonus Points

In this challenge there are a few bonus points, that'll help supercharge the agent.

1. Complete the 2nd and 3rd sections of the form. You will need to:
   1. Fill out dropdowns
   2. Scroll to, and open the appropriate sections
2. Add the ability to run the workflow via an API call
3. Add the ability to pass in variables for the prompt
   1. Think a dynamic "First Name" and "Last Name"
4. Make it so that this workflow can be run automatically on a schedule, every 5 minutes in this case.

### What's provided

We've provided you with a basic setup that will set you up for success. You're given:

1. An initiated playwright session
2. A model setup, with access to the Vercel AI SDK (what we use)

## Setup

### System Requirements

- Node.js 20+

### Your task

You are given a playwright page, and a model.

You need to write a script that will fill out a form on the page.


### Setup

Clone the repository

Install dependencies
```bash
npm install
```

Install playwright
```bash
npx playwright install
```

Create a `.env` file and add your Anthropic API key

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Running the script

```bash
npm run dev
```


