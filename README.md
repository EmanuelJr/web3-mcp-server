# Web3 MCP Server

A Model Context Protocol server implementation for Web3 interactions on EVM chains.

## Features

- Fetch token balances
- Call contract functions
- Support for multiple EVM chains

## Installation

Build the Docker image beforehand:

```sh
docker build -t web3-mcp-server .
```

### Claude Desktop

```json
{
  "mcpServers": {
    "web3": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "web3-mcp-server"]
    }
  }
}
```
