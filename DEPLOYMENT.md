# Landing Page Deployment Guide

This landing page is configured to automatically deploy to GitHub Pages.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/03aar/03aar`
2. Click on **Settings** tab
3. In the left sidebar, click **Pages**
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
5. Save the settings

### 2. Automatic Deployment

Once GitHub Pages is enabled, the landing page will automatically deploy when you:
- Push to the `main` or `master` branch
- Manually trigger the workflow from the Actions tab

### 3. Access Your Website

After deployment completes (usually 1-2 minutes), your website will be available at:

```
https://03aar.github.io/03aar/
```

Or if you have a custom domain configured:
```
https://your-custom-domain.com
```

## Manual Deployment

You can manually trigger a deployment:

1. Go to the **Actions** tab in your repository
2. Click on "Deploy Landing Page to GitHub Pages"
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Troubleshooting

### Pages Not Showing Up?

1. **Check Actions**: Go to Actions tab and verify the workflow completed successfully
2. **Check Settings**: Ensure GitHub Pages is enabled in Settings → Pages
3. **Check Permissions**: The workflow needs write permissions for Pages
4. **Wait**: First deployment can take 5-10 minutes

### 404 Error?

- Make sure you're accessing the correct URL
- GitHub Pages URLs are case-sensitive
- Clear your browser cache

### Workflow Failing?

1. Check the Actions tab for error messages
2. Ensure GitHub Pages is enabled
3. Verify the repository is public (or you have GitHub Pro for private repos)

## Custom Domain (Optional)

To use a custom domain:

1. Go to Settings → Pages
2. Enter your custom domain under "Custom domain"
3. Add DNS records at your domain provider:
   - For apex domain (example.com): Add A records pointing to GitHub's IPs
   - For subdomain (www.example.com): Add CNAME record pointing to `03aar.github.io`

## Local Testing

To test the landing page locally:

```bash
# Using Python 3
python3 -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Node.js (if you have npx)
npx serve .
```

Then open: `http://localhost:8000`

## Files Structure

```
.
├── index.html          # Main landing page
├── styles.css          # Styling
├── script.js           # Interactive features
├── .nojekyll          # Disable Jekyll processing
└── .github/
    └── workflows/
        └── deploy.yml  # Deployment workflow
```

## Support

For issues with deployment:
- Check [GitHub Pages documentation](https://docs.github.com/en/pages)
- Review [GitHub Actions documentation](https://docs.github.com/en/actions)
