#!/bin/bash
# Restore backup without OAuth

cd /home/cse/examseating
git checkout backup-no-oauth
vercel --prod --yes

echo "✅ Restored backup version without OAuth"
