### Comment counter


This extension will calculate the comment density by dividing the commented lines of code by the lines of code. This will help you
get an overview of how good a file is commented, thus ensuring you maintain your project's level of documentation.

![demo](https://raw.githubusercontent.com/realappie/vscode-doc-extension/master/assets/demo.gif)

#### Language support

This extension currently supports a lot of languages as listed [here](http://cloc.sourceforge.net/#Languages) but will only automatically* calculate comment density for the following languages

- Javascript
- Typescript

If you want your language to be automatically* calculated too, just open up an issue or create a PR and add the language to the `activationEvents` in the `package.json` file.

You can always press on the button in the statusbar to kick off the calculations.