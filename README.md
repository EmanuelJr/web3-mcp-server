# Web3 MCP Server

[![smithery badge](https://smithery.ai/badge/web3-mcp-server)](https://smithery.ai/server/web3-mcp-server)

A Model Context Protocol (MCP) server implementation for Web3 interactions on EVM chains. This server enables seamless interaction with blockchain networks through the Model Context Protocol.

<a href="https://glama.ai/mcp/servers/@EmanuelJr/web3-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@EmanuelJr/web3-mcp-server/badge" alt="web3-mcp-server MCP server" />
</a>

## 🚀 Features

- 📊 Fetch token balances across multiple chains
- 📝 Call smart contract functions
- 🔗 Support for multiple EVM-compatible chains

## 🔧 Configuration

### Claude Desktop Integration

### Installing via Smithery

To install Web3 MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/web3-mcp-server):

```bash
npx -y @smithery/cli install web3-mcp-server --client claude
```

#### Using NPX

Add the following configuration to your Claude Desktop settings:

```json
{
  "mcpServers": {
    "web3": {
      "command": "npx",
      "args": ["-y", "web3-mcp-server"]
    }
  }
}
```

#### Using Docker

For Docker-based deployment, use this configuration:

```json
{
  "mcpServers": {
    "web3": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "emanueljr/web3-mcp-server"]
    }
  }
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.