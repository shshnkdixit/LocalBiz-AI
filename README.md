# 🚀 LocalBiz AI — Your AI Side Hustle Assistant

**LocalBiz AI** is an open-source AI-powered business assistant designed to help small businesses, freelancers, and entrepreneurs create professional business content quickly and easily.

It helps users generate product descriptions, social media captions, business growth ideas, and pricing strategies using AI.

## ✨ Features

- 🛍️ **Product Descriptions:** Generate attractive product listings for your business.
- 📱 **Social Media Captions:** Create engaging captions for social media platforms.
- 💡 **Business Growth Ideas:** Discover new ideas to grow your business.
- 💰 **Pricing Strategies:** Get suggestions for pricing your products and services.
- 🎨 **Customizable Content:** Personalize outputs based on your target audience and preferred writing tone.
- 🤖 **AI Integration:** Supports local AI models through Ollama.
- 💾 **Save Your Creations:** Save and revisit previously generated content.
- 📋 **Copy to Clipboard:** Copy generated content with one click.
- 📱 **Responsive Design:** Works on desktop, tablet, and mobile screens.
- 🔓 **Open Source:** Built to make AI tools more accessible to small businesses.

## 🛠️ Tech Stack

- **HTML5** — Website structure
- **CSS3** — Styling and responsive UI
- **JavaScript** — Application logic and interactions
- **Ollama** — Local AI model integration
- **LocalStorage** — Saving generated content in the browser

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/LocalBiz-AI.git
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Open the Project

Navigate to the project folder:

```bash
cd LocalBiz-AI
```

Open `index.html` in your browser, or use the Live Server extension in VS Code.

### 3. Run in Demo Mode

You can explore the interface and try the built-in demo generation mode without configuring an AI model.

### 4. Enable Local AI with Ollama

1. Download and install Ollama from [https://ollama.com](https://ollama.com).
2. Download a supported model:

```bash
ollama pull llama3.2
```

3. Start the model:

```bash
ollama run llama3.2
```

4. Open LocalBiz AI and select the Ollama provider.
5. Ensure Ollama is running and your browser can access its API.

**Note:** Local AI integration may require appropriate Ollama API access and browser-origin configuration. Demo mode does not require a running AI model.

## 🎯 Who Is This For?

- Small business owners
- Freelancers
- Students exploring entrepreneurship
- Startup founders
- Content creators
- Anyone starting a side hustle

## 🌟 Why LocalBiz AI?

Many small businesses lack the time and resources to create professional marketing content. LocalBiz AI aims to simplify this process by providing an accessible interface for generating business ideas and marketing content, with the option to use local AI models.

## 🔮 Future Improvements

- [ ] Add more AI model options.
- [ ] Generate content in multiple languages.
- [ ] Add export options for PDF and text files.
- [ ] Improve product marketing suggestions.
- [ ] Add business profile customization.
- [ ] Introduce a secure backend for hosted AI inference.
- [ ] Add automated tests and accessibility improvements.

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository.
2. Create a feature branch.
3. Make your changes.
4. Commit and push your changes.
5. Open a Pull Request describing your contribution.

Please test your changes before submitting a pull request.

## 🔐 Privacy

Saved creations are stored in your browser using LocalStorage. When using a local AI model, prompts are sent to your configured Ollama service. Review the configuration before using the application with sensitive business information.

## 📄 License

This project is open source. Add a `LICENSE` file to specify the license under which others may use, modify, and distribute the project.

---

### 💙 Built for the Open-Source AI Challenge — Week 2: Side Hustle

**LocalBiz AI — Turn your business ideas into action with AI.**

If you find this project useful, consider giving the repository a ⭐ on GitHub!
