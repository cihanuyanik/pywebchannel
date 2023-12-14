# What is Python Web Channel❓

## Python Web Channel 🚀

`pywebchannel` is a tool that automatically generates TypeScript files for QWebChannel Python local backend. It
allows you to create a stunning UI for your Python project using web technologies such as HTML, CSS, and JavaScript.

With `pywebchannel`, you can:

- Write your backend logic in Python and use Qt (PySide6) for communication.
- Use QWebChannel to communicate with the web frontend and expose your Python objects and methods.
- Write your frontend UI in any web framework of your choice, such as vanilla JS, React, Solid, Vue, etc.
- Enjoy the benefits of TypeScript, such as type safety, code completion, and error detection.
- Save time and effort by automatically generating TypeScript interfaces from your Python code.

## Type-Script Generator ⚙️

The TypeScript Generator part of this library has a file watcher that translates Python code to TypeScript interfaces.
This enables safe and easy communication between your Python backend and your desired frontend (vanilla JS, React,
Solid,
Vue, etc.). To use the TypeScript Generator, run the `ts_generator.py` script and specify the folders that contain the
Python files you would like watch for auto-instant conversion.

## Controller Utilities

`pywebchannel` provides helpful classes, functions and decorators to generate proper controller classes which can be
exposed to a UI written by using web technologies. All given types are self documented and easy to follow.

[Documentation & API](https://pywebchannel.readthedocs.io)