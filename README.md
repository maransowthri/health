# HealthPath - AI-Powered Personal Health Journey

A static web application that provides personalized health recommendations including workout routines, diet plans, sleep schedules, and home equipment suggestions using OpenAI's GPT-4.

![HealthPath](https://img.shields.io/badge/HealthPath-AI%20Health%20Coach-emerald)

## Features

- **Personalized Questionnaire**: Collects user information including:
  - Basic info (age, gender, height, weight)
  - Health goals (lose weight, gain muscle, improve sleep, etc.)
  - Activity level
  - Sleep patterns
  - Dietary preferences
  - Lifestyle details

- **AI-Powered Recommendations**: Uses OpenAI GPT-4 to generate:
  - Weekly workout routines (home-based)
  - Customized diet plans with meal suggestions
  - Sleep optimization schedule
  - Home equipment recommendations with priority levels
  - Complete weekly schedule

- **Beautiful UI**: Modern, responsive design with:
  - TailwindCSS styling
  - Lucide icons
  - Smooth animations
  - Print-friendly layout

## Tech Stack

- HTML5
- CSS3 (TailwindCSS)
- Vanilla JavaScript
- OpenAI API (GPT-4) via Netlify Functions
- Netlify (hosting + serverless functions)

## Getting Started

### Prerequisites

- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Netlify account for deployment

### Local Development

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd health
   ```

2. Install Netlify CLI for local function testing:
   ```bash
   npm install -g netlify-cli
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

4. Run the development server with Netlify:
   ```bash
   netlify dev
   ```

5. Open `http://localhost:8888` in your browser

### Deployment to Netlify

#### Step 1: Deploy Your Site

**Option A: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Option B: Git Integration**
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
6. Click "Deploy site"

**Option C: Drag & Drop**
1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop the entire `health` folder
3. Your site is deployed (but functions won't work until you set up environment variables)

#### Step 2: Configure Environment Variables (Required!)

After deploying, you **must** add your OpenAI API key:

1. Go to your site's dashboard on Netlify
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add the following:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `sk-your-api-key-here`
5. Click **Save**
6. **Redeploy** your site for changes to take effect (Deploys → Trigger deploy)

## Usage

1. Open the website
2. Click "Begin Your Journey"
3. Answer all 6 questions honestly
4. Wait for your personalized health plan to generate
5. Browse through the different tabs (Overview, Workout, Diet, Sleep, Equipment, Weekly Schedule)
6. Print or download your plan for reference

## Security Notes

- The OpenAI API key is stored securely as a Netlify environment variable
- API calls are made server-side via Netlify Functions
- Users never see or interact with the API key

## Project Structure

```
health/
├── index.html                      # Main HTML file
├── styles.css                      # Custom CSS styles
├── app.js                          # Application logic
├── netlify.toml                    # Netlify configuration
├── netlify/
│   └── functions/
│       └── generate-plan.js        # Serverless function for OpenAI API
└── README.md                       # This file
```

## Customization

### Modifying Questions

Edit the `questions` array in `app.js` to add, remove, or modify questionnaire questions.

### Changing the AI Prompt

Modify the `buildPrompt()` function in `app.js` to adjust what information is sent to OpenAI.

### Styling

- Modify `styles.css` for custom styling
- TailwindCSS classes can be added directly in `index.html`

## License

MIT License - feel free to use this for personal or commercial projects.

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

Built with ❤️ for your health journey
