# Deployment Guide: Raspberry Pi + Nginx

This guide covers how to deploy your portfolio to a Raspberry Pi for self-hosting.

## Prerequisites

- Raspberry Pi (any model with network access)
- Raspberry Pi OS installed
- SSH access to your Pi
- Your development machine has rsync installed

## One-Time Pi Setup

### 1. Install Nginx

```bash
# SSH into your Pi
ssh pi@raspberrypi.local

# Update packages and install nginx
sudo apt update && sudo apt upgrade -y
sudo apt install nginx -y

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Create the Web Directory

```bash
# Create directory for your portfolio
sudo mkdir -p /var/www/portfolio
sudo chown -R pi:pi /var/www/portfolio
```

### 3. Configure Nginx

Create the nginx config:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name raspberrypi.local;  # Or your Pi's IP/domain
    root /var/www/portfolio;
    index index.html;

    # Handle Next.js static export paths
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Cache static assets aggressively
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache images
    location ~* \.(jpg|jpeg|png|gif|ico|webp|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## Deploying Updates

### Quick Deploy (from your development machine)

```bash
# Build and deploy in one command
npm run deploy
```

This will:
1. Build the static site
2. Rsync files to your Pi

### Manual Deploy

```bash
# Build locally
npm run build

# Copy to Pi
rsync -avz --delete out/ pi@raspberrypi.local:/var/www/portfolio/
```

## Updating Project Data

### From Google Sheets

1. Open your Google Sheets project tracker
2. Go to **File → Download → Comma Separated Values (.csv)**
3. Save as `data/projects.csv` in this project
4. Run the converter:

```bash
npm run convert-data
```

5. Deploy:

```bash
npm run deploy
```

### Full Workflow

```bash
# After exporting CSV from Google Sheets
npm run convert-data && npm run deploy
```

## Google Drive Images

For images hosted on Google Drive:

1. Upload image to Google Drive
2. Right-click → Share → "Anyone with the link"
3. Copy the share link
4. The CSV converter will automatically convert URLs like:
   - `https://drive.google.com/file/d/ABC123/view?usp=sharing`
   - To: `https://drive.google.com/uc?id=ABC123`

## Accessing Your Portfolio

- **Local network**: `http://raspberrypi.local` or `http://<pi-ip-address>`
- **Custom domain**: Set up port forwarding and a domain (optional)

## Troubleshooting

### Can't connect to Pi
```bash
# Find Pi's IP address
ping raspberrypi.local

# Or scan your network
arp -a | grep raspberry
```

### Permission denied on deploy
```bash
# Ensure you have SSH key set up
ssh-copy-id pi@raspberrypi.local
```

### Nginx not serving files
```bash
# Check nginx status
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log

# Verify file permissions
ls -la /var/www/portfolio/
```

### Images not loading from Google Drive
- Ensure sharing is set to "Anyone with the link"
- Check browser console for CORS errors
- Google Drive has rate limits; for heavy traffic, consider Cloudinary

## Performance Tips

1. **Enable HTTP/2** (requires HTTPS)
2. **Use Cloudflare** as a CDN for global access
3. **Optimize images** before uploading to Google Drive
4. **Consider adding** a service worker for offline support

