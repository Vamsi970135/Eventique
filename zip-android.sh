#!/bin/bash

# Create a zip file of the Android project
echo "Creating zip file of the Android project..."
zip -r event-ease-android.zip android

echo "Done! The zip file is created as event-ease-android.zip"
echo "Download this file to your local machine and extract it."
echo "Then open it in Android Studio and build the APK from there."