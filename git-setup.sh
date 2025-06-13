#!/bin/bash

# === CONFIGURATION ===
GITHUB_USERNAME="HeroBala"
REPO_NAME="aframe-vr-game"
REPO_DESCRIPTION="A WebXR game built with A-Frame and Vite. Includes shooting, enemy AI, scoring, levels, and an immersive exploration experience."
PRIVATE=false

# === SETUP AUTH ===
AUTH_HEADER="Authorization: token $GITHUB_TOKEN"

# === GIT INIT ===
git init
git add .
git commit -m "🎮 Initial commit: base game structure"
git branch -M main

# === CREATE GITHUB REPO ===
curl -s -H "$AUTH_HEADER" \
     -d "{\"name\":\"$REPO_NAME\",\"description\":\"$REPO_DESCRIPTION\",\"private\":$PRIVATE}" \
     https://api.github.com/user/repos

# === CORRECT REMOTE ===
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git push -u origin main

# === FIXED ISSUE CREATION ===
echo "📋 Creating GitHub issues..."
declare -A ISSUES=(
  ["Add Shooting Mechanic"]="Implement shooter and bullet components. Player can click or press to shoot projectiles at enemies. Handle collisions."
  ["Create Enemy AI"]="Add moving enemies that react to player presence and die when hit."
  ["Implement Score System"]="Track score through a centralized manager. Display it in the UI."
  ["Add Pickup Items"]="Items give points or buffs when collected."
  ["Directional Hints"]="Guide players with arrows or glows toward objectives."
  ["Create UI/UX Overlay"]="Add in-game HUD and menus for pause/start/game over."
  ["Implement Level System"]="Manage game difficulty and transitions between levels."
  ["Add Restart Functionality"]="Enable game restart via button or key after game over."
  ["Optimize Performance"]="Use object pooling, low-poly models, and efficient loops."
)

for title in "${!ISSUES[@]}"; do
  body="${ISSUES[$title]}"
  curl -s -H "$AUTH_HEADER" \
       -d "{\"title\": \"${title}\", \"body\": \"${body}\"}" \
       https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME/issues
done

echo "✅ Repo pushed and all issues created on GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME/issues"
