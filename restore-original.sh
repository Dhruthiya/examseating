#!/bin/bash
# Restore to original working version

echo "🔄 Restoring to original working version..."

cd /home/cse/examseating
git checkout original-working-version
git reset --hard v1.0-original

echo "✅ Restored to original version!"
echo "🚀 Deploying to Vercel..."

vercel --prod --yes

echo "✅ Done! Check: https://examseating-silk.vercel.app"
