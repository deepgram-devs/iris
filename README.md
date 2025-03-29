# Gnosis Slack App

 [![Discord](https://dcbadge.vercel.app/api/server/xWRaCDBtW4?style=flat)](https://discord.gg/xWRaCDBtW4)

This is a Slack application that allows you to query our Gnosis service directly from your Slack workspace.

Currently the application is in private beta during our early development stages. Stay tuned for an announcement in our community when this is publicly available for use!

## Development

> [!TIP]
> We use the 1Password CLI to manage secrets. If you do not have a 1Password account, you will want to install and load the `python-dotenv` package.

To get started, clone the repository and install the dependencies:

```py
pipenv install --dev
```

Then you can start the application in development (watch) mode:

```py
pipenv run dev
```

We expect that all contributions pass our linter and formatting requirements:

```py
pipenv run lint
pipenv run format # To automatically format all files
pipenv run format_check # To confirm formatting passes
```

Additionally, all changes should include comprehensive test coverage. Total coverage should never dip below 90%.

```py
pipenv run test
```

## Getting an API Key

🔑 To access the Deepgram API you will need a [free Deepgram API Key](https://console.deepgram.com/signup?jump=keys).

## Documentation

You can learn more about the Deepgram API at [developers.deepgram.com](https://developers.deepgram.com/docs).

## Development and Contributing

Interested in contributing? We ❤️ pull requests!

To make sure our community is safe for all, be sure to review and agree to our
[Code of Conduct](./.github/CODE_OF_CONDUCT.md). Then see the
[Contribution](./.github/CONTRIBUTING.md) guidelines for more information.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the
project, let us know! You can either:

- [Open an issue in this repository](https://github.com/deepgram/[reponame]/issues/new)
- [Join the Deepgram Github Discussions Community](https://github.com/orgs/deepgram/discussions)
- [Join the Deepgram Discord Community](https://discord.gg/xWRaCDBtW4)

[license]: LICENSE.txt