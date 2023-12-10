import sys
import colorama
from colorama import Back, Fore


class Logger:
    """
    A class to log messages with different colors and levels.

    Methods:
        info(message, sender): Log an info message with green color and optional sender name.
        warning(message, sender): Log a warning message with yellow color and optional sender name.
        error(message, sender): Log an error message with red color and optional sender name.
        status(message, override): Log a status message with blue color and optional override flag.
    """

    def __init__(self) -> None:
        """
        Initialize a Logger object.
        """
        # Call the init method of the colorama module with autoreset=True
        colorama.init(autoreset=True)

    @staticmethod
    def info(message, sender="") -> None:
        """
        Log an info message with green color and optional sender name.

        Args:
            message (str): The message to log.
            sender (str): The name of the sender of the message. Default to "".

        Returns:
            None
        """
        # Print the message with green color for the level, cyan color for the sender, and reset color for the message
        print(
            f"\r{Fore.GREEN}[INFO] - {Back.CYAN}{sender}{Back.RESET}: {message}{Fore.RESET}"
        )

    @staticmethod
    def warning(message, sender="") -> None:
        """
        Log a warning message with yellow color and optional sender name.

        Args:
            message (str): The message to log.
            sender (str): The name of the sender of the message. Default to "".

        Returns:
            None
        """
        # Print the message with yellow color for the level and the message, and reset color for the sender
        print(f"\r{Fore.YELLOW}[WARNING] - {sender}: {message}{Fore.RESET}")

    @staticmethod
    def error(message, sender="") -> None:
        """
        Log an error message with red color and optional sender name.

        Args:
            message (str): The message to log.
            sender (str): The name of the sender of the message. Default to "".

        Returns:
            None
        """
        # Print the message with red color for the level and the message, and reset color for the sender
        print(f"\r{Fore.RED}[ERROR] - {sender}: {message}{Fore.RESET}")

    @staticmethod
    def status(message, override=True) -> None:
        """
        Log a status message with blue color and optional override flag.

        Args:
            message (str): The message to log.
            override (bool): A flag to indicate whether to override the previous status message or not. Default to True.

        Returns:
            None
        """
        # Check if the override flag is True
        if override:
            # Write the message with blue color for the level and the message to the standard output
            sys.stdout.write(f"\r{Fore.BLUE}[STATUS]: {message}{Fore.RESET}")
            # Flush the standard output
            sys.stdout.flush()
        else:
            # Print the message with blue color for the level and the message
            print(f"\r{Fore.BLUE}[STATUS]: {message}{Fore.RESET}")
