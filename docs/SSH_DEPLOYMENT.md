# SSH Deployment Setup Guide

This guide helps you set up SSH key authentication for automated deployment to Hostinger.

## 🔑 SSH Key Setup

### Step 1: Generate SSH Key (if you don't have one)

```bash
# Generate a new SSH key
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# When prompted, you can press Enter to use the default location
# ~/.ssh/id_rsa (recommended)
```

### Step 2: Copy SSH Key to Hostinger

```bash
# Copy your public key to the server
ssh-copy-id -p 65002 u468045938@147.93.109.69
```

**Alternative method if ssh-copy-id doesn't work:**

1. Copy your public key content:
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

2. Manually add it to the server:
   ```bash
   ssh -p 65002 u468045938@147.93.109.69
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

### Step 3: Test SSH Connection

```bash
# Test the connection
ssh -p 65002 u468045938@147.93.109.69

# You should be able to connect without entering a password
```

## 🚀 Deployment Usage

Once SSH keys are set up, you can deploy using:

```bash
# From the frontend directory
npm run deploy:ssh
```

Or from the root directory:

```bash
# Run the script directly
./scripts/deploy/deploy-ssh.sh
```

## 🔧 SSH Configuration

### Server Details

- **Host**: 147.93.109.69
- **Port**: 65002
- **Username**: u468045938
- **Deploy Path**: domains/thinkred.tech/public_html

### SSH Config File (Optional)

You can create a `~/.ssh/config` entry for easier connection:

```
Host hostinger-thinkred
    HostName 147.93.109.69
    Port 65002
    User u468045938
    IdentityFile ~/.ssh/id_rsa
```

Then you can connect with: `ssh hostinger-thinkred`

## 📋 What the SSH Deployment Script Does

1. **🔗 Tests SSH connection** - Verifies you can connect to the server
2. **🧹 Cleans local build** - Removes previous build artifacts
3. **📦 Installs dependencies** - Ensures all packages are up to date
4. **🔍 Runs checks** - TypeScript checking and linting
5. **🏗️ Builds project** - Creates production build
6. **📁 Prepares files** - Optimizes files for deployment
7. **💾 Creates backup** - Backs up existing files on server
8. **🗑️ Clears old files** - Removes old deployment files
9. **📤 Uploads files** - Transfers new files via SCP
10. **🔐 Sets permissions** - Ensures proper file permissions
11. **🔍 Verifies deployment** - Confirms successful deployment

## 🛡️ Security Features

- **SSH key authentication** - No passwords stored or transmitted
- **Automatic backups** - Creates timestamped backups before deployment
- **Permission management** - Sets secure file permissions (644/755)
- **Selective cleanup** - Preserves important server files (.htaccess, etc.)

## 🐛 Troubleshooting

### SSH Connection Issues

1. **Permission denied (publickey)**
   ```bash
   # Check if your SSH key is loaded
   ssh-add -l
   
   # If empty, add your key
   ssh-add ~/.ssh/id_rsa
   ```

2. **Connection timeout**
   - Check if port 65002 is open
   - Verify the server IP address
   - Try connecting from a different network

3. **Host key verification failed**
   ```bash
   # Remove old host key and try again
   ssh-keygen -R [147.93.109.69]:65002
   ```

### Deployment Issues

1. **Build failures** - Check TypeScript errors and linting issues
2. **Permission errors** - Ensure you have write access to /public_html
3. **File upload errors** - Check network connectivity and server disk space

## 💡 Tips

- **Test manually first**: Always test SSH connection manually before running deployment
- **Monitor disk space**: Check server disk usage regularly
- **Keep backups**: The script creates automatic backups, but consider additional backup strategies
- **Use staging**: Test deployments on a staging environment first

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Test SSH connection manually: `ssh -p 65002 u468045938@147.93.109.69`
3. Verify server access and permissions
4. Check network connectivity

For Hostinger-specific SSH issues, consult [Hostinger's SSH documentation](https://support.hostinger.com/en/articles/1583227-how-to-use-ssh).
