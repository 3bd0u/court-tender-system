#!/bin/bash
set -e

# Update system
apt-get update
apt-get upgrade -y

# Install dependencies
apt-get install -y \
    python3-pip \
    python3-venv \
    git \
    nginx \
    postgresql-client \
    awscli

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone application
cd /home/ubuntu
git clone https://github.com/3bd0u/court-tender-system.git
cd court-tender-system/backend

# Create environment file
cat > .env << EOF
FLASK_ENV=production
SECRET_KEY=${app_secret_key}
JWT_SECRET_KEY=${jwt_secret_key}
DATABASE_URL=postgresql://${db_username}:${db_password}@${db_host}/${db_name}
UPLOAD_FOLDER=/home/ubuntu/uploads
S3_BUCKET=${s3_bucket}
AWS_REGION=eu-west-3
EOF

# Create uploads directory
mkdir -p /home/ubuntu/uploads
chown -R ubuntu:ubuntu /home/ubuntu/uploads

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
pip install gunicorn boto3

# Initialize database
python init_db.py

# Create systemd service
cat > /etc/systemd/system/court-tender.service << 'SYSTEMD_EOF'
[Unit]
Description=Court Tender Management System
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/court-tender-system/backend
Environment="PATH=/home/ubuntu/court-tender-system/backend/venv/bin"
ExecStart=/home/ubuntu/court-tender-system/backend/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 run:app
Restart=always

[Install]
WantedBy=multi-user.target
SYSTEMD_EOF

# Configure Nginx
cat > /etc/nginx/sites-available/court-tender << 'NGINX_EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
NGINX_EOF

ln -sf /etc/nginx/sites-available/court-tender /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Start services
systemctl daemon-reload
systemctl enable court-tender
systemctl start court-tender
systemctl restart nginx

echo "Deployment complete!"