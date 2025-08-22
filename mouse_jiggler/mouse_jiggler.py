#!/usr/bin/env python3
import pyautogui
import time
import sys
import platform

# Disable pyautogui fail-safe on macOS
if platform.system() == "Darwin":
    pyautogui.FAILSAFE = False

def jiggle_mouse():
    """Move mouse slightly to keep system active"""
    try:
        while True:
            # Get current mouse position
            current_x, current_y = pyautogui.position()
            
            # Move mouse 1 pixel right, then back
            pyautogui.moveRel(1, 0, duration=0.1)
            time.sleep(0.1)
            pyautogui.moveRel(-1, 0, duration=0.1)
            
            print(f"Mouse jiggled at {time.strftime('%H:%M:%S')}")
            
            # Wait 15 seconds
            time.sleep(15)
            
    except KeyboardInterrupt:
        print("\nMouse jiggler stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("Starting mouse jiggler - press Ctrl+C to stop")
    print("Mouse will jiggle every 15 seconds")
    jiggle_mouse()