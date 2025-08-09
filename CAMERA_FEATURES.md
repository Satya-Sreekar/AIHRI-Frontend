# Camera Features & Troubleshooting Guide

## Overview
The HR Interview Dashboard includes advanced camera functionality for video interviews. This guide covers camera features, troubleshooting, and best practices.

## Camera Features

### ✅ Supported Features
- **Multi-camera support**: Switch between available cameras
- **Real-time video streaming**: High-quality video with configurable settings
- **Audio controls**: Mute/unmute functionality
- **Error handling**: Comprehensive error detection and recovery
- **Retry functionality**: Easy camera restart when issues occur
- **Debug information**: Real-time status and error reporting

### 🔧 Technical Specifications
- **Video Quality**: Up to 1280x720 resolution
- **Frame Rate**: 30 FPS (ideal), 15 FPS (minimum)
- **Audio**: Microphone support with mute controls
- **Browser Support**: Chrome, Firefox, Safari, Edge

## Troubleshooting Camera Issues

### Common Issues & Solutions

#### 1. "Camera permission denied"
**Symptoms**: Camera shows error about permission denied
**Solutions**:
- Click the camera icon in your browser's address bar
- Select "Allow" for camera access
- Refresh the page and try again
- Check browser settings for camera permissions

#### 2. "No camera found"
**Symptoms**: Error indicating no camera is available
**Solutions**:
- Ensure your camera is properly connected
- Check if camera is being used by another application
- Try disconnecting and reconnecting your camera
- Restart your browser

#### 3. "Camera is in use by another application"
**Symptoms**: Camera shows as busy or unavailable
**Solutions**:
- Close other applications using the camera (Zoom, Teams, etc.)
- Check Task Manager for camera-using processes
- Restart your computer if needed

#### 4. "Camera does not support requested settings"
**Symptoms**: Camera fails to start with specific settings
**Solutions**:
- The system will automatically retry with default settings
- Click "Retry Camera" button if available
- Try selecting a different camera if multiple are available

### Step-by-Step Troubleshooting

#### Step 1: Check Browser Permissions
1. Look for camera icon in browser address bar
2. Click the icon and select "Allow"
3. Refresh the page

#### Step 2: Test Camera Access
1. Navigate to "Test Camera" page (available in HR dashboard)
2. Check debug information for camera status
3. Try different cameras if available

#### Step 3: Browser-Specific Steps

**Chrome**:
- Go to `chrome://settings/content/camera`
- Ensure the site is not blocked
- Clear site data and try again

**Firefox**:
- Go to `about:preferences#privacy`
- Scroll to Permissions section
- Check camera permissions

**Safari**:
- Go to Safari > Preferences > Websites > Camera
- Ensure camera access is allowed

#### Step 4: System-Level Checks
1. Check Device Manager (Windows) or System Information (Mac)
2. Verify camera is recognized by the system
3. Update camera drivers if needed

### Debug Information

The Test Camera page provides real-time debug information:
- **Available cameras**: Number of detected cameras
- **Selected camera**: Current camera selection
- **Video status**: On/Off state
- **Audio status**: Muted/Unmuted state
- **Loading status**: Camera initialization progress
- **Error details**: Specific error messages

### Best Practices

#### For Interviewers
- Test camera before starting interviews
- Use the Test Camera page to verify functionality
- Have a backup camera ready if possible
- Ensure stable internet connection

#### For Candidates
- Test camera in advance of interview
- Use a quiet, well-lit environment
- Close unnecessary applications
- Have a backup device ready

### Technical Details

#### Camera Initialization Process
1. **Permission Request**: Browser requests camera access
2. **Device Detection**: System scans for available cameras
3. **Stream Creation**: Creates video stream with selected camera
4. **Video Element**: Attaches stream to video element
5. **Error Handling**: Catches and reports any issues

#### Error Types Handled
- `NotAllowedError`: Permission denied
- `NotFoundError`: No camera found
- `NotReadableError`: Camera in use
- `OverconstrainedError`: Settings not supported
- `NotSupportedError`: Browser doesn't support camera

#### Retry Mechanism
- Automatic retry with default settings
- Manual retry button available
- Comprehensive error logging
- Graceful degradation

## Support

If you continue to experience camera issues:
1. Check the browser console for detailed error messages
2. Try using a different browser
3. Test with a different camera if available
4. Contact technical support with specific error details

## Development Notes

### Camera Hook Features
- `useCamera()` hook provides comprehensive camera management
- Automatic device detection and selection
- Real-time error handling and recovery
- Support for multiple camera switching
- Audio/video toggle controls

### Testing
- Use the Test Camera page for debugging
- Check browser console for detailed logs
- Monitor network tab for any connection issues
- Test with different camera configurations 