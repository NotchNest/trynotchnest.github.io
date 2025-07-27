# NotchNest - Modern App Landing Page

A beautiful, modern, and responsive landing page template for macOS applications, featuring dynamic App Store API integration, glassmorphism design, and mobile-first responsive layout.

## 🌟 Features

- **Modern Design**: Clean, minimal aesthetic with glassmorphism effects and dark purplish theme
- **App Store Integration**: Automatically fetches app data (name, icon, description, version) from iTunes API
- **Responsive Layout**: Perfect on all devices - desktop, tablet, and mobile
- **Dynamic Content**: Real-time loading with skeleton animations
- **Privacy Policy Page**: Dedicated privacy policy page with consistent design
- **Performance Optimized**: Fast loading with caching and optimized assets
- **GitHub Pages Ready**: Zero-configuration deployment to GitHub Pages

## 🚀 Live Demo

Visit the live demo: [https://29satnam.github.io/trynotchnest](https://29satnam.github.io/trynotchnest)

## 📱 Screenshots

The website features:
- Hero section with app icon, name, and description
- Download buttons (App Store + Product Hunt)
- Video demo section
- Feature highlights with static content
- FAQ section
- Privacy policy page

## 🛠 Setup Instructions

### 1. Fork or Clone the Repository

```bash
git clone https://github.com/29satnam/trynotchnest.git
cd trynotchnest
```

### 2. Customize Your App Information

#### **Required Changes:**

**A. Update App Store ID** (Most Important!)

In both `index.html` and `privacy-policy.html`, find and replace:

```javascript
const APP_ID = "6747612321";
```

Replace `"6747612321"` with your actual App Store ID.

**How to find your App Store ID:**
1. Go to your app's App Store page
2. Look at the URL: `https://apps.apple.com/app/id[YOUR-APP-ID]`
3. Copy the number after `id`

**B. Update Product Hunt Link**

In `index.html`, find and replace:

```html
href="https://www.producthunt.com/"
```

Replace with your actual Product Hunt URL (or remove the button entirely if not using Product Hunt).

**C. Update Contact Email**

In both `index.html` and `privacy-policy.html`, find and replace:

```html
href="mailto:29satnam@gmail.com"
```
```html
29satnam@gmail.com
```

Replace with your actual contact email.

**D. Update Repository URL**

In `index.html`, find and replace:

```html
<meta property="og:url" content="https://codetard.github.io/trynotchnest" />
```

Replace with your GitHub Pages URL: `https://[YOUR-USERNAME].github.io/[YOUR-REPO-NAME]`

### 3. Customize Content (Optional)

#### **Static Content in Feature Section:**

In `index.html`, you can customize the feature list:

```html
<ul class="feature-list">
    <li>✨ Clean, minimal interface design</li>
    <li>⚡ Lightning-fast performance</li>
    <li>🔧 Extensive customization options</li>
    <li>🎯 Intuitive gesture controls</li>
</ul>
```

#### **FAQ Section:**

Update the FAQ questions and answers in `index.html`:

```html
<div class="faq-card">
    <h3 class="faq-question">Your question here?</h3>
    <p class="faq-answer">Your answer here</p>
</div>
```

#### **Privacy Policy:**

Update the privacy policy content in `privacy-policy.html` according to your app's actual privacy practices.

### 4. Replace Assets (Optional)

- **Favicon**: Replace `favicon.ico` with your app's favicon
- **Demo Video**: Replace `assets/notchnest-demo.mp4` with your app's demo video
- **Settings Image**: Replace `assets/notchnest-settings.png` with your app's screenshot
- **Rain Animation**: Replace `assets/rain.gif` if you want a different background animation

### 5. Deploy to GitHub Pages

#### **Method 1: Automatic Deployment**

1. Push your changes to the `main` branch
2. Go to your repository on GitHub
3. Navigate to Settings → Pages
4. Select "Deploy from a branch"
5. Choose `main` branch and `/ (root)` folder
6. Click Save

Your site will be available at: `https://[YOUR-USERNAME].github.io/[YOUR-REPO-NAME]`

#### **Method 2: Using GitHub Actions** (Already configured)

The repository includes `_config.yml` for Jekyll. GitHub Pages will automatically build and deploy when you push to main.

## 🎨 Customization Options

### **Color Scheme**

The website uses a dark purplish theme. To customize colors, edit `styles.css`:

```css
/* Main background gradient */
background: linear-gradient(135deg, #0a0a0f 0%, #1a0a1f 50%, #0f0a1a 100%);

/* Card backgrounds */
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### **Typography**

The website uses Inter font from Google Fonts. To change the font, update the Google Fonts link in the HTML head and the CSS font-family declarations.

### **Layout**

- **Desktop**: Side-by-side layout with ample spacing
- **Tablet**: Responsive grid with adjusted spacing
- **Mobile**: Stacked layout with centered elements

## 📋 Content Guidelines

### **App Description**

The website automatically shows:
- **Top section**: First sentence of your App Store description
- **Feature section**: Full description from App Store (hidden by default, shown when loaded)

### **Images**

- **App Icon**: Automatically fetched from App Store (512x512px)
- **Demo Video**: Should be in MP4 format, optimized for web
- **Settings Screenshot**: Recommended size 320x320px, PNG format

## 🔧 Technical Details

### **App Store API Integration**

The website uses iTunes Search API to fetch:
- App name and censored name
- App icon (512x512px)
- App description
- Version number
- Minimum OS version
- App Store URL

### **Caching**

- API responses are cached for 5 minutes in localStorage
- Reduces API calls and improves performance
- Graceful fallback if API is unavailable

### **Performance Features**

- Lazy loading for images
- CSS and JavaScript minification ready
- Optimized asset delivery
- Mobile-first responsive design
- Smooth animations with reduced motion support

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: CSS Grid, Flexbox, backdrop-filter, CSS variables

## 📱 Mobile Optimization

- Touch-friendly interface
- Optimized button sizes (minimum 44px)
- Responsive typography
- Optimized images for different screen densities
- Fast loading on slow connections

## 🔒 Privacy & Security

- No tracking or analytics by default
- No external dependencies except Google Fonts and iTunes API
- All data processing happens client-side
- HTTPS ready for secure deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you need help setting up the website:

1. Check the [Issues](https://github.com/29satnam/trynotchnest/issues) page
2. Create a new issue with your question
3. Contact: [29satnam@gmail.com](mailto:29satnam@gmail.com)

## 🎯 Quick Start Checklist

- [ ] Replace App Store ID with your app's ID
- [ ] Update contact email addresses
- [ ] Update Product Hunt link (or remove)
- [ ] Update repository URL in meta tags
- [ ] Customize FAQ section
- [ ] Replace demo video and screenshots
- [ ] Update privacy policy content
- [ ] Test locally before deploying
- [ ] Enable GitHub Pages in repository settings

---

**Made with ❤️ for the macOS developer community** 