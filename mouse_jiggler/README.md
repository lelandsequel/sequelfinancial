# Mouse Jiggler

A simple Python utility that keeps your computer active by moving the mouse slightly every 15 seconds.

## Features

- Prevents system from going to sleep or idle
- Minimal mouse movement (1 pixel) - barely noticeable
- Cross-platform (Windows, Mac, Linux)
- Easy to stop with Ctrl+C
- Lightweight and simple

## Installation

### Prerequisites
- Python 3.x installed on your system
- `pyautogui` package (will be installed automatically if missing)

### Quick Start

#### Windows Users
1. Make sure Python is installed (download from [python.org](https://python.org) if needed)
2. Double-click `run_mouse_jiggler.bat`
3. Press Ctrl+C to stop

#### Mac/Linux Users
1. Open Terminal
2. Run: `python3 mouse_jiggler.py`
3. Press Ctrl+C to stop

## How It Works

The script moves your mouse cursor 1 pixel to the right, then back to the original position every 15 seconds. This minimal movement is enough to prevent most systems from entering sleep/idle mode while being virtually unnoticeable during normal use.

## Use Cases

- Keeping your screen active during presentations
- Preventing system sleep during long downloads
- Maintaining active status during monitoring of long-running processes
- Personal productivity workflows

## Files Included

- `mouse_jiggler.py` - The main Python script
- `README.txt` - Original text instructions
- `run_mouse_jiggler.txt` - Additional run instructions

## License

This project is open source and available for personal use.